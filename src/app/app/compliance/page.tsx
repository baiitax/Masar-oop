'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Shield, BadgeCheck, AlertTriangle, FileText, Target, CheckCircle, 
  Eye, Clock, Search, Filter, RefreshCw, Download, Plus, ChevronRight,
  Users, Truck, Building2, MapPin, Calendar, Star, TrendingUp,
  BarChart3, Banknote, Anchor, Globe, Bell, Languages, ChevronDown,
  LogOut, Loader2, X, Upload, Check, XCircle, AlertCircle, Info,
  FileCheck, ClipboardCheck, ShieldCheck, KeyRound, Scale, Lock,
  Activity, Package, Receipt, Settings, Database, Server
} from 'lucide-react';
import { 
  mockTransactions, mockBuyers, mockExporters, mockTasks, mockNotifications,
  formatCurrency, getStatusColor, getRiskColor, getPriorityColor,
  calculateDashboardStats, Transaction, Task, Buyer, Exporter
} from '@/lib/store';
import { colors, glass, typography, getBadgeStyle, animations } from '@/lib/design';
import RoleSidebar from '@/components/dashboard/RoleSidebar';

// Compliance-specific types
interface ComplianceDocument {
  id: string;
  name: string;
  nameAr: string;
  category: 'export' | 'saudi';
  status: 'complete' | 'pending' | 'missing' | 'expired' | 'review';
  required: boolean;
  transactionId?: string;
  dueDate?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  expiryDate?: string;
}

interface KYBRecord {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'buyer' | 'exporter';
  country: string;
  registrationNumber: string;
  status: 'APPLICATION' | 'PENDING_DOCUMENTS' | 'KYB_REVIEW' | 'UBO_REVIEW' | 'SANCTIONS_SCREENING' | 'COMMERCIAL_REVIEW' | 'APPROVED' | 'RESTRICTED' | 'REJECTED';
  sanctionsStatus: 'CLEAR' | 'HIT' | 'PENDING';
  pepStatus: 'CLEAR' | 'HIT' | 'PENDING';
  adverseMedia: 'CLEAR' | 'HIT' | 'PENDING';
  ownershipVerified: boolean;
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  notes?: string;
}

interface ClearanceScore {
  transactionId: string;
  masarId: string;
  total: number;
  counterparty: number;
  documentation: number;
  quality: number;
  saudiImport: number;
  contract: number;
  status: 'READY' | 'CONDITIONAL' | 'AT_RISK' | 'NOT_READY';
}

// Mock compliance data
const mockDocuments: ComplianceDocument[] = [
  { id: 'doc-001', name: 'Certificate of Origin', nameAr: 'شهادة المنشأ', category: 'export', status: 'complete', required: true, transactionId: 'txn-001', verifiedBy: 'Compliance Officer', verifiedDate: '2026-07-26', expiryDate: '2027-01-25' },
  { id: 'doc-002', name: 'Phytosanitary Certificate', nameAr: 'شهادة الصحة النباتية', category: 'export', status: 'complete', required: true, transactionId: 'txn-001', verifiedBy: 'Compliance Officer', verifiedDate: '2026-07-29', expiryDate: '2026-10-28' },
  { id: 'doc-003', name: 'Certificate of Analysis', nameAr: 'شهادة التحليل', category: 'export', status: 'complete', required: true, transactionId: 'txn-001', verifiedBy: 'Compliance Officer', verifiedDate: '2026-08-03', expiryDate: '2027-02-02' },
  { id: 'doc-004', name: 'Commercial Invoice', nameAr: 'الفاتورة التجارية', category: 'export', status: 'complete', required: true, transactionId: 'txn-001', verifiedBy: 'Operations Manager', verifiedDate: '2026-07-21' },
  { id: 'doc-005', name: 'Packing List', nameAr: 'قائمة التعبئة', category: 'export', status: 'complete', required: true, transactionId: 'txn-001', verifiedBy: 'Operations Manager', verifiedDate: '2026-08-11' },
  { id: 'doc-006', name: 'SFDA Requirements', nameAr: 'متطلبات هيئة الغذاء والدواء', category: 'saudi', status: 'pending', required: true, transactionId: 'txn-002', dueDate: '2026-09-05' },
  { id: 'doc-007', name: 'Arabic Labelling', nameAr: 'التسمية العربية', category: 'saudi', status: 'complete', required: true, transactionId: 'txn-001' },
  { id: 'doc-008', name: 'Halal Documentation', nameAr: 'وثائق الحلال', category: 'saudi', status: 'complete', required: false, transactionId: 'txn-001' },
  { id: 'doc-009', name: 'ZATCA E-Invoicing', nameAr: 'فاتورة هيئة الزكاة', category: 'saudi', status: 'pending', required: true, transactionId: 'txn-002' },
  { id: 'doc-010', name: 'Import Documentation', nameAr: 'وثائق الاستيراد', category: 'saudi', status: 'complete', required: true, transactionId: 'txn-001' },
  { id: 'doc-011', name: 'Certificate of Origin', nameAr: 'شهادة المنشأ', category: 'export', status: 'expired', required: true, transactionId: 'txn-002', expiryDate: '2026-08-20' },
  { id: 'doc-012', name: 'Laboratory COA', nameAr: 'شهادة المختبر', category: 'export', status: 'missing', required: true, transactionId: 'txn-003' },
];

