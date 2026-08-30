-- MASAR Database Setup V4
-- Fixed: RLS policies for registration flow

-- Step 1: Drop existing tables
DROP TABLE IF EXISTS public.organization_members CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_organization_ids() CASCADE;

-- Step 2: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 3: Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE NOT NULL,
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

-- Step 4: Create organization type enum
DO $$ BEGIN
  CREATE TYPE public.organization_type AS ENUM (
    'BUYER', 'EXPORTER', 'SUPPLIER_SYNDICATE', 'INSPECTION_PARTNER',
    'LABORATORY', 'LOGISTICS_PARTNER', 'FINANCIAL_PARTNER',
    'CUSTOMS_BROKER', 'ADMIN', 'INSTITUTIONAL_PARTNER'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Step 5: Create organizations table
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
  status TEXT DEFAULT 'pending',
  verification_status TEXT DEFAULT 'unverified',
  risk_level TEXT DEFAULT 'medium',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Step 6: Create roles table
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 7: Create organization_members table
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role_id UUID NOT NULL REFERENCES public.roles(id),
  status TEXT DEFAULT 'active',
  is_primary BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id, role_id)
);

-- Step 8: Insert default roles
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
  ('PARTNER_ADMIN', 'Partner Admin', 'Partner admin', FALSE);

-- Step 9: Create helper function
CREATE OR REPLACE FUNCTION public.get_user_organization_ids()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
  SELECT organization_id
  FROM public.organization_members
  WHERE user_id = auth.uid()
  AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Step 10: Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, auth_user_id, full_name, email)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 12: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Step 13: RLS Policies

-- Profiles: Users can manage their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- Organizations: Allow authenticated users to create and view
CREATE POLICY "Authenticated users can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Organizations viewable by authenticated users"
  ON public.organizations FOR SELECT
  USING (auth.role() = 'authenticated' AND deleted_at IS NULL);

CREATE POLICY "Organizations updatable by authenticated users"
  ON public.organizations FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Roles: Read-only for authenticated users
CREATE POLICY "Roles viewable by authenticated users"
  ON public.roles FOR SELECT
  USING (auth.role() = 'authenticated' AND active = TRUE);

-- Organization Members: Allow authenticated users to create and view
CREATE POLICY "Authenticated users can create memberships"
  ON public.organization_members FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view own memberships"
  ON public.organization_members FOR SELECT
  USING (user_id = auth.uid() OR auth.role() = 'authenticated');

CREATE POLICY "Users can update own memberships"
  ON public.organization_members FOR UPDATE
  USING (user_id = auth.uid());

-- Step 14: Indexes
CREATE INDEX idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_organizations_type ON public.organizations(organization_type);
CREATE INDEX idx_organizations_country ON public.organizations(country_code);
CREATE INDEX idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX idx_roles_code ON public.roles(code);

-- Done!
SELECT 'MASAR database setup complete! Registration should work now.' as status;
