-- MASAR Protocol Database - Migration 008
-- KYB (Know Your Business) Tables

-- KYB case status enum
CREATE TYPE public.kyb_status AS ENUM (
  'not_started',
  'submitted',
  'data_extraction',
  'entity_matching',
  'registry_verification',
  'ownership_mapping',
  'ubo_identification',
  'sanctions_screening',
  'pep_screening',
  'adverse_media',
  'risk_review',
  'risk_classification',
  'auto_clear',
  'human_review',
  'approved',
  'rejected',
  'blocked'
);

-- KYB decision enum
CREATE TYPE public.kyb_decision AS ENUM (
  'auto_clear',
  'human_review',
  'blocked'
);

-- KYB cases table
CREATE TABLE public.kyb_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  transaction_id UUID REFERENCES public.transactions(id),
  case_number TEXT UNIQUE NOT NULL,
  status public.kyb_status DEFAULT 'not_started',
  decision public.kyb_decision,
  risk_level public.risk_level,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_breakdown JSONB DEFAULT '{}',
  submitted_at TIMESTAMPTZ,
  review_started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  next_review_date DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT kyb_cases_score_check CHECK (risk_score IS NULL OR (risk_score >= 0 AND risk_score <= 100))
);

-- KYB check types
CREATE TYPE public.kyb_check_type AS ENUM (
  'ENTITY_VERIFICATION',
  'REGISTRY_VERIFICATION',
  'UBO_VERIFICATION',
  'SANCTIONS_SCREENING',
  'PEP_SCREENING',
  'ADVERSE_MEDIA',
  'TRADE_HISTORY',
  'DOCUMENT_VERIFICATION'
);

-- KYB check status
CREATE TYPE public.kyb_check_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'failed',
  'error'
);

-- KYB checks table
CREATE TABLE public.kyb_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kyb_case_id UUID NOT NULL REFERENCES public.kyb_cases(id) ON DELETE CASCADE,
  check_type public.kyb_check_type NOT NULL,
  provider TEXT,
  status public.kyb_check_status DEFAULT 'pending',
  result TEXT,
  confidence NUMERIC(5,2) CHECK (confidence >= 0 AND confidence <= 100),
  reference_id TEXT,
  raw_response JSONB,
  checked_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Persons table (reusable identity records)
CREATE TABLE public.persons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  nationality TEXT,
  identification_type TEXT,
  identification_number TEXT,
  identification_country TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT persons_identification_check CHECK (
    (identification_type IS NULL AND identification_number IS NULL) OR
    (identification_type IS NOT NULL AND identification_number IS NOT NULL)
  )
);

-- Beneficial owners table
CREATE TABLE public.beneficial_owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES public.persons(id),
  ownership_percentage NUMERIC(5,2) CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
  control_percentage NUMERIC(5,2) CHECK (control_percentage >= 0 AND control_percentage <= 100),
  control_type TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT beneficial_owners_percentage_check CHECK (
    ownership_percentage IS NOT NULL OR control_percentage IS NOT NULL
  )
);

-- Directors table
CREATE TABLE public.directors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES public.persons(id),
  position TEXT,
  appointed_date DATE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
  verified_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sanctions screening matches
