// MASAR Protocol - Release Engine
// Core trust mechanism for transaction release authorization

import {
  ReleaseCondition,
  ReleaseApproval,
  ReleaseApprover,
  MASARTransaction,
  AuditEvent,
  SettlementRecord,
  SettlementWaterfallItem
} from './types';

// ============================================================
// RELEASE ENGINE
// ============================================================

export class ReleaseEngine {
  private transaction: MASARTransaction;
  private auditLog: AuditEvent[] = [];

  constructor(transaction: MASARTransaction) {
    this.transaction = transaction;
  }

  /**
   * Initialize release conditions from lane template
   */
  async initializeReleaseConditions(): Promise<{ success: boolean; conditions: ReleaseCondition[] }> {
    const conditions: ReleaseCondition[] = [
      {
        id: 'cond-kyb',
        type: 'KYB',
        description: 'Buyer and exporter KYB approved',
        status: 'PENDING',
        satisfiedAt: null,
        evidence: null,
        rule: 'ALL_KYB_APPROVED',
        critical: true
      },
      {
        id: 'cond-compliance',
        type: 'COMPLIANCE',
        description: 'All mandatory compliance documents verified',
        status: 'PENDING',
        satisfiedAt: null,
        evidence: null,
        rule: 'ALL_DOCUMENTS_VERIFIED',
        critical: true
      },
      {
        id: 'cond-inspection',
        type: 'INSPECTION',
        description: 'Inspection passed',
        status: 'PENDING',
        satisfiedAt: null,
        evidence: null,
        rule: 'INSPECTION_PASSED',
        critical: true
      },
      {
        id: 'cond-quality',
        type: 'QUALITY',
        description: 'Quality within specification',
        status: 'PENDING',
        satisfiedAt: null,
        evidence: null,
        rule: 'QUALITY_ACCEPTED',
        critical: true
      },
      {
        id: 'cond-finance',
        type: 'FINANCE',
        description: 'Funds secured in escrow',
        status: 'PENDING',
        satisfiedAt: null,
        evidence: null,
        rule: 'FUNDS_SECURED',
        critical: true
      },
      {
        id: 'cond-shipment',
        type: 'SHIPMENT',
        description: 'Shipment confirmed and in transit',
        status: 'PENDING',
        satisfiedAt: null,
        evidence: null,
        rule: 'SHIPMENT_CONFIRMED',
        critical: false
      },
      {
        id: 'cond-port',
        type: 'PORT',
        description: 'Port verification completed',
        status: 'PENDING',
        satisfiedAt: null,
        evidence: null,
        rule: 'PORT_VERIFIED',
        critical: false
      },
      {
        id: 'cond-documents',
        type: 'DOCUMENTS',
        description: 'Final documents received',
        status: 'PENDING',
        satisfiedAt: null,
        evidence: null,
        rule: 'FINAL_DOCUMENTS_RECEIVED',
        critical: false
      }
    ];

    this.transaction.releaseConditions = conditions;
    this.addAuditEvent('RELEASE_CONDITIONS_INITIALIZED', `Initialized ${conditions.length} release conditions`);

    return { success: true, conditions };
  }

  /**
   * Evaluate release conditions
   */
  async evaluateReleaseConditions(): Promise<{ eligible: boolean; summary: ReleaseEligibilitySummary }> {
    const conditions = this.transaction.releaseConditions;

    // Evaluate each condition
    for (const condition of conditions) {
      await this.evaluateCondition(condition);
    }

    const satisfiedCount = conditions.filter(c => c.status === 'SATISFIED').length;
    const criticalSatisfied = conditions.filter(c => c.critical && c.status === 'SATISFIED').length;
    const criticalTotal = conditions.filter(c => c.critical).length;

    const eligible = criticalSatisfied === criticalTotal;

    const summary: ReleaseEligibilitySummary = {
      totalConditions: conditions.length,
      satisfiedConditions: satisfiedCount,
      criticalConditions: criticalTotal,
      criticalSatisfied,
      eligible,
      unsatisfiedCritical: conditions.filter(c => c.critical && c.status !== 'SATISFIED').map(c => c.description),
      unsatisfiedOptional: conditions.filter(c => !c.critical && c.status !== 'SATISFIED').map(c => c.description)
    };

    if (eligible) {
      this.addAuditEvent('RELEASE_ELIGIBLE', `All critical conditions satisfied (${criticalSatisfied}/${criticalTotal})`);
    } else {
      this.addAuditEvent('RELEASE_NOT_ELIGIBLE', `Critical conditions not met (${criticalSatisfied}/${criticalTotal})`);
    }

    return { eligible, summary };
  }

