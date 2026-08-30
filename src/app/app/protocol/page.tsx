'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// MASAR Design System Colors
const colors = {
  navy: '#0B1F3A',
  navyLight: '#142235',
  gold: '#C9A24A',
  goldLight: '#D4B366',
  white: '#FFFFFF',
  gray: '#6B7280',
  grayLight: '#F3F4F6',
  green: '#10B981',
  greenLight: '#D1FAE5',
  red: '#EF4444',
  redLight: '#FEE2E2',
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
  blue: '#3B82F6',
  blueLight: '#DBEAFE',
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE'
};

// Mock protocol data
const protocolData = {
  kpis: {
    transactionsAutomated: 47,
    kybAutoClearRate: 78,
    humanReviewRate: 18,
    complianceAutomationRate: 85,
    inspectionApiSuccessRate: 92,
    averageKybTime: 4.2, // hours
    averageComplianceTime: 18, // hours
    averageInspectionCycle: 36, // hours
    releaseReadiness: 94,
    exceptionRate: 8,
    automationFailureRate: 2
  },
  transactions: [
    {
      id: 'MASAR-SES-2026-000001',
      buyer: 'Al Rajhi Foods',
      exporter: 'Nigerian Sesame Co.',
      commodity: 'Sesame',
      quantity: '1,000 MT',
      value: '$500,000',
      state: 'RELEASE_ELIGIBLE',
      stateLabel: 'Release Eligible',
      confidence: 96,
      nextAction: 'Human Authorization',
      createdAt: '2026-08-15',
      lastUpdated: '2026-08-29 14:30'
    },
    {
      id: 'MASAR-SES-2026-000002',
      buyer: 'Saudi Grain Import',
      exporter: 'West Africa Agri',
      commodity: 'Sesame',
      quantity: '500 MT',
      value: '$250,000',
      state: 'INSPECTION_IN_PROGRESS',
      stateLabel: 'Inspection In Progress',
      confidence: 72,
      nextAction: 'Await Lab Results',
      createdAt: '2026-08-18',
      lastUpdated: '2026-08-29 12:15'
    },
    {
      id: 'MASAR-CAS-2026-000001',
      buyer: 'Jeddah Cashew Trading',
      exporter: 'Kaduna Cashew Ltd',
      commodity: 'Cashew',
      quantity: '200 MT',
      value: '$180,000',
      state: 'COMPLIANCE_REVIEW',
      stateLabel: 'Compliance Review',
      confidence: 58,
      nextAction: 'Complete Document Collection',
      createdAt: '2026-08-20',
      lastUpdated: '2026-08-29 10:45'
    },
    {
      id: 'MASAR-SES-2026-000003',
      buyer: 'Riyadh Food Industries',
      exporter: 'Lagos Export Hub',
      commodity: 'Sesame',
      quantity: '750 MT',
      value: '$375,000',
      state: 'COMPLETED',
      stateLabel: 'Completed',
      confidence: 100,
      nextAction: null,
      createdAt: '2026-08-01',
      lastUpdated: '2026-08-28 16:00'
    }
  ],
  kybStats: {
    total: 156,
    autoCleared: 122,
    humanReview: 28,
    blocked: 6,
    pending: 12,
    averageTime: 4.2
  },
  complianceStats: {
    totalPacks: 89,
    ready: 67,
    inProgress: 18,
    exceptions: 4,
    averageAssemblyTime: 18,
    documentVerificationRate: 94
  },
  inspectionStats: {
    totalRequests: 47,
    passed: 38,
    conditional: 5,
    failed: 4,
    averageCycleTime: 36,
    apiSuccessRate: 92
  },
  releaseStats: {
    eligible: 12,
    pendingApproval: 5,
    approved: 38,
    rejected: 2,
    averageReleaseTime: 2.5
  },
  slaMetrics: [
    { category: 'KYB & Sanctions', target: 72, actual: 4.2, status: 'ON_TRACK' },
    { category: 'Compliance Pack', target: 120, actual: 18, status: 'ON_TRACK' },
    { category: 'Inspection Booking', target: 48, actual: 24, status: 'ON_TRACK' },
    { category: 'Inspection Results', target: 72, actual: 36, status: 'ON_TRACK' },
    { category: 'Escrow Funding', target: 4, actual: 1.5, status: 'ON_TRACK' },
    { category: 'Dispute Handling', target: 120, actual: 72, status: 'ON_TRACK' }
  ],
  recentEvents: [
    { id: 1, type: 'RELEASE_ELIGIBLE', transaction: 'MASAR-SES-2026-000001', message: 'Transaction eligible for release', timestamp: '2026-08-29 14:30', severity: 'INFO' },
    { id: 2, type: 'INSPECTION_PASSED', transaction: 'MASAR-SES-2026-000001', message: 'Inspection passed - Quality score: 96%', timestamp: '2026-08-29 12:00', severity: 'SUCCESS' },
    { id: 3, type: 'DOCUMENT_UPLOADED', transaction: 'MASAR-CAS-2026-000001', message: 'Certificate of Origin uploaded', timestamp: '2026-08-29 10:45', severity: 'INFO' },
    { id: 4, type: 'KYB_AUTO_CLEAR', transaction: 'MASAR-SES-2026-000002', message: 'Exporter KYB auto-cleared', timestamp: '2026-08-29 09:30', severity: 'SUCCESS' },
    { id: 5, type: 'SLA_WARNING', transaction: 'MASAR-CAS-2026-000001', message: 'Compliance SLA at 75%', timestamp: '2026-08-29 08:15', severity: 'WARNING' },
    { id: 6, type: 'SETTLEMENT_COMPLETED', transaction: 'MASAR-SES-2026-000003', message: 'Settlement completed: $375,000', timestamp: '2026-08-28 16:00', severity: 'SUCCESS' }
  ],
  integrationHealth: [
    { name: 'KYB Provider', status: 'OPERATIONAL', latency: 420, lastSync: '14:42', errors: 0 },
    { name: 'Sanctions Database', status: 'OPERATIONAL', latency: 510, lastSync: '14:41', errors: 0 },
    { name: 'Inspection Partner', status: 'OPERATIONAL', latency: 680, lastSync: '14:40', errors: 1 },
    { name: 'Laboratory', status: 'OPERATIONAL', latency: 820, lastSync: '14:38', errors: 0 },
    { name: 'E-Invoice (ZATCA)', status: 'OPERATIONAL', latency: 390, lastSync: '14:37', errors: 0 },
    { name: 'Finance Partner', status: 'DEGRADED', latency: 1800, lastSync: '14:32', errors: 3 }
  ]
};

