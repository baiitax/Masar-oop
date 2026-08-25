'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FileText, FolderOpen, Lock, Shield, Eye, 
  CheckCircle, Clock, AlertTriangle, Search, Filter, RefreshCw, 
  Download, ChevronRight, ArrowUpRight, Users, Package, MapPin, 
  Calendar, Star, TrendingUp, BarChart3, Banknote, Anchor, Globe, 
  Bell, Languages, ChevronDown, LogOut, Loader2, X, Building2, 
  Truck, Activity, Target, ArrowRight, Send, Scale, KeyRound,
  Database, Server, History, Hash, UserCheck, FileCheck, 
  ClipboardCheck, BadgeCheck, Receipt, Info, HelpCircle, Cpu
} from 'lucide-react';
import { 
  mockTransactions, mockBuyers, mockExporters, mockNotifications,
  formatCurrency, getStatusColor, getRiskColor, Transaction
} from '@/lib/store';
import { colors, glass, typography, getBadgeStyle } from '@/lib/design';
import RoleSidebar from '@/components/dashboard/RoleSidebar';

// Audit-specific types
interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  details: string;
  previousState?: string;
  newState?: string;
  ipAddress: string;
  documentHash?: string;
  immutable: boolean;
}

interface EvidenceChain {
  transactionId: string;
  masarId: string;
  steps: EvidenceStep[];
}

interface EvidenceStep {
  id: string;
  step: string;
  stepAr: string;
  status: 'complete' | 'active' | 'pending';
  evidence: string;
  evidenceType: string;
  hash: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

interface AccessLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'blocked';
}