  /**
   * Satisfy a release condition
   */
  async satisfyCondition(
    conditionId: string,
    evidence: string,
    satisfiedBy: string
  ): Promise<{ success: boolean; condition: ReleaseCondition | null }> {
    const condition = this.transaction.releaseConditions.find(c => c.id === conditionId);

    if (!condition) {
      return { success: false, condition: null };
    }

    condition.status = 'SATISFIED';
    condition.satisfiedAt = new Date().toISOString();
    condition.evidence = evidence;

    this.addAuditEvent('RELEASE_CONDITION_SATISFIED', `Condition satisfied: ${condition.description} by ${satisfiedBy}`);

    return { success: true, condition };
  }

  /**
   * Create release approval request
   */
  async createReleaseApproval(
    requiredApprovals: number,
    approvers: { userId: string; name: string; role: string }[]
  ): Promise<{ success: boolean; approval: ReleaseApproval }> {
    const approval: ReleaseApproval = {
      id: `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: this.transaction.id,
      status: 'PENDING',
      requiredApprovals,
      approvals: approvers.map(a => ({
        userId: a.userId,
        name: a.name,
        role: a.role,
        approvedAt: null,
        decision: 'PENDING',
        notes: null
      })),
      decision: null,
      decidedAt: null,
      decidedBy: null,
      notes: null
    };

    this.transaction.releaseApproval = approval;
    this.addAuditEvent('RELEASE_APPROVAL_CREATED', `Release approval created, ${requiredApprovals} approvals required`);

    return { success: true, approval };
  }

  /**
   * Submit approval decision
   */
  async submitApproval(
    userId: string,
    decision: 'APPROVED' | 'REJECTED' | 'ABSTAINED',
    notes: string
  ): Promise<{ success: boolean; approvalComplete: boolean }> {
    if (!this.transaction.releaseApproval) {
      return { success: false, approvalComplete: false };
    }

    const approver = this.transaction.releaseApproval.approvals.find(a => a.userId === userId);

    if (!approver) {
      return { success: false, approvalComplete: false };
    }

    approver.decision = decision;
    approver.approvedAt = new Date().toISOString();
    approver.notes = notes;

    this.addAuditEvent('RELEASE_APPROVAL_DECISION', `${approver.name} ${decision}: ${notes}`);

    // Check if all required approvals are received
    const approvedCount = this.transaction.releaseApproval.approvals.filter(
      a => a.decision === 'APPROVED'
    ).length;

    const rejectedCount = this.transaction.releaseApproval.approvals.filter(
      a => a.decision === 'REJECTED'
    ).length;

    let approvalComplete = false;

    if (rejectedCount > 0) {
      this.transaction.releaseApproval.status = 'REJECTED';
      this.transaction.releaseApproval.decision = 'REJECTED';
      this.transaction.releaseApproval.decidedAt = new Date().toISOString();
      this.transaction.releaseApproval.decidedBy = userId;
      approvalComplete = true;
      this.addAuditEvent('RELEASE_APPROVAL_REJECTED', `Release rejected by ${approver.name}`);
    } else if (approvedCount >= this.transaction.releaseApproval.requiredApprovals) {
      this.transaction.releaseApproval.status = 'APPROVED';
      this.transaction.releaseApproval.decision = 'APPROVED';
      this.transaction.releaseApproval.decidedAt = new Date().toISOString();
      this.transaction.releaseApproval.decidedBy = userId;
      approvalComplete = true;
      this.addAuditEvent('RELEASE_APPROVED', `Release approved by ${approver.name}`);
    }

    return { success: true, approvalComplete };
  }

  /**
   * Process settlement after release approval
   */
  async processSettlement(
    totalAmount: number,
    currency: string,
    waterfall: SettlementWaterfallInput[]
  ): Promise<{ success: boolean; settlement: SettlementRecord }> {
    const settlementItems: SettlementWaterfallItem[] = waterfall.map((item, index) => ({
      sequence: index + 1,
      recipient: item.recipient,
      type: item.type,
      amount: item.amount,
      currency,
      status: 'PENDING',
      paidAt: null,
      reference: null
    }));

    const settlement: SettlementRecord = {
      id: `settlement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: this.transaction.id,
      status: 'PENDING',
      waterfall: settlementItems,
      totalAmount,
      currency,
      settledAt: null,
      settledBy: null,
      reference: null,
      eInvoiceId: null
    };

    this.transaction.settlement = settlement;
    this.addAuditEvent('SETTLEMENT_INITIATED', `Settlement initiated: ${totalAmount} ${currency}`);

    return { success: true, settlement };
  }

