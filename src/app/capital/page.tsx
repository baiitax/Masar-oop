'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const colors = {
  navy: '#0B1F3A', navyLight: '#142235', gold: '#C9A24A', goldLight: '#D4B366',
  white: '#FFFFFF', gray: '#6B7280', grayLight: '#E5E7EB', grayLighter: '#F3F4F6',
  green: '#10B981', greenLight: '#D1FAE5', red: '#EF4444', redLight: '#FEE2E2',
  blue: '#3B82F6', blueLight: '#DBEAFE', amber: '#F59E0B', amberLight: '#FEF3C7',
  purple: '#8B5CF6', purpleLight: '#EDE9FE',
};

export default function FinanceDashboard() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/finance/dashboard');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setLastUpdated(new Date());
        }
      }
    } catch (err) {
      console.error('Failed to fetch finance data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const symbols: Record<string, string> = { USD: '$', NGN: '₦', SAR: '﷼' };
    const symbol = symbols[currency] || '$';
    if (amount >= 1e9) return `${symbol}${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `${symbol}${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `${symbol}${(amount / 1e3).toFixed(1)}K`;
    return `${symbol}${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    if (['approved', 'funded', 'completed', 'paid'].includes(status)) return colors.green;
    if (['rejected', 'failed', 'overdue'].includes(status)) return colors.red;
    if (['pending', 'processing', 'under_review'].includes(status)) return colors.amber;
    return colors.blue;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.grayLighter }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: colors.navy }}>Loading Finance Portal</h2>
        </div>
      </div>
    );
  }

  // Mock data for demo
  const mockData = {
    partner: { legal_name: 'Saudi National Bank', organization_type: 'FINANCIAL_PARTNER' },
    kpis: {
      totalPortfolio: 18420000000,
      approvedFacilities: 47,
      outstandingExposure: 12800000000,
      disbursed: 21150000000,
      pendingDisbursement: 3200000000,
      repaymentDue: 240000000,
      overdue: 120000000,
      atRiskExposure: 1240000000,
      portfolioYield: 8.5,
      utilizationRate: 72,
    },
    applications: [
      { id: '1', status: 'under_review', requestedAmount: 2100000000, currency: 'NGN', transactionNumber: 'MAS-SES-2026-000001', commodity: 'Sesame', exporter: 'Nigerian Sesame Co.', buyer: 'Al Rajhi Foods', transactionValue: 3200000000 },
      { id: '2', status: 'pending', requestedAmount: 850000000, currency: 'NGN', transactionNumber: 'MAS-SOY-2026-000002', commodity: 'Soybean', exporter: 'Kaduna Cashew Ltd', buyer: 'Jeddah Trading', transactionValue: 1200000000 },
      { id: '3', status: 'approved', requestedAmount: 1500000000, currency: 'USD', transactionNumber: 'MAS-CAS-2026-000003', commodity: 'Cashew', exporter: 'Ghana Soybean Exports', buyer: 'DCT Dubai', transactionValue: 2000000 },
    ],
    facilities: [
      { id: '1', approvedAmount: 5000000000, currency: 'NGN', status: 'funded', disbursed: 3600000000, outstanding: 2880000000 },
      { id: '2', approvedAmount: 2000000, currency: 'USD', status: 'approved', disbursed: 0, outstanding: 0 },
    ],
    exceptions: [
      { id: '1', type: 'settlement_exception', severity: 'high', description: 'Settlement variance detected - ₦2M shortfall', transactionNumber: 'MAS-SES-2026-000001' },
      { id: '2', type: 'finance_exception', severity: 'medium', description: 'Repayment overdue by 5 days', transactionNumber: 'MAS-SOY-2026-000002' },
    ],
    opportunities: [
      { id: '1', transactionNumber: 'MAS-SES-2026-000004', value: 4500000, currency: 'USD', commodity: 'Sesame', exporter: 'Nigerian Sesame Co.', buyer: 'Al Rajhi Foods', state: 'FINANCE_PENDING' },
      { id: '2', transactionNumber: 'MAS-CAS-2026-000005', value: 1800000, currency: 'USD', commodity: 'Cashew', exporter: 'Kaduna Cashew Ltd', buyer: 'Jeddah Trading', state: 'COMPLIANCE_READY' },
    ],
  };

  const displayData = data || mockData;

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
          .finance-grid { grid-template-columns: 1fr !important; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 768px) {
          .kpi-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: colors.grayLighter }}>
        {/* Header */}
        <div style={{ 
          background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
          padding: isMobile ? '16px 20px' : '20px 32px',
          color: colors.white,
          borderBottom: `3px solid ${colors.gold}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 700, margin: 0 }}>Finance Portal</h1>
                <span style={{ padding: '4px 10px', background: colors.green, borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>● Operational</span>
              </div>
              <p style={{ fontSize: '13px', color: colors.gray, margin: 0 }}>
                {displayData.partner?.legal_name || 'Financial Partner'} • 
                {lastUpdated && ` Last sync: ${lastUpdated.toLocaleTimeString()}`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={fetchData} style={{ padding: '8px 16px', background: colors.gold, color: colors.navy, border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                ↻ Refresh
              </button>
              <button style={{ padding: '8px 16px', background: 'transparent', color: colors.white, border: `1px solid ${colors.gray}`, borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
                📥 Export
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ background: colors.white, borderBottom: `1px solid ${colors.grayLight}`, padding: '0 32px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '0', minWidth: 'max-content' }}>
            {['overview', 'opportunities', 'applications', 'facilities', 'disbursements', 'repayments', 'settlements', 'risk', 'exceptions', 'reports'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: '14px 18px', background: 'none', border: 'none',
                  borderBottom: activeTab === tab ? `3px solid ${colors.gold}` : '3px solid transparent',
                  color: activeTab === tab ? colors.navy : colors.gray,
                  fontSize: '13px', fontWeight: activeTab === tab ? 600 : 400,
                  cursor: 'pointer', textTransform: 'capitalize', whiteSpace: 'nowrap'
                }}>
                {tab}
                {tab === 'exceptions' && displayData.exceptions.length > 0 && (
                  <span style={{ marginLeft: '6px', padding: '2px 6px', background: colors.red, color: colors.white, borderRadius: '10px', fontSize: '10px', fontWeight: 600 }}>
                    {displayData.exceptions.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px' }}>
          {/* KPI Cards */}
          <div className="kpi-grid" style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Portfolio', value: formatCurrency(displayData.kpis.totalPortfolio), change: '+8.4%', icon: '💰', color: colors.blue },
              { label: 'Outstanding Exposure', value: formatCurrency(displayData.kpis.outstandingExposure), icon: '📊', color: colors.purple },
              { label: 'Disbursed', value: formatCurrency(displayData.kpis.disbursed), icon: '✅', color: colors.green },
              { label: 'At-Risk Exposure', value: formatCurrency(displayData.kpis.atRiskExposure), change: '6.7%', icon: '⚠️', color: colors.red },
            ].map((kpi, i) => (
              <div key={i} style={{ background: colors.white, borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: `3px solid ${kpi.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: colors.gray }}>{kpi.label}</span>
                  <span style={{ fontSize: '20px' }}>{kpi.icon}</span>
                </div>
                <p style={{ fontSize: '28px', fontWeight: 700, color: colors.navy, margin: '0 0 4px 0' }}>{kpi.value}</p>
                {kpi.change && <span style={{ fontSize: '12px', color: colors.green, fontWeight: 600 }}>↑ {kpi.change}</span>}
              </div>
            ))}
          </div>

          {/* Secondary KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Approved Facilities', value: displayData.kpis.approvedFacilities },
              { label: 'Pending Disbursement', value: formatCurrency(displayData.kpis.pendingDisbursement) },
              { label: 'Repayment Due', value: formatCurrency(displayData.kpis.repaymentDue) },
              { label: 'Portfolio Yield', value: `${displayData.kpis.portfolioYield}%` },
            ].map((kpi, i) => (
              <div key={i} style={{ background: colors.white, borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <p style={{ fontSize: '11px', color: colors.gray, margin: '0 0 6px 0' }}>{kpi.label}</p>
                <p style={{ fontSize: '22px', fontWeight: 700, color: colors.navy, margin: 0 }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Attention Required & Opportunities */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Attention Required */}
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>
                What Needs Your Attention
                {displayData.exceptions.length > 0 && (
                  <span style={{ marginLeft: '8px', padding: '2px 8px', background: colors.redLight, color: colors.red, borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>
                    {displayData.exceptions.length}
                  </span>
                )}
              </h3>
              {displayData.exceptions.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', background: colors.greenLight, borderRadius: '8px' }}>
                  <span style={{ fontSize: '24px' }}>✓</span>
                  <p style={{ fontSize: '14px', color: colors.green, margin: '8px 0 0 0', fontWeight: 600 }}>All clear</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {displayData.exceptions.map((exc: any) => (
                    <div key={exc.id} style={{ padding: '14px', background: colors.grayLighter, borderRadius: '8px', borderLeft: `3px solid ${exc.severity === 'high' ? colors.red : colors.amber}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: exc.severity === 'high' ? colors.red : colors.amber, textTransform: 'uppercase' }}>{exc.severity}</span>
                        <span style={{ fontSize: '11px', color: colors.gray }}>{exc.transactionNumber}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: colors.navy, margin: 0 }}>{exc.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Financing Opportunities */}
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>
                Financing Opportunities
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {displayData.opportunities.map((opp: any) => (
                  <div key={opp.id} style={{ padding: '14px', background: colors.grayLighter, borderRadius: '8px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.navy }}>{opp.transactionNumber}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.green }}>{formatCurrency(opp.value, opp.currency)}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: colors.gray, margin: 0 }}>
                      {opp.commodity} • {opp.exporter} → {opp.buyer}
                    </p>
                    <button style={{ marginTop: '8px', padding: '6px 12px', background: colors.navy, color: colors.white, border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                      Review Opportunity
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Applications & Facilities */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Applications */}
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: 0 }}>Applications</h3>
                <button style={{ background: 'none', border: 'none', color: colors.blue, fontSize: '12px', cursor: 'pointer' }}>View All</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {displayData.applications.slice(0, 5).map((app: any) => (
                  <div key={app.id} style={{ padding: '14px', background: colors.grayLighter, borderRadius: '8px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.navy }}>{app.transactionNumber}</span>
                      <span style={{ padding: '2px 6px', background: getStatusColor(app.status) + '20', color: getStatusColor(app.status), borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: colors.gray, margin: '0 0 4px 0' }}>
                      {app.commodity} • {app.exporter}
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: colors.navy, margin: 0 }}>
                      {formatCurrency(app.requestedAmount, app.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: 0 }}>Active Facilities</h3>
                <button style={{ background: 'none', border: 'none', color: colors.blue, fontSize: '12px', cursor: 'pointer' }}>View All</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {displayData.facilities.map((fac: any) => (
                  <div key={fac.id} style={{ padding: '14px', background: colors.grayLighter, borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.navy }}>Facility #{fac.id}</span>
                      <span style={{ padding: '2px 6px', background: fac.status === 'funded' ? colors.greenLight : colors.amberLight, color: fac.status === 'funded' ? colors.green : colors.amber, borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
                        {fac.status}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px' }}>
                      <div>
                        <p style={{ color: colors.gray, margin: 0 }}>Approved</p>
                        <p style={{ fontWeight: 600, color: colors.navy, margin: 0 }}>{formatCurrency(fac.approvedAmount, fac.currency)}</p>
                      </div>
                      <div>
                        <p style={{ color: colors.gray, margin: 0 }}>Disbursed</p>
                        <p style={{ fontWeight: 600, color: colors.navy, margin: 0 }}>{formatCurrency(fac.disbursed, fac.currency)}</p>
                      </div>
                      <div>
                        <p style={{ color: colors.gray, margin: 0 }}>Outstanding</p>
                        <p style={{ fontWeight: 600, color: colors.navy, margin: 0 }}>{formatCurrency(fac.outstanding, fac.currency)}</p>
                      </div>
                    </div>
                    {/* Utilization bar */}
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: colors.gray, marginBottom: '4px' }}>
                        <span>Utilization</span>
                        <span>{fac.approvedAmount > 0 ? Math.round((fac.disbursed / fac.approvedAmount) * 100) : 0}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: colors.grayLight, borderRadius: '3px' }}>
                        <div style={{ width: `${fac.approvedAmount > 0 ? (fac.disbursed / fac.approvedAmount) * 100 : 0}%`, height: '100%', background: colors.green, borderRadius: '3px' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio Performance */}
          <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>Portfolio Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { label: 'Utilization Rate', value: `${displayData.kpis.utilizationRate}%`, color: colors.blue },
                { label: 'Portfolio Yield', value: `${displayData.kpis.portfolioYield}%`, color: colors.green },
                { label: 'At-Risk Ratio', value: `${displayData.kpis.totalPortfolio > 0 ? ((displayData.kpis.atRiskExposure / displayData.kpis.totalPortfolio) * 100).toFixed(1) : 0}%`, color: colors.red },
                { label: 'Active Facilities', value: displayData.kpis.approvedFacilities.toString(), color: colors.purple },
              ].map((metric, i) => (
                <div key={i} style={{ padding: '20px', background: colors.grayLighter, borderRadius: '10px', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: colors.gray, margin: '0 0 8px 0' }}>{metric.label}</p>
                  <p style={{ fontSize: '32px', fontWeight: 700, color: metric.color, margin: 0 }}>{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { type: 'APPLICATION', message: 'New financing application received', detail: 'MAS-SES-2026-000001 • ₦2.1B', time: '2 hours ago', icon: '📋' },
                { type: 'DISBURSEMENT', message: 'Disbursement completed', detail: '₦3.6B to Nigerian Sesame Co.', time: '5 hours ago', icon: '💰' },
                { type: 'SETTLEMENT', message: 'Settlement received', detail: '₦500M from Al Rajhi Foods', time: '1 day ago', icon: '✅' },
                { type: 'ALERT', message: 'Repayment overdue alert', detail: '₦120M • 5 days past due', time: '1 day ago', icon: '⚠️' },
              ].map((activity, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', padding: '12px', background: colors.grayLighter, borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{activity.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: colors.navy, margin: 0 }}>{activity.message}</p>
                    <p style={{ fontSize: '12px', color: colors.gray, margin: '4px 0 0 0' }}>{activity.detail}</p>
                  </div>
                  <span style={{ fontSize: '11px', color: colors.gray, whiteSpace: 'nowrap' }}>{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
