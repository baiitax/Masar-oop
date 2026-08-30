// MASAR Protocol - Compliance Engine
// Lane-aware rules engine for compliance automation

import {
  CompliancePack,
  ComplianceDocument,
  ComplianceRequirement,
  ClearanceReadiness,
  ClearanceFactor,
  ComplianceException,
  LaneTemplate,
  LaneDocumentRequirement,
  DocumentType,
  DocumentStatus,
  ExpiryWarning,
  MASARTransaction,
  AuditEvent
} from './types';

// ============================================================
// COMPLIANCE ENGINE
// ============================================================

export class ComplianceEngine {
  private transaction: MASARTransaction;
  private laneTemplate: LaneTemplate | null = null;
  private auditLog: AuditEvent[] = [];

  constructor(transaction: MASARTransaction) {
    this.transaction = transaction;
  }

  /**
   * Load lane template based on transaction details
   */
  async loadLaneTemplate(): Promise<{ success: boolean; template: LaneTemplate | null }> {
    const { origin, destination } = this.transaction.commodity;
    const commodity = this.transaction.commodity.type;
    const incoterm = this.transaction.contract.incoterm;

    // Find matching template
    const template = await this.findLaneTemplate(origin, destination, commodity, incoterm);

    if (template) {
      this.laneTemplate = template;
      this.addAuditEvent('LANE_TEMPLATE_LOADED', `Loaded template: ${template.name}`);
      return { success: true, template };
    }

    this.addAuditEvent('LANE_TEMPLATE_NOT_FOUND', `No template found for ${origin} → ${destination} / ${commodity}`);
    return { success: false, template: null };
  }

  /**
   * Generate compliance pack from lane template
   */
  async generateCompliancePack(): Promise<CompliancePack> {
    if (!this.laneTemplate) {
      throw new Error('Lane template not loaded');
    }

    const documents: ComplianceDocument[] = [];
    const requirements: ComplianceRequirement[] = [];

    // Create documents from template
    for (const docReq of this.laneTemplate.documentRequirements) {
      const document: ComplianceDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: docReq.documentType,
        name: this.getDocumentName(docReq.documentType),
        status: 'EXPECTED',
        version: 1,
        versions: [],
        required: docReq.mandatory,
        expiryDate: null,
        expiryWarning: null,
        uploadedBy: null,
        uploadedAt: null,
        verifiedBy: null,
        verifiedAt: null,
        metadata: {
          extractedDates: [],
          extractedEntities: [],
          extractedReferences: [],
          missingFields: [],
          validationErrors: []
        },
        transactionId: this.transaction.id
      };

      documents.push(document);
    }

    // Create requirements from template
    for (const req of this.laneTemplate.requirements) {
      const requirement: ComplianceRequirement = {
        id: req.id,
        type: req.category,
        description: req.description,
        mandatory: req.mandatory,
        status: 'PENDING',
        documentId: null,
        rule: req.rule
      };

      requirements.push(requirement);
    }

