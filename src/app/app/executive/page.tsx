'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Crown, TrendingUp, DollarSign, Users, Truck, FileText, AlertTriangle, 
  CheckCircle, Clock, Ship, Shield, Activity, Package, ArrowUpRight, ArrowRight,
  Eye, Banknote, Scale, Target, ChevronRight, BarChart3, ArrowDownRight, 
  Minus, RefreshCw, Star, Building2, MapPin, Calendar, Bell, Search,
  Languages, ChevronDown, LogOut, Loader2
} from 'lucide-react';
import { 
  mockTransactions, mockBuyers, mockExporters, mockTasks, mockNotifications,
  formatCurrency, getStatusColor, getRiskColor, calculateDashboardStats,
  getCurrentRole
} from '@/lib/store';
import { colors, glass, typography, getBadgeStyle } from '@/lib/design';
import RoleSidebar from '@/components/dashboard/RoleSidebar';

export default function ExecutiveDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'network' | 'risk'>('overview');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const stats = calculateDashboardStats(mockTransactions);
  const activeTxns = mockTransactions.filter(t => !['COMPLETED', 'SETTLED', 'CANCELLED'].includes(t.status));
  const tasks = mockTasks.filter(t => t.status !== 'COMPLETED');
  const unreadNotifs = mockNotifications.filter(n => !n.read);

  useEffect(() => {
    const role = localStorage.getItem('masar-role');
    if (!role) { router.push('/auth'); return; }
    setTimeout(() => setLoading(false), 800);
  }, [router]);

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
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.gold, letterSpacing: '0.1em' }}>MASAR EXECUTIVE</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Loading command center...</p>
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
              <input type="text" placeholder="Search transactions, buyers, exporters..." style={{ ...glass.input, width: '100%', padding: '8px 12px 8px 36px', fontSize: '13px', color: colors.text, outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: colors.greenLight, borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: colors.green, borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: colors.green }}>OPERATIONAL</span>
            </div>
            <div style={{ padding: '4px 8px', background: 'rgba(201,162,74,0.08)', borderRadius: '4px', border: '1px solid rgba(201,162,74,0.15)' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: colors.gold, letterSpacing: '0.05em' }}>V0 CONCIERGE</span>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={{ position: 'relative', padding: '6px', ...glass.btnOutline, borderRadius: '8px' }}>
                <Bell size={18} color={colors.textSec} />
                {unreadNotifs.length > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: colors.red, borderRadius: '50%', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadNotifs.length}</span>}
              </button>
              {notificationsOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '360px', ...glass.card, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ ...typography.h3 }}>Notifications</span>
                    <span style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer' }}>Mark all read</span>
                  </div>
                  {mockNotifications.slice(0, 4).map((n, idx) => (
                    <div key={n.id} style={{ padding: '12px 16px', borderBottom: idx < 3 ? `1px solid ${colors.border}` : 'none', display: 'flex', gap: '12px', cursor: 'pointer', background: !n.read ? colors.redLight : 'white' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.type === 'CRITICAL' ? colors.red : n.type === 'WARNING' ? colors.amber : colors.blue, marginTop: '6px', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{n.title}</span>
                          <span style={{ fontSize: '10px', color: colors.textMuted }}>{n.timestamp}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>{n.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: colors.navy }}>MB</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>Mujaheed Baita</p>
                <p style={{ fontSize: '10px', color: colors.textSec, margin: 0 }}>CEO</p>
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
                <Crown size={18} color={colors.gold} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.gold, letterSpacing: '0.08em' }}>EXECUTIVE COMMAND CENTER</span>
              </div>
              <h1 style={{ ...typography.h1, marginBottom: '2px' }}>Corridor Performance Overview</h1>
              <p style={{ ...typography.small }}>Nigeria → Saudi Arabia · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...glass.btnOutline, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={13} /> Refresh</button>
              <Link href="/dashboard/transactions" style={{ ...glass.btnPrimary, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>View All Transactions</Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', background: '#E5E7EB', borderRadius: '10px', width: 'fit-content' }}>
            {(['overview', 'transactions', 'network', 'risk'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', ...(activeTab === tab ? { background: 'white', color: colors.text, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { background: 'transparent', color: colors.textSec }) }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Daily Brief */}
              <div style={{ ...glass.dark, padding: '20px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%)`, backgroundSize: '60px 100px' }} />
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: colors.gold, letterSpacing: '0.08em' }}>DAILY EXECUTIVE BRIEF</span>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: '4px 0 0' }}>MASAR Daily Brief — {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</h3>
                    </div>
                    <Link href="/dashboard/transactions" style={{ padding: '6px 12px', background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: colors.gold, textDecoration: 'none' }}>Open Full Brief</Link>
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
                  { label: 'GMV', value: formatCurrency(stats.totalGMV), change: '+$420K this month', trend: 'up', icon: TrendingUp, color: colors.gold },
                  { label: 'REVENUE', value: '$142K', change: '+18% vs target', trend: 'up', icon: DollarSign, color: colors.green },
                  { label: 'COMPLETED', value: String(stats.completedTransactions), change: '+3 this month', trend: 'up', icon: CheckCircle, color: colors.blue },
                  { label: 'ACTIVE BUYERS', value: String(buyers.filter(b => b.verificationStatus === 'APPROVED').length), change: '+2 new', trend: 'up', icon: Users, color: colors.purple },
                  { label: 'REPEAT RATE', value: '67%', change: '+5% QoQ', trend: 'up', icon: Star, color: colors.green },
                  { label: 'DISPUTE RATE', value: '0.8%', change: 'Below 1.5% target', trend: 'up', icon: Scale, color: colors.green },
                  { label: 'TAKE RATE', value: '3.7%', change: 'On target', trend: 'neutral', icon: Target, color: colors.blue },
                  { label: 'FINANCED', value: formatCurrency(stats.financedValue), change: '32% of GMV', trend: 'up', icon: Banknote, color: colors.green },
                ].map((kpi, idx) => (
                  <div key={idx} style={{ ...glass.card, padding: '14px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ ...typography.label }}>{kpi.label}</span>
                      <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: `${kpi.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><kpi.icon size={12} color={kpi.color} /></div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: colors.text, lineHeight: 1, marginBottom: '3px' }}>{kpi.value}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {kpi.trend === 'up' ? <ArrowUpRight size={10} color={colors.green} /> : kpi.trend === 'down' ? <ArrowDownRight size={10} color={colors.red} /> : <Minus size={10} color={colors.textMuted} />}
                      <span style={{ fontSize: '10px', color: kpi.trend === 'up' ? colors.green : kpi.trend === 'down' ? colors.red : colors.textMuted }}>{kpi.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Strategic Alerts + Corridor Health */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                    <h3 style={{ ...typography.h3 }}>Strategic Alerts</h3>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {mockNotifications.filter(n => !n.read).map((n, idx) => (
                      <div key={n.id} style={{ padding: '12px', borderLeft: `3px solid ${n.type === 'CRITICAL' ? colors.red : n.type === 'WARNING' ? colors.amber : colors.blue}`, background: n.type === 'CRITICAL' ? colors.redLight : n.type === 'WARNING' ? colors.amberLight : colors.blueLight, borderRadius: '0 8px 8px 0', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{n.title}</p><p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>{n.description}</p></div>
                          <Link href={`/dashboard/transactions`} style={{ padding: '4px 10px', ...glass.btnOutline, borderRadius: '4px', fontSize: '10px', fontWeight: 600, textDecoration: 'none' }}>View</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                    <h3 style={{ ...typography.h3 }}>Corridor Health</h3>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {[
                      { metric: 'Transaction Velocity', value: '42 days avg', status: 'good', target: '<45 days' },
                      { metric: 'Inspection Pass Rate', value: '96%', status: 'excellent', target: '>90%' },
                      { metric: 'Compliance Pass Rate', value: '94%', status: 'good', target: '>90%' },
                      { metric: 'Settlement Success', value: '100%', status: 'excellent', target: '100%' },
                      { metric: 'Dispute Rate', value: '0.8%', status: 'excellent', target: '<1.5%' },
                      { metric: 'Repeat Buyer Rate', value: '67%', status: 'good', target: '>60%' },
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < 5 ? `1px solid ${colors.borderLight}` : 'none' }}>
                        <span style={{ fontSize: '12px', color: colors.textSec }}>{item.metric}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{item.value}</span>
                          <span style={getBadgeStyle(item.status === 'excellent' ? 'success' : 'warning')}>{item.status === 'excellent' ? '● Excellent' : '● Good'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Buyers + Exporters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Top Buyers</h3>
                    <Link href="/dashboard/buyers" style={{ fontSize: '11px', color: colors.gold, textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
                  </div>
                  {mockBuyers.filter(b => b.verificationStatus === 'APPROVED').map((buyer, idx) => (
                    <Link key={buyer.id} href={`/dashboard/buyers`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: idx < 1 ? `1px solid ${colors.border}` : 'none', textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: colors.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={16} color={colors.blue} /></div>
                        <div><p style={{ fontSize: '13px', fontWeight: 600, color: colors.text, margin: 0 }}>{buyer.tradingName}</p><p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>{buyer.transactionCount} transactions</p></div>
                      </div>
                      <div style={{ textAlign: 'right' }}><p style={{ fontSize: '13px', fontWeight: 700, color: colors.text, margin: 0 }}>{formatCurrency(buyer.totalGMV)}</p><span style={{ fontSize: '10px', color: colors.green }}>Risk: {buyer.riskScore}</span></div>
                    </Link>
                  ))}
                </div>

                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Top Exporters</h3>
                    <Link href="/dashboard/exporters" style={{ fontSize: '11px', color: colors.gold, textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
                  </div>
                  {mockExporters.filter(e => e.verificationStatus === 'APPROVED').map((exp, idx) => (
                    <Link key={exp.id} href={`/dashboard/exporters`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: idx < 1 ? `1px solid ${colors.border}` : 'none', textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: colors.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Truck size={16} color={colors.green} /></div>
                        <div><p style={{ fontSize: '13px', fontWeight: 600, color: colors.text, margin: 0 }}>{exp.tradingName}</p><p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>{exp.completedTransactions} completed</p></div>
                      </div>
                      <div style={{ textAlign: 'right' }}><div style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}><Star size={12} color={colors.gold} fill={colors.gold} /><span style={{ fontSize: '14px', fontWeight: 700, color: colors.text }}>{exp.trustScore}</span></div><span style={{ fontSize: '10px', color: colors.green }}>Pass: {exp.inspectionPassRate}%</span></div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ ...typography.h3 }}>All Transactions</h3>
                <Link href="/dashboard/transactions" style={{ fontSize: '11px', color: colors.gold, textDecoration: 'none', fontWeight: 600 }}>Full View →</Link>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Transaction', 'Buyer', 'Exporter', 'Commodity', 'Value', 'Stage', 'Risk', 'Clearance', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockTransactions.map(txn => (
                    <tr key={txn.id} onClick={() => setSelectedTxn(txn.id)} style={{ cursor: 'pointer', background: selectedTxn === txn.id ? '#FFFBEB' : 'white', borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px 14px' }}><Link href={`/dashboard/transactions`} style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace', textDecoration: 'none' }}>{txn.masarId}</Link></td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: colors.text }}>{txn.buyerName}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: colors.text }}>{txn.exporterName}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: colors.text }}>{txn.commodity}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: colors.text }}>{formatCurrency(txn.contractValue)}</td>
                      <td style={{ padding: '12px 14px' }}><span style={{ ...getBadgeStyle('info'), color: getStatusColor(txn.status) }}>{txn.currentStage}</span></td>
                      <td style={{ padding: '12px 14px' }}><span style={{ ...getBadgeStyle(txn.riskLevel === 'LOW' ? 'success' : txn.riskLevel === 'MEDIUM' ? 'warning' : 'danger') }}>{txn.riskLevel}</span></td>
                      <td style={{ padding: '12px 14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${txn.clearanceScore}%`, height: '100%', background: txn.clearanceScore >= 75 ? colors.green : txn.clearanceScore >= 50 ? colors.amber : colors.red, borderRadius: '2px' }} /></div><span style={{ fontSize: '11px', fontWeight: 600 }}>{txn.clearanceScore}</span></div></td>
                      <td style={{ padding: '12px 14px' }}><Link href={`/dashboard/transactions`} style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px', textDecoration: 'none' }}><Eye size={12} color={colors.textSec} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Network Tab */}
          {activeTab === 'network' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
              <div style={{ ...glass.card, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}><h3 style={{ ...typography.h3 }}>Buyer Network</h3></div>
                {mockBuyers.map((buyer, idx) => (
                  <Link key={buyer.id} href="/dashboard/buyers" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: idx < mockBuyers.length - 1 ? `1px solid ${colors.border}` : 'none', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: colors.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={18} color={colors.blue} /></div>
                      <div><p style={{ fontSize: '13px', fontWeight: 600, color: colors.text, margin: 0 }}>{buyer.tradingName}</p><p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>{buyer.city} · {buyer.category}</p></div>
                    </div>
                    <div style={{ textAlign: 'right' }}><StatusBadge status={buyer.verificationStatus} /><p style={{ fontSize: '11px', color: colors.textMuted, margin: '2px 0 0' }}>{buyer.transactionCount} txns</p></div>
                  </Link>
                ))}
              </div>
              <div style={{ ...glass.card, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}><h3 style={{ ...typography.h3 }}>Exporter Network</h3></div>
                {mockExporters.map((exp, idx) => (
                  <Link key={exp.id} href="/dashboard/exporters" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: idx < mockExporters.length - 1 ? `1px solid ${colors.border}` : 'none', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: colors.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Truck size={18} color={colors.green} /></div>
                      <div><p style={{ fontSize: '13px', fontWeight: 600, color: colors.text, margin: 0 }}>{exp.tradingName}</p><p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>{exp.grade} · {exp.availableCapacity}</p></div>
                    </div>
                    <div style={{ textAlign: 'right' }}><div style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}><Star size={12} color={colors.gold} fill={colors.gold} /><span style={{ fontSize: '14px', fontWeight: 700 }}>{exp.trustScore}</span></div><StatusBadge status={exp.verificationStatus} /></div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Risk Tab */}
          {activeTab === 'risk' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}><h3 style={{ ...typography.h3 }}>Risk & Exceptions</h3></div>
              <div style={{ padding: '16px' }}>
                {mockTransactions.flatMap(t => t.exceptions.map(e => ({ ...e, transactionId: t.masarId }))).filter(e => !e.resolved).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <CheckCircle size={48} color={colors.green} style={{ margin: '0 auto 12px' }} />
                    <p style={{ ...typography.body, fontWeight: 600 }}>No active exceptions</p>
                    <p style={{ ...typography.small }}>All transactions operating within defined conditions</p>
                  </div>
                ) : (
                  mockTransactions.flatMap(t => t.exceptions.map(e => ({ ...e, transactionId: t.masarId }))).filter(e => !e.resolved).map((exc, idx) => (
                    <div key={idx} style={{ padding: '14px', borderLeft: `3px solid ${exc.severity === 'CRITICAL' ? colors.red : exc.severity === 'HIGH' ? '#F97316' : colors.amber}`, background: exc.severity === 'CRITICAL' ? colors.redLight : exc.severity === 'HIGH' ? '#FFF7ED' : colors.amberLight, borderRadius: '0 8px 8px 0', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textMuted, fontFamily: 'monospace' }}>{exc.transactionId}</span>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text, margin: '2px 0' }}>{exc.description}</p>
                          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                            <span style={{ fontSize: '11px', color: colors.textMuted }}>Owner: {exc.assignedTo}</span>
                            <span style={{ fontSize: '11px', color: colors.textMuted }}>Due: {exc.deadline}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={getBadgeStyle(exc.severity === 'CRITICAL' ? 'danger' : 'warning')}>{exc.severity}</span>
                          <Link href="/dashboard/transactions" style={{ padding: '4px 10px', ...glass.btnOutline, borderRadius: '4px', fontSize: '10px', fontWeight: 600, textDecoration: 'none' }}>Resolve</Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>

        {/* Status Bar */}
        <footer style={{ background: 'white', borderTop: `1px solid ${colors.border}`, padding: '8px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: colors.gold, letterSpacing: '0.05em' }}>MASAR V0</span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Concierge Operations · Human-in-the-loop</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Operations: <span style={{ color: colors.green, fontWeight: 600 }}>Operational</span></span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Settlement: <span style={{ color: colors.gold, fontWeight: 600 }}>Licensed Partner</span></span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Helper component
function StatusBadge({ status }: { status: string }) {
  const getStyle = () => {
    if (['APPROVED', 'VERIFIED', 'COMPLETED'].includes(status)) return getBadgeStyle('success');
    if (['PENDING', 'KYB_REVIEW', 'IN_PROGRESS'].includes(status)) return getBadgeStyle('warning');
    if (['REJECTED', 'FAILED'].includes(status)) return getBadgeStyle('danger');
    return getBadgeStyle('neutral');
  };
  return <span style={getStyle()}>{status.replace(/_/g, ' ')}</span>;
}
