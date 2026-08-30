// MASAR API - Transaction Readiness
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
// GET /api/v1/transactions/:id/readiness
// Get clearance readiness
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
    const readiness = await transactionService.getClearanceReadiness(params.id);

    return successResponse(readiness, { requestId: context.requestId });
  } catch (err: any) {
    console.error('Get readiness error:', err);
    
    if (err.code) {
      return errorResponse(err, context.requestId);
    }
    
    return errorResponse(
      { ...ErrorCodes.INTERNAL_ERROR, message: 'Failed to fetch readiness' },
      context.requestId
    );
  }
}
