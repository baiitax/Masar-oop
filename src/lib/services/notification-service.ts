// MASAR Notification Service
import { supabase } from '@/lib/supabase/client';

class NotificationService {
  async getNotifications(limit: number = 50) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return data;
  }

  async getUnreadCount() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return 0;
    const { count, error } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).is('read_at', null);
    if (error) throw error;
    return count || 0;
  }

  async markAsRead(notificationId: string) {
    const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', notificationId);
    if (error) throw error;
  }

  async markAllAsRead() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');
    const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', user.id).is('read_at', null);
    if (error) throw error;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
