// MASAR API - Documents
import { NextRequest } from 'next/server';
import { executeMiddlewareChain, requireAuth, requirePermission, rateLimit, successResponse, createdResponse, errorResponse, ErrorCodes } from '@/lib/api/middleware';
import { supabaseAdmin } from '@/lib/supabase/server';
import { validateRequest, uploadDocumentSchema, documentFiltersSchema, formatValidationErrors, transformSnakeToCamel } from '@/lib/api/validators';
import { apiConfig } from '@/lib/api/config';

// POST /api/v1/documents - Upload document
export async function POST(request: NextRequest) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('document.upload'),
    rateLimit(apiConfig.rateLimits.upload),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = JSON.parse(formData.get('metadata') as string || '{}');

    if (!file) return errorResponse({ ...ErrorCodes.VALIDATION_ERROR, message: 'File is required' }, context.requestId);

    const validation = validateRequest(uploadDocumentSchema, metadata);
    if (!validation.success) {
      return errorResponse({ ...ErrorCodes.VALIDATION_ERROR, details: formatValidationErrors(validation.errors!) }, context.requestId);
    }

    const orgId = user!.currentOrganization?.id;
    if (!orgId) return errorResponse(ErrorCodes.TENANT_ACCESS_DENIED, context.requestId);

    // Upload to storage
    const filePath = `${validation.data!.transactionId}/${validation.data!.documentType}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabaseAdmin.storage.from('compliance-documents').upload(filePath, file);
    if (uploadError) throw uploadError;

    // Create document record
    const { data: document, error: insertError } = await supabaseAdmin
      .from('documents')
      .insert({
        transaction_id: validation.data!.transactionId,
        organization_id: orgId,
        document_type: validation.data!.documentType,
        document_number: validation.data!.documentNumber,
        file_name: file.name,
        storage_path: filePath,
        mime_type: file.type,
        file_size: file.size,
        status: 'uploaded',
        uploaded_by: user!.id,
        issued_at: validation.data!.issuedAt,
        expires_at: validation.data!.expiresAt,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Create protocol event
    await supabaseAdmin.rpc('create_protocol_event', {
      p_transaction_id: validation.data!.transactionId,
      p_event_type: 'DOCUMENT_UPLOADED',
      p_event_source: 'api',
      p_actor_user_id: user!.id,
      p_payload: { document_id: document.id, document_type: validation.data!.documentType },
    });

    return createdResponse(transformSnakeToCamel(document), { requestId: context.requestId });
  } catch (err: any) {
    console.error('Upload document error:', err);
    return errorResponse(err.code ? err : { ...ErrorCodes.INTERNAL_ERROR, message: 'Failed to upload document' }, context.requestId);
  }
}

// GET /api/v1/documents - List documents
export async function GET(request: NextRequest) {
  const { error, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    requirePermission('document.read'),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      transactionId: searchParams.get('transactionId') || undefined,
      documentType: searchParams.get('documentType') || undefined,
      status: searchParams.get('status') || undefined,
      limit: parseInt(searchParams.get('limit') || '25'),
    };

    let query = supabaseAdmin
      .from('documents')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(Math.min(filters.limit, 100));

    if (filters.transactionId) query = query.eq('transaction_id', filters.transactionId);
    if (filters.documentType) query = query.eq('document_type', filters.documentType);
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error: fetchError } = await query;
    if (fetchError) throw fetchError;

    return successResponse(transformSnakeToCamel(data), { requestId: context.requestId });
  } catch (err: any) {
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}
