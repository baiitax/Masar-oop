'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FileText, TrendingUp, Building2, DollarSign, 
  Shield, BarChart3, CheckCircle, Clock, AlertTriangle, Eye, 
  Plus, Filter, RefreshCw, Download, ChevronRight, ArrowUpRight,
  Users, Package, MapPin, Calendar, Star, Banknote, Anchor, 
  Globe, Bell, Languages, ChevronDown, LogOut, Loader2, X, 
  Truck, Activity, Target, ArrowRight, Send, Landmark, Scale,
  ArrowDownRight, Minus, Info, HelpCircle, Lock, Unlock,
  Receipt, Percent, PieChart, LineChart, AreaChart
} from 'lucide-react';
import { 
  mockTransactions, mockBuyers, mockExporters, mockNotifications,
  formatCurrency, getStatusColor, getRiskColor, Transaction
} from '@/lib/store';
import { colors, glass, typography, getBadgeStyle } from '@/lib/design';
import RoleSidebar from '@/components/dashboard/RoleSidebar';

// Capital Partner types
interface FundingRequest {
  id: string;
  transactionId: string;
  masarId: string;
  buyerName: string;
  exporterName: string;
  commodity: string;
  contractValue: number;
  requestedAdvance: number;
  requestedAmount: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'DECLINED' | 'DISBURSED' | 'REPAID';
  submittedDate: string;
  reviewedDate?: string;
  approvedDate?: string;
  disbursedDate?: string;
  repaidDate?: string;
  riskScore: number;
  inspectionStatus: string;
  complianceStatus: string;
  buyerVerified: boolean;
  exporterVerified: boolean;
  interestRate?: number;
  tenor?: number;
  expectedRepayment?: string;
}

interface Facility {
  id: string;
  name: string;
  type: 'revolving' | 'term' | 'bridge';
  totalLimit: number;
  utilized: number;
  available: number;
  currency: string;
  status: 'active' | 'suspended' | 'matured';
  startDate: string;
  endDate: string;
  interestRate: number;
  borrower: string;
}

interface PortfolioMetrics {
  totalFunded: number;
  outstanding: number;
  repaid: number;
  utilization: number;
  averageTenor: number;
  lossRate: number;
  repaymentRate: number;
  concentration: { buyer: string; pct: number }[];
}

// Mock capital partner data
const mockFundingRequests: FundingRequest[] = [
  { id: 'fr-001', transactionId: 'txn-001', masarId: 'MASAR-SES-2026-000001', buyerName: 'Al Rajhi Foods', exporterName: 'Dangote Sesame', commodity: 'Premium Hulled Sesame', contractValue: 500000, requestedAdvance: 80, requestedAmount: 400000, status: 'APPROVED', submittedDate: '2026-08-08', reviewedDate: '2026-08-09', approvedDate: '2026-08-10', disbursedDate: '2026-08-12', riskScore: 18, inspectionStatus: 'Passed', complianceStatus: 'Ready', buyerVerified: true, exporterVerified: true, interestRate: 8.5, tenor: 90, expectedRepayment: '2026-11-10' },
  { id: 'fr-002', transactionId: 'txn-002', masarId: 'MASAR-SES-2026-000002', buyerName: 'SGT Foods', exporterName: 'Dangote Sesame', commodity: 'Premium Hulled Sesame', contractValue: 250000, requestedAdvance: 75, requestedAmount: 187500, status: 'UNDER_REVIEW', submittedDate: '2026-08-20', riskScore: 28, inspectionStatus: 'Scheduled', complianceStatus: 'In Progress', buyerVerified: true, exporterVerified: true },
  { id: 'fr-003', transactionId: 'txn-003', masarId: 'MASAR-SES-2026-000003', buyerName: 'Al Rajhi Foods', exporterName: 'NPG Exports', commodity: 'Standard Natural Sesame', contractValue: 375000, requestedAdvance: 80, requestedAmount: 300000, status: 'SUBMITTED', submittedDate: '2026-08-22', riskScore: 35, inspectionStatus: 'Pending', complianceStatus: 'In Progress', buyerVerified: true, exporterVerified: true },
  { id: 'fr-004', transactionId: 'txn-005', masarId: 'MASAR-SES-2026-000005', buyerName: 'Al Rajhi Foods', exporterName: 'Dangote Sesame', commodity: 'Premium Hulled Sesame', contractValue: 750000, requestedAdvance: 80, requestedAmount: 600000, status: 'REPAID', submittedDate: '2026-05-05', reviewedDate: '2026-05-06', approvedDate: '2026-05-07', disbursedDate: '2026-05-10', repaidDate: '2026-07-28', riskScore: 12, inspectionStatus: 'Passed', complianceStatus: 'Ready', buyerVerified: true, exporterVerified: true, interestRate: 8.0, tenor: 80, expectedRepayment: '2026-07-28' },
];

