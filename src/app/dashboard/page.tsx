'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Shield, KeyRound, Building2, Network, Flag, Settings,
  History, Bell, CheckCircle, Clock, AlertTriangle, Eye, Plus, Filter, RefreshCw,
  Download, ChevronRight, ArrowUpRight, Package, MapPin, Calendar, Star,
  TrendingUp, BarChart3, Banknote, Anchor, Globe, Languages, ChevronDown,
  LogOut, Loader2, X, Truck, Activity, Target, ArrowRight, Send, Scale,
  Lock, Unlock, Database, Server, Cpu, GitBranch, FileText, FolderOpen,
  Search, DollarSign, Ship, PieChart, Percent, UserPlus, Edit, Trash2,
  Copy, ExternalLink, Info, HelpCircle, ShieldCheck, BadgeCheck, Receipt,
  ClipboardCheck, Beaker, Landmark, Award, Compass, Navigation, Wheat,
  Thermometer, Droplets, Wind, Zap, Camera, Upload, MessageSquare, Phone,
  ArrowDownRight, Minus
} from 'lucide-react';
import { 
  mockTransactions, mockBuyers, mockExporters, mockTasks, mockNotifications,
  formatCurrency, getStatusColor, getRiskColor, calculateDashboardStats,
  Transaction, Task
} from '@/lib/store';
import { colors, glass, typography, getBadgeStyle } from '@/lib/design';
import RoleSidebar from '@/components/dashboard/RoleSidebar';

// Admin-specific types
interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin: string;
  mfaEnabled: boolean;
  createdAt: string;
}

interface SystemRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

interface Integration {
  id: string;
  name: string;
  type: 'kyc' | 'sanctions' | 'inspection' | 'finance' | 'logistics' | 'payment';
  provider: string;
  status: 'operational' | 'degraded' | 'offline' | 'pending';
  lastSync: string;
  uptime: number;
  apiCalls: number;
}

interface SystemMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

// Mock admin data
const mockUsers: SystemUser[] = [
  { id: 'user-001', name: 'Mujaheed Baita', email: 'mujaheed@masar.sa', role: 'Administrator', organization: 'MASAR', status: 'active', lastLogin: '2026-08-25 14:30', mfaEnabled: true, createdAt: '2026-05-01' },
  { id: 'user-002', name: 'Ahmed Hassan', email: 'ahmed@masar.sa', role: 'Compliance Officer', organization: 'MASAR', status: 'active', lastLogin: '2026-08-25 13:15', mfaEnabled: true, createdAt: '2026-05-15' },
  { id: 'user-003', name: 'Fatima Bello', email: 'fatima@masar.sa', role: 'Operations Manager', organization: 'MASAR', status: 'active', lastLogin: '2026-08-25 11:45', mfaEnabled: true, createdAt: '2026-06-01' },
  { id: 'user-004', name: 'Ibrahim Musa', email: 'ibrahim@masar.sa', role: 'Origin Manager', organization: 'MASAR', status: 'active', lastLogin: '2026-08-24 16:00', mfaEnabled: false, createdAt: '2026-06-15' },
  { id: 'user-005', name: 'Oluwaseun Adeyemi', email: 'oluwaseun@masar.sa', role: 'Finance Manager', organization: 'MASAR', status: 'active', lastLogin: '2026-08-24 10:30', mfaEnabled: true, createdAt: '2026-07-01' },
  { id: 'user-006', name: 'Mohammed Al Rajhi', email: 'mohammed@alrajhifoods.sa', role: 'Buyer Admin', organization: 'Al Rajhi Foods', status: 'active', lastLogin: '2026-08-23 09:00', mfaEnabled: true, createdAt: '2026-06-01' },
  { id: 'user-007', name: 'Aliko Dangote Jr.', email: 'aliko@dangotesesame.ng', role: 'Exporter Admin', organization: 'Dangote Sesame', status: 'active', lastLogin: '2026-08-22 14:00', mfaEnabled: false, createdAt: '2026-05-15' },
  { id: 'user-008', name: 'Adebayo Ogundimu', email: 'adebayo@sgs.ng', role: 'Inspector', organization: 'SGS Nigeria', status: 'active', lastLogin: '2026-08-25 08:00', mfaEnabled: false, createdAt: '2026-07-01' },
];

