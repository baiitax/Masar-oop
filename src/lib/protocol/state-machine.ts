// MASAR Protocol - Transaction State Machine
// The core engine that controls all transaction state transitions

import { 
  TransactionState, 
  ExceptionState, 
  TransactionStatus,
  MASARTransaction,
  StateTransition,
  AuditEvent
} from './types';

// ============================================================
// STATE MACHINE DEFINITION
// ============================================================

export const VALID_TRANSITIONS: Record<TransactionState, TransactionState[]> = {
  'DRAFT': ['RFQ'],
  'RFQ': ['BUYER_VERIFIED', 'CANCELLED'],
  'BUYER_VERIFIED': ['EXPORTER_VERIFIED', 'CANCELLED'],
  'EXPORTER_VERIFIED': ['COMMERCIAL_MATCH', 'CANCELLED'],
  'COMMERCIAL_MATCH': ['CONTRACTED', 'CANCELLED'],
  'CONTRACTED': ['COMPLIANCE_REVIEW', 'CANCELLED'],
  'COMPLIANCE_REVIEW': ['COMPLIANCE_READY', 'COMPLIANCE_EXCEPTION'],
  'COMPLIANCE_READY': ['INSPECTION_PENDING', 'CANCELLED'],
  'INSPECTION_PENDING': ['INSPECTION_IN_PROGRESS', 'CANCELLED'],
  'INSPECTION_IN_PROGRESS': ['INSPECTION_PASSED', 'INSPECTION_FAILED'],
  'INSPECTION_PASSED': ['FINANCE_PENDING', 'CANCELLED'],
  'FINANCE_PENDING': ['FINANCE_APPROVED', 'FINANCE_DECLINED'],
  'FINANCE_APPROVED': ['FUNDS_SECURED', 'CANCELLED'],
  'FUNDS_SECURED': ['SHIPMENT_READY', 'CANCELLED'],
  'SHIPMENT_READY': ['IN_TRANSIT', 'SHIPMENT_DELAY'],
  'IN_TRANSIT': ['ARRIVED', 'SHIPMENT_DELAY'],
  'ARRIVED': ['PORT_VERIFICATION', 'PORT_EXCEPTION'],
  'PORT_VERIFICATION': ['RELEASE_ELIGIBLE', 'PORT_EXCEPTION'],
  'RELEASE_ELIGIBLE': ['RELEASE_APPROVAL'],
  'RELEASE_APPROVAL': ['SETTLEMENT', 'CANCELLED'],
  'SETTLEMENT': ['COMPLETED', 'SETTLEMENT_EXCEPTION'],
  'COMPLETED': []
};

export const EXCEPTION_TRANSITIONS: Record<ExceptionState, TransactionState[]> = {
  'KYB_EXCEPTION': ['BUYER_VERIFIED', 'EXPORTER_VERIFIED', 'CANCELLED'],
  'SANCTIONS_EXCEPTION': ['CANCELLED'],
  'COMPLIANCE_EXCEPTION': ['COMPLIANCE_REVIEW', 'CANCELLED'],
  'DOCUMENT_EXCEPTION': ['COMPLIANCE_REVIEW', 'CANCELLED'],
  'INSPECTION_FAILED': ['INSPECTION_PENDING', 'CANCELLED'],
  'QUALITY_VARIANCE': ['INSPECTION_PENDING', 'CANCELLED'],
  'FINANCE_DECLINED': ['FINANCE_PENDING', 'CANCELLED'],
  'SHIPMENT_DELAY': ['SHIPMENT_READY', 'IN_TRANSIT', 'CANCELLED'],
  'PORT_EXCEPTION': ['PORT_VERIFICATION', 'CANCELLED'],
  'SETTLEMENT_EXCEPTION': ['SETTLEMENT', 'CANCELLED'],
  'DISPUTE': ['SETTLEMENT', 'CANCELLED'],
  'CANCELLED': []
};

// ============================================================
// STATE MACHINE ENGINE
// ============================================================

export class TransactionStateMachine {
  private transaction: MASARTransaction;
  private auditLog: AuditEvent[] = [];

  constructor(transaction: MASARTransaction) {
    this.transaction = transaction;
  }

