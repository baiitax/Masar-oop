'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Target, FileText, MessageSquare, Shield, FolderOpen,
  Search, DollarSign, Ship, CheckCircle, Clock, AlertTriangle,
  Eye, Plus, Filter, RefreshCw, Download, ChevronRight, ArrowUpRight,
  Users, Package, MapPin, Calendar, Star, TrendingUp, BarChart3,
  Banknote, Anchor, Globe, Bell, Languages, ChevronDown, LogOut,
  Loader2, X, Building2, Truck, Activity, Award, ArrowRight,
  Send, Edit, Trash2, Copy, ExternalLink, Info, HelpCircle,
  Receipt, Scale, KeyRound, Lock, Unlock, FileCheck, ClipboardCheck,
  Beaker, Warehouse, Navigation, Compass
} from 'lucide-react';
import { 
  mockTransactions, mockBuyers, mockExporters, mockNotifications,
  formatCurrency, getStatusColor, getRiskColor, Transaction, Exporter
} from '@/lib/store';
import { colors, glass, typography, getBadgeStyle } from '@/lib/design';
import RoleSidebar from '@/components/dashboard/RoleSidebar';

// Exporter-specific types
interface Opportunity {
  id: string;
  rfqId: string;
  buyerName: string;
  buyerCountry: string;
  commodity: string;
  quantity: string;
  qualitySpec: string;
  deliveryLocation: string;
  incoterm: string;
  paymentTerms: string;
  requiredDate: string;
  status: 'OPEN' | 'QUOTED' | 'AWARDED' | 'EXPIRED';
  createdAt: string;
  matchScore: number;
}

interface ExportOrder {
  id: string;
  masarId: string;
  buyerName: string;
  commodity: string;
  quantity: string;
  contractValue: number;
  status: string;
  currentStage: string;
  nextAction: string;
  complianceReadiness: number;
  inspectionStatus: string;
  financingStatus: string;
  shipmentStatus: string;
  paymentStatus: string;
  createdAt: string;
  expectedCompletion: string;
}

interface ExportDocument {
  id: string;
  name: string;
  nameAr: string;
  category: 'cac' | 'nepc' | 'export' | 'quality' | 'financial';
  status: 'valid' | 'expiring' | 'expired' | 'pending';
  issueDate: string;
  expiryDate: string;
  verifiedBy?: string;
  documentNumber?: string;
}

interface FinancingRequest {
  id: string;
  transactionId: string;
  masarId: string;
  invoiceValue: number;
  requestedAdvance: number;
  requestedAmount: number;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'DECLINED' | 'DISBURSED';
  capitalPartner: string;
  submittedDate?: string;
  approvedDate?: string;
  interestRate?: number;
  tenor?: number;
}

interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  target: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

// Mock exporter data
const exporter = mockExporters[0]; // Dangote Sesame

const mockOpportunities: Opportunity[] = [
  { id: 'opp-001', rfqId: 'RFQ-2026-004', buyerName: 'Al Rajhi Foods', buyerCountry: 'Saudi Arabia', commodity: 'Premium Hulled Sesame', quantity: '2,000 MT', qualitySpec: '<2% moisture, >99% purity, <10 ppb aflatoxin', deliveryLocation: 'Jeddah, Saudi Arabia', incoterm: 'CIF', paymentTerms: 'Escrow', requiredDate: '2026-11-15', status: 'OPEN', createdAt: '2026-08-20', matchScore: 96 },
  { id: 'opp-002', rfqId: 'RFQ-2026-005', buyerName: 'SGT Foods', buyerCountry: 'Saudi Arabia', commodity: 'Premium Hulled Sesame', quantity: '1,000 MT', qualitySpec: '<2.5% moisture, >98.5% purity', deliveryLocation: 'Dammam, Saudi Arabia', incoterm: 'CIF', paymentTerms: 'Escrow', requiredDate: '2026-12-01', status: 'OPEN', createdAt: '2026-08-22', matchScore: 88 },
  { id: 'opp-003', rfqId: 'RFQ-2026-006', buyerName: 'JPF Distribution', buyerCountry: 'Saudi Arabia', commodity: 'Standard Natural Sesame', quantity: '500 MT', qualitySpec: '<3% moisture, >98% purity', deliveryLocation: 'Jeddah, Saudi Arabia', incoterm: 'CFR', paymentTerms: 'LC', requiredDate: '2026-12-15', status: 'QUOTED', createdAt: '2026-08-18', matchScore: 72 },
];

