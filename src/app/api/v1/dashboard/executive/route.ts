// MASAR API - Executive Dashboard Aggregate Endpoint
import { NextRequest } from 'next/server';
import { executeMiddlewareChain, requireAuth, requirePermission, rateLimit, successResponse, errorResponse, ErrorCodes } from '@/lib/api/middleware';
import { supabaseAdmin } from '@/lib/supabase/server';
import { apiConfig } from '@/lib/api/config';

export async function GET(request: NextRequest) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('transaction.read'),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const organizationId = user!.currentOrganization?.id;
    
    // Load all dashboard sections in parallel
    const [kpis, pipeline, alerts, activity, risk, finance, compliance, inspection, logistics, settlement, systemHealth] = await Promise.allSettled([
      getKPIs(organizationId!),
      getPipeline(organizationId!),
      getAlerts(organizationId!),
      getActivity(organizationId!),
      getRiskSummary(organizationId!),
      getFinancialSummary(organizationId!),
      getComplianceSummary(organizationId!),
      getInspectionSummary(organizationId!),
      getLogisticsSummary(organizationId!),
      getSettlementSummary(organizationId!),
      getSystemHealth(),
    ]);

    return successResponse({
      kpis: kpis.status === 'fulfilled' ? kpis.value : null,
      pipeline: pipeline.status === 'fulfilled' ? pipeline.value : null,
      alerts: alerts.status === 'fulfilled' ? alerts.value : [],
      activity: activity.status === 'fulfilled' ? activity.value : [],
      risk: risk.status === 'fulfilled' ? risk.value : null,
      finance: finance.status === 'fulfilled' ? finance.value : null,
      compliance: compliance.status === 'fulfilled' ? compliance.value : null,
      inspection: inspection.status === 'fulfilled' ? inspection.value : null,
      logistics: logistics.status === 'fulfilled' ? logistics.value : null,
      settlement: settlement.status === 'fulfilled' ? settlement.value : null,
      systemHealth: systemHealth.status === 'fulfilled' ? systemHealth.value : null,
    }, {
      requestId: context.requestId,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Executive dashboard error:', err);
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}

// ============================================================
// KPI FUNCTIONS
// ============================================================

async function getKPIs(organizationId: string) {
  const [txKPIs, financeKPIs, kybKPIs] = await Promise.all([
    supabaseAdmin.from('v_dashboard_transaction_kpis').select('*').single(),
    supabaseAdmin.from('v_dashboard_finance_kpis').select('*').single(),
    supabaseAdmin.from('v_dashboard_kyb_kpis').select('*').single(),
  ]);

  const tx = txKPIs.data || {};
  const fin = financeKPIs.data || {};
  const kyb = kybKPIs.data || {};

  return {
    totalTransactionValue: tx.completed_gmv || 0,
    activeTransactions: tx.active_transactions || 0,
    completedTransactions: tx.completed_transactions || 0,
    pipelineValue: tx.pipeline_value || 0,
    expectedSettlement: fin.total_escrow_amount || 0,
    revenue: (tx.completed_gmv || 0) * 0.05, // 5% take rate
    grossMargin: (tx.completed_gmv || 0) * 0.03, // 3% margin
    atRiskValue: 0, // Calculated from exceptions
    blockedValue: 0, // Calculated from blocked transactions
    slaBreaches: 0, // From SLA metrics
    completionRate: tx.total_transactions > 0 
      ? Math.round((tx.completed_transactions / tx.total_transactions) * 100) 
      : 0,
    averageCycleDays: tx.avg_cycle_days || 0,
    clearanceScore: tx.avg_clearance_score || 0,
    kybAutoClearRate: kyb.total_cases > 0 
      ? Math.round((kyb.auto_cleared / kyb.total_cases) * 100) 
      : 0,
  };
}

async function getPipeline(organizationId: string) {
  const { data: transactions } = await supabaseAdmin
    .from('transactions')
    .select('current_state, contract_value, estimated_value')
    .is('deleted_at', null);

  if (!transactions) return [];

  const stages = [
    { state: 'DRAFT', label: 'Initiated', states: ['DRAFT', 'RFQ'] },
    { state: 'BUYER_VERIFIED', label: 'KYB', states: ['BUYER_VERIFIED', 'EXPORTER_VERIFIED'] },
    { state: 'COMMERCIAL_MATCH', label: 'Contract', states: ['COMMERCIAL_MATCH', 'CONTRACTED'] },
    { state: 'COMPLIANCE_REVIEW', label: 'Compliance', states: ['COMPLIANCE_REVIEW', 'COMPLIANCE_READY'] },
    { state: 'INSPECTION_PENDING', label: 'Inspection', states: ['INSPECTION_PENDING', 'INSPECTION_IN_PROGRESS', 'INSPECTION_PASSED'] },
    { state: 'FINANCE_PENDING', label: 'Finance', states: ['FINANCE_PENDING', 'FINANCE_APPROVED', 'FUNDS_SECURED'] },
    { state: 'SHIPMENT_READY', label: 'Shipment', states: ['SHIPMENT_READY', 'IN_TRANSIT', 'ARRIVED', 'PORT_VERIFIED'] },
    { state: 'RELEASE_ELIGIBLE', label: 'Release', states: ['RELEASE_ELIGIBLE', 'RELEASE_APPROVAL'] },
    { state: 'SETTLEMENT', label: 'Settlement', states: ['SETTLEMENT'] },
    { state: 'COMPLETED', label: 'Completed', states: ['COMPLETED'] },
  ];

  return stages.map(stage => {
    const stageTx = transactions.filter(t => stage.states.includes(t.current_state));
    const totalValue = stageTx.reduce((sum, t) => sum + (t.contract_value || t.estimated_value || 0), 0);
    const blockedCount = stageTx.filter(t => 
      t.current_state.includes('EXCEPTION') || 
      t.current_state.includes('FAILED') ||
      t.current_state.includes('DELAY')
    ).length;

    return {
      stage: stage.label,
      count: stageTx.length,
      value: totalValue,
      blocked: blockedCount,
    };
  });
}

async function getAlerts(organizationId: string) {
  const alerts = [];

  // Critical exceptions
  const { data: criticalExceptions } = await supabaseAdmin
    .from('exceptions')
    .select('*, transaction:transaction_id(transaction_number, contract_value, estimated_value)')
    .eq('severity', 'critical')
    .in('status', ['open', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(10);

  if (criticalExceptions?.length) {
    alerts.push(...criticalExceptions.map(e => ({
      id: e.id,
      type: 'CRITICAL_EXCEPTION',
      severity: 'critical',
      title: e.description,
      transaction: (e.transaction as any)?.transaction_number,
      value: (e.transaction as any)?.contract_value || (e.transaction as any)?.estimated_value || 0,
      age: Math.round((Date.now() - new Date(e.created_at).getTime()) / (1000 * 60 * 60)),
      action: 'Review Exception',
    })));
  }

  // SLA breaches
  const { data: slaBreaches } = await supabaseAdmin
    .from('sla_instances')
    .select('*, transaction:transaction_id(transaction_number)')
    .eq('status', 'breached')
    .limit(5);

  if (slaBreaches?.length) {
    alerts.push(...slaBreaches.map(s => ({
      id: s.id,
      type: 'SLA_BREACH',
      severity: 'high',
      title: `SLA breach detected`,
      transaction: (s.transaction as any)?.transaction_number,
      age: Math.round((Date.now() - new Date(s.created_at).getTime()) / (1000 * 60 * 60)),
      action: 'Review SLA',
    })));
  }

  // High-value pending approvals
  const { data: pendingApprovals } = await supabaseAdmin
    .from('release_approvals')
    .select('*, transaction:transaction_id(transaction_number, contract_value)')
    .eq('status', 'pending')
    .limit(5);

  if (pendingApprovals?.length) {
    alerts.push(...pendingApprovals.map(a => ({
      id: a.id,
      type: 'PENDING_APPROVAL',
      severity: 'medium',
      title: 'Release approval required',
      transaction: (a.transaction as any)?.transaction_number,
      value: (a.transaction as any)?.contract_value || 0,
      action: 'Review Approval',
    })));
  }

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (severityOrder[a.severity as keyof typeof severityOrder] || 4) - 
           (severityOrder[b.severity as keyof typeof severityOrder] || 4);
  });
}

async function getActivity(organizationId: string) {
  const { data: events } = await supabaseAdmin
    .from('protocol_events')
    .select('*, transaction:transaction_id(transaction_number), actor:actor_user_id(full_name)')
    .order('occurred_at', { ascending: false })
    .limit(20);

  return (events || []).map(e => ({
    id: e.id,
    type: e.event_type,
    transaction: (e.transaction as any)?.transaction_number,
    actor: (e.actor as any)?.full_name || 'System',
    timestamp: e.occurred_at,
    details: e.payload,
  }));
}

async function getRiskSummary(organizationId: string) {
  const { data: transactions } = await supabaseAdmin
    .from('transactions')
    .select('risk_level, contract_value, estimated_value, current_state')
    .is('deleted_at', null);

  if (!transactions) return { total: 0, byLevel: {}, atRiskValue: 0 };

  const riskGroups = {
    critical: transactions.filter(t => t.risk_level === 'critical'),
    high: transactions.filter(t => t.risk_level === 'high'),
    medium: transactions.filter(t => t.risk_level === 'medium'),
    low: transactions.filter(t => t.risk_level === 'low'),
  };

  const atRiskValue = transactions
    .filter(t => ['critical', 'high'].includes(t.risk_level))
    .reduce((sum, t) => sum + (t.contract_value || t.estimated_value || 0), 0);

  return {
    total: transactions.length,
    byLevel: {
      critical: { count: riskGroups.critical.length, value: riskGroups.critical.reduce((s, t) => s + (t.contract_value || t.estimated_value || 0), 0) },
      high: { count: riskGroups.high.length, value: riskGroups.high.reduce((s, t) => s + (t.contract_value || t.estimated_value || 0), 0) },
      medium: { count: riskGroups.medium.length, value: riskGroups.medium.reduce((s, t) => s + (t.contract_value || t.estimated_value || 0), 0) },
      low: { count: riskGroups.low.length, value: riskGroups.low.reduce((s, t) => s + (t.contract_value || t.estimated_value || 0), 0) },
    },
    atRiskValue,
  };
}

async function getFinancialSummary(organizationId: string) {
  const [funding, escrow, settlements] = await Promise.all([
    supabaseAdmin.from('funding_requests').select('status, requested_amount, approved_amount'),
    supabaseAdmin.from('escrow_records').select('status, expected_amount, confirmed_amount'),
    supabaseAdmin.from('settlements').select('status, gross_amount'),
  ]);

  const fundingData = funding.data || [];
  const escrowData = escrow.data || [];
  const settlementData = settlements.data || [];

  return {
    funding: {
      totalRequested: fundingData.reduce((s, f) => s + (f.requested_amount || 0), 0),
      totalApproved: fundingData.filter(f => ['approved', 'funded'].includes(f.status)).reduce((s, f) => s + (f.approved_amount || 0), 0),
      pending: fundingData.filter(f => f.status === 'requested').length,
    },
    escrow: {
      totalExpected: escrowData.reduce((s, e) => s + (e.expected_amount || 0), 0),
      totalConfirmed: escrowData.filter(e => e.status === 'funded').reduce((s, e) => s + (e.confirmed_amount || 0), 0),
    },
    settlements: {
      totalCompleted: settlementData.filter(s => s.status === 'completed').reduce((s, st) => s + (st.gross_amount || 0), 0),
      pending: settlementData.filter(s => s.status === 'pending').length,
      processing: settlementData.filter(s => s.status === 'processing').length,
    },
  };
}

async function getComplianceSummary(organizationId: string) {
  const [kyb, compliance, documents] = await Promise.all([
    supabaseAdmin.from('v_dashboard_kyb_kpis').select('*').single(),
    supabaseAdmin.from('v_dashboard_compliance_kpis').select('*').single(),
    supabaseAdmin.from('documents').select('status').is('deleted_at', null),
  ]);

  const kybData = kyb.data || {};
  const complianceData = compliance.data || {};
  const docData = documents.data || [];

  return {
    kyb: {
      total: kybData.total_cases || 0,
      approved: kybData.approved_cases || 0,
      pending: kybData.pending_cases || 0,
      rejected: kybData.rejected_cases || 0,
      autoClearRate: kybData.total_cases > 0 
        ? Math.round((kybData.auto_cleared / kybData.total_cases) * 100) 
        : 0,
    },
    compliance: {
      total: complianceData.total_cases || 0,
      ready: complianceData.ready_cases || 0,
      inProgress: complianceData.in_progress_cases || 0,
      blocked: complianceData.exception_cases || 0,
      readinessScore: complianceData.avg_readiness_score || 0,
    },
    documents: {
      total: docData.length,
      verified: docData.filter(d => d.status === 'verified').length,
      pending: docData.filter(d => ['expected', 'missing', 'uploaded', 'processing'].includes(d.status)).length,
      expiring: docData.filter(d => d.status === 'expiring').length,
      expired: docData.filter(d => d.status === 'expired').length,
    },
  };
}

async function getInspectionSummary(organizationId: string) {
  const { data: inspections } = await supabaseAdmin
    .from('inspections')
    .select('status, result');

  const data = inspections || [];

  return {
    total: data.length,
    pending: data.filter(i => ['requested', 'accepted', 'scheduled', 'inspector_assigned'].includes(i.status)).length,
    inProgress: data.filter(i => ['sample_pending', 'sample_collected', 'lab_processing', 'result_received'].includes(i.status)).length,
    passed: data.filter(i => i.status === 'passed').length,
    failed: data.filter(i => i.status === 'failed').length,
    conditional: data.filter(i => i.status === 'conditional').length,
    passRate: data.length > 0 
      ? Math.round((data.filter(i => i.status === 'passed').length / data.length) * 100) 
      : 0,
  };
}

async function getLogisticsSummary(organizationId: string) {
  const { data: shipments } = await supabaseAdmin
    .from('shipments')
    .select('status');

  const data = shipments || [];

  return {
    total: data.length,
    inTransit: data.filter(s => s.status === 'in_transit').length,
    arrived: data.filter(s => s.status === 'arrived').length,
    delayed: data.filter(s => s.status === 'delayed').length,
    delivered: data.filter(s => s.status === 'delivered').length,
  };
}

async function getSettlementSummary(organizationId: string) {
  const { data: settlements } = await supabaseAdmin
    .from('settlements')
    .select('status, gross_amount, currency');

  const data = settlements || [];

  return {
    total: data.length,
    completed: data.filter(s => s.status === 'completed').length,
    pending: data.filter(s => s.status === 'pending').length,
    processing: data.filter(s => s.status === 'processing').length,
    failed: data.filter(s => s.status === 'failed').length,
    totalValue: data.filter(s => s.status === 'completed').reduce((s, st) => s + (st.gross_amount || 0), 0),
  };
}

async function getSystemHealth() {
  const checks = await Promise.allSettled([
    supabaseAdmin.from('transactions').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('integration_providers').select('id, status, provider_name').limit(10),
  ]);

  const dbHealthy = checks[0].status === 'fulfilled';
  const integrations = checks[1].status === 'fulfilled' ? checks[1].value.data || [] : [];

  return {
    database: {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      latency: 0, // Would measure actual latency
    },
    api: {
      status: 'healthy',
    },
    integrations: integrations.map(i => ({
      name: i.provider_name,
      status: i.status,
    })),
  };
}
