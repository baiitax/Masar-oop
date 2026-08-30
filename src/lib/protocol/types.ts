// MASAR Protocol Core Types
// The fundamental types for the Trade Corridor Operating System

// ============================================================
// TRANSACTION TYPES
// ============================================================

export type TransactionState = 
  | 'DRAFT'
  | 'RFQ'
  | 'BUYER_VERIFIED'
  | 'EXPORTER_VERIFIED'
  | 'COMMERCIAL_MATCH'
  | 'CONTRACTED'
  | 'COMPLIANCE_REVIEW'
  | 'COMPLIANCE_READY'
  | 'INSPECTION_PENDING'
  | 'INSPECTION_IN_PROGRESS'
  | 'INSPECTION_PASSED'
  | 'FINANCE_PENDING'
  | 'FINANCE_APPROVED'
  | 'FUNDS_SECURED'
  | 'SHIPMENT_READY'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'PORT_VERIFICATION'
  | 'RELEASE_ELIGIBLE'
  | 'RELEASE_APPROVAL'
  | 'SETTLEMENT'
  | 'COMPLETED';

export type ExceptionState =
  | 'KYB_EXCEPTION'
  | 'SANCTIONS_EXCEPTION'
  | 'COMPLIANCE_EXCEPTION'
  | 'DOCUMENT_EXCEPTION'
  | 'INSPECTION_FAILED'
  | 'QUALITY_VARIANCE'
  | 'FINANCE_DECLINED'
  | 'SHIPMENT_DELAY'
  | 'PORT_EXCEPTION'
  | 'SETTLEMENT_EXCEPTION'
  | 'DISPUTE'
  | 'CANCELLED';

export type TransactionStatus = TransactionState | ExceptionState;

export interface MASARTransaction {
  id: string; // MASAR-SES-2027-000001
  state: TransactionStatus;
  previousState: TransactionStatus | null;
  stateHistory: StateTransition[];
  
  // Parties
  buyer: PartyReference;
  exporter: PartyReference;
  
  // Commodity
  commodity: CommodityDetails;
  
  // Commercial Terms
  contract: ContractDetails;
  invoice: InvoiceDetails | null;
  
  // Compliance
  compliancePack: CompliancePack;
  
  // Inspection
  inspection: InspectionRecord | null;
  
  // Finance
  financing: FinancingRecord | null;
  
  // Shipment
  shipment: ShipmentRecord | null;
  
  // Release
  releaseConditions: ReleaseCondition[];
  releaseApproval: ReleaseApproval | null;
  
  // Settlement
  settlement: SettlementRecord | null;
  
  // Risk
  risk: RiskAssessment;
  
  // Audit
  auditTrail: AuditEvent[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo: string | null;
  sla: SLARecord;
  nextAction: string | null;
}

export interface PartyReference {
  organizationId: string;
  name: string;
  role: 'BUYER' | 'EXPORTER' | 'CAPITAL_PARTNER' | 'INSPECTOR';
  kybStatus: KYBStatus;
  contactId: string;
}

export interface CommodityDetails {
  type: string; // SESAME, CASHEW, SOY
  subType: string;
  quantity: number;
  unit: string; // MT, KG
  specification: QualitySpecification;
  origin: string;
  destination: string;
}

export interface QualitySpecification {
  attributes: QualityAttribute[];
  tolerance: number; // percentage
}

export interface QualityAttribute {
  name: string; // moisture, purity, foreign_matter, aflatoxin
  minValue: number | null;
  maxValue: number | null;
  targetValue: number;
  unit: string;
  critical: boolean;
}

export interface ContractDetails {
  id: string;
  reference: string;
  incoterm: string;
  currency: string;
  totalValue: number;
  paymentTerms: string;
  deliveryTerms: string;
  signedAt: string | null;
  signedBy: string[];
  status: 'DRAFT' | 'PENDING_SIGNATURE' | 'EXECUTED' | 'AMENDED';
}

export interface InvoiceDetails {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  issuedAt: string;
  dueAt: string;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'OVERDUE';
  eInvoice: EInvoiceRecord | null;
}

export interface EInvoiceRecord {
  id: string;
  zatcaId: string | null;
  status: 'PENDING' | 'GENERATED' | 'SIGNED' | 'SUBMITTED' | 'CLEARED' | 'REJECTED';
  xmlHash: string | null;
  clearedAt: string | null;
  provider: string;
}

// ============================================================
// KYB TYPES
// ============================================================

export type KYBStatus = 
  | 'NOT_STARTED'
  | 'SUBMITTED'
  | 'DATA_EXTRACTION'
  | 'ENTITY_MATCHING'
  | 'REGISTRY_VERIFICATION'
  | 'OWNERSHIP_MAPPING'
  | 'UBO_IDENTIFICATION'
  | 'SANCTIONS_SCREENING'
  | 'PEP_SCREENING'
  | 'RISK_REVIEW'
  | 'RISK_CLASSIFICATION'
  | 'AUTO_CLEAR'
  | 'HUMAN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'BLOCKED';

export type KYBDecision = 'AUTO_CLEAR' | 'HUMAN_REVIEW' | 'BLOCK';

export interface OrganizationProfile {
  id: string;
  
