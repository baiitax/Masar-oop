// MASAR API - Audit Logs
import { NextRequest } from 'next/server';
import { executeMiddlewareChain, requireAuth, requirePermission, rateLimit, successResponse, errorResponse, ErrorCodes } from '@/lib/api/middleware';
import { supabaseAdmin } from '@/lib/supabase/server';
import { transformSnakeToCamel } from '@/lib/api/validators';
import { apiConfig } from '@/lib/api/config';

// GET /api/v1/audit
export async function GET(request: NextRequest) {
  const { error, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('audit.read'),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);

    let query = supabaseAdmin
      .from('audit_logs')
      .select('*, actor:actor_user_id(full_name, email), organization:actor_organization_id(legal_name)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (transactionId) query = query.eq('transaction_id', transactionId);

    const { data, error: fetchError } = await query;
    if (fetchError) throw fetchError;

    return successResponse(transformSnakeToCamel(data), { requestId: context.requestId });
  } catch (err: any) {
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}