const mockRoles: SystemRole[] = [
  { id: 'role-001', name: 'Administrator', description: 'Full system access with technical administration', permissions: ['users.manage', 'roles.manage', 'settings.manage', 'audit.view', 'system.manage'], userCount: 1, isSystem: true },
  { id: 'role-002', name: 'Executive', description: 'Strategic overview and corridor performance', permissions: ['dashboard.executive', 'transactions.view', 'reports.view', 'network.view'], userCount: 1, isSystem: true },
  { id: 'role-003', name: 'Operations', description: 'Transaction management and workflow coordination', permissions: ['transactions.manage', 'rfqs.manage', 'contracts.manage', 'shipments.manage', 'exceptions.manage'], userCount: 2, isSystem: true },
  { id: 'role-004', name: 'Compliance', description: 'KYB, sanctions, and documentation management', permissions: ['kyb.manage', 'documents.manage', 'compliance.manage', 'sanctions.view'], userCount: 1, isSystem: true },
  { id: 'role-005', name: 'Finance', description: 'Financial workflows and reconciliation', permissions: ['finance.manage', 'settlement.manage', 'invoices.manage', 'reconciliation.manage'], userCount: 1, isSystem: true },
  { id: 'role-006', name: 'Buyer', description: 'Buyer portal access for Saudi buyers', permissions: ['rfqs.create', 'transactions.view', 'documents.view', 'invoices.view'], userCount: 1, isSystem: false },
  { id: 'role-007', name: 'Exporter', description: 'Exporter portal access for Nigerian exporters', permissions: ['opportunities.view', 'orders.view', 'compliance.view', 'financing.view'], userCount: 1, isSystem: false },
  { id: 'role-008', name: 'Inspector', description: 'Inspection partner access', permissions: ['inspections.manage', 'reports.create', 'samples.manage'], userCount: 1, isSystem: false },
  { id: 'role-009', name: 'Auditor', description: 'Read-only audit and regulatory access', permissions: ['audit.view', 'documents.view', 'transactions.view'], userCount: 0, isSystem: true },
];

const mockIntegrations: Integration[] = [
  { id: 'int-001', name: 'KYB Provider', type: 'kyc', provider: 'World-Check', status: 'operational', lastSync: '2026-08-25 14:00', uptime: 99.97, apiCalls: 1247 },
  { id: 'int-002', name: 'Sanctions Screening', type: 'sanctions', provider: 'World-Check', status: 'operational', lastSync: '2026-08-25 14:00', uptime: 99.99, apiCalls: 892 },
  { id: 'int-003', name: 'Inspection Partner', type: 'inspection', provider: 'SGS Nigeria', status: 'operational', lastSync: '2026-08-25 12:00', uptime: 99.5, apiCalls: 156 },
  { id: 'int-004', name: 'Laboratory', type: 'inspection', provider: 'SGS Lagos Lab', status: 'operational', lastSync: '2026-08-25 10:00', uptime: 99.8, apiCalls: 89 },
  { id: 'int-005', name: 'E-Invoicing', type: 'payment', provider: 'ZATCA', status: 'degraded', lastSync: '2026-08-25 08:00', uptime: 95.2, apiCalls: 234 },
  { id: 'int-006', name: 'Financial Partner', type: 'finance', provider: 'Afreximbank', status: 'operational', lastSync: '2026-08-25 13:00', uptime: 99.9, apiCalls: 567 },
  { id: 'int-007', name: 'Logistics Provider', type: 'logistics', provider: 'MSC Shipping', status: 'operational', lastSync: '2026-08-25 11:00', uptime: 99.7, apiCalls: 345 },
];

