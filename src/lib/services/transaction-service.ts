// MASAR Transaction Service
// Service layer for transaction operations

import { supabase, getCurrentUser } from '@/lib/supabase/client';

export interface Transaction {
  id: string;
  transaction_number: string;
  transaction_type: string;
  buyer_organization_id: string;
  exporter_organization_id: string;
  origin_country: string;
  destination_country: string;
  commodity_id: string;
  quantity: number;
  unit: string;
  currency: string;
  estimated_value: number;
  contract_value: number;
  current_state: string;
  risk_level: string;
  clearance_readiness_score: number;
  confidence_score: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  // Joined data
  buyer?: { legal_name: string; country_code: string };
  exporter?: { legal_name: string; country_code: string };
  commodity?: { name: string; code: string };
  lane?: { code: string; name: string };
}

export interface CreateTransactionInput {
  buyer_organization_id: string;
  exporter_organization_id: string;
  origin_country: string;
  destination_country: string;
  commodity_id: string;
  lane_id?: string;
  quantity: number;
  unit?: string;
  currency?: string;
  estimated_value?: number;
  incoterm?: string;
}

export interface TransactionListFilters {
  state?: string;
  buyer_id?: string;
  exporter_id?: string;
  commodity_id?: string;
  risk_level?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  cursor?: string;
}

class TransactionService {
  // Get transactions with filters
  async getTransactions(filters?: TransactionListFilters) {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        buyer:buyer_organization_id(legal_name, country_code),
        exporter:exporter_organization_id(legal_name, country_code),
        commodity:commodity_id(name, code),
        lane:lane_id(code, name)
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (filters?.state) {
      query = query.eq('current_state', filters.state);
    }
    if (filters?.buyer_id) {
      query = query.eq('buyer_organization_id', filters.buyer_id);
    }
    if (filters?.exporter_id) {
      query = query.eq('exporter_organization_id', filters.exporter_id);
    }
    if (filters?.commodity_id) {
      query = query.eq('commodity_id', filters.commodity_id);
    }
    if (filters?.risk_level) {
      query = query.eq('risk_level', filters.risk_level);
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Get single transaction
  async getTransaction(id: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        buyer:buyer_organization_id(*),
        exporter:exporter_organization_id(*),
        commodity:commodity_id(*),
        lane:lane_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get transaction by number
  async getTransactionByNumber(transactionNumber: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        buyer:buyer_organization_id(*),
        exporter:exporter_organization_id(*),
        commodity:commodity_id(*),
        lane:lane_id(*)
      `)
      .eq('transaction_number', transactionNumber)
      .single();

    if (error) throw error;
    return data;
  }

  // Create transaction
  async createTransaction(input: CreateTransactionInput) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .rpc('create_transaction', {
        p_buyer_organization_id: input.buyer_organization_id,
        p_exporter_organization_id: input.exporter_organization_id,
        p_origin_country: input.origin_country,
        p_destination_country: input.destination_country,
        p_commodity_id: input.commodity_id,
        p_lane_id: input.lane_id || null,
        p_quantity: input.quantity,
        p_unit: input.unit || 'MT',
        p_currency: input.currency || 'USD',
        p_estimated_value: input.estimated_value || null,
        p_incoterm: input.incoterm || null,
      });

    if (error) throw error;
    return data;
  }

  // Get transaction timeline
  async getTransactionTimeline(transactionId: string) {
    const { data, error } = await supabase
      .from('protocol_events')
      .select(`
        *,
        actor:actor_user_id(full_name, email),
        organization:actor_organization_id(legal_name)
      `)
      .eq('transaction_id', transactionId)
      .order('occurred_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Get transaction conditions
  async getTransactionConditions(transactionId: string) {
    const { data, error } = await supabase
      .from('protocol_conditions')
      .select('*')
      .eq('transaction_id', transactionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Get transaction documents
  async getTransactionDocuments(transactionId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('transaction_id', transactionId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get transaction tasks
  async getTransactionTasks(transactionId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_user:assigned_to(full_name, email)
      `)
      .eq('transaction_id', transactionId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get transaction exceptions
  async getTransactionExceptions(transactionId: string) {
    const { data, error } = await supabase
      .from('exceptions')
      .select(`
        *,
        assigned_user:assigned_to(full_name, email),
        assigned_org:assigned_organization_id(legal_name)
      `)
      .eq('transaction_id', transactionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get transaction audit logs
  async getTransactionAuditLogs(transactionId: string) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        actor:actor_user_id(full_name, email),
        organization:actor_organization_id(legal_name)
      `)
      .eq('transaction_id', transactionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Get dashboard KPIs
  async getDashboardKPIs() {
    const { data, error } = await supabase
      .from('v_dashboard_transaction_kpis')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  // Get release readiness
  async getReleaseReadiness(transactionId: string) {
    const { data, error } = await supabase
      .from('v_release_readiness')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (error) throw error;
    return data;
  }

  // Get transaction summary view
  async getTransactionSummary(transactionId: string) {
    const { data, error } = await supabase
      .from('v_transaction_summary')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) throw error;
    return data;
  }

  // Search transactions
  async searchTransactions(query: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        transaction_number,
        current_state,
        buyer:buyer_organization_id(legal_name),
        exporter:exporter_organization_id(legal_name),
        commodity:commodity_id(name)
      `)
      .or(`transaction_number.ilike.%${query}%`)
      .is('deleted_at', null)
      .limit(limit);

    if (error) throw error;
    return data;
  }
}

export const transactionService = new TransactionService();
export default transactionService;
