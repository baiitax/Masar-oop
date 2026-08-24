// MASAR V0 - Mock Data System
// Complete transaction data for demonstration

export type TransactionStatus = 
  | 'DRAFT'
  | 'RFQ_OPEN'
  | 'COUNTERPARTIES_VERIFIED'
  | 'COMMERCIAL_AGREEMENT'
  | 'CONTRACT_EXECUTED'
  | 'COMPLIANCE_IN_PROGRESS'
  | 'CLEARANCE_READY'
  | 'INSPECTION_PENDING'
  | 'INSPECTION_PASSED'
  | 'FINANCING_APPROVED'
  | 'FUNDS_SECURED'
  | 'SHIPMENT_RELEASED'
  | 'IN_TRANSIT'
  | 'PORT_VERIFICATION'
  | 'RELEASE_ELIGIBLE'
  | 'FUNDS_RELEASED'
  | 'SETTLED'
  | 'COMPLETED'
  | 'COMPLIANCE_FAILED'
  | 'INSPECTION_FAILED'
  | 'FINANCE_DECLINED'
  | 'PAYMENT_EXCEPTION'
  | 'SHIPMENT_EXCEPTION'
  | 'DISPUTED'
  | 'CANCELLED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ClearanceScore = {
  total: number;
  exporterVerification: number;
  buyerVerification: number;
  commodityDocumentation: number;
  labCOA: number;
  phytosanitary: number;
  originDocumentation: number;
  saudiImportReadiness: number;
  contractCompleteness: number;
  inspectionReadiness: number;
};

export type Buyer = {
  id: string;
  legalName: string;
  tradingName: string;
  saudiRegistration: string;
  address: string;
  city: string;
  website: string;
  industry: string;
  buyerCategory: string;
  annualProcurementVolume: string;
  directors: { name: string; role: string; nationality: string }[];
  ubos: { name: string; ownership: number }[];
  bankReferences: string[];
  estimatedPurchasingCapacity: string;
  creditProfile: string;
  commodities: string[];
  requiredVolume: string;
  qualitySpecs: string;
  deliveryLocations: string[];
  incoterms: string[];
  paymentTerms: string;
  verificationStatus: string;
  verificationDate: string;
  riskScore: number;
  createdAt: string;
};

export type Exporter = {
  id: string;
  legalName: string;
  tradingName: string;
  cacNumber: string;
  nepcNumber: string;
  exportLicenseStatus: string;
  directors: { name: string; role: string }[];
  bankName: string;
  bankAccount: string;
  exportHistory: string;
  warehouses: string[];
  processingFacilities: string[];
  commodityCategories: string[];
  sesameGrade: string;
  sesameOrigin: string;
  availableQuantity: string;
  harvestSeason: string;
  moisture: string;
  purity: string;
  foreignMatter: string;
  aflatoxinStatus: string;
  packaging: string;
  trustScore: number;
  verificationStatus: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  masarId: string;
  buyerId: string;
  exporterId: string;
  commodity: string;
  quantity: string;
  contractValue: number;
  currency: string;
  incoterm: string;
  destination: string;
  origin: string;
  status: TransactionStatus;
  riskLevel: RiskLevel;
  clearanceScore: ClearanceScore;
  createdAt: string;
  updatedAt: string;
  expectedCompletion: string;
  timeline: { stage: string; completed: boolean; date?: string; note?: string }[];
  exceptions: { type: string; severity: string; description: string; assignedTo: string; deadline: string }[];
};

export type Document = {
  id: string;
  transactionId: string;
  type: string;
  issuingOrganization: string;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  owner: string;
  verificationStatus: string;
  verifier?: string;
  verificationDate?: string;
  hash: string;
  version: number;
};

export type Inspection = {
  id: string;
  transactionId: string;
  inspectorName: string;
  scheduledDate: string;
  completedDate?: string;
  status: string;
  result?: string;
  testResults?: { parameter: string; value: string; threshold: string; status: string }[];
  notes?: string;
};

export type Shipment = {
  id: string;
  transactionId: string;
  containerNumber: string;
  vessel: string;
  booking: string;
  portOfOrigin: string;
  destination: string;
  etd: string;
  eta: string;
  status: string;
  customsStatus: string;
  portInspection: string;
  exceptions: string[];
};

export type FinanceRequest = {
  id: string;
  transactionId: string;
  invoiceValue: number;
  requestedAdvance: number;
  requestedAmount: number;
  status: string;
  capitalPartner: string;
  submittedDate: string;
  approvedDate?: string;
  interestRate?: number;
  tenor?: number;
};

export type AuditEvent = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
};

// ============================================================
// MOCK DATA
// ============================================================