  /**
   * Get current transaction state
   */
  getCurrentState(): TransactionStatus {
    return this.transaction.state;
  }

  /**
   * Check if a transition is valid
   */
  canTransition(toState: TransactionStatus): boolean {
    const currentState = this.transaction.state;
    
    // Check if it's a valid normal transition
    if (this.isNormalState(currentState)) {
      const validTransitions = VALID_TRANSITIONS[currentState as TransactionState];
      return validTransitions.includes(toState as TransactionState);
    }
    
    // Check if it's a valid exception transition
    if (this.isExceptionState(currentState)) {
      const validTransitions = EXCEPTION_TRANSITIONS[currentState as ExceptionState];
      return validTransitions.includes(toState as TransactionState);
    }
    
    return false;
  }

  /**
   * Execute a state transition
   */
  async transition(
    toState: TransactionStatus,
    triggeredBy: string,
    triggerType: 'USER' | 'SYSTEM' | 'API',
    reason: string,
    evidence: string[] = []
  ): Promise<{ success: boolean; error?: string }> {
    // Validate transition
    if (!this.canTransition(toState)) {
      return {
        success: false,
        error: `Invalid transition from ${this.transaction.state} to ${toState}`
      };
    }

    const previousState = this.transaction.state;
    const timestamp = new Date().toISOString();

    // Create state transition record
    const transition: StateTransition = {
      from: previousState,
      to: toState,
      timestamp,
      triggeredBy,
      triggerType,
      reason,
      evidence
    };

    // Update transaction
    this.transaction.previousState = previousState;
    this.transaction.state = toState;
    this.transaction.stateHistory.push(transition);
    this.transaction.updatedAt = timestamp;

    // Create audit event
    const auditEvent = this.createAuditEvent(
      'STATE_TRANSITION',
      'SYSTEM',
      `State transition: ${previousState} → ${toState}`,
      triggeredBy,
      triggerType,
      {
        previousState,
        newState: toState,
        reason,
        evidence
      }
    );

    this.auditLog.push(auditEvent);
    this.transaction.auditTrail.push(auditEvent);

    // Determine next action
    this.transaction.nextAction = this.determineNextAction(toState);

    return { success: true };
  }

  /**
   * Get available transitions from current state
   */
  getAvailableTransitions(): TransactionState[] | ExceptionState[] {
    const currentState = this.transaction.state;
    
    if (this.isNormalState(currentState)) {
      return VALID_TRANSITIONS[currentState as TransactionState];
    }
    
    if (this.isExceptionState(currentState)) {
      return EXCEPTION_TRANSITIONS[currentState as ExceptionState];
    }
    
    return [];
  }

  /**
   * Check if transaction is in a terminal state
   */
  isTerminalState(): boolean {
    return this.transaction.state === 'COMPLETED' || 
           this.transaction.state === 'CANCELLED';
  }

  /**
   * Check if transaction is in an exception state
   */
  isInExceptionState(): boolean {
    return this.isExceptionState(this.transaction.state);
  }

  /**
   * Get state history
   */
  getStateHistory(): StateTransition[] {
    return this.transaction.stateHistory;
  }

