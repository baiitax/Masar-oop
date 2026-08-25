'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Search, Calendar, Beaker, FileText, CheckCircle, 
  Clock, AlertTriangle, Eye, Plus, Filter, RefreshCw, Download, 
  ChevronRight, ArrowUpRight, Users, Package, MapPin, Star, TrendingUp,
  BarChart3, Banknote, Anchor, Globe, Bell, Languages, ChevronDown, 
  LogOut, Loader2, X, Building2, Truck, Activity, Target, ArrowRight,
  Send, Edit, Trash2, Copy, ExternalLink, Info, HelpCircle, Shield,
  Receipt, Scale, KeyRound, Lock, Unlock, FileCheck, ClipboardCheck,
  Navigation, Compass, Thermometer, Droplets, Wind, Zap, Award,
  Camera, Upload, MessageSquare, Phone
} from 'lucide-react';
import { 
  mockTransactions, mockBuyers, mockExporters, mockNotifications,
  formatCurrency, getStatusColor, getRiskColor, Transaction
} from '@/lib/store';
import { colors, glass, typography, getBadgeStyle } from '@/lib/design';
import RoleSidebar from '@/components/dashboard/RoleSidebar';

// Inspector-specific types
interface InspectionAssignment {
  id: string;
  transactionId: string;
  masarId: string;
  buyerName: string;
  exporterName: string;
  commodity: string;
  quantity: string;
  location: string;
  warehouse: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'ASSIGNED' | 'ACCEPTED' | 'SCHEDULED' | 'SAMPLE_COLLECTED' | 'LABORATORY_TESTING' | 'REPORT_UPLOADED' | 'COMPLETED' | 'CANCELLED';
  result?: 'PASS' | 'CONDITIONAL_PASS' | 'FAIL';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignedDate: string;
  acceptedDate?: string;
  completedDate?: string;
  inspectorName: string;
  labPartner: string;
  requiredTests: TestRequirement[];
  sampleCollected?: boolean;
  sampleDate?: string;
  reportUploaded?: boolean;
  reportDate?: string;
  notes?: string;
}

interface TestRequirement {
  id: string;
  parameter: string;
  parameterAr: string;
  method: string;
  threshold: string;
  unit: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  result?: string;
  resultStatus?: 'PASS' | 'FAIL' | 'N/A';
}

interface InspectionReport {
  id: string;
  inspectionId: string;
  transactionId: string;
  masarId: string;
  commodity: string;
  quantity: string;
  location: string;
  inspectionDate: string;
  inspectorName: string;
  labPartner: string;
  result: 'PASS' | 'CONDITIONAL_PASS' | 'FAIL';
  overallScore: number;
  testResults: TestResult[];
  recommendations: string;
  notes: string;
  uploadedDate: string;
  verifiedBy?: string;
  verifiedDate?: string;
  documentHash: string;
}

interface TestResult {
  parameter: string;
  value: string;
  threshold: string;
  unit: string;
  status: 'PASS' | 'FAIL' | 'N/A';
  notes?: string;
}

interface ScheduleSlot {
  id: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: 'AVAILABLE' | 'BOOKED' | 'COMPLETED';
  transactionId?: string;
  masarId?: string;
}

interface PartnerProfile {
  companyName: string;
  registrationNumber: string;
  country: string;
  city: string;
  specializations: string[];
  certifications: string[];
  labAccreditations: string[];
  coverageRegions: string[];
  activeInspections: number;
  completedInspections: number;
  passRate: number;
  averageTurnaround: number;
  rating: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
}

// Mock inspector data
const partnerProfile: PartnerProfile = {
  companyName: 'SGS Nigeria Limited',
  registrationNumber: 'SGS/NG/2020/001',
  country: 'Nigeria',
  city: 'Lagos',
  specializations: ['Agricultural Commodities', 'Food Safety', 'Quality Assurance', 'Pre-Shipment Inspection'],
  certifications: ['ISO 17020', 'ISO 17025', 'IFIA', 'GAFTA'],
  labAccreditations: ['SANAS', 'NABL', 'A2LA'],
  coverageRegions: ['Lagos', 'Kano', 'Abuja', 'Port Harcourt'],
  activeInspections: 3,
  completedInspections: 12,
  passRate: 92,
  averageTurnaround: 3.5,
  rating: 4.8,
  status: 'ACTIVE',
};

