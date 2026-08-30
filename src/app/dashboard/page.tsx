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
  ArrowDownRight, Minus, Menu
} from 'lucide-react';
import { 
  mockTransactions, mockBuyers, mockExporters, mockTasks, mockNotifications,
  formatCurrency, getStatusColor, getRiskColor, calculateDashboardStats
} from '@/lib/store';
import { colors, glass, typography, getBadgeStyle } from '@/lib/design';

// Admin sidebar config
const adminSidebar = [
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
];

const iconMap: Record<string, any> = {
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
  ArrowDownRight, Minus, Menu
};

// Mock data
const mockUsers = [
  { id: 'u1', name: 'Lukman Kura', email: 'lukman@masar.sa', role: 'Administrator', org: 'MASAR', status: 'active', lastLogin: '2026-08-25 14:30', mfa: true },
  { id: 'u2', name: 'Ahmed Hassan', email: 'ahmed@masar.sa', role: 'Compliance Officer', org: 'MASAR', status: 'active', lastLogin: '2026-08-25 13:15', mfa: true },
  { id: 'u3', name: 'Fatima Bello', email: 'fatima@masar.sa', role: 'Operations Manager', org: 'MASAR', status: 'active', lastLogin: '2026-08-25 11:45', mfa: true },
  { id: 'u4', name: 'Ibrahim Musa', email: 'ibrahim@masar.sa', role: 'Origin Manager', org: 'MASAR', status: 'active', lastLogin: '2026-08-24 16:00', mfa: false },
  { id: 'u5', name: 'Oluwaseun Adeyemi', email: 'oluwaseun@masar.sa', role: 'Finance Manager', org: 'MASAR', status: 'active', lastLogin: '2026-08-24 10:30', mfa: true },
];

const mockRoles = [
  { id: 'r1', name: 'Administrator', desc: 'Full system access', perms: ['users.manage', 'roles.manage', 'settings.manage'], count: 1, system: true },
  { id: 'r2', name: 'Executive', desc: 'Strategic overview', perms: ['dashboard.executive', 'transactions.view', 'reports.view'], count: 1, system: true },
  { id: 'r3', name: 'Operations', desc: 'Transaction management', perms: ['transactions.manage', 'rfqs.manage', 'contracts.manage'], count: 2, system: true },
  { id: 'r4', name: 'Compliance', desc: 'KYB and documentation', perms: ['kyb.manage', 'documents.manage', 'compliance.manage'], count: 1, system: true },
  { id: 'r5', name: 'Finance', desc: 'Financial workflows', perms: ['finance.manage', 'settlement.manage', 'invoices.manage'], count: 1, system: true },
  { id: 'r6', name: 'Buyer', desc: 'Buyer portal access', perms: ['rfqs.create', 'transactions.view', 'documents.view'], count: 1, system: false },
  { id: 'r7', name: 'Exporter', desc: 'Exporter portal access', perms: ['opportunities.view', 'orders.view', 'compliance.view'], count: 1, system: false },
  { id: 'r8', name: 'Inspector', desc: 'Inspection partner', perms: ['inspections.manage', 'reports.create', 'samples.manage'], count: 1, system: false },
  { id: 'r9', name: 'Auditor', desc: 'Read-only audit access', perms: ['audit.view', 'documents.view', 'transactions.view'], count: 0, system: true },
];

