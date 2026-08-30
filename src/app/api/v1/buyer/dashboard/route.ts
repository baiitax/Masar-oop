// MASAR API - Buyer Dashboard Aggregate Endpoint
import { NextRequest } from 'next/server';
import { executeMiddlewareChain, requireAuth, rateLimit, successResponse, errorResponse, ErrorCodes } from '@/lib/api/middleware';
import { supabaseAdmin } from '@/lib/supabase/server';
import { apiConfig } from '@/lib/api/config';

export async function GET(request: NextRequest) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const organizationId = user!.currentOrganization?.id;
    if (!organizationId) {
      return errorResponse(ErrorCodes.TENANT_ACCESS_DENIED, context.requestId);
    }

    // Load all buyer dashboard sections in parallel
    const [kpis, transactions, actions, milestones, shipments, finance, exceptions, activity] = await Promise.allSettled([
      getBuyerKPIs(organizationId),
      getActiveTransactions(organizationId),
      getRequiredActions(organizationId, user!.id),
      getUpcomingMilestones(organizationId),
      getShipmentTracking(organizationId),
      getFinancialSummary(organizationId),
      getExceptions(organizationId),
      getRecentActivity(organizationId),
    ]);

    return successResponse({
      kpis: kpis.status === 'fulfilled' ? kpis.value : null,
      transactions: transactions.status === 'fulfilled' ? transactions.value : [],
      actions: actions.status === 'fulfilled' ? actions.value : [],
      milestones: milestones.status === 'fulfilled' ? milestones.value : [],
      shipments: shipments.status === 'fulfilled' ? shipments.value : [],
      finance: finance.status === 'fulfilled' ? finance.value : null,
      exceptions: exceptions.status === 'fulfilled' ? exceptions.value : [],
      activity: activity.status === 'fulfilled' ? activity.value : [],
      accountHealth: await getAccountHealth(organizationId),
    }, {
      requestId: context.requestId,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Buyer dashboard error:', err);
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}

// ============================================================
// BUYER KPI FUNCTIONS
// ============================================================

async function getBuyerKPIs(organizationId: string) {
  const [transactions, funding, shipments, settlements] = await Promise.all([
    supabaseAdmin
      .from('transactions')
      .select('current_state, contract_value, estimated_value')
      .eq('buyer_organization_id', organizationId)
      .is('deleted_at', null),
    supabaseAdmin
      .from('funding_requests')
      .select('status, requested_amount, approved_amount')
      .eq('applicant_organization_id', organizationId),
    supabaseAdmin
      .from('shipments')
      .select('status')
      .in('transaction_id', 
        supabaseAdmin
          .from('transactions')
          .select('id')
          .eq('buyer_organization_id', organizationId)
      ),
    supabaseAdmin
      .from('settlements')
      .select('status, gross_amount')
      .in('transaction_id',
        supabaseAdmin
          .from('transactions')
          .select('id')
          .eq('buyer_organization_id', organizationId)
      ),
  ]);

  const txData = transactions.data || [];
  const activeStates = ['DRAFT', 'RFQ', 'BUYER_VERIFIED', 'EXPORTER_VERIFIED', 'COMMERCIAL_MATCH', 'CONTRACTED', 'COMPLIANCE_REVIEW', 'COMPLIANCE_READY', 'INSPECTION_PENDING', 'INSPECTION_IN_PROGRESS', 'INSPECTION_PASSED', 'FINANCE_PENDING', 'FINANCE_APPROVED', 'FUNDS_SECURED', 'SHIPMENT_READY', 'IN_TRANSIT', 'ARRIVED', 'PORT_VERIFIED', 'RELEASE_ELIGIBLE', 'RELEASE_APPROVAL', 'SETTLEMENT'];
  
  const activeTransactions = txData.filter(t => activeStates.includes(t.current_state));
  const totalPurchaseValue = txData.reduce((sum, t) => sum + (t.contract_value || t.estimated_value || 0), 0);
  const committedValue = activeTransactions.reduce((sum, t) => sum + (t.contract_value || 0), 0);
  
  const fundingData = funding.data || [];
  const pendingPayments = fundingData.filter(f => f.status === 'requested').reduce((sum, f) => sum + (f.requested_amount || 0), 0);
  
  const shipmentData = shipments.data || [];
  const inTransitShipments = shipmentData.filter(s => s.status === 'in_transit').length;
  
  const settlementData = settlements.data || [];
  const completedPurchases = settlementData.filter(s => s.status === 'completed').length;

  return {
    activeTransactions: activeTransactions.length,
    totalPurchaseValue,
    pendingRequests: fundingData.filter(f => f.status === 'requested').length,
    committedValue,
    pendingPayments,
    inTransitShipments,
    completedPurchases,
    completionRate: txData.length > 0 ? Math.round((settlementData.filter(s => s.status === 'completed').length / txData.length) * 100) : 0,
  };
}

async function getActiveTransactions(organizationId: string) {
  const { data: transactions } = await supabaseAdmin
    .from('transactions')
    .select(`
      id,
      transaction_number,
      current_state,
      contract_value,
      estimated_value,
      currency,
      quantity,
      unit,
      created_at,
      updated_at,
      exporter:exporter_organization_id(legal_name),
      commodity:commodity_id(name, code)
    `)
    .eq('buyer_organization_id', organizationId)
    .not('current_state', 'in', '(COMPLETED,CANCELLED)')
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
    .limit(20);

  return (transactions || []).map(tx => ({
    id: tx.id,
    transactionNumber: tx.transaction_number,
    currentState: tx.current_state,
    value: tx.contract_value || tx.estimated_value || 0,
    currency: tx.currency,
    quantity: tx.quantity,
    unit: tx.unit,
    exporter: (tx.exporter as any)?.legal_name || 'Unknown',
    commodity: (tx.commodity as any)?.name || 'Unknown',
    commodityCode: (tx.commodity as any)?.code,
    progress: calculateProgress(tx.current_state),
    lastUpdated: tx.updated_at,
    createdAt: tx.created_at,
  }));
}

async function getRequiredActions(organizationId: string, userId: string) {
  const actions = [];

  // Pending document uploads
  const { data: pendingDocs } = await supabaseAdmin
    .from('documents')
    .select('id, document_type, transaction_id, transaction:transaction_id(transaction_number)')
    .eq('organization_id', organizationId)
    .in('status', ['expected', 'missing'])
    .is('deleted_at', null)
    .limit(10);

  if (pendingDocs?.length) {
    actions.push(...pendingDocs.map(d => ({
      type: 'DOCUMENT_UPLOAD',
      priority: 'high',
      title: `Upload ${(d.transaction as any)?.transaction_number || 'document'}`,
      description: `${d.document_type.replace(/_/g, ' ')} required`,
      transactionId: d.transaction_id,
      transactionNumber: (d.transaction as any)?.transaction_number,
      dueDate: null,
      action: 'Upload Document',
    })));
  }

  // Pending approvals
  const { data: pendingApprovals } = await supabaseAdmin
    .from('tasks')
    .select('id, title, description, transaction_id, transaction:transaction_id(transaction_number), due_at')
    .eq('assigned_to', userId)
    .eq('status', 'pending')
    .is('deleted_at', null)
    .limit(5);

  if (pendingApprovals?.length) {
    actions.push(...pendingApprovals.map(t => ({
      type: 'APPROVAL',
      priority: 'medium',
      title: t.title,
      description: t.description,
      transactionId: t.transaction_id,
      transactionNumber: (t.transaction as any)?.transaction_number,
      dueDate: t.due_at,
      action: 'Review',
    })));
  }

  // KYB renewal
  const { data: kybCases } = await supabaseAdmin
    .from('kyb_cases')
    .select('id, status, next_review_date')
    .eq('organization_id', organizationId)
    .eq('status', 'approved')
    .limit(1);

  if (kybCases?.length && kybCases[0].next_review_date) {
    const reviewDate = new Date(kybCases[0].next_review_date);
    const daysUntilReview = Math.ceil((reviewDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilReview <= 30) {
      actions.push({
        type: 'KYB_RENEWAL',
        priority: daysUntilReview <= 7 ? 'critical' : 'high',
        title: 'KYB Renewal Required',
        description: `Your KYB verification expires in ${daysUntilReview} days`,
        dueDate: kybCases[0].next_review_date,
        action: 'Renew KYB',
      });
    }
  }

  return actions.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (priorityOrder[a.priority as keyof typeof priorityOrder] || 4) - 
           (priorityOrder[b.priority as keyof typeof priorityOrder] || 4);
  });
}

