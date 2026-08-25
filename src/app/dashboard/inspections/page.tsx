'use client';
import React, { useState } from 'react';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { Search, CheckCircle, Clock, XCircle, AlertTriangle, Eye, Beaker, Calendar, FileText } from 'lucide-react';
import { inspections, getTransactionById } from '@/lib/data';

export default function InspectionsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', red: '#EF4444', amber: '#F59E0B' };

  const metrics = [
    { label: 'SCHEDULED', value: String(inspections.filter(i => i.status === 'SCHEDULED').length), icon: Calendar, color: '#3B82F6' },
    { label: 'IN PROGRESS', value: String(inspections.filter(i => i.status === 'IN_PROGRESS').length), icon: Clock, color: s.amber },
    { label: 'PASSED', value: String(inspections.filter(i => i.result === 'PASS').length), icon: CheckCircle, color: s.green },
    { label: 'FAILED', value: String(inspections.filter(i => i.result === 'FAIL').length), icon: XCircle, color: s.red },
  ];

  return (
    <DashboardPage title="Inspection & Quality Control" subtitle="Independent inspection orchestration and laboratory results management." breadcrumbs={[{ label: 'Quality' }, { label: 'Inspections' }]} metrics={metrics}>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: '16px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F9FAFB' }}>
              {['Transaction', 'Inspector', 'Scheduled', 'Completed', 'Status', 'Result', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', borderBottom: `1px solid ${s.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {inspections.map(insp => {
                const txn = getTransactionById(insp.transactionId);
                return (
                  <tr key={insp.id} onClick={() => setSelected(insp.id)} style={{ cursor: 'pointer', background: selected === insp.id ? '#FFFBEB' : 'white', borderBottom: `1px solid ${s.border}` }}>
                    <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text, fontFamily: 'monospace' }}>{txn?.masarId || 'N/A'}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{insp.inspectorName}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: s.textSec }}>{insp.scheduledDate}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: s.textSec }}>{insp.completedDate || '—'}</td>
                    <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: insp.status === 'COMPLETED' ? s.green : '#3B82F6', padding: '3px 8px', background: insp.status === 'COMPLETED' ? '#F0FDF4' : '#EFF6FF', borderRadius: '4px' }}>{insp.status}</span></td>
                    <td style={{ padding: '12px 14px' }}>{insp.result && <span style={{ fontSize: '10px', fontWeight: 700, color: insp.result === 'PASS' ? s.green : insp.result === 'FAIL' ? s.red : s.amber, padding: '3px 8px', background: insp.result === 'PASS' ? '#F0FDF4' : insp.result === 'FAIL' ? '#FEF2F2' : '#FFFBEB', borderRadius: '4px' }}>{insp.result}</span>}</td>
                    <td style={{ padding: '12px 14px' }}><button style={{ padding: '4px 8px', background: '#F9FAFB', border: `1px solid ${s.border}`, borderRadius: '4px', cursor: 'pointer' }}><Eye size={12} color={s.textSec} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selected && (() => {
          const insp = inspections.find(i => i.id === selected);
          if (!insp) return null;
          const txn = getTransactionById(insp.transactionId);
          return (
            <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '20px', position: 'sticky', top: '80px' }}>
              <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: `1px solid ${s.border}`, marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: insp.result === 'PASS' ? '#F0FDF4' : insp.result === 'FAIL' ? '#FEF2F2' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Beaker size={24} color={insp.result === 'PASS' ? s.green : insp.result === 'FAIL' ? s.red : s.amber} /></div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text, margin: 0 }}>{txn?.masarId}</h3>
                <p style={{ fontSize: '12px', color: '#98A2B3', margin: '2px 0' }}>{insp.inspectorName}</p>
                {insp.result && <span style={{ fontSize: '14px', fontWeight: 800, color: insp.result === 'PASS' ? s.green : s.red }}>{insp.result}</span>}
              </div>
              {insp.testResults && (
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>TEST RESULTS</span>
                  {insp.testResults.map((test, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: test.status === 'PASS' ? '#F0FDF4' : '#FEF2F2', borderRadius: '6px', marginTop: '6px' }}>
                      <div><p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{test.parameter}</p><p style={{ fontSize: '10px', color: '#98A2B3', margin: 0 }}>Threshold: {test.threshold}</p></div>
                      <div style={{ textAlign: 'right' }}><p style={{ fontSize: '12px', fontWeight: 700, color: test.status === 'PASS' ? s.green : s.red, margin: 0 }}>{test.value}</p><span style={{ fontSize: '9px', fontWeight: 600, color: test.status === 'PASS' ? s.green : s.red }}>{test.status}</span></div>
                    </div>
                  ))}
                </div>
              )}
              {insp.notes && <div style={{ marginTop: '12px', padding: '10px', background: insp.result === 'FAIL' ? '#FEF2F2' : '#F9FAFB', borderRadius: '6px', borderLeft: `3px solid ${insp.result === 'FAIL' ? s.red : s.gold}` }}><p style={{ fontSize: '12px', color: s.text, margin: 0 }}>{insp.notes}</p></div>}
            </div>
          );
        })()}
      </div>
    </DashboardPage>
  );
}