export const buyers: Buyer[] = [
  {
    id: 'buyer-001',
    legalName: 'Al Rajhi Food Industries Co.',
    tradingName: 'Al Rajhi Foods',
    saudiRegistration: 'CR-1010123456',
    address: 'King Fahd Road, Riyadh 12345, Saudi Arabia',
    city: 'Riyadh',
    website: 'alrajhifoods.sa',
    industry: 'Food Processing',
    buyerCategory: 'Food Manufacturer',
    annualProcurementVolume: '$15,000,000',
    directors: [
      { name: 'Mohammed Al Rajhi', role: 'CEO', nationality: 'Saudi' },
      { name: 'Abdullah Al Rajhi', role: 'CFO', nationality: 'Saudi' },
    ],
    ubos: [{ name: 'Al Rajhi Family Holdings', ownership: 100 }],
    bankReferences: ['Al Rajhi Bank', 'Saudi National Bank'],
    estimatedPurchasingCapacity: '$20,000,000/year',
    creditProfile: 'Excellent',
    commodities: ['Sesame', 'Cashew', 'Shea Butter'],
    requiredVolume: '2,000 MT/year',
    qualitySpecs: 'Premium grade, <2% moisture, <1% foreign matter',
    deliveryLocations: ['Riyadh', 'Jeddah'],
    incoterms: ['CIF', 'CFR'],
    paymentTerms: 'Escrow, 30 days after delivery',
    verificationStatus: 'APPROVED',
    verificationDate: '2026-07-15',
    riskScore: 92,
    createdAt: '2026-06-01',
  },
  {
    id: 'buyer-002',
    legalName: 'Saudi Gulf Trading Est.',
    tradingName: 'SGT Foods',
    saudiRegistration: 'CR-1010789012',
    address: 'Industrial Area, Dammam 31491, Saudi Arabia',
    city: 'Dammam',
    website: 'sgtfoods.sa',
    industry: 'Commodity Trading',
    buyerCategory: 'Commodity Importer',
    annualProcurementVolume: '$8,000,000',
    directors: [
      { name: 'Khalid Al-Otaibi', role: 'Managing Director', nationality: 'Saudi' },
    ],
    ubos: [{ name: 'Khalid Al-Otaibi', ownership: 70 }, { name: 'Gulf Partners LLC', ownership: 30 }],
    bankReferences: ['Saudi British Bank', 'Riyad Bank'],
    estimatedPurchasingCapacity: '$12,000,000/year',
    creditProfile: 'Good',
    commodities: ['Sesame', 'Soybean', 'Groundnut'],
    requiredVolume: '1,500 MT/year',
    qualitySpecs: 'Standard grade, <3% moisture',
    deliveryLocations: ['Dammam', 'Jubail'],
    incoterms: ['CIF', 'FOB'],
    paymentTerms: 'Escrow, 45 days after delivery',
    verificationStatus: 'APPROVED',
    verificationDate: '2026-07-20',
    riskScore: 85,
    createdAt: '2026-06-15',
  },
  {
    id: 'buyer-003',
    legalName: 'Jeddah Premium Foods LLC',
    tradingName: 'JPF',
    saudiRegistration: 'CR-1010456789',
    address: 'Corniche Road, Jeddah 21432, Saudi Arabia',
    city: 'Jeddah',
    website: 'jpf.sa',
    industry: 'Food Distribution',
    buyerCategory: 'Distributor',
    annualProcurementVolume: '$5,000,000',
    directors: [
      { name: 'Faisal Al-Harbi', role: 'CEO', nationality: 'Saudi' },
      { name: 'Nasser Al-Harbi', role: 'COO', nationality: 'Saudi' },
    ],
    ubos: [{ name: 'Al-Harbi Family', ownership: 100 }],
    bankReferences: ['Alinma Bank'],
    estimatedPurchasingCapacity: '$7,000,000/year',
    creditProfile: 'Good',
    commodities: ['Sesame', 'Hibiscus'],
    requiredVolume: '800 MT/year',
    qualitySpecs: 'Premium grade for retail packaging',
    deliveryLocations: ['Jeddah'],
    incoterms: ['CIF'],
    paymentTerms: 'Escrow, 30 days after delivery',
    verificationStatus: 'KYB_REVIEW',
    verificationDate: '',
    riskScore: 0,
    createdAt: '2026-08-01',
  },
];