CREATE TABLE public.screening_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kyb_case_id UUID REFERENCES public.kyb_cases(id),
  check_id UUID REFERENCES public.kyb_checks(id),
  subject_type TEXT NOT NULL CHECK (subject_type IN ('organization', 'person', 'ubo', 'director')),
  subject_id UUID NOT NULL,
  match_type TEXT NOT NULL,
  match_score NUMERIC(5,2) CHECK (match_score >= 0 AND match_score <= 100),
  provider_reference TEXT,
  status TEXT DEFAULT 'potential_match' CHECK (status IN ('potential_match', 'false_positive', 'confirmed', 'escalated', 'cleared')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  resolution TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_kyb_cases_organization ON public.kyb_cases(organization_id);
CREATE INDEX idx_kyb_cases_transaction ON public.kyb_cases(transaction_id);
CREATE INDEX idx_kyb_cases_status ON public.kyb_cases(status);
CREATE INDEX idx_kyb_cases_number ON public.kyb_cases(case_number);
CREATE INDEX idx_kyb_cases_next_review ON public.kyb_cases(next_review_date) WHERE next_review_date IS NOT NULL;
CREATE INDEX idx_kyb_checks_case ON public.kyb_checks(kyb_case_id);
CREATE INDEX idx_kyb_checks_type ON public.kyb_checks(check_type);
CREATE INDEX idx_kyb_checks_status ON public.kyb_checks(status);
CREATE INDEX idx_persons_name ON public.persons(full_name);
CREATE INDEX idx_persons_identification ON public.persons(identification_type, identification_number);
CREATE INDEX idx_beneficial_owners_organization ON public.beneficial_owners(organization_id);
CREATE INDEX idx_beneficial_owners_person ON public.beneficial_owners(person_id);
CREATE INDEX idx_directors_organization ON public.directors(organization_id);
CREATE INDEX idx_directors_person ON public.directors(person_id);
CREATE INDEX idx_screening_matches_case ON public.screening_matches(kyb_case_id);
CREATE INDEX idx_screening_matches_subject ON public.screening_matches(subject_type, subject_id);
CREATE INDEX idx_screening_matches_status ON public.screening_matches(status);

-- Enable RLS
ALTER TABLE public.kyb_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyb_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficial_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for KYB cases
CREATE POLICY "KYB cases viewable by organization members"
  ON public.kyb_cases FOR SELECT
  USING (
    organization_id IN (SELECT public.get_user_organization_ids())
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.roles r ON om.role_id = r.id
      WHERE om.user_id = auth.uid()
      AND r.code IN ('SUPER_ADMIN', 'COMPLIANCE', 'OPERATIONS', 'AUDITOR')
      AND om.status = 'active'
    )
  );

CREATE POLICY "KYB cases can be created by authorized users"
  ON public.kyb_cases FOR INSERT
  WITH CHECK (
    public.user_has_permission('kyb.submit')
    OR public.user_has_permission('kyb.create')
  );

CREATE POLICY "KYB cases can be updated by authorized users"
  ON public.kyb_cases FOR UPDATE
  USING (
    organization_id IN (SELECT public.get_user_organization_ids())
    OR public.user_has_permission('kyb.review')
    OR public.user_has_permission('kyb.approve')
  );

-- RLS Policies for KYB checks
CREATE POLICY "KYB checks viewable by case participants"
  ON public.kyb_checks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.kyb_cases kc
      WHERE kc.id = kyb_case_id
      AND (
        kc.organization_id IN (SELECT public.get_user_organization_ids())
        OR EXISTS (
          SELECT 1 FROM public.organization_members om
          JOIN public.roles r ON om.role_id = r.id
          WHERE om.user_id = auth.uid()
          AND r.code IN ('SUPER_ADMIN', 'COMPLIANCE', 'AUDITOR')
          AND om.status = 'active'
        )
      )
    )
  );

CREATE POLICY "KYB checks can be created by system"
  ON public.kyb_checks FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "KYB checks can be updated by system"
  ON public.kyb_checks FOR UPDATE
  USING (TRUE);

-- RLS Policies for persons
CREATE POLICY "Persons viewable by related organizations"
  ON public.persons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.beneficial_owners bo
      WHERE bo.person_id = id
      AND bo.organization_id IN (SELECT public.get_user_organization_ids())
    )
    OR EXISTS (
      SELECT 1 FROM public.directors d
      WHERE d.person_id = id
      AND d.organization_id IN (SELECT public.get_user_organization_ids())
    )
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.roles r ON om.role_id = r.id
      WHERE om.user_id = auth.uid()
      AND r.code IN ('SUPER_ADMIN', 'COMPLIANCE', 'AUDITOR')
      AND om.status = 'active'
    )
  );

