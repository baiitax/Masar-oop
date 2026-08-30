// MASAR Protocol - Case Management Engine
// Automated exception and case management

import {
  Case,
  CaseSLA,
  CaseComment,
  MASARTransaction,
  AuditEvent
} from './types';

// ============================================================
// CASE MANAGEMENT ENGINE
// ============================================================

export class CaseManagementEngine {
  private cases: Map<string, Case> = new Map();
  private auditLog: AuditEvent[] = [];

  /**
   * Create a new case
   */
  async createCase(
    transactionId: string,
    type: Case['type'],
    severity: Case['severity'],
    title: string,
    description: string,
    owner: string,
    slaHours: number
  ): Promise<{ success: boolean; case: Case }> {
    const now = new Date();
    const warningAt = new Date(now.getTime() + (slaHours * 0.7 * 60 * 60 * 1000));
    const criticalAt = new Date(now.getTime() + (slaHours * 0.85 * 60 * 60 * 1000));
    const breachedAt = new Date(now.getTime() + (slaHours * 60 * 60 * 1000));

    const caseRecord: Case = {
      id: `CASE-${now.getFullYear()}-${String(this.cases.size + 1).padStart(4, '0')}`,
      transactionId,
      type,
      severity,
      status: 'OPEN',
      title,
      description,
      owner,
      assignedTo: null,
      sla: {
        targetHours: slaHours,
        warningAt: warningAt.toISOString(),
        criticalAt: criticalAt.toISOString(),
        breachedAt: null,
        status: 'ON_TRACK'
      },
      resolution: null,
      evidence: [],
      comments: [{
        id: `comment-${Date.now()}`,
        author: 'SYSTEM',
        content: `Case created: ${description}`,
        timestamp: now.toISOString(),
        internal: false
      }],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      resolvedAt: null,
      closedAt: null
    };

    this.cases.set(caseRecord.id, caseRecord);

    this.addAuditEvent(
      transactionId,
      'CASE_CREATED',
      `Case created: ${caseRecord.id} - ${title}`
    );

    return { success: true, case: caseRecord };
  }

  /**
   * Assign case
   */
  async assignCase(
    caseId: string,
    assignedTo: string,
    assignedBy: string
  ): Promise<{ success: boolean }> {
    const caseRecord = this.cases.get(caseId);

    if (!caseRecord) {
      return { success: false };
    }

    caseRecord.assignedTo = assignedTo;
    caseRecord.status = 'IN_PROGRESS';
    caseRecord.updatedAt = new Date().toISOString();

    caseRecord.comments.push({
      id: `comment-${Date.now()}`,
      author: assignedBy,
      content: `Case assigned to ${assignedTo}`,
      timestamp: new Date().toISOString(),
      internal: true
    });

    this.addAuditEvent(
      caseRecord.transactionId,
      'CASE_ASSIGNED',
      `Case ${caseId} assigned to ${assignedTo}`
    );

    return { success: true };
  }

  /**
   * Add comment to case
   */
  async addComment(
    caseId: string,
    author: string,
    content: string,
    internal: boolean = false
  ): Promise<{ success: boolean }> {
    const caseRecord = this.cases.get(caseId);

    if (!caseRecord) {
      return { success: false };
    }

    caseRecord.comments.push({
      id: `comment-${Date.now()}`,
      author,
      content,
      timestamp: new Date().toISOString(),
      internal
    });

    caseRecord.updatedAt = new Date().toISOString();

    return { success: true };
  }

  /**
   * Add evidence to case
   */
  async addEvidence(
    caseId: string,
    evidenceId: string
  ): Promise<{ success: boolean }> {
    const caseRecord = this.cases.get(caseId);

    if (!caseRecord) {
      return { success: false };
    }

    caseRecord.evidence.push(evidenceId);
    caseRecord.updatedAt = new Date().toISOString();

    return { success: true };
  }

  /**
   * Resolve case
   */
  async resolveCase(
    caseId: string,
    resolution: string,
    resolvedBy: string
  ): Promise<{ success: boolean }> {
    const caseRecord = this.cases.get(caseId);

    if (!caseRecord) {
      return { success: false };
    }

    caseRecord.status = 'RESOLVED';
    caseRecord.resolution = resolution;
    caseRecord.resolvedAt = new Date().toISOString();
    caseRecord.updatedAt = new Date().toISOString();

    caseRecord.comments.push({
      id: `comment-${Date.now()}`,
      author: resolvedBy,
      content: `Case resolved: ${resolution}`,
      timestamp: new Date().toISOString(),
      internal: false
    });

    this.addAuditEvent(
      caseRecord.transactionId,
      'CASE_RESOLVED',
      `Case ${caseId} resolved: ${resolution}`
    );

    return { success: true };
  }