    const compliancePack: CompliancePack = {
      id: `cp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: this.transaction.id,
      laneTemplate: this.laneTemplate.id,
      status: 'IN_PROGRESS',
      documents,
      requirements,
      clearanceReadiness: this.initializeClearanceReadiness(),
      exceptions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.transaction.compliancePack = compliancePack;
    this.addAuditEvent('COMPLIANCE_PACK_GENERATED', `Generated ${documents.length} documents, ${requirements.length} requirements`);

    return compliancePack;
  }

  /**
   * Process uploaded document
   */
  async processDocument(
    documentId: string,
    uploadedBy: string,
    fileUrl: string,
    metadata: Record<string, any>
  ): Promise<{ success: boolean; document: ComplianceDocument | null }> {
    const document = this.transaction.compliancePack.documents.find(d => d.id === documentId);

    if (!document) {
      return { success: false, document: null };
    }

    // Update document status
    document.status = 'UPLOADED';
    document.uploadedBy = uploadedBy;
    document.uploadedAt = new Date().toISOString();

    // Add version
    document.versions.push({
      version: document.version,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      reason: 'Initial upload',
      status: 'UPLOADED',
      hash: this.simpleHash(fileUrl),
      fileUrl
    });

    // Extract metadata
    document.metadata = await this.extractDocumentMetadata(metadata);

    // Validate document
    const validation = await this.validateDocument(document);

    if (validation.valid) {
      document.status = 'VERIFICATION_REQUIRED';
      this.addAuditEvent('DOCUMENT_UPLOADED', `Document ${document.type} uploaded and ready for verification`);
    } else {
      document.status = 'REJECTED';
      document.metadata.validationErrors = validation.errors;
      this.addAuditEvent('DOCUMENT_VALIDATION_FAILED', `Document ${document.type} validation failed: ${validation.errors.join(', ')}`);
    }

    // Update compliance pack
    this.transaction.compliancePack.updatedAt = new Date().toISOString();
    await this.updateClearanceReadiness();

    return { success: true, document };
  }

  /**
   * Verify document
   */
  async verifyDocument(
    documentId: string,
    verifiedBy: string,
    approved: boolean,
    notes: string
  ): Promise<{ success: boolean; document: ComplianceDocument | null }> {
    const document = this.transaction.compliancePack.documents.find(d => d.id === documentId);

    if (!document) {
      return { success: false, document: null };
    }

    if (approved) {
      document.status = 'VERIFIED';
      document.verifiedBy = verifiedBy;
      document.verifiedAt = new Date().toISOString();

      // Update version
      const currentVersion = document.versions[document.versions.length - 1];
      if (currentVersion) {
        currentVersion.reviewedBy = verifiedBy;
        currentVersion.reviewedAt = new Date().toISOString();
        currentVersion.status = 'VERIFIED';
      }

      this.addAuditEvent('DOCUMENT_VERIFIED', `Document ${document.type} verified by ${verifiedBy}`);
    } else {
      document.status = 'REJECTED';

      // Update version
      const currentVersion = document.versions[document.versions.length - 1];
      if (currentVersion) {
        currentVersion.reviewedBy = verifiedBy;
        currentVersion.reviewedAt = new Date().toISOString();
        currentVersion.status = 'REJECTED';
      }

      this.addAuditEvent('DOCUMENT_REJECTED', `Document ${document.type} rejected by ${verifiedBy}: ${notes}`);

      // Create exception
      await this.createDocumentException(document, notes);
    }

    // Update compliance pack
    this.transaction.compliancePack.updatedAt = new Date().toISOString();
    await this.updateClearanceReadiness();
    await this.checkComplianceReady();

    return { success: true, document };
  }

  /**
   * Check document expiry
   */
  async checkDocumentExpiry(): Promise<ExpiryWarning[]> {
    const warnings: ExpiryWarning[] = [];
    const now = new Date();

    for (const document of this.transaction.compliancePack.documents) {
      if (document.expiryDate) {
        const expiryDate = new Date(document.expiryDate);
        const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        let level: ExpiryWarning['level'];
        let message: string;

        if (daysRemaining <= 0) {
          level = 'CRITICAL';
          message = `Document expired ${Math.abs(daysRemaining)} days ago`;
          document.status = 'EXPIRED';
        } else if (daysRemaining <= 7) {
          level = 'HIGH_PRIORITY';
          message = `Document expires in ${daysRemaining} days`;
          document.status = 'EXPIRING';
        } else if (daysRemaining <= 14) {
          level = 'WARNING';
          message = `Document expires in ${daysRemaining} days`;
        } else if (daysRemaining <= 30) {
          level = 'INFO';
          message = `Document expires in ${daysRemaining} days`;
        } else {
          continue;
        }

        const warning: ExpiryWarning = {
          level,
          daysRemaining,
          message
        };

        document.expiryWarning = warning;
        warnings.push(warning);

        // Check if this is a release-critical document
        if (this.isReleaseCriticalDocument(document.type) && daysRemaining <= 0) {
          this.addAuditEvent('RELEASE_CRITICAL_DOCUMENT_EXPIRED', `Release-critical document ${document.type} has expired`);
        }
      }
    }

    return warnings;
  }

  /**
   * Calculate clearance readiness score
   */
  async calculateClearanceReadiness(): Promise<ClearanceReadiness> {
    const factors: ClearanceFactor[] = [
      {
        category: 'KYB',
        weight: 20,
        score: this.calculateKYBClearance(),
        maxScore: 20,
        status: this.calculateKYBClearance() >= 16 ? 'COMPLETE' : 'INCOMPLETE',
        details: 'Buyer and exporter KYB verification'
      },
      {
        category: 'Compliance Documents',
        weight: 25,
        score: this.calculateDocumentClearance(),
        maxScore: 25,
        status: this.calculateDocumentClearance() >= 20 ? 'COMPLETE' : 'INCOMPLETE',
        details: 'Required compliance documents'
      },
      {
        category: 'Inspection',
        weight: 20,
        score: this.calculateInspectionClearance(),
        maxScore: 20,
        status: this.calculateInspectionClearance() >= 16 ? 'COMPLETE' : 'INCOMPLETE',
        details: 'Inspection completion and results'
      },
      {
        category: 'Quality',
        weight: 15,
        score: this.calculateQualityClearance(),
        maxScore: 15,
        status: this.calculateQualityClearance() >= 12 ? 'COMPLETE' : 'INCOMPLETE',
        details: 'Quality specification compliance'
      },
      {
        category: 'Destination Readiness',
        weight: 10,
        score: this.calculateDestinationClearance(),
        maxScore: 10,
        status: this.calculateDestinationClearance() >= 8 ? 'COMPLETE' : 'INCOMPLETE',
        details: 'Destination country requirements'
      },
      {
        category: 'Contract',
        weight: 10,
        score: this.calculateContractClearance(),
        maxScore: 10,
        status: this.calculateContractClearance() >= 8 ? 'COMPLETE' : 'INCOMPLETE',
        details: 'Contract execution status'
      }
    ];

    const overall = factors.reduce((sum, f) => sum + f.score, 0);
    const status = this.determineClearanceStatus(overall, factors);

    const clearanceReadiness: ClearanceReadiness = {
      overall,
      breakdown: factors,
      status,
      calculatedAt: new Date().toISOString()
    };

    this.transaction.compliancePack.clearanceReadiness = clearanceReadiness;
    this.addAuditEvent('CLEARANCE_READINESS_CALCULATED', `Score: ${overall}/100, Status: ${status}`);

    return clearanceReadiness;
  }

  /**
   * Get compliance summary
   */
  getSummary(): ComplianceSummary {
    const pack = this.transaction.compliancePack;

    return {
      transactionId: this.transaction.id,
      laneTemplate: pack.laneTemplate,
      status: pack.status,
      totalDocuments: pack.documents.length,
      verifiedDocuments: pack.documents.filter(d => d.status === 'VERIFIED').length,
      pendingDocuments: pack.documents.filter(d => ['EXPECTED', 'MISSING', 'UPLOADED', 'PROCESSING', 'VERIFICATION_REQUIRED'].includes(d.status)).length,
      expiredDocuments: pack.documents.filter(d => d.status === 'EXPIRED').length,
      totalRequirements: pack.requirements.length,
      satisfiedRequirements: pack.requirements.filter(r => r.status === 'SATISFIED').length,
      clearanceReadiness: pack.clearanceReadiness,
      exceptions: pack.exceptions.length,
      openExceptions: pack.exceptions.filter(e => e.status === 'OPEN').length
    };
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  private async findLaneTemplate(
    origin: string,
    destination: string,
    commodity: string,
    incoterm: string
  ): Promise<LaneTemplate | null> {
    // In production, this would query the database
    // For now, return a mock template
    return {
      id: `lane-${origin}-${destination}-${commodity}`,
      name: `${origin} → ${destination} / ${commodity}`,
      origin,
      destination,
      commodity,
      transactionType: 'COMMODITY_EXPORT',
      incoterm,
      version: '1.0',
      status: 'ACTIVE',
      requirements: [
        {
          id: 'req-1',
          category: 'IDENTITY',
          description: 'Buyer KYB verification',
          mandatory: true,
          rule: 'BUYER_KYB_APPROVED'
        },
        {
          id: 'req-2',
          category: 'IDENTITY',
          description: 'Exporter KYB verification',
          mandatory: true,
          rule: 'EXPORTER_KYB_APPROVED'
        }
      ],
      documentRequirements: [
        { documentType: 'BUYER_KYB', mandatory: true, expiryRule: null, validationRule: null, source: 'BUYER' },
        { documentType: 'EXPORTER_KYB', mandatory: true, expiryRule: null, validationRule: null, source: 'EXPORTER' },
        { documentType: 'CONTRACT', mandatory: true, expiryRule: null, validationRule: null, source: 'SYSTEM' },
        { documentType: 'COMMERCIAL_INVOICE', mandatory: true, expiryRule: null, validationRule: null, source: 'EXPORTER' },
        { documentType: 'CERTIFICATE_OF_ORIGIN', mandatory: true, expiryRule: '90d', validationRule: null, source: 'EXPORTER' },
        { documentType: 'PHYTOSANITARY_CERTIFICATE', mandatory: true, expiryRule: '30d', validationRule: null, source: 'EXPORTER' },
        { documentType: 'CERTIFICATE_OF_ANALYSIS', mandatory: true, expiryRule: '30d', validationRule: null, source: 'INSPECTOR' },
        { documentType: 'HEALTH_CERTIFICATE', mandatory: true, expiryRule: '30d', validationRule: null, source: 'EXPORTER' },
        { documentType: 'HALAL_CERTIFICATE', mandatory: true, expiryRule: '365d', validationRule: null, source: 'EXPORTER' },
        { documentType: 'ARABIC_LABEL_VERIFICATION', mandatory: true, expiryRule: null, validationRule: null, source: 'EXPORTER' },
        { documentType: 'SFDA_REGISTRATION', mandatory: true, expiryRule: '365d', validationRule: null, source: 'BUYER' },
        { documentType: 'INSPECTION_REPORT', mandatory: true, expiryRule: null, validationRule: null, source: 'INSPECTOR' },
        { documentType: 'SHIPMENT_DOCUMENTATION', mandatory: true, expiryRule: null, validationRule: null, source: 'EXPORTER' },
        { documentType: 'DESTINATION_DOCUMENTATION', mandatory: true, expiryRule: null, validationRule: null, source: 'BUYER' }
      ],
      inspectionRequirements: [
        {
          type: 'PRE_SHIPMENT_INSPECTION',
          mandatory: true,
          provider: null,
          parameters: ['moisture', 'purity', 'foreign_matter', 'aflatoxin'],
          timing: 'PRE_SHIPMENT'
        }
      ],
      qualityRequirements: [
        { parameter: 'moisture', minValue: null, maxValue: 8, targetValue: 6, unit: '%', tolerance: 2, critical: true },
        { parameter: 'purity', minValue: 98, maxValue: null, targetValue: 99, unit: '%', tolerance: 1, critical: true },
        { parameter: 'foreign_matter', minValue: null, maxValue: 2, targetValue: 0.5, unit: '%', tolerance: 0.5, critical: false },
        { parameter: 'aflatoxin', minValue: null, maxValue: 10, targetValue: 5, unit: 'ppb', tolerance: 2, critical: true }
      ],
      releaseConditions: [
        { type: 'KYB', description: 'Buyer and exporter KYB approved', critical: true, rule: 'ALL_KYB_APPROVED', evidence: [] },
        { type: 'COMPLIANCE', description: 'All mandatory documents verified', critical: true, rule: 'ALL_DOCUMENTS_VERIFIED', evidence: [] },
        { type: 'INSPECTION', description: 'Inspection passed', critical: true, rule: 'INSPECTION_PASSED', evidence: [] },
        { type: 'QUALITY', description: 'Quality within specification', critical: true, rule: 'QUALITY_ACCEPTED', evidence: [] },
        { type: 'FINANCE', description: 'Funds secured', critical: true, rule: 'FUNDS_SECURED', evidence: [] },
        { type: 'SHIPMENT', description: 'Shipment confirmed', critical: false, rule: 'SHIPMENT_CONFIRMED', evidence: [] }
      ],
      createdAt: new Date().toISOString(),
      createdBy: 'SYSTEM',
      approvedBy: null,
      approvedAt: null,
      effectiveFrom: new Date().toISOString(),
      effectiveTo: null
    };
  }

  private getDocumentName(type: DocumentType): string {
    const names: Record<DocumentType, string> = {
      'BUYER_KYB': 'Buyer KYB Documentation',
      'EXPORTER_KYB': 'Exporter KYB Documentation',
      'CONTRACT': 'Trade Contract',
      'COMMERCIAL_INVOICE': 'Commercial Invoice',
      'CERTIFICATE_OF_ORIGIN': 'Certificate of Origin',
      'PHYTOSANITARY_CERTIFICATE': 'Phytosanitary Certificate',
      'CERTIFICATE_OF_ANALYSIS': 'Certificate of Analysis',
      'HEALTH_CERTIFICATE': 'Health Certificate',
      'HALAL_CERTIFICATE': 'Halal Certificate',
      'ARABIC_LABEL_VERIFICATION': 'Arabic Label Verification',
      'INSPECTION_REPORT': 'Inspection Report',
      'SHIPMENT_DOCUMENTATION': 'Shipment Documentation',
      'DESTINATION_DOCUMENTATION': 'Destination Documentation',
      'SFDA_REGISTRATION': 'SFDA Registration',
      'CUSTOMS_DECLARATION': 'Customs Declaration',
      'PACKING_LIST': 'Packing List',
      'BILL_OF_LADING': 'Bill of Lading',
      'INSURANCE_CERTIFICATE': 'Insurance Certificate'
    };

    return names[type] || type;
  }

  private async extractDocumentMetadata(metadata: Record<string, any>): Promise<any> {
    // In production, this would use document intelligence API
    return {
      extractedDates: metadata.dates || [],
      extractedEntities: metadata.entities || [],
      extractedReferences: metadata.references || [],
      missingFields: metadata.missingFields || [],
      validationErrors: []
    };
  }

  private async validateDocument(document: ComplianceDocument): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Check required fields
    if (document.metadata.missingFields.length > 0) {
      errors.push(`Missing required fields: ${document.metadata.missingFields.join(', ')}`);
    }

    // Check validation errors
    if (document.metadata.validationErrors.length > 0) {
      errors.push(...document.metadata.validationErrors);
    }

    return { valid: errors.length === 0, errors };
  }

  private async createDocumentException(document: ComplianceDocument, reason: string): Promise<void> {
    const exception: ComplianceException = {
      id: `exc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'DOCUMENT',
      severity: 'HIGH',
      description: `Document ${document.type} rejected: ${reason}`,
      documentId: document.id,
      status: 'OPEN',
      assignedTo: null,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      resolution: null,
      createdAt: new Date().toISOString(),
      resolvedAt: null
    };