CREATE POLICY "Persons can be created by authorized users"
  ON public.persons FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for beneficial owners
CREATE POLICY "Beneficial owners viewable by organization members"
  ON public.beneficial_owners FOR SELECT
  USING (
    organization_id IN (SELECT public.get_user_organization_ids())
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.roles r ON om.role_id = r.id
      WHERE om.user_id = auth.uid()
      AND r.code IN ('SUPER_ADMIN', 'COMPLIANCE', 'AUDITOR')
      AND om.status = 'active'
    )
  );

CREATE POLICY "Beneficial owners can be managed by organization admins"
  ON public.beneficial_owners FOR ALL
  USING (
    organization_id IN (SELECT public.get_user_organization_ids())
    OR public.user_has_permission('kyb.submit')
  );

-- RLS Policies for directors
CREATE POLICY "Directors viewable by organization members"
  ON public.directors FOR SELECT
  USING (
    organization_id IN (SELECT public.get_user_organization_ids())
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      JOIN public.roles r ON om.role_id = r.id
      WHERE om.user_id = auth.uid()
      AND r.code IN ('SUPER_ADMIN', 'COMPLIANCE', 'AUDITOR')
      AND om.status = 'active'
    )
  );

CREATE POLICY "Directors can be managed by organization admins"
  ON public.directors FOR ALL
  USING (
    organization_id IN (SELECT public.get_user_organization_ids())
    OR public.user_has_permission('kyb.submit')
  );

-- RLS Policies for screening matches
CREATE POLICY "Screening matches viewable by compliance"
  ON public.screening_matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.kyb_cases kc
      WHERE kc.id = kyb_case_id
      AND (
        kc.organization_id IN (SELECT public.get_user_organization_ids())
        OR EXISTS (
          SELECT 1 FROM public.organization_members om
          JOIN public.roles r ON om.role_id = r.id
          WHERE om.user_id = auth.uid()
          AND r.code IN ('SUPER_ADMIN', 'COMPLIANCE', 'AUDITOR')
          AND om.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Screening matches can be created by system"
  ON public.screening_matches FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Screening matches can be updated by compliance"
  ON public.screening_matches FOR UPDATE
  USING (
    public.user_has_permission('kyb.review')
    OR public.user_has_permission('kyb.approve')
  );

-- Create triggers
CREATE TRIGGER set_kyb_cases_updated_at
  BEFORE UPDATE ON public.kyb_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_kyb_checks_updated_at
  BEFORE UPDATE ON public.kyb_checks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_persons_updated_at
  BEFORE UPDATE ON public.persons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_beneficial_owners_updated_at
  BEFORE UPDATE ON public.beneficial_owners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_screening_matches_updated_at
  BEFORE UPDATE ON public.screening_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate KYB case number
CREATE OR REPLACE FUNCTION public.generate_kyb_case_number()
RETURNS TEXT AS $$
DECLARE
  v_sequence INTEGER;
  v_number TEXT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(case_number FROM '\d+$') AS INTEGER)
  ), 0) + 1
  INTO v_sequence
  FROM public.kyb_cases
  WHERE case_number LIKE 'KYB-' || EXTRACT(YEAR FROM NOW()) || '-%';
  
  v_number := 'KYB-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(v_sequence::TEXT, 6, '0');
  
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.kyb_cases IS 'KYB verification cases for organizations';
COMMENT ON TABLE public.kyb_checks IS 'Individual verification checks within KYB cases';
COMMENT ON TABLE public.persons IS 'Reusable person identity records';
COMMENT ON TABLE public.beneficial_owners IS 'Ultimate beneficial owners of organizations';
COMMENT ON TABLE public.directors IS 'Company directors';
COMMENT ON TABLE public.screening_matches IS 'Sanctions and PEP screening matches';
