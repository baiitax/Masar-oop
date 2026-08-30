// MASAR API - Single KYB Case
import { NextRequest } from 'next/server';
import { executeMiddlewareChain, requireAuth, requirePermission, rateLimit, successResponse, errorResponse, ErrorCodes } from '@/lib/api/middleware';
import { supabaseAdmin } from '@/lib/supabase/server';
import { transformSnakeToCamel } from '@/lib/api/validators';
import { apiConfig } from '@/lib/api/config';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { error, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('kyb.read'),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const { data, error: fetchError } = await supabaseAdmin
      .from('kyb_cases')
      .select('*, organization:organization_id(*), checks:kyb_checks(*), screening_matches(*)')
      .eq('id', params.id)
      .single();

    if (fetchError || !data) return errorResponse(ErrorCodes.RESOURCE_NOT_FOUND, context.requestId);

    return successResponse(transformSnakeToCamel(data), { requestId: context.requestId });
  } catch (err: any) {
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}