const mockAssignments: InspectionAssignment[] = [
  {
    id: 'insp-001', transactionId: 'txn-001', masarId: 'MASAR-SES-2026-000001',
    buyerName: 'Al Rajhi Foods', exporterName: 'Dangote Sesame',
    commodity: 'Premium Hulled Sesame', quantity: '1,000 MT',
    location: 'Lagos, Nigeria', warehouse: 'Dangote Lagos Warehouse',
    scheduledDate: '2026-08-25', scheduledTime: '09:00',
    status: 'COMPLETED', result: 'PASS', priority: 'HIGH',
    assignedDate: '2026-08-20', acceptedDate: '2026-08-20',
    completedDate: '2026-08-25',
    inspectorName: 'Adebayo Ogundimu', labPartner: 'SGS Lagos Laboratory',
    requiredTests: [
      { id: 't1', parameter: 'Moisture Content', parameterAr: 'محتوى الرطوبة', method: 'AOAC 925.10', threshold: '<3%', unit: '%', status: 'COMPLETED', result: '1.8', resultStatus: 'PASS' },
      { id: 't2', parameter: 'Purity', parameterAr: 'النقاء', method: 'ISO 659', threshold: '>98%', unit: '%', status: 'COMPLETED', result: '99.5', resultStatus: 'PASS' },
      { id: 't3', parameter: 'Foreign Matter', parameterAr: 'الأجسام الغريبة', method: 'ISO 659', threshold: '<1%', unit: '%', status: 'COMPLETED', result: '0.3', resultStatus: 'PASS' },
      { id: 't4', parameter: 'Aflatoxin', parameterAr: 'الأفلاتوكسين', method: 'ELISA', threshold: '<10', unit: 'ppb', status: 'COMPLETED', result: '3.2', resultStatus: 'PASS' },
      { id: 't5', parameter: 'Oil Content', parameterAr: 'محتوى الزيت', method: 'ISO 659', threshold: '>50%', unit: '%', status: 'COMPLETED', result: '52.1', resultStatus: 'PASS' },
      { id: 't6', parameter: 'Salmonella', parameterAr: 'السالمونيلا', method: 'ISO 6579', threshold: 'Absent', unit: '/25g', status: 'COMPLETED', result: 'Absent', resultStatus: 'PASS' },
    ],
    sampleCollected: true, sampleDate: '2026-08-25',
    reportUploaded: true, reportDate: '2026-08-25',
    notes: 'All parameters within specification. Recommended for release.',
  },
  {
    id: 'insp-002', transactionId: 'txn-002', masarId: 'MASAR-SES-2026-000002',
    buyerName: 'SGT Foods', exporterName: 'Dangote Sesame',
    commodity: 'Premium Hulled Sesame', quantity: '500 MT',
    location: 'Kano, Nigeria', warehouse: 'Dangote Kano Processing Center',
    scheduledDate: '2026-08-28', scheduledTime: '10:00',
    status: 'SCHEDULED', priority: 'HIGH',
    assignedDate: '2026-08-22', acceptedDate: '2026-08-22',
    inspectorName: 'Ibrahim Musa', labPartner: 'Bureau Veritas Kano',
    requiredTests: [
      { id: 't7', parameter: 'Moisture Content', parameterAr: 'محتوى الرطوبة', method: 'AOAC 925.10', threshold: '<3%', unit: '%', status: 'PENDING' },
      { id: 't8', parameter: 'Purity', parameterAr: 'النقاء', method: 'ISO 659', threshold: '>98%', unit: '%', status: 'PENDING' },
      { id: 't9', parameter: 'Foreign Matter', parameterAr: 'الأجسام الغريبة', method: 'ISO 659', threshold: '<1%', unit: '%', status: 'PENDING' },
      { id: 't10', parameter: 'Aflatoxin', parameterAr: 'الأفلاتوكسين', method: 'ELISA', threshold: '<10', unit: 'ppb', status: 'PENDING' },
    ],
    sampleCollected: false,
    reportUploaded: false,
  },
  {
    id: 'insp-003', transactionId: 'txn-003', masarId: 'MASAR-SES-2026-000003',
    buyerName: 'Al Rajhi Foods', exporterName: 'NPG Exports',
    commodity: 'Standard Natural Sesame', quantity: '750 MT',
    location: 'Abuja, Nigeria', warehouse: 'NPG Abuja Central Warehouse',
    scheduledDate: '2026-08-30', scheduledTime: '11:00',
    status: 'ASSIGNED', priority: 'MEDIUM',
    assignedDate: '2026-08-24',
    inspectorName: 'Chukwuemeka Okafor', labPartner: 'Intertek Abuja',
    requiredTests: [
      { id: 't11', parameter: 'Moisture Content', parameterAr: 'محتوى الرطوبة', method: 'AOAC 925.10', threshold: '<3%', unit: '%', status: 'PENDING' },
      { id: 't12', parameter: 'Purity', parameterAr: 'النقاء', method: 'ISO 659', threshold: '>98%', unit: '%', status: 'PENDING' },
      { id: 't13', parameter: 'Foreign Matter', parameterAr: 'الأجسام الغريبة', method: 'ISO 659', threshold: '<1%', unit: '%', status: 'PENDING' },
      { id: 't14', parameter: 'Aflatoxin', parameterAr: 'الأفلاتوكسين', method: 'ELISA', threshold: '<10', unit: 'ppb', status: 'PENDING' },
      { id: 't15', parameter: 'Salmonella', parameterAr: 'السالمونيلا', method: 'ISO 6579', threshold: 'Absent', unit: '/25g', status: 'PENDING' },
    ],
    sampleCollected: false,
    reportUploaded: false,
  },
  {
    id: 'insp-004', transactionId: 'txn-006', masarId: 'MASAR-SES-2026-000006',
    buyerName: 'SGT Foods', exporterName: 'NPG Exports',
    commodity: 'Standard Natural Sesame', quantity: '300 MT',
    location: 'Lagos, Nigeria', warehouse: 'NPG Lagos Warehouse',
    scheduledDate: '2026-08-05', scheduledTime: '09:00',
    status: 'COMPLETED', result: 'FAIL', priority: 'HIGH',
    assignedDate: '2026-08-01', acceptedDate: '2026-08-01',
    completedDate: '2026-08-08',
    inspectorName: 'Adebayo Ogundimu', labPartner: 'SGS Lagos Laboratory',
    requiredTests: [
      { id: 't16', parameter: 'Moisture Content', parameterAr: 'محتوى الرطوبة', method: 'AOAC 925.10', threshold: '<3%', unit: '%', status: 'COMPLETED', result: '2.5', resultStatus: 'PASS' },
      { id: 't17', parameter: 'Purity', parameterAr: 'النقاء', method: 'ISO 659', threshold: '>98%', unit: '%', status: 'COMPLETED', result: '98.2', resultStatus: 'PASS' },
      { id: 't18', parameter: 'Foreign Matter', parameterAr: 'الأجسام الغريبة', method: 'ISO 659', threshold: '<1%', unit: '%', status: 'COMPLETED', result: '0.8', resultStatus: 'PASS' },
      { id: 't19', parameter: 'Aflatoxin', parameterAr: 'الأفلاتوكسين', method: 'ELISA', threshold: '<10', unit: 'ppb', status: 'COMPLETED', result: '18', resultStatus: 'FAIL' },
    ],
    sampleCollected: true, sampleDate: '2026-08-05',
    reportUploaded: true, reportDate: '2026-08-08',
    notes: 'CRITICAL: Aflatoxin level 18 ppb exceeds contractual threshold of 10 ppb. Shipment cannot proceed.',
  },
];

