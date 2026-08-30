// MASAR Inspection Service
import { supabase } from '@/lib/supabase/client';

class InspectionService {
  async getInspections(transactionId?: string) {
    let query = supabase.from('inspections').select('*, provider:provider_id(legal_name), inspector:inspector_id(full_name)');
    if (transactionId) query = query.eq('transaction_id', transactionId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getInspection(id: string) {
    const { data, error } = await supabase
      .from('inspections')
      .select('*, provider:provider_id(*), samples(*, lab_results(*)), quality_results(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async getInspectionSummary(id: string) {
    const { data, error } = await supabase.from('v_inspection_summary').select('*').eq('inspection_id', id).single();
    if (error) throw error;
    return data;
  }
}

export const inspectionService = new InspectionService();
export default inspectionService;
