// MASAR KYB Service
// Service layer for KYB operations

import { supabase, getCurrentUser } from '@/lib/supabase/client';

export interface KYBCase {
  id: string;
  organization_id: string;
  transaction_id: string | null;
  case_number: string;
  status: string;
  decision: string | null;
  risk_level: string;
  risk_score: number | null;
  risk_breakdown: Record<string, any>;
  submitted_at: string | null;
  completed_at: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
  next_review_date: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  organization?: { legal_name: string; organization_type: string };
  checks?: KYBCheck[];
  screening_matches?: ScreeningMatch[];
}

export interface KYBCheck {
  id: string;
  kyb_case_id: string;
  check_type: string;
  provider: string | null;
  status: string;
  result: string | null;
  confidence: number | null;
  reference_id: string | null;
  checked_at: string | null;
  expires_at: string | null;
}

export interface ScreeningMatch {
  id: string;
  kyb_case_id: string;
  subject_type: string;
  subject_id: string;
  match_type: string;
  match_score: number;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  resolution: string | null;
}

class KYBService {
  // Get KYB cases
  async getKYBCases(filters?: { status?: string; organization_id?: string }) {
    let query = supabase
      .from('kyb_cases')
      .select(`
        *,
        organization:organization_id(legal_name, organization_type)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.organization_id) {
      query = query.eq('organization_id', filters.organization_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Get single KYB case
  async getKYBCase(id: string) {
    const { data, error } = await supabase
      .from('kyb_cases')
      .select(`
        *,
        organization:organization_id(*),
        checks:kyb_checks(*),
        screening_matches(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get KYB case by number
  async getKYBCaseByNumber(caseNumber: string) {
    const { data, error } = await supabase
      .from('kyb_cases')
      .select(`
        *,
        organization:organization_id(*),
        checks:kyb_checks(*)
      `)
      .eq('case_number', caseNumber)
      .single();

    if (error) throw error;
    return data;
  }

  // Get KYB summary view
  async getKYBSummary(caseId: string) {
    const { data, error } = await supabase
      .from('v_kyb_summary')
      .select('*')
      .eq('kyb_case_id', caseId)
      .single();

    if (error) throw error;
    return data;
  }

  // Get KYB dashboard KPIs
  async getKYBDashboardKPIs() {
    const { data, error } = await supabase
      .from('v_dashboard_kyb_kpis')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  // Get beneficial owners for organization
  async getBeneficialOwners(organizationId: string) {
    const { data, error } = await supabase
      .from('beneficial_owners')
      .select(`
        *,
        person:person_id(*)
      `)
      .eq('organization_id', organizationId);

    if (error) throw error;
    return data;
  }

  // Get directors for organization
  async getDirectors(organizationId: string) {
    const { data, error } = await supabase
      .from('directors')
      .select(`
        *,
        person:person_id(*)
      `)
      .eq('organization_id', organizationId);

    if (error) throw error;
    return data;
  }
}

export const kybService = new KYBService();
export default kybService;
