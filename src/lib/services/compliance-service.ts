// MASAR Compliance Service
// Service layer for compliance operations

import { supabase } from '@/lib/supabase/client';

export interface ComplianceCase {
  id: string;
  transaction_id: string;
  organization_id: string;
  lane_id: string | null;
  status: string;
  risk_level: string;
  readiness_score: number;
  assigned_to: string | null;
  due_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComplianceRequirement {
  id: string;
  lane_id: string;
  document_type: string;
  requirement_name: string;
  required: boolean;
  validity_period: string | null;
  renewal_days: number | null;
  release_critical: boolean;
}

class ComplianceService {
  // Get compliance cases
  async getComplianceCases(filters?: { status?: string; transaction_id?: string }) {
    let query = supabase
      .from('compliance_cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.transaction_id) {
      query = query.eq('transaction_id', filters.transaction_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Get compliance status view
  async getComplianceStatus(transactionId: string) {
    const { data, error } = await supabase
      .from('v_compliance_status')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (error) throw error;
    return data;
  }

  // Get compliance requirements for lane
  async getComplianceRequirements(laneId: string) {
    const { data, error } = await supabase
      .from('compliance_requirements')
      .select('*')
      .eq('lane_id', laneId)
      .eq('active', true)
      .order('document_type');

    if (error) throw error;
    return data;
  }

  // Get compliance dashboard KPIs
  async getComplianceDashboardKPIs() {
    const { data, error } = await supabase
      .from('v_dashboard_compliance_kpis')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
}

export const complianceService = new ComplianceService();
export default complianceService;
