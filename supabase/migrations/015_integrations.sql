-- MASAR Protocol Database - Migration 015
-- Integrations and Invoicing

-- Integration provider types
CREATE TYPE public.integration_type AS ENUM (
  'kyb',
  'sanctions',
  'inspection',
  'lab',
  'bank',
  'escrow',
  'einvoice',
  'logistics',
  'notification',
  'customs'
);

-- Integration providers table
CREATE TABLE public.integration_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_name TEXT NOT NULL,
  provider_type public.integration_type NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'deprecated')),
  environment TEXT DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),
  base_url TEXT,
  configuration JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(provider_name, provider_type, environment)
);

-- Integration events table
CREATE TABLE public.integration_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES public.integration_providers(id),
  transaction_id UUID REFERENCES public.transactions(id),
  event_type TEXT NOT NULL,
  external_event_id TEXT,
  request_id TEXT,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'processing', 'completed', 'failed', 'duplicate')),
  payload JSONB,
  response JSONB,
  error_message TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Idempotency constraint
  UNIQUE(provider_id, external_event_id)
);

-- Webhook logs table
CREATE TABLE public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES public.integration_providers(id),
  webhook_id TEXT,
  endpoint TEXT NOT NULL,
  method TEXT DEFAULT 'POST',
  headers JSONB,
  payload JSONB,
  response_status INTEGER,
  response_body JSONB,
  signature_valid BOOLEAN,
  ip_address INET,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Invoice type enum
CREATE TYPE public.invoice_type AS ENUM (
  'commercial',
  'proforma',
  'credit',
  'debit',
  'einvoice'
);

-- Invoice status enum
CREATE TYPE public.invoice_status AS ENUM (
  'draft',
  'issued',
  'sent',
  'paid',
  'overdue',
  'cancelled',
  'credited'
);

-- Invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  invoice_number TEXT UNIQUE NOT NULL,
  invoice_type public.invoice_type DEFAULT 'commercial',
  issuer_organization_id UUID NOT NULL REFERENCES public.organizations(id),
  recipient_organization_id UUID NOT NULL REFERENCES public.organizations(id),
  currency TEXT NOT NULL DEFAULT 'USD',
  subtotal NUMERIC(20,4) NOT NULL CHECK (subtotal >= 0),
  tax NUMERIC(20,4) DEFAULT 0 CHECK (tax >= 0),
  total NUMERIC(20,4) NOT NULL CHECK (total >= 0),
  status public.invoice_status DEFAULT 'draft',
  issued_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  external_reference TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id),
  
  -- Constraints
  CONSTRAINT invoices_total_check CHECK (total = subtotal + tax),
  CONSTRAINT invoices_dates_check CHECK (due_at IS NULL OR issued_at IS NULL OR due_at >= issued_at)
);

-- E-invoice events table (ZATCA integration)
CREATE TABLE public.einvoice_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.integration_providers(id),
  submission_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'signed', 'submitted', 'cleared', 'rejected', 'cancelled')),
  submitted_at TIMESTAMPTZ,
  cleared_at TIMESTAMPTZ,
  response_code TEXT,
  response_message TEXT,
  response_payload JSONB,
  xml_hash TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice line items table
CREATE TABLE public.invoice_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(20,4) NOT NULL CHECK (quantity > 0),
  unit TEXT,
  unit_price NUMERIC(20,4) NOT NULL CHECK (unit_price >= 0),
  amount NUMERIC(20,4) NOT NULL CHECK (amount >= 0),
  tax_rate NUMERIC(5,2) DEFAULT 0,
  tax_amount NUMERIC(20,4) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  
  UNIQUE(invoice_id, line_number),
  CONSTRAINT invoice_line_amount_check CHECK (amount = quantity * unit_price)
);

-- Create indexes
CREATE INDEX idx_integration_providers_type ON public.integration_providers(provider_type);
CREATE INDEX idx_integration_providers_status ON public.integration_providers(status);
CREATE INDEX idx_integration_events_provider ON public.integration_events(provider_id);
CREATE INDEX idx_integration_events_transaction ON public.integration_events(transaction_id);
CREATE INDEX idx_integration_events_status ON public.integration_events(status);
CREATE INDEX idx_integration_events_external ON public.integration_events(external_event_id);
CREATE INDEX idx_webhook_logs_provider ON public.webhook_logs(provider_id);
CREATE INDEX idx_webhook_logs_received ON public.webhook_logs(received_at);
CREATE INDEX idx_invoices_transaction ON public.invoices(transaction_id);
CREATE INDEX idx_invoices_number ON public.invoices(invoice_number);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_issuer ON public.invoices(issuer_organization_id);
CREATE INDEX idx_invoices_recipient ON public.invoices(recipient_organization_id);
CREATE INDEX idx_invoices_deleted ON public.invoices(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_einvoice_events_invoice ON public.einvoice_events(invoice_id);
CREATE INDEX idx_einvoice_events_status ON public.einvoice_events(status);
CREATE INDEX idx_invoice_line_items_invoice ON public.invoice_line_items(invoice_id);

-- Enable RLS
ALTER TABLE public.integration_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.einvoice_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Integration providers viewable by admins"
  ON public.integration_providers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.roles r ON om.role_id = r.id
      WHERE om.user_id = auth.uid()
      AND r.code IN ('SUPER_ADMIN', 'CTO')
      AND om.status = 'active'
    )
  );

CREATE POLICY "Integration events viewable by admins"
  ON public.integration_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.roles r ON om.role_id = r.id
      WHERE om.user_id = auth.uid()
      AND r.code IN ('SUPER_ADMIN', 'CTO', 'OPERATIONS')
      AND om.status = 'active'
    )
  );

CREATE POLICY "Invoices viewable by transaction participants"
  ON public.invoices FOR SELECT
  USING (
    deleted_at IS NULL AND (
      issuer_organization_id IN (SELECT public.get_user_organization_ids())
      OR recipient_organization_id IN (SELECT public.get_user_organization_ids())
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
    )
  );

CREATE POLICY "E-invoice events viewable with invoice"
  ON public.einvoice_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id
      AND i.deleted_at IS NULL
    )
  );

CREATE POLICY "Invoice line items viewable with invoice"
  ON public.invoice_line_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id
      AND i.deleted_at IS NULL
    )
  );

-- Create triggers
CREATE TRIGGER set_integration_providers_updated_at
  BEFORE UPDATE ON public.integration_providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_einvoice_events_updated_at
  BEFORE UPDATE ON public.einvoice_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  v_sequence INTEGER;
  v_number TEXT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(invoice_number FROM '\d+$') AS INTEGER)
  ), 0) + 1
  INTO v_sequence
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || EXTRACT(YEAR FROM NOW()) || '-%';
  
  v_number := 'INV-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(v_sequence::TEXT, 6, '0');
  
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.integration_providers IS 'External integration provider configurations';
COMMENT ON TABLE public.integration_events IS 'Integration event log with idempotency';
COMMENT ON TABLE public.webhook_logs IS 'Webhook request logs';
COMMENT ON TABLE public.invoices IS 'Transaction invoices';
COMMENT ON TABLE public.einvoice_events IS 'ZATCA e-invoice events';
COMMENT ON TABLE public.invoice_line_items IS 'Invoice line items';
