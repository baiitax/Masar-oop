// MASAR Protocol - Inspection Integration Engine
// Orchestration layer for inspection partners and laboratories

import {
  InspectionRecord,
  InspectionStatus,
  InspectionProvider,
  Inspector,
  Sample,
  LabResult,
  QualityScore,
  QualityFactor,
  InspectionReport,
  InspectionException,
  InspectionStatusTransition,
  CustodyEvent,
  MASARTransaction,
  AuditEvent,
  QualitySpecification,
  QualityAttribute
} from './types';

// ============================================================
// INSPECTION ENGINE
// ============================================================

export class InspectionEngine {
  private transaction: MASARTransaction;
  private providers: Map<string, InspectionProvider> = new Map();
  private auditLog: AuditEvent[] = [];

  constructor(transaction: MASARTransaction) {
    this.transaction = transaction;
    this.initializeProviders();
  }

  /**
   * Initialize inspection providers
   */
  private initializeProviders(): void {
    // In production, these would be loaded from configuration
    const providers: InspectionProvider[] = [
      {
        id: 'provider-sgs',
        name: 'SGS Nigeria',
        type: 'BOTH',
        accreditation: ['ISO 17020', 'ISO 17025'],
        contact: {
          name: 'SGS Nigeria',
          email: 'inspections@sgs.com',
          phone: '+234 1 234 5678',
          address: null
        },
        adapter: 'sgs-adapter'
      },
      {
        id: 'provider-bureau-veritas',
        name: 'Bureau Veritas Nigeria',
        type: 'BOTH',
        accreditation: ['ISO 17020', 'ISO 17025'],
        contact: {
          name: 'Bureau Veritas',
          email: 'inspections@bureauveritas.com',
          phone: '+234 1 234 5679',
          address: null
        },
        adapter: 'bv-adapter'
      }
    ];

    providers.forEach(p => this.providers.set(p.id, p));
  }

  /**
   * Create inspection request
   */
  async createInspectionRequest(
    providerId: string,
    scheduledDate: string,
    notes: string
  ): Promise<{ success: boolean; inspection: InspectionRecord | null }> {
    const provider = this.providers.get(providerId);

    if (!provider) {
      return { success: false, inspection: null };
    }

    const inspection: InspectionRecord = {
      id: `insp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: this.transaction.id,
      provider,
      status: 'REQUESTED',
      inspector: null,
      samples: [],
      labResults: [],
      qualityScore: null,
      inspectionReport: null,
      exceptions: [],
      requestedAt: new Date().toISOString(),
      scheduledAt: scheduledDate,
      completedAt: null,
      statusHistory: [{
        from: 'REQUESTED',
        to: 'REQUESTED',
        timestamp: new Date().toISOString(),
        triggeredBy: 'SYSTEM',
        reason: 'Inspection request created'
      }]
    };

    this.transaction.inspection = inspection;
    this.addAuditEvent('INSPECTION_REQUESTED', `Inspection requested from ${provider.name}`);

    return { success: true, inspection };
  }

  /**
   * Accept inspection request
   */
  async acceptInspection(
    inspectorId: string,
    inspectorName: string,
    certifications: string[]
  ): Promise<{ success: boolean }> {
    if (!this.transaction.inspection) {
      return { success: false };
    }

    const inspector: Inspector = {
      id: inspectorId,
      name: inspectorName,
      certification: certifications,
      specialization: [],
      assignedAt: new Date().toISOString()
    };

    this.transaction.inspection.inspector = inspector;
    this.updateStatus('ACCEPTED', 'SYSTEM', 'Inspection accepted by provider');

    this.addAuditEvent('INSPECTION_ACCEPTED', `Inspection accepted, inspector: ${inspectorName}`);

    return { success: true };
  }

  /**
   * Schedule inspection
   */
  async scheduleInspection(
    scheduledDate: string,
    location: string
  ): Promise<{ success: boolean }> {
    if (!this.transaction.inspection) {
      return { success: false };
    }

    this.transaction.inspection.scheduledAt = scheduledDate;
    this.updateStatus('SCHEDULED', 'SYSTEM', `Inspection scheduled for ${scheduledDate}`);

    this.addAuditEvent('INSPECTION_SCHEDULED', `Inspection scheduled: ${scheduledDate} at ${location}`);

    return { success: true };
  }

  /**
   * Assign inspector
   */
  async assignInspector(inspectorId: string, inspectorName: string): Promise<{ success: boolean }> {
    if (!this.transaction.inspection) {
      return { success: false };
    }

    const inspector: Inspector = {
      id: inspectorId,
      name: inspectorName,
      certification: [],
      specialization: [],
      assignedAt: new Date().toISOString()
    };

    this.transaction.inspection.inspector = inspector;
    this.updateStatus('INSPECTOR_ASSIGNED', 'SYSTEM', `Inspector assigned: ${inspectorName}`);

    this.addAuditEvent('INSPECTOR_ASSIGNED', `Inspector assigned: ${inspectorName}`);

    return { success: true };
  }

  /**
   * Create sample
   */
  async createSample(
    lotId: string,
    location: string,
    collector: string,
    sealNumber: string,
    laboratory: string
  ): Promise<{ success: boolean; sample: Sample | null }> {
    if (!this.transaction.inspection) {
      return { success: false, sample: null };
    }

    const sample: Sample = {
      id: `sample-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lotId,
      location,
      collector,
      collectedAt: new Date().toISOString(),
      sealNumber,
      laboratory,
      receivedAt: null,
      tests: [],
      status: 'COLLECTED',
      chainOfCustody: [{
        timestamp: new Date().toISOString(),
        location,
        handler: collector,
        action: 'SAMPLE_COLLECTED',
        notes: `Sample collected, seal: ${sealNumber}`
      }]
    };

    this.transaction.inspection.samples.push(sample);
    this.updateStatus('SAMPLE_COLLECTED', 'SYSTEM', `Sample collected: ${sample.id}`);

    this.addAuditEvent('SAMPLE_COLLECTED', `Sample collected: ${sample.id}, seal: ${sealNumber}`);

    return { success: true, sample };
  }

