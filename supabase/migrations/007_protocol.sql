-- MASAR Protocol Database - Migration 007
-- Protocol Engine Tables

-- Protocol events table (immutable event log)
CREATE TABLE public.protocol_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  event_type TEXT NOT NULL,
  event_source TEXT DEFAULT 'system',
  actor_user_id UUID REFERENCES auth.users(id),
  actor_organization_id UUID REFERENCES public.organizations(id),
  payload JSONB DEFAULT '{}',
  previous_event_id UUID REFERENCES public.protocol_events(id),
  event_hash TEXT,
  previous_hash TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT protocol_events_type_check CHECK (length(event_type) > 0)
);

-- Protocol conditions table
CREATE TABLE public.protocol_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  condition_code TEXT NOT NULL,
  condition_name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'satisfied', 'failed', 'waived', 'blocked')),
  required BOOLEAN DEFAULT TRUE,
  satisfied_at TIMESTAMPTZ,
  satisfied_by UUID REFERENCES auth.users(id),
  evidence_id UUID,
  failure_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(transaction_id, condition_code)
);

-- Release policies table
CREATE TABLE public.release_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  lane_id UUID REFERENCES public.trade_lanes(id),
  commodity_id UUID REFERENCES public.commodities(id),
  transaction_type public.transaction_type,
  risk_class public.risk_level,
  value_band_min NUMERIC(20,4),
  value_band_max NUMERIC(20,4),
  active BOOLEAN DEFAULT TRUE,
  version TEXT DEFAULT '1.0',
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Release conditions table
CREATE TABLE public.release_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES public.release_policies(id) ON DELETE CASCADE,
  condition_code TEXT NOT NULL,
  condition_name TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 0,
  required BOOLEAN DEFAULT TRUE,
  automatic_check BOOLEAN DEFAULT FALSE,
  human_approval_required BOOLEAN DEFAULT FALSE,
  dual_approval_required BOOLEAN DEFAULT FALSE,
  check_function TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(policy_id, condition_code)
);

-- Release approvals table
CREATE TABLE public.release_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  policy_id UUID NOT NULL REFERENCES public.release_policies(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'held')),
  required_approvals INTEGER DEFAULT 1,
  decision TEXT,
  decided_at TIMESTAMPTZ,
  decided_by UUID REFERENCES auth.users(id),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Release approval votes table
CREATE TABLE public.release_approval_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  approval_id UUID NOT NULL REFERENCES public.release_approvals(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES auth.users(id),
  decision TEXT DEFAULT 'pending' CHECK (decision IN ('pending', 'approved', 'rejected', 'abstained')),
  decided_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(approval_id, approver_id)
);

-- Automation rules table
CREATE TABLE public.automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_event TEXT NOT NULL,
  conditions JSONB DEFAULT '[]',
  actions JSONB DEFAULT '[]',
  priority INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  version TEXT DEFAULT '1.0',
  effective_from TIMESTAMPTZ DEFAULT NOW(),
  effective_to TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation rule versions table
CREATE TABLE public.automation_rule_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id UUID NOT NULL REFERENCES public.automation_rules(id),
  version TEXT NOT NULL,
  conditions JSONB,
  actions JSONB,
  effective_from TIMESTAMPTZ NOT NULL,
  effective_to TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_protocol_events_transaction ON public.protocol_events(transaction_id);
CREATE INDEX idx_protocol_events_type ON public.protocol_events(event_type);
CREATE INDEX idx_protocol_events_occurred ON public.protocol_events(occurred_at);
CREATE INDEX idx_protocol_events_actor ON public.protocol_events(actor_user_id);
CREATE INDEX idx_protocol_conditions_transaction ON public.protocol_conditions(transaction_id);
CREATE INDEX idx_protocol_conditions_code ON public.protocol_conditions(condition_code);
CREATE INDEX idx_protocol_conditions_status ON public.protocol_conditions(status);
CREATE INDEX idx_release_policies_lane ON public.release_policies(lane_id);
CREATE INDEX idx_release_policies_commodity ON public.release_policies(commodity_id);
CREATE INDEX idx_release_conditions_policy ON public.release_conditions(policy_id);
CREATE INDEX idx_release_approvals_transaction ON public.release_approvals(transaction_id);
CREATE INDEX idx_release_approvals_status ON public.release_approvals(status);
CREATE INDEX idx_release_approval_votes_approval ON public.release_approval_votes(approval_id);
CREATE INDEX idx_automation_rules_code ON public.automation_rules(rule_code);
CREATE INDEX idx_automation_rules_trigger ON public.automation_rules(trigger_event);
CREATE INDEX idx_automation_rules_active ON public.automation_rules(active) WHERE active = TRUE;

-- Enable RLS
ALTER TABLE public.protocol_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_approval_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rule_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for protocol events (append-only, viewable by transaction participants)
CREATE POLICY "Protocol events viewable by transaction participants"
  ON public.protocol_events FOR SELECT
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

