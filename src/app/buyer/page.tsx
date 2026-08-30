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
};

// Buyer Dashboard Data Interface
interface BuyerData {
  kpis: {
    activeTransactions: number;
    totalPurchaseValue: number;
    pendingRequests: number;
    committedValue: number;
    pendingPayments: number;
    inTransitShipments: number;
    completedPurchases: number;
    completionRate: number;
  };
  transactions: Array<{
    id: string;
    transactionNumber: string;
    currentState: string;
    value: number;
    currency: string;
    quantity: number;
    unit: string;
    exporter: string;
    commodity: string;
    progress: number;
    lastUpdated: string;
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
  milestones: Array<{
    type: string;
    title: string;
    description: string;
    date: string;
    daysUntil: number;
  }>;
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
    progress: number;
  }>;
  finance: {
    totalInvoiced: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    settlementsCompleted: number;
    settlementsPending: number;
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
  activity: Array<{
    id: string;
    type: string;
    transactionNumber: string;
    actor: string;
    timestamp: string;
  }>;
  accountHealth: {
    kybStatus: string;
    kybExpiring: boolean;
    documentIssues: number;
    verified: boolean;
    warnings: string[];
  };
}

export default function BuyerDashboard() {
  const router = useRouter();
  const [data, setData] = useState<BuyerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch buyer dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/buyer/dashboard');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setLastUpdated(new Date());
        }
      }
    } catch (error) {
      console.error('Failed to fetch buyer dashboard:', error);
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: colors.navy, margin: 0 }}>
            Loading Buyer Workspace
          </h2>
          <p style={{ fontSize: '14px', color: colors.gray, margin: '8px 0 0 0' }}>
            Fetching your trade data...
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
      {/* Buyer Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
        padding: '24px 32px',
        color: colors.white,
        borderBottom: `3px solid ${colors.gold}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px 0' }}>
              Buyer Workspace
            </h1>
            <p style={{ fontSize: '14px', color: colors.gray, margin: 0 }}>
              Welcome back • {data.accountHealth.verified ? '✓ Verified' : '⚠ Verification Required'}
              {lastUpdated && ` • Last sync: ${lastUpdated.toLocaleTimeString()}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => router.push('/buyer/opportunities')}
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
              Browse Opportunities
            </button>
            <button
              onClick={() => router.push('/buyer/requests/new')}
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
              + Purchase Request
            </button>
          </div>
        </div>
      </div>

      {/* Account Health Banner */}
      {data.accountHealth.warnings.length > 0 && (
        <div style={{ 
          background: colors.amberLight,
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            {data.accountHealth.warnings.map((warning, index) => (
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
        padding: '0 32px'
      }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'compliance', label: 'Compliance' },
            { id: 'documents', label: 'Documents' },
            { id: 'inspections', label: 'Inspections' },
            { id: 'logistics', label: 'Logistics' },
            { id: 'finance', label: 'Finance' },
            { id: 'exceptions', label: 'Exceptions' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? `3px solid ${colors.gold}` : '3px solid transparent',
                color: activeTab === tab.id ? colors.navy : colors.gray,
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
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
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          <KPICard
            title="Active Transactions"
            value={data.kpis.activeTransactions.toString()}
            icon="📊"
            color={colors.blue}
          />
          <KPICard
            title="Total Purchase Value"
            value={formatCurrency(data.kpis.totalPurchaseValue)}
            icon="💰"
            color={colors.green}
          />
          <KPICard
            title="In-Transit Shipments"
            value={data.kpis.inTransitShipments.toString()}
            icon="🚢"
            color={colors.purple}
          />
          <KPICard
            title="Completion Rate"
            value={`${data.kpis.completionRate}%`}
            icon="✅"
            color={colors.gold}
          />
        </div>

        {/* Actions Required & Account Health */}
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
                {data.actions.slice(0, 5).map((action, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    background: colors.grayLighter,
                    borderRadius: '8px',
                    borderLeft: `3px solid ${getSeverityColor(action.priority)}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: colors.navy, margin: '0 0 4px 0' }}>
                        {action.title}
                      </p>
                      <p style={{ fontSize: '12px', color: colors.gray, margin: 0 }}>
                        {action.description}
                        {action.transactionNumber && ` • ${action.transactionNumber}`}
                      </p>
                    </div>
                    <button style={{
                      padding: '6px 14px',
                      background: colors.navy,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
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

          {/* Account Health */}
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>
              Account Health
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <HealthIndicator
                label="KYB Status"
                status={data.accountHealth.kybStatus === 'approved' ? 'Verified' : 'Pending'}
                color={data.accountHealth.kybStatus === 'approved' ? colors.green : colors.amber}
              />
              <HealthIndicator
                label="Documents"
                status={data.accountHealth.documentIssues === 0 ? 'Complete' : `${data.accountHealth.documentIssues} Issues`}
                color={data.accountHealth.documentIssues === 0 ? colors.green : colors.amber}
              />
              <HealthIndicator
                label="Account"
                status={data.accountHealth.verified ? 'Verified' : 'Action Required'}
                color={data.accountHealth.verified ? colors.green : colors.red}
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
              Active Transactions
            </h3>
            <button
              onClick={() => router.push('/buyer/transactions')}
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
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Transaction</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Supplier</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Value</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Stage</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Progress</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.gray }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.slice(0, 8).map((tx) => (
                <tr key={tx.id} style={{ borderBottom: `1px solid ${colors.grayLight}` }}>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.navy }}>
                      {tx.transactionNumber}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: colors.navy }}>
                    {tx.commodity}
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', color: colors.gray }}>
                    {tx.exporter}
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: 600, color: colors.navy }}>
                    {formatCurrency(tx.value, tx.currency)}
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: getStateColor(tx.currentState) + '20',
                      color: getStateColor(tx.currentState),
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>
                      {formatState(tx.currentState)}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: colors.grayLight, borderRadius: '3px' }}>
                        <div style={{ width: `${tx.progress}%`, height: '100%', background: colors.green, borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: colors.gray }}>{tx.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <button
                      onClick={() => router.push(`/buyer/transactions/${tx.id}`)}
                      style={{
                        padding: '4px 10px',
                        background: colors.navy,
                        color: colors.white,
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
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

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Upcoming Milestones */}
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>
              Upcoming Milestones
            </h3>
            {data.milestones.length === 0 ? (
              <p style={{ fontSize: '14px', color: colors.gray, textAlign: 'center', padding: '24px' }}>
                No upcoming milestones
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.milestones.slice(0, 6).map((milestone, index) => (
                  <div key={index} style={{
                    padding: '12px',
                    background: colors.grayLighter,
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, margin: '0 0 2px 0' }}>
                        {milestone.title}
                      </p>
                      <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>
                        {milestone.description}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      background: milestone.daysUntil <= 3 ? colors.redLight : colors.blueLight,
                      color: milestone.daysUntil <= 3 ? colors.red : colors.blue,
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>
                      {milestone.daysUntil === 0 ? 'Today' : `${milestone.daysUntil}d`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                      <span style={{ fontSize: '11px', color: colors.gray }}>{exception.age}h ago</span>
                    </div>
                    <p style={{ fontSize: '13px', color: colors.navy, margin: '0 0 4px 0' }}>
                      {exception.description}
                    </p>
                    <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>
                      {exception.transactionNumber}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Shipment Tracking */}
        <div style={{ 
          background: colors.white,
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {data.shipments.slice(0, 4).map((shipment) => (
                <div key={shipment.id} style={{
                  padding: '16px',
                  background: colors.grayLighter,
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => router.push(`/buyer/logistics/${shipment.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.navy }}>
                      {shipment.transactionNumber}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      background: shipment.status === 'in_transit' ? colors.blueLight : colors.amberLight,
                      color: shipment.status === 'in_transit' ? colors.blue : colors.amber,
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>
                      {shipment.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: colors.gray, margin: '0 0 8px 0' }}>
                    {shipment.origin} → {shipment.destination}
                  </p>
                  <div style={{ width: '100%', height: '6px', background: colors.grayLight, borderRadius: '3px', marginBottom: '8px' }}>
                    <div style={{ width: `${shipment.progress}%`, height: '100%', background: colors.green, borderRadius: '3px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: colors.gray }}>ETA</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: colors.navy }}>
                      {shipment.eta ? new Date(shipment.eta).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Financial Summary & Recent Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Financial Summary */}
          <div style={{ 
            background: colors.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 16px 0' }}>
              Financial Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <FinancialCard label="Total Invoiced" value={formatCurrency(data.finance.totalInvoiced)} />
              <FinancialCard label="Paid" value={formatCurrency(data.finance.paidAmount)} color={colors.green} />
              <FinancialCard label="Pending" value={formatCurrency(data.finance.pendingAmount)} color={colors.amber} />
              <FinancialCard label="Overdue" value={formatCurrency(data.finance.overdueAmount)} color={colors.red} />
            </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
              {data.activity.slice(0, 8).map((event) => (
                <div key={event.id} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: colors.blue,
                    marginTop: '6px',
                    flexShrink: 0
                  }} />
                  <div>
                    <p style={{ fontSize: '13px', color: colors.navy, margin: 0 }}>
                      {event.type.replace(/_/g, ' ')}
                    </p>
                    <p style={{ fontSize: '11px', color: colors.gray, margin: '2px 0 0 0' }}>
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
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderTop: `3px solid ${color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <p style={{ fontSize: '12px', color: colors.gray, margin: 0 }}>{title}</p>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '28px', fontWeight: 700, color: colors.navy, margin: 0 }}>
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
    <div style={{ padding: '16px', background: colors.grayLighter, borderRadius: '8px' }}>
      <p style={{ fontSize: '12px', color: colors.gray, margin: '0 0 4px 0' }}>{label}</p>
      <p style={{ fontSize: '20px', fontWeight: 700, color: color || colors.navy, margin: 0 }}>{value}</p>
    </div>
  );
}
