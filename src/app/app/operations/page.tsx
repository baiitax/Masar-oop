'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FileText, MessageSquare, Receipt, Shield, Search, 
  DollarSign, Ship, AlertTriangle, Scale, Clock, CheckCircle, Eye,
  Plus, Filter, RefreshCw, Download, ChevronRight, ArrowUpRight,
  Users, Truck, Package, MapPin, Calendar, Target, Activity,
  Bell, Languages, ChevronDown, LogOut, Loader2, Building2,
  Star, TrendingUp, BarChart3, Banknote, Anchor, Globe
} from 'lucide-react';
import { 
  mockTransactions, mockBuyers, mockExporters, mockTasks, mockNotifications,
  formatCurrency, getStatusColor, getRiskColor, getPriorityColor,
  calculateDashboardStats, Transaction, Task
} from '@/lib/store';
import { colors, glass, typography, getBadgeStyle, animations } from '@/lib/design';
import RoleSidebar from '@/components/dashboard/RoleSidebar';

export default function OperationsDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'queue' | 'rfqs' | 'contracts' | 'compliance' | 'inspections' | 'finance' | 'shipments' | 'exceptions' | 'disputes' | 'sla' | 'release'>('home');
  const [selectedTxn, setSelectedTxn] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = calculateDashboardStats(mockTransactions);
  const activeTxns = mockTransactions.filter(t => !['COMPLETED', 'SETTLED', 'CANCELLED'].includes(t.status));
  const tasks = mockTasks.filter(t => t.status !== 'COMPLETED');
  const unreadNotifs = mockNotifications.filter(n => !n.read);
  const exceptions = mockTransactions.flatMap(t => t.exceptions.map(e => ({ ...e, transactionId: t.masarId, txnId: t.id }))).filter(e => !e.resolved);

  useEffect(() => {
    const role = localStorage.getItem('masar-role');
    if (!role) { router.push('/auth'); return; }
    setTimeout(() => setLoading(false), 800);
  }, [router]);

  const filteredTxns = filterStatus === 'all' ? mockTransactions : 
    filterStatus === 'active' ? activeTxns :
    filterStatus === 'risk' ? mockTransactions.filter(t => ['HIGH', 'CRITICAL'].includes(t.riskLevel)) :
    mockTransactions.filter(t => ['COMPLETED', 'SETTLED'].includes(t.status));

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
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.gold, letterSpacing: '0.1em' }}>MASAR OPERATIONS</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Loading operations center...</p>
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
              <input type="text" placeholder="Search transactions, tasks, documents..." style={{ ...glass.input, width: '100%', padding: '8px 12px 8px 36px', fontSize: '13px', color: colors.text, outline: 'none' }} />
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
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${colors.purple}, #A78BFA)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>CO</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>Operations Manager</p>
                <p style={{ fontSize: '10px', color: colors.textSec, margin: 0 }}>Corridor Operations</p>
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
                <LayoutDashboard size={18} color={colors.purple} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.purple, letterSpacing: '0.08em' }}>OPERATIONS COMMAND CENTER</span>
              </div>
              <h1 style={{ ...typography.h1, marginBottom: '2px' }}>Operations Home</h1>
              <p style={{ ...typography.small }}>Nigeria → Saudi Arabia · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...glass.btnOutline, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={13} /> Refresh</button>
              <button style={{ ...glass.btnPrimary, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={13} /> New Transaction</button>
            </div>
          </div>

          {/* View Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', background: '#E5E7EB', borderRadius: '10px', width: 'fit-content', overflowX: 'auto' }}>
            {([
              { id: 'home', label: 'Home', icon: LayoutDashboard },
              { id: 'queue', label: 'Transaction Queue', icon: FileText },
              { id: 'rfqs', label: 'RFQs', icon: MessageSquare },
              { id: 'contracts', label: 'Contracts', icon: Receipt },
              { id: 'compliance', label: 'Compliance', icon: Shield },
              { id: 'inspections', label: 'Inspections', icon: Search },
              { id: 'finance', label: 'Finance', icon: DollarSign },
              { id: 'shipments', label: 'Shipments', icon: Ship },
              { id: 'exceptions', label: 'Exceptions', icon: AlertTriangle },
              { id: 'release', label: 'Release Queue', icon: CheckCircle },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveView(tab.id as any)} style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', transition: 'all 0.2s', ...(activeView === tab.id ? { background: 'white', color: colors.text, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { background: 'transparent', color: colors.textSec }) }}>
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* HOME VIEW */}
          {activeView === 'home' && (
            <>
              {/* Today's Work */}
              <div style={{ ...glass.dark, padding: '20px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%)`, backgroundSize: '60px 100px' }} />
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: colors.gold, letterSpacing: '0.08em' }}>TODAY&apos;S WORK</span>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: '4px 0 0' }}>{tasks.length} Tasks Require Attention</h3>
                    </div>
                    <button onClick={() => setActiveView('queue')} style={{ padding: '6px 12px', background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: colors.gold, cursor: 'pointer' }}>View All Tasks</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                    {[
                      { v: String(tasks.length), l: 'Total Tasks', c: 'white' },
                      { v: String(tasks.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length), l: 'High Priority', c: '#F97316' },
                      { v: String(tasks.filter(t => t.status === 'OVERDUE').length), l: 'Overdue', c: colors.red },
                      { v: String(tasks.filter(t => t.status === 'IN_PROGRESS').length), l: 'In Progress', c: colors.blue },
                      { v: String(tasks.filter(t => t.assignedTo === 'Operations').length), l: 'My Tasks', c: colors.gold },
                    ].map((item, idx) => (
                      <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => setActiveView('queue')}>
                        <p style={{ fontSize: '24px', fontWeight: 800, color: item.c, margin: 0 }}>{item.v}</p>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{item.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KPI Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'ACTIVE TRANSACTIONS', value: String(stats.activeTransactions), icon: FileText, color: colors.blue },
                  { label: 'PIPELINE GMV', value: formatCurrency(stats.pipelineGMV), icon: TrendingUp, color: colors.gold },
                  { label: 'IN TRANSIT', value: formatCurrency(stats.inTransitValue), icon: Ship, color: '#8B5CF6' },
                  { label: 'AT RISK', value: String(stats.atRiskCount), icon: AlertTriangle, color: colors.red },
                  { label: 'EXCEPTIONS', value: String(stats.exceptionCount), icon: AlertTriangle, color: colors.amber },
                  { label: 'COMPLETED', value: String(stats.completedTransactions), icon: CheckCircle, color: colors.green },
                ].map((kpi, idx) => (
                  <div key={idx} onClick={() => { if (kpi.label === 'AT RISK') setActiveView('exceptions'); else if (kpi.label === 'EXCEPTIONS') setActiveView('exceptions'); else setActiveView('queue'); }} style={{ ...glass.card, padding: '14px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ ...typography.label }}>{kpi.label}</span>
                      <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: `${kpi.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><kpi.icon size={12} color={kpi.color} /></div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: colors.text }}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Live Transaction Board + Tasks */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {/* Transaction Board */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Live Transaction Board</h3>
                    <button onClick={() => setActiveView('queue')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {activeTxns.map(txn => (
                      <div key={txn.id} onClick={() => { setSelectedTxn(txn.id); setActiveView('queue'); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${getStatusColor(txn.status)}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={18} color={getStatusColor(txn.status)} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{txn.masarId}</span>
                            <span style={getBadgeStyle(txn.riskLevel === 'LOW' ? 'success' : txn.riskLevel === 'MEDIUM' ? 'warning' : 'danger')}>{txn.riskLevel}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>{txn.buyerName} → {txn.exporterName} · {txn.commodity}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ ...getBadgeStyle('info'), color: getStatusColor(txn.status) }}>{txn.currentStage}</span>
                          <p style={{ fontSize: '10px', color: colors.textMuted, margin: '2px 0 0' }}>{formatCurrency(txn.contractValue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task Queue */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Task Queue</h3>
                    <span style={getBadgeStyle('warning')}>{tasks.length} pending</span>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {tasks.slice(0, 5).map(task => (
                      <div key={task.id} onClick={() => setActiveView('queue')} style={{ display: 'flex', gap: '12px', padding: '12px', background: task.priority === 'CRITICAL' ? colors.redLight : task.priority === 'HIGH' ? '#FFF7ED' : '#F9FAFB', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', borderLeft: `3px solid ${getPriorityColor(task.priority)}` }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{task.title}</p>
                          <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0' }}>{task.description}</p>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <span style={{ fontSize: '10px', color: colors.textMuted }}>Owner: {task.assignedTo}</span>
                            <span style={{ fontSize: '10px', color: colors.textMuted }}>Due: {task.dueDate}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                          <span style={getBadgeStyle(task.priority === 'CRITICAL' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'info')}>{task.priority}</span>
                          <button style={{ padding: '4px 10px', ...glass.btnPrimary, borderRadius: '4px', fontSize: '10px' }}>Review</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exceptions + SLA */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
                {/* Exceptions */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Active Exceptions</h3>
                    <button onClick={() => setActiveView('exceptions')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {exceptions.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <CheckCircle size={32} color={colors.green} style={{ margin: '0 auto 8px' }} />
                        <p style={{ fontSize: '13px', color: colors.textSec }}>No active exceptions</p>
                      </div>
                    ) : exceptions.map((exc, idx) => (
                      <div key={idx} style={{ padding: '12px', borderLeft: `3px solid ${exc.severity === 'CRITICAL' ? colors.red : exc.severity === 'HIGH' ? '#F97316' : colors.amber}`, background: exc.severity === 'CRITICAL' ? colors.redLight : exc.severity === 'HIGH' ? '#FFF7ED' : colors.amberLight, borderRadius: '0 8px 8px 0', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textMuted, fontFamily: 'monospace' }}>{exc.transactionId}</span>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: '2px 0' }}>{exc.description}</p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                              <span style={{ fontSize: '10px', color: colors.textMuted }}>Owner: {exc.assignedTo}</span>
                              <span style={{ fontSize: '10px', color: colors.textMuted }}>Due: {exc.deadline}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <span style={getBadgeStyle(exc.severity === 'CRITICAL' ? 'danger' : 'warning')}>{exc.severity}</span>
                            <button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px', fontSize: '10px' }}>Resolve</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SLA Monitor */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                    <h3 style={{ ...typography.h3 }}>SLA Monitor</h3>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {[
                      { sla: 'KYB/Sanctions', target: '72 hours', current: '48 hours', status: 'on-track', pct: 67 },
                      { sla: 'Compliance Pack', target: '5 days', current: '3 days', status: 'on-track', pct: 60 },
                      { sla: 'Inspection Booking', target: '48 hours', current: '24 hours', status: 'on-track', pct: 50 },
                      { sla: 'Escrow Funding', target: '4 hours', current: '2 hours', status: 'on-track', pct: 50 },
                      { sla: 'Dispute Resolution', target: '5 days', current: '2 days', status: 'on-track', pct: 40 },
                    ].map((item, idx) => (
                      <div key={idx} style={{ padding: '10px 0', borderBottom: idx < 4 ? `1px solid ${colors.borderLight}` : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{item.sla}</span>
                          <span style={{ fontSize: '11px', color: colors.textSec }}>{item.current} / {item.target}</span>
                        </div>
                        <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${item.pct}%`, height: '100%', background: item.pct > 80 ? colors.red : item.pct > 60 ? colors.amber : colors.green, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TRANSACTION QUEUE VIEW */}
          {activeView === 'queue' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ ...typography.h3 }}>Transaction Queue</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['all', 'active', 'completed', 'risk'].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(filterStatus === f ? { background: colors.navy, color: 'white' } : { background: '#F3F4F6', color: colors.textSec }) }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                  ))}
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Transaction', 'Buyer', 'Exporter', 'Commodity', 'Value', 'Stage', 'Risk', 'Clearance', 'Next Action', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredTxns.map(txn => (
                    <tr key={txn.id} onClick={() => setSelectedTxn(txn.id)} style={{ cursor: 'pointer', background: selectedTxn === txn.id ? '#FFFBEB' : 'white', borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px' }}><Link href={`/dashboard/transactions`} style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace', textDecoration: 'none' }}>{txn.masarId}</Link></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{txn.buyerName}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{txn.exporterName}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{txn.commodity}</td>
                      <td style={{ padding: '12px', fontSize: '12px', fontWeight: 600 }}>{formatCurrency(txn.contractValue)}</td>
                      <td style={{ padding: '12px' }}><span style={{ ...getBadgeStyle('info'), color: getStatusColor(txn.status) }}>{txn.currentStage}</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(txn.riskLevel === 'LOW' ? 'success' : txn.riskLevel === 'MEDIUM' ? 'warning' : 'danger')}>{txn.riskLevel}</span></td>
                      <td style={{ padding: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '30px', height: '3px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${txn.clearanceScore}%`, height: '100%', background: txn.clearanceScore >= 75 ? colors.green : colors.amber, borderRadius: '2px' }} /></div><span style={{ fontSize: '10px', fontWeight: 600 }}>{txn.clearanceScore}</span></div></td>
                      <td style={{ padding: '12px', fontSize: '11px', color: colors.textSec }}>{txn.nextAction}</td>
                      <td style={{ padding: '12px' }}><Link href={`/dashboard/transactions`} style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px', textDecoration: 'none' }}><Eye size={12} color={colors.textSec} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* EXCEPTIONS VIEW */}
          {activeView === 'exceptions' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                <h3 style={{ ...typography.h3 }}>Exception Center</h3>
              </div>
              <div style={{ padding: '16px' }}>
                {exceptions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <CheckCircle size={48} color={colors.green} style={{ margin: '0 auto 12px' }} />
                    <p style={{ ...typography.body, fontWeight: 600 }}>No active exceptions</p>
                    <p style={{ ...typography.small }}>All transactions operating within defined conditions</p>
                  </div>
                ) : exceptions.map((exc, idx) => (
                  <div key={idx} style={{ padding: '16px', borderLeft: `4px solid ${exc.severity === 'CRITICAL' ? colors.red : exc.severity === 'HIGH' ? '#F97316' : colors.amber}`, background: exc.severity === 'CRITICAL' ? colors.redLight : exc.severity === 'HIGH' ? '#FFF7ED' : colors.amberLight, borderRadius: '0 10px 10px 0', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: colors.textMuted, fontFamily: 'monospace' }}>{exc.transactionId}</span>
                          <span style={getBadgeStyle(exc.severity === 'CRITICAL' ? 'danger' : 'warning')}>{exc.severity}</span>
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text, margin: '4px 0' }}>{exc.description}</p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                          <span style={{ fontSize: '12px', color: colors.textSec }}>Owner: <strong>{exc.assignedTo}</strong></span>
                          <span style={{ fontSize: '12px', color: colors.textSec }}>Deadline: <strong>{exc.deadline}</strong></span>
                          <span style={{ fontSize: '12px', color: colors.textSec }}>Type: <strong>{exc.type}</strong></span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ ...glass.btnPrimary, padding: '8px 16px', fontSize: '12px' }}>Resolve</button>
                        <button style={{ ...glass.btnOutline, padding: '8px 16px', fontSize: '12px' }}>Escalate</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Views - Placeholder with working navigation */}
          {!['home', 'queue', 'exceptions'].includes(activeView) && (
            <div style={{ ...glass.card, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${colors.purple}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {activeView === 'rfqs' && <MessageSquare size={28} color={colors.purple} />}
                {activeView === 'contracts' && <Receipt size={28} color={colors.purple} />}
                {activeView === 'compliance' && <Shield size={28} color={colors.purple} />}
                {activeView === 'inspections' && <Search size={28} color={colors.purple} />}
                {activeView === 'finance' && <DollarSign size={28} color={colors.purple} />}
                {activeView === 'shipments' && <Ship size={28} color={colors.purple} />}
                {activeView === 'release' && <CheckCircle size={28} color={colors.purple} />}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>
                {activeView === 'rfqs' && 'RFQ & Deal Room'}
                {activeView === 'contracts' && 'Contracts'}
                {activeView === 'compliance' && 'Compliance Queue'}
                {activeView === 'inspections' && 'Inspection Queue'}
                {activeView === 'finance' && 'Finance Queue'}
                {activeView === 'shipments' && 'Shipment Control'}
                {activeView === 'release' && 'Release Queue'}
              </h2>
              <p style={{ fontSize: '14px', color: colors.textSec, maxWidth: '500px', margin: '0 auto 24px' }}>
                {activeView === 'rfqs' && 'Manage RFQs and deal rooms for buyer-exporter matching.'}
                {activeView === 'contracts' && 'Track contract execution and signing status.'}
                {activeView === 'compliance' && 'Monitor compliance queue and document status.'}
                {activeView === 'inspections' && 'Schedule and track inspections with partners.'}
                {activeView === 'finance' && 'Manage finance requests and capital partner coordination.'}
                {activeView === 'shipments' && 'Monitor shipments from port to destination.'}
                {activeView === 'release' && 'Review and authorize transaction releases.'}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setActiveView('home')} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Back to Home</button>
                <Link href="/dashboard/transactions" style={{ ...glass.btnOutline, padding: '10px 20px', fontSize: '13px', textDecoration: 'none' }}>View Transactions</Link>
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
