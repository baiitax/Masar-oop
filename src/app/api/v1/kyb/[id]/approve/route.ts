// MASAR API - Approve KYB Case
import { NextRequest } from 'next/server';
import { executeMiddlewareChain, requireAuth, requirePermission, rateLimit, successResponse, errorResponse, ErrorCodes, createAuditLog } from '@/lib/api/middleware';
import { supabaseAdmin } from '@/lib/supabase/server';
import { validateRequest, approveKYBSchema, formatValidationErrors, transformSnakeToCamel } from '@/lib/api/validators';
import { apiConfig } from '@/lib/api/config';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('kyb.approve'),
    rateLimit(apiConfig.rateLimits.sensitive),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const body = await request.json();
    const validation = validateRequest(approveKYBSchema, body);
    if (!validation.success) {
      return errorResponse({ ...ErrorCodes.VALIDATION_ERROR, details: formatValidationErrors(validation.errors!) }, context.requestId);
    }

    // Get KYB case
    const { data: kybCase, error: fetchError } = await supabaseAdmin
      .from('kyb_cases')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !kybCase) return errorResponse(ErrorCodes.RESOURCE_NOT_FOUND, context.requestId);

    // Update KYB case
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('kyb_cases')
      .update({
        status: 'approved',
        decision: 'auto_clear',
        completed_at: new Date().toISOString(),
        reviewed_by: user!.id,
        review_notes: validation.data!.notes,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Create audit log
    await createAuditLog('kyb_approved', 'kyb_case', params.id, user!.id, user!.currentOrganization?.id, kybCase.transaction_id, { status: kybCase.status }, { status: 'approved' });

    // Create protocol event if linked to transaction
    if (kybCase.transaction_id) {
      await supabaseAdmin.rpc('create_protocol_event', {
        p_transaction_id: kybCase.transaction_id,
        p_event_type: 'KYB_APPROVED',
        p_event_source: 'api',
        p_actor_user_id: user!.id,
        p_payload: { kyb_case_id: params.id, notes: validation.data!.notes },
      });
    }

    return successResponse(transformSnakeToCamel(updated), { requestId: context.requestId });
  } catch (err: any) {
    console.error('Approve KYB error:', err);
    return errorResponse(err.code ? err : { ...ErrorCodes.INTERNAL_ERROR, message: 'Failed to approve KYB' }, context.requestId);
  }
}