  // Legal Identity
  legalName: string;
  tradingName: string;
  registrationNumber: string;
  jurisdiction: string;
  incorporationDate: string;
  businessType: string;
  registeredAddress: Address;
  operatingAddress: Address;
  taxIdentifiers: TaxIdentifier[];
  
  // Ownership
  shareholders: Shareholder[];
  ubos: UBO[];
  directors: Director[];
  authorizedRepresentatives: AuthorizedRepresentative[];
  
  // Business
  industry: string;
  commodities: string[];
  exportHistory: TradeHistoryEntry[];
  importHistory: TradeHistoryEntry[];
  transactionHistory: TransactionSummary[];
  
  // Risk
  kybStatus: KYBStatus;
  kybDecision: KYBDecision | null;
  sanctionsStatus: SanctionsStatus;
  pepStatus: PEPStatus;
  riskScore: RiskScore;
  reviewStatus: ReviewStatus;
  lastVerification: string | null;
  nextReviewDate: string | null;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  verifiedBy: string | null;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface TaxIdentifier {
  type: string; // TIN, VAT, CR
  value: string;
  jurisdiction: string;
  verified: boolean;
}

export interface Shareholder {
  id: string;
  name: string;
  type: 'INDIVIDUAL' | 'CORPORATE';
  ownershipPercentage: number;
  nationality: string;
  ubo: boolean;
  verified: boolean;
}

export interface UBO {
  id: string;
  name: string;
  nationality: string;
  dateOfBirth: string | null;
  identificationNumber: string;
  identificationType: string;
  ownershipPercentage: number;
  sanctionsCleared: boolean;
  pepStatus: PEPStatus;
  adverseMedia: boolean;
}

export interface Director {
  id: string;
  name: string;
  nationality: string;
  position: string;
  appointedDate: string;
  sanctionsCleared: boolean;
  pepStatus: PEPStatus;
}

export interface AuthorizedRepresentative {
  id: string;
  name: string;
  position: string;
  authorizationDate: string;
  authorizationScope: string[];
  verified: boolean;
}

export interface TradeHistoryEntry {
  year: number;
  value: number;
  currency: string;
  commodities: string[];
  destinations: string[];
  transactionCount: number;
}

export interface TransactionSummary {
  transactionId: string;
  date: string;
  commodity: string;
  value: number;
  status: string;
  counterpart: string;
}

export type SanctionsStatus = 'NOT_SCREENED' | 'CLEAR' | 'POTENTIAL_MATCH' | 'CONFIRMED_MATCH' | 'FALSE_POSITIVE';

export type PEPStatus = 'NOT_SCREENED' | 'CLEAR' | 'POTENTIAL_PEP' | 'CONFIRMED_PEP';

export type ReviewStatus = 'NOT_REVIEWED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface RiskScore {
  overall: number; // 0-100
  breakdown: RiskFactor[];
  classification: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  calculatedAt: string;
}

export interface RiskFactor {
  category: string;
  weight: number;
  score: number;
  maxScore: number;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'NOT_APPLICABLE';
  details: string;
}

// ============================================================
// COMPLIANCE TYPES
// ============================================================

export interface CompliancePack {
  id: string;
  transactionId: string;
  laneTemplate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'READY' | 'EXCEPTION';
  documents: ComplianceDocument[];
  requirements: ComplianceRequirement[];
  clearanceReadiness: ClearanceReadiness;
  exceptions: ComplianceException[];
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceDocument {
  id: string;
  type: DocumentType;
  name: string;
  status: DocumentStatus;
  version: number;
  versions: DocumentVersion[];
  required: boolean;
  expiryDate: string | null;
  expiryWarning: ExpiryWarning | null;
  uploadedBy: string | null;
  uploadedAt: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  metadata: DocumentMetadata;
  transactionId: string;
}

export type DocumentType =
  | 'BUYER_KYB'
  | 'EXPORTER_KYB'
  | 'CONTRACT'
  | 'COMMERCIAL_INVOICE'
  | 'CERTIFICATE_OF_ORIGIN'
  | 'PHYTOSANITARY_CERTIFICATE'
  | 'CERTIFICATE_OF_ANALYSIS'
  | 'HEALTH_CERTIFICATE'
  | 'HALAL_CERTIFICATE'
  | 'ARABIC_LABEL_VERIFICATION'
  | 'INSPECTION_REPORT'
  | 'SHIPMENT_DOCUMENTATION'
  | 'DESTINATION_DOCUMENTATION'
  | 'SFDA_REGISTRATION'
  | 'CUSTOMS_DECLARATION'
  | 'PACKING_LIST'
  | 'BILL_OF_LADING'
  | 'INSURANCE_CERTIFICATE';

export type DocumentStatus =
  | 'EXPECTED'
  | 'MISSING'
  | 'UPLOADED'
  | 'PROCESSING'
  | 'VERIFICATION_REQUIRED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRING'
  | 'EXPIRED'
  | 'SUPERSEDED';

export interface DocumentVersion {
  version: number;
  uploadedBy: string;
  uploadedAt: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reason: string;
  status: DocumentStatus;
  hash: string;
  fileUrl: string;
}

export interface DocumentMetadata {
  extractedDates: string[];
  extractedEntities: string[];
  extractedReferences: string[];
  missingFields: string[];
  validationErrors: string[];
}

export interface ExpiryWarning {
  level: 'INFO' | 'WARNING' | 'HIGH_PRIORITY' | 'CRITICAL';
  daysRemaining: number;
  message: string;
}

export interface ComplianceRequirement {
  id: string;
  type: string;
  description: string;
  mandatory: boolean;
  status: 'PENDING' | 'SATISFIED' | 'EXCEPTION';
  documentId: string | null;
  rule: string;
}

export interface ClearanceReadiness {
  overall: number; // 0-100
  breakdown: ClearanceFactor[];
  status: 'NOT_READY' | 'PARTIAL' | 'READY' | 'BLOCKED';
  calculatedAt: string;
}

export interface ClearanceFactor {
  category: string;
  weight: number;
  score: number;
  maxScore: number;
  status: 'COMPLETE' | 'INCOMPLETE' | 'BLOCKED';
  details: string;
}

export interface ComplianceException {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  documentId: string | null;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
  assignedTo: string | null;
  dueDate: string | null;
  resolution: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

// ============================================================
// INSPECTION TYPES
// ============================================================

export type InspectionStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'INSPECTOR_ASSIGNED'
  | 'SAMPLE_PENDING'
  | 'SAMPLE_COLLECTED'
  | 'LAB_PROCESSING'
  | 'RESULT_RECEIVED'
  | 'INSPECTION_REVIEW'
  | 'PASSED'
  | 'CONDITIONAL'
  | 'FAILED';

export interface InspectionRecord {
  id: string;
  transactionId: string;
  provider: InspectionProvider;
  status: InspectionStatus;
  inspector: Inspector | null;
  samples: Sample[];
  labResults: LabResult[];
  qualityScore: QualityScore | null;
  inspectionReport: InspectionReport | null;
  exceptions: InspectionException[];
  requestedAt: string;
  scheduledAt: string | null;
  completedAt: string | null;
  statusHistory: InspectionStatusTransition[];
}

export interface InspectionProvider {
  id: string;
  name: string;
  type: 'INSPECTOR' | 'LABORATORY' | 'BOTH';
  accreditation: string[];
  contact: ContactInfo;
  adapter: string;
}

export interface Inspector {
  id: string;
  name: string;
  certification: string[];
  specialization: string[];
  assignedAt: string;
}

export interface Sample {
  id: string;
  lotId: string;
  location: string;
  collector: string;
  collectedAt: string;
  sealNumber: string;
  laboratory: string;
  receivedAt: string | null;
  tests: string[];
  status: 'PENDING' | 'COLLECTED' | 'IN_TRANSIT' | 'RECEIVED' | 'TESTING' | 'COMPLETED';
  chainOfCustody: CustodyEvent[];
}

export interface CustodyEvent {
  timestamp: string;
  location: string;
  handler: string;
  action: string;
  notes: string;
}

export interface LabResult {
  id: string;
  sampleId: string;
  testType: string;
  parameter: string;
  value: number;
  unit: string;
  method: string;
  specification: SpecificationLimit;
  result: 'PASS' | 'FAIL' | 'WITHIN_TOLERANCE' | 'OUTSIDE_TOLERANCE';
  certifiedBy: string;
  certifiedAt: string;
}

export interface SpecificationLimit {
  minValue: number | null;
  maxValue: number | null;
  targetValue: number | null;
  tolerance: number;
}

export interface QualityScore {
  overall: number;
  breakdown: QualityFactor[];
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'POOR' | 'REJECTED';
}

export interface QualityFactor {
  parameter: string;
  weight: number;
  score: number;
  maxScore: number;
  status: 'PASS' | 'FAIL' | 'WARNING';
  contractValue: string;
  actualValue: string;
}

export interface InspectionReport {
  id: string;
  summary: string;
  findings: string[];
  recommendations: string[];
  conclusion: 'PASS' | 'CONDITIONAL' | 'FAIL';
  generatedAt: string;
  signedBy: string;
}

export interface InspectionException {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  resolution: string | null;
}

export interface InspectionStatusTransition {
  from: InspectionStatus;
  to: InspectionStatus;
  timestamp: string;
  triggeredBy: string;
  reason: string;
}

// ============================================================
// FINANCE TYPES
// ============================================================

export interface FinancingRecord {
  id: string;
  transactionId: string;
  type: 'ESCROW' | 'TRADE_FINANCE' | 'ADVANCE';
  requestedAmount: number;
  approvedAmount: number | null;
  currency: string;
  status: FinanceStatus;
  provider: FinanceProvider;
  conditions: FinanceCondition[];
  fundedAt: string | null;
  releasedAt: string | null;
  requestedAt: string;
  approvedAt: string | null;
}

export type FinanceStatus =
  | 'NOT_REQUESTED'
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'DECLINED'
  | 'FUNDED'
  | 'RELEASED'
  | 'SETTLED';

export interface FinanceProvider {
  id: string;
  name: string;
  type: 'ESCROW_AGENT' | 'BANK' | 'DFI' | 'TRADE_FINANCE';
  license: string;
  contact: ContactInfo;
}

export interface FinanceCondition {
  id: string;
  description: string;
  status: 'PENDING' | 'SATISFIED' | 'WAIVED';
  satisfiedAt: string | null;
  evidence: string | null;
}

// ============================================================
// SHIPMENT TYPES
// ============================================================

export interface ShipmentRecord {
  id: string;
  transactionId: string;
  carrier: string;
  vessel: string;
  voyage: string;
  containerNumber: string;
  sealNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  etd: string | null;
  eta: string | null;
  atd: string | null;
  ata: string | null;
  status: ShipmentStatus;
  events: ShipmentEvent[];
  documents: string[];
}

export type ShipmentStatus =
  | 'NOT_STARTED'
  | 'BOOKED'
  | 'GATE_IN'
  | 'LOADED'
  | 'DEPARTED'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'DISCHARGED'
  | 'CUSTOMS_CLEARED'
  | 'DELIVERED';

export interface ShipmentEvent {
  timestamp: string;
  location: string;
  event: string;
  description: string;
  documentRef: string | null;
}

// ============================================================
// RELEASE TYPES
// ============================================================

export interface ReleaseCondition {
  id: string;
  type: string;
  description: string;
  status: 'PENDING' | 'SATISFIED' | 'WAIVED' | 'BLOCKED';
  satisfiedAt: string | null;
  evidence: string | null;
  rule: string;
  critical: boolean;
}

export interface ReleaseApproval {
  id: string;
  transactionId: string;
  status: 'PENDING' | 'APPROVED' | 'HELD' | 'REJECTED';
  requiredApprovals: number;
  approvals: ReleaseApprover[];
  decision: string | null;
  decidedAt: string | null;
  decidedBy: string | null;
  notes: string | null;
}

export interface ReleaseApprover {
  userId: string;
  name: string;
  role: string;
  approvedAt: string | null;
  decision: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ABSTAINED';
  notes: string | null;
}

// ============================================================
// SETTLEMENT TYPES
// ============================================================

export interface SettlementRecord {
  id: string;
  transactionId: string;
  status: SettlementStatus;
  waterfall: SettlementWaterfallItem[];
  totalAmount: number;
  currency: string;
  settledAt: string | null;
  settledBy: string | null;
  reference: string | null;
  eInvoiceId: string | null;
}

export type SettlementStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'DISPUTED';

export interface SettlementWaterfallItem {
  sequence: number;
  recipient: string;
  type: 'CAPITAL_PARTNER' | 'MASAR_FEES' | 'EXPORTER' | 'VARIANCE';
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'HELD';
  paidAt: string | null;
  reference: string | null;
}

// ============================================================
// RISK TYPES
// ============================================================

export interface RiskAssessment {
  overall: number;
  classification: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: RiskFactor[];
  lastAssessed: string;
  nextAssessment: string;
  mitigations: RiskMitigation[];
}

export interface RiskMitigation {
  id: string;
  risk: string;
  action: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  owner: string;
  dueDate: string;
}

// ============================================================
// AUDIT TYPES
// ============================================================

export interface AuditEvent {
  id: string;
  transactionId: string;
  eventType: string;
  category: 'IDENTITY' | 'COMPLIANCE' | 'INSPECTION' | 'FINANCE' | 'SHIPMENT' | 'RELEASE' | 'SETTLEMENT' | 'SYSTEM';
  action: string;
  actor: string;
  actorType: 'USER' | 'SYSTEM' | 'PARTNER' | 'API';
  target: string;
  targetType: string;
  details: Record<string, any>;
  evidence: string[];
  timestamp: string;
  hash: string;
  previousHash: string | null;
  ipAddress: string | null;
  userAgent: string | null;
}

// ============================================================
// SLA TYPES
// ============================================================

export interface SLARecord {
  policies: SLAPolicy[];
  violations: SLAViolation[];
  metrics: SLAMetric[];
}

export interface SLAPolicy {
  id: string;
  name: string;
  category: string;
  targetHours: number;
  warningThreshold: number; // percentage
  criticalThreshold: number; // percentage
  escalationPolicy: string;
}

export interface SLAViolation {
  id: string;
  policyId: string;
  transactionId: string;
  severity: 'WARNING' | 'CRITICAL' | 'BREACH';
  detectedAt: string;
  resolvedAt: string | null;
  escalatedTo: string | null;
  resolution: string | null;
}

export interface SLAMetric {
  category: string;
  target: number;
  actual: number;
  unit: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'BREACHED';
}

// ============================================================
// WORKFLOW TYPES
// ============================================================

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  version: string;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  priority: number;
  enabled: boolean;
  createdAt: string;
  createdBy: string;
  approvedBy: string | null;
  approvedAt: string | null;
}

export interface WorkflowCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'IN' | 'NOT_IN';
  value: any;
  logicalOperator: 'AND' | 'OR' | null;
}

export interface WorkflowAction {
  type: 'TRANSITION_STATE' | 'CREATE_TASK' | 'SEND_NOTIFICATION' | 'UPDATE_FIELD' | 'CALL_API' | 'ESCALATE';
  config: Record<string, any>;
  delay: number | null; // minutes
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export interface Notification {
  id: string;
  transactionId: string;
  type: string;
  category: 'INFO' | 'WARNING' | 'ALERT' | 'ACTION_REQUIRED';
  title: string;
  message: string;
  recipients: NotificationRecipient[];
  channels: ('EMAIL' | 'SMS' | 'WHATSAPP' | 'IN_APP')[];
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ';
  sentAt: string | null;
  readAt: string | null;
  actionUrl: string | null;
  actionLabel: string | null;
}

export interface NotificationRecipient {
  userId: string;
  role: string;
  channel: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ';
}

// ============================================================
// CASE MANAGEMENT TYPES
// ============================================================

export interface Case {
  id: string; // CASE-2027-0042
  transactionId: string;
  type: 'COMPLIANCE' | 'INSPECTION' | 'FINANCE' | 'DOCUMENT' | 'QUALITY' | 'SETTLEMENT' | 'DISPUTE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'RESOLVED' | 'CLOSED' | 'ESCALATED';
  title: string;
  description: string;
  owner: string;
  assignedTo: string | null;
  sla: CaseSLA;
  resolution: string | null;
  evidence: string[];
  comments: CaseComment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
}

export interface CaseSLA {
  targetHours: number;
  warningAt: string;
  criticalAt: string;
  breachedAt: string | null;
  status: 'ON_TRACK' | 'WARNING' | 'CRITICAL' | 'BREACHED';
}

export interface CaseComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  internal: boolean;
}

// ============================================================
// HELPER TYPES
// ============================================================

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  address: Address | null;
}

