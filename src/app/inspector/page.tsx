'use client';
import React from 'react';
import DashboardLayout from '@/app/dashboard/layout';
import { Search, Calendar, Beaker, FileText, CheckCircle, Clock, AlertTriangle, Eye, MapPin, Package } from 'lucide-react';

export default function InspectorPortal() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', red: '#EF4444' };

  const kpis = [
    { label: 'ASSIGNED', value: '3', icon: FileText, color: '#3B82F6' },
    { label: 'TODAY', value: '1', icon: Calendar, color: s.gold },
    { label: 'AWAITING SAMPLE', value: '1', icon: Beaker, color: '#F59E0B' },
    { label: 'REPORTS PENDING', value: '1', icon: Clock, color: '#F59E0B' },
    { label: 'PASSED', value: '5', icon: CheckCircle, color: s.green },
    { label: 'FAILED', value: '1', icon: AlertTriangle, color: s.red },
  ];

  const assignments = [
    { txn: 'MASAR-SES-2026-000001', commodity: 'Sesame', qty: '1,000 MT', location: 'Lagos, Nigeria', status: 'Report Submitted', result: 'PASS', date: '25 Aug 2026' },
    { txn: 'MASAR-SES-2026-000002', commodity: 'Sesame', qty: '500 MT', location: 'Kano, Nigeria', status: 'Scheduled', result: 'Pending', date: '28 Aug 2026' },
    { txn: 'MASAR-CAS-2026-000003', commodity: 'Cashew', qty: '300 MT', location: 'Abuja, Nigeria', status: 'Awaiting Sample', result: 'Pending', date: '30 Aug 2026' },
  ];

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Search size={18} color={s.gold} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em' }}>INSPECTION PARTNER PORTAL</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: s.text, marginBottom: '2px' }}>Inspection Workbench</h1>
            <p style={{ fontSize: '13px', color: s.textSec }}>SGS Nigeria · Independent Inspection Partner</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {kpis.map((kpi, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '10px', border: `1px solid ${s.border}`, padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontSize: '9px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>{kpi.label}</span>
                <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: `${kpi.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><kpi.icon size={12} color={kpi.color} /></div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: s.text }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Assigned Inspections</h3>
          </div>
          {assignments.map((a, idx) => (
            <div key={idx} style={{ padding: '16px 18px', borderBottom: idx < assignments.length - 1 ? `1px solid ${s.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: s.text, fontFamily: 'monospace' }}>{a.txn}</span>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#98A2B3', display: 'flex', alignItems: 'center', gap: '4px' }}><Package size={10} /> {a.commodity} · {a.qty}</span>
                    <span style={{ fontSize: '11px', color: '#98A2B3', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={10} /> {a.location}</span>
                    <span style={{ fontSize: '11px', color: '#98A2B3', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={10} /> {a.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: a.status === 'Report Submitted' ? s.green : a.status === 'Scheduled' ? '#3B82F6' : '#F59E0B', padding: '3px 8px', background: a.status === 'Report Submitted' ? '#F0FDF4' : a.status === 'Scheduled' ? '#EFF6FF' : '#FFFBEB', borderRadius: '4px' }}>{a.status}</span>
                  {a.result !== 'Pending' && <span style={{ fontSize: '10px', fontWeight: 700, color: a.result === 'PASS' ? s.green : s.red, padding: '3px 8px', background: a.result === 'PASS' ? '#F0FDF4' : '#FEF2F2', borderRadius: '4px' }}>{a.result}</span>}
                </div>
              </div>
              {/* Required Tests */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Moisture', 'Purity', 'Foreign Matter', 'Aflatoxin', 'Weight', 'Packaging'].map((test, i) => (
                  <span key={i} style={{ fontSize: '10px', padding: '3px 8px', background: a.result === 'PASS' ? '#F0FDF4' : '#F9FAFB', border: `1px solid ${a.result === 'PASS' ? '#BBF7D0' : '#E5E7EB'}`, borderRadius: '4px', color: a.result === 'PASS' ? s.green : s.textSec }}>
                    {a.result === 'PASS' ? '✓' : '○'} {test}
                  </span>
                ))}
              </div>
              {a.status !== 'Report Submitted' && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                  {a.status === 'Scheduled' && <button style={{ padding: '6px 14px', background: s.navy, color: 'white', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Accept Inspection</button>}
                  {a.status === 'Awaiting Sample' && <button style={{ padding: '6px 14px', background: s.navy, color: 'white', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Collect Sample</button>}
                  <button style={{ padding: '6px 14px', background: 'white', border: `1px solid ${s.border}`, borderRadius: '6px', fontSize: '11px', color: s.textSec, cursor: 'pointer' }}>View Details</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
