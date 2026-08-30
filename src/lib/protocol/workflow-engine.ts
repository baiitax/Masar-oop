// MASAR Protocol - Workflow Automation Engine
// Configurable rules engine for transaction automation

import {
  WorkflowRule,
  WorkflowCondition,
  WorkflowAction,
  MASARTransaction,
  TransactionState,
  AuditEvent,
  Notification,
  Case
} from './types';

// ============================================================
// WORKFLOW ENGINE
// ============================================================

export class WorkflowEngine {
  private rules: Map<string, WorkflowRule> = new Map();
  private auditLog: AuditEvent[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Initialize default workflow rules
   */
  private initializeDefaultRules(): void {
    const defaultRules: WorkflowRule[] = [
      {
        id: 'rule-001',
        name: 'KYB Approved - Start Compliance',
        description: 'When KYB is approved and required documents are complete, create compliance review',
        version: '1.0',
        conditions: [
          { field: 'buyer.kybStatus', operator: 'EQUALS', value: 'APPROVED', logicalOperator: 'AND' },
          { field: 'exporter.kybStatus', operator: 'EQUALS', value: 'APPROVED', logicalOperator: null }
        ],
        actions: [
          { type: 'TRANSITION_STATE', config: { targetState: 'COMPLIANCE_REVIEW' }, delay: null },
          { type: 'CREATE_TASK', config: { type: 'COMPLIANCE_REVIEW', assignee: 'COMPLIANCE_TEAM' }, delay: null },
          { type: 'SEND_NOTIFICATION', config: { recipients: ['COMPLIANCE_TEAM', 'OPERATIONS'], template: 'KYB_APPROVED' }, delay: null }
        ],
        priority: 1,
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: 'SYSTEM',
        approvedBy: null,
        approvedAt: null
      },
      {
        id: 'rule-002',
        name: 'Compliance Ready - Request Inspection',
        description: 'When compliance is ready, create inspection request',
        version: '1.0',
        conditions: [
          { field: 'compliancePack.status', operator: 'EQUALS', value: 'READY', logicalOperator: null }
        ],
        actions: [
          { type: 'TRANSITION_STATE', config: { targetState: 'INSPECTION_PENDING' }, delay: null },
          { type: 'CREATE_TASK', config: { type: 'INSPECTION_REQUEST', assignee: 'INSPECTION_TEAM' }, delay: null },
          { type: 'SEND_NOTIFICATION', config: { recipients: ['INSPECTION_TEAM', 'EXPORTER'], template: 'COMPLIANCE_READY' }, delay: null }
        ],
        priority: 2,
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: 'SYSTEM',
        approvedBy: null,
        approvedAt: null
      },
      {
        id: 'rule-003',
        name: 'Inspection Passed - Notify Finance',
        description: 'When inspection passes, recalculate clearance readiness and notify finance',
        version: '1.0',
        conditions: [
          { field: 'inspection.status', operator: 'EQUALS', value: 'PASSED', logicalOperator: null }
        ],
        actions: [
          { type: 'TRANSITION_STATE', config: { targetState: 'FINANCE_PENDING' }, delay: null },
          { type: 'SEND_NOTIFICATION', config: { recipients: ['FINANCE_TEAM', 'OPERATIONS'], template: 'INSPECTION_PASSED' }, delay: null }
        ],
        priority: 3,
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: 'SYSTEM',
        approvedBy: null,
        approvedAt: null
      },
      {
        id: 'rule-004',
        name: 'Inspection Failed - Freeze Release',
        description: 'When inspection fails, freeze release and create remediation case',
        version: '1.0',
        conditions: [
          { field: 'inspection.status', operator: 'EQUALS', value: 'FAILED', logicalOperator: null }
        ],
        actions: [
          { type: 'TRANSITION_STATE', config: { targetState: 'INSPECTION_FAILED' }, delay: null },
          { type: 'CREATE_TASK', config: { type: 'REMEDIATION', assignee: 'OPERATIONS' }, delay: null },
          { type: 'SEND_NOTIFICATION', config: { recipients: ['OPERATIONS', 'COMPLIANCE', 'BUYER', 'EXPORTER'], template: 'INSPECTION_FAILED' }, delay: null }
        ],
        priority: 4,
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: 'SYSTEM',
        approvedBy: null,
        approvedAt: null
      },
      {
        id: 'rule-005',
        name: 'Finance Approved - Mark Condition',
        description: 'When finance is approved and funds confirmed, mark finance condition satisfied',
        version: '1.0',
        conditions: [
          { field: 'financing.status', operator: 'EQUALS', value: 'FUNDED', logicalOperator: null }
        ],
        actions: [
          { type: 'TRANSITION_STATE', config: { targetState: 'FUNDS_SECURED' }, delay: null },
          { type: 'SEND_NOTIFICATION', config: { recipients: ['OPERATIONS', 'FINANCE_TEAM'], template: 'FUNDS_SECURED' }, delay: null }
        ],
        priority: 5,
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: 'SYSTEM',
        approvedBy: null,
        approvedAt: null
      },
      {
        id: 'rule-006',
        name: 'All Release Conditions Met - Create Approval',
        description: 'When all release conditions are satisfied, create release approval task',
        version: '1.0',
        conditions: [
          { field: 'releaseConditions', operator: 'ALL_SATISFIED', value: true, logicalOperator: null }
        ],
        actions: [
          { type: 'TRANSITION_STATE', config: { targetState: 'RELEASE_ELIGIBLE' }, delay: null },
          { type: 'CREATE_TASK', config: { type: 'RELEASE_APPROVAL', assignee: 'OPERATIONS' }, delay: null },
          { type: 'SEND_NOTIFICATION', config: { recipients: ['OPERATIONS', 'FINANCE_TEAM', 'COMPLIANCE'], template: 'RELEASE_ELIGIBLE' }, delay: null }
        ],
        priority: 6,
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: 'SYSTEM',
        approvedBy: null,
        approvedAt: null
      },
      {
        id: 'rule-007',
        name: 'Document Expiring - Warning',
        description: 'When a document is expiring within 14 days, send warning notification',
        version: '1.0',
        conditions: [
          { field: 'document.expiryDays', operator: 'LESS_THAN', value: 14, logicalOperator: null }
        ],
        actions: [
          { type: 'SEND_NOTIFICATION', config: { recipients: ['COMPLIANCE', 'EXPORTER'], template: 'DOCUMENT_EXPIRING' }, delay: null }
        ],
        priority: 7,
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: 'SYSTEM',
        approvedBy: null,
        approvedAt: null
      },
      {
        id: 'rule-008',
        name: 'SLA Warning - 70%',
        description: 'When SLA reaches 70%, notify owner',
        version: '1.0',
        conditions: [
          { field: 'sla.percentage', operator: 'GREATER_THAN', value: 70, logicalOperator: null }
        ],
        actions: [
          { type: 'SEND_NOTIFICATION', config: { recipients: ['OWNER'], template: 'SLA_WARNING' }, delay: null }
        ],
        priority: 8,
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: 'SYSTEM',
        approvedBy: null,
        approvedAt: null
      },
      {
        id: 'rule-009',
        name: 'SLA Critical - 85%',
        description: 'When SLA reaches 85%, notify supervisor',
        version: '1.0',
        conditions: [
          { field: 'sla.percentage', operator: 'GREATER_THAN', value: 85, logicalOperator: null }
        ],
        actions: [
          { type: 'SEND_NOTIFICATION', config: { recipients: ['SUPERVISOR', 'OWNER'], template: 'SLA_CRITICAL' }, delay: null },
          { type: 'ESCALATE', config: { level: 'SUPERVISOR' }, delay: null }
        ],
        priority: 9,
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: 'SYSTEM',
        approvedBy: null,
        approvedAt: null
      },
      {
        id: 'rule-010',
        name: 'Sanctions Match - Freeze Transaction',
        description: 'When sanctions match confirmed, freeze transaction and escalate',
        version: '1.0',
        conditions: [
          { field: 'sanctions.status', operator: 'EQUALS', value: 'CONFIRMED_MATCH', logicalOperator: null }
        ],
        actions: [
          { type: 'TRANSITION_STATE', config: { targetState: 'SANCTIONS_EXCEPTION' }, delay: null },
          { type: 'ESCALATE', config: { level: 'COMPLIANCE_HEAD' }, delay: null },
          { type: 'SEND_NOTIFICATION', config: { recipients: ['COMPLIANCE_HEAD', 'CEO'], template: 'SANCTIONS_MATCH' }, delay: null }
        ],
        priority: 10,
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: 'SYSTEM',
        approvedBy: null,
        approvedAt: null
      }
    ];

    defaultRules.forEach(rule => this.rules.set(rule.id, rule));
  }

  /**
   * Evaluate rules for a transaction
   */
  async evaluateRules(
    transaction: MASARTransaction,
    context: Record<string, any>
  ): Promise<{ triggeredRules: WorkflowRule[]; actions: WorkflowAction[] }> {
    const triggeredRules: WorkflowRule[] = [];
    const actions: WorkflowAction[] = [];

    // Sort rules by priority
    const sortedRules = Array.from(this.rules.values())
      .filter(rule => rule.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      const conditionsMet = await this.evaluateConditions(rule.conditions, transaction, context);

      if (conditionsMet) {
        triggeredRules.push(rule);
        actions.push(...rule.actions);

        this.addAuditEvent(
          transaction.id,
          'WORKFLOW_RULE_TRIGGERED',
          `Rule triggered: ${rule.name}`
        );
      }
    }

    return { triggeredRules, actions };
  }

  /**
   * Execute workflow actions
   */
  async executeActions(
    transaction: MASARTransaction,
    actions: WorkflowAction[],
    context: Record<string, any>
  ): Promise<{ success: boolean; results: ActionResult[] }> {
    const results: ActionResult[] = [];

    for (const action of actions) {
      try {
        const result = await this.executeAction(transaction, action, context);
        results.push(result);
      } catch (error) {
        results.push({
          action: action.type,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const allSuccess = results.every(r => r.success);
    return { success: allSuccess, results };
  }

  /**
   * Add a new workflow rule
   */
  addRule(rule: WorkflowRule): void {
    this.rules.set(rule.id, rule);
    this.addAuditEvent('', 'WORKFLOW_RULE_ADDED', `Rule added: ${rule.name}`);
  }

  /**
   * Update a workflow rule
   */
  updateRule(ruleId: string, updates: Partial<WorkflowRule>): boolean {
    const rule = this.rules.get(ruleId);

    if (!rule) {
      return false;
    }

    const updatedRule = { ...rule, ...updates };
    this.rules.set(ruleId, updatedRule);
    this.addAuditEvent('', 'WORKFLOW_RULE_UPDATED', `Rule updated: ${updatedRule.name}`);

    return true;
  }

  /**
   * Disable a workflow rule
   */
  disableRule(ruleId: string): boolean {
    return this.updateRule(ruleId, { enabled: false });
  }

  /**
   * Enable a workflow rule
   */
  enableRule(ruleId: string): boolean {
    return this.updateRule(ruleId, { enabled: true });
  }

  /**
   * Get all rules
   */
  getRules(): WorkflowRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get rule by ID
   */
  getRule(ruleId: string): WorkflowRule | null {
    return this.rules.get(ruleId) || null;
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  private async evaluateConditions(
    conditions: WorkflowCondition[],
    transaction: MASARTransaction,
    context: Record<string, any>
  ): Promise<boolean> {
    let result = true;
    let currentLogicalOperator: 'AND' | 'OR' | null = null;

    for (const condition of conditions) {
      const conditionResult = await this.evaluateCondition(condition, transaction, context);

      if (currentLogicalOperator === null) {
        result = conditionResult;
      } else if (currentLogicalOperator === 'AND') {
        result = result && conditionResult;
      } else if (currentLogicalOperator === 'OR') {
        result = result || conditionResult;
      }

      currentLogicalOperator = condition.logicalOperator;
    }

    return result;
  }

  private async evaluateCondition(
    condition: WorkflowCondition,
    transaction: MASARTransaction,
    context: Record<string, any>
  ): Promise<boolean> {
    const fieldValue = this.getFieldValue(condition.field, transaction, context);

    switch (condition.operator) {
      case 'EQUALS':
        return fieldValue === condition.value;
      case 'NOT_EQUALS':
        return fieldValue !== condition.value;
      case 'GREATER_THAN':
        return fieldValue > condition.value;
      case 'LESS_THAN':
        return fieldValue < condition.value;
      case 'CONTAINS':
        return Array.isArray(fieldValue) && fieldValue.includes(condition.value);
      case 'IN':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'NOT_IN':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
      default:
        return false;
    }
  }

  private getFieldValue(field: string, transaction: MASARTransaction, context: Record<string, any>): any {
    const parts = field.split('.');
    let value: any = { ...transaction, ...context };

    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  private async executeAction(
    transaction: MASARTransaction,
    action: WorkflowAction,
    context: Record<string, any>
  ): Promise<ActionResult> {
    switch (action.type) {
      case 'TRANSITION_STATE':
        return await this.executeTransition(transaction, action.config);
      case 'CREATE_TASK':
        return await this.executeCreateTask(transaction, action.config);
      case 'SEND_NOTIFICATION':
        return await this.executeSendNotification(transaction, action.config);
      case 'UPDATE_FIELD':
        return await this.executeUpdateField(transaction, action.config);
      case 'CALL_API':
        return await this.executeCallApi(transaction, action.config);
      case 'ESCALATE':
        return await this.executeEscalate(transaction, action.config);
      default:
        return { action: action.type, success: false, error: 'Unknown action type' };
    }
  }

  private async executeTransition(
    transaction: MASARTransaction,
    config: Record<string, any>
  ): Promise<ActionResult> {
    // In production, this would use the state machine
    return { action: 'TRANSITION_STATE', success: true, details: config };
  }

  private async executeCreateTask(
    transaction: MASARTransaction,
    config: Record<string, any>
  ): Promise<ActionResult> {
    // In production, this would create a task in the task management system
    return { action: 'CREATE_TASK', success: true, details: config };
  }

  private async executeSendNotification(
    transaction: MASARTransaction,
    config: Record<string, any>
  ): Promise<ActionResult> {
    // In production, this would send notifications
    return { action: 'SEND_NOTIFICATION', success: true, details: config };
  }

  private async executeUpdateField(
    transaction: MASARTransaction,
    config: Record<string, any>
  ): Promise<ActionResult> {
    // In production, this would update transaction fields
    return { action: 'UPDATE_FIELD', success: true, details: config };
  }

  private async executeCallApi(
    transaction: MASARTransaction,
    config: Record<string, any>
  ): Promise<ActionResult> {
    // In production, this would call external APIs
    return { action: 'CALL_API', success: true, details: config };
  }

  private async executeEscalate(
    transaction: MASARTransaction,
    config: Record<string, any>
  ): Promise<ActionResult> {
    // In production, this would escalate to appropriate personnel
    return { action: 'ESCALATE', success: true, details: config };
  }

  private addAuditEvent(transactionId: string, eventType: string, details: string): void {
    const event: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId,
      eventType,
      category: 'SYSTEM',
      action: details,
      actor: 'SYSTEM',
      actorType: 'SYSTEM',
      target: transactionId,
      targetType: 'TRANSACTION',
      details: {},
      evidence: [],
      timestamp: new Date().toISOString(),
      hash: this.simpleHash(`${eventType}:${details}:${Date.now()}`),
      previousHash: null,
      ipAddress: null,
      userAgent: null
    };

    this.auditLog.push(event);
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
// ACTION RESULT TYPE
// ============================================================

export interface ActionResult {
  action: string;
  success: boolean;
  details?: Record<string, any>;
  error?: string;
}

// ============================================================
// WORKFLOW DISPLAY HELPERS
// ============================================================

export function getWorkflowActionDisplay(actionType: string): {
  label: string;
  color: string;
  icon: string;
} {
  const displays: Record<string, { label: string; color: string; icon: string }> = {
    'TRANSITION_STATE': { label: 'Transition State', color: '#3B82F6', icon: '→' },
    'CREATE_TASK': { label: 'Create Task', color: '#8B5CF6', icon: '+' },
    'SEND_NOTIFICATION': { label: 'Send Notification', color: '#10B981', icon: '✉' },
    'UPDATE_FIELD': { label: 'Update Field', color: '#F59E0B', icon: '✎' },
    'CALL_API': { label: 'Call API', color: '#6366F1', icon: '🔌' },
    'ESCALATE': { label: 'Escalate', color: '#EF4444', icon: '↑' }
  };

  return displays[actionType] || { label: actionType, color: '#6B7280', icon: '?' };
}

export function getRuleStatusDisplay(enabled: boolean): {
  label: string;
  color: string;
} {
  return enabled
    ? { label: 'Enabled', color: '#10B981' }
    : { label: 'Disabled', color: '#6B7280' };
}