export default function ProtocolCommandCenter() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  const getStateColor = (state: string) => {
    if (state === 'COMPLETED') return colors.green;
    if (state.includes('EXCEPTION') || state.includes('FAILED') || state.includes('DECLINED')) return colors.red;
    if (state.includes('DELAY') || state.includes('VARIANCE')) return colors.amber;
    return colors.blue;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'SUCCESS': return colors.green;
      case 'WARNING': return colors.amber;
      case 'ERROR': return colors.red;
      default: return colors.blue;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return colors.green;
      case 'DEGRADED': return colors.amber;
      case 'DOWN': return colors.red;
      default: return colors.gray;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.grayLight }}>
      {/* Header */}
      <div style={{ background: colors.navy, padding: '24px 32px', color: colors.white }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>
              Protocol Command Center
            </h1>
            <p style={{ fontSize: '14px', color: colors.gray, margin: '4px 0 0 0' }}>
              MASAR Protocol Automation Engine — V1
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => router.push('/app/protocol/rules')}
              style={{
                padding: '10px 20px',
                background: colors.gold,
                color: colors.navy,
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Rule Engine
            </button>
            <button
              onClick={() => router.push('/app/protocol/sandbox')}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                color: colors.white,
                border: `1px solid ${colors.gray}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Sandbox Mode
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ background: colors.white, borderBottom: `1px solid ${colors.grayLight}` }}>
        <div style={{ display: 'flex', padding: '0 32px' }}>
          {['overview', 'transactions', 'kyb', 'compliance', 'inspection', 'release', 'sla', 'integrations', 'audit'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? `3px solid ${colors.gold}` : '3px solid transparent',
                color: activeTab === tab ? colors.navy : colors.gray,
                fontSize: '14px',
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px' }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <KPICard
                title="Transactions Automated"
                value={protocolData.kpis.transactionsAutomated}
                icon="⚡"
                color={colors.blue}
              />
              <KPICard
                title="KYB Auto-Clear Rate"
                value={`${protocolData.kpis.kybAutoClearRate}%`}
                icon="✓"
                color={colors.green}
              />
              <KPICard
                title="Compliance Automation"
                value={`${protocolData.kpis.complianceAutomationRate}%`}
                icon="📋"
                color={colors.purple}
              />
              <KPICard
                title="Release Readiness"
                value={`${protocolData.kpis.releaseReadiness}%`}
                icon="🔓"
                color={colors.gold}
              />
            </div>

            {/* Secondary KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <MiniKPI label="Avg KYB Time" value={`${protocolData.kpis.averageKybTime}h`} target="72h" />
              <MiniKPI label="Avg Compliance" value={`${protocolData.kpis.averageComplianceTime}h`} target="120h" />
              <MiniKPI label="Avg Inspection" value={`${protocolData.kpis.averageInspectionCycle}h`} target="72h" />
              <MiniKPI label="Human Review" value={`${protocolData.kpis.humanReviewRate}%`} target="<20%" />
              <MiniKPI label="Exception Rate" value={`${protocolData.kpis.exceptionRate}%`} target="<10%" />
              <MiniKPI label="API Success" value={`${protocolData.kpis.inspectionApiSuccessRate}%`} target=">90%" />
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              {/* Active Transactions */}
              <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
                  Active Transactions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {protocolData.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTransaction(tx.id)}
                      style={{
                        padding: '16px',
                        background: selectedTransaction === tx.id ? colors.blueLight : colors.grayLight,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: selectedTransaction === tx.id ? `2px solid ${colors.blue}` : '2px solid transparent'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: colors.navy }}>{tx.id}</span>
                        <span style={{
                          padding: '4px 8px',
                          background: getStateColor(tx.state) + '20',
                          color: getStateColor(tx.state),
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {tx.stateLabel}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: colors.gray }}>
                        <span>{tx.buyer} → {tx.exporter}</span>
                        <span>{tx.value}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
                        <span style={{ color: colors.gray }}>Confidence: {tx.confidence}%</span>
                        <span style={{ color: colors.blue, fontWeight: 500 }}>{tx.nextAction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Events */}
              <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
                  Protocol Events
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {protocolData.recentEvents.map((event) => (
                    <div key={event.id} style={{ display: 'flex', gap: '12px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getSeverityColor(event.severity),
                        marginTop: '6px',
                        flexShrink: 0
                      }} />
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: colors.navy, margin: 0 }}>
                          {event.message}
                        </p>
                        <p style={{ fontSize: '12px', color: colors.gray, margin: '4px 0 0 0' }}>
                          {event.transaction} • {event.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: 0 }}>
                  Transaction Pipeline
                </h3>
                <button style={{
                  padding: '8px 16px',
                  background: colors.gold,
                  color: colors.navy,
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  + New Transaction
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.grayLight}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Transaction ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Buyer</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Exporter</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Commodity</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Value</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>State</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Confidence</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Next Action</th>
                  </tr>
                </thead>
                <tbody>
                  {protocolData.transactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: `1px solid ${colors.grayLight}` }}>
                      <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: 600, color: colors.navy }}>{tx.id}</td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: colors.navy }}>{tx.buyer}</td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: colors.navy }}>{tx.exporter}</td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: colors.navy }}>{tx.commodity}</td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: 600, color: colors.navy }}>{tx.value}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          background: getStateColor(tx.state) + '20',
                          color: getStateColor(tx.state),
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {tx.stateLabel}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '40px',
                            height: '4px',
                            background: colors.grayLight,
                            borderRadius: '2px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${tx.confidence}%`,
                              height: '100%',
                              background: tx.confidence >= 80 ? colors.green : tx.confidence >= 60 ? colors.amber : colors.red,
                              borderRadius: '2px'
                            }} />
                          </div>
                          <span style={{ fontSize: '13px', color: colors.navy }}>{tx.confidence}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '13px', color: colors.blue }}>{tx.nextAction || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* KYB Tab */}
        {activeTab === 'kyb' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
              <StatCard title="Total KYB" value={protocolData.kybStats.total} color={colors.blue} />
              <StatCard title="Auto-Cleared" value={protocolData.kybStats.autoCleared} color={colors.green} />
              <StatCard title="Human Review" value={protocolData.kybStats.humanReview} color={colors.amber} />
              <StatCard title="Blocked" value={protocolData.kybStats.blocked} color={colors.red} />
            </div>
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
                KYB Automation Performance
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.gray, margin: '0 0 12px 0' }}>Decision Distribution</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <ProgressBar label="Auto-Clear" value={protocolData.kybStats.autoCleared} total={protocolData.kybStats.total} color={colors.green} />
                    <ProgressBar label="Human Review" value={protocolData.kybStats.humanReview} total={protocolData.kybStats.total} color={colors.amber} />
                    <ProgressBar label="Blocked" value={protocolData.kybStats.blocked} total={protocolData.kybStats.total} color={colors.red} />
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.gray, margin: '0 0 12px 0' }}>Performance Metrics</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetricRow label="Average KYB Time" value={`${protocolData.kybStats.averageTime} hours`} target="72 hours" status="EXCELLENT" />
                    <MetricRow label="Auto-Clear Rate" value={`${Math.round((protocolData.kybStats.autoCleared / protocolData.kybStats.total) * 100)}%`} target=">70%" status="GOOD" />
                    <MetricRow label="Pending Reviews" value={protocolData.kybStats.pending.toString()} target="<20" status="GOOD" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
              <StatCard title="Total Packs" value={protocolData.complianceStats.totalPacks} color={colors.blue} />
              <StatCard title="Ready" value={protocolData.complianceStats.ready} color={colors.green} />
              <StatCard title="In Progress" value={protocolData.complianceStats.inProgress} color={colors.amber} />
              <StatCard title="Exceptions" value={protocolData.complianceStats.exceptions} color={colors.red} />
            </div>
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
                Compliance Automation
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div style={{ textAlign: 'center', padding: '24px', background: colors.greenLight, borderRadius: '8px' }}>
                  <p style={{ fontSize: '36px', fontWeight: 700, color: colors.green, margin: 0 }}>{protocolData.complianceStats.documentVerificationRate}%</p>
                  <p style={{ fontSize: '14px', color: colors.gray, margin: '8px 0 0 0' }}>Document Verification Rate</p>
                </div>
                <div style={{ textAlign: 'center', padding: '24px', background: colors.blueLight, borderRadius: '8px' }}>
                  <p style={{ fontSize: '36px', fontWeight: 700, color: colors.blue, margin: 0 }}>{protocolData.complianceStats.averageAssemblyTime}h</p>
                  <p style={{ fontSize: '14px', color: colors.gray, margin: '8px 0 0 0' }}>Avg Assembly Time</p>
                </div>
                <div style={{ textAlign: 'center', padding: '24px', background: colors.purpleLight, borderRadius: '8px' }}>
                  <p style={{ fontSize: '36px', fontWeight: 700, color: colors.purple, margin: 0 }}>{protocolData.kpis.complianceAutomationRate}%</p>
                  <p style={{ fontSize: '14px', color: colors.gray, margin: '8px 0 0 0' }}>Automation Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inspection Tab */}
        {activeTab === 'inspection' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
              <StatCard title="Total Requests" value={protocolData.inspectionStats.totalRequests} color={colors.blue} />
              <StatCard title="Passed" value={protocolData.inspectionStats.passed} color={colors.green} />
              <StatCard title="Conditional" value={protocolData.inspectionStats.conditional} color={colors.amber} />
              <StatCard title="Failed" value={protocolData.inspectionStats.failed} color={colors.red} />
            </div>
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
                Inspection Integration
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.gray, margin: '0 0 12px 0' }}>Results Distribution</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <ProgressBar label="Passed" value={protocolData.inspectionStats.passed} total={protocolData.inspectionStats.totalRequests} color={colors.green} />
                    <ProgressBar label="Conditional" value={protocolData.inspectionStats.conditional} total={protocolData.inspectionStats.totalRequests} color={colors.amber} />
                    <ProgressBar label="Failed" value={protocolData.inspectionStats.failed} total={protocolData.inspectionStats.totalRequests} color={colors.red} />
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.gray, margin: '0 0 12px 0' }}>Performance</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetricRow label="Average Cycle Time" value={`${protocolData.inspectionStats.averageCycleTime} hours`} target="72 hours" status="GOOD" />
                    <MetricRow label="API Success Rate" value={`${protocolData.inspectionStats.apiSuccessRate}%`} target=">90%" status="EXCELLENT" />
                    <MetricRow label="Pass Rate" value={`${Math.round((protocolData.inspectionStats.passed / protocolData.inspectionStats.totalRequests) * 100)}%`} target=">80%" status="GOOD" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Release Tab */}
        {activeTab === 'release' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
              <StatCard title="Eligible" value={protocolData.releaseStats.eligible} color={colors.blue} />
              <StatCard title="Pending Approval" value={protocolData.releaseStats.pendingApproval} color={colors.amber} />
              <StatCard title="Approved" value={protocolData.releaseStats.approved} color={colors.green} />
              <StatCard title="Rejected" value={protocolData.releaseStats.rejected} color={colors.red} />
            </div>
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
                Release Engine
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.gray, margin: '0 0 12px 0' }}>Release Pipeline</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <ProgressBar label="Eligible" value={protocolData.releaseStats.eligible} total={57} color={colors.blue} />
                    <ProgressBar label="Pending" value={protocolData.releaseStats.pendingApproval} total={57} color={colors.amber} />
                    <ProgressBar label="Approved" value={protocolData.releaseStats.approved} total={57} color={colors.green} />
                    <ProgressBar label="Rejected" value={protocolData.releaseStats.rejected} total={57} color={colors.red} />
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.gray, margin: '0 0 12px 0' }}>Performance</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <MetricRow label="Average Release Time" value={`${protocolData.releaseStats.averageReleaseTime} hours`} target="<4 hours" status="EXCELLENT" />
                    <MetricRow label="Approval Rate" value={`${Math.round((protocolData.releaseStats.approved / (protocolData.releaseStats.approved + protocolData.releaseStats.rejected)) * 100)}%`} target=">95%" status="GOOD" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLA Tab */}
        {activeTab === 'sla' && (
          <div>
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
                SLA Performance
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.grayLight}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Category</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Target</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Actual</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Performance</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {protocolData.slaMetrics.map((metric, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${colors.grayLight}` }}>
                      <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: 500, color: colors.navy }}>{metric.category}</td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: colors.gray }}>{metric.target}h</td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: colors.navy }}>{metric.actual}h</td>
                      <td style={{ padding: '16px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '100px',
                            height: '6px',
                            background: colors.grayLight,
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${Math.min((metric.actual / metric.target) * 100, 100)}%`,
                              height: '100%',
                              background: metric.status === 'ON_TRACK' ? colors.green : metric.status === 'AT_RISK' ? colors.amber : colors.red,
                              borderRadius: '3px'
                            }} />
                          </div>
                          <span style={{ fontSize: '13px', color: colors.navy }}>
                            {Math.round((metric.actual / metric.target) * 100)}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          background: metric.status === 'ON_TRACK' ? colors.greenLight : metric.status === 'AT_RISK' ? colors.amberLight : colors.redLight,
                          color: metric.status === 'ON_TRACK' ? colors.green : metric.status === 'AT_RISK' ? colors.amber : colors.red,
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {metric.status === 'ON_TRACK' ? 'On Track' : metric.status === 'AT_RISK' ? 'At Risk' : 'Breached'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div>
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
                Integration Health
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.grayLight}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Integration</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Latency</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Last Sync</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {protocolData.integrationHealth.map((integration, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${colors.grayLight}` }}>
                      <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: 500, color: colors.navy }}>{integration.name}</td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          background: getStatusColor(integration.status) + '20',
                          color: getStatusColor(integration.status),
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600
                        }}>
                          {integration.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: colors.navy }}>{integration.latency}ms</td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: colors.gray }}>{integration.lastSync}</td>
                      <td style={{ padding: '16px 12px', fontSize: '14px', color: integration.errors > 0 ? colors.red : colors.green }}>
                        {integration.errors}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div>
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
                Audit Ledger
              </h3>
              <p style={{ fontSize: '14px', color: colors.gray, margin: '0 0 20px 0' }}>
                Immutable evidence chain for all protocol actions
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {protocolData.recentEvents.map((event) => (
                  <div key={event.id} style={{
                    padding: '16px',
                    background: colors.grayLight,
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getSeverityColor(event.severity)
                      }} />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: colors.navy, margin: 0 }}>
                          {event.type}
                        </p>
                        <p style={{ fontSize: '13px', color: colors.gray, margin: '4px 0 0 0' }}>
                          {event.message}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '13px', color: colors.navy, margin: 0 }}>{event.transaction}</p>
                      <p style={{ fontSize: '12px', color: colors.gray, margin: '4px 0 0 0' }}>{event.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT HELPERS
// ============================================================

function KPICard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  return (
    <div style={{
      background: colors.white,
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderTop: `4px solid ${color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '13px', color: colors.gray, margin: '0 0 8px 0' }}>{title}</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: colors.navy, margin: 0 }}>{value}</p>
        </div>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
    </div>
  );
}

