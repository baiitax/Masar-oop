// MASAR API - Single Transaction Endpoint
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
import { transformSnakeToCamel } from '@/lib/api/validators';
import { transactionService } from '@/lib/api/services/transaction-service';
import { apiConfig } from '@/lib/api/config';

// ============================================================
// GET /api/v1/transactions/:id
// Get single transaction
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('transaction.read'),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) {
    return errorResponse(error, context.requestId);
  }

  try {
    const organizationId = user!.currentOrganization?.id;
    if (!organizationId) {
      return errorResponse(ErrorCodes.TENANT_ACCESS_DENIED, context.requestId);
    }

    const transaction = await transactionService.getTransaction(
      params.id,
      user!.id,
      organizationId
    );

    return successResponse(
      transformSnakeToCamel(transaction),
      { requestId: context.requestId }
    );
  } catch (err: any) {
    console.error('Get transaction error:', err);
    
    if (err.code) {
      return errorResponse(err, context.requestId);
    }
    
    return errorResponse(
      { ...ErrorCodes.INTERNAL_ERROR, message: 'Failed to fetch transaction' },
      context.requestId
    );
  }
}