  /**
   * Close case
   */
  async closeCase(
    caseId: string,
    closedBy: string,
    notes: string
  ): Promise<{ success: boolean }> {
    const caseRecord = this.cases.get(caseId);

    if (!caseRecord) {
      return { success: false };
    }

    caseRecord.status = 'CLOSED';
    caseRecord.closedAt = new Date().toISOString();
    caseRecord.updatedAt = new Date().toISOString();

    caseRecord.comments.push({
      id: `comment-${Date.now()}`,
      author: closedBy,
      content: `Case closed: ${notes}`,
      timestamp: new Date().toISOString(),
      internal: false
    });

    this.addAuditEvent(
      caseRecord.transactionId,
      'CASE_CLOSED',
      `Case ${caseId} closed`
    );

    return { success: true };
  }

  /**
   * Escalate case
   */
  async escalateCase(
    caseId: string,
    escalatedTo: string,
    reason: string,
    escalatedBy: string
  ): Promise<{ success: boolean }> {
    const caseRecord = this.cases.get(caseId);

    if (!caseRecord) {
      return { success: false };
    }

    caseRecord.status = 'ESCALATED';
    caseRecord.assignedTo = escalatedTo;
    caseRecord.updatedAt = new Date().toISOString();

    caseRecord.comments.push({
      id: `comment-${Date.now()}`,
      author: escalatedBy,
      content: `Case escalated to ${escalatedTo}: ${reason}`,
      timestamp: new Date().toISOString(),
      internal: true
    });

    this.addAuditEvent(
      caseRecord.transactionId,
      'CASE_ESCALATED',
      `Case ${caseId} escalated to ${escalatedTo}`
    );

    return { success: true };
  }

  /**
   * Check SLA compliance for cases
   */
  async checkSLACompliance(): Promise<SLAComplianceResult> {
    const now = new Date();
    const violations: Case[] = [];
    const warnings: Case[] = [];

    for (const caseRecord of this.cases.values()) {
      if (caseRecord.status === 'CLOSED' || caseRecord.status === 'RESOLVED') {
        continue;
      }

      const createdAt = new Date(caseRecord.createdAt);
      const elapsedHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      const percentage = (elapsedHours / caseRecord.sla.targetHours) * 100;

      if (percentage >= 100) {
        caseRecord.sla.status = 'BREACHED';
        caseRecord.sla.breachedAt = now.toISOString();
        violations.push(caseRecord);
      } else if (percentage >= 85) {
        caseRecord.sla.status = 'CRITICAL';
        warnings.push(caseRecord);
      } else if (percentage >= 70) {
        caseRecord.sla.status = 'WARNING';
        warnings.push(caseRecord);
      }
    }

    return {
      totalOpen: Array.from(this.cases.values()).filter(
        c => c.status !== 'CLOSED' && c.status !== 'RESOLVED'
      ).length,
      violations,
      warnings,
      onTrack: Array.from(this.cases.values()).filter(
        c => c.status !== 'CLOSED' && c.status !== 'RESOLVED' && c.sla.status === 'ON_TRACK'
      ).length
    };
  }

  /**
   * Get case by ID
   */
  getCase(caseId: string): Case | null {
    return this.cases.get(caseId) || null;
  }

  /**
   * Get cases for transaction
   */
  getCasesForTransaction(transactionId: string): Case[] {
    return Array.from(this.cases.values()).filter(
      c => c.transactionId === transactionId
    );
  }

  /**
   * Get cases assigned to user
   */
  getCasesForUser(userId: string): Case[] {
    return Array.from(this.cases.values()).filter(
      c => c.assignedTo === userId || c.owner === userId
    );
  }