const mockExportOrders: ExportOrder[] = [
  { id: 'order-001', masarId: 'MASAR-SES-2026-000001', buyerName: 'Al Rajhi Foods', commodity: 'Premium Hulled Sesame', quantity: '1,000 MT', contractValue: 500000, status: 'IN_TRANSIT', currentStage: 'Shipment', nextAction: 'Monitor vessel ETA', complianceReadiness: 94, inspectionStatus: 'Passed', financingStatus: 'Approved', shipmentStatus: 'In Transit', paymentStatus: 'Pending', createdAt: '2026-07-01', expectedCompletion: '2026-09-15' },
  { id: 'order-002', masarId: 'MASAR-SES-2026-000002', buyerName: 'SGT Foods', commodity: 'Premium Hulled Sesame', quantity: '500 MT', contractValue: 250000, status: 'INSPECTION', currentStage: 'Inspection', nextAction: 'Await inspection results', complianceReadiness: 72, inspectionStatus: 'Scheduled', financingStatus: 'Pending', shipmentStatus: 'Not Started', paymentStatus: 'N/A', createdAt: '2026-08-01', expectedCompletion: '2026-10-01' },
  { id: 'order-003', masarId: 'MASAR-SES-2026-000003', buyerName: 'Al Rajhi Foods', commodity: 'Standard Natural Sesame', quantity: '750 MT', contractValue: 375000, status: 'COMPLIANCE', currentStage: 'Compliance', nextAction: 'Upload Laboratory COA', complianceReadiness: 58, inspectionStatus: 'Pending', financingStatus: 'Not Started', shipmentStatus: 'Not Started', paymentStatus: 'N/A', createdAt: '2026-08-10', expectedCompletion: '2026-10-20' },
  { id: 'order-004', masarId: 'MASAR-SES-2026-000005', buyerName: 'Al Rajhi Foods', commodity: 'Premium Hulled Sesame', quantity: '1,500 MT', contractValue: 750000, status: 'COMPLETED', currentStage: 'Completed', nextAction: 'None', complianceReadiness: 97, inspectionStatus: 'Passed', financingStatus: 'Repaid', shipmentStatus: 'Delivered', paymentStatus: 'Settled', createdAt: '2026-05-01', expectedCompletion: '2026-07-28' },
];

const mockExportDocuments: ExportDocument[] = [
  { id: 'edoc-001', name: 'CAC Registration', nameAr: 'تسجيل CAC', category: 'cac', status: 'valid', issueDate: '2020-01-15', expiryDate: '2030-01-15', documentNumber: 'RC-1234567' },
  { id: 'edoc-002', name: 'NEPC Export License', nameAr: 'رخصة تصدير NEPC', category: 'nepc', status: 'valid', issueDate: '2024-03-01', expiryDate: '2027-03-01', documentNumber: 'NEPC/EXP/2024/001234' },
  { id: 'edoc-003', name: 'Certificate of Origin', nameAr: 'شهادة المنشأ', category: 'export', status: 'valid', issueDate: '2026-07-25', expiryDate: '2027-01-25', verifiedBy: 'Compliance Officer', documentNumber: 'NEPC/CO/2026/1234' },
  { id: 'edoc-004', name: 'Phytosanitary Certificate', nameAr: 'شهادة الصحة النباتية', category: 'export', status: 'expiring', issueDate: '2026-07-28', expiryDate: '2026-10-28', verifiedBy: 'Compliance Officer', documentNumber: 'NAQS/PHY/2026/5678' },
  { id: 'edoc-005', name: 'Laboratory COA', nameAr: 'شهادة المختبر', category: 'quality', status: 'valid', issueDate: '2026-08-02', expiryDate: '2027-02-02', verifiedBy: 'Compliance Officer', documentNumber: 'SGS/COA/2026/9012' },
  { id: 'edoc-006', name: 'Commercial Invoice', nameAr: 'الفاتورة التجارية', category: 'financial', status: 'valid', issueDate: '2026-07-20', expiryDate: '', verifiedBy: 'Operations Manager', documentNumber: 'INV/2026/001' },
  { id: 'edoc-007', name: 'Packing List', nameAr: 'قائمة التعبئة', category: 'export', status: 'valid', issueDate: '2026-08-10', expiryDate: '', verifiedBy: 'Operations Manager', documentNumber: 'PL/2026/001' },
  { id: 'edoc-008', name: 'Export License', nameAr: 'رخصة التصدير', category: 'export', status: 'valid', issueDate: '2024-01-01', expiryDate: '2027-01-01', documentNumber: 'FED/EXP/2024/001' },
];

