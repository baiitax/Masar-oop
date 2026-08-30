// MASAR API - Inspection Partner Dashboard
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

    const [kpis, assignments, inspections, samples, reports, exceptions] = await Promise.allSettled([
      getInspectionKPIs(organizationId),
      getAssignments(organizationId, user!.id),
      getActiveInspections(organizationId),
      getSamples(organizationId),
      getReports(organizationId),
      getExceptions(organizationId),
    ]);

    return successResponse({
      kpis: kpis.status === 'fulfilled' ? kpis.value : null,
      assignments: assignments.status === 'fulfilled' ? assignments.value : [],
      inspections: inspections.status === 'fulfilled' ? inspections.value : [],
      samples: samples.status === 'fulfilled' ? samples.value : [],
      reports: reports.status === 'fulfilled' ? reports.value : [],
      exceptions: exceptions.status === 'fulfilled' ? exceptions.value : [],
      inspector: await getInspectorProfile(user!.id),
    }, { requestId: context.requestId });
  } catch (err: any) {
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}

async function getInspectionKPIs(orgId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [inspections, samples, reports] = await Promise.all([
    supabaseAdmin.from('inspections').select('status, scheduled_at, completed_at').eq('provider_id', orgId),
    supabaseAdmin.from('samples').select('status').in('inspection_id',
      supabaseAdmin.from('inspections').select('id').eq('provider_id', orgId)
    ),
    supabaseAdmin.from('documents').select('status').eq('document_type', 'INSPECTION_REPORT'),
  ]);

  const inspData = inspections.data || [];
  const todayInspections = inspData.filter(i => i.scheduled_at && new Date(i.scheduled_at) >= today);

  return {
    todayJobs: todayInspections.length,
    assigned: inspData.filter(i => ['requested', 'accepted', 'scheduled'].includes(i.status)).length,
    inProgress: inspData.filter(i => ['inspector_assigned', 'sample_pending', 'sample_collected', 'lab_processing'].includes(i.status)).length,
    pendingReports: inspData.filter(i => i.status === 'result_received').length,
    completed: inspData.filter(i => ['passed', 'conditional', 'failed'].includes(i.status)).length,
    totalSamples: (samples.data || []).length,
    passRate: inspData.length > 0 ? Math.round((inspData.filter(i => i.status === 'passed').length / inspData.length) * 100) : 0,
  };
}

async function getAssignments(orgId: string, userId: string) {
  const { data } = await supabaseAdmin
    .from('inspections')
    .select(`
      id, inspection_number, inspection_type, status, scheduled_at, location,
      transaction:transaction_id(transaction_number, commodity:commodity_id(name), quantity, unit, contract_value, currency,
        exporter:exporter_organization_id(legal_name), buyer:buyer_organization_id(legal_name))
    `)
    .eq('provider_id', orgId)
    .in('status', ['requested', 'accepted', 'scheduled'])
    .order('scheduled_at', { ascending: true })
    .limit(20);

  return (data || []).map(a => ({
    id: a.id,
    inspectionNumber: a.inspection_number,
    type: a.inspection_type,
    status: a.status,
    scheduledAt: a.scheduled_at,
    location: a.location,
    transactionNumber: (a.transaction as any)?.transaction_number,
    commodity: (a.transaction as any)?.commodity?.name,
    quantity: `${(a.transaction as any)?.quantity} ${(a.transaction as any)?.unit}`,
    value: (a.transaction as any)?.contract_value,
    currency: (a.transaction as any)?.currency,
    exporter: (a.transaction as any)?.exporter?.legal_name,
    buyer: (a.transaction as any)?.buyer?.legal_name,
  }));
}

async function getActiveInspections(orgId: string) {
  const { data } = await supabaseAdmin
    .from('inspections')
    .select(`
      id, inspection_number, status, scheduled_at, started_at, location, result,
      inspector:inspector_id(full_name),
      transaction:transaction_id(transaction_number, commodity:commodity_id(name))
    `)
    .eq('provider_id', orgId)
    .in('status', ['inspector_assigned', 'sample_pending', 'sample_collected', 'lab_processing', 'result_received', 'inspection_review'])
    .order('scheduled_at', { ascending: true });

  return (data || []).map(i => ({
    id: i.id,
    inspectionNumber: i.inspection_number,
    status: i.status,
    scheduledAt: i.scheduled_at,
    startedAt: i.started_at,
    location: i.location,
    inspector: (i.inspector as any)?.full_name,
    transactionNumber: (i.transaction as any)?.transaction_number,
    commodity: (i.transaction as any)?.commodity?.name,
  }));
}

async function getSamples(orgId: string) {
  const { data } = await supabaseAdmin
    .from('samples')
    .select('id, sample_number, status, collected_at, lot_number')
    .in('inspection_id',
      supabaseAdmin.from('inspections').select('id').eq('provider_id', orgId)
    )
    .order('collected_at', { ascending: false })
    .limit(20);

  return data || [];
}

async function getReports(orgId: string) {
  const { data } = await supabaseAdmin
    .from('documents')
    .select('id, document_type, status, created_at, transaction_id')
    .eq('document_type', 'INSPECTION_REPORT')
    .in('transaction_id',
      supabaseAdmin.from('transactions').select('id')
    )
    .order('created_at', { ascending: false })
    .limit(10);

  return data || [];
}

async function getExceptions(orgId: string) {
  const { data } = await supabaseAdmin
    .from('exceptions')
    .select('id, exception_type, severity, status, description, created_at, transaction_id')
    .in('exception_type', ['inspection_failure', 'quality_variance'])
    .in('status', ['open', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(10);

  return data || [];
}

async function getInspectorProfile(userId: string) {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('full_name, email, phone, avatar_url')
    .eq('auth_user_id', userId)
    .single();

  return data || { full_name: 'Inspector', email: '' };
}
