// MASAR API - Advance Transaction State
import { NextRequest } from 'next/server';
import {
  executeMiddlewareChain,
  requireAuth,
  requirePermission,
  rateLimit,
  successResponse,
  errorResponse,
  ErrorCodes,
} from '@/lib/api/middleware';
import { validateRequest, advanceTransactionSchema, formatValidationErrors, transformSnakeToCamel } from '@/lib/api/validators';
import { transactionService } from '@/lib/api/services/transaction-service';
import { apiConfig } from '@/lib/api/config';

// ============================================================
// POST /api/v1/transactions/:id/actions/advance
// Advance transaction state
// ============================================================

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('transaction.approve'),
    rateLimit(apiConfig.rateLimits.sensitive),
  ]);

  if (error) {
    return errorResponse(error, context.requestId);
  }

  try {
    const body = await request.json();
    
    const validation = validateRequest(advanceTransactionSchema, body);
    if (!validation.success) {
      return errorResponse(
        {
          ...ErrorCodes.VALIDATION_ERROR,
          details: formatValidationErrors(validation.errors!),
        },
        context.requestId
      );
    }

    const organizationId = user!.currentOrganization?.id;
    if (!organizationId) {
      return errorResponse(ErrorCodes.TENANT_ACCESS_DENIED, context.requestId);
    }

    const transaction = await transactionService.advanceTransaction(
      params.id,
      validation.data!.targetState,
      validation.data!.reason,
      user!.id,
      organizationId
    );

    return successResponse(
      transformSnakeToCamel(transaction),
      { requestId: context.requestId }
    );
  } catch (err: any) {
    console.error('Advance transaction error:', err);
    
    if (err.code) {
      return errorResponse(err, context.requestId);
    }
    
    return errorResponse(
      { ...ErrorCodes.INTERNAL_ERROR, message: 'Failed to advance transaction' },
      context.requestId
    );
  }
}