const mockFinancing: FinancingRequest[] = [
  { id: 'fin-001', transactionId: 'order-001', masarId: 'MASAR-SES-2026-000001', invoiceValue: 500000, requestedAdvance: 80, requestedAmount: 400000, status: 'APPROVED', capitalPartner: 'Afreximbank', submittedDate: '2026-08-08', approvedDate: '2026-08-10', interestRate: 8.5, tenor: 90 },
  { id: 'fin-002', transactionId: 'order-002', masarId: 'MASAR-SES-2026-000002', invoiceValue: 250000, requestedAdvance: 75, requestedAmount: 187500, status: 'SUBMITTED', capitalPartner: 'Afreximbank', submittedDate: '2026-08-20' },
  { id: 'fin-003', transactionId: 'order-003', masarId: 'MASAR-SES-2026-000003', invoiceValue: 375000, requestedAdvance: 80, requestedAmount: 300000, status: 'DRAFT', capitalPartner: 'Afreximbank' },
];

const mockPerformance: PerformanceMetric[] = [
  { label: 'Trust Score', value: '94/100', change: '+2 this month', trend: 'up', target: '>80', status: 'excellent' },
  { label: 'Inspection Pass Rate', value: '98%', change: '0% change', trend: 'neutral', target: '>95%', status: 'excellent' },
  { label: 'On-Time Delivery', value: '96%', change: '+1%', trend: 'up', target: '>90%', status: 'excellent' },
  { label: 'Compliance Rate', value: '94%', change: '-1%', trend: 'down', target: '>90%', status: 'good' },
  { label: 'Quality Consistency', value: '97%', change: '+1%', trend: 'up', target: '>95%', status: 'excellent' },
  { label: 'Dispute Rate', value: '0%', change: 'No disputes', trend: 'neutral', target: '<2%', status: 'excellent' },
];

