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
  red: '#EF4444',
  redLight: '#FEE2E2',
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
  blue: '#3B82F6',
  blueLight: '#DBEAFE',
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
  teal: '#14B8A6',
  tealLight: '#CCFBF1',
};

// Exporter Dashboard Data Interface
interface ExporterData {
  kpis: {
    activeExportOrders: number;
    totalExportValue: number;
    confirmedOrders: number;
    pipelineValue: number;
    goodsInTransit: number;
    pendingDocumentation: number;
    outstandingReceivables: number;
    expectedSettlement: number;
    openExceptions: number;
    completionRate: number;
    averageOrderValue: number;
  };
  pipeline: Array<{
    stage: string;
    count: number;
    value: number;
    blocked: number;
  }>;
  actions: Array<{
    type: string;
    priority: string;
    title: string;
    description: string;
    transactionId?: string;
    transactionNumber?: string;
    dueDate?: string;
    action: string;
  }>;
  transactions: Array<{
    id: string;
    transactionNumber: string;
    currentState: string;
    value: number;
    currency: string;
    quantity: number;
    unit: string;
    buyer: string;
    commodity: string;
    progress: number;
    lastUpdated: string;
  }>;
  inventory: {
    totalProducts: number;
    availableStock: number;
    allocatedStock: number;
    reservedStock: number;
    inProduction: number;
    inInspection: number;
    readyForShipment: number;
    shipped: number;
    lowStockAlerts: number;
  };
  finance: {
    totalInvoiced: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    settlementsCompleted: number;
    settlementsPending: number;
    totalRevenue: number;
  };
  shipments: Array<{
    id: string;
    reference: string;
    status: string;
    carrier: string;
    vessel: string;
    origin: string;
    destination: string;
    eta: string;
    transactionNumber: string;
    buyer: string;
    progress: number;
  }>;
  compliance: {
    kybStatus: string;
    kybExpiring: boolean;
    documentsVerified: number;
    documentsPending: number;
    documentsExpiring: number;
    totalDocuments: number;
  };
  exceptions: Array<{
    id: string;
    type: string;
    severity: string;
    status: string;
    description: string;
    transactionNumber: string;
    value: number;
    age: number;
  }>;
  analytics: {
    totalTransactions: number;
    completedTransactions: number;
    totalExportValue: number;
    averageOrderValue: number;
    completionRate: number;
  };
  activity: Array<{
    id: string;
    type: string;
    transactionNumber: string;
    actor: string;
    timestamp: string;
  }>;
  exporterHealth: {
    kybStatus: string;
    kybExpiring: boolean;
    documentIssues: number;
    verified: boolean;
    warnings: string[];
  };
}