function MiniKPI({ label, value, target }: { label: string; value: string; target: string }) {
  return (
    <div style={{
      background: colors.white,
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <p style={{ fontSize: '12px', color: colors.gray, margin: '0 0 8px 0' }}>{label}</p>
      <p style={{ fontSize: '24px', fontWeight: 700, color: colors.navy, margin: '0 0 4px 0' }}>{value}</p>
      <p style={{ fontSize: '11px', color: colors.green, margin: 0 }}>Target: {target}</p>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div style={{
      background: colors.white,
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderTop: `4px solid ${color}`
    }}>
      <p style={{ fontSize: '13px', color: colors.gray, margin: '0 0 8px 0' }}>{title}</p>
      <p style={{ fontSize: '36px', fontWeight: 700, color: colors.navy, margin: 0 }}>{value}</p>
    </div>
  );
}

function ProgressBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = Math.round((value / total) * 100);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', color: colors.navy }}>{label}</span>
        <span style={{ fontSize: '13px', color: colors.gray }}>{value} ({percentage}%)</span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        background: colors.grayLight,
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: '4px'
        }} />
      </div>
    </div>
  );
}

function MetricRow({ label, value, target, status }: { label: string; value: string; target: string; status: string }) {
  const statusColor = status === 'EXCELLENT' ? colors.green : status === 'GOOD' ? colors.blue : colors.amber;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      background: colors.grayLight,
      borderRadius: '6px'
    }}>
      <div>
        <p style={{ fontSize: '13px', color: colors.gray, margin: 0 }}>{label}</p>
        <p style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '4px 0 0 0' }}>{value}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: '12px', color: colors.gray, margin: 0 }}>Target: {target}</p>
        <p style={{ fontSize: '12px', color: statusColor, margin: '4px 0 0 0', fontWeight: 600 }}>{status}</p>
      </div>
    </div>
  );
}