const mockFacilities: Facility[] = [
  { id: 'fac-001', name: 'MASAR Trade Finance Facility I', type: 'revolving', totalLimit: 2000000, utilized: 587500, available: 1412500, currency: 'USD', status: 'active', startDate: '2026-05-01', endDate: '2027-05-01', interestRate: 8.5, borrower: 'MASAR Corridor' },
  { id: 'fac-002', name: 'Sesame Export Bridge Facility', type: 'bridge', totalLimit: 1000000, utilized: 0, available: 1000000, currency: 'USD', status: 'active', startDate: '2026-08-01', endDate: '2027-02-01', interestRate: 9.0, borrower: 'MASAR Corridor' },
];

const portfolioMetrics: PortfolioMetrics = {
  totalFunded: 1000000,
  outstanding: 587500,
  repaid: 600000,
  utilization: 58.75,
  averageTenor: 85,
  lossRate: 0,
  repaymentRate: 100,
  concentration: [
    { buyer: 'Al Rajhi Foods', pct: 72 },
    { buyer: 'SGT Foods', pct: 28 },
  ],
};

export default function CapitalDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'requests' | 'portfolio' | 'exposure' | 'facilities' | 'repayments' | 'risk' | 'transactions' | 'reports'>('overview');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  const approvedRequests = mockFundingRequests.filter(r => r.status === 'APPROVED' || r.status === 'DISBURSED');
  const pendingRequests = mockFundingRequests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW');
  const repaidRequests = mockFundingRequests.filter(r => r.status === 'REPAID');
  const unreadNotifs = mockNotifications.filter(n => !n.read);

  useEffect(() => {
    const role = localStorage.getItem('masar-role');
    if (!role) { router.push('/auth'); return; }
    setTimeout(() => setLoading(false), 800);
  }, [router]);

  const filteredRequests = filterStatus === 'all' ? mockFundingRequests :
    filterStatus === 'pending' ? pendingRequests :
    filterStatus === 'approved' ? approvedRequests :
    mockFundingRequests.filter(r => r.status === filterStatus.toUpperCase());

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
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.gold, letterSpacing: '0.1em' }}>MASAR CAPITAL</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Loading capital partner portfolio...</p>
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
              <input type="text" placeholder="Search funding requests, facilities, transactions..." style={{ ...glass.input, width: '100%', padding: '8px 12px 8px 36px', fontSize: '13px', color: colors.text, outline: 'none' }} />
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
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, #7C3AED, #A78BFA)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>CP</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>Capital Partner</p>
                <p style={{ fontSize: '10px', color: colors.textSec, margin: 0 }}>Afreximbank</p>
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
                <Landmark size={18} color="#7C3AED" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#7C3AED', letterSpacing: '0.08em' }}>CAPITAL PARTNER PORTAL</span>
              </div>
              <h1 style={{ ...typography.h1, marginBottom: '2px' }}>Capital Partner Portfolio</h1>
              <p style={{ ...typography.small }}>Afreximbank · Institutional Trade Finance · Nigeria → Saudi Arabia</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...glass.btnOutline, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={13} /> Refresh</button>
              <button style={{ ...glass.btnPrimary, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={13} /> Export Report</button>
            </div>
          </div>

          {/* View Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', background: '#E5E7EB', borderRadius: '10px', width: 'fit-content', overflowX: 'auto' }}>
            {([
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'requests', label: 'Funding Requests', icon: FileText },
              { id: 'portfolio', label: 'Portfolio', icon: PieChart },
              { id: 'exposure', label: 'Exposure', icon: TrendingUp },
              { id: 'facilities', label: 'Facilities', icon: Building2 },
              { id: 'repayments', label: 'Repayments', icon: DollarSign },
              { id: 'risk', label: 'Risk', icon: Shield },
              { id: 'transactions', label: 'Transactions', icon: Activity },
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
              {/* Portfolio Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'TOTAL FUNDED', value: formatCurrency(portfolioMetrics.totalFunded), icon: DollarSign, color: colors.green, action: () => setActiveView('portfolio') },
                  { label: 'OUTSTANDING', value: formatCurrency(portfolioMetrics.outstanding), icon: Clock, color: colors.amber, action: () => setActiveView('exposure') },
                  { label: 'REPAID', value: formatCurrency(portfolioMetrics.repaid), icon: CheckCircle, color: colors.green, action: () => setActiveView('repayments') },
                  { label: 'UTILIZATION', value: `${portfolioMetrics.utilization}%`, icon: BarChart3, color: colors.blue, action: () => setActiveView('facilities') },
                  { label: 'LOSS RATE', value: `${portfolioMetrics.lossRate}%`, icon: Shield, color: colors.green, action: () => setActiveView('risk') },
                  { label: 'REPAYMENT RATE', value: `${portfolioMetrics.repaymentRate}%`, icon: TrendingUp, color: colors.green, action: () => setActiveView('repayments') },
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

              {/* Pending Requests + Exposure */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {/* Pending Requests */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Pending Funding Requests</h3>
                    <button onClick={() => setActiveView('requests')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {pendingRequests.map(req => (
                      <div key={req.id} onClick={() => { setSelectedRequest(req.id); setActiveView('requests'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#F9FAFB', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{req.masarId}</span>
                          <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>{req.buyerName} · {req.commodity}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '14px', fontWeight: 700, color: colors.gold, margin: 0 }}>{formatCurrency(req.requestedAmount)}</p>
                          <span style={getBadgeStyle(req.status === 'SUBMITTED' ? 'info' : 'warning')}>{req.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exposure Breakdown */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Exposure Breakdown</h3>
                    <button onClick={() => setActiveView('exposure')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>Details →</button>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: colors.textSec }}>By Buyer</span>
                      </div>
                      {portfolioMetrics.concentration.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{item.buyer}</span>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{item.pct}%</span>
                          </div>
                          <div style={{ height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${item.pct}%`, height: '100%', background: idx === 0 ? colors.blue : colors.purple, borderRadius: '3px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: colors.textSec }}>Average Tenor</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{portfolioMetrics.averageTenor} days</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: colors.textSec }}>Average Advance Rate</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>79%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div style={{ ...glass.card, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ ...typography.h3 }}>Active Facilities</h3>
                  <button onClick={() => setActiveView('facilities')} style={{ fontSize: '11px', color: colors.gold, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', padding: '16px' }}>
                  {mockFacilities.map(fac => (
                    <div key={fac.id} style={{ padding: '16px', background: '#F9FAFB', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: 700, color: colors.text, margin: 0 }}>{fac.name}</h4>
                          <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>{fac.type} · {fac.interestRate}% · {fac.currency}</p>
                        </div>
                        <span style={getBadgeStyle(fac.status === 'active' ? 'success' : 'warning')}>{fac.status}</span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', color: colors.textSec }}>Utilization</span>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: colors.text }}>{formatCurrency(fac.utilized)} / {formatCurrency(fac.totalLimit)}</span>
                        </div>
                        <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${(fac.utilized / fac.totalLimit) * 100}%`, height: '100%', background: (fac.utilized / fac.totalLimit) > 0.8 ? colors.red : (fac.utilized / fac.totalLimit) > 0.6 ? colors.amber : colors.green, borderRadius: '4px' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', color: colors.textSec }}>Available</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: colors.green }}>{formatCurrency(fac.available)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* FUNDING REQUESTS VIEW */}
          {activeView === 'requests' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ ...typography.h3 }}>Funding Requests</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['all', 'pending', 'approved', 'repaid'].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(filterStatus === f ? { background: colors.navy, color: 'white' } : { background: '#F3F4F6', color: colors.textSec }) }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                  ))}
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Transaction', 'Buyer', 'Exporter', 'Contract', 'Advance', 'Amount', 'Risk', 'Inspection', 'Compliance', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredRequests.map(req => (
                    <tr key={req.id} onClick={() => setSelectedRequest(req.id)} style={{ cursor: 'pointer', background: selectedRequest === req.id ? '#FFFBEB' : 'white', borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px' }}><span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{req.masarId}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{req.buyerName}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{req.exporterName}</td>
                      <td style={{ padding: '12px', fontSize: '12px', fontWeight: 600 }}>{formatCurrency(req.contractValue)}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{req.requestedAdvance}%</td>
                      <td style={{ padding: '12px', fontSize: '12px', fontWeight: 700, color: colors.gold }}>{formatCurrency(req.requestedAmount)}</td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(req.riskScore < 25 ? 'success' : req.riskScore < 40 ? 'warning' : 'danger')}>{req.riskScore}/100</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(req.inspectionStatus === 'Passed' ? 'success' : 'warning')}>{req.inspectionStatus}</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(req.complianceStatus === 'Ready' ? 'success' : 'warning')}>{req.complianceStatus}</span></td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(req.status === 'APPROVED' || req.status === 'DISBURSED' || req.status === 'REPAID' ? 'success' : req.status === 'DECLINED' ? 'danger' : 'warning')}>{req.status}</span></td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {req.status === 'UNDER_REVIEW' && (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); setShowApproveModal(true); }} style={{ padding: '4px 8px', background: colors.greenLight, border: `1px solid ${colors.green}30`, borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: colors.green, cursor: 'pointer' }}>Approve</button>
                              <button onClick={(e) => { e.stopPropagation(); setShowDeclineModal(true); }} style={{ padding: '4px 8px', background: colors.redLight, border: `1px solid ${colors.red}30`, borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: colors.red, cursor: 'pointer' }}>Decline</button>
                            </>
                          )}
                          <button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Eye size={10} color={colors.textSec} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PORTFOLIO VIEW */}
          {activeView === 'portfolio' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
              <div style={{ ...glass.card, padding: '20px' }}>
                <h3 style={{ ...typography.h3, marginBottom: '16px' }}>Portfolio Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Total Funded', value: formatCurrency(portfolioMetrics.totalFunded), color: colors.green },
                    { label: 'Outstanding', value: formatCurrency(portfolioMetrics.outstanding), color: colors.amber },
                    { label: 'Repaid', value: formatCurrency(portfolioMetrics.repaid), color: colors.green },
                    { label: 'Utilization', value: `${portfolioMetrics.utilization}%`, color: colors.blue },
                    { label: 'Avg Tenor', value: `${portfolioMetrics.averageTenor} days`, color: colors.text },
                    { label: 'Loss Rate', value: `${portfolioMetrics.lossRate}%`, color: colors.green },
                    { label: 'Repayment Rate', value: `${portfolioMetrics.repaymentRate}%`, color: colors.green },
                    { label: 'Active Facilities', value: '2', color: colors.text },
                  ].map((item, idx) => (
                    <div key={idx} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
                      <span style={{ fontSize: '10px', color: colors.textMuted }}>{item.label}</span>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: item.color, margin: '2px 0 0' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...glass.card, padding: '20px' }}>
                <h3 style={{ ...typography.h3, marginBottom: '16px' }}>Transaction History</h3>
                {mockFundingRequests.map(req => (
                  <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{req.masarId}</span>
                      <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>{req.buyerName}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: colors.text, margin: 0 }}>{formatCurrency(req.requestedAmount)}</p>
                      <span style={getBadgeStyle(req.status === 'REPAID' ? 'success' : req.status === 'APPROVED' ? 'info' : 'warning')}>{req.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPOSURE VIEW */}
          {activeView === 'exposure' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
              <div style={{ ...glass.card, padding: '20px' }}>
                <h3 style={{ ...typography.h3, marginBottom: '16px' }}>Exposure by Buyer</h3>
                {portfolioMetrics.concentration.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{item.buyer}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: colors.text }}>{item.pct}%</span>
                    </div>
                    <div style={{ height: '10px', background: '#E5E7EB', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: idx === 0 ? colors.blue : colors.purple, borderRadius: '5px' }} />
                    </div>
                    <p style={{ fontSize: '11px', color: colors.textMuted, margin: '4px 0 0' }}>{formatCurrency(portfolioMetrics.outstanding * item.pct / 100)} outstanding</p>
                  </div>
                ))}
              </div>
              <div style={{ ...glass.card, padding: '20px' }}>
                <h3 style={{ ...typography.h3, marginBottom: '16px' }}>Exposure by Commodity</h3>
                {[
                  { commodity: 'Premium Hulled Sesame', pct: 78, value: 587500 },
                  { commodity: 'Standard Natural Sesame', pct: 22, value: 187500 },
                ].map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{item.commodity}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: colors.text }}>{formatCurrency(item.value)}</span>
                    </div>
                    <div style={{ height: '10px', background: '#E5E7EB', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: idx === 0 ? colors.gold : colors.amber, borderRadius: '5px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FACILITIES VIEW */}
          {activeView === 'facilities' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
              {mockFacilities.map(fac => (
                <div key={fac.id} style={{ ...glass.card, padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: 0 }}>{fac.name}</h3>
                      <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>{fac.type} · {fac.interestRate}% · {fac.currency}</p>
                    </div>
                    <span style={getBadgeStyle(fac.status === 'active' ? 'success' : 'warning')}>{fac.status}</span>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: colors.textSec }}>Utilization</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text }}>{((fac.utilized / fac.totalLimit) * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ height: '12px', background: '#E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${(fac.utilized / fac.totalLimit) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${colors.green}, ${colors.gold})`, borderRadius: '6px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', color: colors.textMuted }}>Total Limit</span>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: colors.text, margin: '2px 0 0' }}>{formatCurrency(fac.totalLimit)}</p>
                    </div>
                    <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', color: colors.textMuted }}>Utilized</span>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: colors.amber, margin: '2px 0 0' }}>{formatCurrency(fac.utilized)}</p>
                    </div>
                    <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', color: colors.textMuted }}>Available</span>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: colors.green, margin: '2px 0 0' }}>{formatCurrency(fac.available)}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', padding: '10px', background: '#F9FAFB', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: colors.textMuted }}>Period</span>
                      <span style={{ fontSize: '11px', color: colors.text }}>{fac.startDate} → {fac.endDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RISK VIEW */}
          {activeView === 'risk' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
              <div style={{ ...glass.card, padding: '20px' }}>
                <h3 style={{ ...typography.h3, marginBottom: '16px' }}>Risk Overview</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Loss Rate', value: '0%', status: 'excellent', color: colors.green },
                    { label: 'Repayment Rate', value: '100%', status: 'excellent', color: colors.green },
                    { label: 'Avg Risk Score', value: '23/100', status: 'low', color: colors.green },
                    { label: 'Concentration', value: '72% max', status: 'moderate', color: colors.amber },
                  ].map((item, idx) => (
                    <div key={idx} style={{ padding: '14px', background: `${item.color}08`, borderRadius: '10px', border: `1px solid ${item.color}20` }}>
                      <span style={{ fontSize: '10px', color: colors.textMuted }}>{item.label}</span>
                      <p style={{ fontSize: '20px', fontWeight: 800, color: item.color, margin: '4px 0' }}>{item.value}</p>
                      <span style={getBadgeStyle(item.status === 'excellent' ? 'success' : 'warning')}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...glass.card, padding: '20px' }}>
                <h3 style={{ ...typography.h3, marginBottom: '16px' }}>Transaction Risk Scores</h3>
                {mockFundingRequests.map(req => (
                  <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: colors.text, fontFamily: 'monospace' }}>{req.masarId}</span>
                      <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>{req.buyerName}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${100 - req.riskScore}%`, height: '100%', background: req.riskScore < 25 ? colors.green : req.riskScore < 40 ? colors.amber : colors.red, borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: req.riskScore < 25 ? colors.green : req.riskScore < 40 ? colors.amber : colors.red }}>{req.riskScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Views */}
          {!['overview', 'requests', 'portfolio', 'exposure', 'facilities', 'risk'].includes(activeView) && (
            <div style={{ ...glass.card, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#7C3AED10', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {activeView === 'repayments' && <DollarSign size={28} color="#7C3AED" />}
                {activeView === 'transactions' && <Activity size={28} color="#7C3AED" />}
                {activeView === 'reports' && <BarChart3 size={28} color="#7C3AED" />}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>
                {activeView === 'repayments' && 'Repayments'}
                {activeView === 'transactions' && 'Transactions'}
                {activeView === 'reports' && 'Reports'}
              </h2>
              <p style={{ fontSize: '14px', color: colors.textSec, maxWidth: '500px', margin: '0 auto 24px' }}>
                {activeView === 'repayments' && 'Track repayment schedules and history.'}
                {activeView === 'transactions' && 'View all financed transactions.'}
                {activeView === 'reports' && 'Generate portfolio and risk reports.'}
              </p>
              <button onClick={() => setActiveView('overview')} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Back to Overview</button>
            </div>
          )}
        </main>

        {/* Status Bar */}
        <footer style={{ background: 'white', borderTop: `1px solid ${colors.border}`, padding: '8px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: colors.gold, letterSpacing: '0.05em' }}>MASAR V0</span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Capital Partner Portal · Afreximbank</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Portfolio: <span style={{ color: colors.green, fontWeight: 600 }}>{formatCurrency(portfolioMetrics.totalFunded)}</span></span>
            <span style={{ fontSize: '100px', color: colors.textMuted }}>Loss Rate: <span style={{ color: colors.green, fontWeight: 600 }}>0%</span></span>
          </div>
        </footer>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>Approve Funding Request</h2>
              <button onClick={() => setShowApproveModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={colors.textSec} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ padding: '16px', background: colors.greenLight, borderRadius: '10px', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: colors.green, margin: 0 }}>This action will approve the funding request and authorize disbursement through the licensed financial partner.</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Interest Rate (%)</label>
                <input type="number" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} placeholder="e.g., 8.5" step="0.1" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Tenor (days)</label>
                <input type="number" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} placeholder="e.g., 90" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Notes</label>
                <textarea style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px', resize: 'vertical' }} rows={3} placeholder="Approval notes..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setShowApproveModal(false)} style={{ ...glass.btnOutline, padding: '10px 20px', fontSize: '13px' }}>Cancel</button>
                <button onClick={() => { setShowApproveModal(false); setActiveView('requests'); }} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px', background: colors.green, color: 'white' }}>Approve & Authorize</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>Decline Funding Request</h2>
              <button onClick={() => setShowDeclineModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={colors.textSec} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ padding: '16px', background: colors.redLight, borderRadius: '10px', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: colors.red, margin: 0 }}>Please provide a reason for declining this funding request.</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Reason for Decline</label>
                <select style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }}>
                  <option>Insufficient documentation</option>
                  <option>Risk score too high</option>
                  <option>Compliance issues</option>
                  <option>Concentration limit reached</option>
                  <option>Other</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Additional Notes</label>
                <textarea style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px', resize: 'vertical' }} rows={3} placeholder="Detailed reason..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setShowDeclineModal(false)} style={{ ...glass.btnOutline, padding: '10px 20px', fontSize: '13px' }}>Cancel</button>
                <button onClick={() => { setShowDeclineModal(false); setActiveView('requests'); }} style={{ padding: '10px 20px', background: colors.red, color: 'white', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Decline Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