export const exporters: Exporter[] = [
  {
    id: 'exp-001',
    legalName: 'Dangote Agro Sesame Export Ltd.',
    tradingName: 'Dangote Sesame',
    cacNumber: 'RC-1234567',
    nepcNumber: 'NEPC/EXP/2024/001234',
    exportLicenseStatus: 'Active',
    directors: [
      { name: 'Aliko Dangote Jr.', role: 'Managing Director' },
      { name: 'Fatima Bello', role: 'Director of Operations' },
    ],
    bankName: 'Zenith Bank',
    bankAccount: '1234567890',
    exportHistory: '15 shipments to Middle East, 8 to Europe',
    warehouses: ['Lagos Warehouse', 'Kano Processing Center'],
    processingFacilities: ['Cleaning Plant Lagos', 'Sorting Facility Kano'],
    commodityCategories: ['Sesame', 'Cashew', 'Cocoa'],
    sesameGrade: 'Premium Hulled',
    sesameOrigin: 'Kano, Kaduna',
    availableQuantity: '3,000 MT',
    harvestSeason: 'Oct-Dec 2026',
    moisture: '1.8%',
    purity: '99.5%',
    foreignMatter: '0.3%',
    aflatoxinStatus: 'Below 4 ppb',
    packaging: '50kg PP bags, container-worthy',
    trustScore: 94,
    verificationStatus: 'APPROVED',
    createdAt: '2026-05-15',
  },
  {
    id: 'exp-002',
    legalName: 'Nigerian Premium Grains Ltd.',
    tradingName: 'NPG Exports',
    cacNumber: 'RC-7654321',
    nepcNumber: 'NEPC/EXP/2023/005678',
    exportLicenseStatus: 'Active',
    directors: [
      { name: 'Chukwuemeka Okafor', role: 'CEO' },
      { name: 'Amina Mohammed', role: 'Head of Compliance' },
    ],
    bankName: 'Access Bank',
    bankAccount: '0987654321',
    exportHistory: '8 shipments to Asia, 3 to Middle East',
    warehouses: ['Abuja Central Warehouse'],
    processingFacilities: ['Processing Plant Abuja'],
    commodityCategories: ['Sesame', 'Soybean', 'Groundnut'],
    sesameGrade: 'Standard Natural',
    sesameOrigin: 'Benue, Nasarawa',
    availableQuantity: '1,500 MT',
    harvestSeason: 'Nov-Jan 2027',
    moisture: '2.5%',
    purity: '98.8%',
    foreignMatter: '0.8%',
    aflatoxinStatus: 'Below 8 ppb',
    packaging: '25kg & 50kg PP bags',
    trustScore: 78,
    verificationStatus: 'APPROVED',
    createdAt: '2026-06-01',
  },
  {
    id: 'exp-003',
    legalName: 'Kano Sesame Cooperative Export Union',
    tradingName: 'Kano Sesame Union',
    cacNumber: 'RC-9876543',
    nepcNumber: 'NEPC/EXP/2026/009012',
    exportLicenseStatus: 'Provisional',
    directors: [
      { name: 'Ibrahim Musa', role: 'President' },
      { name: 'Hauwa Abdullahi', role: 'Secretary' },
    ],
    bankName: 'First Bank',
    bankAccount: '1122334455',
    exportHistory: 'First export attempt',
    warehouses: ['Kano Union Warehouse'],
    processingFacilities: ['Basic Cleaning Facility'],
    commodityCategories: ['Sesame'],
    sesameGrade: 'Natural',
    sesameOrigin: 'Kano',
    availableQuantity: '500 MT',
    harvestSeason: 'Oct-Dec 2026',
    moisture: '3.0%',
    purity: '97.5%',
    foreignMatter: '1.2%',
    aflatoxinStatus: 'Below 10 ppb',
    packaging: '50kg PP bags',
    trustScore: 45,
    verificationStatus: 'PENDING_DOCUMENTS',
    createdAt: '2026-08-10',
  },
];

