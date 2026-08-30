-- MASAR Protocol Database - Migration 012
-- Logistics Tables

-- Shipment status enum
CREATE TYPE public.shipment_status AS ENUM (
  'not_started',
  'booked',
  'gate_in',
  'loaded',
  'departed',
  'in_transit',
  'arrived',
  'discharged',
  'customs_cleared',
  'delivered'
);

-- Shipments table
CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  shipment_reference TEXT UNIQUE NOT NULL,
  carrier TEXT,
  vessel TEXT,
  voyage TEXT,
  container_count INTEGER DEFAULT 1,
  container_numbers TEXT[],
  seal_numbers TEXT[],
  estimated_departure TIMESTAMPTZ,
  actual_departure TIMESTAMPTZ,
  estimated_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  origin_port TEXT,
  destination_port TEXT,
  origin_country TEXT REFERENCES public.countries(code),
  destination_country TEXT REFERENCES public.countries(code),
  status public.shipment_status DEFAULT 'not_started',
  tracking_reference TEXT,
  tracking_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT shipments_dates_check CHECK (
    actual_departure IS NULL OR estimated_departure IS NULL OR actual_departure >= estimated_departure - INTERVAL '7 days'
  )
);

-- Shipment events table
CREATE TABLE public.shipment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_description TEXT,
  location TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  reported_by UUID REFERENCES auth.users(id),
  document_id UUID REFERENCES public.documents(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Port verifications table
CREATE TABLE public.port_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  shipment_id UUID NOT NULL REFERENCES public.shipments(id),
  inspection_id UUID REFERENCES public.inspections(id),
  port_name TEXT NOT NULL,
  country TEXT NOT NULL REFERENCES public.countries(code),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'verified', 'exception')),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  evidence_document_id UUID REFERENCES public.documents(id),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_shipments_transaction ON public.shipments(transaction_id);
CREATE INDEX idx_shipments_status ON public.shipments(status);
CREATE INDEX idx_shipments_reference ON public.shipments(shipment_reference);
CREATE INDEX idx_shipments_tracking ON public.shipments(tracking_reference);
CREATE INDEX idx_shipments_estimated_departure ON public.shipments(estimated_departure);
CREATE INDEX idx_shipments_estimated_arrival ON public.shipments(estimated_arrival);
CREATE INDEX idx_shipment_events_shipment ON public.shipment_events(shipment_id);
CREATE INDEX idx_shipment_events_type ON public.shipment_events(event_type);
CREATE INDEX idx_shipment_events_occurred ON public.shipment_events(occurred_at);
CREATE INDEX idx_port_verifications_transaction ON public.port_verifications(transaction_id);
CREATE INDEX idx_port_verifications_shipment ON public.port_verifications(shipment_id);
CREATE INDEX idx_port_verifications_status ON public.port_verifications(status);

-- Enable RLS
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.port_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Shipments viewable by transaction participants"
  ON public.shipments FOR SELECT
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
          AND r.code IN ('SUPER_ADMIN', 'OPERATIONS', 'ORIGIN_OPERATIONS', 'AUDITOR')
          AND om.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Shipments can be created by authorized users"
  ON public.shipments FOR INSERT
  WITH CHECK (
    public.user_has_permission('transaction.edit')
    OR public.user_has_permission('transaction.create')
  );

CREATE POLICY "Shipments can be updated by authorized users"
  ON public.shipments FOR UPDATE
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
          AND r.code IN ('SUPER_ADMIN', 'OPERATIONS', 'ORIGIN_OPERATIONS')
          AND om.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Shipment events viewable with shipment"
  ON public.shipment_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shipments s
      JOIN public.transactions t ON s.transaction_id = t.id
      WHERE s.id = shipment_id
      AND (
        t.buyer_organization_id IN (SELECT public.get_user_organization_ids())
        OR t.exporter_organization_id IN (SELECT public.get_user_organization_ids())
        OR EXISTS (
          SELECT 1 FROM public.organization_members om
          JOIN public.roles r ON om.role_id = r.id
          WHERE om.user_id = auth.uid()
          AND r.code IN ('SUPER_ADMIN', 'OPERATIONS', 'AUDITOR')
          AND om.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Port verifications viewable by transaction participants"
  ON public.port_verifications FOR SELECT
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

-- Create triggers
CREATE TRIGGER set_shipments_updated_at
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_port_verifications_updated_at
  BEFORE UPDATE ON public.port_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate shipment reference
CREATE OR REPLACE FUNCTION public.generate_shipment_reference()
RETURNS TEXT AS $$
DECLARE
  v_sequence INTEGER;
  v_reference TEXT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(shipment_reference FROM '\d+$') AS INTEGER)
  ), 0) + 1
  INTO v_sequence
  FROM public.shipments
  WHERE shipment_reference LIKE 'SHIP-' || EXTRACT(YEAR FROM NOW()) || '-%';
  
  v_reference := 'SHIP-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(v_sequence::TEXT, 6, '0');
  
  RETURN v_reference;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.shipments IS 'Shipment records for transactions';
COMMENT ON TABLE public.shipment_events IS 'Shipment tracking events';
COMMENT ON TABLE public.port_verifications IS 'Port arrival and verification records';
