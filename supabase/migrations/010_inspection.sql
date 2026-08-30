-- MASAR Protocol Database - Migration 010
-- Inspection and Quality Tables

-- Inspection status enum
CREATE TYPE public.inspection_status AS ENUM (
  'requested',
  'accepted',
  'scheduled',
  'inspector_assigned',
  'sample_pending',
  'sample_collected',
  'lab_processing',
  'result_received',
  'inspection_review',
  'passed',
  'conditional',
  'failed'
);

-- Inspection type enum
CREATE TYPE public.inspection_type AS ENUM (
  'PRE_SHIPMENT',
  'ORIGIN',
  'PORT_OF_ENTRY',
  'QUALITY',
  'QUANTITY',
  'CONDITION',
  'SAMPLING',
  'RE_INSPECTION'
);

-- Sample status enum
CREATE TYPE public.sample_status AS ENUM (
  'pending',
  'collected',
  'in_transit',
  'received',
  'testing',
  'completed'
);

-- Inspection result enum
CREATE TYPE public.inspection_result AS ENUM (
  'pass',
  'fail',
  'conditional',
  'within_tolerance',
  'outside_tolerance'
);

-- Inspections table
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  inspection_number TEXT UNIQUE NOT NULL,
  provider_id UUID NOT NULL REFERENCES public.organizations(id),
  inspection_type public.inspection_type DEFAULT 'PRE_SHIPMENT',
  location TEXT,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status public.inspection_status DEFAULT 'requested',
  result public.inspection_result,
  inspector_id UUID REFERENCES auth.users(id),
  report_document_id UUID REFERENCES public.documents(id),
  summary TEXT,
  findings JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspection status transitions
CREATE TABLE public.inspection_status_transitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  from_status public.inspection_status,
  to_status public.inspection_status NOT NULL,
  triggered_by UUID REFERENCES auth.users(id),
  reason TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- Samples table
CREATE TABLE public.samples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  sample_number TEXT UNIQUE NOT NULL,
  lot_number TEXT,
  seal_number TEXT,
  collected_at TIMESTAMPTZ,
  collected_by TEXT,
  collection_location TEXT,
  laboratory_id UUID REFERENCES public.organizations(id),
  received_at TIMESTAMPTZ,
  status public.sample_status DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample chain of custody
CREATE TABLE public.sample_custody_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sample_id UUID NOT NULL REFERENCES public.samples(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  location TEXT NOT NULL,
  handler TEXT NOT NULL,
  action TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Laboratory results table
CREATE TABLE public.lab_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sample_id UUID NOT NULL REFERENCES public.samples(id) ON DELETE CASCADE,
  laboratory_id UUID NOT NULL REFERENCES public.organizations(id),
  report_number TEXT,
  test_type TEXT NOT NULL,
  parameter TEXT NOT NULL,
  result NUMERIC(20,4),
  unit TEXT,
  reference_range_min NUMERIC(20,4),
  reference_range_max NUMERIC(20,4),
  pass_fail public.inspection_result,
  tested_at TIMESTAMPTZ,
  report_document_id UUID REFERENCES public.documents(id),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quality specifications table
CREATE TABLE public.quality_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commodity_id UUID NOT NULL REFERENCES public.commodities(id),
  lane_id UUID REFERENCES public.trade_lanes(id),
  parameter TEXT NOT NULL,
  operator TEXT CHECK (operator IN ('<=', '>=', '=', 'range')),
  target_value NUMERIC(20,4),
  minimum_value NUMERIC(20,4),
  maximum_value NUMERIC(20,4),
  unit TEXT NOT NULL,
  tolerance NUMERIC(10,4),
  required BOOLEAN DEFAULT TRUE,
  critical BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  version TEXT DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT quality_spec_range_check CHECK (
    (minimum_value IS NULL AND maximum_value IS NULL) OR
    (minimum_value IS NOT NULL AND maximum_value IS NOT NULL AND minimum_value <= maximum_value)
  )
);

-- Quality results table
CREATE TABLE public.quality_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  specification_id UUID REFERENCES public.quality_specifications(id),
  parameter TEXT NOT NULL,
  contract_value TEXT,
  actual_value NUMERIC(20,4),
  unit TEXT,
  variance NUMERIC(10,4),
  variance_percentage NUMERIC(5,2),
  status public.inspection_result,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quality variances table