  /**
   * Complete settlement
   */
  async completeSettlement(
    settledBy: string,
    reference: string,
    eInvoiceId: string | null
  ): Promise<{ success: boolean }> {
    if (!this.transaction.settlement) {
      return { success: false };
    }

    this.transaction.settlement.status = 'COMPLETED';
    this.transaction.settlement.settledAt = new Date().toISOString();
    this.transaction.settlement.settledBy = settledBy;
    this.transaction.settlement.reference = reference;
    this.transaction.settlement.eInvoiceId = eInvoiceId;

    // Mark all waterfall items as paid
    this.transaction.settlement.waterfall.forEach(item => {
      item.status = 'PAID';
      item.paidAt = new Date().toISOString();
      item.reference = reference;
    });

    this.addAuditEvent('SETTLEMENT_COMPLETED', `Settlement completed: ${reference}`);

    return { success: true };
  }

  /**
   * Get release summary
   */
  getSummary(): ReleaseSummary {
    const conditions = this.transaction.releaseConditions;
    const approval = this.transaction.releaseApproval;
    const settlement = this.transaction.settlement;

    return {
      transactionId: this.transaction.id,
      totalConditions: conditions.length,
      satisfiedConditions: conditions.filter(c => c.status === 'SATISFIED').length,
      criticalConditions: conditions.filter(c => c.critical).length,
      criticalSatisfied: conditions.filter(c => c.critical && c.status === 'SATISFIED').length,
      approvalStatus: approval?.status || 'NOT_CREATED',
      approvalRequired: approval?.requiredApprovals || 0,
      approvalReceived: approval?.approvals.filter(a => a.decision === 'APPROVED').length || 0,
      settlementStatus: settlement?.status || 'NOT_STARTED',
      settlementAmount: settlement?.totalAmount || 0,
      settlementCurrency: settlement?.currency || 'USD'
    };
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  private async evaluateCondition(condition: ReleaseCondition): Promise<void> {
    // In production, this would check actual transaction state
    // For now, we'll use the transaction data to evaluate

    switch (condition.type) {
      case 'KYB':
        if (this.transaction.buyer.kybStatus === 'APPROVED' && 
            this.transaction.exporter.kybStatus === 'APPROVED') {
          condition.status = 'SATISFIED';
          condition.satisfiedAt = new Date().toISOString();
          condition.evidence = 'Both parties KYB approved';
        }
        break;

      case 'COMPLIANCE':
        if (this.transaction.compliancePack.status === 'READY') {
          condition.status = 'SATISFIED';
          condition.satisfiedAt = new Date().toISOString();
          condition.evidence = 'Compliance pack ready';
        }
        break;

      case 'INSPECTION':
        if (this.transaction.inspection?.status === 'PASSED') {
          condition.status = 'SATISFIED';
          condition.satisfiedAt = new Date().toISOString();
          condition.evidence = 'Inspection passed';
        }
        break;

      case 'QUALITY':
        if (this.transaction.inspection?.qualityScore?.overall >= 70) {
          condition.status = 'SATISFIED';
          condition.satisfiedAt = new Date().toISOString();
          condition.evidence = `Quality score: ${this.transaction.inspection.qualityScore.overall}%`;
        }
        break;

      case 'FINANCE':
        if (this.transaction.financing?.status === 'FUNDED') {
          condition.status = 'SATISFIED';
          condition.satisfiedAt = new Date().toISOString();
          condition.evidence = 'Funds secured';
        }
        break;

      case 'SHIPMENT':
        if (this.transaction.shipment?.status === 'IN_TRANSIT' || 
            this.transaction.shipment?.status === 'ARRIVED') {
          condition.status = 'SATISFIED';
          condition.satisfiedAt = new Date().toISOString();
          condition.evidence = `Shipment status: ${this.transaction.shipment.status}`;
        }
        break;

      case 'PORT':
        if (this.transaction.shipment?.status === 'ARRIVED' || 
            this.transaction.shipment?.status === 'CUSTOMS_CLEARED') {
          condition.status = 'SATISFIED';
          condition.satisfiedAt = new Date().toISOString();
          condition.evidence = 'Port verification completed';
        }
        break;

      case 'DOCUMENTS':
        const mandatoryDocs = this.transaction.compliancePack.documents.filter(d => d.required);
        const verifiedDocs = mandatoryDocs.filter(d => d.status === 'VERIFIED');
        if (verifiedDocs.length === mandatoryDocs.length) {
          condition.status = 'SATISFIED';
          condition.satisfiedAt = new Date().toISOString();
          condition.evidence = 'All mandatory documents verified';
        }
        break;
    }
  }

  private addAuditEvent(eventType: string, details: string): void {
    const event: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: this.transaction.id,
      eventType,
      category: 'RELEASE',
      action: details,
      actor: 'SYSTEM',
      actorType: 'SYSTEM',
      target: this.transaction.id,
      targetType: 'TRANSACTION',
      details: { transactionId: this.transaction.id },
      evidence: [],
      timestamp: new Date().toISOString(),
      hash: this.simpleHash(`${eventType}:${details}:${Date.now()}`),
      previousHash: null,
      ipAddress: null,
      userAgent: null
    };

    this.auditLog.push(event);
    this.transaction.auditTrail.push(event);
  }

