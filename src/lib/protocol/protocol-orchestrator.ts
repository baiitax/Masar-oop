// MASAR Protocol - Protocol Orchestrator
// Central orchestration engine that connects all protocol components

import {
  MASARTransaction,
  TransactionState,
  TransactionStatus,
  OrganizationProfile,
  AuditEvent
} from './types';

import { TransactionStateMachine, StateMachineFactory } from './state-machine';
import { KYBEngine } from './kyb-engine';
import { ComplianceEngine } from './compliance-engine';
import { InspectionEngine } from './inspection-engine';
import { ReleaseEngine } from './release-engine';
import { WorkflowEngine } from './workflow-engine';
import { SLAEngine } from './sla-engine';
import { NotificationEngine } from './notification-engine';
import { CaseManagementEngine } from './case-management';

// ============================================================
// PROTOCOL ORCHESTRATOR
// ============================================================

export class ProtocolOrchestrator {
  private transaction: MASARTransaction;
  private stateMachine: TransactionStateMachine;
  private kybEngine: KYBEngine | null = null;
  private complianceEngine: ComplianceEngine;
  private inspectionEngine: InspectionEngine;
  private releaseEngine: ReleaseEngine;
  private workflowEngine: WorkflowEngine;
  private slaEngine: SLAEngine;
  private notificationEngine: NotificationEngine;
  private caseEngine: CaseManagementEngine;
  private auditLog: AuditEvent[] = [];

  constructor(transaction: MASARTransaction) {
    this.transaction = transaction;
    this.stateMachine = StateMachineFactory.getInstance(transaction);
    this.complianceEngine = new ComplianceEngine(transaction);
    this.inspectionEngine = new InspectionEngine(transaction);
    this.releaseEngine = new ReleaseEngine(transaction);
    this.workflowEngine = new WorkflowEngine();
    this.slaEngine = new SLAEngine();
    this.notificationEngine = new NotificationEngine();
    this.caseEngine = new CaseManagementEngine();
  }

  // ============================================================
  // TRANSACTION LIFECYCLE
  // ============================================================

  /**
   * Initialize a new transaction
   */
  async initializeTransaction(
    buyer: { organizationId: string; name: string; contactId: string },
    exporter: { organizationId: string; name: string; contactId: string },
    commodity: { type: string; quantity: number; unit: string; origin: string; destination: string }
  ): Promise<{ success: boolean; transactionId: string }> {
    // Generate transaction ID
    const transactionId = this.generateTransactionId(commodity.type);

    // Update transaction
    this.transaction.id = transactionId;
    this.transaction.state = 'DRAFT';
    this.transaction.buyer = {
      organizationId: buyer.organizationId,
      name: buyer.name,
      role: 'BUYER',
      kybStatus: 'NOT_STARTED',
      contactId: buyer.contactId
    };
    this.transaction.exporter = {
      organizationId: exporter.organizationId,
      name: exporter.name,
      role: 'EXPORTER',
      kybStatus: 'NOT_STARTED',
      contactId: exporter.contactId
    };
    this.transaction.commodity = {
      type: commodity.type,
      subType: '',
      quantity: commodity.quantity,
      unit: commodity.unit,
      specification: { attributes: [], tolerance: 0 },
      origin: commodity.origin,
      destination: commodity.destination
    };
    this.transaction.createdAt = new Date().toISOString();
    this.transaction.updatedAt = new Date().toISOString();

    // Initialize SLA
    this.slaEngine.initializeSLA(this.transaction);

    // Initialize release conditions
    await this.releaseEngine.initializeReleaseConditions();

    this.addAuditEvent('TRANSACTION_INITIALIZED', `Transaction ${transactionId} initialized`);

    return { success: true, transactionId };
  }

