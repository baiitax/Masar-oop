-- MASAR Protocol Database - Migration 011
-- Finance Tables

-- Funding status enum
CREATE TYPE public.funding_status AS ENUM (
  'not_requested',
  'requested',
  'under_review',
  'approved',
  'declined',
  'funded',
  'released',
  'settled'
);

-- Escrow status enum
CREATE TYPE public.escrow_status AS ENUM (
  'not_initiated',
  'pending',
  'funded',
  'partially_released',
  'released',
  'disputed',
  'refunded'
);

-- Settlement status enum
CREATE TYPE public.settlement_status AS ENUM (
  'not_started',
  'pending',
  'processing',
  'completed',
  'failed',
  'disputed'
);

-- Funding requests table
CREATE TABLE public.funding_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  applicant_organization_id UUID NOT NULL REFERENCES public.organizations(id),
  requested_amount NUMERIC(20,4) NOT NULL CHECK (requested_amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  advance_percentage NUMERIC(5,2) CHECK (advance_percentage >= 0 AND advance_percentage <= 100),
  status public.funding_status DEFAULT 'not_requested',
  approved_amount NUMERIC(20,4) CHECK (approved_amount >= 0),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  provider_id UUID REFERENCES public.organizations(id),
  decline_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Funding commitments table
CREATE TABLE public.funding_commitments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  funding_request_id UUID NOT NULL REFERENCES public.funding_requests(id),
  provider_id UUID NOT NULL REFERENCES public.organizations(id),
  committed_amount NUMERIC(20,4) NOT NULL CHECK (committed_amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  yield_rate NUMERIC(10,4),
  yield_amount NUMERIC(20,4),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'drawn', 'released', 'cancelled')),
  confirmed_at TIMESTAMPTZ,
  drawn_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Escrow records table
CREATE TABLE public.escrow_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  provider_id UUID NOT NULL REFERENCES public.organizations(id),
  external_reference TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  expected_amount NUMERIC(20,4) NOT NULL CHECK (expected_amount > 0),
  confirmed_amount NUMERIC(20,4) CHECK (confirmed_amount >= 0),
  status public.escrow_status DEFAULT 'not_initiated',
  funded_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  provider_response JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT escrow_amounts_check CHECK (
    confirmed_amount IS NULL OR confirmed_amount <= expected_amount * 1.1
  )
);

-- Payment events table
CREATE TABLE public.payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  event_type TEXT NOT NULL,
  amount NUMERIC(20,4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  from_organization UUID REFERENCES public.organizations(id),
  to_organization UUID REFERENCES public.organizations(id),
  external_reference TEXT,
  provider_response JSONB,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fees table
CREATE TABLE public.fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  fee_type TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(20,4) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  recipient_organization_id UUID REFERENCES public.organizations(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invoiced', 'paid', 'waived')),
  invoiced_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settlements table
CREATE TABLE public.settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  settlement_reference TEXT UNIQUE NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  gross_amount NUMERIC(20,4) NOT NULL CHECK (gross_amount > 0),
  net_amount NUMERIC(20,4) CHECK (net_amount >= 0),
  status public.settlement_status DEFAULT 'not_started',
  authorized_at TIMESTAMPTZ,
  authorized_by UUID REFERENCES auth.users(id),
  executed_at TIMESTAMPTZ,
  provider_id UUID REFERENCES public.organizations(id),
  external_reference TEXT,
  e_invoice_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settlement items (waterfall) table
CREATE TABLE public.settlement_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  settlement_id UUID NOT NULL REFERENCES public.settlements(id) ON DELETE CASCADE,
  priority INTEGER NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('capital_partner', 'masar_fees', 'exporter', 'variance', 'other')),
  recipient TEXT NOT NULL,
  recipient_organization_id UUID REFERENCES public.organizations(id),
  amount NUMERIC(20,4) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'held', 'disputed')),
  paid_at TIMESTAMPTZ,
  external_reference TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(settlement_id, priority)
);