const mockKYB: KYBRecord[] = [
  { id: 'kyb-001', entityId: 'buyer-001', entityName: 'Al Rajhi Foods', entityType: 'buyer', country: 'Saudi Arabia', registrationNumber: 'CR-1010123456', status: 'APPROVED', sanctionsStatus: 'CLEAR', pepStatus: 'CLEAR', adverseMedia: 'CLEAR', ownershipVerified: true, submittedDate: '2026-06-01', reviewedBy: 'Compliance Officer', reviewedDate: '2026-07-15' },
  { id: 'kyb-002', entityId: 'buyer-002', entityName: 'SGT Foods', entityType: 'buyer', country: 'Saudi Arabia', registrationNumber: 'CR-1010789012', status: 'APPROVED', sanctionsStatus: 'CLEAR', pepStatus: 'CLEAR', adverseMedia: 'CLEAR', ownershipVerified: true, submittedDate: '2026-06-15', reviewedBy: 'Compliance Officer', reviewedDate: '2026-07-20' },
  { id: 'kyb-003', entityId: 'buyer-003', entityName: 'JPF', entityType: 'buyer', country: 'Saudi Arabia', registrationNumber: 'CR-1010456789', status: 'KYB_REVIEW', sanctionsStatus: 'CLEAR', pepStatus: 'PENDING', adverseMedia: 'CLEAR', ownershipVerified: false, submittedDate: '2026-08-01' },
  { id: 'kyb-004', entityId: 'exp-001', entityName: 'Dangote Sesame', entityType: 'exporter', country: 'Nigeria', registrationNumber: 'RC-1234567', status: 'APPROVED', sanctionsStatus: 'CLEAR', pepStatus: 'CLEAR', adverseMedia: 'CLEAR', ownershipVerified: true, submittedDate: '2026-05-15', reviewedBy: 'Compliance Officer', reviewedDate: '2026-06-01' },
  { id: 'kyb-005', entityId: 'exp-002', entityName: 'NPG Exports', entityType: 'exporter', country: 'Nigeria', registrationNumber: 'RC-7654321', status: 'APPROVED', sanctionsStatus: 'CLEAR', pepStatus: 'CLEAR', adverseMedia: 'CLEAR', ownershipVerified: true, submittedDate: '2026-06-01', reviewedBy: 'Compliance Officer', reviewedDate: '2026-06-15' },
  { id: 'kyb-006', entityId: 'exp-003', entityName: 'Kano Sesame Union', entityType: 'exporter', country: 'Nigeria', registrationNumber: 'RC-9876543', status: 'PENDING_DOCUMENTS', sanctionsStatus: 'PENDING', pepStatus: 'PENDING', adverseMedia: 'PENDING', ownershipVerified: false, submittedDate: '2026-08-10' },
];

