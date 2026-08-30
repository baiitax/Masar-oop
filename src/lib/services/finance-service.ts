// MASAR Finance Service
import { supabase } from '@/lib/supabase/client';

class FinanceService {
  async getFundingRequests(transactionId?: string) {
    let query = supabase.from('funding_requests').select('*, applicant:applicant_organization_id(legal_name), provider:provider_id(legal_name)');
    if (transactionId) query = query.eq('transaction_id', transactionId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getEscrowRecords(transactionId: string) {
    const { data, error } = await supabase.from('escrow_records').select('*').eq('transaction_id', transactionId);
    if (error) throw error;
    return data;
  }

  async getSettlements(transactionId: string) {
    const { data, error } = await supabase.from('settlements').select('*, items:settlement_items(*)').eq('transaction_id', transactionId);
    if (error) throw error;
    return data;
  }

  async getFinanceSummary(transactionId: string) {
    const { data, error } = await supabase.from('v_finance_summary').select('*').eq('transaction_id', transactionId).single();
    if (error) throw error;
    return data;
  }

  async getFinanceDashboardKPIs() {
    const { data, error } = await supabase.from('v_dashboard_finance_kpis').select('*').single();
    if (error) throw error;
    return data;
  }
}

export const financeService = new FinanceService();
export default financeService;
