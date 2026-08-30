// MASAR API Validators
// Zod-based request validation

import { z } from 'zod';

// ============================================================
// COMMON SCHEMAS
// ============================================================

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().optional(),
});

export const dateRangeSchema = z.object({
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export const sortingSchema = z.object({
  sortBy: z.enum(['created_at', 'updated_at', 'risk_level', 'value']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================================
// AUTH SCHEMAS
// ============================================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  organizationName: z.string().min(2, 'Organization name is required'),
  organizationType: z.enum(['BUYER', 'EXPORTER', 'INSPECTION_PARTNER', 'LABORATORY', 'FINANCIAL_PARTNER']),
  countryCode: z.string().length(2, 'Country code must be 2 characters'),
});

// ============================================================
// ORGANIZATION SCHEMAS
// ============================================================

export const createOrganizationSchema = z.object({
  legalName: z.string().min(2, 'Legal name is required'),
  tradingName: z.string().optional(),
  organizationType: z.enum([
    'BUYER', 'EXPORTER', 'SUPPLIER_SYNDICATE', 'INSPECTION_PARTNER',
    'LABORATORY', 'LOGISTICS_PARTNER', 'FINANCIAL_PARTNER',
    'CUSTOMS_BROKER', 'ADMIN', 'INSTITUTIONAL_PARTNER'
  ]),
  registrationNumber: z.string().optional(),
  countryCode: z.string().length(2),
  jurisdiction: z.string().optional(),
  taxIdentifier: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string(),
  postalCode: z.string().optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

// ============================================================
// TRANSACTION SCHEMAS
// ============================================================

export const createTransactionSchema = z.object({
  buyerOrganizationId: uuidSchema,
  exporterOrganizationId: uuidSchema,
  originCountry: z.string().length(2),
  destinationCountry: z.string().length(2),
  originLocation: z.string().optional(),
  destinationLocation: z.string().optional(),
  commodityId: uuidSchema,
  laneId: uuidSchema.optional(),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.enum(['MT', 'KG', 'TONNES']).default('MT'),
  currency: z.enum(['USD', 'NGN', 'SAR', 'AED']).default('USD'),
  estimatedValue: z.number().positive().optional(),
  contractValue: z.number().positive().optional(),
  incoterm: z.enum(['FOB', 'CIF', 'CFR', 'EXW', 'FCA']).optional(),
});

export const advanceTransactionSchema = z.object({
  targetState: z.string().min(1, 'Target state is required'),
  reason: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const transactionFiltersSchema = z.object({
  state: z.string().optional(),
  buyerId: uuidSchema.optional(),
  exporterId: uuidSchema.optional(),
  commodityId: uuidSchema.optional(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  ...dateRangeSchema.shape,
  ...paginationSchema.shape,
  ...sortingSchema.shape,
});

// ============================================================
// KYB SCHEMAS
// ============================================================

export const createKYBCaseSchema = z.object({
  organizationId: uuidSchema,
  transactionId: uuidSchema.optional(),
});

export const submitKYBSchema = z.object({
  legalName: z.string().min(2),
  registrationNumber: z.string().min(1),
  jurisdiction: z.string().min(2),
  businessType: z.string().min(1),
  shareholders: z.array(z.object({
    name: z.string(),
    ownershipPercentage: z.number().min(0).max(100),
    nationality: z.string().length(2),
  })).min(1),
  directors: z.array(z.object({
    name: z.string(),
    position: z.string(),
    nationality: z.string().length(2),
  })).optional(),
});

export const reviewKYBSchema = z.object({
  decision: z.enum(['auto_clear', 'human_review', 'blocked']),
  notes: z.string().optional(),
  riskScore: z.number().min(0).max(100).optional(),
});

export const approveKYBSchema = z.object({
  notes: z.string().min(1, 'Approval notes are required'),
});

export const rejectKYBSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required'),
});

// ============================================================
// COMPLIANCE SCHEMAS
// ============================================================

export const complianceFiltersSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'ready', 'exception', 'blocked']).optional(),
  transactionId: uuidSchema.optional(),
  ...paginationSchema.shape,
});

export const verifyDocumentSchema = z.object({
  approved: z.boolean(),
  notes: z.string().optional(),
  rejectionReason: z.string().optional(),
});

// ============================================================
// DOCUMENT SCHEMAS
// ============================================================

export const uploadDocumentSchema = z.object({
  transactionId: uuidSchema,
  documentType: z.enum([
    'BUYER_KYB', 'EXPORTER_KYB', 'CONTRACT', 'COMMERCIAL_INVOICE',
    'CERTIFICATE_OF_ORIGIN', 'PHYTOSANITARY_CERTIFICATE', 'CERTIFICATE_OF_ANALYSIS',
    'HEALTH_CERTIFICATE', 'HALAL_CERTIFICATE', 'ARABIC_LABEL_VERIFICATION',
    'INSPECTION_REPORT', 'SHIPMENT_DOCUMENTATION', 'DESTINATION_DOCUMENTATION',
    'SFDA_REGISTRATION', 'CUSTOMS_DECLARATION', 'PACKING_LIST',
    'BILL_OF_LADING', 'INSURANCE_CERTIFICATE', 'OTHER'
  ]),
  documentNumber: z.string().optional(),
  issuedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const documentFiltersSchema = z.object({
  transactionId: uuidSchema.optional(),
  documentType: z.string().optional(),
  status: z.enum(['expected', 'missing', 'uploaded', 'processing', 'verification_required', 'verified', 'rejected', 'expiring', 'expired']).optional(),
  ...paginationSchema.shape,
});

// ============================================================
// INSPECTION SCHEMAS
// ============================================================

export const createInspectionSchema = z.object({
  transactionId: uuidSchema,
  providerId: uuidSchema,
  inspectionType: z.enum([
    'PRE_SHIPMENT', 'ORIGIN', 'PORT_OF_ENTRY', 'QUALITY',
    'QUANTITY', 'CONDITION', 'SAMPLING', 'RE_INSPECTION'
  ]).default('PRE_SHIPMENT'),
  location: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const assignInspectorSchema = z.object({
  inspectorId: uuidSchema,
  notes: z.string().optional(),
});

export const submitResultsSchema = z.object({
  sampleId: uuidSchema,
  results: z.array(z.object({
    parameter: z.string(),
    value: z.number(),
    unit: z.string(),
    testType: z.string(),
    method: z.string().optional(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
  })).min(1),
});

export const completeInspectionSchema = z.object({
  result: z.enum(['pass', 'conditional', 'fail']),
  summary: z.string().min(1),
  findings: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
});

// ============================================================
// FINANCE SCHEMAS
// ============================================================

export const createFundingRequestSchema = z.object({
  transactionId: uuidSchema,
  requestedAmount: z.number().positive(),
  currency: z.enum(['USD', 'NGN', 'SAR']).default('USD'),
  advancePercentage: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export const approveFundingSchema = z.object({
  approvedAmount: z.number().positive(),
  notes: z.string().optional(),
});

export const rejectFundingSchema = z.object({
  reason: z.string().min(1),
});

// ============================================================
// RELEASE SCHEMAS
// ============================================================

export const requestReleaseSchema = z.object({
  transactionId: uuidSchema,
  approvers: z.array(z.object({
    userId: uuidSchema,
    role: z.string(),
  })).min(1),
  notes: z.string().optional(),
});

export const approveReleaseSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  notes: z.string().optional(),
});

// ============================================================
// SETTLEMENT SCHEMAS
// ============================================================

export const prepareSettlementSchema = z.object({
  transactionId: uuidSchema,
  waterfall: z.array(z.object({
    recipient: z.string(),
    type: z.enum(['capital_partner', 'masar_fees', 'exporter', 'variance']),
    amount: z.number().positive(),
    recipientOrganizationId: uuidSchema.optional(),
  })).min(1),
});

export const authorizeSettlementSchema = z.object({
  notes: z.string().optional(),
});

export const executeSettlementSchema = z.object({
  providerReference: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================================
// SHIPMENT SCHEMAS
// ============================================================

export const createShipmentSchema = z.object({
  transactionId: uuidSchema,
  carrier: z.string().optional(),
  vessel: z.string().optional(),
  voyage: z.string().optional(),
  containerCount: z.number().int().positive().default(1),
  containerNumbers: z.array(z.string()).optional(),
  sealNumbers: z.array(z.string()).optional(),
  estimatedDeparture: z.string().datetime().optional(),
  estimatedArrival: z.string().datetime().optional(),
  originPort: z.string().optional(),
  destinationPort: z.string().optional(),
});

export const addShipmentEventSchema = z.object({
  eventType: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  occurredAt: z.string().datetime().optional(),
});

// ============================================================
// TASK SCHEMAS
// ============================================================

export const createTaskSchema = z.object({
  transactionId: uuidSchema.optional(),
  taskType: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  assignedTo: uuidSchema.optional(),
  assignedRole: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  dueAt: z.string().datetime().optional(),
});

export const completeTaskSchema = z.object({
  notes: z.string().optional(),
});

export const escalateTaskSchema = z.object({
  escalatedTo: uuidSchema,
  reason: z.string().min(1),
});

// ============================================================
// NOTIFICATION SCHEMAS
// ============================================================

export const notificationFiltersSchema = z.object({
  unreadOnly: z.boolean().default(false),
  type: z.string().optional(),
  ...paginationSchema.shape,
});

export const markNotificationsSchema = z.object({
  notificationIds: z.array(uuidSchema).optional(),
  markAllRead: z.boolean().default(false),
});

// ============================================================
// EXCEPTION SCHEMAS
// ============================================================

export const createExceptionSchema = z.object({
  transactionId: uuidSchema,
  exceptionType: z.enum([
    'missing_document', 'expired_document', 'kyb_flag', 'sanctions_alert',
    'inspection_failure', 'quality_variance', 'finance_exception',
    'shipment_delay', 'port_exception', 'settlement_exception',
    'integration_failure', 'compliance_exception', 'other'
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  description: z.string().min(1),
  assignedTo: uuidSchema.optional(),
});

export const resolveExceptionSchema = z.object({
  resolution: z.string().min(1),
  notes: z.string().optional(),
});

export const escalateExceptionSchema = z.object({
  escalatedTo: uuidSchema,
  reason: z.string().min(1),
});

// ============================================================
// SEARCH SCHEMA
// ============================================================

export const searchSchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
  type: z.enum(['all', 'transactions', 'organizations', 'documents', 'inspections', 'invoices']).default('all'),
  ...paginationSchema.shape,
});

// ============================================================
// WEBHOOK SCHEMAS
// ============================================================

export const inspectionWebhookSchema = z.object({
  event_type: z.string(),
  inspection_id: uuidSchema,
  external_event_id: z.string(),
  payload: z.record(z.any()),
});

export const financeWebhookSchema = z.object({
  event_type: z.string(),
  external_event_id: z.string(),
  payload: z.record(z.any()),
});

// ============================================================
// VALIDATION HELPERS
// ============================================================

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}

export function formatValidationErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(err.message);
  });
  
  return formatted;
}

export function transformSnakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(transformSnakeToCamel);
  }
  
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = transformSnakeToCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  
  return obj;
}

export function transformCamelToSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(transformCamelToSnake);
  }
  
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      acc[snakeKey] = transformCamelToSnake(obj[key]);
      return acc;
    }, {} as any);
  }
  
  return obj;
}
