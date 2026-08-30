// MASAR Protocol - SLA Engine
// Service Level Agreement monitoring and escalation

import {
  SLARecord,
  SLAPolicy,
  SLAViolation,
  SLAMetric,
  MASARTransaction,
  AuditEvent,
  Case
} from './types';

// ============================================================
// SLA ENGINE
// ============================================================

export class SLAEngine {
  private policies: Map<string, SLAPolicy> = new Map();
  private auditLog: AuditEvent[] = [];

  constructor() {
    this.initializeDefaultPolicies();
  }

  /**
   * Initialize default SLA policies
   */
  private initializeDefaultPolicies(): void {
    const defaultPolicies: SLAPolicy[] = [
      {
        id: 'sla-kyb',
        name: 'KYB & Sanctions Screening',
        category: 'IDENTITY',
        targetHours: 72,
        warningThreshold: 70,
        criticalThreshold: 85,
        escalationPolicy: 'COMPLIANCE_HEAD'
      },
      {
        id: 'sla-compliance',
        name: 'Compliance Pack Assembly',
        category: 'COMPLIANCE',
        targetHours: 120, // 5 days
        warningThreshold: 70,
        criticalThreshold: 85,
        escalationPolicy: 'COMPLIANCE_HEAD'
      },
      {
        id: 'sla-inspection-booking',
        name: 'Inspection Booking',
        category: 'INSPECTION',
        targetHours: 48,
        warningThreshold: 70,
        criticalThreshold: 85,
        escalationPolicy: 'OPERATIONS_HEAD'
      },
      {
        id: 'sla-inspection-results',
        name: 'Inspection Results',
        category: 'INSPECTION',
        targetHours: 72,
        warningThreshold: 70,
        criticalThreshold: 85,
        escalationPolicy: 'OPERATIONS_HEAD'
      },
      {
        id: 'sla-escrow-funding',
        name: 'Escrow Funding/Release',
        category: 'FINANCE',
        targetHours: 4,
        warningThreshold: 50,
        criticalThreshold: 75,
        escalationPolicy: 'FINANCE_HEAD'
      },
      {
        id: 'sla-dispute-handling',
        name: 'Dispute Handling',
        category: 'SETTLEMENT',
        targetHours: 120, // 5 business days
        warningThreshold: 60,
        criticalThreshold: 80,
        escalationPolicy: 'OPERATIONS_HEAD'
      },
      {
        id: 'sla-exception-response',
        name: 'Exception Response',
        category: 'OPERATIONS',
        targetHours: 24,
        warningThreshold: 50,
        criticalThreshold: 75,
        escalationPolicy: 'OPERATIONS_HEAD'
      }
    ];

    defaultPolicies.forEach(policy => this.policies.set(policy.id, policy));
  }

  /**
   * Initialize SLA record for transaction
   */
  initializeSLA(transaction: MASARTransaction): SLARecord {
    const policies = Array.from(this.policies.values());
    const metrics: SLAMetric[] = policies.map(policy => ({
      category: policy.category,
      target: policy.targetHours,
      actual: 0,
      unit: 'hours',
      status: 'ON_TRACK'
    }));

    const slaRecord: SLARecord = {
      policies,
      violations: [],
      metrics
    };

    transaction.sla = slaRecord;
    return slaRecord;
  }

