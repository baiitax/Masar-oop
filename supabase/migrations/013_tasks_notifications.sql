-- MASAR Protocol Database - Migration 013
-- Tasks and Notifications

-- Task status enum
CREATE TYPE public.task_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'cancelled',
  'overdue'
);

-- Task priority enum
CREATE TYPE public.task_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES public.transactions(id),
  case_id UUID,
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  assigned_role TEXT,
  assigned_organization_id UUID REFERENCES public.organizations(id),
  priority public.task_priority DEFAULT 'medium',
  status public.task_status DEFAULT 'pending',
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  completion_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Notification channel enum
CREATE TYPE public.notification_channel AS ENUM (
  'in_app',
  'email',
  'sms',
  'whatsapp',
  'webhook'
);

-- Notification severity enum
CREATE TYPE public.notification_severity AS ENUM (
  'info',
  'warning',
  'alert',
  'action_required'
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  organization_id UUID REFERENCES public.organizations(id),
  transaction_id UUID REFERENCES public.transactions(id),
  task_id UUID REFERENCES public.tasks(id),
  notification_type TEXT NOT NULL,
  channel public.notification_channel DEFAULT 'in_app',
  title TEXT NOT NULL,
  message TEXT,
  severity public.notification_severity DEFAULT 'info',
  action_url TEXT,
  action_label TEXT,
  read_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  channels public.notification_channel[] DEFAULT '{in_app}',
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, notification_type)
);

-- Create indexes
CREATE INDEX idx_tasks_transaction ON public.tasks(transaction_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_due_at ON public.tasks(due_at);
CREATE INDEX idx_tasks_deleted_at ON public.tasks(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_transaction ON public.notifications(transaction_id);
CREATE INDEX idx_notifications_read ON public.notifications(read_at) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_created ON public.notifications(created_at);
CREATE INDEX idx_notification_preferences_user ON public.notification_preferences(user_id);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Tasks viewable by assigned user or transaction participants"
  ON public.tasks FOR SELECT
  USING (
    deleted_at IS NULL AND (
      assigned_to = auth.uid()
      OR assigned_organization_id IN (SELECT public.get_user_organization_ids())
      OR EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.id = transaction_id
        AND (
          t.buyer_organization_id IN (SELECT public.get_user_organization_ids())
          OR t.exporter_organization_id IN (SELECT public.get_user_organization_ids())
        )
      )
      OR EXISTS (
        SELECT 1 FROM public.organization_members om
        JOIN public.roles r ON om.role_id = r.id
        WHERE om.user_id = auth.uid()
        AND r.code IN ('SUPER_ADMIN', 'OPERATIONS')
        AND om.status = 'active'
      )
    )
  );

CREATE POLICY "Tasks can be created by system or authorized users"
  ON public.tasks FOR INSERT
  WITH CHECK (TRUE); -- System functions will insert

CREATE POLICY "Tasks can be updated by assigned user"
  ON public.tasks FOR UPDATE
  USING (
    assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.roles r ON om.role_id = r.id
      WHERE om.user_id = auth.uid()
      AND r.code IN ('SUPER_ADMIN', 'OPERATIONS')
      AND om.status = 'active'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Notifications viewable by owner"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Notifications can be created by system"
  ON public.notifications FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Notifications can be updated by owner"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- RLS Policies for notification preferences
CREATE POLICY "Notification preferences viewable by owner"
  ON public.notification_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Notification preferences manageable by owner"
  ON public.notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- Create triggers
CREATE TRIGGER set_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create task
CREATE OR REPLACE FUNCTION public.create_task(
  p_transaction_id UUID,
  p_task_type TEXT,
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_assigned_to UUID DEFAULT NULL,
  p_assigned_role TEXT DEFAULT NULL,
  p_assigned_organization_id UUID DEFAULT NULL,
  p_priority public.task_priority DEFAULT 'medium',
  p_due_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_task_id UUID;
BEGIN
  INSERT INTO public.tasks (
    transaction_id,
    task_type,
    title,
    description,
    assigned_to,
    assigned_role,
    assigned_organization_id,
    priority,
    due_at
  ) VALUES (
    p_transaction_id,
    p_task_type,
    p_title,
    p_description,
    p_assigned_to,
    p_assigned_role,
    p_assigned_organization_id,
    p_priority,
    p_due_at
  )
  RETURNING id INTO v_task_id;
  
  -- Create notification for assigned user
  IF p_assigned_to IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      transaction_id,
      task_id,
      notification_type,
      title,
      message,
      severity,
      action_url,
      action_label
    ) VALUES (
      p_assigned_to,
      p_transaction_id,
      v_task_id,
      'task_assigned',
      'New Task: ' || p_title,
      COALESCE(p_description, 'You have been assigned a new task'),
      CASE 
        WHEN p_priority = 'critical' THEN 'alert'::public.notification_severity
        WHEN p_priority = 'high' THEN 'action_required'::public.notification_severity
        ELSE 'info'::public.notification_severity
      END,
      '/tasks/' || v_task_id,
      'View Task'
    );
  END IF;
  
  RETURN v_task_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete task
CREATE OR REPLACE FUNCTION public.complete_task(
  p_task_id UUID,
  p_completion_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.tasks
  SET 
    status = 'completed',
    completed_at = NOW(),
    completed_by = auth.uid(),
    completion_notes = p_completion_notes
  WHERE id = p_task_id
  AND (assigned_to = auth.uid() OR EXISTS (
    SELECT 1 FROM public.organization_members om
    JOIN public.roles r ON om.role_id = r.id
    WHERE om.user_id = auth.uid()
    AND r.code IN ('SUPER_ADMIN', 'OPERATIONS')
    AND om.status = 'active'
  ));
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.tasks IS 'Workflow tasks requiring human action';
COMMENT ON TABLE public.notifications IS 'User notifications';
COMMENT ON TABLE public.notification_preferences IS 'User notification preferences';
