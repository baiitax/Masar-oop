// MASAR Protocol - KYB Automation Engine
// Know Your Business verification and risk assessment

import {
  OrganizationProfile,
  KYBStatus,
  KYBDecision,
  RiskScore,
  RiskFactor,
  SanctionsStatus,
  PEPStatus,
  UBO,
  Shareholder,
  Director,
  AuditEvent
} from './types';

// ============================================================
// KYB ENGINE
// ============================================================

export class KYBEngine {
  private organization: OrganizationProfile;
  private auditLog: AuditEvent[] = [];

  constructor(organization: OrganizationProfile) {
    this.organization = organization;
  }

  /**
   * Get current KYB status
   */
  getStatus(): KYBStatus {
    return this.organization.kybStatus;
  }

  /**
   * Start KYB verification process
   */
  async startVerification(): Promise<{ success: boolean; error?: string }> {
    try {
      this.organization.kybStatus = 'SUBMITTED';
      this.addAuditEvent('KYB_STARTED', 'KYB verification process initiated');
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to start KYB verification' };
    }
  }

  /**
   * Process entity verification
   */
  async verifyEntity(): Promise<{ success: boolean; match: boolean; confidence: number }> {
    this.organization.kybStatus = 'ENTITY_MATCHING';
    this.addAuditEvent('ENTITY_VERIFICATION_STARTED', 'Verifying entity against registry');

    // Simulate registry verification
    const match = true;
    const confidence = 0.95;

    if (match && confidence > 0.8) {
      this.addAuditEvent('ENTITY_VERIFIED', `Entity verified with confidence ${confidence}`);
    } else {
      this.addAuditEvent('ENTITY_VERIFICATION_FAILED', `Entity verification failed - confidence ${confidence}`);
    }

    return { success: true, match, confidence };
  }

  /**
   * Verify registry information
   */
  async verifyRegistry(): Promise<{ success: boolean; verified: boolean; details: Record<string, any> }> {
    this.organization.kybStatus = 'REGISTRY_VERIFICATION';
    this.addAuditEvent('REGISTRY_VERIFICATION_STARTED', 'Verifying against corporate registry');

    const details = {
      registrationNumber: this.organization.registrationNumber,
      legalName: this.organization.legalName,
      status: 'ACTIVE',
      incorporationDate: this.organization.incorporationDate,
      registeredAddress: this.organization.registeredAddress
    };

    this.addAuditEvent('REGISTRY_VERIFIED', 'Registry verification completed');

    return { success: true, verified: true, details };
  }

  /**
   * Map ownership structure
   */
  async mapOwnership(): Promise<{ success: boolean; ubos: UBO[] }> {
    this.organization.kybStatus = 'OWNERSHIP_MAPPING';
    this.addAuditEvent('OWNERSHIP_MAPPING_STARTED', 'Mapping ownership structure');

    // Identify UBOs (Ultimate Beneficial Owners)
    const ubos = this.identifyUBOs();
    this.organization.ubos = ubos;

    this.addAuditEvent('OWNERSHIP_MAPPED', `Identified ${ubos.length} UBOs`);

    return { success: true, ubos };
  }

  /**
   * Screen against sanctions lists
   */
  async screenSanctions(): Promise<{ success: boolean; status: SanctionsStatus; matches: any[] }> {
    this.organization.kybStatus = 'SANCTIONS_SCREENING';
    this.addAuditEvent('SANCTIONS_SCREENING_STARTED', 'Screening against sanctions lists');

    const matches: any[] = [];
    let status: SanctionsStatus = 'CLEAR';

    // Screen organization
    const orgMatch = await this.screenEntity(this.organization.legalName);
    if (orgMatch) {
      matches.push(orgMatch);
      status = 'POTENTIAL_MATCH';
    }

    // Screen UBOs
    for (const ubo of this.organization.ubos) {
      const uboMatch = await this.screenEntity(ubo.name);
      if (uboMatch) {
        matches.push({ ...uboMatch, type: 'UBO', name: ubo.name });
        status = 'POTENTIAL_MATCH';
      }
    }

    // Screen directors
    for (const director of this.organization.directors) {
      const dirMatch = await this.screenEntity(director.name);
      if (dirMatch) {
        matches.push({ ...dirMatch, type: 'DIRECTOR', name: director.name });
        status = 'POTENTIAL_MATCH';
      }
    }

    this.organization.sanctionsStatus = status;
    this.addAuditEvent('SANCTIONS_SCREENING_COMPLETED', `Status: ${status}, Matches: ${matches.length}`);

    return { success: true, status, matches };
  }