  private simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}

// ============================================================
// RELEASE SUMMARY TYPES
// ============================================================

export interface ReleaseEligibilitySummary {
  totalConditions: number;
  satisfiedConditions: number;
  criticalConditions: number;
  criticalSatisfied: number;
  eligible: boolean;
  unsatisfiedCritical: string[];
  unsatisfiedOptional: string[];
}

export interface ReleaseSummary {
  transactionId: string;
  totalConditions: number;
  satisfiedConditions: number;
  criticalConditions: number;
  criticalSatisfied: number;
  approvalStatus: string;
  approvalRequired: number;
  approvalReceived: number;
  settlementStatus: string;
  settlementAmount: number;
  settlementCurrency: string;
}

export interface SettlementWaterfallInput {
  recipient: string;
  type: 'CAPITAL_PARTNER' | 'MASAR_FEES' | 'EXPORTER' | 'VARIANCE';
  amount: number;
}

// ============================================================
// RELEASE DISPLAY HELPERS
// ============================================================

export function getReleaseConditionDisplay(status: string): {
  label: string;
  color: string;
  icon: string;
} {
  const displays: Record<string, { label: string; color: string; icon: string }> = {
    'PENDING': { label: 'Pending', color: '#6B7280', icon: '○' },
    'SATISFIED': { label: 'Satisfied', color: '#10B981', icon: '✓' },
    'WAIVED': { label: 'Waived', color: '#F59E0B', icon: '⊘' },
    'BLOCKED': { label: 'Blocked', color: '#EF4444', icon: '✕' }
  };

  return displays[status] || { label: status, color: '#6B7280', icon: '?' };
}

export function getApprovalStatusDisplay(status: string): {
  label: string;
  color: string;
  description: string;
} {
  const displays: Record<string, { label: string; color: string; description: string }> = {
    'NOT_CREATED': { label: 'Not Created', color: '#6B7280', description: 'Release approval not yet created' },
    'PENDING': { label: 'Pending', color: '#F59E0B', description: 'Awaiting approvals' },
    'APPROVED': { label: 'Approved', color: '#10B981', description: 'Release approved' },
    'REJECTED': { label: 'Rejected', color: '#EF4444', description: 'Release rejected' }
  };

  return displays[status] || { label: status, color: '#6B7280', description: '' };
}

export function getSettlementStatusDisplay(status: string): {
  label: string;
  color: string;
  description: string;
} {
  const displays: Record<string, { label: string; color: string; description: string }> = {
    'NOT_STARTED': { label: 'Not Started', color: '#6B7280', description: 'Settlement not initiated' },
    'PENDING': { label: 'Pending', color: '#F59E0B', description: 'Settlement pending' },
    'PROCESSING': { label: 'Processing', color: '#3B82F6', description: 'Settlement in progress' },
    'COMPLETED': { label: 'Completed', color: '#10B981', description: 'Settlement completed' },
    'FAILED': { label: 'Failed', color: '#EF4444', description: 'Settlement failed' },
    'DISPUTED': { label: 'Disputed', color: '#F97316', description: 'Settlement disputed' }
  };

  return displays[status] || { label: status, color: '#6B7280', description: '' };
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