const mockIntegrations = [
  { id: 'i1', name: 'KYB Provider', provider: 'World-Check', status: 'operational', uptime: 99.97, calls: 1247 },
  { id: 'i2', name: 'Sanctions Screening', provider: 'World-Check', status: 'operational', uptime: 99.99, calls: 892 },
  { id: 'i3', name: 'Inspection Partner', provider: 'SGS Nigeria', status: 'operational', uptime: 99.5, calls: 156 },
  { id: 'i4', name: 'Laboratory', provider: 'SGS Lagos Lab', status: 'operational', uptime: 99.8, calls: 89 },
  { id: 'i5', name: 'E-Invoicing', provider: 'ZATCA', status: 'degraded', uptime: 95.2, calls: 234 },
  { id: 'i6', name: 'Financial Partner', provider: 'Afreximbank', status: 'operational', uptime: 99.9, calls: 567 },
  { id: 'i7', name: 'Logistics Provider', provider: 'MSC Shipping', status: 'operational', uptime: 99.7, calls: 345 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const unreadNotifs = mockNotifications.filter(n => !n.read);

  useEffect(() => {
    const role = localStorage.getItem('masar-role');
    if (!role) { router.push('/auth'); return; }
    setTimeout(() => setLoading(false), 800);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('masar-role');
    localStorage.removeItem('masar-user');
    router.push('/auth');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1F3A' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ animation: 'spin 2s linear infinite' }}>
              <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(201,162,74,0.15)" strokeWidth="2" />
              <circle cx="40" cy="40" r="35" fill="none" stroke="#C9A24A" strokeWidth="2" strokeDasharray="180 220" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
            </div>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#C9A24A', letterSpacing: '0.1em' }}>MASAR ADMIN</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Loading system administration...</p>
        </div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F6F8FB', fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? '72px' : '260px',
        background: 'rgba(11, 31, 58, 0.95)',
        backdropFilter: 'blur(24px)',
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
              <span style={{ display: 'block', fontSize: '8px', color: 'rgba(201,162,74,0.6)', letterSpacing: '0.12em' }}>SYSTEM ADMIN</span>
            </div>
          )}
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(201,162,74,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'rgba(75,85,99,0.15)', borderRadius: '8px', border: '1px solid rgba(75,85,99,0.3)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(75,85,99,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={12} color="#6B7280" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: 'white', margin: 0 }}>System Administrator</p>
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Administration</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {adminSidebar.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '4px' }}>
              {!collapsed && (
                <div style={{ padding: '12px 20px 4px', fontSize: '10px', fontWeight: 700, color: 'rgba(201,162,74,0.4)', letterSpacing: '0.1em' }}>
                  {section.label}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = iconMap[item.icon] || FileText;
                const isActive = activeView === item.href.split('/').pop();
                return (
                  <button
                    key={item.href}
                    onClick={() => setActiveView(item.href.split('/').pop() || 'overview')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: collapsed ? '10px 0' : '9px 20px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      width: '100%',
                      border: 'none',
                      background: isActive ? 'rgba(201,162,74,0.1)' : 'transparent',
                      borderRight: isActive ? '2px solid #C9A24A' : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={18} color={isActive ? '#C9A24A' : 'rgba(255,255,255,0.4)'} />
                    {!collapsed && (
                      <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400, color: isActive ? '#C9A24A' : 'rgba(255,255,255,0.5)' }}>
                        {item.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User & Logout */}
        <div style={{ padding: collapsed ? '12px 8px' : '12px 16px', borderTop: '1px solid rgba(201,162,74,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #4B5563, #6B7280)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>MB</span>
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'white', margin: 0 }}>Lukman Kura</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Administrator</p>
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

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: collapsed ? '72px' : '260px', transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header style={{ background: 'white', borderBottom: '1px solid #E4E7EC', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#98A2B3' }} />
              <input type="text" placeholder="Search users, roles, settings..." style={{ width: '100%', padding: '8px 12px 8px 36px', background: '#F9FAFB', border: '1px solid #E4E7EC', borderRadius: '8px', fontSize: '13px', color: '#142235', outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#F0FDF4', borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: '#16A34A', borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#16A34A' }}>SYSTEM OK</span>
            </div>
            <button style={{ position: 'relative', padding: '6px', background: 'white', border: '1px solid #E4E7EC', borderRadius: '8px', cursor: 'pointer' }}>
              <Bell size={18} color="#667085" />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: '#EF4444', borderRadius: '50%', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #4B5563, #6B7280)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>MB</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#142235', margin: 0 }}>Lukman Kura</p>
                <p style={{ fontSize: '10px', color: '#667085', margin: 0 }}>Administrator</p>
              </div>
              <ChevronDown size={14} color="#667085" />
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
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#142235', marginBottom: '2px' }}>Platform Administration</h1>
              <p style={{ fontSize: '13px', color: '#667085' }}>System configuration, user management, and security controls</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px 14px', background: 'white', border: '1px solid #E4E7EC', borderRadius: '8px', fontSize: '12px', fontWeight: 500, color: '#667085', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={13} /> Refresh</button>
              <button style={{ padding: '8px 14px', background: 'linear-gradient(135deg, #C9A24A, #E3C875)', color: '#0B1F3A', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={13} /> System Report</button>
            </div>
          </div>

          {/* View Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', background: '#E5E7EB', borderRadius: '10px', width: 'fit-content', overflowX: 'auto' }}>
            {['overview', 'users', 'roles', 'integrations'].map(tab => (
              <button key={tab} onClick={() => setActiveView(tab)} style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', ...(activeView === tab ? { background: 'white', color: '#142235', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { background: 'transparent', color: '#667085' }) }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeView === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'API UPTIME', value: '99.97%', status: 'excellent', color: '#16A34A' },
                  { label: 'RESPONSE TIME', value: '142ms', status: 'good', color: '#3B82F6' },
                  { label: 'ACTIVE USERS', value: '8', status: 'good', color: '#3B82F6' },
                  { label: 'FAILED LOGINS', value: '3', status: 'good', color: '#3B82F6' },
                  { label: 'QUEUE HEALTH', value: 'Healthy', status: 'excellent', color: '#16A34A' },
                  { label: 'STORAGE', value: '2.4 GB', status: 'good', color: '#3B82F6' },
                ].map((m, idx) => (
                  <div key={idx} style={{ background: 'white', borderRadius: '12px', border: '1px solid #E4E7EC', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>{m.label}</span>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: m.color, padding: '2px 6px', background: `${m.color}10`, borderRadius: '4px' }}>{m.status}</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#142235' }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E4E7EC', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #E4E7EC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#142235' }}>Recent Users</h3>
                    <button onClick={() => setActiveView('users')} style={{ fontSize: '11px', color: '#C9A24A', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  {mockUsers.slice(0, 4).map((u, idx) => (
                    <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: idx < 3 ? '1px solid #F3F4F6' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{u.name.split(' ').map(w => w[0]).join('')}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', fontWeight: 600, color: '#142235', margin: 0 }}>{u.name}</p>
                          <p style={{ fontSize: '10px', color: '#98A2B3', margin: 0 }}>{u.role}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#16A34A', padding: '2px 6px', background: '#F0FDF4', borderRadius: '4px' }}>{u.status}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E4E7EC', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #E4E7EC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#142235' }}>Integration Status</h3>
                    <button onClick={() => setActiveView('integrations')} style={{ fontSize: '11px', color: '#C9A24A', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>Manage →</button>
                  </div>
                  {mockIntegrations.slice(0, 5).map((int, idx) => (
                    <div key={int.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 18px', borderBottom: idx < 4 ? '1px solid #F3F4F6' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: int.status === 'operational' ? '#16A34A' : '#F59E0B' }} />
                        <div>
                          <p style={{ fontSize: '12px', fontWeight: 600, color: '#142235', margin: 0 }}>{int.name}</p>
                          <p style={{ fontSize: '10px', color: '#98A2B3', margin: 0 }}>{int.provider}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: int.status === 'operational' ? '#16A34A' : '#F59E0B', padding: '2px 6px', background: int.status === 'operational' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{int.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* USERS */}
          {activeView === 'users' && (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E4E7EC', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #E4E7EC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#142235' }}>User Management</h3>
                <button onClick={() => setShowAddUser(true)} style={{ padding: '6px 14px', background: 'linear-gradient(135deg, #C9A24A, #E3C875)', color: '#0B1F3A', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><UserPlus size={12} /> Add User</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['User', 'Email', 'Role', 'Organization', 'Status', 'MFA', 'Last Login'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', borderBottom: '1px solid #E4E7EC' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #E4E7EC', cursor: 'pointer' }}>
                      <td style={{ padding: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '10px', fontWeight: 600 }}>{u.name.split(' ').map(w => w[0]).join('')}</span></div><span style={{ fontSize: '12px', fontWeight: 600, color: '#142235' }}>{u.name}</span></div></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#667085' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: '#3B82F6', padding: '2px 8px', background: '#EFF6FF', borderRadius: '4px' }}>{u.role}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#142235' }}>{u.org}</td>
                      <td style={{ padding: '12px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: '#16A34A', padding: '2px 8px', background: '#F0FDF4', borderRadius: '4px' }}>{u.status}</span></td>
                      <td style={{ padding: '12px' }}>{u.mfa ? <KeyRound size={14} color="#16A34A" /> : <span style={{ fontSize: '10px', color: '#98A2B3' }}>Off</span>}</td>
                      <td style={{ padding: '12px', fontSize: '11px', color: '#667085' }}>{u.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ROLES */}
          {activeView === 'roles' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {mockRoles.map(role => (
                <div key={role.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #E4E7EC', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#142235', margin: 0 }}>{role.name}</h3>
                      <p style={{ fontSize: '11px', color: '#667085', margin: '2px 0 0' }}>{role.desc}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', padding: '2px 6px', background: '#F3F4F6', borderRadius: '4px' }}>{role.count} users</span>
                      {role.system && <span style={{ fontSize: '10px', fontWeight: 600, color: '#3B82F6', padding: '2px 6px', background: '#EFF6FF', borderRadius: '4px' }}>System</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {role.perms.map((p, i) => (
                      <span key={i} style={{ fontSize: '9px', padding: '2px 6px', background: '#F3F4F6', borderRadius: '4px', color: '#667085' }}>{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INTEGRATIONS */}
          {activeView === 'integrations' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {mockIntegrations.map(int => (
                <div key={int.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #E4E7EC', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: int.status === 'operational' ? '#F0FDF4' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Network size={20} color={int.status === 'operational' ? '#16A34A' : '#F59E0B'} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#142235', margin: 0 }}>{int.name}</h3>
                        <p style={{ fontSize: '11px', color: '#667085', margin: 0 }}>{int.provider}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: int.status === 'operational' ? '#16A34A' : '#F59E0B', padding: '2px 8px', background: int.status === 'operational' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{int.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', color: '#98A2B3' }}>Uptime</span>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#142235', margin: 0 }}>{int.uptime}%</p>
                    </div>
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', color: '#98A2B3' }}>API Calls</span>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#142235', margin: 0 }}>{int.calls}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Status Bar */}
        <footer style={{ background: 'white', borderTop: '1px solid #E4E7EC', padding: '8px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#C9A24A', letterSpacing: '0.05em' }}>MASAR V0</span>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>System Administration · Technical Management</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Users: <span style={{ color: '#16A34A', fontWeight: 600 }}>{mockUsers.length}</span></span>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Integrations: <span style={{ color: '#16A34A', fontWeight: 600 }}>{mockIntegrations.filter(i => i.status === 'operational').length}/{mockIntegrations.length}</span></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
