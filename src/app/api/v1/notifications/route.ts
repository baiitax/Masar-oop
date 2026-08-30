// MASAR API - Notifications
import { NextRequest } from 'next/server';
import { executeMiddlewareChain, requireAuth, rateLimit, successResponse, errorResponse, ErrorCodes, noContentResponse } from '@/lib/api/middleware';
import { supabaseAdmin } from '@/lib/supabase/server';
import { validateRequest, notificationFiltersSchema, markNotificationsSchema, transformSnakeToCamel } from '@/lib/api/validators';
import { apiConfig } from '@/lib/api/config';

// GET /api/v1/notifications
export async function GET(request: NextRequest) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) query = query.is('read_at', null);

    const { data, error: fetchError } = await query;
    if (fetchError) throw fetchError;

    const { count: unreadCount } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user!.id)
      .is('read_at', null);

    return successResponse({
      notifications: transformSnakeToCamel(data),
      unreadCount: unreadCount || 0,
    }, { requestId: context.requestId });
  } catch (err: any) {
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}

// PATCH /api/v1/notifications - Mark as read
export async function PATCH(request: NextRequest) {
  const { error, user, context } = await executeMiddlewareChain(request, [
    requireAuth(),
    rateLimit(apiConfig.rateLimits.default),
  ]);

  if (error) return errorResponse(error, context.requestId);

  try {
    const body = await request.json();
    const validation = validateRequest(markNotificationsSchema, body);
    if (!validation.success) return errorResponse({ ...ErrorCodes.VALIDATION_ERROR }, context.requestId);

    if (validation.data!.markAllRead) {
      await supabaseAdmin
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', user!.id)
        .is('read_at', null);
    } else if (validation.data!.notificationIds?.length) {
      await supabaseAdmin
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .in('id', validation.data!.notificationIds)
        .eq('user_id', user!.id);
    }

    return noContentResponse();
  } catch (err: any) {
    return errorResponse(ErrorCodes.INTERNAL_ERROR, context.requestId);
  }
}
