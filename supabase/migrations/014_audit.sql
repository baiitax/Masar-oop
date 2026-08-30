-- MASAR Protocol Database - Migration 014
-- Audit and Exceptions

-- Audit logs table (immutable)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES auth.users(id),
  actor_organization_id UUID REFERENCES public.organizations(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  transaction_id UUID REFERENCES public.transactions(id),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  request_id TEXT,
  event_hash TEXT,
  previous_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT audit_logs_action_check CHECK (length(action) > 0),
  CONSTRAINT audit_logs_entity_type_check CHECK (length(entity_type) > 0)
);

-- Exceptions table
CREATE TYPE public.exception_type AS ENUM (
  'missing_document',
  'expired_document',
  'kyb_flag',
  'sanctions_alert',
  'inspection_failure',
  'quality_variance',
  'finance_exception',
  'shipment_delay',
  'port_exception',
  'settlement_exception',
  'integration_failure',
  'compliance_exception',
  'other'
);

CREATE TYPE public.exception_severity AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TABLE public.exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  exception_type public.exception_type NOT NULL,
  severity public.exception_severity DEFAULT 'medium',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated', 'closed')),
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  assigned_organization_id UUID REFERENCES public.organizations(id),
  sla_deadline TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  resolution TEXT,
  resolution_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes table
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  dispute_number TEXT UNIQUE NOT NULL,
  dispute_type TEXT NOT NULL,
  claimant_organization_id UUID NOT NULL REFERENCES public.organizations(id),
  respondent_organization_id UUID NOT NULL REFERENCES public.organizations(id),
  amount NUMERIC(20,4),
  currency TEXT DEFAULT 'USD',
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'mediation', 'arbitration', 'resolved', 'closed')),
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  resolution_deadline TIMESTAMPTZ,
  resolution TEXT,
  resolution_type TEXT CHECK (resolution_type IN ('accept', 'price_adjustment', 'reinspection', 'rework', 'subgrade_sale', 'refund', 'partial_refund', 'arbitration')),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT disputes_parties_check CHECK (claimant_organization_id != respondent_organization_id)
);

-- SLA policies table
CREATE TABLE public.sla_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  target_hours INTEGER NOT NULL CHECK (target_hours > 0),
  warning_threshold NUMERIC(5,2) DEFAULT 70 CHECK (warning_threshold >= 0 AND warning_threshold <= 100),
  critical_threshold NUMERIC(5,2) DEFAULT 85 CHECK (critical_threshold >= 0 AND critical_threshold <= 100),
  escalation_policy TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SLA instances table
CREATE TABLE public.sla_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES public.sla_policies(id),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  case_id UUID,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  target_at TIMESTAMPTZ NOT NULL,
  warning_at TIMESTAMPTZ,
  critical_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'warning', 'critical', 'breached', 'completed', 'cancelled')),
  breached_at TIMESTAMPTZ,
  escalated_to UUID REFERENCES auth.users(id),
  escalated_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System events table
CREATE TABLE public.system_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
  source TEXT,
  message TEXT,
  details JSONB,
  stack_trace TEXT,
  request_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_transaction ON public.audit_logs(transaction_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_exceptions_transaction ON public.exceptions(transaction_id);
CREATE INDEX idx_exceptions_type ON public.exceptions(exception_type);
CREATE INDEX idx_exceptions_status ON public.exceptions(status);
CREATE INDEX idx_exceptions_assigned ON public.exceptions(assigned_to);
CREATE INDEX idx_exceptions_severity ON public.exceptions(severity);
CREATE INDEX idx_disputes_transaction ON public.disputes(transaction_id);
CREATE INDEX idx_disputes_status ON public.disputes(status);
CREATE INDEX idx_disputes_number ON public.disputes(dispute_number);
CREATE INDEX idx_sla_policies_code ON public.sla_policies(policy_code);
CREATE INDEX idx_sla_instances_policy ON public.sla_instances(policy_id);
CREATE INDEX idx_sla_instances_transaction ON public.sla_instances(transaction_id);
CREATE INDEX idx_sla_instances_status ON public.sla_instances(status);
CREATE INDEX idx_sla_instances_target ON public.sla_instances(target_at);
CREATE INDEX idx_system_events_type ON public.system_events(event_type);
CREATE INDEX idx_system_events_severity ON public.system_events(severity);
CREATE INDEX idx_system_events_created ON public.system_events(created_at);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit logs (append-only, viewable by authorized users)
CREATE POLICY "Audit logs viewable by authorized users"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.roles r ON om.role_id = r.id
      WHERE om.user_id = auth.uid()
      AND r.code IN ('SUPER_ADMIN', 'OPERATIONS', 'COMPLIANCE', 'AUDITOR', 'CTO')
      AND om.status = 'active'
    )
    OR EXISTS (
      SELECT 1 FROM public.transactions t
      WHERE t.id = transaction_id
      AND (
        t.buyer_organization_id IN (SELECT public.get_user_organization_ids())
        OR t.exporter_organization_id IN (SELECT public.get_user_organization_ids())
      )
    )
  );