  /**
   * Update sample custody
   */
  async updateSampleCustody(
    sampleId: string,
    location: string,
    handler: string,
    action: string,
    notes: string
  ): Promise<{ success: boolean }> {
    if (!this.transaction.inspection) {
      return { success: false };
    }

    const sample = this.transaction.inspection.samples.find(s => s.id === sampleId);

    if (!sample) {
      return { success: false };
    }

    const custodyEvent: CustodyEvent = {
      timestamp: new Date().toISOString(),
      location,
      handler,
      action,
      notes
    };

    sample.chainOfCustody.push(custodyEvent);

    // Update sample status based on action
    if (action === 'RECEIVED_BY_LAB') {
      sample.status = 'RECEIVED';
      sample.receivedAt = new Date().toISOString();
    } else if (action === 'TESTING_STARTED') {
      sample.status = 'TESTING';
    } else if (action === 'TESTING_COMPLETED') {
      sample.status = 'COMPLETED';
    }

    this.addAuditEvent('SAMPLE_CUSTODY_UPDATED', `Sample ${sampleId}: ${action}`);

    return { success: true };
  }

  /**
   * Receive lab results
   */
  async receiveLabResults(
    sampleId: string,
    results: LabResultInput[]
  ): Promise<{ success: boolean; labResults: LabResult[] }> {
    if (!this.transaction.inspection) {
      return { success: false, labResults: [] };
    }

    const sample = this.transaction.inspection.samples.find(s => s.id === sampleId);

    if (!sample) {
      return { success: false, labResults: [] };
    }

    const labResults: LabResult[] = results.map(r => ({
      id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sampleId,
      testType: r.testType,
      parameter: r.parameter,
      value: r.value,
      unit: r.unit,
      method: r.method,
      specification: r.specification,
      result: this.evaluateResult(r.value, r.specification),
      certifiedBy: r.certifiedBy,
      certifiedAt: new Date().toISOString()
    }));

    this.transaction.inspection.labResults.push(...labResults);
    this.updateStatus('LAB_PROCESSING', 'SYSTEM', `Lab results received for sample ${sampleId}`);

    this.addAuditEvent('LAB_RESULT_RECEIVED', `Lab results received: ${labResults.length} results`);

    return { success: true, labResults };
  }

  /**
   * Calculate quality score
   */
  async calculateQualityScore(): Promise<QualityScore> {
    if (!this.transaction.inspection) {
      throw new Error('No inspection record');
    }

    const specification = this.transaction.commodity.specification;
    const labResults = this.transaction.inspection.labResults;

    const factors: QualityFactor[] = [];

    for (const attr of specification.attributes) {
      const result = labResults.find(r => r.parameter === attr.name);

      if (result) {
        const score = this.calculateAttributeScore(attr, result.value);
        factors.push({
          parameter: attr.name,
          weight: attr.critical ? 20 : 10,
          score,
          maxScore: attr.critical ? 20 : 10,
          status: score >= (attr.critical ? 16 : 7) ? 'PASS' : 'FAIL',
          contractValue: this.formatSpecification(attr),
          actualValue: `${result.value} ${result.unit}`
        });
      }
    }

    const overall = factors.reduce((sum, f) => sum + f.score, 0);
    const maxPossible = factors.reduce((sum, f) => sum + f.maxScore, 0);
    const percentage = Math.round((overall / maxPossible) * 100);

    const grade = this.calculateGrade(percentage);
    const status = this.calculateStatus(percentage);

    const qualityScore: QualityScore = {
      overall: percentage,
      breakdown: factors,
      grade,
      status
    };

    this.transaction.inspection.qualityScore = qualityScore;
    this.addAuditEvent('QUALITY_SCORE_CALCULATED', `Quality score: ${percentage}%, Grade: ${grade}`);

    return qualityScore;
  }

