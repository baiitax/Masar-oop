'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Crown, TrendingUp, DollarSign, Users, Truck, FileText, AlertTriangle, 
  CheckCircle, Clock, Ship, Shield, Package, ArrowUpRight, ArrowRight,
  Eye, Banknote, Scale, Target, ChevronRight, BarChart3, ArrowDownRight, 
  Minus, RefreshCw, Star, Building2, Bell, Search, ChevronDown, LogOut,
  Languages, Loader2, LayoutDashboard, Activity, Settings, History,
  MessageSquare, Receipt, Network, FolderOpen, Anchor, Wheat, Flag,
  Landmark, Award, MapPin, Calendar, KeyRound, Database, Cpu, Server,
  GitBranch, Unlock, UserPlus, Beaker, Percent, PieChart, Send, Edit,
  Trash2, Copy, ExternalLink, Info, HelpCircle, ShieldCheck, BadgeCheck,
  ClipboardCheck, Compass, Navigation, Thermometer, Droplets, Wind, Zap,
  Camera, Upload, Phone, Download, Filter, Plus, X, Menu
} from 'lucide-react';
import { 
  mockTransactions, mockBuyers, mockExporters, mockTasks, mockNotifications,
  formatCurrency, getStatusColor, getRiskColor, calculateDashboardStats
} from '@/lib/store';
import { colors, glass, typography, getBadgeStyle } from '@/lib/design';

// Role sidebar config for CEO
const ceoSidebar = [
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
];

const iconMap: Record<string, any> = {
  Crown, TrendingUp, FileText, Shield, Users, Truck, DollarSign, BarChart3, Scale,
  LayoutDashboard, Activity, Settings, History, MessageSquare, Receipt, Network,
  FolderOpen, Anchor, Wheat, Flag, Landmark, Award, MapPin, Calendar, KeyRound,
  Database, Cpu, Server, GitBranch, Unlock, UserPlus, Beaker, Percent, PieChart,
  Send, Edit, Trash2, Copy, ExternalLink, Info, HelpCircle, ShieldCheck, BadgeCheck,
  ClipboardCheck, Compass, Navigation, Thermometer, Droplets, Wind, Zap, Camera,
  Upload, Phone, Download, Filter, Plus, X, Menu, Search, Bell, ChevronDown,
  LogOut, Languages, Loader2, Eye, Target, Package, CheckCircle, Clock,
  AlertTriangle, Ship, Banknote, ArrowUpRight, ArrowRight, ArrowDownRight,
  Minus, RefreshCw, Star, Building2, ChevronRight
};