export default function ExporterDashboard() {
  const router = useRouter();
  const [data, setData] = useState<ExporterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch exporter dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/exporter/dashboard');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setLastUpdated(new Date());
        }
      }
    } catch (error) {
      console.error('Failed to fetch exporter dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const symbols: Record<string, string> = { USD: '$', NGN: '₦', SAR: '﷼', EUR: '€', GBP: '£' };
    const symbol = symbols[currency] || '$';
    if (amount >= 1e6) return `${symbol}${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `${symbol}${(amount / 1e3).toFixed(1)}K`;
    return `${symbol}${amount.toFixed(2)}`;
  };

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Get state color
  const getStateColor = (state: string) => {
    if (state === 'COMPLETED') return colors.green;
    if (state.includes('EXCEPTION') || state.includes('FAILED') || state.includes('DECLINED')) return colors.red;
    if (state.includes('DELAY') || state.includes('VARIANCE')) return colors.amber;
    return colors.blue;
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

  // Format state label
  const formatState = (state: string) => {
    return state.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: colors.navy, margin: 0 }}>
            Loading Exporter Workspace
          </h2>
          <p style={{ fontSize: '14px', color: colors.gray, margin: '8px 0 0 0' }}>
            Fetching export operations data...
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
          <button
            onClick={fetchDashboardData}
            style={{
              marginTop: '16px',
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
      {/* Exporter Header */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
        padding: '24px 32px',
        color: colors.white,
        borderBottom: `3px solid ${colors.teal}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>
                Exporter Workspace
              </h1>
              <span style={{
                padding: '4px 10px',
                background: data.exporterHealth.verified ? colors.green : colors.amber,
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.white }} />
                {data.exporterHealth.verified ? 'Verified' : 'Pending'}
              </span>
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
                ● Operational
              </span>
            </div>
            <p style={{ fontSize: '14px', color: colors.gray, margin: 0 }}>
              MASAR Export Command Center
              {lastUpdated && ` • Last sync: ${lastUpdated.toLocaleTimeString()}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => router.push('/exporter/opportunities')}
              style={{
                padding: '10px 20px',
                background: colors.teal,
                color: colors.white,
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Browse Opportunities
            </button>
            <button
              onClick={() => router.push('/exporter/quotations/new')}
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
              + Create Offer
            </button>
            <button
              onClick={() => router.push('/exporter/transactions/new')}
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
              + New Export
            </button>
          </div>
        </div>
      </div>

      {/* Health Banner */}
      {data.exporterHealth.warnings.length > 0 && (
        <div style={{
          background: colors.amberLight,
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            {data.exporterHealth.warnings.map((warning, index) => (
              <span key={index} style={{
                fontSize: '13px',
                color: colors.navy,
                marginRight: '24px'
              }}>
                {warning}
              </span>
            ))}
          </div>
          <button style={{
            padding: '6px 12px',
            background: colors.amber,
            color: colors.white,
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Take Action
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{
        background: colors.white,
        borderBottom: `1px solid ${colors.grayLight}`,
        padding: '0 32px',
        overflowX: 'auto'
      }}>
        <div style={{ display: 'flex', gap: '0', minWidth: 'max-content' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'pipeline', label: 'Pipeline' },
            { id: 'compliance', label: 'Compliance' },
            { id: 'documents', label: 'Documents' },
            { id: 'inspections', label: 'Inspections' },
            { id: 'logistics', label: 'Logistics' },
            { id: 'finance', label: 'Finance' },
            { id: 'inventory', label: 'Inventory' },
            { id: 'exceptions', label: 'Exceptions' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 18px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? `3px solid ${colors.teal}` : '3px solid transparent',
                color: activeTab === tab.id ? colors.navy : colors.gray,
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
              {tab.id === 'exceptions' && data.exceptions.length > 0 && (
                <span style={{
                  marginLeft: '6px',
                  padding: '2px 6px',
                  background: colors.red,
                  color: colors.white,
                  borderRadius: '10px',
                  fontSize: '10px',
                  fontWeight: 600
                }}>
                  {data.exceptions.length}
                </span>
              )}
            </button>
          ))}
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
            title="Active Export Orders"
            value={data.kpis.activeExportOrders.toString()}
            icon="📦"
            color={colors.teal}
          />
          <KPICard
            title="Total Export Value"
            value={formatCurrency(data.kpis.totalExportValue)}
            icon="💰"
            color={colors.green}
          />
          <KPICard
            title="Pipeline Value"
            value={formatCurrency(data.kpis.pipelineValue)}
            icon="📊"
            color={colors.blue}
          />
          <KPICard
            title="Goods in Transit"
            value={data.kpis.goodsInTransit.toString()}
            icon="🚢"
            color={colors.purple}
          />
          <KPICard
            title="Outstanding Receivables"
            value={formatCurrency(data.kpis.outstandingReceivables)}
            icon="💳"
            color={colors.amber}
          />
        </div>

        {/* Export Pipeline */}
        <div style={{
          background: colors.white,
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
            Export Pipeline
          </h3>
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '8px' }}>
            {data.pipeline.map((stage, index) => (
              <div
                key={stage.stage}
                style={{
                  flex: 1,
                  minWidth: '100px',
                  padding: '14px 10px',
                  background: stage.count > 0 ? colors.tealLight : colors.grayLighter,
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => router.push(`/exporter/transactions?stage=${stage.stage.toLowerCase()}`)}
              >
                <p style={{ fontSize: '10px', color: colors.gray, margin: '0 0 6px 0', fontWeight: 500 }}>
                  {stage.stage}
                </p>
                <p style={{ fontSize: '22px', fontWeight: 700, color: colors.navy, margin: '0 0 2px 0' }}>
                  {stage.count}
                </p>
                <p style={{ fontSize: '10px', color: colors.gray, margin: '0 0 6px 0' }}>
                  {formatCurrency(stage.value)}
                </p>
                {stage.blocked > 0 && (
                  <span style={{
                    padding: '1px 5px',
                    background: colors.redLight,
                    color: colors.red,
                    borderRadius: '4px',
                    fontSize: '9px',
                    fontWeight: 600
                  }}>
                    {stage.blocked} blocked
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Required & Exporter Health */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Actions Required */}
          <div style={{
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>
              Action Required
              {data.actions.length > 0 && (
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  background: colors.redLight,
                  color: colors.red,
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {data.actions.length}
                </span>
              )}
            </h3>
            {data.actions.length === 0 ? (
              <div style={{
                padding: '32px',
                textAlign: 'center',
                background: colors.greenLight,
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '32px' }}>✓</span>
                <p style={{ fontSize: '14px', color: colors.green, margin: '8px 0 0 0', fontWeight: 600 }}>
                  All caught up! No pending actions.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.actions.slice(0, 6).map((action, index) => (
                  <div key={index} style={{
                    padding: '14px',
                    background: colors.grayLighter,
                    borderRadius: '8px',
                    borderLeft: `3px solid ${getSeverityColor(action.priority)}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, margin: '0 0 2px 0' }}>
                        {action.title}
                      </p>
                      <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>
                        {action.description}
                        {action.transactionNumber && ` • ${action.transactionNumber}`}
                      </p>
                    </div>
                    <button style={{
                      padding: '5px 12px',
                      background: colors.navy,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      {action.action}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exporter Health */}
          <div style={{
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>
              Exporter Health
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <HealthIndicator
                label="KYB Status"
                status={data.exporterHealth.kybStatus === 'approved' ? 'Verified' : 'Pending'}
                color={data.exporterHealth.kybStatus === 'approved' ? colors.green : colors.amber}
              />
              <HealthIndicator
                label="Documents"
                status={data.compliance.documentsPending === 0 ? 'Complete' : `${data.compliance.documentsPending} Pending`}
                color={data.compliance.documentsPending === 0 ? colors.green : colors.amber}
              />
              <HealthIndicator
                label="Compliance"
                status={data.compliance.kybExpiring ? 'Renewal Required' : 'Active'}
                color={data.compliance.kybExpiring ? colors.red : colors.green}
              />
              <HealthIndicator
                label="Export Eligibility"
                status={data.exporterHealth.verified ? 'Eligible' : 'Under Review'}
                color={data.exporterHealth.verified ? colors.green : colors.amber}
              />
            </div>
          </div>
        </div>

        {/* Active Transactions */}
        <div style={{
          background: colors.white,
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: 0 }}>
              Active Export Transactions
            </h3>
            <button
              onClick={() => router.push('/exporter/transactions')}
              style={{
                padding: '6px 12px',
                background: colors.grayLight,
                color: colors.navy,
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              View All
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.grayLight}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.gray }}>Transaction</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.gray }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.gray }}>Buyer</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.gray }}>Quantity</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.gray }}>Value</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.gray }}>Stage</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.gray }}>Progress</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.gray }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.slice(0, 8).map((tx) => (
                <tr key={tx.id} style={{ borderBottom: `1px solid ${colors.grayLight}` }}>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.navy }}>
                      {tx.transactionNumber}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '13px', color: colors.navy }}>
                    {tx.commodity}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '13px', color: colors.gray }}>
                    {tx.buyer}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '13px', color: colors.navy }}>
                    {formatNumber(tx.quantity)} {tx.unit}
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '13px', fontWeight: 600, color: colors.navy }}>
                    {formatCurrency(tx.value, tx.currency)}
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{
                      padding: '3px 7px',
                      background: getStateColor(tx.currentState) + '20',
                      color: getStateColor(tx.currentState),
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600
                    }}>
                      {formatState(tx.currentState)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '50px', height: '5px', background: colors.grayLight, borderRadius: '3px' }}>
                        <div style={{ width: `${tx.progress}%`, height: '100%', background: colors.teal, borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '11px', color: colors.gray }}>{tx.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <button
                      onClick={() => router.push(`/exporter/transactions/${tx.id}`)}
                      style={{
                        padding: '3px 9px',
                        background: colors.navy,
                        color: colors.white,
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shipment & Finance */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Shipments */}
          <div style={{
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>
              Shipment Tracking
            </h3>
            {data.shipments.length === 0 ? (
              <p style={{ fontSize: '14px', color: colors.gray, textAlign: 'center', padding: '24px' }}>
                No active shipments
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.shipments.slice(0, 4).map((shipment) => (
                  <div key={shipment.id} style={{
                    padding: '14px',
                    background: colors.grayLighter,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => router.push(`/exporter/logistics/${shipment.id}`)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.navy }}>
                        {shipment.transactionNumber}
                      </span>
                      <span style={{
                        padding: '2px 7px',
                        background: shipment.status === 'in_transit' ? colors.blueLight : colors.amberLight,
                        color: shipment.status === 'in_transit' ? colors.blue : colors.amber,
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 600
                      }}>
                        {shipment.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: colors.gray, margin: '0 0 6px 0' }}>
                      {shipment.origin} → {shipment.destination} • {shipment.buyer}
                    </p>
                    <div style={{ width: '100%', height: '5px', background: colors.grayLight, borderRadius: '3px', marginBottom: '6px' }}>
                      <div style={{ width: `${shipment.progress}%`, height: '100%', background: colors.teal, borderRadius: '3px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '10px', color: colors.gray }}>ETA</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: colors.navy }}>
                        {shipment.eta ? new Date(shipment.eta).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Finance */}
          <div style={{
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>
              Financial Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <FinancialCard label="Total Revenue" value={formatCurrency(data.finance.totalRevenue)} color={colors.green} />
              <FinancialCard label="Invoiced" value={formatCurrency(data.finance.totalInvoiced)} />
              <FinancialCard label="Collected" value={formatCurrency(data.finance.paidAmount)} color={colors.green} />
              <FinancialCard label="Outstanding" value={formatCurrency(data.finance.pendingAmount)} color={colors.amber} />
            </div>
            {data.finance.overdueAmount > 0 && (
              <div style={{
                padding: '12px',
                background: colors.redLight,
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '12px', color: colors.red, fontWeight: 600 }}>Overdue Invoices</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: colors.red }}>
                  {formatCurrency(data.finance.overdueAmount)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Exceptions & Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Exceptions */}
          <div style={{
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>
              Exceptions
              {data.exceptions.length > 0 && (
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  background: colors.redLight,
                  color: colors.red,
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {data.exceptions.length}
                </span>
              )}
            </h3>
            {data.exceptions.length === 0 ? (
              <div style={{
                padding: '24px',
                textAlign: 'center',
                background: colors.greenLight,
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '24px' }}>✓</span>
                <p style={{ fontSize: '14px', color: colors.green, margin: '8px 0 0 0', fontWeight: 600 }}>
                  No open exceptions
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.exceptions.slice(0, 5).map((exception) => (
                  <div key={exception.id} style={{
                    padding: '12px',
                    background: colors.grayLighter,
                    borderRadius: '8px',
                    borderLeft: `3px solid ${getSeverityColor(exception.severity)}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: getSeverityColor(exception.severity),
                        textTransform: 'uppercase'
                      }}>
                        {exception.severity}
                      </span>
                      <span style={{ fontSize: '10px', color: colors.gray }}>{exception.age}h ago</span>
                    </div>
                    <p style={{ fontSize: '12px', color: colors.navy, margin: '0 0 2px 0' }}>
                      {exception.description}
                    </p>
                    <p style={{ fontSize: '10px', color: colors.gray, margin: 0 }}>
                      {exception.transactionNumber}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div style={{
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
              {data.activity.slice(0, 8).map((event) => (
                <div key={event.id} style={{ display: 'flex', gap: '10px' }}>
                  <div style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: colors.teal,
                    marginTop: '5px',
                    flexShrink: 0
                  }} />
                  <div>
                    <p style={{ fontSize: '12px', color: colors.navy, margin: 0 }}>
                      {event.type.replace(/_/g, ' ')}
                    </p>
                    <p style={{ fontSize: '10px', color: colors.gray, margin: '2px 0 0 0' }}>
                      {event.transactionNumber} • {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
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

function KPICard({ title, value, icon, color }: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div style={{
      background: colors.white,
      borderRadius: '12px',
      padding: '18px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderTop: `3px solid ${color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>{title}</p>
        <span style={{ fontSize: '22px' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '26px', fontWeight: 700, color: colors.navy, margin: 0 }}>
        {value}
      </p>
    </div>
  );
}

function HealthIndicator({ label, status, color }: {
  label: string;
  status: string;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '13px', color: colors.gray }}>{label}</span>
      <span style={{
        padding: '4px 10px',
        background: color + '20',
        color: color,
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600
      }}>
        {status}
      </span>
    </div>
  );
}

function FinancialCard({ label, value, color }: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div style={{ padding: '14px', background: colors.grayLighter, borderRadius: '8px' }}>
      <p style={{ fontSize: '11px', color: colors.gray, margin: '0 0 4px 0' }}>{label}</p>
      <p style={{ fontSize: '18px', fontWeight: 700, color: color || colors.navy, margin: 0 }}>{value}</p>
    </div>
  );
}
