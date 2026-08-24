-- MASAR Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'executive',
  'operations',
  'compliance',
  'origin',
  'finance',
  'buyer',
  'exporter',
  'inspector',
  'partner',
  'auditor',
  'admin'
);

CREATE TYPE transaction_status AS ENUM (
  'DRAFT',
  'RFQ_OPEN',
  'COUNTERPARTIES_VERIFIED',
  'COMMERCIAL_AGREEMENT',
  'CONTRACT_EXECUTED',
  'COMPLIANCE_IN_PROGRESS',
  'CLEARANCE_READY',
  'INSPECTION_PENDING',
  'INSPECTION_PASSED',
  'FINANCING_APPROVED',
  'FUNDS_SECURED',
  'SHIPMENT_RELEASED',
  'IN_TRANSIT',
  'PORT_VERIFICATION',
  'RELEASE_ELIGIBLE',
  'FUNDS_RELEASED',
  'SETTLED',
  'COMPLETED',
  'COMPLIANCE_FAILED',
  'INSPECTION_FAILED',
  'FINANCE_DECLINED',
  'PAYMENT_EXCEPTION',
  'SHIPMENT_EXCEPTION',
  'DISPUTED',
  'CANCELLED'
);

CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

CREATE TYPE verification_status AS ENUM (
  'APPLICATION',
  'PENDING_DOCUMENTS',
  'KYB_REVIEW',
  'UBO_REVIEW',
  'SANCTIONS_SCREENING',
  'COMMERCIAL_REVIEW',
  'APPROVED',
  'RESTRICTED',
  'REJECTED'
);

CREATE TYPE document_status AS ENUM (
  'UPLOADED',
  'UNDER_REVIEW',
  'VERIFIED',
  'REJECTED',
  'EXPIRED',
  'SUPERSEDED'
);

CREATE TYPE inspection_status AS ENUM (
  'REQUESTED',
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE inspection_result AS ENUM (
  'PASS',
  'CONDITIONAL_PASS',
  'FAIL',
  'PENDING'
);

CREATE TYPE shipment_status AS ENUM (
  'BOOKED',
  'LOADED',
  'DEPARTED',
  'IN_TRANSIT',
  'ARRIVED',
  'PORT_INSPECTION',
  'CLEARED',
  'RELEASED'
);

CREATE TYPE escrow_status AS ENUM (
  'NOT_FUNDED',
  'FUNDING_REQUESTED',
  'FUNDS_CONFIRMED',
  'ESCROW_ACTIVE',
  'RELEASE_CONDITIONS_PENDING',
  'RELEASE_AUTHORIZED',
  'RELEASE_COMPLETED',
  'SETTLED'
);

CREATE TYPE finance_status AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'DECLINED',
  'DISBURSED',
  'REPAID'
);

CREATE TYPE exception_severity AS ENUM (
  'NORMAL',
  'WATCH',
  'WARNING',
  'HIGH',
  'CRITICAL'
);

-- ============================================================
-- TABLES
-- ============================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  role user_role DEFAULT 'buyer',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  mfa_enabled BOOLEAN DEFAULT false,
  last_login TIMESTAMPTZ,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations
