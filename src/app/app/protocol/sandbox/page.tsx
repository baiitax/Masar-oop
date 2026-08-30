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

// Sandbox scenarios
const scenarios = [
  {
    id: 'scenario-1',
    name: 'Happy Path - Complete Transaction',
    description: 'Simulate a complete transaction from RFQ to settlement with all conditions passing',
    category: 'SUCCESS',
    steps: [
      { state: 'DRAFT', action: 'Create Transaction', result: 'Transaction created' },
      { state: 'RFQ', action: 'Submit RFQ', result: 'RFQ submitted' },
      { state: 'BUYER_VERIFIED', action: 'Verify Buyer KYB', result: 'Buyer KYB approved - Score: 92/100' },
      { state: 'EXPORTER_VERIFIED', action: 'Verify Exporter KYB', result: 'Exporter KYB approved - Score: 88/100' },
      { state: 'COMMERCIAL_MATCH', action: 'Match Parties', result: 'Commercial match established' },
      { state: 'CONTRACTED', action: 'Execute Contract', result: 'Contract signed by both parties' },
      { state: 'COMPLIANCE_REVIEW', action: 'Start Compliance', result: '14 documents required' },
      { state: 'COMPLIANCE_READY', action: 'Complete Compliance', result: 'All documents verified - Score: 96/100' },
      { state: 'INSPECTION_PENDING', action: 'Request Inspection', result: 'Inspection request sent' },
      { state: 'INSPECTION_IN_PROGRESS', action: 'Process Inspection', result: 'Samples collected, lab processing' },
      { state: 'INSPECTION_PASSED', action: 'Complete Inspection', result: 'Quality score: 94% - PASSED' },
      { state: 'FINANCE_PENDING', action: 'Request Financing', result: 'Financing request submitted' },
      { state: 'FINANCE_APPROVED', action: 'Approve Financing', result: 'Financing approved: $500,000' },
      { state: 'FUNDS_SECURED', action: 'Secure Funds', result: 'Funds secured in escrow' },
      { state: 'SHIPMENT_READY', action: 'Prepare Shipment', result: 'Shipment documentation complete' },
      { state: 'IN_TRANSIT', action: 'Track Shipment', result: 'Vessel departed Lagos' },
      { state: 'ARRIVED', action: 'Confirm Arrival', result: 'Vessel arrived Jeddah' },
      { state: 'PORT_VERIFICATION', action: 'Port Verification', result: 'Port verification complete' },
      { state: 'RELEASE_ELIGIBLE', action: 'Evaluate Release', result: 'All 8 conditions satisfied' },
      { state: 'RELEASE_APPROVAL', action: 'Human Authorization', result: 'Release approved by Operations' },
      { state: 'SETTLEMENT', action: 'Process Settlement', result: 'Settlement processing' },
      { state: 'COMPLETED', action: 'Complete Transaction', result: 'Transaction completed successfully' }
    ]
  },
  {
    id: 'scenario-2',
    name: 'KYB Failure - Sanctions Match',
    description: 'Simulate a transaction where KYB detects a sanctions match',
    category: 'FAILURE',
    steps: [
      { state: 'DRAFT', action: 'Create Transaction', result: 'Transaction created' },
      { state: 'RFQ', action: 'Submit RFQ', result: 'RFQ submitted' },
      { state: 'BUYER_VERIFIED', action: 'Verify Buyer KYB', result: 'Buyer KYB approved' },
      { state: 'EXPORTER_VERIFIED', action: 'Verify Exporter KYB', result: 'Exporter KYB - SANCTIONS MATCH DETECTED' },
      { state: 'SANCTIONS_EXCEPTION', action: 'Freeze Transaction', result: 'Transaction frozen - Compliance escalated' }
    ]
  },
  {
    id: 'scenario-3',
    name: 'Inspection Failure - Quality Variance',
    description: 'Simulate a transaction where inspection fails due to quality issues',
    category: 'FAILURE',
    steps: [
      { state: 'DRAFT', action: 'Create Transaction', result: 'Transaction created' },
      { state: 'RFQ', action: 'Submit RFQ', result: 'RFQ submitted' },
      { state: 'BUYER_VERIFIED', action: 'Verify Buyer KYB', result: 'Buyer KYB approved' },
      { state: 'EXPORTER_VERIFIED', action: 'Verify Exporter KYB', result: 'Exporter KYB approved' },
      { state: 'COMMERCIAL_MATCH', action: 'Match Parties', result: 'Commercial match established' },
      { state: 'CONTRACTED', action: 'Execute Contract', result: 'Contract signed' },
      { state: 'COMPLIANCE_REVIEW', action: 'Start Compliance', result: 'Compliance pack generated' },
      { state: 'COMPLIANCE_READY', action: 'Complete Compliance', result: 'All documents verified' },
      { state: 'INSPECTION_PENDING', action: 'Request Inspection', result: 'Inspection request sent' },
      { state: 'INSPECTION_IN_PROGRESS', action: 'Process Inspection', result: 'Lab results received' },
      { state: 'INSPECTION_FAILED', action: 'Inspection Failed', result: 'Moisture: 12% (max 8%) - FAILED' },
      { state: 'QUALITY_VARIANCE', action: 'Create Variance Case', result: 'Remediation workflow started' }
    ]
  },
  {
    id: 'scenario-4',
    name: 'Document Expiry - Compliance Block',
    description: 'Simulate a transaction where a critical document expires',
    category: 'WARNING',
    steps: [
      { state: 'DRAFT', action: 'Create Transaction', result: 'Transaction created' },
      { state: 'RFQ', action: 'Submit RFQ', result: 'RFQ submitted' },
      { state: 'BUYER_VERIFIED', action: 'Verify Buyer KYB', result: 'Buyer KYB approved' },
      { state: 'EXPORTER_VERIFIED', action: 'Verify Exporter KYB', result: 'Exporter KYB approved' },
      { state: 'COMMERCIAL_MATCH', action: 'Match Parties', result: 'Commercial match established' },
      { state: 'CONTRACTED', action: 'Execute Contract', result: 'Contract signed' },
      { state: 'COMPLIANCE_REVIEW', action: 'Start Compliance', result: 'Compliance pack generated' },
      { state: 'COMPLIANCE_EXCEPTION', action: 'Document Expired', result: 'Certificate of Origin expired - Release blocked' }
    ]
  },
  {
    id: 'scenario-5',
    name: 'Finance Decline',
    description: 'Simulate a transaction where financing is declined',
    category: 'FAILURE',
    steps: [
      { state: 'DRAFT', action: 'Create Transaction', result: 'Transaction created' },
      { state: 'RFQ', action: 'Submit RFQ', result: 'RFQ submitted' },
      { state: 'BUYER_VERIFIED', action: 'Verify Buyer KYB', result: 'Buyer KYB approved' },
      { state: 'EXPORTER_VERIFIED', action: 'Verify Exporter KYB', result: 'Exporter KYB approved' },
      { state: 'COMMERCIAL_MATCH', action: 'Match Parties', result: 'Commercial match established' },
      { state: 'CONTRACTED', action: 'Execute Contract', result: 'Contract signed' },
      { state: 'COMPLIANCE_REVIEW', action: 'Start Compliance', result: 'Compliance pack generated' },
      { state: 'COMPLIANCE_READY', action: 'Complete Compliance', result: 'All documents verified' },
      { state: 'INSPECTION_PENDING', action: 'Request Inspection', result: 'Inspection request sent' },
      { state: 'INSPECTION_IN_PROGRESS', action: 'Process Inspection', result: 'Inspection passed' },
      { state: 'INSPECTION_PASSED', action: 'Complete Inspection', result: 'Quality score: 92%' },
      { state: 'FINANCE_PENDING', action: 'Request Financing', result: 'Financing request submitted' },
      { state: 'FINANCE_DECLINED', action: 'Finance Declined', result: 'Insufficient collateral - Declined' }
    ]
  }
];

