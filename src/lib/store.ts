// MASAR Global State Store
// Centralized state management for all portal data

import { useState, useCallback } from 'react';

// ============================================================
// TYPES
// ============================================================

export type TransactionStatus = 
  | 'DRAFT' | 'RFQ' | 'BUYER_VERIFIED' | 'EXPORTER_VERIFIED' | 'COMMERCIAL_MATCH'
  | 'CONTRACTING' | 'COMPLIANCE' | 'CLEARANCE_READY' | 'INSPECTION' | 'FINANCE'
  | 'FUNDS_SECURED' | 'SHIPMENT' | 'PORT_VERIFICATION' | 'RELEASE' | 'SETTLEMENT'
  | 'COMPLETED' | 'INSPECTION_FAILED' | 'COMPLIANCE_FAILED' | 'DISPUTED' | 'CANCELLED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Transaction {
  id: string;
  masarId: string;
  buyerName: string;
  buyerId: string;
  exporterName: string;
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
  clearanceScore: number;
  createdAt: string;
  updatedAt: string;
  expectedCompletion: string;
  currentStage: string;
  nextAction: string;
  assignedTo: string;
  timeline: TimelineStep[];
  exceptions: Exception[];
}

export interface TimelineStep {
  stage: string;
  completed: boolean;
  date?: string;
  actor?: string;
  note?: string;
}

export interface Exception {
  id: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING' | 'NORMAL';
  description: string;
  assignedTo: string;
  deadline: string;
  resolved: boolean;
}

export interface Buyer {
  id: string;
  legalName: string;
  tradingName: string;
  country: string;
  city: string;
  registration: string;
  category: string;
  annualVolume: string;
  riskScore: number;
  verificationStatus: string;
  transactionCount: number;
  totalGMV: number;
  directors: { name: string; role: string }[];
}

export interface Exporter {
  id: string;
  legalName: string;
  tradingName: string;
  country: string;
  cacNumber: string;
  nepcNumber: string;
  trustScore: number;
  availableCapacity: string;
  completedTransactions: number;
  inspectionPassRate: number;
  verificationStatus: string;
  commodity: string;
  grade: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTo: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  transactionId?: string;
  category: string;
}

export interface Notification {
  id: string;
  type: 'CRITICAL' | 'ACTION' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  transactionId?: string;
}