  /**
   * Start KYB verification for a party
   */
  async startKYBVerification(
    party: 'BUYER' | 'EXPORTER',
    organization: OrganizationProfile
  ): Promise<{ success: boolean; kybId: string }> {
    this.kybEngine = new KYBEngine(organization);

    await this.kybEngine.startVerification();
    await this.kybEngine.verifyEntity();
    await this.kybEngine.verifyRegistry();
    await this.kybEngine.mapOwnership();
    await this.kybEngine.screenSanctions();
    await this.kybEngine.screenPEP();
    await this.kybEngine.calculateRiskScore();

    const { decision, reason } = await this.kybEngine.makeDecision();

    // Update transaction party KYB status
    if (party === 'BUYER') {
      this.transaction.buyer.kybStatus = decision === 'AUTO_CLEAR' ? 'APPROVED' : 
                                         decision === 'BLOCK' ? 'BLOCKED' : 'HUMAN_REVIEW';
    } else {
      this.transaction.exporter.kybStatus = decision === 'AUTO_CLEAR' ? 'APPROVED' : 
                                             decision === 'BLOCK' ? 'BLOCKED' : 'HUMAN_REVIEW';
    }

    this.addAuditEvent('KYB_VERIFICATION_COMPLETED', `KYB ${party}: ${decision} - ${reason}`);

    // Evaluate workflow rules
    await this.evaluateWorkflow();

    return { success: true, kybId: organization.id };
  }

  /**
   * Load compliance template and generate pack
   */
  async initializeCompliance(): Promise<{ success: boolean; documentCount: number }> {
    await this.complianceEngine.loadLaneTemplate();
    const pack = await this.complianceEngine.generateCompliancePack();

    this.addAuditEvent('COMPLIANCE_INITIALIZED', `Compliance pack generated with ${pack.documents.length} documents`);

    return { success: true, documentCount: pack.documents.length };
  }

  /**
   * Process document upload
   */
  async processDocumentUpload(
    documentId: string,
    uploadedBy: string,
    fileUrl: string,
    metadata: Record<string, any>
  ): Promise<{ success: boolean; status: string }> {
    const result = await this.complianceEngine.processDocument(
      documentId,
      uploadedBy,
      fileUrl,
      metadata
    );

    if (result.success && result.document) {
      this.addAuditEvent('DOCUMENT_UPLOADED', `Document ${documentId} uploaded`);

      // Check expiry
      await this.complianceEngine.checkDocumentExpiry();

      // Evaluate workflow
      await this.evaluateWorkflow();
    }

    return {
      success: result.success,
      status: result.document?.status || 'UNKNOWN'
    };
  }

  /**
   * Verify document
   */
  async verifyDocument(
    documentId: string,
    verifiedBy: string,
    approved: boolean,
    notes: string
  ): Promise<{ success: boolean }> {
    const result = await this.complianceEngine.verifyDocument(
      documentId,
      verifiedBy,
      approved,
      notes
    );

    if (result.success) {
      // Evaluate workflow
      await this.evaluateWorkflow();
    }

    return { success: result.success };
  }

  /**
   * Create inspection request
   */
  async requestInspection(
    providerId: string,
    scheduledDate: string,
    notes: string
  ): Promise<{ success: boolean; inspectionId: string | null }> {
    const result = await this.inspectionEngine.createInspectionRequest(
      providerId,
      scheduledDate,
      notes
    );

    if (result.success && result.inspection) {
      this.addAuditEvent('INSPECTION_REQUESTED', `Inspection requested from provider ${providerId}`);

      // Evaluate workflow
      await this.evaluateWorkflow();

      return { success: true, inspectionId: result.inspection.id };
    }

    return { success: false, inspectionId: null };
  }

  /**
   * Process inspection result
   */
  async processInspectionResult(
    conclusion: 'PASSED' | 'CONDITIONAL' | 'FAILED',
    qualityScore: number,
    summary: string
  ): Promise<{ success: boolean }> {
    // Complete inspection
    await this.inspectionEngine.completeInspection(
      conclusion,
      summary,
      [],
      []
    );

    // Calculate quality score
    await this.inspectionEngine.calculateQualityScore();

    this.addAuditEvent('INSPECTION_RESULT', `Inspection ${conclusion}, quality score: ${qualityScore}%`);

    // Evaluate workflow
    await this.evaluateWorkflow();

    return { success: true };
  }