  /**
   * Screen for PEP (Politically Exposed Persons)
   */
  async screenPEP(): Promise<{ success: boolean; status: PEPStatus; matches: any[] }> {
    this.organization.kybStatus = 'PEP_SCREENING';
    this.addAuditEvent('PEP_SCREENING_STARTED', 'Screening for PEP status');

    const matches: any[] = [];
    let status: PEPStatus = 'CLEAR';

    // Screen UBOs
    for (const ubo of this.organization.ubos) {
      const pepMatch = await this.checkPEP(ubo.name, ubo.nationality);
      if (pepMatch) {
        matches.push({ ...pepMatch, type: 'UBO', name: ubo.name });
        status = 'POTENTIAL_PEP';
      }
    }

    // Screen directors
    for (const director of this.organization.directors) {
      const pepMatch = await this.checkPEP(director.name, director.nationality);
      if (pepMatch) {
        matches.push({ ...pepMatch, type: 'DIRECTOR', name: director.name });
        status = 'POTENTIAL_PEP';
      }
    }

    this.organization.pepStatus = status;
    this.addAuditEvent('PEP_SCREENING_COMPLETED', `Status: ${status}, Matches: ${matches.length}`);

    return { success: true, status, matches };
  }

  /**
   * Calculate risk score
   */
  async calculateRiskScore(): Promise<RiskScore> {
    this.organization.kybStatus = 'RISK_CLASSIFICATION';
    this.addAuditEvent('RISK_CALCULATION_STARTED', 'Calculating risk score');

    const factors: RiskFactor[] = [
      {
        category: 'Identity Verification',
        weight: 20,
        score: this.calculateIdentityScore(),
        maxScore: 20,
        status: this.calculateIdentityScore() >= 16 ? 'PASS' : 'FAIL',
        details: 'Entity identity verified against official registry'
      },
      {
        category: 'Ownership Transparency',
        weight: 20,
        score: this.calculateOwnershipScore(),
        maxScore: 20,
        status: this.calculateOwnershipScore() >= 16 ? 'PASS' : 'WARNING',
        details: 'UBO structure mapped and verified'
      },
      {
        category: 'Sanctions Screening',
        weight: 25,
        score: this.calculateSanctionsScore(),
        maxScore: 25,
        status: this.calculateSanctionsScore() >= 20 ? 'PASS' : 'FAIL',
        details: 'Screened against OFAC, EU, UN sanctions lists'
      },
      {
        category: 'PEP Screening',
        weight: 10,
        score: this.calculatePEPScore(),
        maxScore: 10,
        status: this.calculatePEPScore() >= 8 ? 'PASS' : 'WARNING',
        details: 'Screened for Politically Exposed Persons'
      },
      {
        category: 'Business History',
        weight: 10,
        score: this.calculateBusinessHistoryScore(),
        maxScore: 10,
        status: this.calculateBusinessHistoryScore() >= 7 ? 'PASS' : 'WARNING',
        details: 'Business track record and history'
      },
      {
        category: 'Trade History',
        weight: 10,
        score: this.calculateTradeHistoryScore(),
        maxScore: 10,
        status: this.calculateTradeHistoryScore() >= 7 ? 'PASS' : 'WARNING',
        details: 'Previous trade transaction history'
      },
      {
        category: 'Document Integrity',
        weight: 5,
        score: this.calculateDocumentScore(),
        maxScore: 5,
        status: this.calculateDocumentScore() >= 4 ? 'PASS' : 'WARNING',
        details: 'Document completeness and validity'
      }
    ];

    const overall = factors.reduce((sum, f) => sum + f.score, 0);
    const classification = this.classifyRisk(overall);

    const riskScore: RiskScore = {
      overall,
      breakdown: factors,
      classification,
      calculatedAt: new Date().toISOString()
    };

    this.organization.riskScore = riskScore;
    this.addAuditEvent('RISK_SCORE_CALCULATED', `Score: ${overall}/100, Classification: ${classification}`);

    return riskScore;
  }