CREATE POLICY "Protocol events can be created by system"
  ON public.protocol_events FOR INSERT
  WITH CHECK (TRUE); -- System functions will insert

-- RLS Policies for protocol conditions
CREATE POLICY "Protocol conditions viewable by transaction participants"
  ON public.protocol_conditions FOR SELECT
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

CREATE POLICY "Protocol conditions can be created by system"
  ON public.protocol_conditions FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Protocol conditions can be updated by system"
  ON public.protocol_conditions FOR UPDATE
  USING (TRUE);

-- RLS Policies for release tables
CREATE POLICY "Release policies viewable by authenticated users"
  ON public.release_policies FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

CREATE POLICY "Release conditions viewable by authenticated users"
  ON public.release_conditions FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

CREATE POLICY "Release approvals viewable by transaction participants"
  ON public.release_approvals FOR SELECT
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
          AND r.code IN ('SUPER_ADMIN', 'OPERATIONS', 'FINANCE', 'CFO')
          AND om.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Release approvals can be created by authorized users"
  ON public.release_approvals FOR INSERT
  WITH CHECK (
    public.user_has_permission('release.evaluate')
  );

CREATE POLICY "Release approval votes viewable by approval participants"
  ON public.release_approval_votes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.release_approvals ra
      JOIN public.transactions t ON ra.transaction_id = t.id
      WHERE ra.id = approval_id
      AND (
        approver_id = auth.uid()
        OR t.buyer_organization_id IN (SELECT public.get_user_organization_ids())
        OR t.exporter_organization_id IN (SELECT public.get_user_organization_ids())
        OR EXISTS (
          SELECT 1 FROM public.organization_members om
          JOIN public.roles r ON om.role_id = r.id
          WHERE om.user_id = auth.uid()
          AND r.code IN ('SUPER_ADMIN', 'OPERATIONS')
          AND om.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Release approval votes can be created by approvers"
  ON public.release_approval_votes FOR INSERT
  WITH CHECK (
    approver_id = auth.uid()
    AND public.user_has_permission('release.approve')
  );

-- RLS Policies for automation rules (admin only)
CREATE POLICY "Automation rules viewable by authenticated users"
  ON public.automation_rules FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

CREATE POLICY "Automation rules manageable by admins"
  ON public.automation_rules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.user_id = auth.uid()
      AND om.role_id IN (SELECT id FROM public.roles WHERE code IN ('SUPER_ADMIN', 'CTO'))
      AND om.status = 'active'
    )
  );

-- Create triggers
CREATE TRIGGER set_protocol_conditions_updated_at
  BEFORE UPDATE ON public.protocol_conditions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_release_approvals_updated_at
  BEFORE UPDATE ON public.release_approvals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_automation_rules_updated_at
  BEFORE UPDATE ON public.automation_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create protocol event with hash chain
CREATE OR REPLACE FUNCTION public.create_protocol_event(
  p_transaction_id UUID,
  p_event_type TEXT,
  p_event_source TEXT DEFAULT 'system',
  p_actor_user_id UUID DEFAULT NULL,
  p_actor_organization_id UUID DEFAULT NULL,
  p_payload JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_previous_event_id UUID;
  v_previous_hash TEXT;
  v_new_hash TEXT;
  v_event_id UUID;
BEGIN
  -- Get previous event for hash chain
  SELECT id, event_hash
  INTO v_previous_event_id, v_previous_hash
  FROM public.protocol_events
  WHERE transaction_id = p_transaction_id
  ORDER BY occurred_at DESC, created_at DESC
  LIMIT 1;
  
  -- Generate hash
  v_new_hash := public.generate_hash(
    p_transaction_id::TEXT || 
    p_event_type || 
    COALESCE(p_actor_user_id::TEXT, '') || 
    NOW()::TEXT ||
    COALESCE(v_previous_hash, '')
  );
  
  -- Insert event
  INSERT INTO public.protocol_events (
    transaction_id,
    event_type,
    event_source,
    actor_user_id,
    actor_organization_id,
    payload,
    previous_event_id,
    event_hash,
    previous_hash
  ) VALUES (
    p_transaction_id,
    p_event_type,
    p_event_source,
    p_actor_user_id,
    p_actor_organization_id,
    p_payload,
    v_previous_event_id,
    v_new_hash,
    v_previous_hash
  )
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.protocol_events IS 'Immutable protocol event log with hash chain';
COMMENT ON TABLE public.protocol_conditions IS 'Transaction release conditions tracking';
COMMENT ON TABLE public.release_policies IS 'Configurable release policies by lane/commodity/value';
COMMENT ON TABLE public.release_conditions IS 'Individual release conditions within policies';
COMMENT ON TABLE public.release_approvals IS 'Release approval requests';
COMMENT ON TABLE public.release_approval_votes IS 'Individual approval votes';
COMMENT ON TABLE public.automation_rules IS 'Workflow automation rules';