  /**
   * Process financing
   */
  async processFinancing(
    status: 'APPROVED' | 'DECLINED' | 'FUNDED',
    amount: number,
    provider: string
  ): Promise<{ success: boolean }> {
    // Update financing record
    this.transaction.financing = {
      id: `fin-${Date.now()}`,
      transactionId: this.transaction.id,
      type: 'ESCROW',
      requestedAmount: amount,
      approvedAmount: status === 'APPROVED' || status === 'FUNDED' ? amount : null,
      currency: 'USD',
      status: status === 'FUNDED' ? 'FUNDED' : status === 'APPROVED' ? 'APPROVED' : 'DECLINED',
      provider: {
        id: provider,
        name: provider,
        type: 'ESCROW_AGENT',
        license: '',
        contact: { name: '', email: '', phone: '', address: null }
      },
      conditions: [],
      fundedAt: status === 'FUNDED' ? new Date().toISOString() : null,
      requestedAt: new Date().toISOString(),
      approvedAt: status === 'APPROVED' || status === 'FUNDED' ? new Date().toISOString() : null
    };

    this.addAuditEvent('FINANCING_PROCESSED', `Financing ${status}: ${amount} USD`);

    // Evaluate workflow
    await this.evaluateWorkflow();

    return { success: true };
  }

  /**
   * Process shipment event
   */
  async processShipmentEvent(
    event: string,
    location: string,
    details: string
  ): Promise<{ success: boolean }> {
    // Update shipment record
    if (!this.transaction.shipment) {
      this.transaction.shipment = {
        id: `ship-${Date.now()}`,
        transactionId: this.transaction.id,
        carrier: '',
        vessel: '',
        voyage: '',
        containerNumber: '',
        sealNumber: '',
        portOfLoading: this.transaction.commodity.origin,
        portOfDischarge: this.transaction.commodity.destination,
        etd: null,
        eta: null,
        atd: null,
        ata: null,
        status: 'NOT_STARTED',
        events: [],
        documents: []
      };
    }

    // Update status based on event
    const statusMap: Record<string, string> = {
      'DEPARTED': 'DEPARTED',
      'IN_TRANSIT': 'IN_TRANSIT',
      'ARRIVED': 'ARRIVED',
      'CUSTOMS_CLEARED': 'CUSTOMS_CLEARED'
    };

    if (statusMap[event]) {
      this.transaction.shipment.status = statusMap[event] as any;
    }

    // Add event
    this.transaction.shipment.events.push({
      timestamp: new Date().toISOString(),
      location,
      event,
      description: details,
      documentRef: null
    });

    this.addAuditEvent('SHIPMENT_EVENT', `Shipment ${event}: ${details}`);

    // Evaluate workflow
    await this.evaluateWorkflow();

    return { success: true };
  }

  /**
   * Request release approval
   */
  async requestReleaseApproval(
    approvers: { userId: string; name: string; role: string }[]
  ): Promise<{ success: boolean; approvalId: string | null }> {
    // Evaluate release conditions
    const { eligible, summary } = await this.releaseEngine.evaluateReleaseConditions();

    if (!eligible) {
      this.addAuditEvent('RELEASE_NOT_ELIGIBLE', `Release not eligible: ${summary.unsatisfiedCritical.length} critical conditions not met`);
      return { success: false, approvalId: null };
    }

    // Create release approval
    const { approval } = await this.releaseEngine.createReleaseApproval(
      approvers.length,
      approvers
    );

    this.addAuditEvent('RELEASE_APPROVAL_REQUESTED', `Release approval requested from ${approvers.length} approvers`);

    return { success: true, approvalId: approval.id };
  }

  /**
   * Submit release approval decision
   */
  async submitReleaseApproval(
    userId: string,
    decision: 'APPROVED' | 'REJECTED',
    notes: string
  ): Promise<{ success: boolean; approved: boolean }> {
    const { success, approvalComplete } = await this.releaseEngine.submitApproval(
      userId,
      decision,
      notes
    );

    if (success && approvalComplete && decision === 'APPROVED') {
      // Process settlement
      await this.processSettlement();
    }

    return { success, approved: approvalComplete && decision === 'APPROVED' };
  }

