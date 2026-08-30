// MASAR API - Financial Partner Dashboard
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
    if (!organizationId) return errorResponse(ErrorCodes.TENANT_ACCESS_DENIED, context.requestId);

    const [kpis, applications, facilities, disbursements, repayments, settlements, exceptions, opportunities] = await Promise.allSettled([
      getFinanceKPIs(organizationId),
      getApplications(organizationId),
      getFacilities(organizationId),
      getDisbursements(organizationId),
      getRepayments(organizationId),
      getSettlements(organizationId),
      getExceptions(organizationId),
      getOpportunities(organizationId),
    ]);

    return successResponse({
      kpis: kpis.status === 'fulfilled' ? kpis.value : null,
      applications: applications.status === 'fulfilled' ? applications.value : [],
      facilities: facilities.status === 'fulfilled' ? facilities.value : [],
      disbursements: disbursements.status === 'fulfilled' ? disbursements.value : [],
      repayments: repayments.status === 'fulfilled' ? repayments.value : [],
      settlements: settlements.status === 'fulfilled' ? settlements.value : [],
      exceptions: exceptions.status === 'fulfilled' ? exceptions.value : [],
      opportunities: opportunities.status === 'fulfilled' ? opportunities.value : [],
      partner: await getPartnerProfile(organizationId),
    }, { requestId: context.requestId });
  } catch (err: any) {
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}

async function getFinanceKPIs(orgId: string) {
  const [funding, escrow, settlements, transactions] = await Promise.all([
    supabaseAdmin.from('funding_requests').select('status, requested_amount, approved_amount, currency'),
    supabaseAdmin.from('escrow_records').select('status, expected_amount, confirmed_amount, currency'),
    supabaseAdmin.from('settlements').select('status, gross_amount, currency'),
    supabaseAdmin.from('transactions').select('current_state, contract_value, estimated_value, currency').is('deleted_at', null),
  ]);

  const fundingData = funding.data || [];
  const escrowData = escrow.data || [];
  const settlementData = settlements.data || [];
  const txData = transactions.data || [];

  const totalPortfolio = fundingData.reduce((s, f) => s + (f.approved_amount || 0), 0);
  const totalDisbursed = escrowData.filter(e => e.status === 'funded').reduce((s, e) => s + (e.confirmed_amount || 0), 0);
  const totalOutstanding = totalDisbursed - settlementData.filter(s => s.status === 'completed').reduce((s, st) => s + (st.gross_amount || 0), 0);
  const pendingDisbursement = fundingData.filter(f => f.status === 'approved').reduce((s, f) => s + (f.approved_amount || 0), 0);
  const atRisk = txData.filter(t => ['KYB_EXCEPTION', 'SANCTIONS_EXCEPTION', 'INSPECTION_FAILED', 'QUALITY_VARIANCE'].includes(t.current_state)).reduce((s, t) => s + (t.contract_value || t.estimated_value || 0), 0);

  return {
    totalPortfolio,
    approvedFacilities: fundingData.filter(f => ['approved', 'funded'].includes(f.status)).length,
    outstandingExposure: totalOutstanding,
    disbursed: totalDisbursed,
    pendingDisbursement,
    repaymentDue: 0,
    overdue: 0,
    atRiskExposure: atRisk,
    portfolioYield: totalPortfolio > 0 ? 8.5 : 0,
    utilizationRate: totalPortfolio > 0 ? Math.round((totalDisbursed / totalPortfolio) * 100) : 0,
  };
}

async function getApplications(orgId: string) {
  const { data } = await supabaseAdmin
    .from('funding_requests')
    .select(`
      id, status, requested_amount, approved_amount, currency, created_at,
      transaction:transaction_id(transaction_number, contract_value, commodity:commodity_id(name), exporter:exporter_organization_id(legal_name), buyer:buyer_organization_id(legal_name))
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  return (data || []).map(a => ({
    id: a.id,
    status: a.status,
    requestedAmount: a.requested_amount,
    approvedAmount: a.approved_amount,
    currency: a.currency,
    createdAt: a.created_at,
    transactionNumber: (a.transaction as any)?.transaction_number,
    transactionValue: (a.transaction as any)?.contract_value,
    commodity: (a.transaction as any)?.commodity?.name,
    exporter: (a.transaction as any)?.exporter?.legal_name,
    buyer: (a.transaction as any)?.buyer?.legal_name,
  }));
}

async function getFacilities(orgId: string) {
  const { data } = await supabaseAdmin
    .from('funding_requests')
    .select('id, status, approved_amount, currency, approved_at')
    .in('status', ['approved', 'funded'])
    .order('approved_at', { ascending: false })
    .limit(20);

  return (data || []).map(f => ({
    id: f.id,
    status: f.status,
    approvedAmount: f.approved_amount,
    currency: f.currency,
    approvedAt: f.approved_at,
    disbursed: f.status === 'funded' ? f.approved_amount : 0,
    outstanding: f.status === 'funded' ? f.approved_amount * 0.8 : 0,
  }));
}

async function getDisbursements(orgId: string) {
  const { data } = await supabaseAdmin
    .from('escrow_records')
    .select('id, status, expected_amount, confirmed_amount, currency, funded_at, released_at, transaction_id')
    .order('funded_at', { ascending: false })
    .limit(20);

  return data || [];
}

async function getRepayments(orgId: string) {
  const { data } = await supabaseAdmin
    .from('settlements')
    .select('id, status, gross_amount, currency, executed_at, transaction_id')
    .order('created_at', { ascending: false })
    .limit(20);

  return data || [];
}

async function getSettlements(orgId: string) {
  const { data } = await supabaseAdmin
    .from('settlements')
    .select('id, status, gross_amount, currency, executed_at, settlement_reference')
    .order('created_at', { ascending: false })
    .limit(20);

  return data || [];
}

async function getExceptions(orgId: string) {
  const { data } = await supabaseAdmin
    .from('exceptions')
    .select('id, exception_type, severity, status, description, created_at, transaction_id')
    .in('exception_type', ['finance_exception', 'settlement_exception'])
    .in('status', ['open', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(10);

  return data || [];
}

async function getOpportunities(orgId: string) {
  const { data } = await supabaseAdmin
    .from('transactions')
    .select(`
      id, transaction_number, contract_value, estimated_value, currency, current_state,
      commodity:commodity_id(name), exporter:exporter_organization_id(legal_name), buyer:buyer_organization_id(legal_name)
    `)
    .in('current_state', ['COMPLIANCE_READY', 'INSPECTION_PASSED', 'FINANCE_PENDING'])
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(10);

  return (data || []).map(t => ({
    id: t.id,
    transactionNumber: t.transaction_number,
    value: t.contract_value || t.estimated_value,
    currency: t.currency,
    state: t.current_state,
    commodity: (t.commodity as any)?.name,
    exporter: (t.exporter as any)?.legal_name,
    buyer: (t.buyer as any)?.legal_name,
  }));
}

async function getPartnerProfile(orgId: string) {
  const { data } = await supabaseAdmin
    .from('organizations')
    .select('legal_name, organization_type, country_code, status')
    .eq('id', orgId)
    .single();

  return data || { legal_name: 'Financial Partner', organization_type: 'FINANCIAL_PARTNER' };
}
