-- MASAR Protocol Database - Migration 005
-- Organization Memberships

-- Organization members table
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  is_primary BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(organization_id, user_id, role_id)
);

-- Create indexes
CREATE INDEX idx_org_members_organization ON public.organization_members(organization_id);
CREATE INDEX idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX idx_org_members_role ON public.organization_members(role_id);
CREATE INDEX idx_org_members_status ON public.organization_members(status);
CREATE INDEX idx_org_members_primary ON public.organization_members(is_primary) WHERE is_primary = TRUE;

-- Enable RLS
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Members can view own memberships"
  ON public.organization_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Organization admins can view members"
  ON public.organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role_id IN (
        SELECT id FROM public.roles WHERE code IN ('SUPER_ADMIN', 'PARTNER_ADMIN', 'BUYER_ADMIN', 'EXPORTER_ADMIN')
      )
      AND om.status = 'active'
    )
  );

CREATE POLICY "System admins can view all members"
  ON public.organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.user_id = auth.uid()
      AND om.role_id IN (SELECT id FROM public.roles WHERE code = 'SUPER_ADMIN')
      AND om.status = 'active'
    )
  );

CREATE POLICY "Organization admins can insert members"
  ON public.organization_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = NEW.organization_id
      AND om.user_id = auth.uid()
      AND om.role_id IN (
        SELECT id FROM public.roles WHERE code IN ('SUPER_ADMIN', 'PARTNER_ADMIN', 'BUYER_ADMIN', 'EXPORTER_ADMIN')
      )
      AND om.status = 'active'
    )
  );

CREATE POLICY "Organization admins can update members"
  ON public.organization_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role_id IN (
        SELECT id FROM public.roles WHERE code IN ('SUPER_ADMIN', 'PARTNER_ADMIN', 'BUYER_ADMIN', 'EXPORTER_ADMIN')
      )
      AND om.status = 'active'
    )
  );

-- Create triggers
CREATE TRIGGER set_org_members_updated_at
  BEFORE UPDATE ON public.organization_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get user's organization IDs
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

-- Function to get user's role codes
CREATE OR REPLACE FUNCTION public.get_user_role_codes()
RETURNS SETOF TEXT AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT r.code
  FROM public.organization_members om
  JOIN public.roles r ON om.role_id = r.id
  WHERE om.user_id = auth.uid()
  AND om.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION public.user_has_permission(permission_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.role_permissions rp ON om.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE om.user_id = auth.uid()
    AND p.code = permission_code
    AND om.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON TABLE public.organization_members IS 'User memberships in organizations';
COMMENT ON FUNCTION public.get_user_organization_ids IS 'Returns organization IDs for current user';
COMMENT ON FUNCTION public.get_user_role_codes IS Returns role codes for current user';
COMMENT ON FUNCTION public.user_has_permission IS 'Checks if current user has specific permission';