  /**
   * Process settlement
   */
  async processSettlement(): Promise<{ success: boolean }> {
    const totalAmount = this.transaction.financing?.approvedAmount || 0;

    // Define waterfall
    const waterfall = [
      { recipient: 'Capital Partner', type: 'CAPITAL_PARTNER' as const, amount: totalAmount * 0.85 },
      { recipient: 'MASAR Fees', type: 'MASAR_FEES' as const, amount: totalAmount * 0.05 },
      { recipient: 'Exporter', type: 'EXPORTER' as const, amount: totalAmount * 0.10 }
    ];

    await this.releaseEngine.processSettlement(totalAmount, 'USD', waterfall);

    // Complete settlement
    await this.releaseEngine.completeSettlement(
      'SYSTEM',
      `SETTLE-${Date.now()}`,
      null
    );

    // Transition to completed
    await this.stateMachine.transition(
      'COMPLETED',
      'SYSTEM',
      'SYSTEM',
      'Settlement completed'
    );

    this.addAuditEvent('SETTLEMENT_COMPLETED', `Settlement completed: ${totalAmount} USD`);

    return { success: true };
  }

  // ============================================================
  // WORKFLOW EVALUATION
  // ============================================================

  /**
   * Evaluate workflow rules
   */
  private async evaluateWorkflow(): Promise<void> {
    const context = {
      transaction: this.transaction,
      compliance: this.complianceEngine.getSummary(),
      inspection: this.inspectionEngine.getSummary(),
      release: this.releaseEngine.getSummary()
    };

    const { triggeredRules, actions } = await this.workflowEngine.evaluateRules(
      this.transaction,
      context
    );

    if (triggeredRules.length > 0) {
      await this.workflowEngine.executeActions(this.transaction, actions, context);
    }
  }

  // ============================================================
  // STATUS & REPORTING
  // ============================================================

  /**
   * Get transaction status
   */
  getStatus(): TransactionStatusReport {
    return {
      transactionId: this.transaction.id,
      state: this.transaction.state,
      stateLabel: this.getStateLabel(this.transaction.state),
      nextAction: this.transaction.nextAction,
      buyer: {
        name: this.transaction.buyer.name,
        kybStatus: this.transaction.buyer.kybStatus
      },
      exporter: {
        name: this.transaction.exporter.name,
        kybStatus: this.transaction.exporter.kybStatus
      },
      compliance: this.complianceEngine.getSummary(),
      inspection: this.inspectionEngine.getSummary(),
      release: this.releaseEngine.getSummary(),
      sla: this.slaEngine.getSummary(this.transaction),
      cases: this.caseEngine.getCasesForTransaction(this.transaction.id).length,
      lastUpdated: this.transaction.updatedAt
    };
  }