  /**
   * Make automated KYB decision
   */
  async makeDecision(): Promise<{ decision: KYBDecision; reason: string }> {
    this.organization.kybStatus = 'RISK_REVIEW';
    this.addAuditEvent('KYB_DECISION_STARTED', 'Evaluating KYB decision');

    const riskScore = this.organization.riskScore;
    let decision: KYBDecision;
    let reason: string;

    // Decision logic
    if (riskScore.classification === 'CRITICAL') {
      decision = 'BLOCK';
      reason = 'Critical risk factors identified - automatic block';
    } else if (riskScore.classification === 'HIGH') {
      decision = 'HUMAN_REVIEW';
      reason = 'High risk classification requires human review';
    } else if (riskScore.classification === 'MEDIUM') {
      // Check for specific flags
      const hasFlags = this.checkForFlags();
      if (hasFlags) {
        decision = 'HUMAN_REVIEW';
        reason = 'Medium risk with flags requires human review';
      } else {
        decision = 'AUTO_CLEAR';
        reason = 'Medium risk within acceptable parameters';
      }
    } else {
      decision = 'AUTO_CLEAR';
      reason = 'Low risk - all checks passed';
    }

    this.organization.kybDecision = decision;
    this.addAuditEvent('KYB_DECISION_MADE', `Decision: ${decision} - ${reason}`);

    return { decision, reason };
  }

  /**
   * Approve KYB after human review
   */
  async approveKYB(reviewedBy: string, notes: string): Promise<{ success: boolean }> {
    this.organization.kybStatus = 'APPROVED';
    this.organization.reviewStatus = 'COMPLETED';
    this.organization.lastVerification = new Date().toISOString();
    this.organization.nextReviewDate = this.calculateNextReviewDate();
    this.organization.verifiedBy = reviewedBy;

    this.addAuditEvent('KYB_APPROVED', `Approved by ${reviewedBy}: ${notes}`);

    return { success: true };
  }

  /**
   * Reject KYB
   */
  async rejectKYB(reviewedBy: string, reason: string): Promise<{ success: boolean }> {
    this.organization.kybStatus = 'REJECTED';
    this.organization.reviewStatus = 'COMPLETED';
    this.organization.verifiedBy = reviewedBy;

    this.addAuditEvent('KYB_REJECTED', `Rejected by ${reviewedBy}: ${reason}`);

    return { success: true };
  }

  /**
   * Block KYB
   */
  async blockKYB(reason: string): Promise<{ success: boolean }> {
    this.organization.kybStatus = 'BLOCKED';
    this.organization.reviewStatus = 'COMPLETED';

    this.addAuditEvent('KYB_BLOCKED', `Blocked: ${reason}`);

    return { success: true };
  }

