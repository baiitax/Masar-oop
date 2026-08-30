-- MASAR Protocol Database - Migration 003
-- Organizations

-- Organization types enum
CREATE TYPE public.organization_type AS ENUM (
  'BUYER',
  'EXPORTER',
  'SUPPLIER_SYNDICATE',
  'INSPECTION_PARTNER',
  'LABORATORY',
  'LOGISTICS_PARTNER',
  'FINANCIAL_PARTNER',
  'CUSTOMS_BROKER',
  'ADMIN',
  'INSTITUTIONAL_PARTNER'
);

-- Organization status enum
CREATE TYPE public.organization_status AS ENUM (
  'pending',
  'active',
  'suspended',
  'deactivated'
);

-- Verification status enum
CREATE TYPE public.verification_status AS ENUM (
  'unverified',
  'pending',
  'verified',
  'rejected',
  'expired'
);

-- Risk level enum
CREATE TYPE public.risk_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  legal_name TEXT NOT NULL,
  trading_name TEXT,
  organization_type public.organization_type NOT NULL,
  registration_number TEXT,
  country_code TEXT NOT NULL,
  jurisdiction TEXT,
  tax_identifier TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT NOT NULL,
  postal_code TEXT,
  status public.organization_status DEFAULT 'pending',
  verification_status public.verification_status DEFAULT 'unverified',
  risk_level public.risk_level DEFAULT 'medium',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id),
  deletion_reason TEXT,
  
  -- Constraints
  CONSTRAINT organizations_country_code_check CHECK (length(country_code) = 2),
  CONSTRAINT organizations_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR email IS NULL)
);

-- Create indexes
CREATE INDEX idx_organizations_type ON public.organizations(organization_type);
CREATE INDEX idx_organizations_status ON public.organizations(status);
CREATE INDEX idx_organizations_country ON public.organizations(country_code);
CREATE INDEX idx_organizations_registration ON public.organizations(registration_number);
CREATE INDEX idx_organizations_created_at ON public.organizations(created_at);
CREATE INDEX idx_organizations_deleted_at ON public.organizations(deleted_at) WHERE deleted_at IS NULL;

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Organizations are viewable by members"
  ON public.organizations FOR SELECT
  USING (
    deleted_at IS NULL AND (
      -- User is a member of this organization
      EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
      )
      -- Or user is an admin
      OR EXISTS (
        SELECT 1 FROM public.organization_members om
        JOIN public.roles r ON om.role_id = r.code
        WHERE om.user_id = auth.uid()
        AND r.code IN ('SUPER_ADMIN', 'OPERATIONS', 'COMPLIANCE')
        AND om.status = 'active'
      )
    )
  );

CREATE POLICY "Organizations can be created by authenticated users"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Organizations can be updated by admins"
  ON public.organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = id
      AND om.user_id = auth.uid()
      AND om.role_id IN (
        SELECT id FROM public.roles WHERE code IN ('SUPER_ADMIN', 'PARTNER_ADMIN')
      )
      AND om.status = 'active'
    )
  );

-- Create triggers
CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_organizations_created_at
  BEFORE INSERT ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_at();

COMMENT ON TABLE public.organizations IS 'MASAR platform organizations including buyers, exporters, partners';
COMMENT ON COLUMN public.organizations.organization_type IS 'Type of organization in the MASAR ecosystem';
COMMENT ON COLUMN public.organizations.verification_status IS 'KYB verification status';
