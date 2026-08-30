'use client';

import React, { useState } from 'react';
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

// Mock workflow rules data
const workflowRules = [
  {
    id: 'rule-001',
    name: 'KYB Approved - Start Compliance',
    description: 'When KYB is approved and required documents are complete, create compliance review',
    version: '1.0',
    enabled: true,
    priority: 1,
    conditions: [
      { field: 'buyer.kybStatus', operator: 'EQUALS', value: 'APPROVED' },
      { field: 'exporter.kybStatus', operator: 'EQUALS', value: 'APPROVED' }
    ],
    actions: [
      { type: 'TRANSITION_STATE', config: { targetState: 'COMPLIANCE_REVIEW' } },
      { type: 'CREATE_TASK', config: { type: 'COMPLIANCE_REVIEW', assignee: 'COMPLIANCE_TEAM' } },
      { type: 'SEND_NOTIFICATION', config: { recipients: ['COMPLIANCE_TEAM', 'OPERATIONS'], template: 'KYB_APPROVED' } }
    ],
    createdAt: '2026-08-01',
    createdBy: 'SYSTEM',
    approvedBy: 'Lukman Kura',
    approvedAt: '2026-08-02',
    lastTriggered: '2026-08-29 14:30',
    triggerCount: 47
  },
  {
    id: 'rule-002',
    name: 'Compliance Ready - Request Inspection',
    description: 'When compliance is ready, create inspection request',
    version: '1.0',
    enabled: true,
    priority: 2,
    conditions: [
      { field: 'compliancePack.status', operator: 'EQUALS', value: 'READY' }
    ],
    actions: [
      { type: 'TRANSITION_STATE', config: { targetState: 'INSPECTION_PENDING' } },
      { type: 'CREATE_TASK', config: { type: 'INSPECTION_REQUEST', assignee: 'INSPECTION_TEAM' } },
      { type: 'SEND_NOTIFICATION', config: { recipients: ['INSPECTION_TEAM', 'EXPORTER'], template: 'COMPLIANCE_READY' } }
    ],
    createdAt: '2026-08-01',
    createdBy: 'SYSTEM',
    approvedBy: 'Lukman Kura',
    approvedAt: '2026-08-02',
    lastTriggered: '2026-08-29 12:00',
    triggerCount: 42
  },
  {
    id: 'rule-003',
    name: 'Inspection Passed - Notify Finance',
    description: 'When inspection passes, recalculate clearance readiness and notify finance',
    version: '1.0',
    enabled: true,
    priority: 3,
    conditions: [
      { field: 'inspection.status', operator: 'EQUALS', value: 'PASSED' }
    ],
    actions: [
      { type: 'TRANSITION_STATE', config: { targetState: 'FINANCE_PENDING' } },
      { type: 'SEND_NOTIFICATION', config: { recipients: ['FINANCE_TEAM', 'OPERATIONS'], template: 'INSPECTION_PASSED' } }
    ],
    createdAt: '2026-08-01',
    createdBy: 'SYSTEM',
    approvedBy: 'Lukman Kura',
    approvedAt: '2026-08-02',
    lastTriggered: '2026-08-29 10:00',
    triggerCount: 38
  },
  {
    id: 'rule-004',
    name: 'Inspection Failed - Freeze Release',
    description: 'When inspection fails, freeze release and create remediation case',
    version: '1.0',
    enabled: true,
    priority: 4,
    conditions: [
      { field: 'inspection.status', operator: 'EQUALS', value: 'FAILED' }
    ],
    actions: [
      { type: 'TRANSITION_STATE', config: { targetState: 'INSPECTION_FAILED' } },
      { type: 'CREATE_TASK', config: { type: 'REMEDIATION', assignee: 'OPERATIONS' } },
      { type: 'SEND_NOTIFICATION', config: { recipients: ['OPERATIONS', 'COMPLIANCE', 'BUYER', 'EXPORTER'], template: 'INSPECTION_FAILED' } }
    ],
    createdAt: '2026-08-01',
    createdBy: 'SYSTEM',
    approvedBy: 'Lukman Kura',
    approvedAt: '2026-08-02',
    lastTriggered: '2026-08-28 16:00',
    triggerCount: 4
  },
  {
    id: 'rule-005',
    name: 'Finance Approved - Mark Condition',
    description: 'When finance is approved and funds confirmed, mark finance condition satisfied',
    version: '1.0',
    enabled: true,
    priority: 5,
    conditions: [
      { field: 'financing.status', operator: 'EQUALS', value: 'FUNDED' }
    ],
    actions: [
      { type: 'TRANSITION_STATE', config: { targetState: 'FUNDS_SECURED' } },
      { type: 'SEND_NOTIFICATION', config: { recipients: ['OPERATIONS', 'FINANCE_TEAM'], template: 'FUNDS_SECURED' } }
    ],
    createdAt: '2026-08-01',
    createdBy: 'SYSTEM',
    approvedBy: 'Lukman Kura',
    approvedAt: '2026-08-02',
    lastTriggered: '2026-08-28 14:00',
    triggerCount: 38
  },
  {
    id: 'rule-006',
    name: 'All Release Conditions Met - Create Approval',
    description: 'When all release conditions are satisfied, create release approval task',
    version: '1.0',
    enabled: true,
    priority: 6,
    conditions: [
      { field: 'releaseConditions', operator: 'ALL_SATISFIED', value: true }
    ],
    actions: [
      { type: 'TRANSITION_STATE', config: { targetState: 'RELEASE_ELIGIBLE' } },
      { type: 'CREATE_TASK', config: { type: 'RELEASE_APPROVAL', assignee: 'OPERATIONS' } },
      { type: 'SEND_NOTIFICATION', config: { recipients: ['OPERATIONS', 'FINANCE_TEAM', 'COMPLIANCE'], template: 'RELEASE_ELIGIBLE' } }
    ],
    createdAt: '2026-08-01',
    createdBy: 'SYSTEM',
    approvedBy: 'Lukman Kura',
    approvedAt: '2026-08-02',
    lastTriggered: '2026-08-29 14:30',
    triggerCount: 35
  },
  {
    id: 'rule-007',
    name: 'Document Expiring - Warning',
    description: 'When a document is expiring within 14 days, send warning notification',
    version: '1.0',
    enabled: true,
    priority: 7,
    conditions: [
      { field: 'document.expiryDays', operator: 'LESS_THAN', value: 14 }
    ],
    actions: [
      { type: 'SEND_NOTIFICATION', config: { recipients: ['COMPLIANCE', 'EXPORTER'], template: 'DOCUMENT_EXPIRING' } }
    ],
    createdAt: '2026-08-01',
    createdBy: 'SYSTEM',
    approvedBy: 'Lukman Kura',
    approvedAt: '2026-08-02',
    lastTriggered: '2026-08-29 08:00',
    triggerCount: 23
  },
  {
    id: 'rule-008',
    name: 'SLA Warning - 70%',
    description: 'When SLA reaches 70%, notify owner',
    version: '1.0',
    enabled: true,
    priority: 8,
    conditions: [
      { field: 'sla.percentage', operator: 'GREATER_THAN', value: 70 }
    ],
    actions: [
      { type: 'SEND_NOTIFICATION', config: { recipients: ['OWNER'], template: 'SLA_WARNING' } }
    ],
    createdAt: '2026-08-01',
    createdBy: 'SYSTEM',
    approvedBy: 'Lukman Kura',
    approvedAt: '2026-08-02',
    lastTriggered: '2026-08-29 08:15',
    triggerCount: 18
  },
  {
    id: 'rule-009',
    name: 'SLA Critical - 85%',
    description: 'When SLA reaches 85%, notify supervisor',
    version: '1.0',
    enabled: true,
    priority: 9,
    conditions: [
      { field: 'sla.percentage', operator: 'GREATER_THAN', value: 85 }
    ],
    actions: [
      { type: 'SEND_NOTIFICATION', config: { recipients: ['SUPERVISOR', 'OWNER'], template: 'SLA_CRITICAL' } },
      { type: 'ESCALATE', config: { level: 'SUPERVISOR' } }
    ],
    createdAt: '2026-08-01',
    createdBy: 'SYSTEM',
    approvedBy: 'Lukman Kura',
    approvedAt: '2026-08-02',
    lastTriggered: '2026-08-28 16:00',
    triggerCount: 5
  },
  {
    id: 'rule-010',
    name: 'Sanctions Match - Freeze Transaction',
    description: 'When sanctions match confirmed, freeze transaction and escalate',
    version: '1.0',
    enabled: true,
    priority: 10,
    conditions: [
      { field: 'sanctions.status', operator: 'EQUALS', value: 'CONFIRMED_MATCH' }
    ],
    actions: [
      { type: 'TRANSITION_STATE', config: { targetState: 'SANCTIONS_EXCEPTION' } },
      { type: 'ESCALATE', config: { level: 'COMPLIANCE_HEAD' } },
      { type: 'SEND_NOTIFICATION', config: { recipients: ['COMPLIANCE_HEAD', 'CEO'], template: 'SANCTIONS_MATCH' } }
    ],
    createdAt: '2026-08-01',
    createdBy: 'SYSTEM',
    approvedBy: 'Lukman Kura',
    approvedAt: '2026-08-02',
    lastTriggered: null,
    triggerCount: 0
  }
];