export const transactions: Transaction[] = [
  {
    id: 'txn-001',
    masarId: 'MASAR-SES-2026-000001',
    buyerId: 'buyer-001',
    exporterId: 'exp-001',
    commodity: 'Premium Hulled Sesame',
    quantity: '1,000 MT',
    contractValue: 1850000,
    currency: 'USD',
    incoterm: 'CIF Jeddah',
    destination: 'Jeddah, Saudi Arabia',
    origin: 'Lagos, Nigeria',
    status: 'IN_TRANSIT',
    riskLevel: 'LOW',
    clearanceScore: {
      total: 94,
      exporterVerification: 15,
      buyerVerification: 10,
      commodityDocumentation: 14,
      labCOA: 15,
      phytosanitary: 10,
      originDocumentation: 10,
      saudiImportReadiness: 14,
      contractCompleteness: 5,
      inspectionReadiness: 5,
    },
    createdAt: '2026-07-01',
    updatedAt: '2026-08-20',
    expectedCompletion: '2026-09-15',
    timeline: [
      { stage: 'Lead Created', completed: true, date: '2026-07-01' },
      { stage: 'Buyer Verified', completed: true, date: '2026-07-05' },
      { stage: 'Exporter Verified', completed: true, date: '2026-07-08' },
      { stage: 'RFQ Created', completed: true, date: '2026-07-10' },
      { stage: 'Commercial Match', completed: true, date: '2026-07-15' },
      { stage: 'Contract Signed', completed: true, date: '2026-07-20' },
      { stage: 'Compliance Complete', completed: true, date: '2026-07-28' },
      { stage: 'Inspection Passed', completed: true, date: '2026-08-05' },
      { stage: 'Financing Approved', completed: true, date: '2026-08-10' },
      { stage: 'Escrow Funded', completed: true, date: '2026-08-12' },
      { stage: 'Shipment Released', completed: true, date: '2026-08-15' },
      { stage: 'In Transit', completed: true, date: '2026-08-18' },
      { stage: 'Port Verification', completed: false },
      { stage: 'Release', completed: false },
      { stage: 'Settlement', completed: false },
    ],
    exceptions: [],
  },
  {
    id: 'txn-002',
    masarId: 'MASAR-SES-2026-000002',
    buyerId: 'buyer-002',
    exporterId: 'exp-001',
    commodity: 'Premium Hulled Sesame',
    quantity: '500 MT',
    contractValue: 925000,
    currency: 'USD',
    incoterm: 'CIF Dammam',
    destination: 'Dammam, Saudi Arabia',
    origin: 'Kano, Nigeria',
    status: 'INSPECTION_PENDING',
    riskLevel: 'MEDIUM',
    clearanceScore: {
      total: 72,
      exporterVerification: 15,
      buyerVerification: 10,
      commodityDocumentation: 12,
      labCOA: 8,
      phytosanitary: 10,
      originDocumentation: 8,
      saudiImportReadiness: 10,
      contractCompleteness: 5,
      inspectionReadiness: 4,
    },
    createdAt: '2026-08-01',
    updatedAt: '2026-08-22',
    expectedCompletion: '2026-10-01',
    timeline: [
      { stage: 'Lead Created', completed: true, date: '2026-08-01' },
      { stage: 'Buyer Verified', completed: true, date: '2026-08-03' },
      { stage: 'Exporter Verified', completed: true, date: '2026-08-05' },
      { stage: 'RFQ Created', completed: true, date: '2026-08-06' },
      { stage: 'Commercial Match', completed: true, date: '2026-08-10' },
      { stage: 'Contract Signed', completed: true, date: '2026-08-14' },
      { stage: 'Compliance Complete', completed: true, date: '2026-08-20' },
      { stage: 'Inspection', completed: false },
      { stage: 'Financing', completed: false },
      { stage: 'Escrow', completed: false },
      { stage: 'Shipment', completed: false },
      { stage: 'Port Verification', completed: false },
      { stage: 'Release', completed: false },
      { stage: 'Settlement', completed: false },
    ],
    exceptions: [
      {
        type: 'COMPLIANCE',
        severity: 'WARNING',
        description: 'Phytosanitary certificate expires in 5 days',
        assignedTo: 'Compliance Officer',
        deadline: '2026-08-27',
      },
    ],
  },
  {
    id: 'txn-003',
    masarId: 'MASAR-SES-2026-000003',
    buyerId: 'buyer-001',
    exporterId: 'exp-002',
    commodity: 'Standard Natural Sesame',
    quantity: '750 MT',
    contractValue: 1125000,
    currency: 'USD',
    incoterm: 'CFR Riyadh',
    destination: 'Riyadh, Saudi Arabia',
    origin: 'Abuja, Nigeria',
    status: 'COMPLIANCE_IN_PROGRESS',
    riskLevel: 'MEDIUM',
    clearanceScore: {
      total: 58,
      exporterVerification: 12,
      buyerVerification: 10,
      commodityDocumentation: 10,
      labCOA: 5,
      phytosanitary: 8,
      originDocumentation: 5,
      saudiImportReadiness: 5,
      contractCompleteness: 5,
      inspectionReadiness: 3,
    },
    createdAt: '2026-08-10',
    updatedAt: '2026-08-23',
    expectedCompletion: '2026-10-20',
    timeline: [
      { stage: 'Lead Created', completed: true, date: '2026-08-10' },
      { stage: 'Buyer Verified', completed: true, date: '2026-08-12' },
      { stage: 'Exporter Verified', completed: true, date: '2026-08-14' },
      { stage: 'RFQ Created', completed: true, date: '2026-08-15' },
      { stage: 'Commercial Match', completed: true, date: '2026-08-18' },
      { stage: 'Contract Signed', completed: true, date: '2026-08-22' },
      { stage: 'Compliance', completed: false },
      { stage: 'Inspection', completed: false },
      { stage: 'Financing', completed: false },
      { stage: 'Escrow', completed: false },
      { stage: 'Shipment', completed: false },
      { stage: 'Port Verification', completed: false },
      { stage: 'Release', completed: false },
      { stage: 'Settlement', completed: false },
    ],
    exceptions: [
      {
        type: 'DOCUMENT',
        severity: 'HIGH',
        description: 'Laboratory COA not yet received',
        assignedTo: 'Nigeria Operations',
        deadline: '2026-08-28',
      },
      {
        type: 'COMPLIANCE',
        severity: 'WARNING',
        description: 'SFDA product registration pending',
        assignedTo: 'Compliance Officer',
        deadline: '2026-09-05',
      },
    ],
  },
  {
    id: 'txn-004',
    masarId: 'MASAR-SES-2026-000004',
    buyerId: 'buyer-002',
    exporterId: 'exp-001',
    commodity: 'Premium Hulled Sesame',
    quantity: '2,000 MT',
    contractValue: 3700000,
    currency: 'USD',
    incoterm: 'CIF Jeddah',
    destination: 'Jeddah, Saudi Arabia',
    origin: 'Lagos, Nigeria',
    status: 'CONTRACT_EXECUTED',
    riskLevel: 'LOW',
    clearanceScore: {
      total: 42,
      exporterVerification: 15,
      buyerVerification: 10,
      commodityDocumentation: 5,
      labCOA: 0,
      phytosanitary: 0,
      originDocumentation: 5,
      saudiImportReadiness: 5,
      contractCompleteness: 5,
      inspectionReadiness: 2,
    },
    createdAt: '2026-08-15',
    updatedAt: '2026-08-23',
    expectedCompletion: '2026-11-15',
    timeline: [
      { stage: 'Lead Created', completed: true, date: '2026-08-15' },
      { stage: 'Buyer Verified', completed: true, date: '2026-08-17' },
      { stage: 'Exporter Verified', completed: true, date: '2026-08-19' },
      { stage: 'RFQ Created', completed: true, date: '2026-08-20' },
      { stage: 'Commercial Match', completed: true, date: '2026-08-22' },
      { stage: 'Contract Signed', completed: true, date: '2026-08-23' },
      { stage: 'Compliance', completed: false },
      { stage: 'Inspection', completed: false },
      { stage: 'Financing', completed: false },
      { stage: 'Escrow', completed: false },
      { stage: 'Shipment', completed: false },
      { stage: 'Port Verification', completed: false },
      { stage: 'Release', completed: false },
      { stage: 'Settlement', completed: false },
    ],
    exceptions: [],
  },
  {
    id: 'txn-005',
    masarId: 'MASAR-SES-2026-000005',
    buyerId: 'buyer-001',
    exporterId: 'exp-001',
    commodity: 'Premium Hulled Sesame',
    quantity: '1,500 MT',
    contractValue: 2775000,
    currency: 'USD',
    incoterm: 'CIF Jeddah',
    destination: 'Jeddah, Saudi Arabia',
    origin: 'Lagos, Nigeria',
    status: 'COMPLETED',
    riskLevel: 'LOW',
    clearanceScore: {
      total: 97,
      exporterVerification: 15,
      buyerVerification: 10,
      commodityDocumentation: 15,
      labCOA: 15,
      phytosanitary: 10,
      originDocumentation: 10,
      saudiImportReadiness: 15,
      contractCompleteness: 5,
      inspectionReadiness: 5,
    },
    createdAt: '2026-05-01',
    updatedAt: '2026-07-28',
    expectedCompletion: '2026-07-28',
    timeline: [
      { stage: 'Lead Created', completed: true, date: '2026-05-01' },
      { stage: 'Buyer Verified', completed: true, date: '2026-05-05' },
      { stage: 'Exporter Verified', completed: true, date: '2026-05-08' },
      { stage: 'RFQ Created', completed: true, date: '2026-05-10' },
      { stage: 'Commercial Match', completed: true, date: '2026-05-15' },
      { stage: 'Contract Signed', completed: true, date: '2026-05-20' },
      { stage: 'Compliance Complete', completed: true, date: '2026-05-30' },
      { stage: 'Inspection Passed', completed: true, date: '2026-06-05' },
      { stage: 'Financing Approved', completed: true, date: '2026-06-10' },
      { stage: 'Escrow Funded', completed: true, date: '2026-06-12' },
      { stage: 'Shipment Released', completed: true, date: '2026-06-15' },
      { stage: 'In Transit', completed: true, date: '2026-06-18' },
      { stage: 'Port Verification', completed: true, date: '2026-07-05' },
      { stage: 'Release', completed: true, date: '2026-07-10' },
      { stage: 'Settlement', completed: true, date: '2026-07-28' },
    ],
    exceptions: [],
  },
  {
    id: 'txn-006',
    masarId: 'MASAR-SES-2026-000006',
    buyerId: 'buyer-002',
    exporterId: 'exp-002',
    commodity: 'Standard Natural Sesame',
    quantity: '300 MT',
    contractValue: 420000,
    currency: 'USD',
    incoterm: 'FOB Lagos',
    destination: 'Dammam, Saudi Arabia',
    origin: 'Lagos, Nigeria',
    status: 'INSPECTION_FAILED',
    riskLevel: 'CRITICAL',
    clearanceScore: {
      total: 35,
      exporterVerification: 12,
      buyerVerification: 10,
      commodityDocumentation: 8,
      labCOA: 0,
      phytosanitary: 5,
      originDocumentation: 0,
      saudiImportReadiness: 0,
      contractCompleteness: 0,
      inspectionReadiness: 0,
    },
    createdAt: '2026-07-15',
    updatedAt: '2026-08-10',
    expectedCompletion: '2026-09-15',
    timeline: [
      { stage: 'Lead Created', completed: true, date: '2026-07-15' },
      { stage: 'Buyer Verified', completed: true, date: '2026-07-18' },
      { stage: 'Exporter Verified', completed: true, date: '2026-07-20' },
      { stage: 'RFQ Created', completed: true, date: '2026-07-22' },
      { stage: 'Commercial Match', completed: true, date: '2026-07-25' },
      { stage: 'Contract Signed', completed: true, date: '2026-07-30' },
      { stage: 'Compliance Complete', completed: true, date: '2026-08-05' },
      { stage: 'Inspection Failed', completed: false, note: 'Aflatoxin above threshold' },
    ],
    exceptions: [
      {
        type: 'INSPECTION',
        severity: 'CRITICAL',
        description: 'Aflatoxin result 18 ppb - exceeds 10 ppb contractual threshold',
        assignedTo: 'Operations + Compliance',
        deadline: '2026-08-25',
      },
    ],
  },
];

