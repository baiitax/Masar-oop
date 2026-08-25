-- MASAR Database Setup for Supabase
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/lsqxohcpgwkoujdcuhmc/sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES TABLE (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  company TEXT,
  role TEXT DEFAULT 'buyer',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  mfa_enabled BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORGANIZATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  legal_name TEXT NOT NULL,
  trading_name TEXT,
  registration_number TEXT UNIQUE,
  country TEXT NOT NULL,
  city TEXT,
  address TEXT,
  website TEXT,
  industry TEXT,
  org_type TEXT CHECK (org_type IN ('buyer', 'exporter', 'inspector', 'partner')),
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'APPLICATION',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BUYERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  saudi_registration TEXT,
  buyer_category TEXT,
  annual_procurement_volume TEXT,
  estimated_purchasing_capacity TEXT,
  credit_profile TEXT,
  commodities TEXT[],
  required_volume TEXT,
  quality_specs TEXT,
  delivery_locations TEXT[],
  incoterms TEXT[],
  payment_terms TEXT,
  bank_references TEXT[],
  risk_score INTEGER DEFAULT 0,
  verification_status TEXT DEFAULT 'APPLICATION',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXPORTERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exporters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  cac_number TEXT,
  nepc_number TEXT,
  export_license_status TEXT,
  bank_name TEXT,
  export_history TEXT,
  warehouses TEXT[],
  processing_facilities TEXT[],
  commodity_categories TEXT[],
  sesame_grade TEXT,
  sesame_origin TEXT,
  available_quantity TEXT,
  harvest_season TEXT,
  moisture TEXT,
  purity TEXT,
  foreign_matter TEXT,
  aflatoxin_status TEXT,
  packaging TEXT,
  trust_score INTEGER DEFAULT 0,
  verification_status TEXT DEFAULT 'APPLICATION',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMMODITIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.commodities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT,
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRANSACTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  masar_id TEXT UNIQUE NOT NULL,
  buyer_id UUID REFERENCES public.buyers(id),
  exporter_id UUID REFERENCES public.exporters(id),
  commodity_id UUID REFERENCES public.commodities(id),
  quantity TEXT,
  contract_value DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  incoterm TEXT,
  destination TEXT,
  origin TEXT,
  status TEXT DEFAULT 'DRAFT',
  risk_level TEXT DEFAULT 'LOW',
  clearance_total INTEGER DEFAULT 0,
  clearance_exporter_verification INTEGER DEFAULT 0,
  clearance_buyer_verification INTEGER DEFAULT 0,
  clearance_commodity_documentation INTEGER DEFAULT 0,
  clearance_lab_coa INTEGER DEFAULT 0,
  clearance_phytosanitary INTEGER DEFAULT 0,
  clearance_origin_documentation INTEGER DEFAULT 0,
  clearance_saudi_import_readiness INTEGER DEFAULT 0,
  clearance_contract_completeness INTEGER DEFAULT 0,
  clearance_inspection_readiness INTEGER DEFAULT 0,
  expected_completion DATE,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DOCUMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  organization_id UUID REFERENCES public.organizations(id),
  type TEXT NOT NULL,
  issuing_organization TEXT,
  document_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  file_url TEXT,
  owner_id UUID REFERENCES public.profiles(id),
  verification_status TEXT DEFAULT 'UPLOADED',
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  hash TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INSPECTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  inspector_org_id UUID REFERENCES public.organizations(id),
  scheduled_date DATE,
  completed_date DATE,
  status TEXT DEFAULT 'REQUESTED',
  result TEXT DEFAULT 'PENDING',
  notes TEXT,
  report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INSPECTION RESULTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.inspection_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
  parameter TEXT NOT NULL,
  value TEXT NOT NULL,
  threshold TEXT,
  status TEXT CHECK (status IN ('PASS', 'FAIL', 'N/A')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SHIPMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  container_number TEXT,
  vessel TEXT,
  booking TEXT,
  port_of_origin TEXT,
  destination_port TEXT,
  etd DATE,
  eta DATE,
  actual_departure TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  status TEXT DEFAULT 'BOOKED',
  customs_status TEXT,
  port_inspection_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FINANCE REQUESTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.finance_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  invoice_value DECIMAL(15,2),
  requested_advance_pct DECIMAL(5,2),
  requested_amount DECIMAL(15,2),
  status TEXT DEFAULT 'DRAFT',
  capital_partner_org_id UUID REFERENCES public.organizations(id),
  interest_rate DECIMAL(5,2),
  tenor_days INTEGER,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  disbursed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ESCROW INSTRUCTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.escrow_instructions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  bank_partner TEXT,
  amount DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'NOT_FUNDED',
  funded_at TIMESTAMPTZ,
  release_authorized_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RFQS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rfqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  masar_id TEXT UNIQUE NOT NULL,
  buyer_id UUID REFERENCES public.buyers(id),
  commodity_id UUID REFERENCES public.commodities(id),
  origin TEXT,
  quantity TEXT,
  quality_specs TEXT,
  delivery_location TEXT,
  incoterm TEXT,
  payment_structure TEXT,
  inspection_required BOOLEAN DEFAULT true,
  required_date DATE,
  status TEXT DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXCEPTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.exceptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  type TEXT NOT NULL,
  severity TEXT DEFAULT 'WARNING',
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id),
  deadline DATE,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SETTLEMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.settlements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  escrow_id UUID REFERENCES public.escrow_instructions(id),
  gross_amount DECIMAL(15,2),
  platform_fee DECIMAL(15,2),
  compliance_fee DECIMAL(15,2),
  inspection_fee DECIMAL(15,2),
  settlement_fee DECIMAL(15,2),
  net_amount DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INVOICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  invoice_number TEXT UNIQUE NOT NULL,
  issuer_org_id UUID REFERENCES public.organizations(id),
  recipient_org_id UUID REFERENCES public.organizations(id),
  amount DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  issue_date DATE,
  due_date DATE,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DISPUTES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  raised_by UUID REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'OPEN',
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PARTNERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id),
  partner_type TEXT CHECK (partner_type IN ('inspection', 'laboratory', 'shipping', 'finance', 'escrow')),
  capabilities TEXT[],
  certifications TEXT[],
  coverage_regions TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_masar_id ON public.transactions(masar_id);