CREATE TABLE public.organizations (
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
  verification_status verification_status DEFAULT 'APPLICATION',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization members
CREATE TABLE public.organization_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Buyers
CREATE TABLE public.buyers (
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
  verification_status verification_status DEFAULT 'APPLICATION',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exporters
CREATE TABLE public.exporters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  cac_number TEXT,
  nepc_number TEXT,
  export_license_status TEXT,
  bank_name TEXT,
  bank_account_encrypted TEXT,
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
  verification_status verification_status DEFAULT 'APPLICATION',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Beneficial Owners (UBOs)
CREATE TABLE public.beneficial_owners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  nationality TEXT,
  ownership_percentage DECIMAL(5,2),
  id_type TEXT,
  id_number_encrypted TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commodities
CREATE TABLE public.commodities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT,
  category TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE public.transactions (
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
  status transaction_status DEFAULT 'DRAFT',
  risk_level risk_level DEFAULT 'LOW',
  
  -- Clearance Score
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

-- Transaction Timeline
CREATE TABLE public.transaction_timeline (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES public.profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  organization_id UUID REFERENCES public.organizations(id),
  type TEXT NOT NULL,
  issuing_organization TEXT,
  document_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  file_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  owner_id UUID REFERENCES public.profiles(id),
  verification_status document_status DEFAULT 'UPLOADED',
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  hash TEXT,
  version INTEGER DEFAULT 1,
  parent_version_id UUID REFERENCES public.documents(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspections
CREATE TABLE public.inspections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  inspector_org_id UUID REFERENCES public.organizations(id),
  scheduled_date DATE,
  completed_date DATE,
  status inspection_status DEFAULT 'REQUESTED',
  result inspection_result DEFAULT 'PENDING',
  notes TEXT,
  report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspection Test Results
CREATE TABLE public.inspection_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inspection_id UUID REFERENCES public.inspections(id) ON DELETE CASCADE,
  parameter TEXT NOT NULL,
  value TEXT NOT NULL,
  threshold TEXT,
  status TEXT CHECK (status IN ('PASS', 'FAIL', 'N/A')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipment
CREATE TABLE public.shipments (
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
  status shipment_status DEFAULT 'BOOKED',
  customs_status TEXT,
  port_inspection_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Finance Requests
CREATE TABLE public.finance_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  invoice_value DECIMAL(15,2),
  requested_advance_pct DECIMAL(5,2),
  requested_amount DECIMAL(15,2),
  status finance_status DEFAULT 'DRAFT',
  capital_partner_org_id UUID REFERENCES public.organizations(id),
  interest_rate DECIMAL(5,2),
  tenor_days INTEGER,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  disbursed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Escrow Instructions
CREATE TABLE public.escrow_instructions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  bank_partner TEXT,
  amount DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  status escrow_status DEFAULT 'NOT_FUNDED',
  funded_at TIMESTAMPTZ,
  release_authorized_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settlements
CREATE TABLE public.settlements (
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

-- Invoices
CREATE TABLE public.invoices (
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
  zatca_compliant BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RFQs
CREATE TABLE public.rfqs (
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

-- Exceptions
CREATE TABLE public.exceptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  type TEXT NOT NULL,
  severity exception_severity DEFAULT 'WARNING',
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id),
  deadline DATE,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk Assessments
CREATE TABLE public.risk_assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  assessed_by UUID REFERENCES public.profiles(id),
  risk_level risk_level,
  risk_score INTEGER,
  factors JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Events (append-only)
CREATE TABLE public.audit_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
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

-- Partners
CREATE TABLE public.partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id),
  partner_type TEXT CHECK (partner_type IN ('inspection', 'laboratory', 'shipping', 'finance', 'escrow')),
  capabilities TEXT[],
  certifications TEXT[],
  coverage_regions TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes
CREATE TABLE public.disputes (
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
-- INDEXES
-- ============================================================

CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_buyer ON public.transactions(buyer_id);
CREATE INDEX idx_transactions_exporter ON public.transactions(exporter_id);
CREATE INDEX idx_transactions_masar_id ON public.transactions(masar_id);
CREATE INDEX idx_documents_transaction ON public.documents(transaction_id);
CREATE INDEX idx_inspections_transaction ON public.inspections(transaction_id);
CREATE INDEX idx_shipments_transaction ON public.shipments(transaction_id);
CREATE INDEX idx_audit_events_entity ON public.audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_events_user ON public.audit_events(user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read);
CREATE INDEX idx_exceptions_transaction ON public.exceptions(transaction_id, resolved);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, update only their own
CREATE POLICY "Profiles: View all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: Update own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations: Authenticated users can view
CREATE POLICY "Organizations: View" ON public.organizations FOR SELECT USING (auth.role() = 'authenticated');

-- Transactions: Role-based access
CREATE POLICY "Transactions: Executive view all" ON public.transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('executive', 'operations', 'compliance', 'admin'))
  );

CREATE POLICY "Transactions: Buyer view own" ON public.transactions
  FOR SELECT USING (
    buyer_id IN (SELECT id FROM public.buyers WHERE organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    ))
  );

CREATE POLICY "Transactions: Exporter view own" ON public.transactions
  FOR SELECT USING (
    exporter_id IN (SELECT id FROM public.exporters WHERE organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    ))
  );

-- Documents: Transaction-based access
CREATE POLICY "Documents: View based on transaction access" ON public.documents
  FOR SELECT USING (
    transaction_id IN (SELECT id FROM public.transactions)
  );

-- Notifications: Users see only their own
CREATE POLICY "Notifications: View own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Audit events: Read-only for auditors and executives
CREATE POLICY "Audit: View for authorized roles" ON public.audit_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('executive', 'auditor', 'admin'))
  );

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate MASAR Transaction ID
CREATE OR REPLACE FUNCTION generate_masar_id(commodity_prefix TEXT)
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  new_id TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(masar_id FROM '\d+$') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.transactions
  WHERE masar_id LIKE 'MASAR-' || commodity_prefix || '-' || EXTRACT(YEAR FROM NOW()) || '-%';
  
  new_id := 'MASAR-' || commodity_prefix || '-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(next_num::TEXT, 6, '0');
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Calculate Clearance Score
CREATE OR REPLACE FUNCTION calculate_clearance_score(txn_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  txn RECORD;
BEGIN
  SELECT * INTO txn FROM public.transactions WHERE id = txn_id;
  
  score := txn.clearance_exporter_verification + 
           txn.clearance_buyer_verification + 
           txn.clearance_commodity_documentation + 
           txn.clearance_lab_coa + 
           txn.clearance_phytosanitary + 
           txn.clearance_origin_documentation + 
           txn.clearance_saudi_import_readiness + 
           txn.clearance_contract_completeness + 
           txn.clearance_inspection_readiness;
  
  UPDATE public.transactions SET clearance_total = score WHERE id = txn_id;
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Log audit event
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.audit_events (user_id, action, entity_type, entity_id, details, ip_address)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details, p_ip_address)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notif_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notif_id;
  
  RETURN notif_id;
END;
$$ LANGUAGE plpgsql;

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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SEED DATA
-- ============================================================

-- Insert default commodities
INSERT INTO public.commodities (name, name_ar, category, description) VALUES
  ('Premium Hulled Sesame', 'سمسم مقشور فاخر', 'Oilseeds', 'Premium quality hulled sesame from Nigeria'),
  ('Standard Natural Sesame', 'سمسم طبيعي قياسي', 'Oilseeds', 'Standard quality natural sesame'),
  ('Cashew', 'كاجو', 'Nuts', 'Raw cashew nuts'),
  ('Shea Butter', 'زبدة الشيا', 'Oils', 'Raw shea butter');