export const documents: Document[] = [
  {
    id: 'doc-001',
    transactionId: 'txn-001',
    type: 'Certificate of Origin',
    issuingOrganization: 'Nigerian Export Promotion Council',
    documentNumber: 'NEPC/CO/2026/1234',
    issueDate: '2026-07-25',
    expiryDate: '2027-01-25',
    owner: 'exp-001',
    verificationStatus: 'VERIFIED',
    verifier: 'Compliance Officer',
    verificationDate: '2026-07-26',
    hash: 'sha256:a1b2c3d4e5f6...',
    version: 1,
  },
  {
    id: 'doc-002',
    transactionId: 'txn-001',
    type: 'Phytosanitary Certificate',
    issuingOrganization: 'NAQS Nigeria',
    documentNumber: 'NAQS/PHY/2026/5678',
    issueDate: '2026-07-28',
    expiryDate: '2026-10-28',
    owner: 'exp-001',
    verificationStatus: 'VERIFIED',
    verifier: 'Compliance Officer',
    verificationDate: '2026-07-29',
    hash: 'sha256:b2c3d4e5f6g7...',
    version: 1,
  },
  {
    id: 'doc-003',
    transactionId: 'txn-001',
    type: 'Commercial Invoice',
    issuingOrganization: 'Dangote Agro Sesame Export Ltd.',
    documentNumber: 'INV/2026/001',
    issueDate: '2026-07-20',
    expiryDate: '',
    owner: 'exp-001',
    verificationStatus: 'VERIFIED',
    verifier: 'Operations Manager',
    verificationDate: '2026-07-21',
    hash: 'sha256:c3d4e5f6g7h8...',
    version: 1,
  },
  {
    id: 'doc-004',
    transactionId: 'txn-001',
    type: 'Laboratory COA',
    issuingOrganization: 'SGS Nigeria',
    documentNumber: 'SGS/COA/2026/9012',
    issueDate: '2026-08-02',
    expiryDate: '2027-02-02',
    owner: 'exp-001',
    verificationStatus: 'VERIFIED',
    verifier: 'Compliance Officer',
    verificationDate: '2026-08-03',
    hash: 'sha256:d4e5f6g7h8i9...',
    version: 1,
  },
  {
    id: 'doc-005',
    transactionId: 'txn-001',
    type: 'Packing List',
    issuingOrganization: 'Dangote Agro Sesame Export Ltd.',
    documentNumber: 'PL/2026/001',
    issueDate: '2026-08-10',
    expiryDate: '',
    owner: 'exp-001',
    verificationStatus: 'VERIFIED',
    verifier: 'Operations Manager',
    verificationDate: '2026-08-11',
    hash: 'sha256:e5f6g7h8i9j0...',
    version: 1,
  },
  {
    id: 'doc-006',
    transactionId: 'txn-002',
    type: 'Certificate of Origin',
    issuingOrganization: 'Nigerian Export Promotion Council',
    documentNumber: 'NEPC/CO/2026/5678',
    issueDate: '2026-08-10',
    expiryDate: '2027-02-10',
    owner: 'exp-001',
    verificationStatus: 'VERIFIED',
    verifier: 'Compliance Officer',
    verificationDate: '2026-08-11',
    hash: 'sha256:f6g7h8i9j0k1...',
    version: 1,
  },
  {
    id: 'doc-007',
    transactionId: 'txn-002',
    type: 'Phytosanitary Certificate',
    issuingOrganization: 'NAQS Nigeria',
    documentNumber: 'NAQS/PHY/2026/9012',
    issueDate: '2026-08-12',
    expiryDate: '2026-08-27',
    owner: 'exp-001',
    verificationStatus: 'VERIFIED',
    verifier: 'Compliance Officer',
    verificationDate: '2026-08-13',
    hash: 'sha256:g7h8i9j0k1l2...',
    version: 1,
  },
];

