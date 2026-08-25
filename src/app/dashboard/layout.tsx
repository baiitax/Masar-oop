'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, FileText, Users, Truck, MessageSquare, Shield, FolderOpen, 
  Search, DollarSign, Ship, History, Settings, LogOut, Globe, Bell, ChevronDown,
  ChevronRight, ChevronLeft, Languages, Menu, X, BarChart3, AlertTriangle,
  CheckCircle, Clock, Eye, KeyRound, Database, Activity, Package, Scale,
  Building2, Landmark, Network, Target, Layers, Compass, Flag, Receipt,
  ClipboardCheck, BadgeCheck, Anchor, Boxes, Wheat, Cpu, Server
} from 'lucide-react';

// Preloader Component
function DashboardPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing systems...');

  useEffect(() => {
    const steps = [
      { p: 20, s: 'Loading transaction data...' },
      { p: 40, s: 'Syncing compliance records...' },
      { p: 60, s: 'Connecting inspection partners...' },
      { p: 80, s: 'Verifying finance status...' },
      { p: 95, s: 'Preparing command center...' },
      { p: 100, s: 'Ready' },
    ];
    let i = 0;
    const timer = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i].p);
        setStatus(steps[i].s);
        i++;
      } else {
        clearInterval(timer);
        setTimeout(onComplete, 300);
      }
    }, 400);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#0B1F3A',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.4s ease', opacity: progress >= 100 ? 0 : 1, pointerEvents: progress >= 100 ? 'none' : 'all',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%)`, backgroundSize: '60px 100px' }} />
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ animation: 'dash 2s linear infinite' }}>
          <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(201,162,74,0.15)" strokeWidth="2" />
          <circle cx="40" cy="40" r="35" fill="none" stroke="#C9A24A" strokeWidth="2" strokeDasharray={`${progress * 2.2} 220`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.3s ease' }} />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
        </div>
      </div>
      <span style={{ fontSize: '14px', fontWeight: 700, color: '#C9A24A', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>MASAR COMMAND CENTER</span>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>{status}</span>
      <div style={{ width: '200px', height: '3px', background: 'rgba(201,162,74,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #C9A24A, #E3C875)', borderRadius: '2px', transition: 'width 0.3s ease' }} />
      </div>
      <style jsx>{`@keyframes dash { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Navigation Structure
const navSections = [
  { label: 'OVERVIEW', items: [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Workspace', href: '/dashboard/workspace', icon: Target },
  ]},
  { label: 'TRANSACTIONS', items: [
    { name: 'All Transactions', href: '/dashboard/transactions', icon: FileText },
    { name: 'RFQs', href: '/dashboard/rfq', icon: MessageSquare },
    { name: 'Contracts', href: '/dashboard/contracts', icon: Receipt },
    { name: 'Disputes', href: '/dashboard/disputes', icon: Scale },
  ]},
  { label: 'NETWORK', items: [
    { name: 'Buyers', href: '/dashboard/buyers', icon: Users },
    { name: 'Exporters', href: '/dashboard/exporters', icon: Truck },
    { name: 'Partners', href: '/dashboard/partners', icon: Network },
    { name: 'Inspectors', href: '/dashboard/inspectors', icon: Eye },
  ]},
  { label: 'COMPLIANCE', items: [
    { name: 'Compliance Center', href: '/dashboard/compliance', icon: Shield },
    { name: 'Documents', href: '/dashboard/documents', icon: FolderOpen },
    { name: 'KYB / KYC', href: '/dashboard/kyb', icon: BadgeCheck },
    { name: 'Clearance Readiness', href: '/dashboard/clearance', icon: Target },
  ]},
  { label: 'QUALITY', items: [
    { name: 'Inspections', href: '/dashboard/inspections', icon: Search },
    { name: 'Lab Results', href: '/dashboard/lab-results', icon: ClipboardCheck },
    { name: 'Quality Exceptions', href: '/dashboard/quality-exceptions', icon: AlertTriangle },
  ]},
  { label: 'FINANCE', items: [
    { name: 'Finance Requests', href: '/dashboard/finance', icon: DollarSign },
    { name: 'Settlement', href: '/dashboard/settlement', icon: Landmark },
    { name: 'Reconciliation', href: '/dashboard/reconciliation', icon: BarChart3 },
  ]},
  { label: 'LOGISTICS', items: [
    { name: 'Shipments', href: '/dashboard/shipments', icon: Ship },
    { name: 'Containers', href: '/dashboard/containers', icon: Package },
    { name: 'Port Events', href: '/dashboard/port-events', icon: Anchor },
  ]},
  { label: 'INTELLIGENCE', items: [
    { name: 'Corridor Analytics', href: '/dashboard/analytics', icon: Activity },
    { name: 'Commodity Intel', href: '/dashboard/commodity', icon: Wheat },
    { name: 'Risk Command', href: '/dashboard/risk', icon: AlertTriangle },
  ]},
  { label: 'ADMINISTRATION', items: [
    { name: 'Audit Log', href: '/dashboard/audit', icon: History },
    { name: 'Users & Roles', href: '/dashboard/users', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]},
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();
  const isRTL = lang === 'ar';

  useEffect(() => {
    const saved = localStorage.getItem('masar-lang');
    if (saved) setLang(saved as 'en' | 'ar');
  }, []);

  const toggleLang = () => {
    const n = lang === 'en' ? 'ar' : 'en';
    setLang(n);
    localStorage.setItem('masar-lang', n);
    document.documentElement.dir = n === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = n;
  };

  const s = {
    navy: '#0B1F3A', navyLight: '#102A4C', gold: '#C9A24A', goldLight: '#E3C875',
    bg: '#F6F8FB', text: '#142235', textSec: '#667085', border: '#E4E7EC',
    sidebar: { width: collapsed ? '72px' : '260px', background: '#0B1F3A', borderRight: '1px solid rgba(201,162,74,0.1)', transition: 'width 0.3s ease', overflow: 'hidden' },
  };

  if (loading) return <DashboardPreloader onComplete={() => setLoading(false)} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: s.bg, fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mobile Overlay */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />}

      {/* Sidebar */}
      <aside style={{ ...s.sidebar, position: 'fixed', top: 0, bottom: 0, zIndex: 50, display: 'flex', flexDirection: 'column', ...(mobileOpen ? { left: 0 } : {}), ...(typeof window !== 'undefined' && window.innerWidth < 1024 && !mobileOpen ? { left: '-260px' } : {}) }} className="sidebar-desktop">
        {/* Logo */}
        <div style={{ padding: collapsed ? '16px 12px' : '16px 20px', borderBottom: '1px solid rgba(201,162,74,0.1)', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '64px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
          </div>
          {!collapsed && <div><span style={{ fontSize: '15px', fontWeight: 800, color: 'white', letterSpacing: '0.06em' }}>MASAR</span><span style={{ display: 'block', fontSize: '8px', color: 'rgba(201,162,74,0.6)', letterSpacing: '0.12em' }}>COMMAND CENTER</span></div>}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {navSections.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '4px' }}>
              {!collapsed && <div style={{ padding: '12px 20px 4px', fontSize: '10px', fontWeight: 700, color: 'rgba(201,162,74,0.4)', letterSpacing: '0.1em' }}>{section.label}</div>}
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: collapsed ? '10px 0' : '9px 20px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    textDecoration: 'none', transition: 'all 0.2s',
                    background: isActive ? 'rgba(201,162,74,0.1)' : 'transparent',
                    borderRight: isActive ? '2px solid #C9A24A' : '2px solid transparent',
                  }}>
                    <item.icon size={18} color={isActive ? '#C9A24A' : 'rgba(255,255,255,0.4)'} />
                    {!collapsed && <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400, color: isActive ? '#C9A24A' : 'rgba(255,255,255,0.5)' }}>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          position: 'absolute', top: '20px', right: '-12px', width: '24px', height: '24px', borderRadius: '50%',
          background: s.navy, border: '1px solid rgba(201,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10, color: '#C9A24A',
        }} className="collapse-btn">
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* User */}
        <div style={{ padding: collapsed ? '12px 8px' : '12px 16px', borderTop: '1px solid rgba(201,162,74,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #C9A24A, #E3C875)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0B1F3A' }}>MB</span>
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Mujaheed Baita</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: collapsed ? '72px' : '260px', transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column' }} className="main-content">
        {/* Top Bar */}
        <header style={{ background: 'white', borderBottom: `1px solid ${s.border}`, padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <button onClick={() => setMobileOpen(true)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} className="mobile-menu-btn"><Menu size={20} color={s.text} /></button>
            {/* Search */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#98A2B3' }} />
              <input type="text" placeholder="Search transactions, buyers, exporters, documents..." onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} style={{
                width: '100%', padding: '8px 12px 8px 36px', background: '#F9FAFB', border: `1px solid ${searchFocused ? s.gold : s.border}`,
                borderRadius: '8px', fontSize: '13px', color: s.text, outline: 'none', transition: 'all 0.2s',
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* System Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#F0FDF4', borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: '#22C55E', borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#16A34A' }}>OPERATIONAL</span>
            </div>
            {/* V0 Badge */}
            <div style={{ padding: '4px 8px', background: 'rgba(201,162,74,0.08)', borderRadius: '4px', border: '1px solid rgba(201,162,74,0.15)' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: s.gold, letterSpacing: '0.05em' }}>V0 CONCIERGE</span>
            </div>
            {/* Language */}
            <button onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: `1px solid ${s.border}`, background: 'white', color: s.textSec, cursor: 'pointer' }}>
              <Languages size={14} /> {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={{ position: 'relative', padding: '6px', background: 'none', border: `1px solid ${s.border}`, borderRadius: '8px', cursor: 'pointer' }}>
                <Bell size={18} color={s.textSec} />
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: '#EF4444', borderRadius: '50%', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
              </button>
              {notificationsOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '360px', background: 'white', borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', border: `1px solid ${s.border}`, zIndex: 50, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: `1px solid ${s.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Notifications</span>
                    <span style={{ fontSize: '11px', color: s.gold, cursor: 'pointer' }}>Mark all read</span>
                  </div>
                  {[
                    { type: 'CRITICAL', title: 'Release blocked', desc: 'SES-002 missing port verification', time: '2m ago', color: '#EF4444' },
                    { type: 'ACTION', title: 'Document awaiting approval', desc: 'Certificate of Origin for CAS-003', time: '15m ago', color: '#F59E0B' },
                    { type: 'WARNING', title: 'Shipment delayed', desc: 'MSCU1234567 ETA pushed 48h', time: '1h ago', color: '#F59E0B' },
                  ].map((n, idx) => (
                    <div key={idx} style={{ padding: '12px 16px', borderBottom: idx < 2 ? `1px solid ${s.border}` : 'none', display: 'flex', gap: '12px', cursor: 'pointer', background: idx === 0 ? '#FEF2F2' : 'white' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.color, marginTop: '6px', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: s.text }}>{n.title}</span>
                          <span style={{ fontSize: '10px', color: '#98A2B3' }}>{n.time}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: s.textSec, margin: '2px 0 0' }}>{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #C9A24A, #E3C875)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0B1F3A' }}>MB</span>
              </div>
              <div className="hidden sm:block">
                <p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>Mujaheed Baita</p>
                <p style={{ fontSize: '10px', color: s.textSec, margin: 0 }}>Administrator</p>
              </div>
              <ChevronDown size={14} color={s.textSec} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '24px' }}>
          {children}
        </main>

        {/* System Status Bar */}
        <footer style={{ background: 'white', borderTop: `1px solid ${s.border}`, padding: '8px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: s.gold, letterSpacing: '0.05em' }}>MASAR V0</span>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Concierge Operations · Human-in-the-loop</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Operations: <span style={{ color: '#16A34A', fontWeight: 600 }}>Operational</span></span>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Settlement: <span style={{ color: s.gold, fontWeight: 600 }}>Licensed Partner</span></span>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Last Sync: 23:48 UTC+1</span>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) { .sidebar-desktop { left: 0 !important; } .collapse-btn { display: flex; } }
        @media (max-width: 1023px) { .sidebar-desktop { left: -260px; } .sidebar-desktop.mobile-open { left: 0; } .main-content { margin-left: 0 !important; } .mobile-menu-btn { display: block !important; } .collapse-btn { display: none; } }
        @media (min-width: 640px) { .hidden.sm\\:block { display: block; } }
        @media (max-width: 639px) { .hidden.sm\\:block { display: none; } }
      `}</style>
    </div>
  );
}