// ============================================================
// MOCK DATA
// ============================================================

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001', masarId: 'MASAR-SES-2026-000001',
    buyerName: 'Al Rajhi Foods', buyerId: 'buyer-001',
    exporterName: 'Dangote Sesame', exporterId: 'exp-001',
    commodity: 'Premium Hulled Sesame', quantity: '1,000 MT',
    contractValue: 500000, currency: 'USD', incoterm: 'CIF',
    destination: 'Jeddah, Saudi Arabia', origin: 'Lagos, Nigeria',
    status: 'IN_TRANSIT', riskLevel: 'LOW', clearanceScore: 94,
    createdAt: '2026-07-01', updatedAt: '2026-08-25',
    expectedCompletion: '2026-09-15', currentStage: 'Shipment',
    nextAction: 'Monitor vessel ETA', assignedTo: 'Operations',
    timeline: [
      { stage: 'Buyer Verified', completed: true, date: '2026-07-05', actor: 'Compliance Officer' },
      { stage: 'Exporter Verified', completed: true, date: '2026-07-08', actor: 'Origin Manager' },
      { stage: 'Contract Signed', completed: true, date: '2026-07-20', actor: 'Operations' },
      { stage: 'Compliance Complete', completed: true, date: '2026-07-28', actor: 'Compliance Officer' },
      { stage: 'Inspection Passed', completed: true, date: '2026-08-05', actor: 'SGS Nigeria' },
      { stage: 'Finance Approved', completed: true, date: '2026-08-10', actor: 'Afreximbank' },
      { stage: 'Escrow Funded', completed: true, date: '2026-08-12', actor: 'Finance Manager' },
      { stage: 'Shipment Released', completed: true, date: '2026-08-15', actor: 'Operations' },
      { stage: 'In Transit', completed: true, date: '2026-08-18', actor: 'System' },
      { stage: 'Port Verification', completed: false },
      { stage: 'Release', completed: false },
      { stage: 'Settlement', completed: false },
    ],
    exceptions: [],
  },
  {
    id: 'txn-002', masarId: 'MASAR-SES-2026-000002',
    buyerName: 'SGT Foods', buyerId: 'buyer-002',
    exporterName: 'Dangote Sesame', exporterId: 'exp-001',
    commodity: 'Premium Hulled Sesame', quantity: '500 MT',
    contractValue: 250000, currency: 'USD', incoterm: 'CIF',
    destination: 'Dammam, Saudi Arabia', origin: 'Kano, Nigeria',
    status: 'INSPECTION', riskLevel: 'MEDIUM', clearanceScore: 72,
    createdAt: '2026-08-01', updatedAt: '2026-08-25',
    expectedCompletion: '2026-10-01', currentStage: 'Inspection',
    nextAction: 'Review inspection certificate', assignedTo: 'Compliance Officer',
    timeline: [
      { stage: 'Buyer Verified', completed: true, date: '2026-08-03' },
      { stage: 'Exporter Verified', completed: true, date: '2026-08-05' },
      { stage: 'Contract Signed', completed: true, date: '2026-08-14' },
      { stage: 'Compliance Complete', completed: true, date: '2026-08-20' },
      { stage: 'Inspection', completed: false },
      { stage: 'Finance', completed: false },
      { stage: 'Shipment', completed: false },
    ],
    exceptions: [
      { id: 'exc-001', type: 'COMPLIANCE', severity: 'WARNING', description: 'Phytosanitary certificate expires in 5 days', assignedTo: 'Compliance Officer', deadline: '2026-08-27', resolved: false },
    ],
  },
  {
    id: 'txn-003', masarId: 'MASAR-SES-2026-000003',
    buyerName: 'Al Rajhi Foods', buyerId: 'buyer-001',
    exporterName: 'NPG Exports', exporterId: 'exp-002',
    commodity: 'Standard Natural Sesame', quantity: '750 MT',
    contractValue: 375000, currency: 'USD', incoterm: 'CFR',
    destination: 'Riyadh, Saudi Arabia', origin: 'Abuja, Nigeria',
    status: 'COMPLIANCE', riskLevel: 'MEDIUM', clearanceScore: 58,
    createdAt: '2026-08-10', updatedAt: '2026-08-25',
    expectedCompletion: '2026-10-20', currentStage: 'Compliance',
    nextAction: 'Upload Laboratory COA', assignedTo: 'Nigeria Operations',
    timeline: [
      { stage: 'Buyer Verified', completed: true, date: '2026-08-12' },
      { stage: 'Exporter Verified', completed: true, date: '2026-08-14' },
      { stage: 'Contract Signed', completed: true, date: '2026-08-22' },
      { stage: 'Compliance', completed: false },
    ],
    exceptions: [
      { id: 'exc-002', type: 'DOCUMENT', severity: 'HIGH', description: 'Laboratory COA not yet received', assignedTo: 'Nigeria Operations', deadline: '2026-08-28', resolved: false },
      { id: 'exc-003', type: 'COMPLIANCE', severity: 'WARNING', description: 'SFDA product registration pending', assignedTo: 'Compliance Officer', deadline: '2026-09-05', resolved: false },
    ],
  },
  {
    id: 'txn-004', masarId: 'MASAR-SES-2026-000004',
    buyerName: 'SGT Foods', buyerId: 'buyer-002',
    exporterName: 'Dangote Sesame', exporterId: 'exp-001',
    commodity: 'Premium Hulled Sesame', quantity: '2,000 MT',
    contractValue: 1000000, currency: 'USD', incoterm: 'CIF',
    destination: 'Jeddah, Saudi Arabia', origin: 'Lagos, Nigeria',
    status: 'CONTRACTING', riskLevel: 'LOW', clearanceScore: 42,
    createdAt: '2026-08-15', updatedAt: '2026-08-25',
    expectedCompletion: '2026-11-15', currentStage: 'Contracting',
    nextAction: 'Execute contract', assignedTo: 'Operations',
    timeline: [
      { stage: 'Buyer Verified', completed: true, date: '2026-08-17' },
      { stage: 'Exporter Verified', completed: true, date: '2026-08-19' },
      { stage: 'Contract', completed: false },
    ],
    exceptions: [],
  },
  {
    id: 'txn-005', masarId: 'MASAR-SES-2026-000005',
    buyerName: 'Al Rajhi Foods', buyerId: 'buyer-001',
    exporterName: 'Dangote Sesame', exporterId: 'exp-001',
    commodity: 'Premium Hulled Sesame', quantity: '1,500 MT',
    contractValue: 750000, currency: 'USD', incoterm: 'CIF',
    destination: 'Jeddah, Saudi Arabia', origin: 'Lagos, Nigeria',
    status: 'COMPLETED', riskLevel: 'LOW', clearanceScore: 97,
    createdAt: '2026-05-01', updatedAt: '2026-07-28',
    expectedCompletion: '2026-07-28', currentStage: 'Completed',
    nextAction: 'None', assignedTo: 'N/A',
    timeline: [
      { stage: 'Buyer Verified', completed: true, date: '2026-05-05' },
      { stage: 'Exporter Verified', completed: true, date: '2026-05-08' },
      { stage: 'Contract Signed', completed: true, date: '2026-05-20' },
      { stage: 'Compliance Complete', completed: true, date: '2026-05-30' },
      { stage: 'Inspection Passed', completed: true, date: '2026-06-05' },
      { stage: 'Finance Approved', completed: true, date: '2026-06-10' },
      { stage: 'Escrow Funded', completed: true, date: '2026-06-12' },
      { stage: 'Shipment Released', completed: true, date: '2026-06-15' },
      { stage: 'In Transit', completed: true, date: '2026-06-18' },
      { stage: 'Port Verification', completed: true, date: '2026-07-05' },
      { stage: 'Release', completed: true, date: '2026-07-10' },
      { stage: 'Settlement', completed: true, date: '2026-07-28' },
    ],
    exceptions: [],
  },
];