  /**
   * Get audit trail
   */
  getAuditTrail(): AuditEvent[] {
    return this.transaction.auditTrail;
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  private isNormalState(state: TransactionStatus): boolean {
    return state in VALID_TRANSITIONS;
  }

  private isExceptionState(state: TransactionStatus): boolean {
    return state in EXCEPTION_TRANSITIONS;
  }

  private determineNextAction(state: TransactionStatus): string | null {
    const actions: Record<string, string> = {
      'DRAFT': 'Complete transaction details and submit RFQ',
      'RFQ': 'Verify buyer identity and KYB',
      'BUYER_VERIFIED': 'Verify exporter identity and KYB',
      'EXPORTER_VERIFIED': 'Match buyer and exporter for commercial terms',
      'COMMERCIAL_MATCH': 'Execute contract between parties',
      'CONTRACTED': 'Initiate compliance review and document collection',
      'COMPLIANCE_REVIEW': 'Complete compliance pack and verify documents',
      'COMPLIANCE_READY': 'Request inspection from approved provider',
      'INSPECTION_PENDING': 'Inspection provider to accept and schedule',
      'INSPECTION_IN_PROGRESS': 'Await inspection completion and lab results',
      'INSPECTION_PASSED': 'Submit financing request to capital partner',
      'FINANCE_PENDING': 'Await financing approval',
      'FINANCE_APPROVED': 'Confirm funds secured in escrow',
      'FUNDS_SECURED': 'Prepare shipment documentation',
      'SHIPMENT_READY': 'Confirm vessel departure',
      'IN_TRANSIT': 'Track shipment and await arrival',
      'ARRIVED': 'Complete port verification',
      'PORT_VERIFICATION': 'Evaluate release conditions',
      'RELEASE_ELIGIBLE': 'Submit for human release authorization',
      'RELEASE_APPROVAL': 'Process settlement through licensed partner',
      'SETTLEMENT': 'Finalize transaction and generate reports',
      'COMPLETED': 'Transaction completed successfully'
    };

    return actions[state] || null;
  }

  private createAuditEvent(
    eventType: string,
    category: string,
    action: string,
    actor: string,
    actorType: 'USER' | 'SYSTEM' | 'PARTNER' | 'API',
    details: Record<string, any>
  ): AuditEvent {
    const timestamp = new Date().toISOString();
    const previousHash = this.transaction.auditTrail.length > 0
      ? this.transaction.auditTrail[this.transaction.auditTrail.length - 1].hash
      : null;

    // Create hash (simplified - in production use proper cryptographic hash)
    const hashInput = `${this.transaction.id}:${eventType}:${timestamp}:${JSON.stringify(details)}:${previousHash}`;
    const hash = this.simpleHash(hashInput);

    return {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: this.transaction.id,
      eventType,
      category: category as any,
      action,
      actor,
      actorType,
      target: this.transaction.id,
      targetType: 'TRANSACTION',
      details,
      evidence: [],
      timestamp,
      hash,
      previousHash,
      ipAddress: null,
      userAgent: null
    };
  }

  private simpleHash(input: string): string {
    // Simple hash for demo - in production use crypto.subtle.digest
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
// STATE MACHINE FACTORY
// ============================================================

export class StateMachineFactory {
  private static instances: Map<string, TransactionStateMachine> = new Map();

  /**
   * Get or create a state machine for a transaction
   */
  static getInstance(transaction: MASARTransaction): TransactionStateMachine {
    if (!this.instances.has(transaction.id)) {
      this.instances.set(transaction.id, new TransactionStateMachine(transaction));
    }
    return this.instances.get(transaction.id)!;
  }

  /**
   * Remove instance from cache
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

// ============================================================
// STATE VALIDATION RULES
// ============================================================

export interface StateValidationRule {
  state: TransactionState;
  validate: (transaction: MASARTransaction) => ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export const STATE_VALIDATION_RULES: StateValidationRule[] = [
  {
    state: 'BUYER_VERIFIED',
    validate: (tx) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (tx.buyer.kybStatus !== 'APPROVED') {
        errors.push('Buyer KYB must be approved');
      }

      return { valid: errors.length === 0, errors, warnings };
    }
  },
  {
    state: 'EXPORTER_VERIFIED',
    validate: (tx) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (tx.exporter.kybStatus !== 'APPROVED') {
        errors.push('Exporter KYB must be approved');
      }

      return { valid: errors.length === 0, errors, warnings };
    }
  },
  {
    state: 'COMPLIANCE_READY',
    validate: (tx) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (tx.compliancePack.status !== 'READY') {
        errors.push('Compliance pack must be ready');
      }

      const mandatoryDocs = tx.compliancePack.documents.filter(d => d.required);
      const verifiedDocs = mandatoryDocs.filter(d => d.status === 'VERIFIED');
      
      if (verifiedDocs.length < mandatoryDocs.length) {
        errors.push(`${mandatoryDocs.length - verifiedDocs.length} mandatory documents not verified`);
      }

      return { valid: errors.length === 0, errors, warnings };
    }
  },
  {
    state: 'INSPECTION_PASSED',
    validate: (tx) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!tx.inspection) {
        errors.push('Inspection record required');
      } else if (tx.inspection.status !== 'PASSED') {
        errors.push('Inspection must have passed');
      }

      return { valid: errors.length === 0, errors, warnings };
    }
  },
  {
    state: 'FUNDS_SECURED',
    validate: (tx) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!tx.financing) {
        errors.push('Financing record required');
      } else if (tx.financing.status !== 'FUNDED') {
        errors.push('Funds must be secured');
      }

      return { valid: errors.length === 0, errors, warnings };
    }
  },
  {
    state: 'RELEASE_ELIGIBLE',
    validate: (tx) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      const unsatisfiedConditions = tx.releaseConditions.filter(
        c => c.status !== 'SATISFIED' && c.critical
      );

      if (unsatisfiedConditions.length > 0) {
        errors.push(`${unsatisfiedConditions.length} critical release conditions not satisfied`);
      }

      return { valid: errors.length === 0, errors, warnings };
    }
  }
];

/**
 * Validate transaction before state transition
 */
export function validateStateTransition(
  transaction: MASARTransaction,
  targetState: TransactionState
): ValidationResult {
  const rule = STATE_VALIDATION_RULES.find(r => r.state === targetState);
  
  if (!rule) {
    return { valid: true, errors: [], warnings: [] };
  }

  return rule.validate(transaction);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get human-readable state label
 */
export function getStateLabel(state: TransactionStatus): string {
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
    'COMPLETED': 'Completed',
    'KYB_EXCEPTION': 'KYB Exception',
    'SANCTIONS_EXCEPTION': 'Sanctions Exception',
    'COMPLIANCE_EXCEPTION': 'Compliance Exception',
    'DOCUMENT_EXCEPTION': 'Document Exception',
    'INSPECTION_FAILED': 'Inspection Failed',
    'QUALITY_VARIANCE': 'Quality Variance',
    'FINANCE_DECLINED': 'Finance Declined',
    'SHIPMENT_DELAY': 'Shipment Delay',
    'PORT_EXCEPTION': 'Port Exception',
    'SETTLEMENT_EXCEPTION': 'Settlement Exception',
    'DISPUTE': 'Dispute',
    'CANCELLED': 'Cancelled'
  };

  return labels[state] || state;
}

/**
 * Get state color for UI
 */
export function getStateColor(state: TransactionStatus): string {
  if (state === 'COMPLETED') return '#10B981'; // Green
  if (state === 'CANCELLED') return '#6B7280'; // Gray
  if (state.includes('EXCEPTION') || state.includes('FAILED') || state.includes('DECLINED') || state === 'DISPUTE') {
    return '#EF4444'; // Red
  }
  if (state.includes('DELAY') || state.includes('VARIANCE')) {
    return '#F59E0B'; // Amber
  }
  return '#3B82F6'; // Blue
}

/**
 * Get state category
 */
export function getStateCategory(state: TransactionStatus): string {
  if (['DRAFT', 'RFQ', 'BUYER_VERIFIED', 'EXPORTER_VERIFIED', 'COMMERCIAL_MATCH', 'CONTRACTED'].includes(state)) {
    return 'IDENTITY';
  }
  if (['COMPLIANCE_REVIEW', 'COMPLIANCE_READY'].includes(state)) {
    return 'COMPLIANCE';
  }
  if (['INSPECTION_PENDING', 'INSPECTION_IN_PROGRESS', 'INSPECTION_PASSED'].includes(state)) {
    return 'INSPECTION';
  }
  if (['FINANCE_PENDING', 'FINANCE_APPROVED', 'FUNDS_SECURED'].includes(state)) {
    return 'FINANCE';
  }
  if (['SHIPMENT_READY', 'IN_TRANSIT', 'ARRIVED', 'PORT_VERIFICATION'].includes(state)) {
    return 'LOGISTICS';
  }
  if (['RELEASE_ELIGIBLE', 'RELEASE_APPROVAL'].includes(state)) {
    return 'RELEASE';
  }
  if (['SETTLEMENT', 'COMPLETED'].includes(state)) {
    return 'SETTLEMENT';
  }
  return 'EXCEPTION';
}