async function getUpcomingMilestones(organizationId: string) {
  const milestones = [];

  // Upcoming inspections
  const { data: inspections } = await supabaseAdmin
    .from('inspections')
    .select('id, scheduled_at, transaction_id, transaction:transaction_id(transaction_number)')
    .in('status', ['scheduled', 'accepted'])
    .gte('scheduled_at', new Date().toISOString())
    .limit(5);

  if (inspections?.length) {
    milestones.push(...inspections.map(i => ({
      type: 'INSPECTION',
      title: 'Inspection Scheduled',
      description: `Transaction ${(i.transaction as any)?.transaction_number}`,
      date: i.scheduled_at,
      daysUntil: Math.ceil((new Date(i.scheduled_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    })));
  }

  // Expiring documents
  const { data: expiringDocs } = await supabaseAdmin
    .from('documents')
    .select('id, document_type, expires_at, transaction_id, transaction:transaction_id(transaction_number)')
    .eq('organization_id', organizationId)
    .not('expires_at', 'is', null)
    .gte('expires_at', new Date().toISOString())
    .lte('expires_at', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
    .is('deleted_at', null)
    .limit(5);

  if (expiringDocs?.length) {
    milestones.push(...expiringDocs.map(d => ({
      type: 'DOCUMENT_EXPIRY',
      title: 'Document Expiring',
      description: `${d.document_type.replace(/_/g, ' ')} for ${(d.transaction as any)?.transaction_number}`,
      date: d.expires_at,
      daysUntil: Math.ceil((new Date(d.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    })));
  }

  // Upcoming shipments
  const { data: shipments } = await supabaseAdmin
    .from('shipments')
    .select('id, estimated_arrival, transaction_id, transaction:transaction_id(transaction_number)')
    .in('status', ['in_transit', 'departed'])
    .not('estimated_arrival', 'is', null)
    .limit(5);

  if (shipments?.length) {
    milestones.push(...shipments.map(s => ({
      type: 'SHIPMENT_ARRIVAL',
      title: 'Shipment Arriving',
      description: `Transaction ${(s.transaction as any)?.transaction_number}`,
      date: s.estimated_arrival,
      daysUntil: Math.ceil((new Date(s.estimated_arrival).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    })));
  }

  return milestones
    .filter(m => m.daysUntil >= 0 && m.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 10);
}

async function getShipmentTracking(organizationId: string) {
  const { data: shipments } = await supabaseAdmin
    .from('shipments')
    .select(`
      id,
      shipment_reference,
      status,
      carrier,
      vessel,
      origin_port,
      destination_port,
      estimated_departure,
      actual_departure,
      estimated_arrival,
      actual_arrival,
      transaction_id,
      transaction:transaction_id(transaction_number)
    `)
    .in('transaction_id',
      supabaseAdmin
        .from('transactions')
        .select('id')
        .eq('buyer_organization_id', organizationId)
    )
    .not('status', 'in', '(delivered,not_started)')
    .order('estimated_arrival', { ascending: true })
    .limit(10);

  return (shipments || []).map(s => ({
    id: s.id,
    reference: s.shipment_reference,
    status: s.status,
    carrier: s.carrier,
    vessel: s.vessel,
    origin: s.origin_port,
    destination: s.destination_port,
    eta: s.estimated_arrival,
    transactionNumber: (s.transaction as any)?.transaction_number,
    progress: calculateShipmentProgress(s.status),
  }));
}

async function getFinancialSummary(organizationId: string) {
  const [invoices, settlements] = await Promise.all([
    supabaseAdmin
      .from('invoices')
      .select('status, total, currency')
      .eq('recipient_organization_id', organizationId)
      .is('deleted_at', null),
    supabaseAdmin
      .from('settlements')
      .select('status, gross_amount, currency')
      .in('transaction_id',
        supabaseAdmin
          .from('transactions')
          .select('id')
          .eq('buyer_organization_id', organizationId)
      ),
  ]);

  const invoiceData = invoices.data || [];
  const settlementData = settlements.data || [];

  return {
    totalInvoiced: invoiceData.reduce((sum, i) => sum + (i.total || 0), 0),
    paidAmount: invoiceData.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || 0), 0),
    pendingAmount: invoiceData.filter(i => ['issued', 'sent', 'overdue'].includes(i.status)).reduce((sum, i) => sum + (i.total || 0), 0),
    overdueAmount: invoiceData.filter(i => i.status === 'overdue').reduce((sum, i) => sum + (i.total || 0), 0),
    settlementsCompleted: settlementData.filter(s => s.status === 'completed').length,
    settlementsPending: settlementData.filter(s => s.status === 'pending').length,
  };
}

async function getExceptions(organizationId: string) {
  const { data: exceptions } = await supabaseAdmin
    .from('exceptions')
    .select(`
      id,
      exception_type,
      severity,
      status,
      description,
      created_at,
      transaction_id,
      transaction:transaction_id(transaction_number, contract_value)
    `)
    .in('transaction_id',
      supabaseAdmin
        .from('transactions')
        .select('id')
        .eq('buyer_organization_id', organizationId)
    )
    .in('status', ['open', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(10);

  return (exceptions || []).map(e => ({
    id: e.id,
    type: e.exception_type,
    severity: e.severity,
    status: e.status,
    description: e.description,
    transactionNumber: (e.transaction as any)?.transaction_number,
    value: (e.transaction as any)?.contract_value || 0,
    createdAt: e.created_at,
    age: Math.round((Date.now() - new Date(e.created_at).getTime()) / (1000 * 60 * 60)),
  }));
}

async function getRecentActivity(organizationId: string) {
  const { data: events } = await supabaseAdmin
    .from('protocol_events')
    .select(`
      id,
      event_type,
      occurred_at,
      transaction_id,
      transaction:transaction_id(transaction_number),
      actor:actor_user_id(full_name)
    `)
    .in('transaction_id',
      supabaseAdmin
        .from('transactions')
        .select('id')
        .eq('buyer_organization_id', organizationId)
    )
    .order('occurred_at', { ascending: false })
    .limit(15);

  return (events || []).map(e => ({
    id: e.id,
    type: e.event_type,
    transactionNumber: (e.transaction as any)?.transaction_number,
    actor: (e.actor as any)?.full_name || 'System',
    timestamp: e.occurred_at,
  }));
}

async function getAccountHealth(organizationId: string) {
  const [kyb, compliance] = await Promise.all([
    supabaseAdmin
      .from('kyb_cases')
      .select('status, next_review_date')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single(),
    supabaseAdmin
      .from('documents')
      .select('status')
      .eq('organization_id', organizationId)
      .is('deleted_at', null),
  ]);

  const kybStatus = kyb.data?.status || 'not_started';
  const kybExpiring = kyb.data?.next_review_date 
    ? Math.ceil((new Date(kyb.data.next_review_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 30
    : false;

  const docs = compliance.data || [];
  const expiringDocs = docs.filter(d => d.status === 'expiring').length;
  const missingDocs = docs.filter(d => ['expected', 'missing'].includes(d.status)).length;

  return {
    kybStatus,
    kybExpiring,
    documentIssues: expiringDocs + missingDocs,
    verified: kybStatus === 'approved' && missingDocs === 0,
    warnings: [
      ...(kybExpiring ? ['KYB renewal required'] : []),
      ...(expiringDocs > 0 ? [`${expiringDocs} documents expiring`] : []),
      ...(missingDocs > 0 ? [`${missingDocs} documents missing`] : []),
    ],
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function calculateProgress(state: string): number {
  const stateProgress: Record<string, number> = {
    'DRAFT': 5, 'RFQ': 10,
    'BUYER_VERIFIED': 15, 'EXPORTER_VERIFIED': 20,
    'COMMERCIAL_MATCH': 25, 'CONTRACTED': 30,
    'COMPLIANCE_REVIEW': 40, 'COMPLIANCE_READY': 50,
    'INSPECTION_PENDING': 55, 'INSPECTION_IN_PROGRESS': 60, 'INSPECTION_PASSED': 65,
    'FINANCE_PENDING': 70, 'FINANCE_APPROVED': 75, 'FUNDS_SECURED': 80,
    'SHIPMENT_READY': 82, 'IN_TRANSIT': 85, 'ARRIVED': 88, 'PORT_VERIFIED': 90,
    'RELEASE_ELIGIBLE': 92, 'RELEASE_APPROVAL': 95, 'SETTLEMENT': 98, 'COMPLETED': 100,
  };
  return stateProgress[state] || 0;
}

function calculateShipmentProgress(status: string): number {
  const statusProgress: Record<string, number> = {
    'booked': 10, 'gate_in': 20, 'loaded': 30, 'departed': 40,
    'in_transit': 60, 'arrived': 80, 'discharged': 85, 'customs_cleared': 90, 'delivered': 100,
  };
  return statusProgress[status] || 0;
}