export const inspections: Inspection[] = [
  {
    id: 'insp-001',
    transactionId: 'txn-001',
    inspectorName: 'SGS Nigeria',
    scheduledDate: '2026-08-01',
    completedDate: '2026-08-05',
    status: 'COMPLETED',
    result: 'PASS',
    testResults: [
      { parameter: 'Moisture', value: '1.8%', threshold: '<3%', status: 'PASS' },
      { parameter: 'Purity', value: '99.5%', threshold: '>98%', status: 'PASS' },
      { parameter: 'Foreign Matter', value: '0.3%', threshold: '<1%', status: 'PASS' },
      { parameter: 'Aflatoxin', value: '3.2 ppb', threshold: '<10 ppb', status: 'PASS' },
      { parameter: 'Weight', value: '1,002 MT', threshold: '1,000 MT ±2%', status: 'PASS' },
      { parameter: 'Packaging', value: 'Good', threshold: 'Container-worthy', status: 'PASS' },
      { parameter: 'Container Condition', value: 'Clean & Dry', threshold: 'No contamination', status: 'PASS' },
    ],
    notes: 'All parameters within specification. Recommended for release.',
  },
  {
    id: 'insp-002',
    transactionId: 'txn-002',
    inspectorName: 'Bureau Veritas Nigeria',
    scheduledDate: '2026-08-25',
    status: 'SCHEDULED',
  },
  {
    id: 'insp-003',
    transactionId: 'txn-006',
    inspectorName: 'SGS Nigeria',
    scheduledDate: '2026-08-05',
    completedDate: '2026-08-08',
    status: 'COMPLETED',
    result: 'FAIL',
    testResults: [
      { parameter: 'Moisture', value: '2.5%', threshold: '<3%', status: 'PASS' },
      { parameter: 'Purity', value: '98.2%', threshold: '>98%', status: 'PASS' },
      { parameter: 'Foreign Matter', value: '0.8%', threshold: '<1%', status: 'PASS' },
      { parameter: 'Aflatoxin', value: '18 ppb', threshold: '<10 ppb', status: 'FAIL' },
      { parameter: 'Weight', value: '301 MT', threshold: '300 MT ±2%', status: 'PASS' },
      { parameter: 'Packaging', value: 'Acceptable', threshold: 'Container-worthy', status: 'PASS' },
      { parameter: 'Container Condition', value: 'Clean', threshold: 'No contamination', status: 'PASS' },
    ],
    notes: 'CRITICAL: Aflatoxin level 18 ppb exceeds contractual threshold of 10 ppb. Shipment cannot proceed.',
  },
];

