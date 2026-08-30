// MASAR Transaction Service
// Enterprise-grade transaction management

import { supabaseAdmin } from '@/lib/supabase/server';
import { createAuditLog, ErrorCodes } from '../middleware';
import { ApiError } from '../middleware';

export interface CreateTransactionInput {
  buyerOrganizationId: string;
  exporterOrganizationId: string;
  originCountry: string;
  destinationCountry: string;
  originLocation?: string;
  destinationLocation?: string;
  commodityId: string;
  laneId?: string;
  quantity: number;
  unit: string;
  currency: string;
  estimatedValue?: number;
  contractValue?: number;
  incoterm?: string;
}

export interface TransactionFilters {
  state?: string;
  buyerId?: string;
  exporterId?: string;
  commodityId?: string;
  riskLevel?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  cursor?: string;
}

class TransactionService {
  // ============================================================
  // CREATE TRANSACTION
  // ============================================================
  
  async createTransaction(
    input: CreateTransactionInput,
    userId: string,
    organizationId: string
  ) {
    // Validate organizations exist
    const { data: buyerOrg } = await supabaseAdmin
      .from('organizations')
      .select('id, status')
      .eq('id', input.buyerOrganizationId)
      .single();

    if (!buyerOrg || buyerOrg.status !== 'active') {
      throw { ...ErrorCodes.RESOURCE_NOT_FOUND, message: 'Buyer organization not found or inactive' } as ApiError;
    }

    const { data: exporterOrg } = await supabaseAdmin
      .from('organizations')
      .select('id, status')
      .eq('id', input.exporterOrganizationId)
      .single();

    if (!exporterOrg || exporterOrg.status !== 'active') {
      throw { ...ErrorCodes.RESOURCE_NOT_FOUND, message: 'Exporter organization not found or inactive' } as ApiError;
    }

    // Validate commodity
    const { data: commodity } = await supabaseAdmin
      .from('commodities')
      .select('id, code, status')
      .eq('id', input.commodityId)
      .single();

    if (!commodity || commodity.status !== 'active') {
      throw { ...ErrorCodes.RESOURCE_NOT_FOUND, message: 'Commodity not found or inactive' } as ApiError;
    }

    // Generate transaction number
    const { data: transactionNumber } = await supabaseAdmin
      .rpc('generate_transaction_number', {
        p_commodity_code: commodity.code,
      });

    // Create transaction
    const { data: transaction, error } = await supabaseAdmin
      .from('transactions')
      .insert({
        transaction_number: transactionNumber,
        transaction_type: 'COMMODITY_EXPORT',
        buyer_organization_id: input.buyerOrganizationId,
        exporter_organization_id: input.exporterOrganizationId,
        origin_country: input.originCountry,
        destination_country: input.destinationCountry,
        origin_location: input.originLocation,
        destination_location: input.destinationLocation,
        commodity_id: input.commodityId,
        lane_id: input.laneId,
        quantity: input.quantity,
        unit: input.unit,
        currency: input.currency,
        estimated_value: input.estimatedValue,
        contract_value: input.contractValue,
        incoterm: input.incoterm,
        current_state: 'DRAFT',
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      throw { ...ErrorCodes.INTERNAL_ERROR, message: 'Failed to create transaction' } as ApiError;
    }

    // Create initial protocol conditions
    await this.createInitialConditions(transaction.id, input.laneId);

    // Create audit log
    await createAuditLog(
      'transaction_created',
      'transaction',
      transaction.id,
      userId,
      organizationId,
      transaction.id,
      null,
      { transaction_number: transactionNumber }
    );

    // Create protocol event
    await supabaseAdmin.rpc('create_protocol_event', {
      p_transaction_id: transaction.id,
      p_event_type: 'TRANSACTION_CREATED',
      p_event_source: 'api',
      p_actor_user_id: userId,
      p_actor_organization_id: organizationId,
      p_payload: { transaction_number: transactionNumber },
    });

    return transaction;
  }

  // ============================================================
  // ADVANCE TRANSACTION STATE
  // ============================================================

  async advanceTransaction(
    transactionId: string,
    targetState: string,
    reason: string | undefined,
    userId: string,
    organizationId: string
  ) {
    // Get current transaction
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (txError || !transaction) {
      throw ErrorCodes.RESOURCE_NOT_FOUND as ApiError;
    }

    // Validate state transition
    const { data: validTransition } = await supabaseAdmin
      .from('transaction_state_transitions')
      .select('*')
      .eq('from_state', transaction.current_state)
      .eq('to_state', targetState)
      .eq('active', true)
      .single();

    if (!validTransition) {
      throw {
        ...ErrorCodes.INVALID_STATE_TRANSITION,
        details: {
          currentState: transaction.current_state,
          targetState,
        },
      } as ApiError;
    }

    // Check required permission
    if (validTransition.required_permission) {
      const { data: hasPermission } = await supabaseAdmin
        .rpc('user_has_permission', {
          permission_code: validTransition.required_permission,
        });

      if (!hasPermission) {
        throw ErrorCodes.PERMISSION_DENIED as ApiError;
      }
    }

    // Check human approval requirement
    if (validTransition.requires_human_approval) {
      const { data: approvals } = await supabaseAdmin
        .from('release_approvals')
        .select('*')
        .eq('transaction_id', transactionId)
        .eq('status', 'approved')
        .limit(validTransition.requires_dual_approval ? 2 : 1);

      const requiredCount = validTransition.requires_dual_approval ? 2 : 1;
      if (!approvals || approvals.length < requiredCount) {
        throw {
          ...ErrorCodes.HUMAN_APPROVAL_REQUIRED,
          message: validTransition.requires_dual_approval
            ? 'Dual approval required for this transition'
            : 'Human approval required for this transition',
        } as ApiError;
      }
    }

    // Perform state transition
    const { error: updateError } = await supabaseAdmin
      .from('transactions')
      .update({
        current_state: targetState,
        previous_state: transaction.current_state,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transactionId)
      .eq('current_state', transaction.current_state); // Optimistic locking

    if (updateError) {
      throw {
        ...ErrorCodes.CONCURRENT_MODIFICATION,
        message: 'Transaction was modified concurrently. Please refresh and try again.',
      } as ApiError;
    }

    // Create audit log
    await createAuditLog(
      'state_transition',
      'transaction',
      transactionId,
      userId,
      organizationId,
      transactionId,
      { current_state: transaction.current_state },
      { current_state: targetState }
    );

    // Create protocol event
    await supabaseAdmin.rpc('create_protocol_event', {
      p_transaction_id: transactionId,
      p_event_type: 'STATE_TRANSITION',
      p_event_source: 'api',
      p_actor_user_id: userId,
      p_actor_organization_id: organizationId,
      p_payload: {
        from_state: transaction.current_state,
        to_state: targetState,
        reason,
      },
    });

    // Return updated transaction
    const { data: updatedTransaction } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    return updatedTransaction;
  }

  // ============================================================
  // GET TRANSACTION
  // ============================================================

  async getTransaction(transactionId: string, userId: string, organizationId: string) {
    const { data: transaction, error } = await supabaseAdmin
      .from('transactions')
      .select(`
        *,
        buyer:buyer_organization_id(id, legal_name, country_code, organization_type),
        exporter:exporter_organization_id(id, legal_name, country_code, organization_type),
        commodity:commodity_id(id, code, name),
        lane:lane_id(id, code, name)
      `)
      .eq('id', transactionId)
      .is('deleted_at', null)
      .single();

    if (error || !transaction) {
      throw ErrorCodes.RESOURCE_NOT_FOUND as ApiError;
    }

    // Verify tenant access
    const hasAccess = 
      transaction.buyer_organization_id === organizationId ||
      transaction.exporter_organization_id === organizationId ||
      await this.checkAdminAccess(userId);

    if (!hasAccess) {
      throw ErrorCodes.TENANT_ACCESS_DENIED as ApiError;
    }

    return transaction;
  }

  // ============================================================
  // LIST TRANSACTIONS
  // ============================================================

  async listTransactions(
    filters: TransactionFilters,
    userId: string,
    organizationId: string
  ) {
    let query = supabaseAdmin
      .from('transactions')
      .select(`
        *,
        buyer:buyer_organization_id(id, legal_name),
        exporter:exporter_organization_id(id, legal_name),
        commodity:commodity_id(id, code, name)
      `)
      .is('deleted_at', null);

    // Apply tenant filter
    query = query.or(
      `buyer_organization_id.eq.${organizationId},exporter_organization_id.eq.${organizationId}`
    );

    // Apply filters
    if (filters.state) {
      query = query.eq('current_state', filters.state);
    }
    if (filters.buyerId) {
      query = query.eq('buyer_organization_id', filters.buyerId);
    }
    if (filters.exporterId) {
      query = query.eq('exporter_organization_id', filters.exporterId);
    }
    if (filters.commodityId) {
      query = query.eq('commodity_id', filters.commodityId);
    }
    if (filters.riskLevel) {
      query = query.eq('risk_level', filters.riskLevel);
    }
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    // Apply cursor pagination
    if (filters.cursor) {
      query = query.lt('created_at', filters.cursor);
    }

    // Apply limit
    const limit = Math.min(filters.limit || 25, 100);
    query = query
      .order('created_at', { ascending: false })
      .limit(limit + 1); // Fetch one extra to check hasMore

    const { data: transactions, error } = await query;

    if (error) {
      throw ErrorCodes.INTERNAL_ERROR as ApiError;
    }

    const hasMore = transactions.length > limit;
    const data = hasMore ? transactions.slice(0, limit) : transactions;
    const nextCursor = hasMore ? data[data.length - 1]?.created_at : undefined;

    return {
      data,
      pagination: {
        nextCursor,
        hasMore,
      },
    };
  }

  // ============================================================
  // GET CLEARANCE READINESS
  // ============================================================

  async getClearanceReadiness(transactionId: string) {
    const { data: readiness } = await supabaseAdmin
      .from('v_release_readiness')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (!readiness) {
      throw ErrorCodes.RESOURCE_NOT_FOUND as ApiError;
    }

    // Get detailed conditions
    const { data: conditions } = await supabaseAdmin
      .from('protocol_conditions')
      .select('*')
      .eq('transaction_id', transactionId);

    // Calculate component scores
    const components = {
      kyb: await this.checkKYBStatus(transactionId),
      compliance: await this.checkComplianceStatus(transactionId),
      documents: await this.checkDocumentStatus(transactionId),
      inspection: await this.checkInspectionStatus(transactionId),
      finance: await this.checkFinanceStatus(transactionId),
      shipment: await this.checkShipmentStatus(transactionId),
    };

    const blockers = Object.entries(components)
      .filter(([_, status]) => status !== 'PASSED' && status !== 'SATISFIED')
      .map(([key, status]) => ({
        code: `${key.toUpperCase()}_PENDING`,
        severity: status === 'FAILED' || status === 'BLOCKED' ? 'CRITICAL' : 'HIGH',
        component: key,
        status,
      }));

    return {
      score: readiness.readiness_score || 0,
      status: blockers.length === 0 ? 'READY' : 'BLOCKED',
      conditions: readiness,
      components,
      blockers,
      satisfiedConditions: readiness.satisfied_conditions || 0,
      totalConditions: readiness.total_conditions || 0,
    };
  }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  private async createInitialConditions(transactionId: string, laneId?: string) {
    const conditions = [
      { code: 'BUYER_KYB_APPROVED', name: 'Buyer KYB Approved', category: 'identity', required: true },
      { code: 'EXPORTER_KYB_APPROVED', name: 'Exporter KYB Approved', category: 'identity', required: true },
      { code: 'CONTRACT_EXECUTED', name: 'Contract Executed', category: 'commercial', required: true },
      { code: 'COMPLIANCE_COMPLETE', name: 'Compliance Complete', category: 'compliance', required: true },
      { code: 'INSPECTION_PASSED', name: 'Inspection Passed', category: 'quality', required: true },
      { code: 'QUALITY_ACCEPTED', name: 'Quality Accepted', category: 'quality', required: true },
      { code: 'FUNDS_CONFIRMED', name: 'Funds Confirmed', category: 'finance', required: true },
      { code: 'SHIPMENT_VERIFIED', name: 'Shipment Verified', category: 'logistics', required: false },
      { code: 'PORT_VERIFIED', name: 'Port Verified', category: 'logistics', required: false },
      { code: 'FINAL_DOCUMENTS_COMPLETE', name: 'Final Documents Complete', category: 'compliance', required: false },
    ];

    for (const condition of conditions) {
      await supabaseAdmin.from('protocol_conditions').insert({
        transaction_id: transactionId,
        condition_code: condition.code,
        condition_name: condition.name,
        category: condition.category,
        status: 'pending',
        required: condition.required,
      });
    }
  }

  private async checkAdminAccess(userId: string): Promise<boolean> {
    const { data } = await supabaseAdmin
      .from('organization_members')
      .select('roles:role_id(code)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .in('roles.code', ['SUPER_ADMIN', 'OPERATIONS', 'COMPLIANCE', 'AUDITOR']);

    return (data?.length || 0) > 0;
  }

  private async checkKYBStatus(transactionId: string): Promise<string> {
    const { data: transaction } = await supabaseAdmin
      .from('transactions')
      .select('buyer_organization_id, exporter_organization_id')
      .eq('id', transactionId)
      .single();

    if (!transaction) return 'UNKNOWN';

    const { data: buyerKYB } = await supabaseAdmin
      .from('kyb_cases')
      .select('status')
      .eq('organization_id', transaction.buyer_organization_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: exporterKYB } = await supabaseAdmin
      .from('kyb_cases')
      .select('status')
      .eq('organization_id', transaction.exporter_organization_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (buyerKYB?.status === 'approved' && exporterKYB?.status === 'approved') {
      return 'PASSED';
    }
    if (buyerKYB?.status === 'rejected' || exporterKYB?.status === 'rejected') {
      return 'FAILED';
    }
    return 'PENDING';
  }

  private async checkComplianceStatus(transactionId: string): Promise<string> {
    const { data } = await supabaseAdmin
      .from('compliance_cases')
      .select('status')
      .eq('transaction_id', transactionId)
      .single();

    if (!data) return 'NOT_STARTED';
    if (data.status === 'ready') return 'PASSED';
    if (data.status === 'exception' || data.status === 'blocked') return 'BLOCKED';
    return 'PENDING';
  }

  private async checkDocumentStatus(transactionId: string): Promise<string> {
    const { count: totalRequired } = await supabaseAdmin
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('transaction_id', transactionId)
      .eq('required', true)
      .is('deleted_at', null);

    const { count: verified } = await supabaseAdmin
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('transaction_id', transactionId)
      .eq('status', 'verified')
      .is('deleted_at', null);

    if (!totalRequired || totalRequired === 0) return 'SATISFIED';
    if (verified === totalRequired) return 'PASSED';
    return 'PENDING';
  }

  private async checkInspectionStatus(transactionId: string): Promise<string> {
    const { data } = await supabaseAdmin
      .from('inspections')
      .select('status, result')
      .eq('transaction_id', transactionId)
      .single();

    if (!data) return 'NOT_STARTED';
    if (data.status === 'passed') return 'PASSED';
    if (data.status === 'failed') return 'FAILED';
    return 'PENDING';
  }

  private async checkFinanceStatus(transactionId: string): Promise<string> {
    const { data } = await supabaseAdmin
      .from('escrow_records')
      .select('status')
      .eq('transaction_id', transactionId)
      .single();

    if (!data) return 'NOT_STARTED';
    if (data.status === 'funded') return 'PASSED';
    return 'PENDING';
  }

  private async checkShipmentStatus(transactionId: string): Promise<string> {
    const { data } = await supabaseAdmin
      .from('shipments')
      .select('status')
      .eq('transaction_id', transactionId)
      .single();

    if (!data) return 'NOT_STARTED';
    if (['in_transit', 'arrived', 'discharged', 'customs_cleared', 'delivered'].includes(data.status)) {
      return 'PASSED';
    }
    return 'PENDING';
  }
}

export const transactionService = new TransactionService();
export default transactionService;
