-- MASAR Protocol Database - Migration 004
-- Roles and Permissions

-- Roles table
CREATE TABLE public.roles (
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

-- Permissions table
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role permissions junction table
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(role_id, permission_id)
);

-- Create indexes
CREATE INDEX idx_roles_code ON public.roles(code);
CREATE INDEX idx_roles_organization_type ON public.roles(organization_type);
CREATE INDEX idx_permissions_code ON public.permissions(code);
CREATE INDEX idx_permissions_category ON public.permissions(category);
CREATE INDEX idx_role_permissions_role ON public.role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON public.role_permissions(permission_id);

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (read-only for authenticated users)
CREATE POLICY "Roles are viewable by authenticated users"
  ON public.roles FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

CREATE POLICY "Permissions are viewable by authenticated users"
  ON public.permissions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Role permissions are viewable by authenticated users"
  ON public.role_permissions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admin policies
CREATE POLICY "Roles can be managed by super admins"
  ON public.roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.user_id = auth.uid()
      AND om.role_id IN (SELECT id FROM public.roles WHERE code = 'SUPER_ADMIN')
      AND om.status = 'active'
    )
  );

-- Create triggers
CREATE TRIGGER set_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default roles
INSERT INTO public.roles (code, name, description, is_system, organization_type) VALUES
  ('SUPER_ADMIN', 'Super Administrator', 'Full system access', TRUE, 'ADMIN'),
  ('CEO', 'Chief Executive Officer', 'Executive dashboard access', TRUE, 'ADMIN'),
  ('CTO', 'Chief Technology Officer', 'Technology and protocol access', TRUE, 'ADMIN'),
  ('OPERATIONS', 'Operations Manager', 'Operations dashboard and task management', TRUE, 'ADMIN'),
  ('COMPLIANCE', 'Compliance Officer', 'KYB, compliance, and regulatory access', TRUE, 'ADMIN'),
  ('ORIGIN_OPERATIONS', 'Origin Operations', 'Nigeria origin operations', TRUE, 'ADMIN'),
  ('TRADE_FINANCE', 'Trade Finance Manager', 'Finance and funding access', TRUE, 'ADMIN'),
  ('CFO', 'Chief Financial Officer', 'Financial oversight access', TRUE, 'ADMIN'),
  ('BUYER_ADMIN', 'Buyer Administrator', 'Buyer organization admin', FALSE, 'BUYER'),
  ('BUYER_USER', 'Buyer User', 'Buyer portal access', FALSE, 'BUYER'),
  ('EXPORTER_ADMIN', 'Exporter Administrator', 'Exporter organization admin', FALSE, 'EXPORTER'),
  ('EXPORTER_USER', 'Exporter User', 'Exporter portal access', FALSE, 'EXPORTER'),
  ('INSPECTOR', 'Inspector', 'Inspection assignments and reports', FALSE, 'INSPECTION_PARTNER'),
  ('LABORATORY', 'Laboratory Technician', 'Lab results and testing', FALSE, 'LABORATORY'),
  ('AUDITOR', 'Auditor', 'Read-only audit access', TRUE, 'ADMIN'),
  ('PARTNER_ADMIN', 'Partner Administrator', 'Partner organization admin', FALSE, NULL),
  ('FINANCIAL_PARTNER', 'Financial Partner', 'Finance partner access', FALSE, 'FINANCIAL_PARTNER');

