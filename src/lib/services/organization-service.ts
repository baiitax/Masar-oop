// MASAR Organization Service
import { supabase } from '@/lib/supabase/client';

class OrganizationService {
  async getOrganizations(type?: string) {
    let query = supabase.from('organizations').select('*').is('deleted_at', null);
    if (type) query = query.eq('organization_type', type);
    const { data, error } = await query.order('legal_name');
    if (error) throw error;
    return data;
  }

  async getOrganization(id: string) {
    const { data, error } = await supabase.from('organizations').select('*, members:organization_members(user_id, role_id, roles(code, name), profiles(full_name, email))').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async getOrganizationMembers(organizationId: string) {
    const { data, error } = await supabase.from('organization_members').select('*, user:profiles(full_name, email, job_title), role:roles(code, name)').eq('organization_id', organizationId).eq('status', 'active');
    if (error) throw error;
    return data;
  }
}

export const organizationService = new OrganizationService();
export default organizationService;