  /**
   * Check SLA compliance for transaction
   */
  async checkSLA(transaction: MASARTransaction): Promise<SLACheckResult> {
    const violations: SLAViolation[] = [];
    const warnings: SLAWarning[] = [];

    for (const policy of transaction.sla.policies) {
      const elapsed = this.calculateElapsedHours(transaction, policy);
      const percentage = (elapsed / policy.targetHours) * 100;

      // Update metrics
      const metric = transaction.sla.metrics.find(m => m.category === policy.category);
      if (metric) {
        metric.actual = elapsed;
        metric.status = this.determineMetricStatus(percentage, policy);
      }

      // Check for violations
      if (percentage >= 100) {
        const violation: SLAViolation = {
          id: `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          policyId: policy.id,
          transactionId: transaction.id,
          severity: 'BREACH',
          detectedAt: new Date().toISOString(),
          resolvedAt: null,
          escalatedTo: null,
          resolution: null
        };

        violations.push(violation);
        transaction.sla.violations.push(violation);

        this.addAuditEvent(
          transaction.id,
          'SLA_BREACH',
          `SLA breach: ${policy.name} - ${elapsed}h / ${policy.targetHours}h`
        );
      } else if (percentage >= policy.criticalThreshold) {
        warnings.push({
          policyId: policy.id,
          policyName: policy.name,
          severity: 'CRITICAL',
          percentage,
          elapsed,
          target: policy.targetHours,
          message: `Critical: ${policy.name} at ${Math.round(percentage)}%`
        });

        this.addAuditEvent(
          transaction.id,
          'SLA_CRITICAL',
          `SLA critical: ${policy.name} at ${Math.round(percentage)}%`
        );
      } else if (percentage >= policy.warningThreshold) {
        warnings.push({
          policyId: policy.id,
          policyName: policy.name,
          severity: 'WARNING',
          percentage,
          elapsed,
          target: policy.targetHours,
          message: `Warning: ${policy.name} at ${Math.round(percentage)}%`
        });
      }
    }

    return {
      violations,
      warnings,
      overallStatus: this.determineOverallStatus(violations, warnings)
    };
  }

  /**
   * Escalate SLA violation
   */
  async escalateViolation(
    transaction: MASARTransaction,
    violationId: string,
    escalatedTo: string
  ): Promise<{ success: boolean }> {
    const violation = transaction.sla.violations.find(v => v.id === violationId);

    if (!violation) {
      return { success: false };
    }

    violation.escalatedTo = escalatedTo;

    this.addAuditEvent(
      transaction.id,
      'SLA_ESCALATED',
      `SLA violation escalated to ${escalatedTo}`
    );

    return { success: true };
  }

  /**
   * Resolve SLA violation
   */
  async resolveViolation(
    transaction: MASARTransaction,
    violationId: string,
    resolution: string
  ): Promise<{ success: boolean }> {
    const violation = transaction.sla.violations.find(v => v.id === violationId);

    if (!violation) {
      return { success: false };
    }

    violation.resolvedAt = new Date().toISOString();
    violation.resolution = resolution;

    this.addAuditEvent(
      transaction.id,
      'SLA_RESOLVED',
      `SLA violation resolved: ${resolution}`
    );

    return { success: true };
  }

  /**
   * Get SLA summary for transaction
   */
  getSummary(transaction: MASARTransaction): SLASummary {
    const metrics = transaction.sla.metrics;
    const violations = transaction.sla.violations;

    return {
      transactionId: transaction.id,
      totalPolicies: transaction.sla.policies.length,
      onTrack: metrics.filter(m => m.status === 'ON_TRACK').length,
      atRisk: metrics.filter(m => m.status === 'AT_RISK').length,
      breached: metrics.filter(m => m.status === 'BREACHED').length,
      openViolations: violations.filter(v => !v.resolvedAt).length,
      resolvedViolations: violations.filter(v => v.resolvedAt).length,
      metrics: metrics.map(m => ({
        category: m.category,
        target: m.target,
        actual: m.actual,
        status: m.status,
        percentage: Math.round((m.actual / m.target) * 100)
      }))
    };
  }

  /**
   * Get SLA metrics for dashboard
   */
  getDashboardMetrics(transactions: MASARTransaction[]): SLADashboardMetrics {
    const allMetrics: SLAMetric[] = [];
    const allViolations: SLAViolation[] = [];

    transactions.forEach(tx => {
      allMetrics.push(...tx.sla.metrics);
      allViolations.push(...tx.sla.violations);
    });

    const categoryMetrics = this.aggregateMetricsByCategory(allMetrics);

    return {
      totalTransactions: transactions.length,
      overallCompliance: this.calculateOverallCompliance(allMetrics),
      categoryMetrics,
      openViolations: allViolations.filter(v => !v.resolvedAt).length,
      criticalViolations: allViolations.filter(v => v.severity === 'BREACH' && !v.resolvedAt).length,
      averageResolutionTime: this.calculateAverageResolutionTime(allViolations)
    };
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  private calculateElapsedHours(transaction: MASARTransaction, policy: SLAPolicy): number {
    // In production, this would calculate based on actual timestamps
    // For now, return a simulated value
    const createdAt = new Date(transaction.createdAt);
    const now = new Date();
    const elapsedMs = now.getTime() - createdAt.getTime();
    return Math.floor(elapsedMs / (1000 * 60 * 60));
  }

  private determineMetricStatus(percentage: number, policy: SLAPolicy): 'ON_TRACK' | 'AT_RISK' | 'BREACHED' {
    if (percentage >= 100) return 'BREACHED';
    if (percentage >= policy.criticalThreshold) return 'AT_RISK';
    return 'ON_TRACK';
  }

  private determineOverallStatus(
    violations: SLAViolation[],
    warnings: SLAWarning[]
  ): 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'BREACH' {
    if (violations.length > 0) return 'BREACH';
    if (warnings.some(w => w.severity === 'CRITICAL')) return 'CRITICAL';
    if (warnings.length > 0) return 'WARNING';
    return 'HEALTHY';
  }

  private aggregateMetricsByCategory(metrics: SLAMetric[]): CategoryMetric[] {
    const categories = new Map<string, { total: number; count: number }>();

    metrics.forEach(m => {
      const existing = categories.get(m.category) || { total: 0, count: 0 };
      existing.total += (m.actual / m.target) * 100;
      existing.count += 1;
      categories.set(m.category, existing);
    });

    return Array.from(categories.entries()).map(([category, data]) => ({
      category,
      averagePercentage: Math.round(data.total / data.count),
      transactionCount: data.count
    }));
  }

  private calculateOverallCompliance(metrics: SLAMetric[]): number {
    if (metrics.length === 0) return 100;

    const compliant = metrics.filter(m => m.status === 'ON_TRACK').length;
    return Math.round((compliant / metrics.length) * 100);
  }

  private calculateAverageResolutionTime(violations: SLAViolation[]): number {
    const resolved = violations.filter(v => v.resolvedAt);

    if (resolved.length === 0) return 0;

    const totalHours = resolved.reduce((sum, v) => {
      const detected = new Date(v.detectedAt);
      const resolvedAt = new Date(v.resolvedAt!);
      const hours = (resolvedAt.getTime() - detected.getTime()) / (1000 * 60 * 60);
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
// SLA TYPES
// ============================================================

export interface SLACheckResult {
  violations: SLAViolation[];
  warnings: SLAWarning[];
  overallStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'BREACH';
}

export interface SLAWarning {
  policyId: string;
  policyName: string;
  severity: 'WARNING' | 'CRITICAL';
  percentage: number;
  elapsed: number;
  target: number;
  message: string;
}

export interface SLASummary {
  transactionId: string;
  totalPolicies: number;
  onTrack: number;
  atRisk: number;
  breached: number;
  openViolations: number;
  resolvedViolations: number;
  metrics: {
    category: string;
    target: number;
    actual: number;
    status: string;
    percentage: number;
  }[];
}

export interface SLADashboardMetrics {
  totalTransactions: number;
  overallCompliance: number;
  categoryMetrics: CategoryMetric[];
  openViolations: number;
  criticalViolations: number;
  averageResolutionTime: number;
}

export interface CategoryMetric {
  category: string;
  averagePercentage: number;
  transactionCount: number;
}

// ============================================================
// SLA DISPLAY HELPERS
// ============================================================

export function getSLAStatusDisplay(status: string): {
  label: string;
  color: string;
  icon: string;
} {
  const displays: Record<string, { label: string; color: string; icon: string }> = {
    'ON_TRACK': { label: 'On Track', color: '#10B981', icon: '✓' },
    'AT_RISK': { label: 'At Risk', color: '#F59E0B', icon: '⚠' },
    'BREACHED': { label: 'Breached', color: '#EF4444', icon: '✕' }
  };

  return displays[status] || { label: status, color: '#6B7280', icon: '?' };
}

export function getSLAOverallStatusDisplay(status: string): {
  label: string;
  color: string;
  description: string;
} {
  const displays: Record<string, { label: string; color: string; description: string }> = {
    'HEALTHY': { label: 'Healthy', color: '#10B981', description: 'All SLAs within target' },
    'WARNING': { label: 'Warning', color: '#F59E0B', description: 'Some SLAs approaching limits' },
    'CRITICAL': { label: 'Critical', color: '#F97316', description: 'SLAs at critical levels' },
    'BREACH': { label: 'Breach', color: '#EF4444', description: 'SLA violations detected' }
  };

  return displays[status] || { label: status, color: '#6B7280', description: '' };
}

export function formatSLATime(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${Math.round(remainingHours)}h` : `${days}d`;
}