const mockClearanceScores: ClearanceScore[] = [
  { transactionId: 'txn-001', masarId: 'MASAR-SES-2026-000001', total: 94, counterparty: 96, documentation: 92, quality: 98, saudiImport: 91, contract: 100, status: 'READY' },
  { transactionId: 'txn-002', masarId: 'MASAR-SES-2026-000002', total: 72, counterparty: 85, documentation: 68, quality: 75, saudiImport: 60, contract: 100, status: 'CONDITIONAL' },
  { transactionId: 'txn-003', masarId: 'MASAR-SES-2026-000003', total: 58, counterparty: 78, documentation: 45, quality: 50, saudiImport: 40, contract: 100, status: 'AT_RISK' },
  { transactionId: 'txn-004', masarId: 'MASAR-SES-2026-000004', total: 42, counterparty: 90, documentation: 30, quality: 0, saudiImport: 20, contract: 100, status: 'NOT_READY' },
];

export default function ComplianceDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'kyb' | 'sanctions' | 'documents' | 'clearance' | 'sfda' | 'zatca' | 'exceptions' | 'evidence' | 'audit'>('overview');
  const [selectedKYB, setSelectedKYB] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = calculateDashboardStats(mockTransactions);
  const pendingKYB = mockKYB.filter(k => !['APPROVED', 'REJECTED'].includes(k.status));
  const approvedKYB = mockKYB.filter(k => k.status === 'APPROVED');
  const sanctionsHits = mockKYB.filter(k => k.sanctionsStatus === 'HIT');
  const pendingDocs = mockDocuments.filter(d => d.status === 'pending' || d.status === 'missing');
  const expiredDocs = mockDocuments.filter(d => d.status === 'expired');
  const readyTransactions = mockClearanceScores.filter(c => c.status === 'READY');
  const unreadNotifs = mockNotifications.filter(n => !n.read);

  useEffect(() => {
    const role = localStorage.getItem('masar-role');
    if (!role) { router.push('/auth'); return; }
    setTimeout(() => setLoading(false), 800);
  }, [router]);

  const filteredKYB = filterStatus === 'all' ? mockKYB :
    filterStatus === 'pending' ? pendingKYB :
    filterStatus === 'approved' ? approvedKYB :
    mockKYB.filter(k => k.status === filterStatus.toUpperCase());

  const filteredDocs = filterStatus === 'all' ? mockDocuments :
    filterStatus === 'pending' ? pendingDocs :
    filterStatus === 'expired' ? expiredDocs :
    mockDocuments.filter(d => d.status === filterStatus);

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
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.gold, letterSpacing: '0.1em' }}>MASAR COMPLIANCE</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Loading compliance center...</p>
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
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search KYB, documents, compliance..." style={{ ...glass.input, width: '100%', padding: '8px 12px 8px 36px', fontSize: '13px', color: colors.text, outline: 'none' }} />
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
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${colors.green}, #34D399)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>CO</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>Compliance Officer</p>
                <p style={{ fontSize: '10px', color: colors.textSec, margin: 0 }}>KSA Compliance</p>
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
                <Shield size={18} color={colors.green} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: colors.green, letterSpacing: '0.08em' }}>COMPLIANCE COMMAND CENTER</span>
              </div>
              <h1 style={{ ...typography.h1, marginBottom: '2px' }}>Compliance Overview</h1>
              <p style={{ ...typography.small }}>KSA Compliance · Nigeria → Saudi Arabia · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...glass.btnOutline, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={13} /> Refresh</button>
              <button style={{ ...glass.btnPrimary, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={13} /> Export Report</button>
            </div>
          </div>

          {/* View Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', background: '#E5E7EB', borderRadius: '10px', width: 'fit-content', overflowX: 'auto' }}>
            {([
              { id: 'overview', label: 'Overview', icon: Shield },
              { id: 'kyb', label: 'KYB / KYC', icon: BadgeCheck },
              { id: 'sanctions', label: 'Sanctions', icon: AlertTriangle },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'clearance', label: 'Clearance', icon: Target },
              { id: 'sfda', label: 'SFDA', icon: CheckCircle },
              { id: 'zatca', label: 'ZATCA', icon: Receipt },
              { id: 'exceptions', label: 'Exceptions', icon: AlertTriangle },
              { id: 'evidence', label: 'Evidence', icon: Shield },
              { id: 'audit', label: 'Audit', icon: History },
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
                  { label: 'PENDING KYB', value: String(pendingKYB.length), icon: Clock, color: colors.amber, action: () => setActiveView('kyb') },
                  { label: 'SANCTIONS HITS', value: String(sanctionsHits.length), icon: AlertTriangle, color: colors.red, action: () => setActiveView('sanctions') },
                  { label: 'DOCS PENDING', value: String(pendingDocs.length), icon: FileText, color: colors.blue, action: () => setActiveView('documents') },
                  { label: 'DOCS EXPIRING', value: String(expiredDocs.length), icon: AlertTriangle, color: colors.amber, action: () => setActiveView('documents') },
                  { label: 'CLEARANCE READY', value: String(readyTransactions.length), icon: CheckCircle, color: colors.green, action: () => setActiveView('clearance') },
                  { label: 'AT RISK', value: String(mockClearanceScores.filter(c => c.status === 'AT_RISK' || c.status === 'NOT_READY').length), icon: AlertTriangle, color: colors.red, action: () => setActiveView('clearance') },
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

              {/* Clearance Overview + Compliance Exceptions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {/* Clearance Overview */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Clearance Readiness Overview</h3>
                    <button onClick={() => setActiveView('clearance')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: `conic-gradient(${colors.green} 0deg, ${colors.green} 338deg, #E5E7EB 338deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '28px', fontWeight: 800, color: colors.text }}>94</span>
                          <span style={{ fontSize: '8px', fontWeight: 600, color: colors.green, letterSpacing: '0.08em' }}>READY</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '11px', color: colors.textMuted, marginTop: '8px' }}>Average Clearance Score</p>
                    </div>
                    {mockClearanceScores.map((score, idx) => (
                      <div key={idx} onClick={() => setActiveView('clearance')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: idx < mockClearanceScores.length - 1 ? `1px solid ${colors.borderLight}` : 'none', cursor: 'pointer' }}>
                        <span style={{ fontSize: '12px', fontFamily: 'monospace', color: colors.text }}>{score.masarId}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '60px', height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${score.total}%`, height: '100%', background: score.total >= 75 ? colors.green : score.total >= 50 ? colors.amber : colors.red, borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: score.total >= 75 ? colors.green : score.total >= 50 ? colors.amber : colors.red }}>{score.total}</span>
                          <span style={getBadgeStyle(score.status === 'READY' ? 'success' : score.status === 'CONDITIONAL' ? 'warning' : 'danger')}>{score.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Exceptions */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Compliance Exceptions</h3>
                    <button onClick={() => setActiveView('exceptions')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {[
                      { priority: 'Critical', txn: 'MASAR-SES-2026-000003', issue: 'Laboratory COA not yet received', owner: 'Nigeria Operations', deadline: '2026-08-28', status: 'Open' },
                      { priority: 'High', txn: 'MASAR-SES-2026-000002', issue: 'Phytosanitary certificate expires in 5 days', owner: 'Compliance Officer', deadline: '2026-08-27', status: 'Open' },
                      { priority: 'Medium', txn: 'MASAR-SES-2026-000003', issue: 'SFDA product registration pending', owner: 'KSA Compliance', deadline: '2026-09-05', status: 'Pending' },
                    ].map((exc, idx) => (
                      <div key={idx} style={{ padding: '12px', borderLeft: `3px solid ${exc.priority === 'Critical' ? colors.red : exc.priority === 'High' ? '#F97316' : colors.amber}`, background: exc.priority === 'Critical' ? colors.redLight : exc.priority === 'High' ? '#FFF7ED' : colors.amberLight, borderRadius: '0 8px 8px 0', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textMuted, fontFamily: 'monospace' }}>{exc.txn}</span>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: '2px 0' }}>{exc.issue}</p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                              <span style={{ fontSize: '10px', color: colors.textMuted }}>Owner: {exc.owner}</span>
                              <span style={{ fontSize: '10px', color: colors.textMuted }}>Due: {exc.deadline}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <span style={getBadgeStyle(exc.priority === 'Critical' ? 'danger' : 'warning')}>{exc.priority}</span>
                            <button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px', fontSize: '10px' }}>Resolve</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent KYB + Document Status */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
                {/* Recent KYB */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Recent KYB Activity</h3>
                    <button onClick={() => setActiveView('kyb')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  {mockKYB.slice(0, 4).map((kyb, idx) => (
                    <div key={kyb.id} onClick={() => { setSelectedKYB(kyb.id); setActiveView('kyb'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: idx < 3 ? `1px solid ${colors.border}` : 'none', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: kyb.entityType === 'buyer' ? colors.blueLight : colors.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {kyb.entityType === 'buyer' ? <Building2 size={16} color={colors.blue} /> : <Truck size={16} color={colors.green} />}
                        </div>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text, margin: 0 }}>{kyb.entityName}</p>
                          <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>{kyb.country} · {kyb.entityType}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <span style={getBadgeStyle(kyb.sanctionsStatus === 'CLEAR' ? 'success' : 'danger')}>Sanctions: {kyb.sanctionsStatus}</span>
                          <span style={getBadgeStyle(kyb.pepStatus === 'CLEAR' ? 'success' : 'warning')}>PEP: {kyb.pepStatus}</span>
                        </div>
                        <span style={getBadgeStyle(kyb.status === 'APPROVED' ? 'success' : kyb.status === 'REJECTED' ? 'danger' : 'warning')}>{kyb.status.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Document Status */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Document Status</h3>
                    <button onClick={() => setActiveView('documents')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                      {[
                        { label: 'Complete', value: mockDocuments.filter(d => d.status === 'complete').length, color: colors.green, icon: CheckCircle },
                        { label: 'Pending', value: pendingDocs.length, color: colors.amber, icon: Clock },
                        { label: 'Expired', value: expiredDocs.length, color: colors.red, icon: AlertTriangle },
                        { label: 'Missing', value: mockDocuments.filter(d => d.status === 'missing').length, color: colors.red, icon: XCircle },
                      ].map((stat, idx) => (
                        <div key={idx} style={{ padding: '12px', background: `${stat.color}08`, borderRadius: '8px', border: `1px solid ${stat.color}20` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <stat.icon size={14} color={stat.color} />
                            <span style={{ fontSize: '11px', color: colors.textSec }}>{stat.label}</span>
                          </div>
                          <p style={{ fontSize: '20px', fontWeight: 800, color: stat.color, margin: 0 }}>{stat.value}</p>
                        </div>
                      ))}
                    </div>
                    {mockDocuments.filter(d => d.status !== 'complete').slice(0, 4).map((doc, idx) => (
                      <div key={doc.id} onClick={() => { setSelectedDoc(doc.id); setActiveView('documents'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < 3 ? `1px solid ${colors.borderLight}` : 'none', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileCheck size={14} color={doc.status === 'pending' ? colors.amber : doc.status === 'expired' ? colors.red : colors.red} />
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{doc.name}</p>
                            <p style={{ fontSize: '10px', color: colors.textMuted, margin: 0 }}>{doc.transactionId}</p>
                          </div>
                        </div>
                        <span style={getBadgeStyle(doc.status === 'pending' ? 'warning' : 'danger')}>{doc.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* KYB VIEW */}
          {activeView === 'kyb' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ ...typography.h3 }}>KYB / KYC Workspace</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['all', 'pending', 'approved', 'review'].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(filterStatus === f ? { background: colors.navy, color: 'white' } : { background: '#F3F4F6', color: colors.textSec }) }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                  ))}
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Entity', 'Type', 'Country', 'Registration', 'Sanctions', 'PEP', 'Adverse Media', 'Ownership', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredKYB.map(kyb => (
                    <tr key={kyb.id} onClick={() => setSelectedKYB(kyb.id)} style={{ cursor: 'pointer', background: selectedKYB === kyb.id ? '#FFFBEB' : 'white', borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: kyb.entityType === 'buyer' ? colors.blueLight : colors.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {kyb.entityType === 'buyer' ? <Building2 size={14} color={colors.blue} /> : <Truck size={14} color={colors.green} />}
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{kyb.entityName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{kyb.entityType}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{kyb.country}</td>
                      <td style={{ padding: '12px', fontSize: '11px', fontFamily: 'monospace', color: colors.text }}>{kyb.registrationNumber}</td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(kyb.sanctionsStatus === 'CLEAR' ? 'success' : kyb.sanctionsStatus === 'HIT' ? 'danger' : 'warning')}>{kyb.sanctionsStatus}</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(kyb.pepStatus === 'CLEAR' ? 'success' : kyb.pepStatus === 'HIT' ? 'danger' : 'warning')}>{kyb.pepStatus}</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(kyb.adverseMedia === 'CLEAR' ? 'success' : kyb.adverseMedia === 'HIT' ? 'danger' : 'warning')}>{kyb.adverseMedia}</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(kyb.ownershipVerified ? 'success' : 'warning')}>{kyb.ownershipVerified ? 'Verified' : 'Pending'}</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(kyb.status === 'APPROVED' ? 'success' : kyb.status === 'REJECTED' ? 'danger' : 'warning')}>{kyb.status.replace(/_/g, ' ')}</span></td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {kyb.status !== 'APPROVED' && kyb.status !== 'REJECTED' && (
                            <>
                              <button style={{ padding: '4px 8px', background: colors.greenLight, border: `1px solid ${colors.green}30`, borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: colors.green, cursor: 'pointer' }}>Approve</button>
                              <button style={{ padding: '4px 8px', background: colors.redLight, border: `1px solid ${colors.red}30`, borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: colors.red, cursor: 'pointer' }}>Reject</button>
                            </>
                          )}
                          <button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px', cursor: 'pointer' }}><Eye size={10} color={colors.textSec} /></button>
                        </div>
                      </td>
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
                <h3 style={{ ...typography.h3 }}>Document Review</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['all', 'complete', 'pending', 'expired', 'missing'].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(filterStatus === f ? { background: colors.navy, color: 'white' } : { background: '#F3F4F6', color: colors.textSec }) }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                  ))}
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Document', 'Category', 'Transaction', 'Status', 'Verified By', 'Expiry', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredDocs.map(doc => (
                    <tr key={doc.id} onClick={() => setSelectedDoc(doc.id)} style={{ cursor: 'pointer', background: selectedDoc === doc.id ? '#FFFBEB' : 'white', borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileCheck size={16} color={doc.status === 'complete' ? colors.green : doc.status === 'expired' ? colors.red : colors.amber} />
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{doc.name}</p>
                            <p style={{ fontSize: '10px', color: colors.textMuted, margin: 0 }}>{doc.nameAr}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(doc.category === 'export' ? 'info' : 'warning')}>{doc.category}</span></td>
                      <td style={{ padding: '12px', fontSize: '11px', fontFamily: 'monospace', color: colors.text }}>{doc.transactionId}</td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(doc.status === 'complete' ? 'success' : doc.status === 'expired' ? 'danger' : doc.status === 'missing' ? 'danger' : 'warning')}>{doc.status}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{doc.verifiedBy || '—'}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: doc.expiryDate && new Date(doc.expiryDate) < new Date(Date.now() + 30*24*60*60*1000) ? colors.red : colors.textSec }}>{doc.expiryDate || '—'}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {doc.status !== 'complete' && (
                            <button style={{ padding: '4px 8px', background: colors.greenLight, border: `1px solid ${colors.green}30`, borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: colors.green, cursor: 'pointer' }}>Verify</button>
                          )}
                          <button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px', cursor: 'pointer' }}><Eye size={10} color={colors.textSec} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CLEARANCE VIEW */}
          {activeView === 'clearance' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
              {mockClearanceScores.map(score => {
                const txn = mockTransactions.find(t => t.id === score.transactionId);
                return (
                  <div key={score.transactionId} style={{ ...glass.card, padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{score.masarId}</span>
                        <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>{txn?.buyerName} → {txn?.exporterName}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `conic-gradient(${score.total >= 75 ? colors.green : score.total >= 50 ? colors.amber : colors.red} 0deg, ${score.total >= 75 ? colors.green : score.total >= 50 ? colors.amber : colors.red} ${score.total * 3.6}deg, #E5E7EB ${score.total * 3.6}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '18px', fontWeight: 800, color: colors.text }}>{score.total}</span>
                          </div>
                        </div>
                        <span style={getBadgeStyle(score.status === 'READY' ? 'success' : score.status === 'CONDITIONAL' ? 'warning' : 'danger')}>{score.status}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { label: 'Counterparty', value: score.counterparty, max: 100 },
                        { label: 'Documentation', value: score.documentation, max: 100 },
                        { label: 'Quality', value: score.quality, max: 100 },
                        { label: 'Saudi Import', value: score.saudiImport, max: 100 },
                        { label: 'Contract', value: score.contract, max: 100 },
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span style={{ fontSize: '11px', color: colors.textSec }}>{item.label}</span>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: colors.text }}>{item.value}%</span>
                          </div>
                          <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${item.value}%`, height: '100%', background: item.value >= 80 ? colors.green : item.value >= 60 ? colors.amber : colors.red, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Other Views */}
          {!['overview', 'kyb', 'documents', 'clearance'].includes(activeView) && (
            <div style={{ ...glass.card, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: `${colors.green}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {activeView === 'sanctions' && <AlertTriangle size={28} color={colors.green} />}
                {activeView === 'sfda' && <CheckCircle size={28} color={colors.green} />}
                {activeView === 'zatca' && <Receipt size={28} color={colors.green} />}
                {activeView === 'exceptions' && <AlertTriangle size={28} color={colors.green} />}
                {activeView === 'evidence' && <Shield size={28} color={colors.green} />}
                {activeView === 'audit' && <History size={28} color={colors.green} />}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>
                {activeView === 'sanctions' && 'Sanctions Screening'}
                {activeView === 'sfda' && 'SFDA Workflow'}
                {activeView === 'zatca' && 'ZATCA Workflow'}
                {activeView === 'exceptions' && 'Compliance Exceptions'}
                {activeView === 'evidence' && 'Regulatory Evidence'}
                {activeView === 'audit' && 'Audit History'}
              </h2>
              <p style={{ fontSize: '14px', color: colors.textSec, maxWidth: '500px', margin: '0 auto 24px' }}>
                {activeView === 'sanctions' && 'Automated sanctions screening against OFAC, EU, and UN lists.'}
                {activeView === 'sfda' && 'Saudi Food and Drug Authority product registration workflow.'}
                {activeView === 'zatca' && 'ZATCA e-invoicing compliance for Saudi transactions.'}
                {activeView === 'exceptions' && 'Manage compliance exceptions and resolution workflows.'}
                {activeView === 'evidence' && 'Regulatory evidence repository for audits.'}
                {activeView === 'audit' && 'Complete audit history of all compliance actions.'}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => setActiveView('overview')} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Back to Overview</button>
                <Link href="/dashboard/compliance" style={{ ...glass.btnOutline, padding: '10px 20px', fontSize: '13px', textDecoration: 'none' }}>Legacy Dashboard</Link>
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