  /**
   * Complete inspection
   */
  async completeInspection(
    conclusion: 'PASSED' | 'CONDITIONAL' | 'FAILED',
    summary: string,
    findings: string[],
    recommendations: string[]
  ): Promise<{ success: boolean; report: InspectionReport | null }> {
    if (!this.transaction.inspection) {
      return { success: false, report: null };
    }

    const report: InspectionReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      summary,
      findings,
      recommendations,
      conclusion,
      generatedAt: new Date().toISOString(),
      signedBy: this.transaction.inspection.inspector?.name || 'SYSTEM'
    };

    this.transaction.inspection.inspectionReport = report;
    this.transaction.inspection.completedAt = new Date().toISOString();

    this.updateStatus(conclusion, 'SYSTEM', `Inspection ${conclusion.toLowerCase()}`);

    this.addAuditEvent('INSPECTION_COMPLETED', `Inspection ${conclusion.toLowerCase()}: ${summary}`);

    return { success: true, report };
  }

  /**
   * Create inspection exception
   */
  async createException(
    type: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    description: string
  ): Promise<{ success: boolean; exception: InspectionException | null }> {
    if (!this.transaction.inspection) {
      return { success: false, exception: null };
    }

    const exception: InspectionException = {
      id: `insp-exc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      description,
      status: 'OPEN',
      resolution: null
    };

    this.transaction.inspection.exceptions.push(exception);
    this.addAuditEvent('INSPECTION_EXCEPTION_CREATED', `Exception: ${type} - ${description}`);

    return { success: true, exception };
  }

  /**
   * Get inspection summary
   */
  getSummary(): InspectionSummary {
    const inspection = this.transaction.inspection;

    if (!inspection) {
      return {
        transactionId: this.transaction.id,
        status: 'NOT_STARTED',
        provider: null,
        inspector: null,
        sampleCount: 0,
        labResultCount: 0,
        qualityScore: null,
        conclusion: null,
        exceptionCount: 0,
        openExceptionCount: 0
      };
    }

    return {
      transactionId: this.transaction.id,
      status: inspection.status,
      provider: inspection.provider.name,
      inspector: inspection.inspector?.name || null,
      sampleCount: inspection.samples.length,
      labResultCount: inspection.labResults.length,
      qualityScore: inspection.qualityScore,
      conclusion: inspection.inspectionReport?.conclusion || null,
      exceptionCount: inspection.exceptions.length,
      openExceptionCount: inspection.exceptions.filter(e => e.status === 'OPEN').length
    };
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  private updateStatus(
    newStatus: InspectionStatus,
    triggeredBy: string,
    reason: string
  ): void {
    if (!this.transaction.inspection) return;

    const oldStatus = this.transaction.inspection.status;
    this.transaction.inspection.status = newStatus;

    this.transaction.inspection.statusHistory.push({
      from: oldStatus,
      to: newStatus,
      timestamp: new Date().toISOString(),
      triggeredBy,
      reason
    });
  }

  private evaluateResult(
    value: number,
    specification: { minValue: number | null; maxValue: number | null; tolerance: number }
  ): 'PASS' | 'FAIL' | 'WITHIN_TOLERANCE' | 'OUTSIDE_TOLERANCE' {
    if (specification.minValue !== null && value < specification.minValue) {
      const deviation = ((specification.minValue - value) / specification.minValue) * 100;
      return deviation <= specification.tolerance ? 'WITHIN_TOLERANCE' : 'OUTSIDE_TOLERANCE';
    }

    if (specification.maxValue !== null && value > specification.maxValue) {
      const deviation = ((value - specification.maxValue) / specification.maxValue) * 100;
      return deviation <= specification.tolerance ? 'WITHIN_TOLERANCE' : 'OUTSIDE_TOLERANCE';
    }

    return 'PASS';
  }

  private calculateAttributeScore(attr: QualityAttribute, actualValue: number): number {
    const maxScore = attr.critical ? 20 : 10;

    if (attr.minValue !== null && actualValue < attr.minValue) {
      return 0;
    }

    if (attr.maxValue !== null && actualValue > attr.maxValue) {
      return 0;
    }

    // Calculate score based on how close to target
    if (attr.targetValue !== null) {
      const deviation = Math.abs(actualValue - attr.targetValue) / attr.targetValue;
      if (deviation <= 0.01) return maxScore; // Within 1%
      if (deviation <= 0.05) return Math.round(maxScore * 0.9); // Within 5%
      if (deviation <= 0.1) return Math.round(maxScore * 0.7); // Within 10%
      return Math.round(maxScore * 0.5);
    }

    return maxScore;
  }

  private formatSpecification(attr: QualityAttribute): string {
    if (attr.minValue !== null && attr.maxValue !== null) {
      return `${attr.minValue}-${attr.maxValue} ${attr.unit}`;
    }
    if (attr.maxValue !== null) {
      return `≤${attr.maxValue} ${attr.unit}`;
    }
    if (attr.minValue !== null) {
      return `≥${attr.minValue} ${attr.unit}`;
    }
    return `${attr.targetValue} ${attr.unit}`;
  }

  private calculateGrade(percentage: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  private calculateStatus(percentage: number): 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'REJECTED' {
    if (percentage >= 90) return 'EXCELLENT';
    if (percentage >= 80) return 'GOOD';
    if (percentage >= 70) return 'ACCEPTABLE';
    if (percentage >= 60) return 'POOR';
    return 'REJECTED';
  }

  private addAuditEvent(eventType: string, details: string): void {
    const event: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: this.transaction.id,
      eventType,
      category: 'INSPECTION',
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
// INSPECTION SUMMARY TYPE
// ============================================================

export interface InspectionSummary {
  transactionId: string;
  status: string;
  provider: string | null;
  inspector: string | null;
  sampleCount: number;
  labResultCount: number;
  qualityScore: QualityScore | null;
  conclusion: string | null;
  exceptionCount: number;
  openExceptionCount: number;
}

// ============================================================
// LAB RESULT INPUT TYPE
// ============================================================

export interface LabResultInput {
  testType: string;
  parameter: string;
  value: number;
  unit: string;
  method: string;
  specification: {
    minValue: number | null;
    maxValue: number | null;
    tolerance: number;
  };
  certifiedBy: string;
}

// ============================================================
// INSPECTION DISPLAY HELPERS
// ============================================================

export function getInspectionStatusDisplay(status: InspectionStatus): {
  label: string;
  color: string;
  icon: string;
} {
  const displays: Record<InspectionStatus, { label: string; color: string; icon: string }> = {
    'REQUESTED': { label: 'Requested', color: '#6B7280', icon: '○' },
    'ACCEPTED': { label: 'Accepted', color: '#3B82F6', icon: '✓' },
    'SCHEDULED': { label: 'Scheduled', color: '#8B5CF6', icon: '📅' },
    'INSPECTOR_ASSIGNED': { label: 'Inspector Assigned', color: '#8B5CF6', icon: '👤' },
    'SAMPLE_PENDING': { label: 'Sample Pending', color: '#F59E0B', icon: '⏳' },
    'SAMPLE_COLLECTED': { label: 'Sample Collected', color: '#3B82F6', icon: '✓' },
    'LAB_PROCESSING': { label: 'Lab Processing', color: '#8B5CF6', icon: '🔬' },
    'RESULT_RECEIVED': { label: 'Result Received', color: '#3B82F6', icon: '✓' },
    'INSPECTION_REVIEW': { label: 'Under Review', color: '#F59E0B', icon: '🔍' },
    'PASSED': { label: 'Passed', color: '#10B981', icon: '✓' },
    'CONDITIONAL': { label: 'Conditional', color: '#F59E0B', icon: '⚠' },
    'FAILED': { label: 'Failed', color: '#EF4444', icon: '✕' }
  };

  return displays[status] || { label: status, color: '#6B7280', icon: '?' };
}

export function getQualityGradeDisplay(grade: string): {
  label: string;
  color: string;
  description: string;
} {
  const displays: Record<string, { label: string; color: string; description: string }> = {
    'A': { label: 'Grade A', color: '#10B981', description: 'Excellent quality' },
    'B': { label: 'Grade B', color: '#3B82F6', description: 'Good quality' },
    'C': { label: 'Grade C', color: '#F59E0B', description: 'Acceptable quality' },
    'D': { label: 'Grade D', color: '#F97316', description: 'Poor quality' },
    'F': { label: 'Grade F', color: '#EF4444', description: 'Rejected' }
  };

  return displays[grade] || { label: grade, color: '#6B7280', description: '' };
}

export function getLabResultDisplay(result: string): {
  label: string;
  color: string;
  icon: string;
} {
  const displays: Record<string, { label: string; color: string; icon: string }> = {
    'PASS': { label: 'Pass', color: '#10B981', icon: '✓' },
    'FAIL': { label: 'Fail', color: '#EF4444', icon: '✕' },
    'WITHIN_TOLERANCE': { label: 'Within Tolerance', color: '#F59E0B', icon: '~' },
    'OUTSIDE_TOLERANCE': { label: 'Outside Tolerance', color: '#EF4444', icon: '✕' }
  };

  return displays[result] || { label: result, color: '#6B7280', icon: '?' };
}