CREATE POLICY "Audit logs can be created by system"
  ON public.audit_logs FOR INSERT
  WITH CHECK (TRUE);

-- No update or delete on audit logs
-- This is enforced by not creating UPDATE/DELETE policies

-- RLS Policies for exceptions
CREATE POLICY "Exceptions viewable by transaction participants"
  ON public.exceptions FOR SELECT
  USING (
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
      AND r.code IN ('SUPER_ADMIN', 'OPERATIONS', 'COMPLIANCE', 'AUDITOR')
      AND om.status = 'active'
    )
  );

CREATE POLICY "Exceptions can be created by system"
  ON public.exceptions FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Exceptions can be updated by assigned user"
  ON public.exceptions FOR UPDATE
  USING (
    assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.roles r ON om.role_id = r.id
      WHERE om.user_id = auth.uid()
      AND r.code IN ('SUPER_ADMIN', 'OPERATIONS', 'COMPLIANCE')
      AND om.status = 'active'
    )
  );

-- RLS Policies for disputes
CREATE POLICY "Disputes viewable by parties and authorized users"
  ON public.disputes FOR SELECT
  USING (
    claimant_organization_id IN (SELECT public.get_user_organization_ids())
    OR respondent_organization_id IN (SELECT public.get_user_organization_ids())
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.roles r ON om.role_id = r.id
      WHERE om.user_id = auth.uid()
      AND r.code IN ('SUPER_ADMIN', 'OPERATIONS', 'COMPLIANCE', 'CFO', 'AUDITOR')
      AND om.status = 'active'
    )
  );

-- RLS Policies for SLA
CREATE POLICY "SLA policies viewable by authenticated users"
  ON public.sla_policies FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

CREATE POLICY "SLA instances viewable by transaction participants"
  ON public.sla_instances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.transactions t
      WHERE t.id = transaction_id
      AND (
        t.buyer_organization_id IN (SELECT public.get_user_organization_ids())
        OR t.exporter_organization_id IN (SELECT public.get_user_organization_ids())
        OR EXISTS (
          SELECT 1 FROM public.organization_members om
          JOIN public.roles r ON om.role_id = r.id
          WHERE om.user_id = auth.uid()
          AND r.code IN ('SUPER_ADMIN', 'OPERATIONS', 'COMPLIANCE', 'AUDITOR')
          AND om.status = 'active'
        )
      )
    )
  );

-- RLS Policies for system events (admin only)
CREATE POLICY "System events viewable by admins"
  ON public.system_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.roles r ON om.role_id = r.id
      WHERE om.user_id = auth.uid()
      AND r.code IN ('SUPER_ADMIN', 'CTO')
      AND om.status = 'active'
    )
  );

-- Create triggers
CREATE TRIGGER set_exceptions_updated_at
  BEFORE UPDATE ON public.exceptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_disputes_updated_at
  BEFORE UPDATE ON public.disputes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_sla_instances_updated_at
  BEFORE UPDATE ON public.sla_instances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create audit log
CREATE OR REPLACE FUNCTION public.create_audit_log(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_transaction_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
  v_previous_hash TEXT;
  v_new_hash TEXT;
  v_actor_org_id UUID;
BEGIN
  -- Get actor's primary organization
  SELECT organization_id INTO v_actor_org_id
  FROM public.organization_members
  WHERE user_id = auth.uid()
  AND is_primary = TRUE
  AND status = 'active'
  LIMIT 1;
  
  -- Get previous hash for chain
  SELECT event_hash INTO v_previous_hash
  FROM public.audit_logs
  WHERE transaction_id = p_transaction_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Generate hash
  v_new_hash := public.generate_hash(
    COALESCE(auth.uid()::TEXT, '') ||
    p_action ||
    p_entity_type ||
    COALESCE(p_entity_id::TEXT, '') ||
    NOW()::TEXT ||
    COALESCE(v_previous_hash, '')
  );
  
  INSERT INTO public.audit_logs (
    actor_user_id,
    actor_organization_id,
    action,
    entity_type,
    entity_id,
    transaction_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    event_hash,
    previous_hash
  ) VALUES (
    auth.uid(),
    v_actor_org_id,
    p_action,
    p_entity_type,
    p_entity_id,
    p_transaction_id,
    p_old_values,
    p_new_values,
    p_ip_address,
    p_user_agent,
    v_new_hash,
    v_previous_hash
  )
  RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.audit_logs IS 'Immutable audit trail with hash chain';
COMMENT ON TABLE public.exceptions IS 'Transaction exceptions and cases';
COMMENT ON TABLE public.disputes IS 'Transaction disputes';
COMMENT ON TABLE public.sla_policies IS 'SLA policy definitions';
COMMENT ON TABLE public.sla_instances IS 'SLA tracking instances';
COMMENT ON TABLE public.system_events IS 'System-level events and errors';