const mockSchedule: ScheduleSlot[] = [
  { id: 'sch-001', date: '2026-08-28', time: '10:00', duration: '4 hours', location: 'Kano', status: 'BOOKED', transactionId: 'txn-002', masarId: 'MASAR-SES-2026-000002' },
  { id: 'sch-002', date: '2026-08-30', time: '11:00', duration: '4 hours', location: 'Abuja', status: 'BOOKED', transactionId: 'txn-003', masarId: 'MASAR-SES-2026-000003' },
  { id: 'sch-003', date: '2026-09-02', time: '09:00', duration: '4 hours', location: 'Lagos', status: 'AVAILABLE' },
  { id: 'sch-004', date: '2026-09-03', time: '10:00', duration: '4 hours', location: 'Lagos', status: 'AVAILABLE' },
  { id: 'sch-005', date: '2026-09-05', time: '09:00', duration: '4 hours', location: 'Kano', status: 'AVAILABLE' },
];

export default function InspectorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'assignments' | 'schedule' | 'samples' | 'reports' | 'exceptions' | 'history' | 'profile'>('overview');
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const assignedCount = mockAssignments.filter(a => a.status === 'ASSIGNED').length;
  const scheduledCount = mockAssignments.filter(a => a.status === 'SCHEDULED' || a.status === 'ACCEPTED').length;
  const inProgressCount = mockAssignments.filter(a => a.status === 'SAMPLE_COLLECTED' || a.status === 'LABORATORY_TESTING').length;
  const completedCount = mockAssignments.filter(a => a.status === 'COMPLETED').length;
  const passedCount = mockAssignments.filter(a => a.result === 'PASS').length;
  const failedCount = mockAssignments.filter(a => a.result === 'FAIL').length;
  const unreadNotifs = mockNotifications.filter(n => !n.read);

  useEffect(() => {
    const role = localStorage.getItem('masar-role');
    if (!role) { router.push('/auth'); return; }
    setTimeout(() => setLoading(false), 800);
  }, [router]);

  const filteredAssignments = filterStatus === 'all' ? mockAssignments :
    filterStatus === 'assigned' ? mockAssignments.filter(a => a.status === 'ASSIGNED') :
    filterStatus === 'scheduled' ? mockAssignments.filter(a => a.status === 'SCHEDULED' || a.status === 'ACCEPTED') :
    filterStatus === 'completed' ? mockAssignments.filter(a => a.status === 'COMPLETED') :
    mockAssignments;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.navy }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ animation: 'spin 2s linear infinite' }}>
              <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(201,162,74,0.15)" strokeWidth="2" />
              <circle cx="40" cy="40" r="35" fill="none" stroke={colors.gold} strokeWidth="2" strokeDasharray="180 220" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke={colors.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill={colors.gold} /></svg>
            </div>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.gold, letterSpacing: '0.1em' }}>MASAR INSPECTOR</span>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Loading inspection workbench...</p>
        </div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      <RoleSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div style={{ flex: 1, marginLeft: collapsed ? '72px' : '260px', transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header style={{ ...glass.card, borderRadius: 0, borderBottom: `1px solid ${colors.border}`, padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
              <input type="text" placeholder="Search inspections, transactions, reports..." style={{ ...glass.input, width: '100%', padding: '8px 12px 8px 36px', fontSize: '13px', color: colors.text, outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: colors.greenLight, borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: colors.green, borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: colors.green }}>ACTIVE</span>
            </div>
            <div style={{ padding: '4px 8px', background: 'rgba(8,145,178,0.08)', borderRadius: '4px', border: '1px solid rgba(8,145,178,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={12} color="#0891B2" fill="#0891B2" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0891B2' }}>{partnerProfile.rating}</span>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={{ position: 'relative', padding: '6px', ...glass.btnOutline, borderRadius: '8px' }}>
                <Bell size={18} color={colors.textSec} />
                {unreadNotifs.length > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: colors.red, borderRadius: '50%', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadNotifs.length}</span>}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, #0891B2, #22D3EE)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>SG</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>SGS Nigeria</p>
                <p style={{ fontSize: '10px', color: colors.textSec, margin: 0 }}>Inspection Partner</p>
              </div>
              <ChevronDown size={14} color={colors.textSec} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Search size={18} color="#0891B2" />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#0891B2', letterSpacing: '0.08em' }}>INSPECTION PARTNER PORTAL</span>
              </div>
              <h1 style={{ ...typography.h1, marginBottom: '2px' }}>Inspection Workbench</h1>
              <p style={{ ...typography.small }}>{partnerProfile.companyName} · {partnerProfile.city}, {partnerProfile.country}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...glass.btnOutline, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={13} /> Refresh</button>
              <button style={{ ...glass.btnPrimary, padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={13} /> Export Reports</button>
            </div>
          </div>

          {/* Partner Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', padding: '16px', background: 'linear-gradient(135deg, #ECFEFF, #CFFAFE)', borderRadius: '12px', border: '1px solid #A5F3FC' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `conic-gradient(#0891B2 0deg, #0891B2 ${partnerProfile.passRate * 3.6}deg, #E5E7EB ${partnerProfile.passRate * 3.6}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: colors.text }}>{partnerProfile.passRate}%</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, margin: 0 }}>Inspection Pass Rate</h3>
              <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>{partnerProfile.completedInspections} completed · {partnerProfile.averageTurnaround} day avg turnaround</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { label: 'Active', value: partnerProfile.activeInspections, color: '#0891B2' },
                { label: 'Completed', value: partnerProfile.completedInspections, color: colors.green },
                { label: 'Rating', value: partnerProfile.rating, color: colors.gold },
              ].map((stat, idx) => (
                <div key={idx} style={{ textAlign: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '18px', fontWeight: 800, color: stat.color, margin: 0 }}>{stat.value}</p>
                  <span style={{ fontSize: '9px', color: colors.textMuted }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* View Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', background: '#E5E7EB', borderRadius: '10px', width: 'fit-content', overflowX: 'auto' }}>
            {([
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'assignments', label: 'Assignments', icon: FileText },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'samples', label: 'Samples', icon: Beaker },
              { id: 'reports', label: 'Reports', icon: ClipboardCheck },
              { id: 'exceptions', label: 'Exceptions', icon: AlertTriangle },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'profile', label: 'Profile', icon: Building2 },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveView(tab.id as any)} style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', transition: 'all 0.2s', ...(activeView === tab.id ? { background: 'white', color: colors.text, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { background: 'transparent', color: colors.textSec }) }}>
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW VIEW */}
          {activeView === 'overview' && (
            <>
              {/* KPI Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'ASSIGNED', value: String(assignedCount), icon: FileText, color: '#3B82F6', action: () => setActiveView('assignments') },
                  { label: 'SCHEDULED', value: String(scheduledCount), icon: Calendar, color: '#0891B2', action: () => setActiveView('schedule') },
                  { label: 'IN PROGRESS', value: String(inProgressCount), icon: Beaker, color: colors.amber, action: () => setActiveView('samples') },
                  { label: 'COMPLETED', value: String(completedCount), icon: CheckCircle, color: colors.green, action: () => setActiveView('history') },
                  { label: 'PASSED', value: String(passedCount), icon: CheckCircle, color: colors.green, action: () => setActiveView('reports') },
                  { label: 'FAILED', value: String(failedCount), icon: AlertTriangle, color: colors.red, action: () => setActiveView('exceptions') },
                ].map((kpi, idx) => (
                  <div key={idx} onClick={kpi.action} style={{ ...glass.card, padding: '14px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ ...typography.label }}>{kpi.label}</span>
                      <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: `${kpi.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><kpi.icon size={12} color={kpi.color} /></div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: colors.text }}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Today's Work + Upcoming */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {/* Today's Work */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Today&apos;s Work</h3>
                    <button onClick={() => setActiveView('assignments')} style={{ fontSize: '11px', color: '#0891B2', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {mockAssignments.filter(a => a.status !== 'COMPLETED' && a.status !== 'CANCELLED').map(assignment => (
                      <div key={assignment.id} onClick={() => { setSelectedAssignment(assignment.id); setActiveView('assignments'); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: assignment.priority === 'HIGH' ? '#FFF7ED' : '#F9FAFB', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', borderLeft: `3px solid ${assignment.priority === 'HIGH' ? '#F97316' : assignment.priority === 'MEDIUM' ? colors.amber : colors.blue}` }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: assignment.status === 'ASSIGNED' ? '#EFF6FF' : assignment.status === 'SCHEDULED' ? '#ECFEFF' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {assignment.status === 'ASSIGNED' ? <FileText size={18} color="#3B82F6" /> : assignment.status === 'SCHEDULED' ? <Calendar size={18} color="#0891B2" /> : <Beaker size={18} color={colors.amber} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{assignment.masarId}</span>
                            <span style={getBadgeStyle(assignment.status === 'ASSIGNED' ? 'info' : assignment.status === 'SCHEDULED' ? 'info' : 'warning')}>{assignment.status.replace(/_/g, ' ')}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>{assignment.commodity} · {assignment.quantity} · {assignment.location}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '11px', fontWeight: 600, color: colors.text, margin: 0 }}>{assignment.scheduledDate}</p>
                          <p style={{ fontSize: '10px', color: colors.textMuted, margin: 0 }}>{assignment.scheduledTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Schedule */}
                <div style={{ ...glass.card, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ ...typography.h3 }}>Upcoming Schedule</h3>
                    <button onClick={() => setActiveView('schedule')} style={{ fontSize: '11px', color: '#0891B2', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>Full Schedule →</button>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {mockSchedule.slice(0, 5).map(slot => (
                      <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: slot.status === 'AVAILABLE' ? '#F0FDF4' : '#ECFEFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: slot.status === 'AVAILABLE' ? colors.green : '#0891B2' }}>{slot.date.split('-')[2]}</span>
                            <span style={{ fontSize: '8px', color: colors.textMuted }}>{new Date(slot.date).toLocaleDateString('en', { month: 'short' })}</span>
                          </div>
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{slot.time} · {slot.duration}</p>
                            <p style={{ fontSize: '11px', color: colors.textSec, margin: 0 }}>{slot.location} {slot.masarId ? `· ${slot.masarId}` : ''}</p>
                          </div>
                        </div>
                        <span style={getBadgeStyle(slot.status === 'AVAILABLE' ? 'success' : 'info')}>{slot.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div style={{ ...glass.card, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ ...typography.h3 }}>Recent Reports</h3>
                  <button onClick={() => setActiveView('reports')} style={{ fontSize: '11px', color: '#0891B2', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}>View All →</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#F9FAFB' }}>
                    {['Transaction', 'Commodity', 'Location', 'Date', 'Result', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {mockAssignments.filter(a => a.status === 'COMPLETED').map(assignment => (
                      <tr key={assignment.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <td style={{ padding: '12px' }}><span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{assignment.masarId}</span></td>
                        <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{assignment.commodity}</td>
                        <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{assignment.location}</td>
                        <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{assignment.completedDate}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={getBadgeStyle(assignment.result === 'PASS' ? 'success' : 'danger')}>{assignment.result}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => { setSelectedAssignment(assignment.id); setActiveView('reports'); }} style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Eye size={12} color={colors.textSec} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ASSIGNMENTS VIEW */}
          {activeView === 'assignments' && (
            <div style={{ display: 'grid', gridTemplateColumns: selectedAssignment ? '1fr 400px' : '1fr', gap: '16px' }}>
              <div style={{ ...glass.card, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ ...typography.h3 }}>Inspection Assignments</h3>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['all', 'assigned', 'scheduled', 'completed'].map(f => (
                      <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(filterStatus === f ? { background: '#0891B2', color: 'white' } : { background: '#F3F4F6', color: colors.textSec }) }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '12px' }}>
                  {filteredAssignments.map(assignment => (
                    <div key={assignment.id} onClick={() => setSelectedAssignment(assignment.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: selectedAssignment === assignment.id ? '#ECFEFF' : '#F9FAFB', borderRadius: '10px', marginBottom: '8px', cursor: 'pointer', border: selectedAssignment === assignment.id ? '1px solid #A5F3FC' : '1px solid transparent' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: assignment.result === 'PASS' ? '#F0FDF4' : assignment.result === 'FAIL' ? '#FEF2F2' : assignment.status === 'ASSIGNED' ? '#EFF6FF' : '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {assignment.result === 'PASS' ? <CheckCircle size={20} color={colors.green} /> : assignment.result === 'FAIL' ? <XCircle size={20} color={colors.red} /> : assignment.status === 'ASSIGNED' ? <FileText size={20} color="#3B82F6" /> : <Calendar size={20} color="#0891B2" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{assignment.masarId}</span>
                          <span style={getBadgeStyle(assignment.status === 'COMPLETED' ? (assignment.result === 'PASS' ? 'success' : 'danger') : assignment.status === 'ASSIGNED' ? 'info' : 'warning')}>{assignment.status.replace(/_/g, ' ')}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>{assignment.commodity} · {assignment.quantity} · {assignment.location}</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <span style={{ fontSize: '10px', color: colors.textMuted }}>Buyer: {assignment.buyerName}</span>
                          <span style={{ fontSize: '10px', color: colors.textMuted }}>· Exporter: {assignment.exporterName}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, margin: 0 }}>{assignment.scheduledDate}</p>
                        <p style={{ fontSize: '10px', color: colors.textMuted, margin: 0 }}>{assignment.scheduledTime}</p>
                        <span style={getBadgeStyle(assignment.priority === 'HIGH' ? 'danger' : assignment.priority === 'MEDIUM' ? 'warning' : 'info')}>{assignment.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignment Detail */}
              {selectedAssignment && (() => {
                const assignment = mockAssignments.find(a => a.id === selectedAssignment);
                if (!assignment) return null;
                return (
                  <div style={{ ...glass.card, padding: '20px', position: 'sticky', top: '80px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{assignment.masarId}</span>
                        <p style={{ fontSize: '12px', color: colors.textSec, margin: '2px 0 0' }}>{assignment.commodity} · {assignment.quantity}</p>
                      </div>
                      <button onClick={() => setSelectedAssignment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: colors.textMuted }}>✕</button>
                    </div>

                    {/* Status */}
                    <div style={{ padding: '12px', background: assignment.result === 'PASS' ? '#F0FDF4' : assignment.result === 'FAIL' ? '#FEF2F2' : '#ECFEFF', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
                      {assignment.result ? (
                        <>
                          <span style={{ fontSize: '24px', fontWeight: 800, color: assignment.result === 'PASS' ? colors.green : colors.red }}>{assignment.result}</span>
                          <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>Inspection Result</p>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0891B2' }}>{assignment.status.replace(/_/g, ' ')}</span>
                          <p style={{ fontSize: '11px', color: colors.textSec, margin: '2px 0 0' }}>Current Status</p>
                        </>
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                      {[
                        { l: 'Buyer', v: assignment.buyerName },
                        { l: 'Exporter', v: assignment.exporterName },
                        { l: 'Location', v: assignment.location },
                        { l: 'Warehouse', v: assignment.warehouse },
                        { l: 'Date', v: assignment.scheduledDate },
                        { l: 'Time', v: assignment.scheduledTime },
                        { l: 'Inspector', v: assignment.inspectorName },
                        { l: 'Lab Partner', v: assignment.labPartner },
                      ].map((item, idx) => (
                        <div key={idx} style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}>
                          <span style={{ fontSize: '9px', color: colors.textMuted }}>{item.l}</span>
                          <p style={{ fontSize: '11px', fontWeight: 600, color: colors.text, margin: 0 }}>{item.v}</p>
                        </div>
                      ))}
                    </div>

                    {/* Required Tests */}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: colors.textMuted, letterSpacing: '0.05em' }}>REQUIRED TESTS</span>
                      <div style={{ marginTop: '8px' }}>
                        {assignment.requiredTests.map(test => (
                          <div key={test.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: test.resultStatus === 'PASS' ? '#F0FDF4' : test.resultStatus === 'FAIL' ? '#FEF2F2' : '#F9FAFB', borderRadius: '6px', marginBottom: '4px' }}>
                            <div>
                              <p style={{ fontSize: '11px', fontWeight: 600, color: colors.text, margin: 0 }}>{test.parameter}</p>
                              <p style={{ fontSize: '10px', color: colors.textMuted, margin: 0 }}>Threshold: {test.threshold}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              {test.result ? (
                                <>
                                  <p style={{ fontSize: '12px', fontWeight: 700, color: test.resultStatus === 'PASS' ? colors.green : colors.red, margin: 0 }}>{test.result} {test.unit}</p>
                                  <span style={getBadgeStyle(test.resultStatus === 'PASS' ? 'success' : 'danger')}>{test.resultStatus}</span>
                                </>
                              ) : (
                                <span style={getBadgeStyle('neutral')}>{test.status}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {assignment.notes && (
                      <div style={{ padding: '12px', background: assignment.result === 'FAIL' ? '#FEF2F2' : '#F9FAFB', borderRadius: '8px', borderLeft: `3px solid ${assignment.result === 'FAIL' ? colors.red : colors.gold}`, marginBottom: '16px' }}>
                        <p style={{ fontSize: '12px', color: colors.text, margin: 0 }}>{assignment.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {assignment.status === 'ASSIGNED' && (
                        <button onClick={() => setShowAcceptModal(true)} style={{ ...glass.btnPrimary, flex: 1, padding: '10px', fontSize: '12px' }}>Accept Inspection</button>
                      )}
                      {assignment.status === 'SCHEDULED' && (
                        <button onClick={() => setShowSampleModal(true)} style={{ ...glass.btnPrimary, flex: 1, padding: '10px', fontSize: '12px' }}>Collect Sample</button>
                      )}
                      {assignment.status === 'SAMPLE_COLLECTED' && (
                        <button onClick={() => setShowReportModal(true)} style={{ ...glass.btnPrimary, flex: 1, padding: '10px', fontSize: '12px' }}>Submit Report</button>
                      )}
                      <button style={{ ...glass.btnOutline, padding: '10px 16px', fontSize: '12px' }}><Eye size={14} /></button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* SCHEDULE VIEW */}
          {activeView === 'schedule' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ ...typography.h3 }}>Inspection Schedule</h3>
                <button style={{ ...glass.btnPrimary, padding: '6px 14px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={12} /> Block Time</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Date', 'Time', 'Duration', 'Location', 'Transaction', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockSchedule.map(slot => (
                    <tr key={slot.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: colors.text }}>{slot.date}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{slot.time}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{slot.duration}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{slot.location}</td>
                      <td style={{ padding: '12px', fontSize: '11px', fontFamily: 'monospace', color: colors.text }}>{slot.masarId || '—'}</td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(slot.status === 'AVAILABLE' ? 'success' : slot.status === 'BOOKED' ? 'info' : 'neutral')}>{slot.status}</span></td>
                      <td style={{ padding: '12px' }}>
                        {slot.status === 'AVAILABLE' && (
                          <button style={{ padding: '4px 8px', ...glass.btnPrimary, borderRadius: '4px', fontSize: '10px' }}>Book</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* REPORTS VIEW */}
          {activeView === 'reports' && (
            <div style={{ ...glass.card, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}` }}>
                <h3 style={{ ...typography.h3 }}>Inspection Reports</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F9FAFB' }}>
                  {['Transaction', 'Commodity', 'Quantity', 'Location', 'Date', 'Result', 'Score', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: colors.textMuted, letterSpacing: '0.05em', borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockAssignments.filter(a => a.status === 'COMPLETED').map(assignment => (
                    <tr key={assignment.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: '12px' }}><span style={{ fontSize: '12px', fontWeight: 700, color: colors.text, fontFamily: 'monospace' }}>{assignment.masarId}</span></td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{assignment.commodity}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.text }}>{assignment.quantity}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{assignment.location}</td>
                      <td style={{ padding: '12px', fontSize: '12px', color: colors.textSec }}>{assignment.completedDate}</td>
                      <td style={{ padding: '12px' }}><span style={getBadgeStyle(assignment.result === 'PASS' ? 'success' : 'danger')}>{assignment.result}</span></td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${assignment.result === 'PASS' ? 95 : 40}%`, height: '100%', background: assignment.result === 'PASS' ? colors.green : colors.red, borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontSize: '10px', fontWeight: 600 }}>{assignment.result === 'PASS' ? '95' : '40'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => { setSelectedAssignment(assignment.id); setActiveView('assignments'); }} style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Eye size={12} color={colors.textSec} /></button>
                          <button style={{ padding: '4px 8px', ...glass.btnOutline, borderRadius: '4px' }}><Download size={12} color={colors.textSec} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Other Views */}
          {!['overview', 'assignments', 'schedule', 'reports'].includes(activeView) && (
            <div style={{ ...glass.card, padding: '48px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#0891B210', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                {activeView === 'samples' && <Beaker size={28} color="#0891B2" />}
                {activeView === 'exceptions' && <AlertTriangle size={28} color="#0891B2" />}
                {activeView === 'history' && <Clock size={28} color="#0891B2" />}
                {activeView === 'profile' && <Building2 size={28} color="#0891B2" />}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>
                {activeView === 'samples' && 'Sample Management'}
                {activeView === 'exceptions' && 'Quality Exceptions'}
                {activeView === 'history' && 'Inspection History'}
                {activeView === 'profile' && 'Partner Profile'}
              </h2>
              <p style={{ fontSize: '14px', color: colors.textSec, maxWidth: '500px', margin: '0 auto 24px' }}>
                {activeView === 'samples' && 'Track sample collection and laboratory submissions.'}
                {activeView === 'exceptions' && 'Manage quality exceptions and failed inspections.'}
                {activeView === 'history' && 'View complete inspection history and reports.'}
                {activeView === 'profile' && 'Manage your partner profile and certifications.'}
              </p>
              <button onClick={() => setActiveView('overview')} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Back to Overview</button>
            </div>
          )}
        </main>

        {/* Status Bar */}
        <footer style={{ background: 'white', borderTop: `1px solid ${colors.border}`, padding: '8px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: colors.gold, letterSpacing: '0.05em' }}>MASAR V0</span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Inspection Partner · {partnerProfile.companyName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Pass Rate: <span style={{ color: colors.green, fontWeight: 600 }}>{partnerProfile.passRate}%</span></span>
            <span style={{ fontSize: '10px', color: colors.textMuted }}>Rating: <span style={{ color: colors.gold, fontWeight: 600 }}>{partnerProfile.rating}/5</span></span>
          </div>
        </footer>
      </div>

      {/* Accept Modal */}
      {showAcceptModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>Accept Inspection</h2>
              <button onClick={() => setShowAcceptModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={colors.textSec} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ padding: '16px', background: '#ECFEFF', borderRadius: '10px', marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: '#0891B2', margin: 0 }}>By accepting this inspection, you commit to conducting the inspection according to MASAR standards and submitting the report within the agreed timeframe.</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Assigned Inspector</label>
                <input type="text" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} value="Adebayo Ogundimu" readOnly />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Notes</label>
                <textarea style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px', resize: 'vertical' }} rows={3} placeholder="Any special requirements..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setShowAcceptModal(false)} style={{ ...glass.btnOutline, padding: '10px 20px', fontSize: '13px' }}>Cancel</button>
                <button onClick={() => { setShowAcceptModal(false); setActiveView('assignments'); }} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px', background: '#0891B2', color: 'white' }}>Accept Inspection</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Modal */}
      {showSampleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>Collect Sample</h2>
              <button onClick={() => setShowSampleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={colors.textSec} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Sample ID</label>
                <input type="text" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} placeholder="e.g., SAMP-2026-001" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Collection Date & Time</label>
                <input type="datetime-local" style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Lab Partner</label>
                <select style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }}>
                  <option>SGS Lagos Laboratory</option>
                  <option>Bureau Veritas Kano</option>
                  <option>Intertek Abuja</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Notes</label>
                <textarea style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px', resize: 'vertical' }} rows={3} placeholder="Sample collection notes..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setShowSampleModal(false)} style={{ ...glass.btnOutline, padding: '10px 20px', fontSize: '13px' }}>Cancel</button>
                <button onClick={() => { setShowSampleModal(false); setActiveView('assignments'); }} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px', background: '#0891B2', color: 'white' }}>Submit Sample</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text }}>Submit Inspection Report</h2>
              <button onClick={() => setShowReportModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={colors.textSec} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Overall Result</label>
                <select style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px' }}>
                  <option>PASS</option>
                  <option>CONDITIONAL PASS</option>
                  <option>FAIL</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Test Results</label>
                {['Moisture', 'Purity', 'Foreign Matter', 'Aflatoxin', 'Weight', 'Packaging'].map((test, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <input type="text" style={{ ...glass.input, padding: '8px 10px', fontSize: '12px' }} value={test} readOnly />
                    <input type="text" style={{ ...glass.input, padding: '8px 10px', fontSize: '12px' }} placeholder="Value" />
                    <select style={{ ...glass.input, padding: '8px 10px', fontSize: '12px' }}>
                      <option>PASS</option>
                      <option>FAIL</option>
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Recommendations</label>
                <textarea style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px', resize: 'vertical' }} rows={3} placeholder="Inspection recommendations..." />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: colors.textSec, marginBottom: '6px' }}>Notes</label>
                <textarea style={{ ...glass.input, width: '100%', padding: '10px 12px', fontSize: '13px', resize: 'vertical' }} rows={3} placeholder="Additional notes..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={() => setShowReportModal(false)} style={{ ...glass.btnOutline, padding: '10px 20px', fontSize: '13px' }}>Cancel</button>
                <button onClick={() => { setShowReportModal(false); setActiveView('reports'); }} style={{ ...glass.btnPrimary, padding: '10px 20px', fontSize: '13px', background: '#0891B2', color: 'white' }}>Submit Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