export default function ProtocolRulesPage() {
  const router = useRouter();
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [filterEnabled, setFilterEnabled] = useState<'all' | 'enabled' | 'disabled'>('all');

  const filteredRules = workflowRules.filter(rule => {
    if (filterEnabled === 'enabled') return rule.enabled;
    if (filterEnabled === 'disabled') return !rule.enabled;
    return true;
  });

  const getActionColor = (type: string) => {
    switch (type) {
      case 'TRANSITION_STATE': return colors.blue;
      case 'CREATE_TASK': return colors.purple;
      case 'SEND_NOTIFICATION': return colors.green;
      case 'UPDATE_FIELD': return colors.amber;
      case 'CALL_API': return colors.purple;
      case 'ESCALATE': return colors.red;
      default: return colors.gray;
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'TRANSITION_STATE': return 'Transition State';
      case 'CREATE_TASK': return 'Create Task';
      case 'SEND_NOTIFICATION': return 'Send Notification';
      case 'UPDATE_FIELD': return 'Update Field';
      case 'CALL_API': return 'Call API';
      case 'ESCALATE': return 'Escalate';
      default: return type;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.grayLight }}>
      {/* Header */}
      <div style={{ background: colors.navy, padding: '24px 32px', color: colors.white }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <button
              onClick={() => router.push('/app/protocol')}
              style={{
                background: 'none',
                border: 'none',
                color: colors.gray,
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '8px'
              }}
            >
              ← Back to Protocol Command Center
            </button>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>
              Workflow Rule Engine
            </h1>
            <p style={{ fontSize: '14px', color: colors.gray, margin: '4px 0 0 0' }}>
              Configure and manage protocol automation rules
            </p>
          </div>
          <button style={{
            padding: '10px 20px',
            background: colors.gold,
            color: colors.navy,
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            + Create New Rule
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: colors.white, padding: '16px 32px', borderBottom: `1px solid ${colors.grayLight}` }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setFilterEnabled('all')}
            style={{
              padding: '8px 16px',
              background: filterEnabled === 'all' ? colors.navy : colors.grayLight,
              color: filterEnabled === 'all' ? colors.white : colors.navy,
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            All Rules ({workflowRules.length})
          </button>
          <button
            onClick={() => setFilterEnabled('enabled')}
            style={{
              padding: '8px 16px',
              background: filterEnabled === 'enabled' ? colors.green : colors.grayLight,
              color: filterEnabled === 'enabled' ? colors.white : colors.navy,
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Enabled ({workflowRules.filter(r => r.enabled).length})
          </button>
          <button
            onClick={() => setFilterEnabled('disabled')}
            style={{
              padding: '8px 16px',
              background: filterEnabled === 'disabled' ? colors.gray : colors.grayLight,
              color: filterEnabled === 'disabled' ? colors.white : colors.navy,
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Disabled ({workflowRules.filter(r => !r.enabled).length})
          </button>
        </div>
      </div>

      {/* Rules List */}
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              style={{
                background: colors.white,
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: selectedRule === rule.id ? `2px solid ${colors.blue}` : '2px solid transparent',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedRule(selectedRule === rule.id ? null : rule.id)}
            >
              {/* Rule Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: rule.enabled ? colors.greenLight : colors.grayLight,
                      color: rule.enabled ? colors.green : colors.gray,
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      background: colors.blueLight,
                      color: colors.blue,
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      v{rule.version}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      background: colors.grayLight,
                      color: colors.gray,
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      Priority: {rule.priority}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 4px 0' }}>
                    {rule.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: colors.gray, margin: 0 }}>
                    {rule.description}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: colors.navy, margin: 0 }}>
                    {rule.triggerCount}
                  </p>
                  <p style={{ fontSize: '12px', color: colors.gray, margin: '4px 0 0 0' }}>
                    triggers
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedRule === rule.id && (
                <div style={{ borderTop: `1px solid ${colors.grayLight}`, paddingTop: '16px' }}>
                  {/* Conditions */}
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.navy, margin: '0 0 8px 0' }}>
                      Conditions
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {rule.conditions.map((condition, index) => (
                        <div key={index} style={{
                          padding: '12px',
                          background: colors.grayLight,
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            padding: '2px 6px',
                            background: colors.blueLight,
                            color: colors.blue,
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600
                          }}>
                            {condition.operator}
                          </span>
                          <span style={{ fontSize: '13px', color: colors.navy, fontFamily: 'monospace' }}>
                            {condition.field}
                          </span>
                          <span style={{ fontSize: '13px', color: colors.gray }}>→</span>
                          <span style={{
                            padding: '2px 6px',
                            background: colors.greenLight,
                            color: colors.green,
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600
                          }}>
                            {condition.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.navy, margin: '0 0 8px 0' }}>
                      Actions
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {rule.actions.map((action, index) => (
                        <div key={index} style={{
                          padding: '12px',
                          background: colors.grayLight,
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            padding: '2px 6px',
                            background: getActionColor(action.type) + '20',
                            color: getActionColor(action.type),
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600
                          }}>
                            {getActionLabel(action.type)}
                          </span>
                          <span style={{ fontSize: '13px', color: colors.navy }}>
                            {JSON.stringify(action.config)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                    padding: '16px',
                    background: colors.grayLight,
                    borderRadius: '8px'
                  }}>
                    <div>
                      <p style={{ fontSize: '12px', color: colors.gray, margin: 0 }}>Created</p>
                      <p style={{ fontSize: '14px', color: colors.navy, margin: '4px 0 0 0' }}>{rule.createdAt}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: colors.gray, margin: 0 }}>Created By</p>
                      <p style={{ fontSize: '14px', color: colors.navy, margin: '4px 0 0 0' }}>{rule.createdBy}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: colors.gray, margin: 0 }}>Approved By</p>
                      <p style={{ fontSize: '14px', color: colors.navy, margin: '4px 0 0 0' }}>{rule.approvedBy}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: colors.gray, margin: 0 }}>Last Triggered</p>
                      <p style={{ fontSize: '14px', color: colors.navy, margin: '4px 0 0 0' }}>{rule.lastTriggered || 'Never'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button style={{
                      padding: '8px 16px',
                      background: colors.blue,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}>
                      Edit Rule
                    </button>
                    <button style={{
                      padding: '8px 16px',
                      background: rule.enabled ? colors.amber : colors.green,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}>
                      {rule.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button style={{
                      padding: '8px 16px',
                      background: colors.purple,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}>
                      Test Rule
                    </button>
                    <button style={{
                      padding: '8px 16px',
                      background: colors.grayLight,
                      color: colors.navy,
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}>
                      View History
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