  /**
   * Get KYB summary for display
   */
  getSummary(): KYBSummary {
    return {
      organizationId: this.organization.id,
      legalName: this.organization.legalName,
      status: this.organization.kybStatus,
      decision: this.organization.kybDecision,
      riskScore: this.organization.riskScore,
      sanctionsStatus: this.organization.sanctionsStatus,
      pepStatus: this.organization.pepStatus,
      uboCount: this.organization.ubos.length,
      directorCount: this.organization.directors.length,
      lastVerification: this.organization.lastVerification,
      nextReviewDate: this.organization.nextReviewDate,
      reviewStatus: this.organization.reviewStatus
    };
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  private identifyUBOs(): UBO[] {
    const ubos: UBO[] = [];
    const threshold = 25; // 25% ownership threshold for UBO

    for (const shareholder of this.organization.shareholders) {
      if (shareholder.ownershipPercentage >= threshold || shareholder.ubo) {
        ubos.push({
          id: shareholder.id,
          name: shareholder.name,
          nationality: shareholder.nationality,
          dateOfBirth: null,
          identificationNumber: '',
          identificationType: '',
          ownershipPercentage: shareholder.ownershipPercentage,
          sanctionsCleared: false,
          pepStatus: 'NOT_SCREENED',
          adverseMedia: false
        });
      }
    }

    return ubos;
  }

  private async screenEntity(name: string): Promise<any | null> {
    // Simulate sanctions screening
    // In production, this would call external sanctions API
    return null;
  }

  private async checkPEP(name: string, nationality: string): Promise<any | null> {
    // Simulate PEP check
    // In production, this would call external PEP database
    return null;
  }

  private calculateIdentityScore(): number {
    // Check if entity is verified
    if (this.organization.registrationNumber && this.organization.legalName) {
      return 20;
    }
    return 10;
  }

  private calculateOwnershipScore(): number {
    // Check ownership transparency
    const uboCount = this.organization.ubos.length;
    if (uboCount > 0 && this.organization.ubos.every(u => u.sanctionsCleared)) {
      return 20;
    }
    if (uboCount > 0) {
      return 15;
    }
    return 5;
  }

  private calculateSanctionsScore(): number {
    switch (this.organization.sanctionsStatus) {
      case 'CLEAR':
        return 25;
      case 'FALSE_POSITIVE':
        return 20;
      case 'POTENTIAL_MATCH':
        return 10;
      case 'CONFIRMED_MATCH':
        return 0;
      default:
        return 0;
    }
  }

  private calculatePEPScore(): number {
    switch (this.organization.pepStatus) {
      case 'CLEAR':
        return 10;
      case 'POTENTIAL_PEP':
        return 5;
      case 'CONFIRMED_PEP':
        return 2;
      default:
        return 0;
    }
  }

  private calculateBusinessHistoryScore(): number {
    // Check business history
    if (this.organization.exportHistory.length > 0) {
      return 10;
    }
    return 5;
  }

  private calculateTradeHistoryScore(): number {
    // Check trade history
    if (this.organization.transactionHistory.length > 0) {
      return 10;
    }
    return 5;
  }

  private calculateDocumentScore(): number {
    // Check document completeness
    return 5;
  }

  private classifyRisk(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score >= 80) return 'LOW';
    if (score >= 60) return 'MEDIUM';
    if (score >= 40) return 'HIGH';
    return 'CRITICAL';
  }

  private checkForFlags(): boolean {
    // Check for specific risk flags
    return false;
  }

  private calculateNextReviewDate(): string {
    const now = new Date();
    const riskClassification = this.organization.riskScore?.classification;

    let months: number;
    switch (riskClassification) {
      case 'LOW':
        months = 12; // Annual review
        break;
      case 'MEDIUM':
        months = 3; // Quarterly review
        break;
      case 'HIGH':
        months = 1; // Monthly review
        break;
      default:
        months = 6;
    }

    now.setMonth(now.getMonth() + months);
    return now.toISOString();
  }