export default function ExecutiveDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'network' | 'risk'>('overview');
  const [selectedTxn, setSelectedTxn] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const stats = calculateDashboardStats(mockTransactions);
  const activeTxns = mockTransactions.filter(t => !['COMPLETED', 'SETTLED', 'CANCELLED'].includes(t.status));
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
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#C9A24A', letterSpacing: '0.1em' }}>MASAR EXECUTIVE</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Loading command center...</p>
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
              <span style={{ display: 'block', fontSize: '8px', color: 'rgba(201,162,74,0.6)', letterSpacing: '0.12em' }}>EXECUTIVE COMMAND</span>
            </div>
          )}
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(201,162,74,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'rgba(201,162,74,0.15)', borderRadius: '8px', border: '1px solid rgba(201,162,74,0.3)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(201,162,74,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={12} color="#C9A24A" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: 'white', margin: 0 }}>CEO / Corridor Lead</p>
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Executive</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {ceoSidebar.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '4px' }}>
              {!collapsed && (
                <div style={{ padding: '12px 20px 4px', fontSize: '10px', fontWeight: 700, color: 'rgba(201,162,74,0.4)', letterSpacing: '0.1em' }}>
                  {section.label}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = iconMap[item.icon] || FileText;
                const isActive = false;
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

        {/* User & Logout */}
        <div style={{ padding: collapsed ? '12px 8px' : '12px 16px', borderTop: '1px solid rgba(201,162,74,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #C9A24A, #E3C875)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0B1F3A' }}>MB</span>
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'white', margin: 0 }}>Mujaheed Baita</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>CEO</p>
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
              <input type="text" placeholder="Search transactions, buyers, exporters..." style={{ width: '100%', padding: '8px 12px 8px 36px', background: '#F9FAFB', border: '1px solid #E4E7EC', borderRadius: '8px', fontSize: '13px', color: '#142235', outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#F0FDF4', borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: '#16A34A', borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#16A34A' }}>OPERATIONAL</span>
            </div>
            <div style={{ padding: '4px 8px', background: 'rgba(201,162,74,0.08)', borderRadius: '4px', border: '1px solid rgba(201,162,74,0.15)' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#C9A24A', letterSpacing: '0.05em' }}>V0 CONCIERGE</span>
            </div>
            <button style={{ position: 'relative', padding: '6px', background: 'white', border: '1px solid #E4E7EC', borderRadius: '8px', cursor: 'pointer' }}>
              <Bell size={18} color="#667085" />
              {unreadNotifs.length > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: '#EF4444', borderRadius: '50%', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadNotifs.length}</span>}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #C9A24A, #E3C875)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0B1F3A' }}>MB</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#142235', margin: 0 }}>Mujaheed Baita</p>
                <p style={{ fontSize: '10px', color: '#667085', margin: 0 }}>CEO</p>
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
                <Crown size={18} color="#C9A24A" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#C9A24A', letterSpacing: '0.08em' }}>EXECUTIVE COMMAND CENTER</span>
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#142235', marginBottom: '2px' }}>Corridor Performance Overview</h1>
              <p style={{ fontSize: '13px', color: '#667085' }}>Nigeria → Saudi Arabia · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px 14px', background: 'white', border: '1px solid #E4E7EC', borderRadius: '8px', fontSize: '12px', fontWeight: 500, color: '#667085', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={13} /> Refresh</button>
              <Link href="/dashboard/transactions" style={{ padding: '8px 14px', background: 'linear-gradient(135deg, #C9A24A, #E3C875)', color: '#0B1F3A', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>View All Transactions</Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', background: '#E5E7EB', borderRadius: '10px', width: 'fit-content' }}>
            {(['overview', 'transactions', 'network', 'risk'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', ...(activeTab === tab ? { background: 'white', color: '#142235', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { background: 'transparent', color: '#667085' }) }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Daily Brief */}
          <div style={{ background: 'linear-gradient(135deg, #0B1F3A, #102A4C)', borderRadius: '12px', padding: '20px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%)`, backgroundSize: '60px 100px' }} />
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#C9A24A', letterSpacing: '0.08em' }}>DAILY EXECUTIVE BRIEF</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: '4px 0 0' }}>MASAR Daily Brief — {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</h3>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                {[
                  { v: String(stats.activeTransactions), l: 'Active Transactions' },
                  { v: String(stats.atRiskCount), l: 'Require Attention' },
                  { v: formatCurrency(stats.pipelineGMV), l: 'Pipeline GMV' },
                  { v: '1', l: 'Shipment Delayed' },
                  { v: '0', l: 'Compliance Breaches' },
                  { v: '1', l: 'Buyer Pending' },
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: 0 }}>{item.v}</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{item.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KPI Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'GMV', value: formatCurrency(stats.totalGMV), change: '+$420K this month', trend: 'up', icon: TrendingUp, color: '#C9A24A' },
              { label: 'REVENUE', value: '$142K', change: '+18% vs target', trend: 'up', icon: DollarSign, color: '#16A34A' },
              { label: 'COMPLETED', value: String(stats.completedTransactions), change: '+3 this month', trend: 'up', icon: CheckCircle, color: '#3B82F6' },
              { label: 'ACTIVE BUYERS', value: String(buyers.filter(b => b.verificationStatus === 'APPROVED').length), change: '+2 new', trend: 'up', icon: Users, color: '#8B5CF6' },
              { label: 'REPEAT RATE', value: '67%', change: '+5% QoQ', trend: 'up', icon: Star, color: '#16A34A' },
              { label: 'DISPUTE RATE', value: '0.8%', change: 'Below 1.5% target', trend: 'up', icon: Scale, color: '#16A34A' },
              { label: 'TAKE RATE', value: '3.7%', change: 'On target', trend: 'neutral', icon: Target, color: '#3B82F6' },
              { label: 'FINANCED', value: formatCurrency(stats.financedValue), change: '32% of GMV', trend: 'up', icon: Banknote, color: '#16A34A' },
            ].map((kpi, idx) => (
              <div key={idx} style={{ background: 'white', borderRadius: '12px', border: '1px solid #E4E7EC', padding: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>{kpi.label}</span>
                  <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: `${kpi.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><kpi.icon size={12} color={kpi.color} /></div>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#142235', lineHeight: 1, marginBottom: '3px' }}>{kpi.value}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {kpi.trend === 'up' ? <ArrowUpRight size={10} color="#16A34A" /> : kpi.trend === 'down' ? <ArrowDownRight size={10} color="#EF4444" /> : <Minus size={10} color="#98A2B3" />}
                  <span style={{ fontSize: '10px', color: kpi.trend === 'up' ? '#16A34A' : kpi.trend === 'down' ? '#EF4444' : '#98A2B3' }}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Strategic Alerts + Corridor Health */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* Strategic Alerts */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E4E7EC', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #E4E7EC' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#142235' }}>Strategic Alerts</h3>
              </div>
              <div style={{ padding: '12px' }}>
                {mockNotifications.filter(n => !n.read).map((n) => (
                  <div key={n.id} style={{ padding: '12px', borderLeft: `3px solid ${n.type === 'CRITICAL' ? '#EF4444' : n.type === 'WARNING' ? '#F59E0B' : '#3B82F6'}`, background: n.type === 'CRITICAL' ? '#FEF2F2' : n.type === 'WARNING' ? '#FFFBEB' : '#EFF6FF', borderRadius: '0 8px 8px 0', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div><p style={{ fontSize: '12px', fontWeight: 600, color: '#142235', margin: 0 }}>{n.title}</p><p style={{ fontSize: '11px', color: '#667085', margin: '2px 0 0' }}>{n.description}</p></div>
                      <Link href="/dashboard/transactions" style={{ padding: '4px 10px', background: 'white', border: '1px solid #E4E7EC', borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: '#667085', textDecoration: 'none' }}>View</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corridor Health */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E4E7EC', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #E4E7EC' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#142235' }}>Corridor Health</h3>
              </div>
              <div style={{ padding: '12px' }}>
                {[
                  { metric: 'Transaction Velocity', value: '42 days avg', status: 'good' },
                  { metric: 'Inspection Pass Rate', value: '96%', status: 'excellent' },
                  { metric: 'Compliance Pass Rate', value: '94%', status: 'good' },
                  { metric: 'Settlement Success', value: '100%', status: 'excellent' },
                  { metric: 'Dispute Rate', value: '0.8%', status: 'excellent' },
                  { metric: 'Repeat Buyer Rate', value: '67%', status: 'good' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < 5 ? '1px solid #F3F4F6' : 'none' }}>
                    <span style={{ fontSize: '12px', color: '#667085' }}>{item.metric}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#142235' }}>{item.value}</span>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: item.status === 'excellent' ? '#16A34A' : '#F59E0B', padding: '2px 6px', background: item.status === 'excellent' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{item.status === 'excellent' ? '● Excellent' : '● Good'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Buyers + Exporters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E4E7EC', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #E4E7EC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#142235' }}>Top Buyers</h3>
                <Link href="/dashboard/buyers" style={{ fontSize: '11px', color: '#C9A24A', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
              </div>
              {mockBuyers.filter(b => b.verificationStatus === 'APPROVED').map((buyer, idx) => (
                <Link key={buyer.id} href="/dashboard/buyers" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: idx < 1 ? '1px solid #E4E7EC' : 'none', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={16} color="#3B82F6" /></div>
                    <div><p style={{ fontSize: '13px', fontWeight: 600, color: '#142235', margin: 0 }}>{buyer.tradingName}</p><p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>{buyer.transactionCount} transactions</p></div>
                  </div>
                  <div style={{ textAlign: 'right' }}><p style={{ fontSize: '13px', fontWeight: 700, color: '#142235', margin: 0 }}>{formatCurrency(buyer.totalGMV)}</p><span style={{ fontSize: '10px', color: '#16A34A' }}>Risk: {buyer.riskScore}</span></div>
                </Link>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E4E7EC', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #E4E7EC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#142235' }}>Top Exporters</h3>
                <Link href="/dashboard/exporters" style={{ fontSize: '11px', color: '#C9A24A', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
              </div>
              {mockExporters.filter(e => e.verificationStatus === 'APPROVED').map((exp, idx) => (
                <Link key={exp.id} href="/dashboard/exporters" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: idx < 1 ? '1px solid #E4E7EC' : 'none', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Truck size={16} color="#16A34A" /></div>
                    <div><p style={{ fontSize: '13px', fontWeight: 600, color: '#142235', margin: 0 }}>{exp.tradingName}</p><p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>{exp.completedTransactions} completed</p></div>
                  </div>
                  <div style={{ textAlign: 'right' }}><div style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}><Star size={12} color="#C9A24A" fill="#C9A24A" /><span style={{ fontSize: '14px', fontWeight: 700, color: '#142235' }}>{exp.trustScore}</span></div><span style={{ fontSize: '10px', color: '#16A34A' }}>Pass: {exp.inspectionPassRate}%</span></div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        {/* Status Bar */}
        <footer style={{ background: 'white', borderTop: '1px solid #E4E7EC', padding: '8px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#C9A24A', letterSpacing: '0.05em' }}>MASAR V0</span>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Concierge Operations · Human-in-the-loop</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Operations: <span style={{ color: '#16A34A', fontWeight: 600 }}>Operational</span></span>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Settlement: <span style={{ color: '#C9A24A', fontWeight: 600 }}>Licensed Partner</span></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
