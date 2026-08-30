'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// MASAR Design System Colors
const colors = {
  navy: '#0B1F3A',
  navyLight: '#142235',
  navyLighter: '#1a2f4a',
  gold: '#C9A24A',
  goldLight: '#D4B366',
  white: '#FFFFFF',
  gray: '#6B7280',
  grayLight: '#F3F4F6',
  grayLighter: '#F9FAFB',
  green: '#10B981',
  greenLight: '#D1FAE5',
  greenDark: '#059669',
  red: '#EF4444',
  redLight: '#FEE2E2',
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
  blue: '#3B82F6',
  blueLight: '#DBEAFE',
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
};

// Executive Dashboard Data Interface
interface ExecutiveData {
  kpis: {
    totalTransactionValue: number;
    activeTransactions: number;
    completedTransactions: number;
    pipelineValue: number;
    expectedSettlement: number;
    revenue: number;
    grossMargin: number;
    atRiskValue: number;
    blockedValue: number;
    slaBreaches: number;
    completionRate: number;
    averageCycleDays: number;
    clearanceScore: number;
    kybAutoClearRate: number;
  };
  pipeline: Array<{
    stage: string;
    count: number;
    value: number;
    blocked: number;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    severity: string;
    title: string;
    transaction?: string;
    value?: number;
    age?: number;
    action: string;
  }>;
  activity: Array<{
    id: string;
    type: string;
    transaction?: string;
    actor: string;
    timestamp: string;
  }>;
  risk: {
    total: number;
    byLevel: Record<string, { count: number; value: number }>;
    atRiskValue: number;
  };
  finance: {
    funding: { totalRequested: number; totalApproved: number; pending: number };
    escrow: { totalExpected: number; totalConfirmed: number };
    settlements: { totalCompleted: number; pending: number; processing: number };
  };
  compliance: {
    kyb: { total: number; approved: number; pending: number; autoClearRate: number };
    compliance: { total: number; ready: number; inProgress: number; readinessScore: number };
    documents: { total: number; verified: number; pending: number; expiring: number };
  };
  inspection: {
    total: number;
    passed: number;
    failed: number;
    pending: number;
    passRate: number;
  };
  logistics: {
    total: number;
    inTransit: number;
    arrived: number;
    delayed: number;
  };
  settlement: {
    total: number;
    completed: number;
    pending: number;
    totalValue: number;
  };
  systemHealth: {
    database: { status: string };
    api: { status: string };
    integrations: Array<{ name: string; status: string }>;
  };
}

