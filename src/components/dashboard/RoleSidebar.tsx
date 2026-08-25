'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FileText, Users, Truck, MessageSquare, Shield, FolderOpen, 
  Search, DollarSign, Ship, History, Settings, LogOut, Globe, Bell,
  ChevronRight, ChevronLeft, BarChart3, AlertTriangle,
  CheckCircle, Clock, Eye, KeyRound, Database, Activity, Package, Scale,
  Building2, Landmark, Network, Target, Layers, Compass, Flag, Receipt,
  ClipboardCheck, BadgeCheck, Anchor, Wheat, Cpu, Server, Crown,
  MapPin, Calendar, Unlock, UserPlus, Beaker, Percent, Banknote, TrendingUp,
  GitBranch, Cog, Lock, PieChart, Send, FileCheck, Award, Star
} from 'lucide-react';

// Role configuration
const roleConfigs: Record<string, {
  title: string;
  titleAr: string;
  category: string;
  email: string;
  color: string;
  redirect: string;
  sidebar: { label: string; items: { name: string; href: string; icon: any }[] }[];
}> = {
  ceo: {
    title: 'CEO / Corridor Lead',
    titleAr: 'الرئيس التنفيذي / قائد الممر',
    category: 'Executive',
    email: 'ceo@demo.masar.local',
    color: '#C9A24A',
    redirect: '/app/executive',
    sidebar: [
      { label: 'EXECUTIVE', items: [
        { name: 'Executive Overview', href: '/app/executive', icon: Crown },
        { name: 'Corridor Performance', href: '/app/executive/performance', icon: TrendingUp },
        { name: 'Transaction Portfolio', href: '/app/executive/portfolio', icon: FileText },
        { name: 'Risk & Compliance', href: '/app/executive/risk', icon: Shield },
      ]},
      { label: 'NETWORK', items: [
        { name: 'Buyer Network', href: '/app/executive/buyers', icon: Users },
        { name: 'Exporter Network', href: '/app/executive/exporters', icon: Truck },
        { name: 'Capital & Financing', href: '/app/executive/finance', icon: DollarSign },
      ]},
      { label: 'REPORTING', items: [
        { name: 'Financial Performance', href: '/app/executive/financial', icon: BarChart3 },
        { name: 'Board Reporting', href: '/app/executive/board', icon: FileText },
        { name: 'Audit & Governance', href: '/app/executive/audit', icon: Scale },
      ]},
    ],
  },
  cto: {
    title: 'CTO / Protocol Architect',
    titleAr: 'مدير التقنية / معماري البروتوكول',
    category: 'Technology',
    email: 'cto@demo.masar.local',
    color: '#3B82F6',
    redirect: '/app/technology',
    sidebar: [
      { label: 'TECHNOLOGY', items: [
        { name: 'Technology Overview', href: '/app/technology', icon: Cpu },
        { name: 'Transaction Engine', href: '/app/technology/engine', icon: Activity },
        { name: 'Integration Monitor', href: '/app/technology/integrations', icon: Network },
        { name: 'API Health', href: '/app/technology/api', icon: Server },
      ]},
      { label: 'SECURITY', items: [
        { name: 'Security Center', href: '/app/technology/security', icon: Shield },
        { name: 'Audit Infrastructure', href: '/app/technology/audit', icon: Database },
        { name: 'Incident Management', href: '/app/technology/incidents', icon: AlertTriangle },
      ]},
      { label: 'SYSTEM', items: [
        { name: 'Workflow Engine', href: '/app/technology/workflows', icon: GitBranch },
        { name: 'Release Engine', href: '/app/technology/releases', icon: Flag },
        { name: 'System Configuration', href: '/app/technology/config', icon: Settings },
      ]},
    ],
  },
  operations: {
    title: 'Corridor Operations',
    titleAr: 'عمليات الممر',
    category: 'Operations',
    email: 'operations@demo.masar.local',
    color: '#8B5CF6',
    redirect: '/app/operations',
    sidebar: [
      { label: 'OPERATIONS', items: [
        { name: 'Operations Home', href: '/app/operations', icon: LayoutDashboard },
        { name: 'Transaction Queue', href: '/app/operations/queue', icon: FileText },
        { name: 'RFQs & Deals', href: '/app/operations/rfqs', icon: MessageSquare },
        { name: 'Contracts', href: '/app/operations/contracts', icon: Receipt },
      ]},
      { label: 'WORKFLOW', items: [
        { name: 'Compliance Queue', href: '/app/operations/compliance', icon: Shield },
        { name: 'Inspection Queue', href: '/app/operations/inspections', icon: Search },
        { name: 'Finance Queue', href: '/app/operations/finance', icon: DollarSign },
        { name: 'Release Queue', href: '/app/operations/release', icon: Unlock },
      ]},
      { label: 'CONTROL', items: [
        { name: 'Shipment Control', href: '/app/operations/shipments', icon: Ship },
        { name: 'Exception Center', href: '/app/operations/exceptions', icon: AlertTriangle },
        { name: 'Disputes', href: '/app/operations/disputes', icon: Scale },
        { name: 'SLA Monitor', href: '/app/operations/sla', icon: Clock },
      ]},
    ],
  },
  compliance: {
    title: 'KSA Compliance',
    titleAr: 'الامتثال السعودي',
    category: 'Compliance',
    email: 'compliance@demo.masar.local',
    color: '#10B981',
    redirect: '/app/compliance',
    sidebar: [
      { label: 'COMPLIANCE', items: [
        { name: 'Compliance Overview', href: '/app/compliance', icon: Shield },
        { name: 'KYB / KYC', href: '/app/compliance/kyb', icon: BadgeCheck },
        { name: 'Sanctions', href: '/app/compliance/sanctions', icon: AlertTriangle },
        { name: 'Document Review', href: '/app/compliance/documents', icon: FileText },
      ]},
      { label: 'WORKFLOW', items: [
        { name: 'Compliance Packs', href: '/app/compliance/packs', icon: Package },
        { name: 'Clearance Readiness', href: '/app/compliance/clearance', icon: Target },
        { name: 'SFDA Workflow', href: '/app/compliance/sfda', icon: CheckCircle },
        { name: 'ZATCA Workflow', href: '/app/compliance/zatca', icon: Receipt },
      ]},
      { label: 'EVIDENCE', items: [
        { name: 'Exceptions', href: '/app/compliance/exceptions', icon: AlertTriangle },
        { name: 'Regulatory Evidence', href: '/app/compliance/evidence', icon: Shield },
        { name: 'Audit History', href: '/app/compliance/audit', icon: History },
      ]},
    ],
  },
  origin: {
    title: 'Nigeria Origin Ops',
    titleAr: 'عمليات المصدر النيجيري',
    category: 'Origin',
    email: 'origin@demo.masar.local',
    color: '#F59E0B',
    redirect: '/app/origin',
    sidebar: [
      { label: 'ORIGIN', items: [
        { name: 'Origin Overview', href: '/app/origin', icon: MapPin },
        { name: 'Exporter Network', href: '/app/origin/exporters', icon: Truck },
        { name: 'Exporter Onboarding', href: '/app/origin/onboarding', icon: UserPlus },
        { name: 'Commodity Lots', href: '/app/origin/lots', icon: Package },
      ]},
      { label: 'OPERATIONS', items: [
        { name: 'Warehouses', href: '/app/origin/warehouses', icon: Building2 },
        { name: 'Inspection Scheduling', href: '/app/origin/inspections', icon: Calendar },
        { name: 'Quality Control', href: '/app/origin/quality', icon: CheckCircle },
        { name: 'Origin Documents', href: '/app/origin/documents', icon: FileText },
      ]},
      { label: 'LOGISTICS', items: [
        { name: 'Port Operations', href: '/app/origin/ports', icon: Anchor },
        { name: 'Shipment Preparation', href: '/app/origin/shipments', icon: Ship },
        { name: 'Supplier Performance', href: '/app/origin/performance', icon: BarChart3 },
      ]},
    ],
  },
  tradefinance: {
    title: 'Head of Trade Finance',
    titleAr: 'رئيس التمويل التجاري',
    category: 'Finance',
    email: 'tradefinance@demo.masar.local',
    color: '#2D7D46',
    redirect: '/app/tradefinance',
    sidebar: [
      { label: 'FINANCE', items: [
        { name: 'Finance Overview', href: '/app/tradefinance', icon: DollarSign },
        { name: 'Funding Requests', href: '/app/tradefinance/requests', icon: FileText },
        { name: 'Underwriting', href: '/app/tradefinance/underwriting', icon: Shield },
        { name: 'Facilities', href: '/app/tradefinance/facilities', icon: Building2 },
      ]},
      { label: 'PORTFOLIO', items: [
        { name: 'Exposure', href: '/app/tradefinance/exposure', icon: BarChart3 },
        { name: 'Repayments', href: '/app/tradefinance/repayments', icon: TrendingUp },
        { name: 'Defaults', href: '/app/tradefinance/defaults', icon: AlertTriangle },
        { name: 'Risk', href: '/app/tradefinance/risk', icon: Shield },
      ]},
      { label: 'PARTNERS', items: [
        { name: 'Capital Partners', href: '/app/tradefinance/partners', icon: Landmark },
        { name: 'Funding Calendar', href: '/app/tradefinance/calendar', icon: Calendar },
        { name: 'Finance Reports', href: '/app/tradefinance/reports', icon: BarChart3 },
      ]},
    ],
  },
  finance: {
    title: 'CFO / Finance',
    titleAr: 'المدير المالي',
    category: 'Finance',
    email: 'finance@demo.masar.local',
    color: '#059669',
    redirect: '/app/cfo',
    sidebar: [
      { label: 'FINANCIAL', items: [
        { name: 'Finance Overview', href: '/app/cfo', icon: BarChart3 },
        { name: 'Revenue', href: '/app/cfo/revenue', icon: TrendingUp },
        { name: 'GMV', href: '/app/cfo/gmv', icon: DollarSign },
        { name: 'Invoices', href: '/app/cfo/invoices', icon: FileText },
      ]},
      { label: 'OPERATIONS', items: [
        { name: 'Settlement', href: '/app/cfo/settlement', icon: Landmark },
        { name: 'Reconciliation', href: '/app/cfo/reconciliation', icon: CheckCircle },
        { name: 'Fees', href: '/app/cfo/fees', icon: Percent },
        { name: 'Partner Payments', href: '/app/cfo/payments', icon: Users },
      ]},
      { label: 'CONTROLS', items: [
        { name: 'Cash Position', href: '/app/cfo/cash', icon: Banknote },
        { name: 'Forecast', href: '/app/cfo/forecast', icon: TrendingUp },
        { name: 'Financial Controls', href: '/app/cfo/controls', icon: Shield },
      ]},
    ],
  },
  buyer: {
    title: 'Saudi Anchor Buyer',
    titleAr: 'المشتري السعودي',
    category: 'External',
    email: 'buyer@demo.masar.local',
    color: '#DC2626',
    redirect: '/buyer',
    sidebar: [
      { label: 'TRADE DESK', items: [
        { name: 'Overview', href: '/buyer', icon: LayoutDashboard },
        { name: 'RFQs', href: '/buyer/rfqs', icon: MessageSquare },
        { name: 'Transactions', href: '/buyer/transactions', icon: FileText },
        { name: 'Suppliers', href: '/buyer/suppliers', icon: Truck },
      ]},
      { label: 'TRACKING', items: [
        { name: 'Inspections', href: '/buyer/inspections', icon: Search },
        { name: 'Shipments', href: '/buyer/shipments', icon: Ship },
        { name: 'Documents', href: '/buyer/documents', icon: FolderOpen },
      ]},
      { label: 'FINANCIAL', items: [
        { name: 'Invoices', href: '/buyer/invoices', icon: Receipt },
        { name: 'Payments', href: '/buyer/payments', icon: DollarSign },
        { name: 'Disputes', href: '/buyer/disputes', icon: Scale },
      ]},
    ],
  },
  exporter: {
    title: 'Nigerian Exporter',
    titleAr: 'المصدر النيجيري',
    category: 'External',
    email: 'exporter@demo.masar.local',
    color: '#16A34A',
    redirect: '/exporter',
    sidebar: [
      { label: 'EXPORT', items: [
        { name: 'Dashboard', href: '/exporter', icon: LayoutDashboard },
        { name: 'Opportunities', href: '/exporter/opportunities', icon: Target },
        { name: 'Orders', href: '/exporter/orders', icon: FileText },
        { name: 'RFQs', href: '/exporter/rfqs', icon: MessageSquare },
      ]},
      { label: 'OPERATIONS', items: [
        { name: 'Compliance', href: '/exporter/compliance', icon: Shield },
        { name: 'Documents', href: '/exporter/documents', icon: FolderOpen },
        { name: 'Inspections', href: '/exporter/inspections', icon: Search },
      ]},
      { label: 'FINANCIAL', items: [
        { name: 'Financing', href: '/exporter/financing', icon: DollarSign },
        { name: 'Shipments', href: '/exporter/shipments', icon: Ship },
        { name: 'Payments', href: '/exporter/payments', icon: Banknote },
      ]},
    ],
  },
  capital: {
    title: 'Capital Partner',
    titleAr: 'شريك رأس المال',
    category: 'External',
    email: 'capital@demo.masar.local',
    color: '#7C3AED',
    redirect: '/capital',
    sidebar: [
      { label: 'PORTFOLIO', items: [
        { name: 'Portfolio Overview', href: '/capital', icon: PieChart },
        { name: 'Funding Requests', href: '/capital/requests', icon: FileText },
        { name: 'Exposure', href: '/capital/exposure', icon: TrendingUp },
      ]},
      { label: 'MANAGEMENT', items: [
        { name: 'Facilities', href: '/capital/facilities', icon: Building2 },
        { name: 'Repayments', href: '/capital/repayments', icon: DollarSign },
        { name: 'Risk', href: '/capital/risk', icon: Shield },
      ]},
      { label: 'REPORTING', items: [
        { name: 'Transactions', href: '/capital/transactions', icon: Activity },
        { name: 'Reports', href: '/capital/reports', icon: BarChart3 },
      ]},
    ],
  },
  inspector: {
    title: 'Inspection Partner',
    titleAr: 'شريك الفحص',
    category: 'External',
    email: 'inspector@demo.masar.local',
    color: '#0891B2',
    redirect: '/inspector',
    sidebar: [
      { label: 'INSPECTIONS', items: [
        { name: 'Workbench', href: '/inspector', icon: Search },
        { name: 'Assignments', href: '/inspector/assignments', icon: FileText },
        { name: 'Schedule', href: '/inspector/schedule', icon: Calendar },
      ]},
      { label: 'RESULTS', items: [
        { name: 'Samples', href: '/inspector/samples', icon: Beaker },
        { name: 'Reports', href: '/inspector/reports', icon: FileText },
        { name: 'Exceptions', href: '/inspector/exceptions', icon: AlertTriangle },
      ]},
    ],
  },
  auditor: {
    title: 'Audit / Regulatory',
    titleAr: 'التدقيق / التنظيم',
    category: 'Governance',
    email: 'auditor@demo.masar.local',
    color: '#6B7280',
    redirect: '/audit-portal',
    sidebar: [
      { label: 'EVIDENCE', items: [
        { name: 'Audit Overview', href: '/audit-portal', icon: Scale },
        { name: 'Transactions', href: '/audit-portal/transactions', icon: FileText },
        { name: 'Document Chain', href: '/audit-portal/documents', icon: FolderOpen },
      ]},
      { label: 'LEDGER', items: [
        { name: 'Release Ledger', href: '/audit-portal/releases', icon: Lock },
        { name: 'Screening Logs', href: '/audit-portal/screening', icon: Shield },
        { name: 'Access Logs', href: '/audit-portal/access', icon: Eye },
      ]},
    ],
  },
  admin: {
    title: 'System Administrator',
    titleAr: 'مدير النظام',
    category: 'Administration',
    email: 'admin@demo.masar.local',
    color: '#4B5563',
    redirect: '/dashboard',
    sidebar: [
      { label: 'ADMIN', items: [
        { name: 'System Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/dashboard/users', icon: Users },
        { name: 'Roles', href: '/dashboard/roles', icon: Shield },
        { name: 'Permissions', href: '/dashboard/permissions', icon: KeyRound },
      ]},
      { label: 'CONFIGURATION', items: [
        { name: 'Organizations', href: '/dashboard/organizations', icon: Building2 },
        { name: 'Integrations', href: '/dashboard/integrations', icon: Network },
        { name: 'Feature Flags', href: '/dashboard/features', icon: Flag },
        { name: 'System Settings', href: '/dashboard/settings', icon: Settings },
      ]},
      { label: 'MONITORING', items: [
        { name: 'Audit Logs', href: '/dashboard/audit', icon: History },
        { name: 'Security', href: '/dashboard/security', icon: Shield },
        { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
      ]},
    ],
  },
};

interface RoleSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function RoleSidebar({ collapsed, onToggle }: RoleSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('masar-role');
    if (storedRole && roleConfigs[storedRole]) {
      setRole(storedRole);
      setConfig(roleConfigs[storedRole]);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('masar-role');
    localStorage.removeItem('masar-user');
    router.push('/auth');
  };

  if (!config) return null;

  return (
    <aside style={{
      width: collapsed ? '72px' : '260px',
      background: 'rgba(11, 31, 58, 0.95)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(201, 162, 74, 0.1)',
      position: 'fixed',
      top: 0,
      bottom: 0,
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '16px 12px' : '16px 20px', borderBottom: '1px solid rgba(201,162,74,0.1)', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '64px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
        </div>
        {!collapsed && (
          <div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'white', letterSpacing: '0.06em' }}>MASAR</span>
            <span style={{ display: 'block', fontSize: '8px', color: 'rgba(201,162,74,0.6)', letterSpacing: '0.12em' }}>{config.title.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(201,162,74,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: `${config.color}15`, borderRadius: '8px', border: `1px solid ${config.color}30` }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `${config.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: config.color }}>{config.title[0]}</span>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'white', margin: 0 }}>{config.title}</p>
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{config.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {config.sidebar.map((section: any, sIdx: number) => (
          <div key={sIdx} style={{ marginBottom: '4px' }}>
            {!collapsed && (
              <div style={{ padding: '12px 20px 4px', fontSize: '10px', fontWeight: 700, color: 'rgba(201,162,74,0.4)', letterSpacing: '0.1em' }}>
                {section.label}
              </div>
            )}
            {section.items.map((item: any) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== config.redirect && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: collapsed ? '10px 0' : '9px 20px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    background: isActive ? 'rgba(201,162,74,0.1)' : 'transparent',
                    borderRight: isActive ? '2px solid #C9A24A' : '2px solid transparent',
                  }}
                >
                  <Icon size={18} color={isActive ? '#C9A24A' : 'rgba(255,255,255,0.4)'} />
                  {!collapsed && (
                    <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400, color: isActive ? '#C9A24A' : 'rgba(255,255,255,0.5)' }}>
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute', top: '20px', right: '-12px', width: '24px', height: '24px', borderRadius: '50%',
          background: '#0B1F3A', border: '1px solid rgba(201,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10, color: '#C9A24A',
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* User & Logout */}
      <div style={{ padding: collapsed ? '12px 8px' : '12px 16px', borderTop: '1px solid rgba(201,162,74,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${config.color}, ${config.color}CC)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{config.title.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}</span>
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{config.title}</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{config.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: collapsed ? 'center' : 'flex-start',
            padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <LogOut size={16} color="#EF4444" />
          {!collapsed && <span style={{ fontSize: '12px', fontWeight: 500, color: '#EF4444' }}>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
