// MASAR Audit Service
import { supabase } from '@/lib/supabase/client';

class AuditService {
  async getAuditLogs(transactionId?: string, limit: number = 100) {
    let query = supabase.from('audit_logs').select('*, actor:actor_user_id(full_name, email), organization:actor_organization_id(legal_name)');
    if (transactionId) query = query.eq('transaction_id', transactionId);
    const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return data;
  }

  async getSystemEvents(limit: number = 100) {
    const { data, error } = await supabase.from('system_events').select('*').order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return data;
  }
}

export const auditService = new AuditService();
export default auditService;