-- Financial variances table
CREATE TABLE public.financial_variances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  settlement_id UUID REFERENCES public.settlements(id),
  variance_type TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(20,4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated')),
  resolution TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_funding_requests_transaction ON public.funding_requests(transaction_id);
CREATE INDEX idx_funding_requests_applicant ON public.funding_requests(applicant_organization_id);
CREATE INDEX idx_funding_requests_status ON public.funding_requests(status);
CREATE INDEX idx_funding_commitments_request ON public.funding_commitments(funding_request_id);
CREATE INDEX idx_funding_commitments_provider ON public.funding_commitments(provider_id);
CREATE INDEX idx_escrow_records_transaction ON public.escrow_records(transaction_id);
CREATE INDEX idx_escrow_records_status ON public.escrow_records(status);
CREATE INDEX idx_payment_events_transaction ON public.payment_events(transaction_id);
CREATE INDEX idx_fees_transaction ON public.fees(transaction_id);
CREATE INDEX idx_fees_status ON public.fees(status);
CREATE INDEX idx_settlements_transaction ON public.settlements(transaction_id);
CREATE INDEX idx_settlements_status ON public.settlements(status);
CREATE INDEX idx_settlement_items_settlement ON public.settlement_items(settlement_id);
CREATE INDEX idx_financial_variances_transaction ON public.financial_variances(transaction_id);

-- Enable RLS
ALTER TABLE public.funding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_variances ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Funding requests viewable by transaction participants"
  ON public.funding_requests FOR SELECT
  USING (
    applicant_organization_id IN (SELECT public.get_user_organization_ids())
    OR provider_id IN (SELECT public.get_user_organization_ids())
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
      AND r.code IN ('SUPER_ADMIN', 'TRADE_FINANCE', 'CFO', 'OPERATIONS', 'AUDITOR')
      AND om.status = 'active'
    )
  );

CREATE POLICY "Escrow records viewable by transaction participants"
  ON public.escrow_records FOR SELECT
  USING (
    provider_id IN (SELECT public.get_user_organization_ids())
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
      AND r.code IN ('SUPER_ADMIN', 'TRADE_FINANCE', 'CFO', 'AUDITOR')
      AND om.status = 'active'
    )
  );

CREATE POLICY "Settlements viewable by transaction participants"
  ON public.settlements FOR SELECT
  USING (
    EXISTS (
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
      AND r.code IN ('SUPER_ADMIN', 'TRADE_FINANCE', 'CFO', 'OPERATIONS', 'AUDITOR')
      AND om.status = 'active'
    )
  );

CREATE POLICY "Settlement items viewable with settlement"
  ON public.settlement_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.settlements s
      WHERE s.id = settlement_id
      AND (
        EXISTS (
          SELECT 1 FROM public.transactions t
          WHERE t.id = s.transaction_id
          AND (
            t.buyer_organization_id IN (SELECT public.get_user_organization_ids())
            OR t.exporter_organization_id IN (SELECT public.get_user_organization_ids())
          )
        )
        OR EXISTS (
          SELECT 1 FROM public.organization_members om
          JOIN public.roles r ON om.role_id = r.id
          WHERE om.user_id = auth.uid()
          AND r.code IN ('SUPER_ADMIN', 'TRADE_FINANCE', 'CFO', 'AUDITOR')
          AND om.status = 'active'
        )
      )
    )
  );

-- Create triggers
CREATE TRIGGER set_funding_requests_updated_at
  BEFORE UPDATE ON public.funding_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_escrow_records_updated_at
  BEFORE UPDATE ON public.escrow_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_settlements_updated_at
  BEFORE UPDATE ON public.settlements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_financial_variances_updated_at
  BEFORE UPDATE ON public.financial_variances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate settlement reference
CREATE OR REPLACE FUNCTION public.generate_settlement_reference()
RETURNS TEXT AS $$
DECLARE
  v_sequence INTEGER;
  v_reference TEXT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(settlement_reference FROM '\d+$') AS INTEGER)
  ), 0) + 1
  INTO v_sequence
  FROM public.settlements
  WHERE settlement_reference LIKE 'SETTLE-' || EXTRACT(YEAR FROM NOW()) || '-%';
  
  v_reference := 'SETTLE-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(v_sequence::TEXT, 6, '0');
  
  RETURN v_reference;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.funding_requests IS 'Trade financing requests';
COMMENT ON TABLE public.funding_commitments IS 'Capital partner funding commitments';
COMMENT ON TABLE public.escrow_records IS 'Escrow account tracking (managed by licensed partner)';
COMMENT ON TABLE public.payment_events IS 'Payment event log';
COMMENT ON TABLE public.fees IS 'Platform and service fees';
COMMENT ON TABLE public.settlements IS 'Transaction settlements';
COMMENT ON TABLE public.settlement_items IS 'Settlement waterfall items';
COMMENT ON TABLE public.financial_variances IS 'Financial variance cases';