interface ScreeningLog {
  id: string;
  timestamp: string;
  entityId: string;
  entityName: string;
  entityType: 'buyer' | 'exporter';
  screeningType: 'sanctions' | 'pep' | 'adverse_media';
  provider: string;
  result: 'clear' | 'hit' | 'pending';
  details: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

// Mock audit data
const mockAuditEvents: AuditEvent[] = [
  { id: 'audit-001', timestamp: '2026-08-25T14:42:00Z', userId: 'user-001', userName: 'Ahmed Hassan', userRole: 'Compliance Officer', action: 'DOCUMENT_VERIFIED', entityType: 'Document', entityId: 'doc-006', entityName: 'Certificate of Origin', details: 'Certificate of Origin verified for MASAR-SES-2026-000002', ipAddress: '102.89.44.12', documentHash: 'sha256:a1b2c3d4...', immutable: true },
  { id: 'audit-002', timestamp: '2026-08-25T13:15:00Z', userId: 'user-002', userName: 'Fatima Bello', userRole: 'Operations Manager', action: 'STATUS_CHANGE', entityType: 'Transaction', entityId: 'txn-004', entityName: 'MASAR-SES-2026-000004', details: 'Transaction moved to CONTRACT_EXECUTED', previousState: 'COMMERCIAL_AGREEMENT', newState: 'CONTRACT_EXECUTED', ipAddress: '102.89.44.15', immutable: true },
  { id: 'audit-003', timestamp: '2026-08-25T11:45:00Z', userId: 'user-003', userName: 'Ibrahim Musa', userRole: 'Nigeria Origin Manager', action: 'DOCUMENT_UPLOADED', entityType: 'Document', entityId: 'doc-007', entityName: 'Phytosanitary Certificate', details: 'Phytosanitary Certificate uploaded for MASAR-SES-2026-000002', ipAddress: '102.89.44.20', documentHash: 'sha256:b2c3d4e5...', immutable: true },
  { id: 'audit-004', timestamp: '2026-08-24T16:00:00Z', userId: 'user-001', userName: 'Ahmed Hassan', userRole: 'Compliance Officer', action: 'KYB_APPROVED', entityType: 'Buyer', entityId: 'buyer-002', entityName: 'SGT Foods', details: 'KYB approved for Saudi Gulf Trading Est.', ipAddress: '102.89.44.12', immutable: true },
  { id: 'audit-005', timestamp: '2026-08-24T10:30:00Z', userId: 'user-004', userName: 'Oluwaseun Adeyemi', userRole: 'Finance Manager', action: 'FINANCE_APPROVED', entityType: 'FinanceRequest', entityId: 'fin-001', entityName: 'MASAR-SES-2026-000001', details: 'Finance request approved - $1,480,000', ipAddress: '102.89.44.25', immutable: true },
  { id: 'audit-006', timestamp: '2026-08-23T09:00:00Z', userId: 'system', userName: 'System', userRole: 'System', action: 'ALERT_GENERATED', entityType: 'Transaction', entityId: 'txn-006', entityName: 'MASAR-SES-2026-000006', details: 'CRITICAL: Aflatoxin inspection failure', ipAddress: 'system', immutable: true },
  { id: 'audit-007', timestamp: '2026-08-22T14:00:00Z', userId: 'user-002', userName: 'Fatima Bello', userRole: 'Operations Manager', action: 'CONTRACT_EXECUTED', entityType: 'Transaction', entityId: 'txn-003', entityName: 'MASAR-SES-2026-000003', details: 'Contract executed for MASAR-SES-2026-000003', ipAddress: '102.89.44.15', immutable: true },
  { id: 'audit-008', timestamp: '2026-08-21T11:00:00Z', userId: 'user-003', userName: 'Ibrahim Musa', userRole: 'Nigeria Origin Manager', action: 'INSPECTION_SCHEDULED', entityType: 'Inspection', entityId: 'insp-002', entityName: 'MASAR-SES-2026-000002', details: 'Inspection scheduled with Bureau Veritas', ipAddress: '102.89.44.20', immutable: true },
];

const mockEvidenceChains: EvidenceChain[] = [
  {
    transactionId: 'txn-001',
    masarId: 'MASAR-SES-2026-000001',
    steps: [
      { id: 'ev-001', step: 'Buyer Verification', stepAr: 'توثيق المشتري', status: 'complete', evidence: 'KYB-001', evidenceType: 'KYB Document', hash: 'sha256:7f4c...92ab', timestamp: '2026-07-05T09:15:00Z', actor: 'Ahmed Hassan', actorRole: 'Compliance Officer', verifiedBy: 'Compliance Officer', verifiedDate: '2026-07-05' },
      { id: 'ev-002', step: 'Exporter Verification', stepAr: 'توثيق المصدر', status: 'complete', evidence: 'KYB-002', evidenceType: 'KYB Document', hash: 'sha256:a3b1...45cd', timestamp: '2026-07-08T14:30:00Z', actor: 'Ibrahim Musa', actorRole: 'Origin Manager', verifiedBy: 'Compliance Officer', verifiedDate: '2026-07-08' },
      { id: 'ev-003', step: 'Contract', stepAr: 'العقد', status: 'complete', evidence: 'DOC-0045', evidenceType: 'Contract Document', hash: 'sha256:e8f2...78gh', timestamp: '2026-07-20T11:00:00Z', actor: 'Fatima Bello', actorRole: 'Operations Manager' },
      { id: 'ev-004', step: 'Compliance Pack', stepAr: 'حزمة الامتثال', status: 'complete', evidence: 'DOC-0052', evidenceType: 'Compliance Documents', hash: 'sha256:1c9d...34ef', timestamp: '2026-07-28T16:45:00Z', actor: 'Ahmed Hassan', actorRole: 'Compliance Officer' },
      { id: 'ev-005', step: 'Inspection Report', stepAr: 'تقرير الفحص', status: 'complete', evidence: 'INSP-001', evidenceType: 'Inspection Report', hash: 'sha256:5a7b...90ij', timestamp: '2026-08-05T10:20:00Z', actor: 'SGS Nigeria', actorRole: 'Inspection Partner' },
      { id: 'ev-006', step: 'Finance Approval', stepAr: 'الموافقة المالية', status: 'complete', evidence: 'FIN-001', evidenceType: 'Finance Approval', hash: 'sha256:2d4e...56kl', timestamp: '2026-08-10T09:00:00Z', actor: 'Oluwaseun Adeyemi', actorRole: 'Finance Manager' },
      { id: 'ev-007', step: 'Escrow Confirmation', stepAr: 'تأكيد الضمان', status: 'complete', evidence: 'ESC-001', evidenceType: 'Escrow Confirmation', hash: 'sha256:8f1a...12mn', timestamp: '2026-08-12T14:00:00Z', actor: 'Finance Manager', actorRole: 'Finance Manager' },
      { id: 'ev-008', step: 'Shipment', stepAr: 'الشحن', status: 'active', evidence: 'SHIP-001', evidenceType: 'Shipment Document', hash: 'sha256:3b6c...78op', timestamp: '2026-08-18T08:30:00Z', actor: 'Operations Manager', actorRole: 'Operations Manager' },
      { id: 'ev-009', step: 'Port Verification', stepAr: 'التحقق من الميناء', status: 'pending', evidence: '—', evidenceType: '—', hash: '—', timestamp: '—', actor: '—', actorRole: '—' },
      { id: 'ev-010', step: 'Release', stepAr: 'الإفراج', status: 'pending', evidence: '—', evidenceType: '—', hash: '—', timestamp: '—', actor: '—', actorRole: '—' },
      { id: 'ev-011', step: 'Settlement', stepAr: 'التسوية', status: 'pending', evidence: '—', evidenceType: '—', hash: '—', timestamp: '—', actor: '—', actorRole: '—' },
    ],
  },
];

const mockAccessLogs: AccessLog[] = [
  { id: 'access-001', timestamp: '2026-08-25T14:45:00Z', userId: 'user-001', userName: 'Ahmed Hassan', userRole: 'Compliance Officer', action: 'VIEW', resource: 'Transaction MASAR-SES-2026-000001', ipAddress: '102.89.44.12', userAgent: 'Mozilla/5.0...', status: 'success' },
  { id: 'access-002', timestamp: '2026-08-25T14:30:00Z', userId: 'user-002', userName: 'Fatima Bello', userRole: 'Operations Manager', action: 'UPDATE', resource: 'Transaction MASAR-SES-2026-000004', ipAddress: '102.89.44.15', userAgent: 'Mozilla/5.0...', status: 'success' },
  { id: 'access-003', timestamp: '2026-08-25T14:15:00Z', userId: 'user-005', userName: 'Unknown', userRole: 'Unknown', action: 'LOGIN', resource: 'Authentication', ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0...', status: 'failed' },
  { id: 'access-004', timestamp: '2026-08-25T13:00:00Z', userId: 'user-003', userName: 'Ibrahim Musa', userRole: 'Origin Manager', action: 'UPLOAD', resource: 'Document DOC-007', ipAddress: '102.89.44.20', userAgent: 'Mozilla/5.0...', status: 'success' },
  { id: 'access-005', timestamp: '2026-08-25T12:00:00Z', userId: 'user-004', userName: 'Oluwaseun Adeyemi', userRole: 'Finance Manager', action: 'APPROVE', resource: 'Finance Request FIN-001', ipAddress: '102.89.44.25', userAgent: 'Mozilla/5.0...', status: 'success' },
];

const mockScreeningLogs: ScreeningLog[] = [
  { id: 'screen-001', timestamp: '2026-07-01T10:00:00Z', entityId: 'buyer-001', entityName: 'Al Rajhi Foods', entityType: 'buyer', screeningType: 'sanctions', provider: 'World-Check', result: 'clear', details: 'No matches found', reviewedBy: 'Ahmed Hassan', reviewedDate: '2026-07-01' },
  { id: 'screen-002', timestamp: '2026-07-01T10:05:00Z', entityId: 'buyer-001', entityName: 'Al Rajhi Foods', entityType: 'buyer', screeningType: 'pep', provider: 'World-Check', result: 'clear', details: 'No PEP matches', reviewedBy: 'Ahmed Hassan', reviewedDate: '2026-07-01' },
  { id: 'screen-003', timestamp: '2026-07-01T10:10:00Z', entityId: 'buyer-001', entityName: 'Al Rajhi Foods', entityType: 'buyer', screeningType: 'adverse_media', provider: 'LexisNexis', result: 'clear', details: 'No adverse media found', reviewedBy: 'Ahmed Hassan', reviewedDate: '2026-07-01' },
  { id: 'screen-004', timestamp: '2026-06-15T09:00:00Z', entityId: 'exp-001', entityName: 'Dangote Sesame', entityType: 'exporter', screeningType: 'sanctions', provider: 'World-Check', result: 'clear', details: 'No matches found', reviewedBy: 'Ahmed Hassan', reviewedDate: '2026-06-15' },
  { id: 'screen-005', timestamp: '2026-08-10T11:00:00Z', entityId: 'exp-003', entityName: 'Kano Sesame Union', entityType: 'exporter', screeningType: 'sanctions', provider: 'World-Check', result: 'pending', details: 'Screening in progress' },
];

export default function AuditDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'transactions' | 'documents' | 'releases' | 'screening' | 'access' | 'reports'>('overview');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifs = mockNotifications.filter(n => !n.read);
  const totalEvents = mockAuditEvents.length;
  const todayEvents = mockAuditEvents.filter(e => e.timestamp.startsWith('2026-08-25')).length;
  const criticalEvents = mockAuditEvents.filter(e => e.action.includes('ALERT') || e.action.includes('FAILED')).length;

  useEffect(() => {
    const role = localStorage.getItem('masar-role');
    if (!role) { router.push('/auth'); return; }
    setTimeout(() => setLoading(false), 800);
  }, [router]);

  const filteredEvents = filterType === 'all' ? mockAuditEvents :
    mockAuditEvents.filter(e => e.action.toLowerCase().includes(filterType.toLowerCase()));

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
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.gold, letterSpacing: '0.1em' }}>MASAR AUDIT</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Loading evidence center...</p>
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
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search audit events, transactions, documents..." style={{ ...glass.input, width: '100%', padding: '8px 12px 8px 36px', fontSize: '13px', color: colors.text, outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: colors.greenLight, borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: colors.green, borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: colors.green }}>OPERATIONAL</span>
            </div>
            <div style={{ padding: '4px 8px', background: 'rgba(107,114,128,0.08)', borderRadius: '4px', border: '1px solid rgba(107,114,128,0.15)' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.05em' }}>READ-ONLY</span>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={{ position: 'relative', padding: '6px', ...glass.btnOutline, borderRadius: '8px' }}>
                <Bell size={18} color={colors.textSec} />
                {unreadNotifs.length > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: colors.red, borderRadius: '50%', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadNotifs.length}</span>}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, #6B7280, #9CA3AF)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>AU</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>Auditor</p>
                <p style={{ fontSize: '10px', color: colors.textSec, margin: 0 }}>Regulatory Viewer</p>
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
                <Scale size={18} color="#6B7280" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.08em' }}>AUDIT / REGULATORY PORTAL</span>
              </div>
              <h1 style={{ ...typography.h1, marginBottom: '2px' }}>MASAR Evidence Center</h1>
              <p style={{ ...typography.small }}>Read-only access to complete transaction evidence chains · Nigeria → Saudi Arabia</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ padding: '6px 12px', background: '#FEF3C7', borderRadius: '6px', border: '1px solid #FDE68A' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#92400E' }}>⚠️ READ-ONLY · No financial release · No document deletion</span>
              </div>
              <button style={{ ...glass.btnOutline, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={13} /> Export Audit Log</button>
            </div>
          </div>

          {/* View Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', background: '#E5E7EB', borderRadius: '10px', width: 'fit-content', overflowX: 'auto' }}>
            {([
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'transactions', label: 'Transactions', icon: FileText },
              { id: 'documents', label: 'Document Chain', icon: FolderOpen },
              { id: 'releases', label: 'Release Ledger', icon: Lock },
              { id: 'screening', label: 'Screening Logs', icon: Shield },
              { id: 'access', label: 'Access Logs', icon: Eye },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
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
              {/* Security Indicators */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                  { icon: Lock, label: 'Append-Only', desc: 'Immutable audit log', color: colors.green },
                  { icon: Hash, label: 'Hash-Chained', desc: 'SHA-256 integrity', color: colors.blue },
                  { icon: Shield, label: 'RBAC Enforced', desc: 'Role-based access', color: colors.gold },
                  { icon: Eye, label: 'Full Visibility', desc: `${totalEvents} events logged`, color: '#8B5CF6' },
                ].map((item, idx) => (
                  <div key={idx} style={{ ...glass.card, padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <item.icon size={20} color={item.color} />
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: colors.text, margin: 0 }}>{item.label}</p>
                      <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* KPI Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'TOTAL EVENTS', value: String(totalEvents), icon: History, color: colors.blue, action: () => setActiveView('transactions') },
                  { label: 'TODAY', value: String(todayEvents), icon: Clock, color: colors.gold, action: () => setActiveView('transactions') },
                  { label: 'CRITICAL', value: String(criticalEvents), icon: AlertTriangle, color: colors.red, action: () => setActiveView('transactions') },
                  { label: 'IMMUTABLE', value: '100%', icon: Lock, color: colors.green, action: () => setActiveView('overview') },
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

              {/* Recent Events + Evidence Chain */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
                {/* Recent Events */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Recent Audit Events</h3>
                    <button onClick={() => setActiveView('transactions')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {mockAuditEvents.slice(0, 5).map(event => (
                      <div key={event.id} onClick={() => setActiveView('transactions')} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: event.action.includes('ALERT') ? colors.red : event.action.includes('APPROVED') ? colors.green : colors.blue, marginTop: '6px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{event.action.replace(/_/g, ' ')}</p>
                          <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>{event.details}</p>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <span style={{ fontSize: '10px', color: colors.textMuted }}>{event.userName} ({event.userRole})</span>
                            <span style={{ fontSize: '10px', color: colors.textMuted }}>· {new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: '9px', fontWeight: 600, color: colors.green, padding: '2px 6px', background: '#F0FDF4', borderRadius: '4px', alignSelf: 'flex-start' }}>IMMUTABLE</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Chain Preview */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Evidence Chain</h3>
                    <button onClick={() => setActiveView('documents')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>Full Chain →</button>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>MASAR-SES-2026-000001</span>
                      <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>Nigeria → Saudi Arabia · Sesame · 1,000 MT</p>
                    </div>
                    {mockEvidenceChains[0].steps.slice(0, 6).map((step, idx) => (
                      <div key={step.id} style={{ display: 'flex', gap: '10px', paddingBottom: idx < 5 ? '10px' : 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {step.status === 'complete' ? <CheckCircle size={16} color={colors.green} /> : step.status === 'active' ? <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: colors.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }} /></div> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #E5E7EB' }} />}
                          {idx < 5 && <div style={{ width: '2px', flex: 1, background: step.status === 'complete' ? '#BBF7D0' : '#E5E7EB', marginTop: '2px' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', fontWeight: 600, color: step.status === 'pending' ? colors.textMuted : colors.text, margin: 0 }}>{step.step}</p>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                            <span style={{ fontSize: '10px', color: colors.textMuted }}>Evidence: {step.evidence}</span>
                            <span style={{ fontSize: '10px', color: colors.textMuted, fontFamily: 'monospace' }}>Hash: {step.hash.substring(0, 12)}...</span>
                          </div>
                        </div>
                        {step.status === 'complete' && <span style={{ fontSize: '9px', fontWeight: 600, color: colors.green, padding: '2px 6px', background: '#F0FDF4', borderRadius: '4px', alignSelf: 'flex-start' }}>VERIFIED</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TRANSACTIONS VIEW */}
          {activeView === 'transactions' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ ...typography.h3 }}>Audit Events</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['all', 'document', 'status', 'approval', 'alert'].map(f => (
                    <button key={f} onClick={() => setFilterType(f)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(filterType === f ? { background: colors.navy, color: 'white' } : { background: '#F3F4F6', color: colors.textSec }) }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                  ))}
                </div>
              </div>
              <div style={{ padding: '12px' }}>
                {filteredEvents.map(event => (
                  <div key={event.id} onClick={() => setSelectedEvent(event.id)} style={{ display: 'flex', gap: '12px', padding: '14px', background: selectedEvent === event.id ? '#F9FAFB' : 'white', borderRadius: '10px', marginBottom: '8px', cursor: 'pointer', border: selectedEvent === event.id ? '1px solid #E5E7EB' : '1px solid transparent' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: event.action.includes('ALERT') ? colors.red : event.action.includes('APPROVED') || event.action.includes('VERIFIED') ? colors.green : colors.blue, marginTop: '6px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: colors.text }}>{event.action.replace(/_/g, ' ')}</span>
                        <span style={{ fontSize: '10px', color: colors.textMuted }}>· {event.entityType}: {event.entityId}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: colors.textSec, margin: '4px 0' }}>{event.details}</p>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <span style={{ fontSize: '10px', color: colors.textMuted }}>User: {event.userName} ({event.userRole})</span>
                        <span style={{ fontSize: '10px', color: colors.textMuted }}>Time: {new Date(event.timestamp).toLocaleString()}</span>
                        <span style={{ fontSize: '10px', color: colors.textMuted }}>IP: {event.ipAddress}</span>
                      </div>
                      {event.documentHash && (
                        <div style={{ marginTop: '4px', padding: '4px 8px', background: '#F3F4F6', borderRadius: '4px', display: 'inline-block' }}>
                          <span style={{ fontSize: '10px', color: colors.textMuted, fontFamily: 'monospace' }}>Hash: {event.documentHash}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 600, color: colors.green, padding: '2px 6px', background: '#F0FDF4', borderRadius: '4px' }}>IMMUTABLE</span>
                      <span style={{ fontSize: '10px', color: colors.textMuted }}>{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCUMENTS VIEW */}
          {activeView === 'documents' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                <h3 style={{ ...typography.h3 }}>Complete Evidence Chain — MASAR-SES-2026-000001</h3>
                <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>Nigeria → Saudi Arabia · Sesame · 1,000 MT · $500,000</p>
              </div>
              <div style={{ padding: '20px' }}>
                {mockEvidenceChains[0].steps.map((step, idx) => (
                  <div key={step.id} style={{ display: 'flex', gap: '14px', paddingBottom: idx < mockEvidenceChains[0].steps.length - 1 ? '16px' : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {step.status === 'complete' ? <CheckCircle size={20} color={colors.green} /> : step.status === 'active' ? <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: colors.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} /></div> : <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #E5E7EB' }} />}
                      {idx < mockEvidenceChains[0].steps.length - 1 && <div style={{ width: '2px', flex: 1, background: step.status === 'complete' ? '#BBF7D0' : '#E5E7EB', marginTop: '4px' }} />}
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: step.status === 'pending' ? colors.textMuted : colors.text, margin: 0 }}>{step.step}</p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                          <span style={{ fontSize: '11px', color: colors.textMuted }}>Evidence: {step.evidence}</span>
                          <span style={{ fontSize: '11px', color: colors.textMuted }}>Type: {step.evidenceType}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '2px' }}>
                          <span style={{ fontSize: '10px', color: colors.textMuted }}>Actor: {step.actor} ({step.actorRole})</span>
                          <span style={{ fontSize: '10px', color: colors.textMuted }}>Time: {step.timestamp !== '—' ? new Date(step.timestamp).toLocaleString() : '—'}</span>
                        </div>
                        {step.hash !== '—' && (
                          <div style={{ marginTop: '4px', padding: '4px 8px', background: '#F3F4F6', borderRadius: '4px', display: 'inline-block' }}>
                            <span style={{ fontSize: '10px', color: colors.textMuted, fontFamily: 'monospace' }}>Hash: {step.hash}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {step.status === 'complete' && <span style={{ fontSize: '10px', fontWeight: 600, color: colors.green, padding: '3px 8px', background: '#F0FDF4', borderRadius: '4px' }}>VERIFIED</span>}
                        {step.status === 'active' && <span style={{ fontSize: '10px', fontWeight: 600, color: colors.gold, padding: '3px 8px', background: '#FFFBEB', borderRadius: '4px' }}>IN PROGRESS</span>}
                        {step.status === 'pending' && <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textMuted, padding: '3px 8px', background: '#F3F4F6', borderRadius: '4px' }}>PENDING</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREENING VIEW */}
          {activeView === 'screening' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                <h3 style={{ ...typography.h3 }}>Screening Logs</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Entity', 'Type', 'Screening', 'Provider', 'Result', 'Details', 'Reviewed By', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockScreeningLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {log.entityType === 'buyer' ? <Building2 size={14} color={colors.blue} /> : <Truck size={14} color={colors.green} />}
                          <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{log.entityName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(log.entityType === 'buyer' ? 'info' : 'success')}>{log.entityType}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{log.screeningType.replace(/_/g, ' ')}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{log.provider}</td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(log.result === 'clear' ? 'success' : log.result === 'hit' ? 'danger' : 'warning')}>{log.result}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{log.details}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{log.reviewedBy || '—'}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{log.reviewedDate || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ACCESS LOGS VIEW */}
          {activeView === 'access' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                <h3 style={{ ...typography.h3 }}>Access Logs</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Timestamp', 'User', 'Role', 'Action', 'Resource', 'IP Address', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockAccessLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: colors.text }}>{log.userName}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{log.userRole}</td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(log.action === 'LOGIN' ? 'info' : log.action === 'APPROVE' ? 'success' : 'neutral')}>{log.action}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{log.resource}</td>
                      <td style={{ padding: '12px', fontSize: '11px', fontFamily: 'monospace', color: colors.textSec }}>{log.ipAddress}</td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(log.status === 'success' ? 'success' : log.status === 'failed' ? 'danger' : 'warning')}>{log.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Other Views */}
          {!['overview', 'transactions', 'documents', 'screening', 'access'].includes(activeView) && (
            <div style={{ ...glass.card, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#6B728010', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {activeView === 'releases' && <Lock size={28} color="#6B7280" />}
                {activeView === 'reports' && <BarChart3 size={28} color="#6B7280" />}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>
                {activeView === 'releases' && 'Release Ledger'}
                {activeView === 'reports' && 'Audit Reports'}
              </h2>
              <p style={{ fontSize: '14px', color: colors.textSec, maxWidth: '500px', margin: '0 auto 24px' }}>
                {activeView === 'releases' && 'Immutable record of all release authorizations and settlements.'}
                {activeView === 'reports' && 'Generate comprehensive audit reports for regulatory review.'}
              </p>
              <button onClick={() => setActiveView('overview')} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Back to Overview</button>
            </div>
          )}
        </main>

        {/* Status Bar */}
        <footer style={{ background: 'white', borderTop: `1px solid ${colors.border}`, padding: '8px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: colors.gold, letterSpacing: '0.05em' }}>MASAR V0</span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Audit Portal · Read-Only Access</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Events: <span style={{ color: colors.green, fontWeight: 600 }}>{totalEvents}</span></span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Immutable: <span style={{ color: colors.green, fontWeight: 600 }}>100%</span></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