export const mockBuyers: Buyer[] = [
  { id: 'buyer-001', legalName: 'Al Rajhi Food Industries Co.', tradingName: 'Al Rajhi Foods', country: 'Saudi Arabia', city: 'Riyadh', registration: 'CR-1010123456', category: 'Food Manufacturer', annualVolume: '$15,000,000', riskScore: 92, verificationStatus: 'APPROVED', transactionCount: 4, totalGMV: 2625000, directors: [{ name: 'Mohammed Al Rajhi', role: 'CEO' }, { name: 'Abdullah Al Rajhi', role: 'CFO' }] },
  { id: 'buyer-002', legalName: 'Saudi Gulf Trading Est.', tradingName: 'SGT Foods', country: 'Saudi Arabia', city: 'Dammam', registration: 'CR-1010789012', category: 'Commodity Importer', annualVolume: '$8,000,000', riskScore: 85, verificationStatus: 'APPROVED', transactionCount: 2, totalGMV: 1250000, directors: [{ name: 'Khalid Al-Otaibi', role: 'Managing Director' }] },
  { id: 'buyer-003', legalName: 'Jeddah Premium Foods LLC', tradingName: 'JPF', country: 'Saudi Arabia', city: 'Jeddah', registration: 'CR-1010456789', category: 'Distributor', annualVolume: '$5,000,000', riskScore: 0, verificationStatus: 'KYB_REVIEW', transactionCount: 0, totalGMV: 0, directors: [{ name: 'Faisal Al-Harbi', role: 'CEO' }] },
];

export const mockExporters: Exporter[] = [
  { id: 'exp-001', legalName: 'Dangote Agro Sesame Export Ltd.', tradingName: 'Dangote Sesame', country: 'Nigeria', cacNumber: 'RC-1234567', nepcNumber: 'NEPC/EXP/2024/001234', trustScore: 94, availableCapacity: '3,000 MT', completedTransactions: 7, inspectionPassRate: 98, verificationStatus: 'APPROVED', commodity: 'Sesame', grade: 'Premium Hulled' },
  { id: 'exp-002', legalName: 'Nigerian Premium Grains Ltd.', tradingName: 'NPG Exports', country: 'Nigeria', cacNumber: 'RC-7654321', nepcNumber: 'NEPC/EXP/2023/005678', trustScore: 78, availableCapacity: '1,500 MT', completedTransactions: 3, inspectionPassRate: 92, verificationStatus: 'APPROVED', commodity: 'Sesame', grade: 'Standard Natural' },
  { id: 'exp-003', legalName: 'Kano Sesame Cooperative Export Union', tradingName: 'Kano Sesame Union', country: 'Nigeria', cacNumber: 'RC-9876543', nepcNumber: 'NEPC/EXP/2026/009012', trustScore: 45, availableCapacity: '500 MT', completedTransactions: 0, inspectionPassRate: 0, verificationStatus: 'PENDING', commodity: 'Sesame', grade: 'Natural' },
];

export const mockTasks: Task[] = [
  { id: 'task-001', title: 'Review inspection certificate', description: 'MASAR-SES-2026-000002 inspection report uploaded by SGS Nigeria', priority: 'HIGH', assignedTo: 'Compliance Officer', dueDate: '2026-08-26', status: 'PENDING', transactionId: 'txn-002', category: 'Compliance' },
  { id: 'task-002', title: 'Upload Laboratory COA', description: 'MASAR-SES-2026-000003 missing laboratory certificate of analysis', priority: 'CRITICAL', assignedTo: 'Nigeria Operations', dueDate: '2026-08-28', status: 'IN_PROGRESS', transactionId: 'txn-003', category: 'Documents' },
  { id: 'task-003', title: 'Renew phytosanitary certificate', description: 'Certificate expires in 5 days for MASAR-SES-2026-000002', priority: 'HIGH', assignedTo: 'Compliance Officer', dueDate: '2026-08-27', status: 'PENDING', transactionId: 'txn-002', category: 'Compliance' },
  { id: 'task-004', title: 'Execute contract', description: 'MASAR-SES-2026-000004 contract awaiting signature', priority: 'MEDIUM', assignedTo: 'Operations', dueDate: '2026-08-30', status: 'PENDING', transactionId: 'txn-004', category: 'Contracts' },
  { id: 'task-005', title: 'Monitor vessel ETA', description: 'MSC Aurora carrying MASAR-SES-2026-000001 shipment', priority: 'LOW', assignedTo: 'Operations', dueDate: '2026-09-05', status: 'IN_PROGRESS', transactionId: 'txn-001', category: 'Logistics' },
  { id: 'task-006', title: 'SFDA product registration', description: 'MASAR-SES-2026-000003 requires SFDA registration', priority: 'MEDIUM', assignedTo: 'Compliance Officer', dueDate: '2026-09-05', status: 'PENDING', transactionId: 'txn-003', category: 'Compliance' },
];