    this.transaction.compliancePack.exceptions.push(exception);
    this.addAuditEvent('COMPLIANCE_EXCEPTION_CREATED', `Exception created for document ${document.type}`);
  }

  private isReleaseCriticalDocument(type: DocumentType): boolean {
    const criticalDocs: DocumentType[] = [
      'CERTIFICATE_OF_ORIGIN',
      'PHYTOSANITARY_CERTIFICATE',
      'CERTIFICATE_OF_ANALYSIS',
      'HEALTH_CERTIFICATE',
      'HALAL_CERTIFICATE',
      'SFDA_REGISTRATION'
    ];

    return criticalDocs.includes(type);
  }

  private initializeClearanceReadiness(): ClearanceReadiness {
    return {
      overall: 0,
      breakdown: [],
      status: 'NOT_READY',
      calculatedAt: new Date().toISOString()
    };
  }

  private async updateClearanceReadiness(): Promise<void> {
    await this.calculateClearanceReadiness();
  }

  private async checkComplianceReady(): Promise<void> {
    const pack = this.transaction.compliancePack;

    const mandatoryDocs = pack.documents.filter(d => d.required);
    const verifiedDocs = mandatoryDocs.filter(d => d.status === 'VERIFIED');

    if (verifiedDocs.length === mandatoryDocs.length) {
      pack.status = 'READY';
      this.addAuditEvent('COMPLIANCE_READY', 'All mandatory documents verified');
    }
  }

  private calculateKYBClearance(): number {
    const buyerKYB = this.transaction.buyer.kybStatus === 'APPROVED' ? 10 : 0;
    const exporterKYB = this.transaction.exporter.kybStatus === 'APPROVED' ? 10 : 0;
    return buyerKYB + exporterKYB;
  }

  private calculateDocumentClearance(): number {
    const mandatoryDocs = this.transaction.compliancePack.documents.filter(d => d.required);
    const verifiedDocs = mandatoryDocs.filter(d => d.status === 'VERIFIED');

    if (mandatoryDocs.length === 0) return 25;
    return Math.round((verifiedDocs.length / mandatoryDocs.length) * 25);
  }

  private calculateInspectionClearance(): number {
    if (!this.transaction.inspection) return 0;
    if (this.transaction.inspection.status === 'PASSED') return 20;
    if (this.transaction.inspection.status === 'CONDITIONAL') return 15;
    return 0;
  }

  private calculateQualityClearance(): number {
    if (!this.transaction.inspection?.qualityScore) return 0;
    const score = this.transaction.inspection.qualityScore.overall;
    return Math.round((score / 100) * 15);
  }

  private calculateDestinationClearance(): number {
    // Check destination requirements
    return 8;
  }

  private calculateContractClearance(): number {
    if (this.transaction.contract.status === 'EXECUTED') return 10;
    return 0;
  }

  private determineClearanceStatus(overall: number, factors: ClearanceFactor[]): ClearanceReadiness['status'] {
    const blockedFactors = factors.filter(f => f.status === 'BLOCKED');
    if (blockedFactors.length > 0) return 'BLOCKED';

    if (overall >= 90) return 'READY';
    if (overall >= 50) return 'PARTIAL';
    return 'NOT_READY';
  }

  private addAuditEvent(eventType: string, details: string): void {
    const event: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: this.transaction.id,
      eventType,
      category: 'COMPLIANCE',
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
// COMPLIANCE SUMMARY TYPE
// ============================================================

export interface ComplianceSummary {
  transactionId: string;
  laneTemplate: string;
  status: string;
  totalDocuments: number;
  verifiedDocuments: number;
  pendingDocuments: number;
  expiredDocuments: number;
  totalRequirements: number;
  satisfiedRequirements: number;
  clearanceReadiness: ClearanceReadiness;
  exceptions: number;
  openExceptions: number;
}

// ============================================================
// COMPLIANCE DISPLAY HELPERS
// ============================================================

export function getDocumentStatusDisplay(status: DocumentStatus): {
  label: string;
  color: string;
  icon: string;
} {
  const displays: Record<DocumentStatus, { label: string; color: string; icon: string }> = {
    'EXPECTED': { label: 'Expected', color: '#6B7280', icon: '○' },
    'MISSING': { label: 'Missing', color: '#EF4444', icon: '✕' },
    'UPLOADED': { label: 'Uploaded', color: '#3B82F6', icon: '↑' },
    'PROCESSING': { label: 'Processing', color: '#8B5CF6', icon: '⟳' },
    'VERIFICATION_REQUIRED': { label: 'Verification Required', color: '#F59E0B', icon: '?' },
    'VERIFIED': { label: 'Verified', color: '#10B981', icon: '✓' },
    'REJECTED': { label: 'Rejected', color: '#EF4444', icon: '✕' },
    'EXPIRING': { label: 'Expiring Soon', color: '#F97316', icon: '⚠' },
    'EXPIRED': { label: 'Expired', color: '#EF4444', icon: '✕' },
    'SUPERSEDED': { label: 'Superseded', color: '#6B7280', icon: '↗' }
  };

  return displays[status] || { label: status, color: '#6B7280', icon: '?' };
}

export function getClearanceReadinessDisplay(status: ClearanceReadiness['status']): {
  label: string;
  color: string;
  description: string;
} {
  const displays: Record<string, { label: string; color: string; description: string }> = {
    'NOT_READY': { label: 'Not Ready', color: '#EF4444', description: 'Significant compliance gaps remain' },
    'PARTIAL': { label: 'Partial', color: '#F59E0B', description: 'Some compliance requirements pending' },
    'READY': { label: 'Ready', color: '#10B981', description: 'All compliance requirements satisfied' },
    'BLOCKED': { label: 'Blocked', color: '#EF4444', description: 'Critical compliance issues blocking progress' }
  };

  return displays[status] || { label: status, color: '#6B7280', description: '' };
}
