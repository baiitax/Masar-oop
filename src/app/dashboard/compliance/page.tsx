'use client';
import React from 'react';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { Shield, CheckCircle, Clock, AlertTriangle, FileCheck, Eye, Target, TrendingUp } from 'lucide-react';

export default function ComplianceCenterPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', red: '#EF4444', amber: '#F59E0B' };

  const metrics = [
    { label: 'UNDER REVIEW', value: '3', icon: Clock, color: s.amber },
    { label: 'DOCS PENDING', value: '5', icon: FileCheck, color: '#3B82F6' },
    { label: 'DOCS EXPIRING', value: '2', icon: AlertTriangle, color: s.red },
    { label: 'EXCEPTIONS', value: '2', icon: AlertTriangle, color: s.red },
    { label: 'CLEARANCE READY', value: '4', icon: CheckCircle, color: s.green },
  ];

  const exceptions = [
    { priority: 'Critical', txn: 'SES-002', issue: 'Missing phytosanitary certificate', owner: 'Compliance Officer', deadline: 'Today', status: 'Open', color: s.red },
    { priority: 'High', txn: 'SES-004', issue: 'Certificate of Origin expires in 5 days', owner: 'Operations', deadline: '2 days', status: 'Open', color: s.amber },
    { priority: 'Medium', txn: 'CAS-003', issue: 'Arabic labelling review required', owner: 'KSA Compliance', deadline: '4 days', status: 'Pending', color: '#3B82F6' },
  ];

  return (
    <DashboardPage title="MASAR Compliance Control Center" subtitle="Centralized compliance management for all corridor transactions." breadcrumbs={[{ label: 'Compliance' }]} metrics={metrics}>
      {/* Clearance Score */}
      <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '24px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text, marginBottom: '16px' }}>Clearance Readiness Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: '#F9FAFB', borderRadius: '10px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'conic-gradient(#16A34A 0deg, #16A34A 338deg, #E5E7EB 338deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: s.text }}>94</span>
                <span style={{ fontSize: '8px', fontWeight: 600, color: s.green, letterSpacing: '0.08em' }}>READY</span>
              </div>
            </div>
            <span style={{ fontSize: '11px', color: '#98A2B3' }}>Average Clearance Score</span>
          </div>
          {[
            { label: 'Counterparty', value: 96, color: s.green },
            { label: 'Documentation', value: 92, color: s.green },
            { label: 'Quality', value: 98, color: s.green },
            { label: 'Saudi Import', value: 91, color: s.green },
            { label: 'Contract', value: 100, color: s.green },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '16px', background: '#F9FAFB', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: s.textSec }}>{item.label}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: item.color }}>{item.value}%</span>
              </div>
              <div style={{ height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exceptions Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${s.border}` }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Compliance Exceptions</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F9FAFB' }}>
            {['Priority', 'Transaction', 'Issue', 'Owner', 'Deadline', 'Status'].map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', borderBottom: `1px solid ${s.border}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {exceptions.map((exc, idx) => (
              <tr key={idx} style={{ borderBottom: `1px solid ${s.border}` }}>
                <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', fontWeight: 700, color: exc.color, padding: '3px 8px', background: `${exc.color}10`, borderRadius: '4px' }}>{exc.priority}</span></td>
                <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text, fontFamily: 'monospace' }}>{exc.txn}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{exc.issue}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: s.textSec }}>{exc.owner}</td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: exc.deadline === 'Today' ? s.red : s.textSec, fontWeight: exc.deadline === 'Today' ? 600 : 400 }}>{exc.deadline}</td>
                <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: exc.status === 'Open' ? s.red : s.amber, padding: '3px 8px', background: exc.status === 'Open' ? '#FEF2F2' : '#FFFBEB', borderRadius: '4px' }}>{exc.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPage>
  );
}