-- Insert default permissions
INSERT INTO public.permissions (code, name, description, category) VALUES
  -- Transaction permissions
  ('transaction.view', 'View Transactions', 'View transaction details', 'transaction'),
  ('transaction.create', 'Create Transactions', 'Create new transactions', 'transaction'),
  ('transaction.edit', 'Edit Transactions', 'Modify transaction details', 'transaction'),
  ('transaction.approve', 'Approve Transactions', 'Approve transaction progression', 'transaction'),
  ('transaction.cancel', 'Cancel Transactions', 'Cancel transactions', 'transaction'),
  
  -- KYB permissions
  ('kyb.view', 'View KYB', 'View KYB cases', 'kyb'),
  ('kyb.submit', 'Submit KYB', 'Submit KYB applications', 'kyb'),
  ('kyb.review', 'Review KYB', 'Review KYB submissions', 'kyb'),
  ('kyb.approve', 'Approve KYB', 'Approve KYB verification', 'kyb'),
  
  -- Compliance permissions
  ('compliance.view', 'View Compliance', 'View compliance status', 'compliance'),
  ('compliance.request_document', 'Request Documents', 'Request compliance documents', 'compliance'),
  ('compliance.verify', 'Verify Documents', 'Verify compliance documents', 'compliance'),
  ('compliance.approve', 'Approve Compliance', 'Approve compliance packs', 'compliance'),
  
  -- Inspection permissions
  ('inspection.create', 'Create Inspection', 'Create inspection requests', 'inspection'),
  ('inspection.assign', 'Assign Inspector', 'Assign inspectors', 'inspection'),
  ('inspection.view', 'View Inspection', 'View inspection details', 'inspection'),
  ('inspection.approve', 'Approve Inspection', 'Approve inspection results', 'inspection'),
  
  -- Finance permissions
  ('finance.view', 'View Finance', 'View financial records', 'finance'),
  ('finance.request', 'Request Funding', 'Submit funding requests', 'finance'),
  ('finance.approve', 'Approve Funding', 'Approve funding requests', 'finance'),
  
  -- Release permissions
  ('release.view', 'View Release', 'View release status', 'release'),
  ('release.evaluate', 'Evaluate Release', 'Evaluate release conditions', 'release'),
  ('release.approve', 'Approve Release', 'Authorize transaction release', 'release'),
  
  -- Settlement permissions
  ('settlement.view', 'View Settlement', 'View settlement details', 'settlement'),
  ('settlement.authorize', 'Authorize Settlement', 'Authorize settlements', 'settlement'),
  
  -- Audit permissions
  ('audit.view', 'View Audit Logs', 'View audit trail', 'audit'),
  ('audit.export', 'Export Audit Data', 'Export audit data', 'audit'),
  
  -- Document permissions
  ('document.upload', 'Upload Documents', 'Upload documents', 'document'),
  ('document.verify', 'Verify Documents', 'Verify document authenticity', 'document'),
  ('document.view', 'View Documents', 'View document details', 'document'),
  
  -- Organization permissions
  ('organization.view', 'View Organization', 'View organization details', 'organization'),
  ('organization.manage', 'Manage Organization', 'Manage organization settings', 'organization'),
  
  -- User management
  ('user.view', 'View Users', 'View user list', 'user'),
  ('user.manage', 'Manage Users', 'Manage user accounts', 'user');

-- Assign permissions to roles
-- Super Admin gets all permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE code = 'SUPER_ADMIN'),
  id
FROM public.permissions;

-- CEO permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE code = 'CEO'),
  id
FROM public.permissions
WHERE code IN (
  'transaction.view', 'kyb.view', 'compliance.view', 'finance.view',
  'release.view', 'settlement.view', 'audit.view', 'organization.view'
);

-- Operations permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE code = 'OPERATIONS'),
  id
FROM public.permissions
WHERE code IN (
  'transaction.view', 'transaction.create', 'transaction.edit', 'transaction.approve',
  'kyb.view', 'compliance.view', 'inspection.view', 'inspection.create', 'inspection.assign',
  'release.view', 'release.evaluate', 'release.approve',
  'document.view', 'document.upload', 'document.verify',
  'audit.view', 'user.view'
);

-- Compliance permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE code = 'COMPLIANCE'),
  id
FROM public.permissions
WHERE code IN (
  'transaction.view', 'kyb.view', 'kyb.review', 'kyb.approve',
  'compliance.view', 'compliance.request_document', 'compliance.verify', 'compliance.approve',
  'document.view', 'document.verify',
  'audit.view'
);

-- Buyer permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE code = 'BUYER_USER'),
  id
FROM public.permissions
WHERE code IN (
  'transaction.view', 'transaction.create',
  'kyb.view', 'kyb.submit',
  'compliance.view',
  'inspection.view',
  'finance.view', 'finance.request',
  'release.view',
  'settlement.view',
  'document.view', 'document.upload'
);

-- Exporter permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE code = 'EXPORTER_USER'),
  id
FROM public.permissions
WHERE code IN (
  'transaction.view',
  'kyb.view', 'kyb.submit',
  'compliance.view', 'compliance.request_document',
  'inspection.view',
  'finance.view', 'finance.request',
  'release.view',
  'settlement.view',
  'document.view', 'document.upload'
);

-- Inspector permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE code = 'INSPECTOR'),
  id
FROM public.permissions
WHERE code IN (
  'inspection.view', 'inspection.create', 'inspection.approve',
  'document.view', 'document.upload'
);

-- Auditor permissions (read-only)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM public.roles WHERE code = 'AUDITOR'),
  id
FROM public.permissions
WHERE code IN (
  'transaction.view', 'kyb.view', 'compliance.view', 'inspection.view',
  'finance.view', 'release.view', 'settlement.view', 'audit.view', 'audit.export',
  'document.view', 'organization.view'
);

COMMENT ON TABLE public.roles IS 'System and organization roles';
COMMENT ON TABLE public.permissions IS 'Granular action-based permissions';
COMMENT ON TABLE public.role_permissions IS 'Role-permission assignments';