const systemMetrics: SystemMetric[] = [
  { label: 'API Uptime', value: '99.97%', change: '0.01%', trend: 'up', status: 'excellent' },
  { label: 'Response Time', value: '142ms', change: '-8ms', trend: 'up', status: 'good' },
  { label: 'Active Users', value: '8', change: '+2 this month', trend: 'up', status: 'good' },
  { label: 'Failed Logins', value: '3', change: '-2 vs yesterday', trend: 'up', status: 'good' },
  { label: 'Queue Health', value: 'Healthy', change: '0 pending', trend: 'neutral', status: 'excellent' },
  { label: 'Storage Used', value: '2.4 GB', change: '12% of limit', trend: 'neutral', status: 'good' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'roles' | 'permissions' | 'organizations' | 'integrations' | 'features' | 'audit' | 'security' | 'notifications' | 'settings'>('overview');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);

  const activeUsers = mockUsers.filter(u => u.status === 'active');
  const mfaEnabled = mockUsers.filter(u => mfaEnabled).length;
  const unreadNotifs = mockNotifications.filter(n => !n.read);

  useEffect(() => {
    const role = localStorage.getItem('masar-role');
    if (!role) { router.push('/auth'); return; }
    setTimeout(() => setLoading(false), 800);
  }, [router]);

  const filteredUsers = filterStatus === 'all' ? mockUsers :
    mockUsers.filter(u => u.status === filterStatus);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.navy }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ animation: 'spin 2s linear infinite' }}>
              <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(201,162,74,0.15)" strokeWidth="2" />
              <circle cx="40" cy="40" r="35" fill="none" stroke={colors.gold} strokeWidth="2" strokeDasharray="180 220" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke={colors.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill={colors.gold} /></svg>
            </div>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.gold, letterSpacing: '0.1em' }}>MASAR ADMIN</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Loading system administration...</p>
        </div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      <RoleSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div style={{ flex: 1, marginLeft: collapsed ? '72px' : '260px', transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header style={{ ...glass.card, borderRadius: 0, borderBottom: `1px solid ${colors.border}`, padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
              <input type="text" placeholder="Search users, roles, settings..." style={{ ...glass.input, width: '100%', padding: '8px 12px 8px 36px', fontSize: '13px', color: colors.text, outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: colors.greenLight, borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: colors.green, borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: colors.green }}>SYSTEM OK</span>
            </div>
            <div style={{ padding: '4px 8px', background: 'rgba(75,85,99,0.08)', borderRadius: '4px', border: '1px solid rgba(75,85,99,0.15)' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#4B5563', letterSpacing: '0.05em' }}>ADMIN</span>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={{ position: 'relative', padding: '6px', ...glass.btnOutline, borderRadius: '8px' }}>
                <Bell size={18} color={colors.textSec} />
                {unreadNotifs.length > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: colors.red, borderRadius: '50%', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadNotifs.length}</span>}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, #4B5563, #6B7280)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>MB</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>Mujaheed Baita</p>
                <p style={{ fontSize: '10px', color: colors.textSec, margin: 0 }}>Administrator</p>
              </div>
              <ChevronDown size={14} color={colors.textSec} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Settings size={18} color="#4B5563" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#4B5563', letterSpacing: '0.08em' }}>SYSTEM ADMINISTRATION</span>
              </div>
              <h1 style={{ ...typography.h1, marginBottom: '2px' }}>Platform Administration</h1>
              <p style={{ ...typography.small }}>System configuration, user management, and security controls</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...glass.btnOutline, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={13} /> Refresh</button>
              <button style={{ ...glass.btnPrimary, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={13} /> System Report</button>
            </div>
          </div>

          {/* View Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', background: '#E5E7EB', borderRadius: '10px', width: 'fit-content', overflowX: 'auto' }}>
            {([
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'roles', label: 'Roles', icon: Shield },
              { id: 'permissions', label: 'Permissions', icon: KeyRound },
              { id: 'organizations', label: 'Organizations', icon: Building2 },
              { id: 'integrations', label: 'Integrations', icon: Network },
              { id: 'features', label: 'Feature Flags', icon: Flag },
              { id: 'audit', label: 'Audit Logs', icon: History },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'settings', label: 'Settings', icon: Settings },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveView(tab.id as any)} style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', transition: 'all 0.2s', ...(activeView === tab.id ? { background: 'white', color: colors.text, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { background: 'transparent', color: colors.textSec }) }}>
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW VIEW */}
          {activeView === 'overview' && (
            <>
              {/* System Health */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {systemMetrics.map((metric, idx) => (
                  <div key={idx} style={{ ...glass.card, padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ ...typography.label }}>{metric.label}</span>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: metric.status === 'excellent' ? colors.green : metric.status === 'good' ? colors.blue : colors.amber, padding: '2px 6px', background: metric.status === 'excellent' ? colors.greenLight : metric.status === 'good' ? colors.blueLight : colors.amberLight, borderRadius: '4px' }}>{metric.status}</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: colors.text }}>{metric.value}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                      {metric.trend === 'up' ? <ArrowUpRight size={10} color={colors.green} /> : metric.trend === 'down' ? <ArrowDownRight size={10} color={colors.red} /> : <Minus size={10} color={colors.textMuted} />}
                      <span style={{ fontSize: '10px', color: metric.trend === 'up' ? colors.green : metric.trend === 'down' ? colors.red : colors.textMuted }}>{metric.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Users + Integrations */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {/* Recent Users */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Recent Users</h3>
                    <button onClick={() => setActiveView('users')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {mockUsers.slice(0, 5).map(user => (
                      <div key={user.id} onClick={() => { setSelectedUser(user.id); setActiveView('users'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{user.name.split(' ').map(w => w[0]).join('')}</span>
                          </div>
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{user.name}</p>
                            <p style={{ fontSize: '10px', color: colors.textMuted, margin: 0 }}>{user.role} · {user.organization}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {user.mfaEnabled && <KeyRound size={12} color={colors.green} />}
                          <span style={getBadgeStyle(user.status === 'active' ? 'success' : 'warning')}>{user.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integration Status */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Integration Status</h3>
                    <button onClick={() => setActiveView('integrations')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>Manage →</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {mockIntegrations.map(int => (
                      <div key={int.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: int.status === 'operational' ? colors.green : int.status === 'degraded' ? colors.amber : colors.red }} />
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{int.name}</p>
                            <p style={{ fontSize: '10px', color: colors.textMuted, margin: 0 }}>{int.provider}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={getBadgeStyle(int.status === 'operational' ? 'success' : int.status === 'degraded' ? 'warning' : 'danger')}>{int.status}</span>
                          <p style={{ fontSize: '10px', color: colors.textMuted, margin: '2px 0 0' }}>{int.uptime}% uptime</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Roles Overview */}
              <div style={{ ...glass.card, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ ...typography.h3 }}>Role Configuration</h3>
                  <button onClick={() => setActiveView('roles')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>Manage Roles →</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px', padding: '16px' }}>
                  {mockRoles.slice(0, 6).map(role => (
                    <div key={role.id} style={{ padding: '14px', background: '#F9FAFB', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 700, color: colors.text, margin: 0 }}>{role.name}</h4>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textMuted, padding: '2px 6px', background: '#E5E7EB', borderRadius: '4px' }}>{role.userCount} users</span>
                      </div>
                      <p style={{ fontSize: '11px', color: colors.textSec, margin: '0 0 8px' }}>{role.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {role.permissions.slice(0, 3).map((perm, idx) => (
                          <span key={idx} style={{ fontSize: '9px', padding: '2px 6px', background: '#E5E7EB', borderRadius: '4px', color: colors.textMuted }}>{perm}</span>
                        ))}
                        {role.permissions.length > 3 && <span style={{ fontSize: '9px', padding: '2px 6px', background: '#E5E7EB', borderRadius: '4px', color: colors.textMuted }}>+{role.permissions.length - 3}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* USERS VIEW */}
          {activeView === 'users' && (
            <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 380px' : '1fr', gap: '16px' }}>
              <div style={{ ...glass.card, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ ...typography.h3 }}>User Management</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['all', 'active', 'inactive', 'pending'].map(f => (
                        <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(filterStatus === f ? { background: colors.navy, color: 'white' } : { background: '#F3F4F6', color: colors.textSec }) }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                      ))}
                    </div>
                    <button onClick={() => setShowAddUser(true)} style={{ ...glass.btnPrimary, padding: '6px 14px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}><UserPlus size={12} /> Add User</button>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#F9FAFB' }}>
                    {['User', 'Email', 'Role', 'Organization', 'Status', 'MFA', 'Last Login', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} onClick={() => setSelectedUser(user.id)} style={{ cursor: 'pointer', background: selectedUser === user.id ? '#F9FAFB' : 'white', borderBottom: `1px solid ${colors.border}` }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontSize: '10px', fontWeight: 600 }}>{user.name.split(' ').map(w => w[0]).join('')}</span>
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{user.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{user.email}</td>
                        <td style={{ padding: '12px' }}><span style={getBadgeStyle('info')}>{user.role}</span></td>
                        <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{user.organization}</td>
                        <td style={{ padding: '12px' }}><span style={getBadgeStyle(user.status === 'active' ? 'success' : 'warning')}>{user.status}</span></td>
                        <td style={{ padding: '12px' }}>{user.mfaEnabled ? <KeyRound size={14} color={colors.green} /> : <span style={{ fontSize: '10px', color: colors.textMuted }}>Off</span>}</td>
                        <td style={{ padding: '12px', fontSize: '11px', color: colors.textSec }}>{user.lastLogin}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Edit size={10} color={colors.textSec} /></button>
                            <button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Eye size={10} color={colors.textSec} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* User Detail */}
              {selectedUser && (() => {
                const user = mockUsers.find(u => u.id === selectedUser);
                if (!user) return null;
                return (
                  <div style={{ ...glass.card, padding: '20px', position: 'sticky', top: '80px' }}>
                    <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: `1px solid ${colors.border}`, marginBottom: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 700 }}>{user.name.split(' ').map(w => w[0]).join('')}</span>
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, margin: 0 }}>{user.name}</h3>
                      <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0' }}>{user.email}</p>
                      <span style={getBadgeStyle(user.status === 'active' ? 'success' : 'warning')}>{user.status}</span>
                    </div>
                    {[
                      { l: 'Role', v: user.role },
                      { l: 'Organization', v: user.organization },
                      { l: 'MFA Enabled', v: user.mfaEnabled ? 'Yes' : 'No' },
                      { l: 'Last Login', v: user.lastLogin },
                      { l: 'Created', v: user.createdAt },
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                        <span style={{ fontSize: '12px', color: colors.textSec }}>{item.l}</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{item.v}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <button style={{ ...glass.btnPrimary, flex: 1, padding: '8px', fontSize: '12px' }}>Edit User</button>
                      <button style={{ ...glass.btnOutline, padding: '8px 12px', fontSize: '12px' }}><KeyRound size={14} /></button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ROLES VIEW */}
          {activeView === 'roles' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
              {mockRoles.map(role => (
                <div key={role.id} style={{ ...glass.card, padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: 0 }}>{role.name}</h3>
                      <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>{role.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textMuted, padding: '2px 6px', background: '#E5E7EB', borderRadius: '4px' }}>{role.userCount} users</span>
                      {role.isSystem && <span style={{ fontSize: '10px', fontWeight: 600, color: colors.blue, padding: '2px 6px', background: colors.blueLight, borderRadius: '4px' }}>System</span>}
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textMuted, letterSpacing: '0.05em' }}>PERMISSIONS</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                      {role.permissions.map((perm, idx) => (
                        <span key={idx} style={{ fontSize: '10px', padding: '3px 8px', background: '#F3F4F6', borderRadius: '4px', color: colors.textSec }}>{perm}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ ...glass.btnOutline, flex: 1, padding: '8px', fontSize: '12px' }}>Edit Role</button>
                    {!role.isSystem && <button style={{ padding: '8px', ...glass.btnOutline, borderRadius: '8px' }}><Trash2 size={14} color={colors.red} /></button>}
                  </div>
                </div>
              ))}
              <button onClick={() => setShowAddRole(true)} style={{ ...glass.card, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', border: '2px dashed #E5E7EB' }}>
                <Plus size={24} color={colors.textMuted} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.textMuted }}>Add New Role</span>
              </button>
            </div>
          )}

          {/* INTEGRATIONS VIEW */}
          {activeView === 'integrations' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
              {mockIntegrations.map(int => (
                <div key={int.id} style={{ ...glass.card, padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: int.status === 'operational' ? colors.greenLight : int.status === 'degraded' ? colors.amberLight : colors.redLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Network size={20} color={int.status === 'operational' ? colors.green : int.status === 'degraded' ? colors.amber : colors.red} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: 0 }}>{int.name}</h3>
                        <p style={{ fontSize: '11px', color: colors.textSec, margin: 0 }}>{int.provider}</p>
                      </div>
                    </div>
                    <span style={getBadgeStyle(int.status === 'operational' ? 'success' : int.status === 'degraded' ? 'warning' : 'danger')}>{int.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', color: colors.textMuted }}>Uptime</span>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: 0 }}>{int.uptime}%</p>
                    </div>
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', color: colors.textMuted }}>API Calls</span>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: 0 }}>{int.apiCalls}</p>
                    </div>
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', color: colors.textMuted }}>Last Sync</span>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: colors.text, margin: 0 }}>{int.lastSync.split(' ')[1]}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ ...glass.btnOutline, flex: 1, padding: '8px', fontSize: '12px' }}>Configure</button>
                    <button style={{ ...glass.btnOutline, padding: '8px', fontSize: '12px' }}><RefreshCw size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other Views */}
          {!['overview', 'users', 'roles', 'integrations'].includes(activeView) && (
            <div style={{ ...glass.card, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#4B556310', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {activeView === 'permissions' && <KeyRound size={28} color="#4B5563" />}
                {activeView === 'organizations' && <Building2 size={28} color="#4B5563" />}
                {activeView === 'features' && <Flag size={28} color="#4B5563" />}
                {activeView === 'audit' && <History size={28} color="#4B5563" />}
                {activeView === 'security' && <Shield size={28} color="#4B5563" />}
                {activeView === 'notifications' && <Bell size={28} color="#4B5563" />}
                {activeView === 'settings' && <Settings size={28} color="#4B5563" />}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>
                {activeView === 'permissions' && 'Permission Management'}
                {activeView === 'organizations' && 'Organization Management'}
                {activeView === 'features' && 'Feature Flags'}
                {activeView === 'audit' && 'Audit Logs'}
                {activeView === 'security' && 'Security Center'}
                {activeView === 'notifications' && 'Notification Settings'}
                {activeView === 'settings' && 'System Settings'}
              </h2>
              <p style={{ fontSize: '14px', color: colors.textSec, maxWidth: '500px', margin: '0 auto 24px' }}>
                {activeView === 'permissions' && 'Manage granular permissions for all roles.'}
                {activeView === 'organizations' && 'Manage buyer, exporter, and partner organizations.'}
                {activeView === 'features' && 'Toggle feature flags for the platform.'}
                {activeView === 'audit' && 'View complete system audit logs.'}
                {activeView === 'security' && 'Security configuration and monitoring.'}
                {activeView === 'notifications' && 'Configure notification channels and templates.'}
                {activeView === 'settings' && 'Global system configuration.'}
              </p>
              <button onClick={() => setActiveView('overview')} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Back to Overview</button>
            </div>
          )}
        </main>

        {/* Status Bar */}
        <footer style={{ background: 'white', borderTop: `1px solid ${colors.border}`, padding: '8px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: colors.gold, letterSpacing: '0.05em' }}>MASAR V0</span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>System Administration · Technical Management</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Users: <span style={{ color: colors.green, fontWeight: 600 }}>{activeUsers.length}</span></span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Integrations: <span style={{ color: colors.green, fontWeight: 600 }}>{mockIntegrations.filter(i => i.status === 'operational').length}/{mockIntegrations.length}</span></span>
          </div>
        </footer>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>Add New User</h2>
              <button onClick={() => setShowAddUser(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={colors.textSec} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Full Name</label>
                  <input type="text" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} placeholder="Full name" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Email</label>
                  <input type="email" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} placeholder="email@company.com" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Role</label>
                  <select style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }}>
                    {mockRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Organization</label>
                  <input type="text" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} placeholder="Organization" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setShowAddUser(false)} style={{ ...glass.btnOutline, padding: '10px 20px', fontSize: '13px' }}>Cancel</button>
                <button onClick={() => { setShowAddUser(false); setActiveView('users'); }} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Create User</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