export const shipments: Shipment[] = [
  {
    id: 'ship-001',
    transactionId: 'txn-001',
    containerNumber: 'MSCU-1234567',
    vessel: 'MSC Aurora',
    booking: 'MSC/NGA/2026/001',
    portOfOrigin: 'Apapa Port, Lagos',
    destination: 'Jeddah Islamic Port',
    etd: '2026-08-18',
    eta: '2026-09-05',
    status: 'IN_TRANSIT',
    customsStatus: 'PENDING',
    portInspection: 'NOT_STARTED',
    exceptions: [],
  },
];

export const financeRequests: FinanceRequest[] = [
  {
    id: 'fin-001',
    transactionId: 'txn-001',
    invoiceValue: 1850000,
    requestedAdvance: 80,
    requestedAmount: 1480000,
    status: 'APPROVED',
    capitalPartner: 'Afreximbank',
    submittedDate: '2026-08-08',
    approvedDate: '2026-08-10',
    interestRate: 8.5,
    tenor: 90,
  },
  {
    id: 'fin-002',
    transactionId: 'txn-002',
    invoiceValue: 925000,
    requestedAdvance: 75,
    requestedAmount: 693750,
    status: 'PENDING',
    capitalPartner: 'Afreximbank',
    submittedDate: '2026-08-20',
  },
];

