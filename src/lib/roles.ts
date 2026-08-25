// MASAR Role Configuration
export interface RoleConfig {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  email: string;
  color: string;
  redirect: string;
  sidebar: SidebarSection[];
}

export interface SidebarSection {
  label: string;
  items: { name: string; href: string; icon: string }[];
}

export const roles: RoleConfig[] = [
  {
    id: 'ceo',
    title: 'CEO / Corridor Lead',
    titleAr: 'الرئيس التنفيذي / قائد الممر',
    category: 'Executive',
    email: 'ceo@demo.masar.local',
    color: '#C9A24A',
    redirect: '/app/executive',
    sidebar: [
      { label: 'EXECUTIVE', items: [
        { name: 'Executive Overview', href: '/app/executive', icon: 'Crown' },
        { name: 'Corridor Performance', href: '/app/executive/performance', icon: 'TrendingUp' },
        { name: 'Transaction Portfolio', href: '/app/executive/portfolio', icon: 'FileText' },
        { name: 'Risk & Compliance', href: '/app/executive/risk', icon: 'Shield' },
      ]},
      { label: 'NETWORK', items: [
        { name: 'Buyer Network', href: '/app/executive/buyers', icon: 'Users' },
        { name: 'Exporter Network', href: '/app/executive/exporters', icon: 'Truck' },
        { name: 'Capital & Financing', href: '/app/executive/finance', icon: 'DollarSign' },
      ]},
      { label: 'REPORTING', items: [
        { name: 'Financial Performance', href: '/app/executive/financial', icon: 'BarChart3' },
        { name: 'Board Reporting', href: '/app/executive/board', icon: 'FileText' },
        { name: 'Audit & Governance', href: '/app/executive/audit', icon: 'Scale' },
      ]},
    ],
  },
  {
    id: 'cto',
    title: 'CTO / Protocol Architect',
    titleAr: 'مدير التقنية / معماري البروتوكول',
    category: 'Technology',
    email: 'cto@demo.masar.local',
    color: '#3B82F6',
    redirect: '/app/technology',
    sidebar: [
      { label: 'TECHNOLOGY', items: [
        { name: 'Technology Overview', href: '/app/technology', icon: 'Cpu' },
        { name: 'Transaction Engine', href: '/app/technology/engine', icon: 'Activity' },
        { name: 'Integration Monitor', href: '/app/technology/integrations', icon: 'Network' },
        { name: 'API Health', href: '/app/technology/api', icon: 'Server' },
      ]},
      { label: 'SECURITY', items: [
        { name: 'Security Center', href: '/app/technology/security', icon: 'Shield' },
        { name: 'Audit Infrastructure', href: '/app/technology/audit', icon: 'Database' },
        { name: 'Incident Management', href: '/app/technology/incidents', icon: 'AlertTriangle' },
      ]},
      { label: 'SYSTEM', items: [
        { name: 'Workflow Engine', href: '/app/technology/workflows', icon: 'GitBranch' },
        { name: 'Release Engine', href: '/app/technology/releases', icon: 'Flag' },
        { name: 'System Configuration', href: '/app/technology/config', icon: 'Settings' },
      ]},
    ],
  },
  {
    id: 'operations',
    title: 'Corridor Operations',
    titleAr: 'عمليات الممر',
    category: 'Operations',
    email: 'operations@demo.masar.local',
    color: '#8B5CF6',
    redirect: '/app/operations',
    sidebar: [
      { label: 'OPERATIONS', items: [
        { name: 'Operations Home', href: '/app/operations', icon: 'LayoutDashboard' },
        { name: 'Transaction Queue', href: '/app/operations/queue', icon: 'FileText' },
        { name: 'RFQs & Deals', href: '/app/operations/rfqs', icon: 'MessageSquare' },
        { name: 'Contracts', href: '/app/operations/contracts', icon: 'Receipt' },
      ]},
      { label: 'WORKFLOW', items: [
        { name: 'Compliance Queue', href: '/app/operations/compliance', icon: 'Shield' },
        { name: 'Inspection Queue', href: '/app/operations/inspections', icon: 'Search' },
        { name: 'Finance Queue', href: '/app/operations/finance', icon: 'DollarSign' },
        { name: 'Release Queue', href: '/app/operations/release', icon: 'Unlock' },
      ]},
      { label: 'CONTROL', items: [
        { name: 'Shipment Control', href: '/app/operations/shipments', icon: 'Ship' },
        { name: 'Exception Center', href: '/app/operations/exceptions', icon: 'AlertTriangle' },
        { name: 'Disputes', href: '/app/operations/disputes', icon: 'Scale' },
        { name: 'SLA Monitor', href: '/app/operations/sla', icon: 'Clock' },
      ]},
    ],
  },
  {
    id: 'compliance',
    title: 'KSA Compliance',
    titleAr: 'الامتثال السعودي',
    category: 'Compliance',
    email: 'compliance@demo.masar.local',
    color: '#10B981',
    redirect: '/app/compliance',
    sidebar: [
      { label: 'COMPLIANCE', items: [
        { name: 'Compliance Overview', href: '/app/compliance', icon: 'Shield' },
        { name: 'KYB / KYC', href: '/app/compliance/kyb', icon: 'BadgeCheck' },
        { name: 'Sanctions', href: '/app/compliance/sanctions', icon: 'AlertTriangle' },
        { name: 'Document Review', href: '/app/compliance/documents', icon: 'FileText' },
      ]},
      { label: 'WORKFLOW', items: [
        { name: 'Compliance Packs', href: '/app/compliance/packs', icon: 'Package' },
        { name: 'Clearance Readiness', href: '/app/compliance/clearance', icon: 'Target' },
        { name: 'SFDA Workflow', href: '/app/compliance/sfda', icon: 'CheckCircle' },
        { name: 'ZATCA Workflow', href: '/app/compliance/zatca', icon: 'Receipt' },
      ]},
      { label: 'EVIDENCE', items: [
        { name: 'Exceptions', href: '/app/compliance/exceptions', icon: 'AlertTriangle' },
        { name: 'Regulatory Evidence', href: '/app/compliance/evidence', icon: 'Shield' },
        { name: 'Audit History', href: '/app/compliance/audit', icon: 'History' },
      ]},
    ],
  },
  {
    id: 'origin',
    title: 'Nigeria Origin Ops',
    titleAr: 'عمليات المصدر النيجيري',
    category: 'Origin',
    email: 'origin@demo.masar.local',
    color: '#F59E0B',
    redirect: '/app/origin',
    sidebar: [
      { label: 'ORIGIN', items: [
        { name: 'Origin Overview', href: '/app/origin', icon: 'MapPin' },
        { name: 'Exporter Network', href: '/app/origin/exporters', icon: 'Truck' },
        { name: 'Exporter Onboarding', href: '/app/origin/onboarding', icon: 'UserPlus' },
        { name: 'Commodity Lots', href: '/app/origin/lots', icon: 'Package' },
      ]},
      { label: 'OPERATIONS', items: [
        { name: 'Warehouses', href: '/app/origin/warehouses', icon: 'Building2' },
        { name: 'Inspection Scheduling', href: '/app/origin/inspections', icon: 'Calendar' },
        { name: 'Quality Control', href: '/app/origin/quality', icon: 'CheckCircle' },
        { name: 'Origin Documents', href: '/app/origin/documents', icon: 'FileText' },
      ]},
      { label: 'LOGISTICS', items: [
        { name: 'Port Operations', href: '/app/origin/ports', icon: 'Anchor' },
        { name: 'Shipment Preparation', href: '/app/origin/shipments', icon: 'Ship' },
        { name: 'Supplier Performance', href: '/app/origin/performance', icon: 'BarChart3' },
      ]},
    ],
  },
  {
    id: 'tradefinance',
    title: 'Head of Trade Finance',
    titleAr: 'رئيس التمويل التجاري',
    category: 'Finance',
    email: 'tradefinance@demo.masar.local',
    color: '#2D7D46',
    redirect: '/app/tradefinance',
    sidebar: [
      { label: 'FINANCE', items: [
        { name: 'Finance Overview', href: '/app/tradefinance', icon: 'DollarSign' },
        { name: 'Funding Requests', href: '/app/tradefinance/requests', icon: 'FileText' },
        { name: 'Underwriting', href: '/app/tradefinance/underwriting', icon: 'Shield' },
        { name: 'Facilities', href: '/app/tradefinance/facilities', icon: 'Building2' },
      ]},
      { label: 'PORTFOLIO', items: [
        { name: 'Exposure', href: '/app/tradefinance/exposure', icon: 'BarChart3' },
        { name: 'Repayments', href: '/app/tradefinance/repayments', icon: 'TrendingUp' },
        { name: 'Defaults', href: '/app/tradefinance/defaults', icon: 'AlertTriangle' },
        { name: 'Risk', href: '/app/tradefinance/risk', icon: 'Shield' },
      ]},
      { label: 'PARTNERS', items: [
        { name: 'Capital Partners', href: '/app/tradefinance/partners', icon: 'Landmark' },
        { name: 'Funding Calendar', href: '/app/tradefinance/calendar', icon: 'Calendar' },
        { name: 'Finance Reports', href: '/app/tradefinance/reports', icon: 'BarChart3' },
      ]},
    ],
  },
  {
    id: 'finance',
    title: 'CFO / Finance',
    titleAr: 'المدير المالي',
    category: 'Finance',
    email: 'finance@demo.masar.local',
    color: '#059669',
    redirect: '/app/cfo',
    sidebar: [
      { label: 'FINANCIAL', items: [
        { name: 'Finance Overview', href: '/app/cfo', icon: 'BarChart3' },
        { name: 'Revenue', href: '/app/cfo/revenue', icon: 'TrendingUp' },
        { name: 'GMV', href: '/app/cfo/gmv', icon: 'DollarSign' },
        { name: 'Invoices', href: '/app/cfo/invoices', icon: 'FileText' },
      ]},
      { label: 'OPERATIONS', items: [
        { name: 'Settlement', href: '/app/cfo/settlement', icon: 'Landmark' },
        { name: 'Reconciliation', href: '/app/cfo/reconciliation', icon: 'CheckCircle' },
        { name: 'Fees', href: '/app/cfo/fees', icon: 'Percent' },
        { name: 'Partner Payments', href: '/app/cfo/payments', icon: 'Users' },
      ]},
      { label: 'CONTROLS', items: [
        { name: 'Cash Position', href: '/app/cfo/cash', icon: 'Banknote' },
        { name: 'Forecast', href: '/app/cfo/forecast', icon: 'TrendingUp' },
        { name: 'Financial Controls', href: '/app/cfo/controls', icon: 'Shield' },
      ]},
    ],
  },
  {
    id: 'buyer',
    title: 'Saudi Anchor Buyer',
    titleAr: 'المشتري السعودي',
    category: 'External',
    email: 'buyer@demo.masar.local',
    color: '#DC2626',
    redirect: '/buyer',
    sidebar: [
      { label: 'TRADE DESK', items: [
        { name: 'Overview', href: '/buyer', icon: 'LayoutDashboard' },
        { name: 'RFQs', href: '/buyer/rfqs', icon: 'MessageSquare' },
        { name: 'Transactions', href: '/buyer/transactions', icon: 'FileText' },
        { name: 'Suppliers', href: '/buyer/suppliers', icon: 'Truck' },
      ]},
      { label: 'TRACKING', items: [
        { name: 'Inspections', href: '/buyer/inspections', icon: 'Search' },
        { name: 'Shipments', href: '/buyer/shipments', icon: 'Ship' },
        { name: 'Documents', href: '/buyer/documents', icon: 'FolderOpen' },
      ]},
      { label: 'FINANCIAL', items: [
        { name: 'Invoices', href: '/buyer/invoices', icon: 'Receipt' },
        { name: 'Payments', href: '/buyer/payments', icon: 'DollarSign' },
        { name: 'Disputes', href: '/buyer/disputes', icon: 'Scale' },
      ]},
    ],
  },
  {
    id: 'exporter',
    title: 'Nigerian Exporter',
    titleAr: 'المصدر النيجيري',
    category: 'External',
    email: 'exporter@demo.masar.local',
    color: '#16A34A',
    redirect: '/exporter',
    sidebar: [
      { label: 'EXPORT', items: [
        { name: 'Dashboard', href: '/exporter', icon: 'LayoutDashboard' },
        { name: 'Opportunities', href: '/exporter/opportunities', icon: 'Target' },
        { name: 'Orders', href: '/exporter/orders', icon: 'FileText' },
        { name: 'RFQs', href: '/exporter/rfqs', icon: 'MessageSquare' },
      ]},
      { label: 'OPERATIONS', items: [
        { name: 'Compliance', href: '/exporter/compliance', icon: 'Shield' },
        { name: 'Documents', href: '/exporter/documents', icon: 'FolderOpen' },
        { name: 'Inspections', href: '/exporter/inspections', icon: 'Search' },
      ]},
      { label: 'FINANCIAL', items: [
        { name: 'Financing', href: '/exporter/financing', icon: 'DollarSign' },
        { name: 'Shipments', href: '/exporter/shipments', icon: 'Ship' },
        { name: 'Payments', href: '/exporter/payments', icon: 'Banknote' },
      ]},
    ],
  },
  {
    id: 'capital',
    title: 'Capital Partner',
    titleAr: 'شريك رأس المال',
    category: 'External',
    email: 'capital@demo.masar.local',
    color: '#7C3AED',
    redirect: '/capital',
    sidebar: [
      { label: 'PORTFOLIO', items: [
        { name: 'Portfolio Overview', href: '/capital', icon: 'BarChart3' },
        { name: 'Funding Requests', href: '/capital/requests', icon: 'FileText' },
        { name: 'Exposure', href: '/capital/exposure', icon: 'TrendingUp' },
      ]},
      { label: 'MANAGEMENT', items: [
        { name: 'Facilities', href: '/capital/facilities', icon: 'Building2' },
        { name: 'Repayments', href: '/capital/repayments', icon: 'DollarSign' },
        { name: 'Risk', href: '/capital/risk', icon: 'Shield' },
      ]},
      { label: 'REPORTING', items: [
        { name: 'Transactions', href: '/capital/transactions', icon: 'Activity' },
        { name: 'Reports', href: '/capital/reports', icon: 'BarChart3' },
      ]},
    ],
  },
  {
    id: 'inspector',
    title: 'Inspection Partner',
    titleAr: 'شريك الفحص',
    category: 'External',
    email: 'inspector@demo.masar.local',
    color: '#0891B2',
    redirect: '/inspector',
    sidebar: [
      { label: 'INSPECTIONS', items: [
        { name: 'Workbench', href: '/inspector', icon: 'Search' },
        { name: 'Assignments', href: '/inspector/assignments', icon: 'FileText' },
        { name: 'Schedule', href: '/inspector/schedule', icon: 'Calendar' },
      ]},
      { label: 'RESULTS', items: [
        { name: 'Samples', href: '/inspector/samples', icon: 'Beaker' },
        { name: 'Reports', href: '/inspector/reports', icon: 'FileText' },
        { name: 'Exceptions', href: '/inspector/exceptions', icon: 'AlertTriangle' },
      ]},
    ],
  },
  {
    id: 'auditor',
    title: 'Audit / Regulatory',
    titleAr: 'التدقيق / التنظيم',
    category: 'Governance',
    email: 'auditor@demo.masar.local',
    color: '#6B7280',
    redirect: '/audit-portal',
    sidebar: [
      { label: 'EVIDENCE', items: [
        { name: 'Audit Overview', href: '/audit-portal', icon: 'Scale' },
        { name: 'Transactions', href: '/audit-portal/transactions', icon: 'FileText' },
        { name: 'Document Chain', href: '/audit-portal/documents', icon: 'FolderOpen' },
      ]},
      { label: 'LEDGER', items: [
        { name: 'Release Ledger', href: '/audit-portal/releases', icon: 'Lock' },
        { name: 'Screening Logs', href: '/audit-portal/screening', icon: 'Shield' },
        { name: 'Access Logs', href: '/audit-portal/access', icon: 'Eye' },
      ]},
    ],
  },
  {
    id: 'admin',
    title: 'System Administrator',
    titleAr: 'مدير النظام',
    category: 'Administration',
    email: 'admin@demo.masar.local',
    color: '#4B5563',
    redirect: '/dashboard',
    sidebar: [
      { label: 'ADMIN', items: [
        { name: 'System Overview', href: '/dashboard', icon: 'LayoutDashboard' },
        { name: 'Users', href: '/dashboard/users', icon: 'Users' },
        { name: 'Roles', href: '/dashboard/roles', icon: 'Shield' },
        { name: 'Permissions', href: '/dashboard/permissions', icon: 'KeyRound' },
      ]},
      { label: 'CONFIGURATION', items: [
        { name: 'Organizations', href: '/dashboard/organizations', icon: 'Building2' },
        { name: 'Integrations', href: '/dashboard/integrations', icon: 'Network' },
        { name: 'Feature Flags', href: '/dashboard/features', icon: 'Flag' },
        { name: 'System Settings', href: '/dashboard/settings', icon: 'Settings' },
      ]},
      { label: 'MONITORING', items: [
        { name: 'Audit Logs', href: '/dashboard/audit', icon: 'History' },
        { name: 'Security', href: '/dashboard/security', icon: 'Shield' },
        { name: 'Notifications', href: '/dashboard/notifications', icon: 'Bell' },
      ]},
    ],
  },
];

export function getRoleById(id: string): RoleConfig | undefined {
  return roles.find(r => r.id === id);
}

export function getCurrentRole(): RoleConfig | null {
  if (typeof window === 'undefined') return null;
  const roleId = localStorage.getItem('masar-role');
  if (!roleId) return null;
  return getRoleById(roleId) || null;
}
