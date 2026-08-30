// MASAR API - Analytics
import { NextRequest } from 'next/server';
import { executeMiddlewareChain, requireAuth, requirePermission, rateLimit, successResponse, errorResponse, ErrorCodes } from '@/lib/api/middleware';
import { supabaseAdmin } from '@/lib/supabase/server';
import { apiConfig } from '@/lib/api/config';

// GET /api/v1/analytics
export async function GET(request: NextRequest) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('audit.read'),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const [transactions, kyb, compliance, finance, sla] = await Promise.all([
      supabaseAdmin.from('v_dashboard_transaction_kpis').select('*').single(),
      supabaseAdmin.from('v_dashboard_kyb_kpis').select('*').single(),
      supabaseAdmin.from('v_dashboard_compliance_kpis').select('*').single(),
      supabaseAdmin.from('v_dashboard_finance_kpis').select('*').single(),
      supabaseAdmin.from('v_sla_metrics').select('*'),
    ]);

    return successResponse({
      transactions: transactions.data,
      kyb: kyb.data,
      compliance: compliance.data,
      finance: finance.data,
      sla: sla.data,
    }, { requestId: context.requestId });
  } catch (err: any) {
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}