export const auditEvents: AuditEvent[] = [
  {
    id: 'audit-001',
    timestamp: '2026-08-23T14:30:00Z',
    userId: 'user-001',
    userName: 'Ahmed Hassan',
    userRole: 'Compliance Officer',
    action: 'DOCUMENT_VERIFIED',
    entityType: 'Document',
    entityId: 'doc-006',
    details: 'Certificate of Origin verified for MASAR-SES-2026-000002',
    ipAddress: '102.89.44.12',
  },
  {
    id: 'audit-002',
    timestamp: '2026-08-23T13:15:00Z',
    userId: 'user-002',
    userName: 'Fatima Bello',
    userRole: 'Operations Manager',
    action: 'STATUS_CHANGE',
    entityType: 'Transaction',
    entityId: 'txn-004',
    details: 'Transaction MASAR-SES-2026-000004 moved to CONTRACT_EXECUTED',
    ipAddress: '102.89.44.15',
  },
  {
    id: 'audit-003',
    timestamp: '2026-08-23T11:45:00Z',
    userId: 'user-003',
    userName: 'Ibrahim Musa',
    userRole: 'Nigeria Origin Manager',
    action: 'DOCUMENT_UPLOADED',
    entityType: 'Document',
    entityId: 'doc-007',
    details: 'Phytosanitary Certificate uploaded for MASAR-SES-2026-000002',
    ipAddress: '102.89.44.20',
  },
  {
    id: 'audit-004',
    timestamp: '2026-08-22T16:00:00Z',
    userId: 'user-001',
    userName: 'Ahmed Hassan',
    userRole: 'Compliance Officer',
    action: 'KYB_APPROVED',
    entityType: 'Buyer',
    entityId: 'buyer-002',
    details: 'KYB approved for Saudi Gulf Trading Est.',
    ipAddress: '102.89.44.12',
  },
  {
    id: 'audit-005',
    timestamp: '2026-08-22T10:30:00Z',
    userId: 'user-004',
    userName: 'Oluwaseun Adeyemi',
    userRole: 'Finance Manager',
    action: 'FINANCE_APPROVED',
    entityType: 'FinanceRequest',
    entityId: 'fin-001',
    details: 'Finance request approved for MASAR-SES-2026-000001 - $1,480,000',
    ipAddress: '102.89.44.25',
  },
  {
    id: 'audit-006',
    timestamp: '2026-08-21T09:00:00Z',
    userId: 'user-005',
    userName: 'System',
    userRole: 'System',
    action: 'ALERT_GENERATED',
    entityType: 'Transaction',
    entityId: 'txn-006',
    details: 'CRITICAL: Aflatoxin inspection failure for MASAR-SES-2026-000006',
    ipAddress: 'system',
  },
  {
    id: 'audit-007',
    timestamp: '2026-08-20T14:00:00Z',
    userId: 'user-002',
    userName: 'Fatima Bello',
    userRole: 'Operations Manager',
    action: 'CONTRACT_APPROVED',
    entityType: 'Transaction',
    entityId: 'txn-003',
    details: 'Contract executed for MASAR-SES-2026-000003',
    ipAddress: '102.89.44.15',
  },
  {
    id: 'audit-008',
    timestamp: '2026-08-19T11:00:00Z',
    userId: 'user-003',
    userName: 'Ibrahim Musa',
    userRole: 'Nigeria Origin Manager',
    action: 'INSPECTION_SCHEDULED',
    entityType: 'Inspection',
    entityId: 'insp-002',
    details: 'Inspection scheduled with Bureau Veritas for MASAR-SES-2026-000002',
    ipAddress: '102.89.44.20',
  },
];

// Helper functions
export function getBuyerById(id: string): Buyer | undefined {
  return buyers.find(b => b.id === id);
}

export function getExporterById(id: string): Exporter | undefined {
  return exporters.find(e => e.id === id);
}

export function getTransactionById(id: string): Transaction | undefined {
  return transactions.find(t => t.id === id);
}

export function getDocumentsByTransaction(transactionId: string): Document[] {
  return documents.filter(d => d.transactionId === transactionId);
}

export function getInspectionsByTransaction(transactionId: string): Inspection[] {
  return inspections.filter(i => i.transactionId === transactionId);
}

export function getShipmentsByTransaction(transactionId: string): Shipment[] {
  return shipments.filter(s => s.transactionId === transactionId);
}

export function getFinanceByTransaction(transactionId: string): FinanceRequest | undefined {
  return financeRequests.find(f => f.transactionId === transactionId);
}

export function getClearanceScoreLabel(score: number): string {
  if (score >= 90) return 'READY';
  if (score >= 75) return 'CONDITIONAL';
  if (score >= 50) return 'AT RISK';
  return 'NOT READY';
}

export function getClearanceScoreColor(score: number): string {
  if (score >= 90) return 'text-green-700 bg-green-100';
  if (score >= 75) return 'text-yellow-700 bg-yellow-100';
  if (score >= 50) return 'text-orange-700 bg-orange-100';
  return 'text-red-700 bg-red-100';
}

export function getStatusColor(status: TransactionStatus): string {
  const completed = ['COMPLETED', 'SETTLED'];
  const active = ['IN_TRANSIT', 'SHIPMENT_RELEASED', 'RELEASE_ELIGIBLE', 'FUNDS_RELEASED', 'PORT_VERIFICATION'];
  const progress = ['COMPLIANCE_IN_PROGRESS', 'CLEARANCE_READY', 'INSPECTION_PENDING', 'INSPECTION_PASSED', 'FINANCING_APPROVED', 'FUNDS_SECURED', 'CONTRACT_EXECUTED', 'COMMERCIAL_AGREEMENT', 'COUNTERPARTIES_VERIFIED', 'RFQ_OPEN'];
  const failed = ['COMPLIANCE_FAILED', 'INSPECTION_FAILED', 'FINANCE_DECLINED', 'PAYMENT_EXCEPTION', 'SHIPMENT_EXCEPTION', 'DISPUTED', 'CANCELLED'];

  if (completed.includes(status)) return 'bg-green-100 text-green-800';
  if (active.includes(status)) return 'bg-blue-100 text-blue-800';
  if (progress.includes(status)) return 'bg-yellow-100 text-yellow-800';
  if (failed.includes(status)) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'bg-green-100 text-green-800';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
    case 'HIGH': return 'bg-orange-100 text-orange-800';
    case 'CRITICAL': return 'bg-red-100 text-red-800';
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