export default function ProtocolSandboxPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const scenario = scenarios.find(s => s.id === selectedScenario);

  const runScenario = async () => {
    if (!scenario) return;

    setIsRunning(true);
    setCurrentStep(0);
    setCompletedSteps([]);

    for (let i = 0; i < scenario.steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
      setCompletedSteps(prev => [...prev, i]);
    }

    setIsRunning(false);
  };

  const resetScenario = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsRunning(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SUCCESS': return colors.green;
      case 'FAILURE': return colors.red;
      case 'WARNING': return colors.amber;
      default: return colors.blue;
    }
  };

  const getStateColor = (state: string) => {
    if (state.includes('EXCEPTION') || state.includes('FAILED') || state.includes('DECLINED')) return colors.red;
    if (state.includes('VARIANCE') || state.includes('DELAY')) return colors.amber;
    if (state === 'COMPLETED') return colors.green;
    return colors.blue;
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
              Protocol Sandbox
            </h1>
            <p style={{ fontSize: '14px', color: colors.gray, margin: '4px 0 0 0' }}>
              Simulate protocol scenarios without affecting real transactions
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={runScenario}
              disabled={!selectedScenario || isRunning}
              style={{
                padding: '10px 20px',
                background: selectedScenario && !isRunning ? colors.green : colors.gray,
                color: colors.white,
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: selectedScenario && !isRunning ? 'pointer' : 'not-allowed'
              }}
            >
              {isRunning ? 'Running...' : '▶ Run Scenario'}
            </button>
            <button
              onClick={resetScenario}
              disabled={isRunning}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                color: colors.white,
                border: `1px solid ${colors.gray}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isRunning ? 'not-allowed' : 'pointer'
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Scenario Selection */}
          <div>
            <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: '0 0 20px 0' }}>
                Select Scenario
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {scenarios.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedScenario(s.id);
                      resetScenario();
                    }}
                    style={{
                      padding: '16px',
                      background: selectedScenario === s.id ? colors.blueLight : colors.grayLight,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: selectedScenario === s.id ? `2px solid ${colors.blue}` : '2px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        padding: '2px 6px',
                        background: getCategoryColor(s.category) + '20',
                        color: getCategoryColor(s.category),
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {s.category}
                      </span>
                      <span style={{ fontSize: '12px', color: colors.gray }}>
                        {s.steps.length} steps
                      </span>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.navy, margin: '0 0 4px 0' }}>
                      {s.name}
                    </h4>
                    <p style={{ fontSize: '13px', color: colors.gray, margin: 0 }}>
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scenario Visualization */}
          <div>
            {selectedScenario && scenario ? (
              <div style={{ background: colors.white, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: colors.navy, margin: 0 }}>
                      {scenario.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: colors.gray, margin: '4px 0 0 0' }}>
                      {scenario.description}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '24px', fontWeight: 700, color: colors.navy, margin: 0 }}>
                      {completedSteps.length}/{scenario.steps.length}
                    </p>
                    <p style={{ fontSize: '12px', color: colors.gray, margin: '4px 0 0 0' }}>
                      Steps Completed
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: colors.grayLight,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: `${(completedSteps.length / scenario.steps.length) * 100}%`,
                    height: '100%',
                    background: scenario.category === 'SUCCESS' ? colors.green : scenario.category === 'FAILURE' ? colors.red : colors.amber,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                {/* Steps Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {scenario.steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(index);
                    const isCurrent = currentStep === index && isRunning;

                    return (
                      <div key={index} style={{ display: 'flex', gap: '16px' }}>
                        {/* Timeline Line */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: isCompleted ? colors.green : isCurrent ? colors.blue : colors.grayLight,
                            border: isCurrent ? `3px solid ${colors.blue}` : 'none',
                            flexShrink: 0
                          }} />
                          {index < scenario.steps.length - 1 && (
                            <div style={{
                              width: '2px',
                              height: '40px',
                              background: isCompleted ? colors.green : colors.grayLight
                            }} />
                          )}
                        </div>

                        {/* Step Content */}
                        <div style={{
                          flex: 1,
                          padding: '12px 16px',
                          background: isCurrent ? colors.blueLight : isCompleted ? colors.greenLight : colors.grayLight,
                          borderRadius: '8px',
                          marginBottom: '8px',
                          opacity: isCompleted || isCurrent ? 1 : 0.6
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                padding: '2px 6px',
                                background: getStateColor(step.state) + '20',
                                color: getStateColor(step.state),
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600
                              }}>
                                {step.state}
                              </span>
                              <span style={{ fontSize: '14px', fontWeight: 500, color: colors.navy }}>
                                {step.action}
                              </span>
                            </div>
                            {isCompleted && (
                              <span style={{ fontSize: '16px' }}>✓</span>
                            )}
                            {isCurrent && (
                              <span style={{ fontSize: '16px', color: colors.blue }}>⟳</span>
                            )}
                          </div>
                          <p style={{ fontSize: '13px', color: colors.gray, margin: 0 }}>
                            {step.result}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Completion Message */}
                {!isRunning && completedSteps.length === scenario.steps.length && (
                  <div style={{
                    padding: '20px',
                    background: scenario.category === 'SUCCESS' ? colors.greenLight : scenario.category === 'FAILURE' ? colors.redLight : colors.amberLight,
                    borderRadius: '8px',
                    marginTop: '24px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: scenario.category === 'SUCCESS' ? colors.green : scenario.category === 'FAILURE' ? colors.red : colors.amber,
                      margin: 0
                    }}>
                      {scenario.category === 'SUCCESS' ? '✓ Scenario Completed Successfully' :
                       scenario.category === 'FAILURE' ? '✕ Scenario Completed with Failure' :
                       '⚠ Scenario Completed with Warning'}
                    </p>
                    <p style={{ fontSize: '14px', color: colors.gray, margin: '8px 0 0 0' }}>
                      {scenario.steps[scenario.steps.length - 1].result}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: colors.white,
                borderRadius: '12px',
                padding: '48px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🧪</p>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: colors.navy, margin: '0 0 8px 0' }}>
                  Select a Scenario
                </h3>
                <p style={{ fontSize: '14px', color: colors.gray, margin: 0 }}>
                  Choose a scenario from the left panel to begin simulation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
