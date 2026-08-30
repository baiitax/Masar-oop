-- MASAR Quick Setup SQL
-- Run this in Supabase SQL Editor to enable registration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  display_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  job_title TEXT,
  country TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create organization type enum
DO $$ BEGIN
  CREATE TYPE public.organization_type AS ENUM (
    'BUYER', 'EXPORTER', 'SUPPLIER_SYNDICATE', 'INSPECTION_PARTNER',
    'LABORATORY', 'LOGISTICS_PARTNER', 'FINANCIAL_PARTNER',
    'CUSTOMS_BROKER', 'ADMIN', 'INSTITUTIONAL_PARTNER'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Create organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
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
  status TEXT DEFAULT 'pending',
  verification_status TEXT DEFAULT 'unverified',
  risk_level TEXT DEFAULT 'medium',
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id),
  deletion_reason TEXT
);

-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  organization_type public.organization_type,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create organization_members table
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id),
  status TEXT DEFAULT 'active',
  is_primary BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id, role_id)
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- Insert default roles
INSERT INTO public.roles (code, name, description, is_system) VALUES
  ('SUPER_ADMIN', 'Super Administrator', 'Full system access', TRUE),
  ('CEO', 'CEO', 'Executive dashboard', TRUE),
  ('OPERATIONS', 'Operations', 'Operations dashboard', TRUE),
  ('COMPLIANCE', 'Compliance', 'Compliance dashboard', TRUE),
  ('TRADE_FINANCE', 'Trade Finance', 'Finance dashboard', TRUE),
  ('BUYER_ADMIN', 'Buyer Admin', 'Buyer organization admin', FALSE),
  ('BUYER_USER', 'Buyer User', 'Buyer portal access', FALSE),
  ('EXPORTER_ADMIN', 'Exporter Admin', 'Exporter organization admin', FALSE),
  ('EXPORTER_USER', 'Exporter User', 'Exporter portal access', FALSE),
  ('INSPECTOR', 'Inspector', 'Inspection portal', FALSE),
  ('AUDITOR', 'Auditor', 'Audit portal', TRUE),
  ('PARTNER_ADMIN', 'Partner Admin', 'Partner admin', FALSE)
ON CONFLICT (code) DO NOTHING;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- RLS Policies for organizations
CREATE POLICY "Organizations can be created by authenticated users"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Organizations viewable by members"
  ON public.organizations FOR SELECT
  USING (
    deleted_at IS NULL AND (
      EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = id
        AND om.user_id = auth.uid()
        AND om.status = 'active'
      )
    )
  );

-- RLS Policies for roles (read-only)
CREATE POLICY "Roles viewable by authenticated users"
  ON public.roles FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

-- RLS Policies for organization_members
CREATE POLICY "Members viewable by organization members"
  ON public.organization_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
    )
  );

CREATE POLICY "Members can be created by authenticated users"
  ON public.organization_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_type ON public.organizations(organization_type);
CREATE INDEX IF NOT EXISTS idx_organizations_country ON public.organizations(country_code);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_roles_code ON public.roles(code);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'MASAR Quick Setup Complete!';
END $$;
