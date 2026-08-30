// MASAR API - KYB Cases
import { NextRequest } from 'next/server';
import {
  executeMiddlewareChain,
  requireAuth,
  requirePermission,
  rateLimit,
  successResponse,
  createdResponse,
  errorResponse,
  ErrorCodes,
} from '@/lib/api/middleware';
import { supabaseAdmin } from '@/lib/supabase/server';
import { validateRequest, createKYBCaseSchema, formatValidationErrors, transformSnakeToCamel } from '@/lib/api/validators';
import { apiConfig } from '@/lib/api/config';

// POST /api/v1/kyb - Create KYB case
export async function POST(request: NextRequest) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('kyb.create'),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const body = await request.json();
    const validation = validateRequest(createKYBCaseSchema, body);
    if (!validation.success) {
      return errorResponse({ ...ErrorCodes.VALIDATION_ERROR, details: formatValidationErrors(validation.errors!) }, context.requestId);
    }

    // Generate case number
    const { data: caseNumber } = await supabaseAdmin.rpc('generate_kyb_case_number');

    const { data: kybCase, error: insertError } = await supabaseAdmin
      .from('kyb_cases')
      .insert({
        organization_id: validation.data!.organizationId,
        transaction_id: validation.data!.transactionId || null,
        case_number: caseNumber,
        status: 'submitted',
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return createdResponse(transformSnakeToCamel(kybCase), { requestId: context.requestId });
  } catch (err: any) {
    console.error('Create KYB error:', err);
    return errorResponse(err.code ? err : { ...ErrorCodes.INTERNAL_ERROR, message: 'Failed to create KYB case' }, context.requestId);
  }
}

// GET /api/v1/kyb - List KYB cases
export async function GET(request: NextRequest) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('kyb.read'),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '25'), 100);

    let query = supabaseAdmin
      .from('kyb_cases')
      .select('*, organization:organization_id(legal_name, organization_type)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) query = query.eq('status', status);

    const { data, error: fetchError } = await query;
    if (fetchError) throw fetchError;

    return successResponse(transformSnakeToCamel(data), { requestId: context.requestId });
  } catch (err: any) {
    console.error('List KYB error:', err);
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}
