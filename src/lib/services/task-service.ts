// MASAR Task Service
import { supabase } from '@/lib/supabase/client';

class TaskService {
  async getTasks(filters?: { status?: string; transaction_id?: string }) {
    let query = supabase.from('tasks').select('*, assigned_user:assigned_to(full_name, email), transaction:transaction_id(transaction_number)').is('deleted_at', null);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.transaction_id) query = query.eq('transaction_id', filters.transaction_id);
    const { data, error } = await query.order('due_at', { ascending: true });
    if (error) throw error;
    return data;
  }

  async getMyTasks() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase.from('tasks').select('*, transaction:transaction_id(transaction_number)').eq('assigned_to', user.id).in('status', ['pending', 'in_progress']).is('deleted_at', null).order('due_at', { ascending: true });
    if (error) throw error;
    return data;
  }

  async completeTask(taskId: string, notes?: string) {
    const { data, error } = await supabase.rpc('complete_task', { p_task_id: taskId, p_completion_notes: notes });
    if (error) throw error;
    return data;
  }
}

export const taskService = new TaskService();
export default taskService;
