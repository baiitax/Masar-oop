// MASAR API - Role-Specific Dashboard
import { NextRequest } from 'next/server';
import {
  executeMiddlewareChain,
  requireAuth,
  rateLimit,
  successResponse,
  errorResponse,
  ErrorCodes,
} from '@/lib/api/middleware';
import { supabaseAdmin } from '@/lib/supabase/server';
import { apiConfig } from '@/lib/api/config';

// ============================================================
// GET /api/v1/dashboard/:role
// Get role-specific dashboard data
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { role: string } }
) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) {
    return errorResponse(error, context.requestId);
  }

  try {
    const { role } = params;
    const organizationId = user!.currentOrganization?.id;

    // Verify user has access to this dashboard
    const validRoles = ['executive', 'operations', 'compliance', 'finance', 'buyer', 'exporter', 'inspector', 'auditor'];
    if (!validRoles.includes(role)) {
      return errorResponse(ErrorCodes.RESOURCE_NOT_FOUND, context.requestId);
    }

    let dashboardData: any = {};

    switch (role) {
      case 'executive':
        dashboardData = await getExecutiveDashboard(organizationId!);
        break;
      case 'operations':
        dashboardData = await getOperationsDashboard(organizationId!);
        break;
      case 'compliance':
        dashboardData = await getComplianceDashboard(organizationId!);
        break;
      case 'finance':
        dashboardData = await getFinanceDashboard(organizationId!);
        break;
      case 'buyer':
        dashboardData = await getBuyerDashboard(organizationId!);
        break;
      case 'exporter':
        dashboardData = await getExporterDashboard(organizationId!);
        break;
      case 'inspector':
        dashboardData = await getInspectorDashboard(user!.id);
        break;
      case 'auditor':
        dashboardData = await getAuditorDashboard(organizationId!);
        break;
    }

    return successResponse(dashboardData, { requestId: context.requestId });
  } catch (err: any) {
    console.error('Dashboard error:', err);
    return errorResponse(
      { ...ErrorCodes.INTERNAL_ERROR, message: 'Failed to fetch dashboard' },
      context.requestId
    );
  }
}

// ============================================================
// DASHBOARD DATA FUNCTIONS
// ============================================================

async function getExecutiveDashboard(organizationId: string) {
  const [transactions, kyb, finance] = await Promise.all([
    supabaseAdmin.from('v_dashboard_transaction_kpis').select('*').single(),
    supabaseAdmin.from('v_dashboard_kyb_kpis').select('*').single(),
    supabaseAdmin.from('v_dashboard_finance_kpis').select('*').single(),
  ]);

  return {
    kpis: {
      ...transactions.data,
      ...kyb.data,
      ...finance.data,
    },
    alerts: await getAlerts(organizationId),
  };
}

async function getOperationsDashboard(organizationId: string) {
  const [transactions, tasks, exceptions, sla] = await Promise.all([
    supabaseAdmin.from('transactions').select('id, transaction_number, current_state, updated_at').is('deleted_at', null).not('current_state', 'in', '(COMPLETED,CANCELLED)').order('updated_at', { ascending: false }).limit(10),
    supabaseAdmin.from('tasks').select('*').in('status', ['pending', 'in_progress']).is('deleted_at', null).order('due_at', { ascending: true }).limit(20),
    supabaseAdmin.from('exceptions').select('*').in('status', ['open', 'in_progress']).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('v_sla_metrics').select('*'),
  ]);

  return {
    recentTransactions: transactions.data || [],
    pendingTasks: tasks.data || [],
    openExceptions: exceptions.data || [],
    slaMetrics: sla.data || [],
  };
}

async function getComplianceDashboard(organizationId: string) {
  const [kyb, compliance, documents] = await Promise.all([
    supabaseAdmin.from('kyb_cases').select('*').order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('compliance_cases').select('*').order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('documents').select('*').in('status', ['expiring', 'expired', 'verification_required']).is('deleted_at', null).limit(10),
  ]);

  return {
    kybCases: kyb.data || [],
    complianceCases: compliance.data || [],
    pendingDocuments: documents.data || [],
  };
}

async function getFinanceDashboard(organizationId: string) {
  const [funding, escrow, settlements] = await Promise.all([
    supabaseAdmin.from('funding_requests').select('*').order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('escrow_records').select('*').order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('settlements').select('*').order('created_at', { ascending: false }).limit(10),
  ]);

  return {
    fundingRequests: funding.data || [],
    escrowRecords: escrow.data || [],
    settlements: settlements.data || [],
  };
}

async function getBuyerDashboard(organizationId: string) {
  const [transactions, invoices] = await Promise.all([
    supabaseAdmin.from('transactions').select('*').eq('buyer_organization_id', organizationId).is('deleted_at', null).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('invoices').select('*').eq('recipient_organization_id', organizationId).is('deleted_at', null).order('created_at', { ascending: false }).limit(10),
  ]);

  return {
    transactions: transactions.data || [],
    invoices: invoices.data || [],
  };
}

async function getExporterDashboard(organizationId: string) {
  const [transactions, tasks, documents] = await Promise.all([
    supabaseAdmin.from('transactions').select('*').eq('exporter_organization_id', organizationId).is('deleted_at', null).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('tasks').select('*').eq('assigned_organization_id', organizationId).in('status', ['pending', 'in_progress']).is('deleted_at', null).limit(10),
    supabaseAdmin.from('documents').select('*').eq('organization_id', organizationId).in('status', ['expected', 'missing']).is('deleted_at', null).limit(10),
  ]);

  return {
    transactions: transactions.data || [],
    pendingTasks: tasks.data || [],
    requiredDocuments: documents.data || [],
  };
}

async function getInspectorDashboard(userId: string) {
  const [inspections, samples] = await Promise.all([
    supabaseAdmin.from('inspections').select('*').eq('inspector_id', userId).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('samples').select('*').eq('status', 'pending').limit(10),
  ]);

  return {
    inspections: inspections.data || [],
    pendingSamples: samples.data || [],
  };
}

async function getAuditorDashboard(organizationId: string) {
  const [transactions, auditLogs] = await Promise.all([
    supabaseAdmin.from('transactions').select('id, transaction_number, current_state, created_at').is('deleted_at', null).order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50),
  ]);

  return {
    recentTransactions: transactions.data || [],
    recentAuditLogs: auditLogs.data || [],
  };
}

async function getAlerts(organizationId: string) {
  const alerts = [];

  // Check for SLA breaches
  const { data: slaBreaches } = await supabaseAdmin
    .from('sla_instances')
    .select('*')
    .eq('status', 'breached')
    .limit(5);

  if (slaBreaches && slaBreaches.length > 0) {
    alerts.push({
      type: 'SLA_BREACH',
      severity: 'critical',
      count: slaBreaches.length,
      message: `${slaBreaches.length} SLA breaches detected`,
    });
  }

  // Check for critical exceptions
  const { data: criticalExceptions } = await supabaseAdmin
    .from('exceptions')
    .select('*')
    .eq('severity', 'critical')
    .in('status', ['open', 'in_progress'])
    .limit(5);

  if (criticalExceptions && criticalExceptions.length > 0) {
    alerts.push({
      type: 'CRITICAL_EXCEPTION',
      severity: 'high',
      count: criticalExceptions.length,
      message: `${criticalExceptions.length} critical exceptions require attention`,
    });
  }

  return alerts;
}