export interface StateTransition {
  from: TransactionStatus;
  to: TransactionStatus;
  timestamp: string;
  triggeredBy: string;
  triggerType: 'USER' | 'SYSTEM' | 'API';
  reason: string;
  evidence: string[];
}

// ============================================================
// LANE TEMPLATE TYPES
// ============================================================

export interface LaneTemplate {
  id: string;
  name: string;
  origin: string;
  destination: string;
  commodity: string;
  transactionType: string;
  incoterm: string;
  version: string;
  status: 'DRAFT' | 'ACTIVE' | 'DEPRECATED';
  
  requirements: LaneRequirement[];
  documentRequirements: LaneDocumentRequirement[];
  inspectionRequirements: LaneInspectionRequirement[];
  qualityRequirements: LaneQualityRequirement[];
  releaseConditions: LaneReleaseCondition[];
  
  createdAt: string;
  createdBy: string;
  approvedBy: string | null;
  approvedAt: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface LaneRequirement {
  id: string;
  category: string;
  description: string;
  mandatory: boolean;
  rule: string;
}

export interface LaneDocumentRequirement {
  documentType: DocumentType;
  mandatory: boolean;
  expiryRule: string | null;
  validationRule: string | null;
  source: 'BUYER' | 'EXPORTER' | 'SYSTEM' | 'PARTNER';
}

export interface LaneInspectionRequirement {
  type: string;
  mandatory: boolean;
  provider: string | null;
  parameters: string[];
  timing: 'PRE_SHIPMENT' | 'POST_SHIPMENT' | 'AT_PORT' | 'ON_ARRIVAL';
}

export interface LaneQualityRequirement {
  parameter: string;
  minValue: number | null;
  maxValue: number | null;
  targetValue: number | null;
  unit: string;
  tolerance: number;
  critical: boolean;
}

export interface LaneReleaseCondition {
  type: string;
  description: string;
  critical: boolean;
  rule: string;
  evidence: string[];
}
