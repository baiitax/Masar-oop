'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FileText, MessageSquare, Truck, Search, FolderOpen,
  Receipt, DollarSign, Scale, Ship, CheckCircle, Clock, AlertTriangle,
  Eye, Plus, Filter, RefreshCw, Download, ChevronRight, ArrowUpRight,
  Users, Package, MapPin, Calendar, Star, TrendingUp, BarChart3,
  Banknote, Anchor, Globe, Bell, Languages, ChevronDown, LogOut,
  Loader2, X, Building2, Shield, Activity, Target, ArrowRight,
  Send, Edit, Trash2, Copy, ExternalLink, Info, HelpCircle
} from 'lucide-react';
import { 
  mockTransactions, mockBuyers, mockExporters, mockNotifications,
  formatCurrency, getStatusColor, getRiskColor, Transaction
} from '@/lib/store';
import { colors, glass, typography, getBadgeStyle } from '@/lib/design';
import RoleSidebar from '@/components/dashboard/RoleSidebar';

// Buyer-specific types
interface RFQ {
  id: string;
  masarId: string;
  commodity: string;
  quantity: string;
  qualitySpec: string;
  origin: string;
  deliveryLocation: string;
  incoterm: string;
  paymentPreference: string;
  inspectionRequired: boolean;
  requiredDate: string;
  status: 'DRAFT' | 'OPEN' | 'MATCHED' | 'QUOTED' | 'ACCEPTED' | 'EXPIRED';
  createdAt: string;
  matchedExporters: number;
  quotesReceived: number;
}

interface BuyerDocument {
  id: string;
  name: string;
  type: string;
  transactionId: string;
  status: 'uploaded' | 'verified' | 'pending' | 'expired';
  uploadDate: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}

// Mock buyer data
const mockRFQs: RFQ[] = [
  { id: 'rfq-001', masarId: 'RFQ-2026-001', commodity: 'Premium Hulled Sesame', quantity: '1,000 MT', qualitySpec: '<2% moisture, >99% purity, <10 ppb aflatoxin', origin: 'Nigeria', deliveryLocation: 'Jeddah, Saudi Arabia', incoterm: 'CIF', paymentPreference: 'Escrow', inspectionRequired: true, requiredDate: '2026-09-15', status: 'MATCHED', createdAt: '2026-07-10', matchedExporters: 2, quotesReceived: 2 },
  { id: 'rfq-002', masarId: 'RFQ-2026-002', commodity: 'Premium Hulled Sesame', quantity: '500 MT', qualitySpec: '<3% moisture, >98% purity', origin: 'Nigeria', deliveryLocation: 'Dammam, Saudi Arabia', incoterm: 'CIF', paymentPreference: 'Escrow', inspectionRequired: true, requiredDate: '2026-10-01', status: 'OPEN', createdAt: '2026-08-15', matchedExporters: 1, quotesReceived: 0 },
  { id: 'rfq-003', masarId: 'RFQ-2026-003', commodity: 'Standard Natural Sesame', quantity: '750 MT', qualitySpec: '<3% moisture, >98% purity', origin: 'Nigeria', deliveryLocation: 'Riyadh, Saudi Arabia', incoterm: 'CFR', paymentPreference: 'Escrow', inspectionRequired: true, requiredDate: '2026-10-15', status: 'DRAFT', createdAt: '2026-08-20', matchedExporters: 0, quotesReceived: 0 },
];

const mockBuyerDocuments: BuyerDocument[] = [
  { id: 'bdoc-001', name: 'Certificate of Origin', type: 'Export', transactionId: 'txn-001', status: 'verified', uploadDate: '2026-07-25', verifiedBy: 'Compliance Officer', verifiedDate: '2026-07-26' },
  { id: 'bdoc-002', name: 'Phytosanitary Certificate', type: 'Export', transactionId: 'txn-001', status: 'verified', uploadDate: '2026-07-28', verifiedBy: 'Compliance Officer', verifiedDate: '2026-07-29' },
  { id: 'bdoc-003', name: 'Certificate of Analysis', type: 'Export', transactionId: 'txn-001', status: 'verified', uploadDate: '2026-08-02', verifiedBy: 'Compliance Officer', verifiedDate: '2026-08-03' },
  { id: 'bdoc-004', name: 'Commercial Invoice', type: 'Export', transactionId: 'txn-001', status: 'verified', uploadDate: '2026-07-20', verifiedBy: 'Operations Manager', verifiedDate: '2026-07-21' },
  { id: 'bdoc-005', name: 'SFDA Registration', type: 'Saudi', transactionId: 'txn-002', status: 'pending', uploadDate: '2026-08-15' },
  { id: 'bdoc-006', name: 'Arabic Labelling', type: 'Saudi', transactionId: 'txn-001', status: 'verified', uploadDate: '2026-08-10' },
];

