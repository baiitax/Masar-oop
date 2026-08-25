'use client';
import React, { useState } from 'react';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { FolderOpen, FileText, CheckCircle, Clock, Eye, Download, Shield, Hash, Calendar, Building2, Filter as FilterIcon } from 'lucide-react';
import { documents, getTransactionById } from '@/lib/data';

export default function DocumentsPage() {
  const [filter, setFilter] = useState('all');
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A' };

  const filtered = filter === 'all' ? documents : documents.filter(d => d.verificationStatus.toLowerCase() === filter);

  const metrics = [
    { label: 'TOTAL DOCUMENTS', value: String(documents.length), icon: FolderOpen, color: '#3B82F6' },
    { label: 'VERIFIED', value: String(documents.filter(d => d.verificationStatus === 'VERIFIED').length), icon: CheckCircle, color: s.green },
    { label: 'UNDER REVIEW', value: String(documents.filter(d => d.verificationStatus === 'UNDER_REVIEW').length), icon: Clock, color: '#F59E0B' },
    { label: 'HASH COVERAGE', value: '100%', icon: Shield, color: s.gold },
  ];

  return (
    <DashboardPage title="Document Vault" subtitle="Secure transaction document repository with cryptographic integrity verification." breadcrumbs={[{ label: 'Compliance' }, { label: 'Documents' }]} metrics={metrics}
      filters={<div style={{ display: 'flex', gap: '6px' }}>{['all', 'verified', 'under_review', 'uploaded'].map(f => (<button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(filter === f ? { background: s.navy, color: 'white' } : { background: '#F3F4F6', color: s.textSec }) }}>{f === 'all' ? 'All' : f.replace('_', ' ')}</button>))}</div>}
    >
      <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F9FAFB' }}>
            {['Document', 'Type', 'Transaction', 'Issued By', 'Status', 'Verified By', 'Version', 'Hash', 'Actions'].map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', borderBottom: `1px solid ${s.border}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(doc => {
              const txn = getTransactionById(doc.transactionId);
              return (
                <tr key={doc.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: '12px 14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} color="#3B82F6" /><span style={{ fontSize: '12px', fontWeight: 600, color: s.text }}>{doc.type}</span></div></td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.textSec }}>{doc.type}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text, fontFamily: 'monospace' }}>{txn?.masarId || 'N/A'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.textSec }}>{doc.issuingOrganization}</td>
                  <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: doc.verificationStatus === 'VERIFIED' ? s.green : '#F59E0B', padding: '3px 8px', background: doc.verificationStatus === 'VERIFIED' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{doc.verificationStatus}</span></td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.textSec }}>{doc.verifier || '—'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>v{doc.version}</td>
                  <td style={{ padding: '12px 14px', fontSize: '10px', color: '#98A2B3', fontFamily: 'monospace' }}>{doc.hash.substring(0, 12)}...</td>
                  <td style={{ padding: '12px 14px' }}><div style={{ display: 'flex', gap: '4px' }}><button style={{ padding: '4px 8px', background: '#F9FAFB', border: `1px solid ${s.border}`, borderRadius: '4px', cursor: 'pointer' }}><Eye size={12} color={s.textSec} /></button><button style={{ padding: '4px 8px', background: '#F9FAFB', border: `1px solid ${s.border}`, borderRadius: '4px', cursor: 'pointer' }}><Download size={12} color={s.textSec} /></button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardPage>
  );
}