export default function ExecutiveCommandCenter() {
  const router = useRouter();
  const [data, setData] = useState<ExecutiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch executive dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/v1/dashboard/executive');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setLastUpdated(new Date());
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    if (amount >= 1e9) return `${currency === 'NGN' ? '₦' : '$'}${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `${currency === 'NGN' ? '₦' : '$'}${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `${currency === 'NGN' ? '₦' : '$'}${(amount / 1e3).toFixed(1)}K`;
    return `${currency === 'NGN' ? '₦' : '$'}${amount.toFixed(2)}`;
  };

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return colors.red;
      case 'high': return colors.amber;
      case 'medium': return colors.blue;
      default: return colors.gray;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return colors.green;
      case 'degraded': return colors.amber;
      case 'unhealthy': return colors.red;
      default: return colors.gray;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: colors.grayLighter,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: colors.navy, margin: 0 }}>
            Loading Executive Command Center
          </h2>
          <p style={{ fontSize: '14px', color: colors.gray, margin: '8px 0 0 0' }}>
            Aggregating business intelligence...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: colors.grayLighter,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: colors.navy, margin: 0 }}>
            Unable to Load Dashboard
          </h2>
          <p style={{ fontSize: '14px', color: colors.gray, margin: '8px 0 16px 0' }}>
            Please check your connection and try again
          </p>
          <button 
            onClick={fetchDashboardData}
            style={{
              padding: '10px 24px',
              background: colors.gold,
              color: colors.navy,
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.grayLighter }}>
      {/* Executive Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
        padding: '20px 32px',
        color: colors.white,
        borderBottom: `3px solid ${colors.gold}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>
                Executive Command Center
              </h1>
              <span style={{
                padding: '4px 10px',
                background: colors.green,
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.white }} />
                LIVE
              </span>
            </div>
            <p style={{ fontSize: '14px', color: colors.gray, margin: 0 }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, Executive • 
              {lastUpdated && ` Last sync: ${lastUpdated.toLocaleTimeString()}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '8px 12px',
                background: colors.navyLighter,
                color: colors.white,
                border: `1px solid ${colors.gray}`,
                borderRadius: '6px',
                fontSize: '13px',
              }}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last Quarter</option>
              <option value="ytd">Year to Date</option>
            </select>
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              style={{
                padding: '8px 16px',
                background: refreshing ? colors.gray : colors.gold,
                color: colors.navy,
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: refreshing ? 'not-allowed' : 'pointer'
              }}
            >
              {refreshing ? '⟳ Refreshing...' : '↻ Refresh'}
            </button>
            <button style={{
              padding: '8px 16px',
              background: 'transparent',
              color: colors.white,
              border: `1px solid ${colors.gray}`,
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              📥 Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px 32px' }}>
        {/* KPI Strip */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          <KPICard
            title="Transaction Value"
            value={formatCurrency(data.kpis.totalTransactionValue)}
            change="+14.8%"
            changeType="positive"
            icon="💰"
          />
          <KPICard
            title="Active Transactions"
            value={formatNumber(data.kpis.activeTransactions)}
            subtitle={`${data.kpis.completionRate}% completion rate`}
            icon="📊"
          />
          <KPICard
            title="Revenue"
            value={formatCurrency(data.kpis.revenue)}
            change="+12.3%"
            changeType="positive"
            icon="📈"
          />
          <KPICard
            title="At-Risk Value"
            value={formatCurrency(data.kpis.atRiskValue)}
            changeType={data.kpis.atRiskValue > 0 ? 'warning' : 'positive'}
            icon="⚠️"
          />
          <KPICard
            title="SLA Breaches"
            value={formatNumber(data.kpis.slaBreaches)}
            changeType={data.kpis.slaBreaches > 0 ? 'negative' : 'positive'}
            icon="⏱️"
          />
        </div>

        {/* Alerts Section */}
        {data.alerts.length > 0 && (
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${colors.red}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔔 Requires Executive Attention
                <span style={{
                  padding: '2px 8px',
                  background: colors.redLight,
                  color: colors.red,
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {data.alerts.length}
                </span>
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {data.alerts.slice(0, 6).map((alert) => (
                <div key={alert.id} style={{
                  padding: '14px',
                  background: colors.grayLighter,
                  borderRadius: '8px',
                  borderLeft: `3px solid ${getSeverityColor(alert.severity)}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ 
                      padding: '2px 6px', 
                      background: getSeverityColor(alert.severity) + '20',
                      color: getSeverityColor(alert.severity),
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {alert.severity}
                    </span>
                    {alert.value && (
                      <span style={{ fontSize: '14px', fontWeight: 600, color: colors.navy }}>
                        {formatCurrency(alert.value)}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: colors.navy, margin: '0 0 4px 0', fontWeight: 500 }}>
                    {alert.title}
                  </p>
                  {alert.transaction && (
                    <p style={{ fontSize: '12px', color: colors.gray, margin: '0 0 8px 0' }}>
                      {alert.transaction} • {alert.age}h ago
                    </p>
                  )}
                  <button style={{
                    padding: '4px 10px',
                    background: colors.navy,
                    color: colors.white,
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}>
                    {alert.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction Pipeline */}
        <div style={{ 
          background: colors.white,
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
            Transaction Protocol Pipeline
          </h3>
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '8px' }}>
            {data.pipeline.map((stage, index) => (
              <div 
                key={stage.stage}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '16px 12px',
                  background: index === data.pipeline.length - 1 ? colors.greenLight : colors.grayLighter,
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onClick={() => router.push(`/dashboard/transactions?state=${stage.stage.toLowerCase()}`)}
              >
                <p style={{ fontSize: '11px', color: colors.gray, margin: '0 0 8px 0', fontWeight: 500 }}>
                  {stage.stage}
                </p>
                <p style={{ fontSize: '24px', fontWeight: 700, color: colors.navy, margin: '0 0 4px 0' }}>
                  {stage.count}
                </p>
                <p style={{ fontSize: '11px', color: colors.gray, margin: '0 0 8px 0' }}>
                  {formatCurrency(stage.value)}
                </p>
                {stage.blocked > 0 && (
                  <span style={{
                    padding: '2px 6px',
                    background: colors.redLight,
                    color: colors.red,
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600
                  }}>
                    {stage.blocked} blocked
                  </span>
                )}
                {index < data.pipeline.length - 1 && (
                  <div style={{ 
                    position: 'absolute', 
                    right: '-8px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: colors.gray,
                    fontSize: '16px'
                  }}>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Financial Intelligence */}
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
              Financial Intelligence
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <FinancialCard
                label="Total Funding"
                value={formatCurrency(data.finance.funding.totalApproved)}
                detail={`${data.finance.funding.pending} pending requests`}
                icon="💳"
              />
              <FinancialCard
                label="Escrow Secured"
                value={formatCurrency(data.finance.escrow.totalConfirmed)}
                detail={`${formatCurrency(data.finance.escrow.totalExpected)} expected`}
                icon="🔒"
              />
              <FinancialCard
                label="Settlements"
                value={formatCurrency(data.settlement.totalValue)}
                detail={`${data.settlement.completed} completed`}
                icon="✅"
              />
              <FinancialCard
                label="Gross Margin"
                value={formatCurrency(data.kpis.grossMargin)}
                detail={`${((data.kpis.grossMargin / data.kpis.revenue) * 100).toFixed(1)}% margin`}
                icon="📊"
              />
            </div>
          </div>

          {/* Risk Overview */}
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
              Risk Overview
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RiskLevelBar level="Critical" count={data.risk.byLevel.critical?.count || 0} value={data.risk.byLevel.critical?.value || 0} color={colors.red} />
              <RiskLevelBar level="High" count={data.risk.byLevel.high?.count || 0} value={data.risk.byLevel.high?.value || 0} color={colors.amber} />
              <RiskLevelBar level="Medium" count={data.risk.byLevel.medium?.count || 0} value={data.risk.byLevel.medium?.value || 0} color={colors.blue} />
              <RiskLevelBar level="Low" count={data.risk.byLevel.low?.count || 0} value={data.risk.byLevel.low?.value || 0} color={colors.green} />
            </div>
            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              background: data.risk.atRiskValue > 0 ? colors.amberLight : colors.greenLight,
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: colors.gray, margin: '0 0 4px 0' }}>Total At-Risk Value</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: data.risk.atRiskValue > 0 ? colors.amber : colors.green, margin: 0 }}>
                {formatCurrency(data.risk.atRiskValue)}
              </p>
            </div>
          </div>
        </div>

        {/* Operations Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {/* Compliance */}
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.navy, margin: 0 }}>Compliance</h4>
              <span style={{ fontSize: '20px' }}>📋</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <MetricRow label="KYB Approved" value={`${data.compliance.kyb.approved}/${data.compliance.kyb.total}`} />
              <MetricRow label="Auto-Clear Rate" value={`${data.compliance.kyb.autoClearRate}%`} />
              <MetricRow label="Compliance Ready" value={`${data.compliance.compliance.ready}`} />
              <MetricRow label="Readiness Score" value={`${data.compliance.compliance.readinessScore}%`} />
            </div>
          </div>

          {/* Inspection */}
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.navy, margin: 0 }}>Inspection</h4>
              <span style={{ fontSize: '20px' }}>🔍</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <MetricRow label="Pass Rate" value={`${data.inspection.passRate}%`} />
              <MetricRow label="Passed" value={`${data.inspection.passed}`} />
              <MetricRow label="Pending" value={`${data.inspection.pending}`} />
              <MetricRow label="Failed" value={`${data.inspection.failed}`} />
            </div>
          </div>

          {/* Logistics */}
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.navy, margin: 0 }}>Logistics</h4>
              <span style={{ fontSize: '20px' }}>🚢</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <MetricRow label="In Transit" value={`${data.logistics.inTransit}`} />
              <MetricRow label="Arrived" value={`${data.logistics.arrived}`} />
              <MetricRow label="Delayed" value={`${data.logistics.delayed}`} />
              <MetricRow label="Total Shipments" value={`${data.logistics.total}`} />
            </div>
          </div>

          {/* Settlement */}
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.navy, margin: 0 }}>Settlement</h4>
              <span style={{ fontSize: '20px' }}>💱</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <MetricRow label="Completed" value={`${data.settlement.completed}`} />
              <MetricRow label="Pending" value={`${data.settlement.pending}`} />
              <MetricRow label="Total Value" value={formatCurrency(data.settlement.totalValue)} />
              <MetricRow label="Avg Cycle" value={`${data.kpis.averageCycleDays.toFixed(1)}d`} />
            </div>
          </div>
        </div>

        {/* Activity Feed & System Health */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Activity Feed */}
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
              Recent Strategic Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
              {data.activity.slice(0, 10).map((event) => (
                <div key={event.id} style={{ 
                  display: 'flex', 
                  gap: '12px',
                  padding: '12px',
                  background: colors.grayLighter,
                  borderRadius: '8px'
                }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: colors.blue,
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  <div>
                    <p style={{ fontSize: '13px', color: colors.navy, margin: 0, fontWeight: 500 }}>
                      {event.type.replace(/_/g, ' ')}
                    </p>
                    <p style={{ fontSize: '12px', color: colors.gray, margin: '4px 0 0 0' }}>
                      {event.transaction && `${event.transaction} • `}{event.actor} • {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
              System Health
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SystemHealthRow label="Database" status={data.systemHealth.database.status} />
              <SystemHealthRow label="API" status={data.systemHealth.api.status} />
              {data.systemHealth.integrations.slice(0, 5).map((integration) => (
                <SystemHealthRow key={integration.name} label={integration.name} status={integration.status} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT HELPERS
// ============================================================

function KPICard({ title, value, change, changeType, subtitle, icon }: {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'warning';
  subtitle?: string;
  icon: string;
}) {
  const changeColor = changeType === 'positive' ? '#10B981' : changeType === 'negative' ? '#EF4444' : '#F59E0B';
  
  return (
    <div style={{
      background: colors.white,
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderTop: `3px solid ${changeType === 'negative' || changeType === 'warning' ? changeColor : colors.gold}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <p style={{ fontSize: '12px', color: colors.gray, margin: 0 }}>{title}</p>
        <span style={{ fontSize: '20px' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '28px', fontWeight: 700, color: colors.navy, margin: '0 0 4px 0' }}>
        {value}
      </p>
      {change && (
        <p style={{ fontSize: '12px', color: changeColor, margin: 0, fontWeight: 600 }}>
          {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '→'} {change}
        </p>
      )}
      {subtitle && (
        <p style={{ fontSize: '11px', color: colors.gray, margin: '4px 0 0 0' }}>{subtitle}</p>
      )}
    </div>
  );
}

function FinancialCard({ label, value, detail, icon }: {
  label: string;
  value: string;
  detail: string;
  icon: string;
}) {
  return (
    <div style={{ padding: '16px', background: colors.grayLighter, borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <p style={{ fontSize: '12px', color: colors.gray, margin: 0 }}>{label}</p>
        <span style={{ fontSize: '16px' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '22px', fontWeight: 700, color: colors.navy, margin: '0 0 4px 0' }}>{value}</p>
      <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>{detail}</p>
    </div>
  );
}

function RiskLevelBar({ level, count, value, color }: {
  level: string;
  count: number;
  value: number;
  color: string;
}) {
  const maxValue = 10000000; // $10M scale
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', color: colors.navy, fontWeight: 500 }}>{level}</span>
        <span style={{ fontSize: '12px', color: colors.gray }}>{count} transactions</span>
      </div>
      <div style={{ height: '8px', background: colors.grayLight, borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '4px' }} />
      </div>
      <p style={{ fontSize: '11px', color: colors.gray, margin: '2px 0 0 0', textAlign: 'right' }}>
        {value > 0 ? `$${(value / 1e6).toFixed(1)}M` : '$0'}
      </p>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '12px', color: colors.gray }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.navy }}>{value}</span>
    </div>
  );
}

function SystemHealthRow({ label, status }: { label: string; status: string }) {
  const statusColor = status === 'healthy' || status === 'active' ? colors.green : 
                      status === 'degraded' ? colors.amber : colors.red;
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: colors.grayLighter, borderRadius: '6px' }}>
      <span style={{ fontSize: '13px', color: colors.navy }}>{label}</span>
      <span style={{ 
        padding: '2px 8px',
        background: statusColor + '20',
        color: statusColor,
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600
      }}>
        {status}
      </span>
    </div>
  );
}