const mockInvoices: Invoice[] = [
  { id: 'inv-001', invoiceNumber: 'INV-2026-001', transactionId: 'txn-001', amount: 500000, currency: 'USD', status: 'paid', issueDate: '2026-07-20', dueDate: '2026-08-20', paidDate: '2026-08-18' },
  { id: 'inv-002', invoiceNumber: 'INV-2026-002', transactionId: 'txn-002', amount: 250000, currency: 'USD', status: 'sent', issueDate: '2026-08-14', dueDate: '2026-09-14' },
  { id: 'inv-003', invoiceNumber: 'INV-2026-003', transactionId: 'txn-003', amount: 375000, currency: 'USD', status: 'draft', issueDate: '2026-08-22', dueDate: '2026-09-22' },
];

export default function BuyerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'rfqs' | 'transactions' | 'suppliers' | 'inspections' | 'shipments' | 'documents' | 'invoices' | 'payments' | 'disputes'>('overview');
  const [selectedTxn, setSelectedTxn] = useState<string | null>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showCreateRFQ, setShowCreateRFQ] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const buyer = mockBuyers[0]; // Al Rajhi Foods
  const buyerTransactions = mockTransactions.filter(t => t.buyerId === buyer.id);
  const activeTxns = buyerTransactions.filter(t => !['COMPLETED', 'SETTLED', 'CANCELLED'].includes(t.status));
  const completedTxns = buyerTransactions.filter(t => ['COMPLETED', 'SETTLED'].includes(t.status));
  const totalSpend = buyerTransactions.reduce((sum, t) => sum + t.contractValue, 0);
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
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.gold, letterSpacing: '0.1em' }}>MASAR BUYER PORTAL</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Loading your trade desk...</p>
        </div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif", direction: 'ltr', textAlign: 'left' }}>
      <RoleSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div style={{ flex: 1, marginLeft: collapsed ? '72px' : '260px', transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header style={{ ...glass.card, borderRadius: 0, borderBottom: `1px solid ${colors.border}`, padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
              <input type="text" placeholder="Search orders, RFQs, documents..." style={{ ...glass.input, width: '100%', padding: '8px 12px 8px 36px', fontSize: '13px', color: colors.text, outline: 'none', textAlign: 'left' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: colors.greenLight, borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: colors.green, borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: colors.green }}>ACTIVE</span>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={{ position: 'relative', padding: '6px', ...glass.btnOutline, borderRadius: '8px' }}>
                <Bell size={18} color={colors.textSec} />
                {unreadNotifs.length > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: colors.red, borderRadius: '50%', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadNotifs.length}</span>}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${colors.red}, #F87171)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>AR</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>Al Rajhi Foods</p>
                <p style={{ fontSize: '10px', color: colors.textSec, margin: 0 }}>Saudi Arabia</p>
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
                <span style={{ fontSize: '18px' }}>🇸🇦</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.red, letterSpacing: '0.08em' }}>BUYER PORTAL</span>
              </div>
              <h1 style={{ ...typography.h1, marginBottom: '2px' }}>Your Trade Desk</h1>
              <p style={{ ...typography.small }}>{buyer.tradingName} · {buyer.city}, Saudi Arabia</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...glass.btnOutline, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={13} /> Refresh</button>
              <button onClick={() => setShowCreateRFQ(true)} style={{ ...glass.btnPrimary, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={13} /> Create RFQ</button>
            </div>
          </div>

          {/* View Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', background: '#E5E7EB', borderRadius: '10px', width: 'fit-content', overflowX: 'auto' }}>
            {([
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'rfqs', label: 'RFQs', icon: MessageSquare },
              { id: 'transactions', label: 'Transactions', icon: FileText },
              { id: 'suppliers', label: 'Suppliers', icon: Truck },
              { id: 'inspections', label: 'Inspections', icon: Search },
              { id: 'shipments', label: 'Shipments', icon: Ship },
              { id: 'documents', label: 'Documents', icon: FolderOpen },
              { id: 'invoices', label: 'Invoices', icon: Receipt },
              { id: 'payments', label: 'Payments', icon: DollarSign },
              { id: 'disputes', label: 'Disputes', icon: Scale },
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
              {/* KPI Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'OPEN RFQS', value: String(mockRFQs.filter(r => r.status === 'OPEN' || r.status === 'MATCHED').length), icon: MessageSquare, color: colors.blue, action: () => setActiveView('rfqs') },
                  { label: 'ACTIVE PURCHASES', value: String(activeTxns.length), icon: Package, color: colors.gold, action: () => setActiveView('transactions') },
                  { label: 'IN TRANSIT', value: String(buyerTransactions.filter(t => t.status === 'IN_TRANSIT').length), icon: Ship, color: '#8B5CF6', action: () => setActiveView('shipments') },
                  { label: 'DELIVERED', value: String(completedTxns.length), icon: CheckCircle, color: colors.green, action: () => setActiveView('transactions') },
                  { label: 'TOTAL PROCUREMENT', value: formatCurrency(totalSpend), icon: DollarSign, color: colors.gold, action: () => setActiveView('invoices') },
                  { label: 'PENDING ACTIONS', value: '2', icon: Clock, color: colors.amber, action: () => setActiveView('overview') },
                ].map((kpi, idx) => (
                  <div key={idx} onClick={kpi.action} style={{ ...glass.card, padding: '14px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ ...typography.label }}>{kpi.label}</span>
                      <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: `${kpi.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><kpi.icon size={12} color={kpi.color} /></div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: colors.text }}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* What You Need to Know + Recent Activity */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {/* What You Need to Know */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                    <h3 style={{ ...typography.h3 }}>What You Need to Know</h3>
                  </div>
                  <div style={{ padding: '16px' }}>
                    {[
                      { q: 'What did I buy?', a: `${activeTxns.length} active purchases across sesame and cashew`, icon: Package, color: colors.blue },
                      { q: 'Where is it?', a: '1 shipment in transit, ETA Sep 8', icon: Ship, color: '#8B5CF6' },
                      { q: 'Has it passed inspection?', a: '1 passed, 1 scheduled, 1 pending', icon: Search, color: colors.amber },
                      { q: 'Is everything compliant?', a: 'Average compliance: 84%', icon: Shield, color: colors.green },
                      { q: 'What do I need to do?', a: 'No pending actions required', icon: CheckCircle, color: colors.green },
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F9FAFB', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer' }} onClick={() => { if (idx === 0) setActiveView('transactions'); else if (idx === 1) setActiveView('shipments'); else if (idx === 2) setActiveView('inspections'); else if (idx === 3) setActiveView('documents'); }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <item.icon size={18} color={item.color} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text, margin: 0 }}>{item.q}</p>
                          <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>{item.a}</p>
                        </div>
                        <ChevronRight size={14} color={colors.textMuted} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Recent Activity</h3>
                    <button onClick={() => setActiveView('transactions')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {[
                      { time: '2 hours ago', event: 'Inspection report uploaded', txn: 'MASAR-SES-2026-000001', type: 'inspection' },
                      { time: '5 hours ago', event: 'Finance approved', txn: 'MASAR-SES-2026-000001', type: 'finance' },
                      { time: '1 day ago', event: 'Compliance pack completed', txn: 'MASAR-SES-2026-000002', type: 'compliance' },
                      { time: '2 days ago', event: 'Contract executed', txn: 'MASAR-SES-2026-000003', type: 'contract' },
                      { time: '3 days ago', event: 'Shipment departed', txn: 'MASAR-SES-2026-000001', type: 'shipment' },
                    ].map((activity, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: idx < 4 ? `1px solid ${colors.borderLight}` : 'none', cursor: 'pointer' }} onClick={() => setActiveView('transactions')}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activity.type === 'inspection' ? colors.blue : activity.type === 'finance' ? colors.green : activity.type === 'compliance' ? colors.amber : activity.type === 'shipment' ? '#8B5CF6' : colors.gold, marginTop: '6px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{activity.event}</p>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                            <span style={{ fontSize: '10px', color: colors.textMuted, fontFamily: 'monospace' }}>{activity.txn}</span>
                            <span style={{ fontSize: '10px', color: colors.textMuted }}>· {activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Purchases */}
              <div style={{ ...glass.card, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ ...typography.h3 }}>Active Purchases</h3>
                  <button onClick={() => setActiveView('transactions')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#F9FAFB' }}>
                    {['Transaction', 'Commodity', 'Quantity', 'Value', 'Supplier', 'Stage', 'Compliance', 'Inspection', 'ETA', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {buyerTransactions.map(txn => (
                      <tr key={txn.id} onClick={() => { setSelectedTxn(txn.id); setActiveView('transactions'); }} style={{ cursor: 'pointer', borderBottom: `1px solid ${colors.border}` }}>
                        <td style={{ padding: '12px' }}><span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{txn.masarId}</span></td>
                        <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{txn.commodity}</td>
                        <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{txn.quantity}</td>
                        <td style={{ padding: '12px', fontSize: '12px', fontWeight: 600 }}>{formatCurrency(txn.contractValue)}</td>
                        <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{txn.exporterName}</td>
                        <td style={{ padding: '12px' }}><span style={{ ...getBadgeStyle('info'), color: getStatusColor(txn.status) }}>{txn.currentStage}</span></td>
                        <td style={{ padding: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '30px', height: '3px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${txn.clearanceScore}%`, height: '100%', background: txn.clearanceScore >= 75 ? colors.green : colors.amber, borderRadius: '2px' }} /></div><span style={{ fontSize: '10px', fontWeight: 600 }}>{txn.clearanceScore}%</span></div></td>
                        <td style={{ padding: '12px' }}><span style={getBadgeStyle(txn.status === 'IN_TRANSIT' ? 'success' : 'warning')}>{txn.status === 'IN_TRANSIT' ? 'Passed' : 'Pending'}</span></td>
                        <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{txn.expectedCompletion}</td>
                        <td style={{ padding: '12px' }}><button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Eye size={12} color={colors.textSec} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* RFQS VIEW */}
          {activeView === 'rfqs' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
                {mockRFQs.map(rfq => (
                  <div key={rfq.id} onClick={() => setSelectedRFQ(rfq.id)} style={{ ...glass.card, padding: '20px', cursor: 'pointer', border: selectedRFQ === rfq.id ? `2px solid ${colors.gold}` : undefined }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{rfq.masarId}</span>
                        <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>{rfq.commodity}</p>
                      </div>
                      <span style={getBadgeStyle(rfq.status === 'MATCHED' ? 'success' : rfq.status === 'OPEN' ? 'info' : 'neutral')}>{rfq.status}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: colors.textMuted }}>Quantity</span><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{rfq.quantity}</p></div>
                      <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: colors.textMuted }}>Incoterm</span><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{rfq.incoterm}</p></div>
                      <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: colors.textMuted }}>Delivery</span><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{rfq.deliveryLocation}</p></div>
                      <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: colors.textMuted }}>Required</span><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{rfq.requiredDate}</p></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: colors.textSec }}>{rfq.matchedExporters} exporters matched · {rfq.quotesReceived} quotes</span>
                      <button style={{ ...glass.btnOutline, padding: '6px 12px', fontSize: '11px' }}>View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TRANSACTIONS VIEW */}
          {activeView === 'transactions' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ ...typography.h3 }}>All Transactions</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['all', 'active', 'completed'].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(filterStatus === f ? { background: colors.navy, color: 'white' } : { background: '#F3F4F6', color: colors.textSec }) }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                  ))}
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Transaction', 'Commodity', 'Quantity', 'Value', 'Exporter', 'Stage', 'Risk', 'Clearance', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {buyerTransactions.map(txn => (
                    <tr key={txn.id} onClick={() => setSelectedTxn(txn.id)} style={{ cursor: 'pointer', background: selectedTxn === txn.id ? '#FFFBEB' : 'white', borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px' }}><span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{txn.masarId}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{txn.commodity}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{txn.quantity}</td>
                      <td style={{ padding: '12px', fontSize: '12px', fontWeight: 600 }}>{formatCurrency(txn.contractValue)}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{txn.exporterName}</td>
                      <td style={{ padding: '12px' }}><span style={{ ...getBadgeStyle('info'), color: getStatusColor(txn.status) }}>{txn.currentStage}</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(txn.riskLevel === 'LOW' ? 'success' : 'warning')}>{txn.riskLevel}</span></td>
                      <td style={{ padding: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '30px', height: '3px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${txn.clearanceScore}%`, height: '100%', background: txn.clearanceScore >= 75 ? colors.green : colors.amber, borderRadius: '2px' }} /></div><span style={{ fontSize: '10px', fontWeight: 600 }}>{txn.clearanceScore}</span></div></td>
                      <td style={{ padding: '12px' }}><button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Eye size={12} color={colors.textSec} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* DOCUMENTS VIEW */}
          {activeView === 'documents' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                <h3 style={{ ...typography.h3 }}>Documents</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Document', 'Type', 'Transaction', 'Status', 'Upload Date', 'Verified By', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockBuyerDocuments.map(doc => (
                    <tr key={doc.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} color={doc.status === 'verified' ? colors.green : colors.amber} /><span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{doc.name}</span></div></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(doc.type === 'Export' ? 'info' : 'warning')}>{doc.type}</span></td>
                      <td style={{ padding: '12px', fontSize: '11px', fontFamily: 'monospace', color: colors.text }}>{doc.transactionId}</td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(doc.status === 'verified' ? 'success' : doc.status === 'expired' ? 'danger' : 'warning')}>{doc.status}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{doc.uploadDate}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{doc.verifiedBy || '—'}</td>
                      <td style={{ padding: '12px' }}><button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Eye size={12} color={colors.textSec} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* INVOICES VIEW */}
          {activeView === 'invoices' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                <h3 style={{ ...typography.h3 }}>Invoices</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Invoice #', 'Transaction', 'Amount', 'Status', 'Issue Date', 'Due Date', 'Paid Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockInvoices.map(inv => (
                    <tr key={inv.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px' }}><span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{inv.invoiceNumber}</span></td>
                      <td style={{ padding: '12px', fontSize: '11px', fontFamily: 'monospace', color: colors.text }}>{inv.transactionId}</td>
                      <td style={{ padding: '12px', fontSize: '12px', fontWeight: 600 }}>{formatCurrency(inv.amount)}</td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : inv.status === 'sent' ? 'info' : 'neutral')}>{inv.status}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{inv.issueDate}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{inv.dueDate}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{inv.paidDate || '—'}</td>
                      <td style={{ padding: '12px' }}><button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Eye size={12} color={colors.textSec} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Other Views */}
          {!['overview', 'rfqs', 'transactions', 'documents', 'invoices'].includes(activeView) && (
            <div style={{ ...glass.card, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${colors.red}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {activeView === 'suppliers' && <Truck size={28} color={colors.red} />}
                {activeView === 'inspections' && <Search size={28} color={colors.red} />}
                {activeView === 'shipments' && <Ship size={28} color={colors.red} />}
                {activeView === 'payments' && <DollarSign size={28} color={colors.red} />}
                {activeView === 'disputes' && <Scale size={28} color={colors.red} />}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>
                {activeView === 'suppliers' && 'Suppliers'}
                {activeView === 'inspections' && 'Inspections'}
                {activeView === 'shipments' && 'Shipments'}
                {activeView === 'payments' && 'Payments'}
                {activeView === 'disputes' && 'Disputes'}
              </h2>
              <p style={{ fontSize: '14px', color: colors.textSec, maxWidth: '500px', margin: '0 auto 24px' }}>
                {activeView === 'suppliers' && 'View and manage your verified supplier network.'}
                {activeView === 'inspections' && 'Track inspection status and results for your orders.'}
                {activeView === 'shipments' && 'Monitor shipments from port to destination.'}
                {activeView === 'payments' && 'View payment history and pending payments.'}
                {activeView === 'disputes' && 'Manage disputes and resolution workflows.'}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setActiveView('overview')} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Back to Overview</button>
              </div>
            </div>
          )}
        </main>

        {/* Status Bar */}
        <footer style={{ background: 'white', borderTop: `1px solid ${colors.border}`, padding: '8px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: colors.gold, letterSpacing: '0.05em' }}>MASAR V0</span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Buyer Portal · {buyer.tradingName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Status: <span style={{ color: colors.green, fontWeight: 600 }}>Active</span></span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Last Sync: {new Date().toLocaleTimeString()}</span>
          </div>
        </footer>
      </div>

      {/* Create RFQ Modal */}
      {showCreateRFQ && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>Create New RFQ</h2>
              <button onClick={() => setShowCreateRFQ(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={colors.textSec} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Commodity</label>
                  <select style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }}>
                    <option>Premium Hulled Sesame</option>
                    <option>Standard Natural Sesame</option>
                    <option>Cashew</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Quantity</label>
                  <input type="text" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} placeholder="e.g., 1,000 MT" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Incoterm</label>
                  <select style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }}>
                    <option>CIF</option>
                    <option>CFR</option>
                    <option>FOB</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Required Date</label>
                  <input type="date" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Quality Specification</label>
                <textarea style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px', resize: 'vertical' }} rows={3} placeholder="Detailed quality requirements..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setShowCreateRFQ(false)} style={{ ...glass.btnOutline, padding: '10px 20px', fontSize: '13px' }}>Cancel</button>
                <button onClick={() => { setShowCreateRFQ(false); setActiveView('rfqs'); }} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Submit RFQ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