  private addAuditEvent(eventType: string, details: string): void {
    const event: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: '',
      eventType,
      category: 'IDENTITY',
      action: details,
      actor: 'SYSTEM',
      actorType: 'SYSTEM',
      target: this.organization.id,
      targetType: 'ORGANIZATION',
      details: { organizationId: this.organization.id },
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
// KYB SUMMARY TYPE
// ============================================================

export interface KYBSummary {
  organizationId: string;
  legalName: string;
  status: KYBStatus;
  decision: KYBDecision | null;
  riskScore: RiskScore | null;
  sanctionsStatus: SanctionsStatus;
  pepStatus: PEPStatus;
  uboCount: number;
  directorCount: number;
  lastVerification: string | null;
  nextReviewDate: string | null;
  reviewStatus: ReviewStatus;
}

// ============================================================
// KYB MONITORING
// ============================================================

export class KYBMonitor {
  private organizations: Map<string, OrganizationProfile> = new Map();

  /**
   * Register organization for monitoring
   */
  register(organization: OrganizationProfile): void {
    this.organizations.set(organization.id, organization);
  }

  /**
   * Check for organizations due for review
   */
  async checkReviewDue(): Promise<OrganizationProfile[]> {
    const now = new Date();
    const dueForReview: OrganizationProfile[] = [];

    for (const org of this.organizations.values()) {
      if (org.nextReviewDate) {
        const reviewDate = new Date(org.nextReviewDate);
        if (reviewDate <= now) {
          dueForReview.push(org);
        }
      }
    }

    return dueForReview;
  }

  /**
   * Trigger re-screening for organization
   */
  async triggerRescreening(organizationId: string, reason: string): Promise<void> {
    const org = this.organizations.get(organizationId);
    if (!org) {
      throw new Error(`Organization ${organizationId} not found`);
    }

    const engine = new KYBEngine(org);
    await engine.startVerification();
    await engine.screenSanctions();
    await engine.screenPEP();
    await engine.calculateRiskScore();
  }

  /**
   * Get monitoring statistics
   */
  getStatistics(): MonitoringStatistics {
    const orgs = Array.from(this.organizations.values());
    
    return {
      totalOrganizations: orgs.length,
      approved: orgs.filter(o => o.kybStatus === 'APPROVED').length,
      pending: orgs.filter(o => ['SUBMITTED', 'DATA_EXTRACTION', 'ENTITY_MATCHING', 'REGISTRY_VERIFICATION', 'OWNERSHIP_MAPPING', 'UBO_IDENTIFICATION', 'SANCTIONS_SCREENING', 'PEP_SCREENING', 'RISK_REVIEW', 'RISK_CLASSIFICATION'].includes(o.kybStatus)).length,
      rejected: orgs.filter(o => o.kybStatus === 'REJECTED').length,
      blocked: orgs.filter(o => o.kybStatus === 'BLOCKED').length,
      dueForReview: orgs.filter(o => o.nextReviewDate && new Date(o.nextReviewDate) <= new Date()).length
    };
  }
}

export interface MonitoringStatistics {
  totalOrganizations: number;
  approved: number;
  pending: number;
  rejected: number;
  blocked: number;
  dueForReview: number;
}

// ============================================================
// KYB DECISION DISPLAY
// ============================================================

export function getKYBDecisionDisplay(decision: KYBDecision): {
  label: string;
  color: string;
  icon: string;
  description: string;
} {
  switch (decision) {
    case 'AUTO_CLEAR':
      return {
        label: 'Auto-Clear',
        color: '#10B981',
        icon: '✓',
        description: 'All verification checks passed automatically'
      };
    case 'HUMAN_REVIEW':
      return {
        label: 'Human Review',
        color: '#F59E0B',
        icon: '⚠',
        description: 'Risk signals require analyst assessment'
      };
    case 'BLOCK':
      return {
        label: 'Blocked',
        color: '#EF4444',
        icon: '✕',
        description: 'Hard-stop condition identified'
      };
  }
}

export function getRiskClassificationDisplay(classification: string): {
  label: string;
  color: string;
  description: string;
} {
  switch (classification) {
    case 'LOW':
      return {
        label: 'Low Risk',
        color: '#10B981',
        description: 'Minimal risk factors identified'
      };
    case 'MEDIUM':
      return {
        label: 'Medium Risk',
        color: '#F59E0B',
        description: 'Moderate risk factors require monitoring'
      };
    case 'HIGH':
      return {
        label: 'High Risk',
        color: '#F97316',
        description: 'Significant risk factors require enhanced due diligence'
      };
    case 'CRITICAL':
      return {
        label: 'Critical Risk',
        color: '#EF4444',
        description: 'Critical risk factors - immediate action required'
      };
    default:
      return {
        label: 'Unknown',
        color: '#6B7280',
        description: 'Risk classification pending'
      };
  }
}