  /**
   * Get case statistics
   */
  getStatistics(): CaseStatistics {
    const cases = Array.from(this.cases.values());

    return {
      total: cases.length,
      open: cases.filter(c => c.status === 'OPEN').length,
      inProgress: cases.filter(c => c.status === 'IN_PROGRESS').length,
      escalated: cases.filter(c => c.status === 'ESCALATED').length,
      resolved: cases.filter(c => c.status === 'RESOLVED').length,
      closed: cases.filter(c => c.status === 'CLOSED').length,
      byType: this.groupByType(cases),
      bySeverity: this.groupBySeverity(cases),
      averageResolutionTime: this.calculateAverageResolutionTime(cases)
    };
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  private groupByType(cases: Case[]): Record<string, number> {
    const grouped: Record<string, number> = {};

    cases.forEach(c => {
      grouped[c.type] = (grouped[c.type] || 0) + 1;
    });

    return grouped;
  }

  private groupBySeverity(cases: Case[]): Record<string, number> {
    const grouped: Record<string, number> = {};

    cases.forEach(c => {
      grouped[c.severity] = (grouped[c.severity] || 0) + 1;
    });

    return grouped;
  }

  private calculateAverageResolutionTime(cases: Case[]): number {
    const resolved = cases.filter(c => c.resolvedAt);

    if (resolved.length === 0) return 0;

    const totalHours = resolved.reduce((sum, c) => {
      const created = new Date(c.createdAt);
      const resolvedAt = new Date(c.resolvedAt!);
      const hours = (resolvedAt.getTime() - created.getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    return Math.round(totalHours / resolved.length);
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
// CASE TYPES
// ============================================================

export interface SLAComplianceResult {
  totalOpen: number;
  violations: Case[];
  warnings: Case[];
  onTrack: number;
}

export interface CaseStatistics {
  total: number;
  open: number;
  inProgress: number;
  escalated: number;
  resolved: number;
  closed: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  averageResolutionTime: number;
}

// ============================================================
// CASE DISPLAY HELPERS
// ============================================================

export function getCaseStatusDisplay(status: string): {
  label: string;
  color: string;
  icon: string;
} {
  const displays: Record<string, { label: string; color: string; icon: string }> = {
    'OPEN': { label: 'Open', color: '#3B82F6', icon: '○' },
    'IN_PROGRESS': { label: 'In Progress', color: '#8B5CF6', icon: '◐' },
    'PENDING_REVIEW': { label: 'Pending Review', color: '#F59E0B', icon: '◑' },
    'RESOLVED': { label: 'Resolved', color: '#10B981', icon: '✓' },
    'CLOSED': { label: 'Closed', color: '#6B7280', icon: '●' },
    'ESCALATED': { label: 'Escalated', color: '#EF4444', icon: '↑' }
  };

  return displays[status] || { label: status, color: '#6B7280', icon: '?' };
}

export function getCaseTypeDisplay(type: string): {
  label: string;
  color: string;
  icon: string;
} {
  const displays: Record<string, { label: string; color: string; icon: string }> = {
    'COMPLIANCE': { label: 'Compliance', color: '#3B82F6', icon: '📋' },
    'INSPECTION': { label: 'Inspection', color: '#8B5CF6', icon: '🔍' },
    'FINANCE': { label: 'Finance', color: '#10B981', icon: '💰' },
    'DOCUMENT': { label: 'Document', color: '#F59E0B', icon: '📄' },
    'QUALITY': { label: 'Quality', color: '#F97316', icon: '✓' },
    'SETTLEMENT': { label: 'Settlement', color: '#6366F1', icon: '💱' },
    'DISPUTE': { label: 'Dispute', color: '#EF4444', icon: '⚖' }
  };

  return displays[type] || { label: type, color: '#6B7280', icon: '?' };
}

export function getCaseSeverityDisplay(severity: string): {
  label: string;
  color: string;
} {
  const displays: Record<string, { label: string; color: string }> = {
    'LOW': { label: 'Low', color: '#10B981' },
    'MEDIUM': { label: 'Medium', color: '#F59E0B' },
    'HIGH': { label: 'High', color: '#F97316' },
    'CRITICAL': { label: 'Critical', color: '#EF4444' }
  };

  return displays[severity] || { label: severity, color: '#6B7280' };
}

export function getCaseSLADisplay(status: string): {
  label: string;
  color: string;
} {
  const displays: Record<string, { label: string; color: string }> = {
    'ON_TRACK': { label: 'On Track', color: '#10B981' },
    'WARNING': { label: 'Warning', color: '#F59E0B' },
    'CRITICAL': { label: 'Critical', color: '#F97316' },
    'BREACHED': { label: 'Breached', color: '#EF4444' }
  };

  return displays[status] || { label: status, color: '#6B7280' };
}