  /**
   * Get protocol confidence
   */
  getProtocolConfidence(): ProtocolConfidence {
    const compliance = this.complianceEngine.getSummary();
    const inspection = this.inspectionEngine.getSummary();
    const release = this.releaseEngine.getSummary();

    return {
      transactionId: this.transaction.id,
      overall: this.calculateOverallConfidence(),
      factors: [
        {
          category: 'Identity',
          score: this.calculateIdentityConfidence(),
          status: this.transaction.buyer.kybStatus === 'APPROVED' && 
                  this.transaction.exporter.kybStatus === 'APPROVED' ? 'COMPLETE' : 'INCOMPLETE'
        },
        {
          category: 'Compliance',
          score: compliance.clearanceReadiness.overall,
          status: compliance.status === 'READY' ? 'COMPLETE' : 'INCOMPLETE'
        },
        {
          category: 'Inspection',
          score: inspection.qualityScore?.overall || 0,
          status: inspection.conclusion === 'PASSED' ? 'COMPLETE' : 'INCOMPLETE'
        },
        {
          category: 'Finance',
          score: this.transaction.financing?.status === 'FUNDED' ? 100 : 0,
          status: this.transaction.financing?.status === 'FUNDED' ? 'COMPLETE' : 'INCOMPLETE'
        },
        {
          category: 'Release',
          score: (release.criticalSatisfied / release.criticalConditions) * 100,
          status: release.criticalSatisfied === release.criticalConditions ? 'COMPLETE' : 'INCOMPLETE'
        }
      ],
      readyForRelease: this.isReadyForRelease()
    };
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  private generateTransactionId(commodityType: string): string {
    const prefix = commodityType.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const sequence = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    return `MASAR-${prefix}-${year}-${sequence}`;
  }

  private getStateLabel(state: TransactionStatus): string {
    const labels: Record<string, string> = {
      'DRAFT': 'Draft',
      'RFQ': 'Request for Quote',
      'BUYER_VERIFIED': 'Buyer Verified',
      'EXPORTER_VERIFIED': 'Exporter Verified',
      'COMMERCIAL_MATCH': 'Commercial Match',
      'CONTRACTED': 'Contracted',
      'COMPLIANCE_REVIEW': 'Compliance Review',
      'COMPLIANCE_READY': 'Compliance Ready',
      'INSPECTION_PENDING': 'Inspection Pending',
      'INSPECTION_IN_PROGRESS': 'Inspection In Progress',
      'INSPECTION_PASSED': 'Inspection Passed',
      'FINANCE_PENDING': 'Finance Pending',
      'FINANCE_APPROVED': 'Finance Approved',
      'FUNDS_SECURED': 'Funds Secured',
      'SHIPMENT_READY': 'Shipment Ready',
      'IN_TRANSIT': 'In Transit',
      'ARRIVED': 'Arrived',
      'PORT_VERIFICATION': 'Port Verification',
      'RELEASE_ELIGIBLE': 'Release Eligible',
      'RELEASE_APPROVAL': 'Release Approval',
      'SETTLEMENT': 'Settlement',
      'COMPLETED': 'Completed'
    };

    return labels[state] || state;
  }

  private calculateOverallConfidence(): number {
    const factors = [
      this.calculateIdentityConfidence(),
      this.complianceEngine.getSummary().clearanceReadiness.overall,
      this.inspectionEngine.getSummary().qualityScore?.overall || 0,
      this.transaction.financing?.status === 'FUNDED' ? 100 : 0,
      (this.releaseEngine.getSummary().criticalSatisfied / this.releaseEngine.getSummary().criticalConditions) * 100
    ];

    return Math.round(factors.reduce((sum, f) => sum + f, 0) / factors.length);
  }

  private calculateIdentityConfidence(): number {
    let score = 0;

    if (this.transaction.buyer.kybStatus === 'APPROVED') score += 50;
    if (this.transaction.exporter.kybStatus === 'APPROVED') score += 50;

    return score;
  }

  private isReadyForRelease(): boolean {
    const release = this.releaseEngine.getSummary();
    return release.criticalSatisfied === release.criticalConditions;
  }

  private addAuditEvent(eventType: string, details: string): void {
    const event: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: this.transaction.id,
      eventType,
      category: 'SYSTEM',
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
// ORCHESTRATOR TYPES
// ============================================================

export interface TransactionStatusReport {
  transactionId: string;
  state: TransactionStatus;
  stateLabel: string;
  nextAction: string | null;
  buyer: {
    name: string;
    kybStatus: string;
  };
  exporter: {
    name: string;
    kybStatus: string;
  };
  compliance: any;
  inspection: any;
  release: any;
  sla: any;
  cases: number;
  lastUpdated: string;
}

export interface ProtocolConfidence {
  transactionId: string;
  overall: number;
  factors: {
    category: string;
    score: number;
    status: 'COMPLETE' | 'INCOMPLETE';
  }[];
  readyForRelease: boolean;
}

// ============================================================
// ORCHESTRATOR FACTORY
// ============================================================

export class ProtocolOrchestratorFactory {
  private static instances: Map<string, ProtocolOrchestrator> = new Map();

  /**
   * Get or create orchestrator for transaction
   */
  static getInstance(transaction: MASARTransaction): ProtocolOrchestrator {
    if (!this.instances.has(transaction.id)) {
      this.instances.set(transaction.id, new ProtocolOrchestrator(transaction));
    }
    return this.instances.get(transaction.id)!;
  }

  /**
   * Remove instance
   */
  static removeInstance(transactionId: string): void {
    this.instances.delete(transactionId);
  }

  /**
   * Clear all instances
   */
  static clearAll(): void {
    this.instances.clear();
  }
}
