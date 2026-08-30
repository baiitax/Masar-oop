// MASAR API Middleware Stack
// Enterprise-grade middleware for request processing

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '@/lib/supabase/server';
import { apiConfig } from '../config';

// ============================================================
// TYPES
// ============================================================

export interface AuthenticatedUser {
  id: string;
  email: string;
  profile: any;
  organizations: any[];
  permissions: string[];
  currentOrganization: any;
  currentRole: any;
}

export interface RequestContext {
  requestId: string;
  user: AuthenticatedUser | null;
  startTime: number;
  ip: string;
  userAgent: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

// ============================================================
// REQUEST ID MIDDLEWARE
// ============================================================

export function generateRequestId(): string {
  return `${apiConfig.requestId.prefix}${uuidv4().replace(/-/g, '').substring(0, 12)}`;
}

// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================

export async function authenticate(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const accessToken = authHeader.split(' ')[1];
    
    // Verify token with Supabase
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (authError || !user) {
      return null;
    }

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    if (!profile || profile.status !== 'active') {
      return null;
    }

    // Get user organizations with roles
    const { data: memberships } = await supabaseAdmin
      .from('organization_members')
      .select(`
        organization_id,
        role_id,
        is_primary,
        organizations:organization_id(id, legal_name, organization_type, status),
        roles:role_id(id, code, name)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (!memberships || memberships.length === 0) {
      return null;
    }

    // Get user permissions
    const { data: roleIds } = await supabaseAdmin
      .from('organization_members')
      .select('role_id')
      .eq('user_id', user.id)
      .eq('status', 'active');

    const roleIdList = roleIds?.map(r => r.role_id) || [];

    const { data: permissions } = await supabaseAdmin
      .from('role_permissions')
      .select('permissions:permission_id(code)')
      .in('role_id', roleIdList);

    const permissionList = permissions?.map(p => (p.permissions as any)?.code).filter(Boolean) || [];

    // Find primary organization
    const primaryMembership = memberships.find(m => m.is_primary) || memberships[0];

    return {
      id: user.id,
      email: user.email || '',
      profile,
      organizations: memberships.map(m => ({
        id: m.organization_id,
        ...(m.organizations as any),
        roleId: m.role_id,
        role: m.roles,
        isPrimary: m.is_primary,
      })),
      permissions: [...new Set(permissionList)],
      currentOrganization: primaryMembership?.organizations,
      currentRole: primaryMembership?.roles,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// ============================================================
// AUTHORIZATION MIDDLEWARE
// ============================================================

export function checkPermission(user: AuthenticatedUser, permission: string): boolean {
  return user.permissions.includes(permission);
}

export function checkAnyPermission(user: AuthenticatedUser, permissions: string[]): boolean {
  return permissions.some(p => user.permissions.includes(p));
}

export function checkAllPermissions(user: AuthenticatedUser, permissions: string[]): boolean {
  return permissions.every(p => user.permissions.includes(p));
}

export function checkOrganizationAccess(user: AuthenticatedUser, organizationId: string): boolean {
  return user.organizations.some(o => o.id === organizationId);
}

// ============================================================
// TENANT ISOLATION MIDDLEWARE
// ============================================================

export function resolveTenantContext(user: AuthenticatedUser, requestedOrgId?: string): string | null {
  if (!requestedOrgId) {
    // Use primary organization
    return user.currentOrganization?.id || null;
  }

  // Verify user belongs to requested organization
  if (checkOrganizationAccess(user, requestedOrgId)) {
    return requestedOrgId;
  }

  return null; // Access denied
}

// ============================================================
// RATE LIMITING MIDDLEWARE
// ============================================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  config: { windowMs: number; max: number }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.max - 1, resetTime: now + config.windowMs };
  }

  if (record.count >= config.max) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: config.max - record.count, resetTime: record.resetTime };
}

// ============================================================
// INPUT VALIDATION MIDDLEWARE
// ============================================================

export function validateContentType(request: NextRequest, allowedTypes: string[]): boolean {
  const contentType = request.headers.get('content-type');
  if (!contentType) return false;
  return allowedTypes.some(type => contentType.includes(type));
}

export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potential XSS
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input && typeof input === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// ============================================================
// IDEMPOTENCY MIDDLEWARE
// ============================================================

export async function checkIdempotency(
  key: string,
  userId: string,
  endpoint: string
): Promise<{ exists: boolean; response?: any }> {
  const { data } = await supabaseAdmin
    .from('idempotency_keys')
    .select('response_status, response_body')
    .eq('key', key)
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (data) {
    return {
      exists: true,
      response: {
        status: data.response_status,
        body: data.response_body,
      },
    };
  }

  return { exists: false };
}

export async function storeIdempotency(
  key: string,
  userId: string,
  organizationId: string,
  endpoint: string,
  requestHash: string,
  responseStatus: number,
  responseBody: any
): Promise<void> {
  await supabaseAdmin.from('idempotency_keys').insert({
    key,
    user_id: userId,
    organization_id: organizationId,
    endpoint,
    request_hash: requestHash,
    response_status: responseStatus,
    response_body: responseBody,
    expires_at: new Date(Date.now() + apiConfig.idempotency.ttl * 1000).toISOString(),
  });
}

// ============================================================
// AUDIT MIDDLEWARE
// ============================================================

export async function createAuditLog(
  action: string,
  entityType: string,
  entityId: string,
  userId: string,
  organizationId: string,
  transactionId?: string,
  oldValues?: any,
  newValues?: any,
  request?: NextRequest
): Promise<void> {
  const ipAddress = request?.headers.get('x-forwarded-for') || 
                    request?.headers.get('x-real-ip') || 
                    'unknown';
  const userAgent = request?.headers.get('user-agent') || 'unknown';

  await supabaseAdmin.rpc('create_audit_log', {
    p_action: action,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_transaction_id: transactionId || null,
    p_old_values: oldValues || null,
    p_new_values: newValues || null,
    p_ip_address: ipAddress,
    p_user_agent: userAgent,
  });
}

// ============================================================
// RESPONSE HELPERS
// ============================================================

export function successResponse(data: any, meta?: any): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
}

export function paginatedResponse(
  data: any[],
  pagination: {
    nextCursor?: string;
    hasMore: boolean;
    total?: number;
  },
  meta?: any
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    pagination,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
}

export function errorResponse(error: ApiError, requestId?: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        requestId: requestId || null,
      },
    },
    { status: error.statusCode }
  );
}

export function createdResponse(data: any, meta?: any): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status: 201 }
  );
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function acceptedResponse(jobId: string, status: string = 'QUEUED'): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data: { jobId, status },
      meta: { timestamp: new Date().toISOString() },
    },
    { status: 202 }
  );
}

// ============================================================
// ERROR CODES
// ============================================================

export const ErrorCodes = {
  // Authentication
  AUTH_REQUIRED: { code: 'AUTH_REQUIRED', message: 'Authentication required', statusCode: 401 },
  AUTH_INVALID: { code: 'AUTH_INVALID', message: 'Invalid authentication credentials', statusCode: 401 },
  AUTH_EXPIRED: { code: 'AUTH_EXPIRED', message: 'Authentication token has expired', statusCode: 401 },
  AUTH_MFA_REQUIRED: { code: 'AUTH_MFA_REQUIRED', message: 'Multi-factor authentication required', statusCode: 401 },
  
  // Authorization
  ACCESS_DENIED: { code: 'ACCESS_DENIED', message: 'Access denied', statusCode: 403 },
  TENANT_ACCESS_DENIED: { code: 'TENANT_ACCESS_DENIED', message: 'Access denied for this organization', statusCode: 403 },
  PERMISSION_DENIED: { code: 'PERMISSION_DENIED', message: 'Insufficient permissions', statusCode: 403 },
  
  // Validation
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', message: 'Request validation failed', statusCode: 400 },
  INVALID_REQUEST: { code: 'INVALID_REQUEST', message: 'Invalid request format', statusCode: 400 },
  MISSING_FIELD: { code: 'MISSING_FIELD', message: 'Required field is missing', statusCode: 400 },
  INVALID_ENUM: { code: 'INVALID_ENUM', message: 'Invalid enum value', statusCode: 400 },
  
  // Resources
  RESOURCE_NOT_FOUND: { code: 'RESOURCE_NOT_FOUND', message: 'Resource not found', statusCode: 404 },
  DUPLICATE_RESOURCE: { code: 'DUPLICATE_RESOURCE', message: 'Resource already exists', statusCode: 409 },
  
  // Transaction/Protocol
  INVALID_STATE_TRANSITION: { code: 'INVALID_STATE_TRANSITION', message: 'Invalid transaction state transition', statusCode: 400 },
  PROTOCOL_CONDITION_FAILED: { code: 'PROTOCOL_CONDITION_FAILED', message: 'Protocol condition not satisfied', statusCode: 400 },
  KYB_REQUIRED: { code: 'KYB_REQUIRED', message: 'KYB verification required', statusCode: 400 },
  COMPLIANCE_BLOCKED: { code: 'COMPLIANCE_BLOCKED', message: 'Compliance requirements not met', statusCode: 400 },
  INSPECTION_REQUIRED: { code: 'INSPECTION_REQUIRED', message: 'Inspection required', statusCode: 400 },
  FUNDS_NOT_CONFIRMED: { code: 'FUNDS_NOT_CONFIRMED', message: 'Funds not confirmed', statusCode: 400 },
  RELEASE_NOT_ELIGIBLE: { code: 'RELEASE_NOT_ELIGIBLE', message: 'Release conditions not satisfied', statusCode: 400 },
  HUMAN_APPROVAL_REQUIRED: { code: 'HUMAN_APPROVAL_REQUIRED', message: 'Human approval required', statusCode: 400 },
  DUAL_APPROVAL_REQUIRED: { code: 'DUAL_APPROVAL_REQUIRED', message: 'Dual approval required', statusCode: 400 },
  
  // Rate Limiting
  RATE_LIMITED: { code: 'RATE_LIMITED', message: 'Rate limit exceeded', statusCode: 429 },
  
  // Idempotency
  IDEMPOTENCY_CONFLICT: { code: 'IDEMPOTENCY_CONFLICT', message: 'Idempotency key conflict', statusCode: 409 },
  
  // Integration
  INTEGRATION_ERROR: { code: 'INTEGRATION_ERROR', message: 'External integration error', statusCode: 502 },
  PROVIDER_UNAVAILABLE: { code: 'PROVIDER_UNAVAILABLE', message: 'External provider unavailable', statusCode: 503 },
  
  // Concurrency
  CONCURRENT_MODIFICATION: { code: 'CONCURRENT_MODIFICATION', message: 'Resource was modified concurrently', statusCode: 409 },
  
  // Internal
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', message: 'Internal server error', statusCode: 500 },
} as const;

// ============================================================
// MIDDLEWARE CHAIN
// ============================================================

export type MiddlewareFunction = (
  request: NextRequest,
  context: RequestContext
) => Promise<{ error?: ApiError; user?: AuthenticatedUser } | null>;

export async function executeMiddlewareChain(
  request: NextRequest,
  middlewares: MiddlewareFunction[]
): Promise<{ error?: ApiError; user?: AuthenticatedUser; context: RequestContext }> {
  const context: RequestContext = {
    requestId: generateRequestId(),
    user: null,
    startTime: Date.now(),
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  };

  for (const middleware of middlewares) {
    const result = await middleware(request, context);
    if (result?.error) {
      return { error: result.error, context };
    }
    if (result?.user) {
      context.user = result.user;
    }
  }

  return { user: context.user || undefined, context };
}

// ============================================================
// COMMON MIDDLEWARE BUILDERS
// ============================================================

export function requireAuth(): MiddlewareFunction {
  return async (request, context) => {
    const user = await authenticate(request);
    if (!user) {
      return { error: ErrorCodes.AUTH_REQUIRED };
    }
    return { user };
  };
}

export function requirePermission(permission: string): MiddlewareFunction {
  return async (request, context) => {
    if (!context.user) {
      return { error: ErrorCodes.AUTH_REQUIRED };
    }
    if (!checkPermission(context.user, permission)) {
      return { error: ErrorCodes.PERMISSION_DENIED };
    }
    return null;
  };
}

export function requireAnyPermission(permissions: string[]): MiddlewareFunction {
  return async (request, context) => {
    if (!context.user) {
      return { error: ErrorCodes.AUTH_REQUIRED };
    }
    if (!checkAnyPermission(context.user, permissions)) {
      return { error: ErrorCodes.PERMISSION_DENIED };
    }
    return null;
  };
}

export function rateLimit(config: { windowMs: number; max: number }): MiddlewareFunction {
  return async (request, context) => {
    const key = context.user?.id || context.ip;
    const result = checkRateLimit(key, config);
    
    if (!result.allowed) {
      return { error: ErrorCodes.RATE_LIMITED };
    }
    
    return null;
  };
}
