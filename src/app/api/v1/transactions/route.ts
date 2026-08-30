// MASAR API - Transactions Endpoint
// Enterprise-grade transaction management

import { NextRequest, NextResponse } from 'next/server';
import {
  executeMiddlewareChain,
  requireAuth,
  requirePermission,
  rateLimit,
  successResponse,
  createdResponse,
  paginatedResponse,
  errorResponse,
  ErrorCodes,
  RequestContext,
} from '@/lib/api/middleware';
import {
  validateRequest,
  createTransactionSchema,
  transactionFiltersSchema,
  formatValidationErrors,
  transformSnakeToCamel,
} from '@/lib/api/validators';
import { transactionService } from '@/lib/api/services/transaction-service';
import { apiConfig } from '@/lib/api/config';

// ============================================================
// POST /api/v1/transactions
// Create a new transaction
// ============================================================

export async function POST(request: NextRequest) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('transaction.create'),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) {
    return errorResponse(error, context.requestId);
  }

  try {
    const body = await request.json();
    
    // Validate request
    const validation = validateRequest(createTransactionSchema, body);
    if (!validation.success) {
      return errorResponse(
        {
          ...ErrorCodes.VALIDATION_ERROR,
          details: formatValidationErrors(validation.errors!),
        },
        context.requestId
      );
    }

    const input = validation.data!;
    const organizationId = user!.currentOrganization?.id;

    if (!organizationId) {
      return errorResponse(ErrorCodes.TENANT_ACCESS_DENIED, context.requestId);
    }

    // Create transaction
    const transaction = await transactionService.createTransaction(
      input,
      user!.id,
      organizationId
    );

    return createdResponse(
      transformSnakeToCamel(transaction),
      { requestId: context.requestId }
    );
  } catch (err: any) {
    console.error('Create transaction error:', err);
    
    if (err.code) {
      return errorResponse(err, context.requestId);
    }
    
    return errorResponse(
      { ...ErrorCodes.INTERNAL_ERROR, message: 'Failed to create transaction' },
      context.requestId
    );
  }
}

// ============================================================
// GET /api/v1/transactions
// List transactions with filters
// ============================================================

export async function GET(request: NextRequest) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('transaction.read'),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) {
    return errorResponse(error, context.requestId);
  }

  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate filters
    const filters = {
      state: searchParams.get('state') || undefined,
      buyerId: searchParams.get('buyerId') || undefined,
      exporterId: searchParams.get('exporterId') || undefined,
      commodityId: searchParams.get('commodityId') || undefined,
      riskLevel: searchParams.get('riskLevel') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      limit: parseInt(searchParams.get('limit') || '25'),
      cursor: searchParams.get('cursor') || undefined,
    };

    const validation = validateRequest(transactionFiltersSchema, filters);
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

    const result = await transactionService.listTransactions(
      validation.data!,
      user!.id,
      organizationId
    );

    return paginatedResponse(
      transformSnakeToCamel(result.data),
      result.pagination,
      { requestId: context.requestId }
    );
  } catch (err: any) {
    console.error('List transactions error:', err);
    
    if (err.code) {
      return errorResponse(err, context.requestId);
    }
    
    return errorResponse(
      { ...ErrorCodes.INTERNAL_ERROR, message: 'Failed to fetch transactions' },
      context.requestId
    );
  }
}