CREATE TABLE public.quality_variances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  inspection_id UUID NOT NULL REFERENCES public.inspections(id),
  parameter TEXT NOT NULL,
  expected_value NUMERIC(20,4),
  actual_value NUMERIC(20,4),
  variance NUMERIC(10,4),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated')),
  resolution TEXT,
  resolution_type TEXT CHECK (resolution_type IN ('accept', 'price_adjustment', 'reinspection', 'rework', 'subgrade_sale', 'refund', 'dispute')),
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_inspections_transaction ON public.inspections(transaction_id);
CREATE INDEX idx_inspections_provider ON public.inspections(provider_id);
CREATE INDEX idx_inspections_status ON public.inspections(status);
CREATE INDEX idx_inspections_number ON public.inspections(inspection_number);
CREATE INDEX idx_inspections_scheduled ON public.inspections(scheduled_at);
CREATE INDEX idx_inspections_inspector ON public.inspections(inspector_id);
CREATE INDEX idx_samples_inspection ON public.samples(inspection_id);
CREATE INDEX idx_samples_transaction ON public.samples(transaction_id);
CREATE INDEX idx_samples_status ON public.samples(status);
CREATE INDEX idx_sample_custody_sample ON public.sample_custody_events(sample_id);
CREATE INDEX idx_lab_results_sample ON public.lab_results(sample_id);
CREATE INDEX idx_lab_results_laboratory ON public.lab_results(laboratory_id);
CREATE INDEX idx_quality_specifications_commodity ON public.quality_specifications(commodity_id);
CREATE INDEX idx_quality_specifications_lane ON public.quality_specifications(lane_id);
CREATE INDEX idx_quality_results_inspection ON public.quality_results(inspection_id);
CREATE INDEX idx_quality_variances_transaction ON public.quality_variances(transaction_id);
CREATE INDEX idx_quality_variances_status ON public.quality_variances(status);

-- Enable RLS
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_status_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_custody_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_variances ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Inspections viewable by transaction participants"
  ON public.inspections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.transactions t
      WHERE t.id = transaction_id
      AND (
        t.buyer_organization_id IN (SELECT public.get_user_organization_ids())
        OR t.exporter_organization_id IN (SELECT public.get_user_organization_ids())
        OR provider_id IN (SELECT public.get_user_organization_ids())
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

CREATE POLICY "Inspections can be created by authorized users"
  ON public.inspections FOR INSERT
  WITH CHECK (
    public.user_has_permission('inspection.create')
  );

CREATE POLICY "Inspections can be updated by provider or authorized users"
  ON public.inspections FOR UPDATE
  USING (
    provider_id IN (SELECT public.get_user_organization_ids())
    OR public.user_has_permission('inspection.assign')
    OR public.user_has_permission('inspection.approve')
  );

CREATE POLICY "Samples viewable by inspection participants"
  ON public.samples FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = inspection_id
      AND (
        i.provider_id IN (SELECT public.get_user_organization_ids())
        OR EXISTS (
          SELECT 1 FROM public.transactions t
          WHERE t.id = i.transaction_id
          AND (
            t.buyer_organization_id IN (SELECT public.get_user_organization_ids())
            OR t.exporter_organization_id IN (SELECT public.get_user_organization_ids())
          )
        )
      )
    )
  );

CREATE POLICY "Lab results viewable by inspection participants"
  ON public.lab_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.samples s
      JOIN public.inspections i ON s.inspection_id = i.id
      WHERE s.id = sample_id
      AND (
        i.provider_id IN (SELECT public.get_user_organization_ids())
        OR laboratory_id IN (SELECT public.get_user_organization_ids())
        OR EXISTS (
          SELECT 1 FROM public.transactions t
          WHERE t.id = i.transaction_id
          AND (
            t.buyer_organization_id IN (SELECT public.get_user_organization_ids())
            OR t.exporter_organization_id IN (SELECT public.get_user_organization_ids())
          )
        )
      )
    )
  );

CREATE POLICY "Quality specifications viewable by authenticated users"
  ON public.quality_specifications FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

CREATE POLICY "Quality results viewable by transaction participants"
  ON public.quality_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = inspection_id
      AND (
        i.provider_id IN (SELECT public.get_user_organization_ids())
        OR EXISTS (
          SELECT 1 FROM public.transactions t
          WHERE t.id = i.transaction_id
          AND (
            t.buyer_organization_id IN (SELECT public.get_user_organization_ids())
            OR t.exporter_organization_id IN (SELECT public.get_user_organization_ids())
          )
        )
      )
    )
  );

CREATE POLICY "Quality variances viewable by transaction participants"
  ON public.quality_variances FOR SELECT
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
CREATE TRIGGER set_inspections_updated_at
  BEFORE UPDATE ON public.inspections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_samples_updated_at
  BEFORE UPDATE ON public.samples
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_quality_specifications_updated_at
  BEFORE UPDATE ON public.quality_specifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_quality_variances_updated_at
  BEFORE UPDATE ON public.quality_variances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate inspection number
CREATE OR REPLACE FUNCTION public.generate_inspection_number()
RETURNS TEXT AS $$
DECLARE
  v_sequence INTEGER;
  v_number TEXT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(inspection_number FROM '\d+$') AS INTEGER)
  ), 0) + 1
  INTO v_sequence
  FROM public.inspections
  WHERE inspection_number LIKE 'INSP-' || EXTRACT(YEAR FROM NOW()) || '-%';
  
  v_number := 'INSP-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(v_sequence::TEXT, 6, '0');
  
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.inspections IS 'Inspection records for transactions';
COMMENT ON TABLE public.samples IS 'Physical samples collected during inspections';
COMMENT ON TABLE public.sample_custody_events IS 'Chain of custody for samples';
COMMENT ON TABLE public.lab_results IS 'Laboratory test results';
COMMENT ON TABLE public.quality_specifications IS 'Quality parameters by commodity and lane';
COMMENT ON TABLE public.quality_results IS 'Actual quality results vs specifications';
COMMENT ON TABLE public.quality_variances IS 'Quality variance cases requiring resolution';