CREATE INDEX IF NOT EXISTS idx_documents_transaction ON public.documents(transaction_id);
CREATE INDEX IF NOT EXISTS idx_inspections_transaction ON public.inspections(transaction_id);
CREATE INDEX IF NOT EXISTS idx_shipments_transaction ON public.shipments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON public.audit_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Profiles viewable by authenticated users" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Organizations: Viewable by authenticated users
CREATE POLICY "Organizations viewable by authenticated" ON public.organizations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Transactions: Viewable by authenticated users
CREATE POLICY "Transactions viewable by authenticated" ON public.transactions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Documents: Viewable by authenticated users
CREATE POLICY "Documents viewable by authenticated" ON public.documents
  FOR SELECT USING (auth.role() = 'authenticated');

-- Notifications: Users see own notifications
CREATE POLICY "Users see own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Audit events: Viewable by authenticated
CREATE POLICY "Audit events viewable by authenticated" ON public.audit_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_organizations_updated_at ON public.organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO public.commodities (name, name_ar, category, description) VALUES
  ('Premium Hulled Sesame', 'سمسم مقشور فاخر', 'Oilseeds', 'Premium quality hulled sesame from Nigeria'),
  ('Standard Natural Sesame', 'سمسم طبيعي قياسي', 'Oilseeds', 'Standard quality natural sesame'),
  ('Cashew', 'كاجو', 'Nuts', 'Raw cashew nuts'),
  ('Shea Butter', 'زبدة الشيا', 'Oils', 'Raw shea butter')
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE! 
-- ============================================================
-- After running this, go to Authentication > Providers
-- Enable Email provider with "Confirm email" ON