export default function ExporterDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'opportunities' | 'orders' | 'rfqs' | 'compliance' | 'documents' | 'inspections' | 'financing' | 'shipments' | 'payments' | 'performance'>('overview');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showFinanceModal, setShowFinanceModal] = useState(false);

  const activeOrders = mockExportOrders.filter(o => o.status !== 'COMPLETED');
  const completedOrders = mockExportOrders.filter(o => o.status === 'COMPLETED');
  const totalRevenue = mockExportOrders.reduce((sum, o) => sum + o.contractValue, 0);
  const pendingPayments = mockExportOrders.filter(o => o.paymentStatus === 'Pending').reduce((sum, o) => sum + o.contractValue, 0);
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
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.gold, letterSpacing: '0.1em' }}>MASAR EXPORTER</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Loading export operations...</p>
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
              <input type="text" placeholder="Search orders, opportunities, documents..." style={{ ...glass.input, width: '100%', padding: '8px 12px 8px 36px', fontSize: '13px', color: colors.text, outline: 'none', textAlign: 'left' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: colors.greenLight, borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: colors.green, borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: colors.green }}>ACTIVE</span>
            </div>
            <div style={{ padding: '4px 8px', background: 'rgba(201,162,74,0.08)', borderRadius: '4px', border: '1px solid rgba(201,162,74,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={12} color={colors.gold} fill={colors.gold} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: colors.gold }}>{exporter.trustScore}</span>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={{ position: 'relative', padding: '6px', ...glass.btnOutline, borderRadius: '8px' }}>
                <Bell size={18} color={colors.textSec} />
                {unreadNotifs.length > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: colors.red, borderRadius: '50%', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadNotifs.length}</span>}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${colors.green}, #34D399)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>DS</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{exporter.tradingName}</p>
                <p style={{ fontSize: '10px', color: colors.textSec, margin: 0 }}>Nigeria</p>
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
                <span style={{ fontSize: '18px' }}>🇳🇬</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.green, letterSpacing: '0.08em' }}>EXPORTER PORTAL</span>
              </div>
              <h1 style={{ ...typography.h1, marginBottom: '2px' }}>Export Operations</h1>
              <p style={{ ...typography.small }}>{exporter.tradingName} · {exporter.country}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...glass.btnOutline, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={13} /> Refresh</button>
              <button onClick={() => setShowFinanceModal(true)} style={{ ...glass.btnPrimary, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><DollarSign size={13} /> Request Financing</button>
            </div>
          </div>

          {/* Trust Score Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '16px', background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', borderRadius: '12px', border: '1px solid #FDE68A' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `conic-gradient(${colors.gold} 0deg, ${colors.gold} ${exporter.trustScore * 3.6}deg, #E5E7EB ${exporter.trustScore * 3.6}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: colors.text }}>{exporter.trustScore}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, margin: 0 }}>MASAR Exporter Trust Score</h3>
              <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>Based on identity, history, documentation, inspection, fulfilment, and quality</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: 'Identity', score: 15, max: 15 },
                { label: 'History', score: 18, max: 20 },
                { label: 'Docs', score: 16, max: 20 },
                { label: 'Inspection', score: 15, max: 15 },
                { label: 'Fulfilment', score: 15, max: 15 },
                { label: 'Quality', score: 14, max: 15 },
              ].map((item, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${colors.gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: colors.gold }}>{item.score}</span>
                  </div>
                  <span style={{ fontSize: '9px', color: colors.textMuted }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* View Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', background: '#E5E7EB', borderRadius: '10px', width: 'fit-content', overflowX: 'auto' }}>
            {([
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'opportunities', label: 'Opportunities', icon: Target },
              { id: 'orders', label: 'Orders', icon: FileText },
              { id: 'rfqs', label: 'RFQs', icon: MessageSquare },
              { id: 'compliance', label: 'Compliance', icon: Shield },
              { id: 'documents', label: 'Documents', icon: FolderOpen },
              { id: 'inspections', label: 'Inspections', icon: Search },
              { id: 'financing', label: 'Financing', icon: DollarSign },
              { id: 'shipments', label: 'Shipments', icon: Ship },
              { id: 'payments', label: 'Payments', icon: Banknote },
              { id: 'performance', label: 'Performance', icon: Award },
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'OPEN OPPORTUNITIES', value: String(mockOpportunities.filter(o => o.status === 'OPEN').length), icon: Target, color: colors.blue, action: () => setActiveView('opportunities') },
                  { label: 'ACTIVE ORDERS', value: String(activeOrders.length), icon: Package, color: colors.gold, action: () => setActiveView('orders') },
                  { label: 'AVAILABLE SUPPLY', value: exporter.availableCapacity, icon: Truck, color: colors.green, action: () => setActiveView('overview') },
                  { label: 'COMPLIANCE', value: '94%', icon: Shield, color: colors.green, action: () => setActiveView('compliance') },
                  { label: 'TRUST SCORE', value: String(exporter.trustScore), icon: Star, color: colors.gold, action: () => setActiveView('performance') },
                  { label: 'PENDING PAYMENTS', value: formatCurrency(pendingPayments), icon: Banknote, color: colors.amber, action: () => setActiveView('payments') },
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

              {/* Automation Progress + Recent Activity */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {/* Automation Progress */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                    <h3 style={{ ...typography.h3 }}>Order Automation — MASAR-SES-2026-000001</h3>
                    <p style={{ fontSize: '11px', color: colors.textMuted, margin: '2px 0 0' }}>System automatically creates workflow steps</p>
                  </div>
                  <div style={{ padding: '16px' }}>
                    {[
                      { step: 'Contract Task', status: 'complete', desc: 'Contract executed' },
                      { step: 'Compliance Checklist', status: 'complete', desc: 'All documents verified' },
                      { step: 'Inspection Request', status: 'complete', desc: 'Inspection passed' },
                      { step: 'Financing Option', status: 'active', desc: 'Finance approved' },
                      { step: 'Shipment Preparation', status: 'pending', desc: 'Awaiting release' },
                      { step: 'Payment Tracking', status: 'pending', desc: 'Settlement pending' },
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '12px', paddingBottom: idx < 5 ? '14px' : 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {item.status === 'complete' ? <CheckCircle size={18} color={colors.green} /> : item.status === 'active' ? <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: colors.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} /></div> : <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #E5E7EB' }} />}
                          {idx < 5 && <div style={{ width: '2px', flex: 1, background: item.status === 'complete' ? '#BBF7D0' : '#E5E7EB', marginTop: '4px' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: item.status === 'pending' ? colors.textMuted : colors.text, margin: 0 }}>{item.step}</p>
                          <p style={{ fontSize: '11px', color: colors.textMuted, margin: '2px 0 0' }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Recent Activity</h3>
                    <button onClick={() => setActiveView('orders')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {[
                      { time: '2 hours ago', event: 'Inspection report uploaded', txn: 'MASAR-SES-2026-000001', type: 'inspection' },
                      { time: '5 hours ago', event: 'Finance approved', txn: 'MASAR-SES-2026-000001', type: 'finance' },
                      { time: '1 day ago', event: 'Compliance pack completed', txn: 'MASAR-SES-2026-000002', type: 'compliance' },
                      { time: '2 days ago', event: 'Contract executed', txn: 'MASAR-SES-2026-000003', type: 'contract' },
                      { time: '3 days ago', event: 'Shipment departed', txn: 'MASAR-SES-2026-000001', type: 'shipment' },
                    ].map((activity, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: idx < 4 ? `1px solid ${colors.borderLight}` : 'none', cursor: 'pointer' }} onClick={() => setActiveView('orders')}>
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

              {/* Active Orders */}
              <div style={{ ...glass.card, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ ...typography.h3 }}>Active Orders</h3>
                  <button onClick={() => setActiveView('orders')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#F9FAFB' }}>
                    {['Transaction', 'Buyer', 'Commodity', 'Value', 'Stage', 'Compliance', 'Inspection', 'Financing', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {activeOrders.map(order => (
                      <tr key={order.id} onClick={() => { setSelectedOrder(order.id); setActiveView('orders'); }} style={{ cursor: 'pointer', borderBottom: `1px solid ${colors.border}` }}>
                        <td style={{ padding: '12px' }}><span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{order.masarId}</span></td>
                        <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{order.buyerName}</td>
                        <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{order.commodity}</td>
                        <td style={{ padding: '12px', fontSize: '12px', fontWeight: 600 }}>{formatCurrency(order.contractValue)}</td>
                        <td style={{ padding: '12px' }}><span style={{ ...getBadgeStyle('info'), color: getStatusColor(order.status) }}>{order.currentStage}</span></td>
                        <td style={{ padding: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '30px', height: '3px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${order.complianceReadiness}%`, height: '100%', background: order.complianceReadiness >= 75 ? colors.green : colors.amber, borderRadius: '2px' }} /></div><span style={{ fontSize: '10px', fontWeight: 600 }}>{order.complianceReadiness}%</span></div></td>
                        <td style={{ padding: '12px' }}><span style={getBadgeStyle(order.inspectionStatus === 'Passed' ? 'success' : order.inspectionStatus === 'Scheduled' ? 'warning' : 'neutral')}>{order.inspectionStatus}</span></td>
                        <td style={{ padding: '12px' }}><span style={getBadgeStyle(order.financingStatus === 'Approved' ? 'success' : order.financingStatus === 'Pending' ? 'warning' : 'neutral')}>{order.financingStatus}</span></td>
                        <td style={{ padding: '12px' }}><button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Eye size={12} color={colors.textSec} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* OPPORTUNITIES VIEW */}
          {activeView === 'opportunities' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
              {mockOpportunities.map(opp => (
                <div key={opp.id} onClick={() => setSelectedOpp(opp.id)} style={{ ...glass.card, padding: '20px', cursor: 'pointer', border: selectedOpp === opp.id ? `2px solid ${colors.gold}` : undefined }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{opp.rfqId}</span>
                      <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>{opp.buyerName} · {opp.buyerCountry}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={getBadgeStyle(opp.status === 'OPEN' ? 'success' : opp.status === 'QUOTED' ? 'info' : 'neutral')}>{opp.status}</span>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Star size={12} color={colors.gold} fill={colors.gold} /><span style={{ fontSize: '14px', fontWeight: 700, color: colors.text }}>{opp.matchScore}</span></div>
                        <span style={{ fontSize: '9px', color: colors.textMuted }}>Match</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: colors.textMuted }}>Commodity</span><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{opp.commodity}</p></div>
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: colors.textMuted }}>Quantity</span><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{opp.quantity}</p></div>
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: colors.textMuted }}>Incoterm</span><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{opp.incoterm}</p></div>
                    <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: colors.textMuted }}>Required</span><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{opp.requiredDate}</p></div>
                  </div>
                  <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '9px', color: colors.textMuted }}>Quality Spec</span>
                    <p style={{ fontSize: '11px', color: colors.text, margin: '2px 0 0' }}>{opp.qualitySpec}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: colors.textSec }}>Payment: {opp.paymentTerms}</span>
                    {opp.status === 'OPEN' && (
                      <button onClick={(e) => { e.stopPropagation(); setShowQuoteModal(true); }} style={{ ...glass.btnPrimary, padding: '6px 14px', fontSize: '11px' }}>Submit Quote</button>
                    )}
                    {opp.status === 'QUOTED' && (
                      <span style={getBadgeStyle('info')}>Quote Submitted</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ORDERS VIEW */}
          {activeView === 'orders' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ ...typography.h3 }}>All Orders</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['all', 'active', 'completed'].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(filterStatus === f ? { background: colors.navy, color: 'white' } : { background: '#F3F4F6', color: colors.textSec }) }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                  ))}
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Transaction', 'Buyer', 'Commodity', 'Quantity', 'Value', 'Stage', 'Compliance', 'Inspection', 'Financing', 'Shipment', 'Payment', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockExportOrders.map(order => (
                    <tr key={order.id} onClick={() => setSelectedOrder(order.id)} style={{ cursor: 'pointer', background: selectedOrder === order.id ? '#FFFBEB' : 'white', borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px' }}><span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{order.masarId}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{order.buyerName}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{order.commodity}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{order.quantity}</td>
                      <td style={{ padding: '12px', fontSize: '12px', fontWeight: 600 }}>{formatCurrency(order.contractValue)}</td>
                      <td style={{ padding: '12px' }}><span style={{ ...getBadgeStyle('info'), color: getStatusColor(order.status) }}>{order.currentStage}</span></td>
                      <td style={{ padding: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '30px', height: '3px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${order.complianceReadiness}%`, height: '100%', background: order.complianceReadiness >= 75 ? colors.green : colors.amber, borderRadius: '2px' }} /></div><span style={{ fontSize: '10px', fontWeight: 600 }}>{order.complianceReadiness}%</span></div></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(order.inspectionStatus === 'Passed' ? 'success' : order.inspectionStatus === 'Scheduled' ? 'warning' : 'neutral')}>{order.inspectionStatus}</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(order.financingStatus === 'Approved' ? 'success' : order.financingStatus === 'Pending' ? 'warning' : 'neutral')}>{order.financingStatus}</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(order.shipmentStatus === 'In Transit' ? 'info' : order.shipmentStatus === 'Delivered' ? 'success' : 'neutral')}>{order.shipmentStatus}</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(order.paymentStatus === 'Settled' ? 'success' : order.paymentStatus === 'Pending' ? 'warning' : 'neutral')}>{order.paymentStatus}</span></td>
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
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ ...typography.h3 }}>Export Documents</h3>
                <button style={{ ...glass.btnPrimary, padding: '6px 14px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}><Upload size={12} /> Upload Document</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Document', 'Category', 'Document #', 'Status', 'Issue Date', 'Expiry Date', 'Verified By', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockExportDocuments.map(doc => (
                    <tr key={doc.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileCheck size={16} color={doc.status === 'valid' ? colors.green : doc.status === 'expiring' ? colors.amber : colors.red} /><div><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{doc.name}</p><p style={{ fontSize: '10px', color: colors.textMuted, margin: 0 }}>{doc.nameAr}</p></div></div></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(doc.category === 'cac' ? 'info' : doc.category === 'nepc' ? 'success' : doc.category === 'quality' ? 'warning' : 'neutral')}>{doc.category.toUpperCase()}</span></td>
                      <td style={{ padding: '12px', fontSize: '11px', fontFamily: 'monospace', color: colors.text }}>{doc.documentNumber}</td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(doc.status === 'valid' ? 'success' : doc.status === 'expiring' ? 'warning' : 'danger')}>{doc.status}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{doc.issueDate}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: doc.expiryDate && new Date(doc.expiryDate) < new Date(Date.now() + 90*24*60*60*1000) ? colors.amber : colors.textSec }}>{doc.expiryDate || '—'}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{doc.verifiedBy || '—'}</td>
                      <td style={{ padding: '12px' }}><button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Eye size={12} color={colors.textSec} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* FINANCING VIEW */}
          {activeView === 'financing' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'TOTAL REQUESTED', value: formatCurrency(mockFinancing.reduce((sum, f) => sum + f.requestedAmount, 0)), icon: FileText, color: colors.blue },
                  { label: 'APPROVED', value: formatCurrency(mockFinancing.filter(f => f.status === 'APPROVED').reduce((sum, f) => sum + f.requestedAmount, 0)), icon: CheckCircle, color: colors.green },
                  { label: 'PENDING', value: formatCurrency(mockFinancing.filter(f => f.status === 'SUBMITTED' || f.status === 'UNDER_REVIEW').reduce((sum, f) => sum + f.requestedAmount, 0)), icon: Clock, color: colors.amber },
                  { label: 'DISBURSED', value: '$0', icon: Banknote, color: colors.gold },
                ].map((kpi, idx) => (
                  <div key={idx} style={{ ...glass.card, padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ ...typography.label }}>{kpi.label}</span>
                      <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: `${kpi.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><kpi.icon size={12} color={kpi.color} /></div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: colors.text }}>{kpi.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
                {mockFinancing.map(fin => (
                  <div key={fin.id} style={{ ...glass.card, padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{fin.masarId}</span>
                        <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>Partner: {fin.capitalPartner}</p>
                      </div>
                      <span style={getBadgeStyle(fin.status === 'APPROVED' ? 'success' : fin.status === 'DECLINED' ? 'danger' : 'warning')}>{fin.status}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: colors.textMuted }}>Invoice</span><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{formatCurrency(fin.invoiceValue)}</p></div>
                      <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: colors.textMuted }}>Advance</span><p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{fin.requestedAdvance}%</p></div>
                      <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: colors.textMuted }}>Amount</span><p style={{ fontSize: '12px', fontWeight: 700, color: colors.gold, margin: 0 }}>{formatCurrency(fin.requestedAmount)}</p></div>
                    </div>
                    {fin.status === 'DRAFT' && (
                      <button onClick={() => setShowFinanceModal(true)} style={{ ...glass.btnPrimary, width: '100%', padding: '10px', fontSize: '12px' }}>Submit Request</button>
                    )}
                    {fin.status === 'APPROVED' && (
                      <div style={{ padding: '10px', background: colors.greenLight, borderRadius: '6px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: colors.green, margin: 0 }}>Approved on {fin.approvedDate}</p>
                        <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>{fin.interestRate}% · {fin.tenor} days</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PERFORMANCE VIEW */}
          {activeView === 'performance' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {mockPerformance.map((metric, idx) => (
                <div key={idx} style={{ ...glass.card, padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{metric.label}</span>
                    <span style={getBadgeStyle(metric.status === 'excellent' ? 'success' : metric.status === 'good' ? 'info' : 'warning')}>{metric.status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: colors.text }}>{metric.value}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {metric.trend === 'up' ? <ArrowUpRight size={14} color={colors.green} /> : metric.trend === 'down' ? <ArrowDownRight size={14} color={colors.red} /> : null}
                      <span style={{ fontSize: '12px', color: metric.trend === 'up' ? colors.green : metric.trend === 'down' ? colors.red : colors.textMuted }}>{metric.change}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: colors.textMuted }}>
                    <span>Target: {metric.target}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other Views */}
          {!['overview', 'opportunities', 'orders', 'documents', 'financing', 'performance'].includes(activeView) && (
            <div style={{ ...glass.card, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${colors.green}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {activeView === 'rfqs' && <MessageSquare size={28} color={colors.green} />}
                {activeView === 'compliance' && <Shield size={28} color={colors.green} />}
                {activeView === 'inspections' && <Search size={28} color={colors.green} />}
                {activeView === 'shipments' && <Ship size={28} color={colors.green} />}
                {activeView === 'payments' && <Banknote size={28} color={colors.green} />}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>
                {activeView === 'rfqs' && 'RFQs'}
                {activeView === 'compliance' && 'Compliance'}
                {activeView === 'inspections' && 'Inspections'}
                {activeView === 'shipments' && 'Shipments'}
                {activeView === 'payments' && 'Payments'}
              </h2>
              <p style={{ fontSize: '14px', color: colors.textSec, maxWidth: '500px', margin: '0 auto 24px' }}>
                {activeView === 'rfqs' && 'View and respond to RFQs from Saudi buyers.'}
                {activeView === 'compliance' && 'Track compliance readiness for your orders.'}
                {activeView === 'inspections' && 'Monitor inspection status and results.'}
                {activeView === 'shipments' && 'Track shipments from warehouse to destination.'}
                {activeView === 'payments' && 'View payment history and pending settlements.'}
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
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Exporter Portal · {exporter.tradingName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Trust Score: <span style={{ color: colors.gold, fontWeight: 600 }}>{exporter.trustScore}/100</span></span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Last Sync: {new Date().toLocaleTimeString()}</span>
          </div>
        </footer>
      </div>

      {/* Submit Quote Modal */}
      {showQuoteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>Submit Quote</h2>
              <button onClick={() => setShowQuoteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={colors.textSec} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Price per MT (USD)</label>
                <input type="number" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} placeholder="e.g., 1,850" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Available Quantity</label>
                <input type="text" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} placeholder="e.g., 1,000 MT" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Delivery Timeline</label>
                <input type="text" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} placeholder="e.g., 30 days from contract" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Notes</label>
                <textarea style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px', resize: 'vertical' }} rows={3} placeholder="Additional information..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setShowQuoteModal(false)} style={{ ...glass.btnOutline, padding: '10px 20px', fontSize: '13px' }}>Cancel</button>
                <button onClick={() => { setShowQuoteModal(false); setActiveView('opportunities'); }} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Submit Quote</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Financing Modal */}
      {showFinanceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>Request Financing</h2>
              <button onClick={() => setShowFinanceModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={colors.textSec} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Transaction</label>
                <select style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }}>
                  {activeOrders.map(o => <option key={o.id} value={o.id}>{o.masarId} — {formatCurrency(o.contractValue)}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Advance Rate (%)</label>
                <input type="number" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} placeholder="e.g., 80" max={90} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setShowFinanceModal(false)} style={{ ...glass.btnOutline, padding: '10px 20px', fontSize: '13px' }}>Cancel</button>
                <button onClick={() => { setShowFinanceModal(false); setActiveView('financing'); }} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Submit Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