export const mockNotifications: Notification[] = [
  { id: 'notif-001', type: 'CRITICAL', title: 'Release blocked', description: 'MASAR-SES-2026-000002 missing port verification', timestamp: '2 min ago', read: false, transactionId: 'txn-002' },
  { id: 'notif-002', type: 'ACTION', title: 'Document awaiting approval', description: 'Certificate of Origin for MASAR-SES-2026-000003', timestamp: '15 min ago', read: false, transactionId: 'txn-003' },
  { id: 'notif-003', type: 'WARNING', title: 'Shipment delayed', description: 'MSCU1234567 ETA pushed 48h to Sep 10', timestamp: '1 hour ago', read: false, transactionId: 'txn-001' },
  { id: 'notif-004', type: 'INFO', title: 'Inspection completed', description: 'MASAR-SES-2026-000001 inspection passed', timestamp: '3 hours ago', read: true, transactionId: 'txn-001' },
  { id: 'notif-005', type: 'INFO', title: 'Finance approved', description: 'Afreximbank approved $400K facility for MASAR-SES-2026-000001', timestamp: '5 hours ago', read: true, transactionId: 'txn-001' },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function getStatusColor(status: string): string {
  const completed = ['COMPLETED', 'SETTLED'];
  const active = ['IN_TRANSIT', 'SHIPMENT', 'RELEASE', 'PORT_VERIFICATION', 'FUNDS_SECURED', 'FUNDS_RELEASED'];
  const progress = ['COMPLIANCE', 'CLEARANCE_READY', 'INSPECTION', 'FINANCE', 'CONTRACTING', 'COMMERCIAL_MATCH', 'BUYER_VERIFIED', 'EXPORTER_VERIFIED', 'RFQ'];
  const failed = ['INSPECTION_FAILED', 'COMPLIANCE_FAILED', 'DISPUTED', 'CANCELLED'];
  if (completed.includes(status)) return '#16A34A';
  if (active.includes(status)) return '#3B82F6';
  if (progress.includes(status)) return '#C9A24A';
  if (failed.includes(status)) return '#EF4444';
  return '#667085';
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case 'LOW': return '#16A34A';
    case 'MEDIUM': return '#F59E0B';
    case 'HIGH': return '#F97316';
    case 'CRITICAL': return '#EF4444';
    default: return '#667085';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'CRITICAL': return '#EF4444';
    case 'HIGH': return '#F97316';
    case 'MEDIUM': return '#F59E0B';
    case 'LOW': return '#3B82F6';
    default: return '#667085';
  }
}

export function calculateDashboardStats(txns: Transaction[]) {
  const active = txns.filter(t => !['COMPLETED', 'SETTLED', 'CANCELLED'].includes(t.status));
  const completed = txns.filter(t => ['COMPLETED', 'SETTLED'].includes(t.status));
  const totalGMV = txns.reduce((sum, t) => sum + t.contractValue, 0);
  const contractedGMV = txns.filter(t => !['DRAFT', 'RFQ'].includes(t.status)).reduce((sum, t) => sum + t.contractValue, 0);
  const inTransitValue = txns.filter(t => t.status === 'IN_TRANSIT').reduce((sum, t) => sum + t.contractValue, 0);
  const atRisk = txns.filter(t => ['HIGH', 'CRITICAL'].includes(t.riskLevel));
  const exceptions = txns.flatMap(t => t.exceptions).filter(e => !e.resolved);

  return {
    activeTransactions: active.length,
    completedTransactions: completed.length,
    totalGMV,
    contractedGMV,
    inTransitValue,
    financedValue: 520000,
    pendingRelease: 310000,
    atRiskCount: atRisk.length,
    disputeCount: 0,
    exceptionCount: exceptions.length,
    pipelineGMV: totalGMV,
  };
}
