-- MASAR Protocol Database - Migration 009
-- Compliance Tables

-- Compliance case status
CREATE TYPE public.compliance_status AS ENUM (
  'not_started',
  'in_progress',
  'ready',
  'exception',
  'blocked'
);

-- Document type enum
CREATE TYPE public.document_type AS ENUM (
  'BUYER_KYB',
  'EXPORTER_KYB',
  'CONTRACT',
  'COMMERCIAL_INVOICE',
  'CERTIFICATE_OF_ORIGIN',
  'PHYTOSANITARY_CERTIFICATE',
  'CERTIFICATE_OF_ANALYSIS',
  'HEALTH_CERTIFICATE',
  'HALAL_CERTIFICATE',
  'ARABIC_LABEL_VERIFICATION',
  'INSPECTION_REPORT',
  'SHIPMENT_DOCUMENTATION',
  'DESTINATION_DOCUMENTATION',
  'SFDA_REGISTRATION',
  'CUSTOMS_DECLARATION',
  'PACKING_LIST',
  'BILL_OF_LADING',
  'INSURANCE_CERTIFICATE',
  'OTHER'
);

-- Document status enum
CREATE TYPE public.document_status AS ENUM (
  'expected',
  'missing',
  'uploaded',
  'processing',
  'verification_required',
  'verified',
  'rejected',
  'expiring',
  'expired',
  'superseded'
);

-- Compliance cases table
CREATE TABLE public.compliance_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  lane_id UUID REFERENCES public.trade_lanes(id),
  status public.compliance_status DEFAULT 'not_started',
  risk_level public.risk_level DEFAULT 'medium',
  readiness_score INTEGER DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
  assigned_to UUID REFERENCES auth.users(id),
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance requirements table
CREATE TABLE public.compliance_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lane_id UUID NOT NULL REFERENCES public.trade_lanes(id),
  commodity_id UUID REFERENCES public.commodities(id),
  document_type public.document_type NOT NULL,
  requirement_name TEXT NOT NULL,
  required BOOLEAN DEFAULT TRUE,
  applicable_when JSONB,
  validity_period INTERVAL,
  renewal_days INTEGER,
  release_critical BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  version TEXT DEFAULT '1.0',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  document_type public.document_type NOT NULL,
  document_number TEXT,
  storage_path TEXT,
  file_name TEXT,
  mime_type TEXT,
  file_size BIGINT,
  version INTEGER DEFAULT 1,
  status public.document_status DEFAULT 'expected',
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES auth.users(id),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  checksum TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id),
  
  -- Constraints
  CONSTRAINT documents_file_size_check CHECK (file_size IS NULL OR file_size > 0),
  CONSTRAINT documents_version_check CHECK (version > 0)
);

-- Document versions table
CREATE TABLE public.document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  change_reason TEXT,
  checksum TEXT,
  status public.document_status DEFAULT 'uploaded',
  metadata JSONB DEFAULT '{}',
  
  UNIQUE(document_id, version_number)
);

-- Document verifications table
CREATE TABLE public.document_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'error')),
  provider TEXT,
  verified_by UUID REFERENCES auth.users(id),
  automated BOOLEAN DEFAULT FALSE,
  confidence NUMERIC(5,2),
  result JSONB,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_compliance_cases_transaction ON public.compliance_cases(transaction_id);
CREATE INDEX idx_compliance_cases_organization ON public.compliance_cases(organization_id);
CREATE INDEX idx_compliance_cases_status ON public.compliance_cases(status);
CREATE INDEX idx_compliance_requirements_lane ON public.compliance_requirements(lane_id);
CREATE INDEX idx_compliance_requirements_type ON public.compliance_requirements(document_type);
CREATE INDEX idx_documents_transaction ON public.documents(transaction_id);
CREATE INDEX idx_documents_organization ON public.documents(organization_id);
CREATE INDEX idx_documents_type ON public.documents(document_type);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_expires ON public.documents(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_documents_deleted ON public.documents(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_document_versions_document ON public.document_versions(document_id);
CREATE INDEX idx_document_verifications_document ON public.document_verifications(document_id);

-- Enable RLS
ALTER TABLE public.compliance_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Compliance cases viewable by transaction participants"
  ON public.compliance_cases FOR SELECT
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
          AND r.code IN ('SUPER_ADMIN', 'COMPLIANCE', 'OPERATIONS', 'AUDITOR')
          AND om.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Compliance requirements viewable by authenticated users"
  ON public.compliance_requirements FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

CREATE POLICY "Documents viewable by transaction participants"
  ON public.documents FOR SELECT
  USING (
    deleted_at IS NULL AND (
      organization_id IN (SELECT public.get_user_organization_ids())
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
        AND r.code IN ('SUPER_ADMIN', 'COMPLIANCE', 'OPERATIONS', 'AUDITOR')
        AND om.status = 'active'
      )
    )
  );

CREATE POLICY "Documents can be created by authorized users"
  ON public.documents FOR INSERT
  WITH CHECK (
    public.user_has_permission('document.upload')
  );

CREATE POLICY "Documents can be updated by authorized users"
  ON public.documents FOR UPDATE
  USING (
    organization_id IN (SELECT public.get_user_organization_ids())
    OR public.user_has_permission('document.verify')
  );

CREATE POLICY "Document versions viewable by document viewers"
  ON public.document_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id
      AND d.deleted_at IS NULL
    )
  );

CREATE POLICY "Document verifications viewable by document viewers"
  ON public.document_verifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id
      AND d.deleted_at IS NULL
    )
  );

-- Create triggers
CREATE TRIGGER set_compliance_cases_updated_at
  BEFORE UPDATE ON public.compliance_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.compliance_cases IS 'Compliance verification cases for transactions';
COMMENT ON TABLE public.compliance_requirements IS 'Document requirements by lane and commodity';
COMMENT ON TABLE public.documents IS 'Transaction documents with versioning';
COMMENT ON TABLE public.document_versions IS 'Document version history';
COMMENT ON TABLE public.document_verifications IS 'Document verification records';
