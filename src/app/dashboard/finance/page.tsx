'use client';
import React from 'react';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { DollarSign, TrendingUp, Clock, CheckCircle, Building2, FileText, Percent, Calendar, Banknote, ArrowUpRight, Shield } from 'lucide-react';
import { financeRequests, getTransactionById, formatCurrency } from '@/lib/data';

export default function FinancePage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A' };

  const totalFinanced = financeRequests.filter(f => f.status === 'APPROVED').reduce((sum, f) => sum + f.requestedAmount, 0);

  const metrics = [
    { label: 'FINANCING PIPELINE', value: '$1.24M', icon: TrendingUp, color: '#3B82F6' },
    { label: 'APPROVED', value: '$820K', icon: CheckCircle, color: s.green },
    { label: 'FUNDED', value: '$520K', icon: Banknote, color: s.gold },
    { label: 'OUTSTANDING', value: '$410K', icon: Clock, color: '#F59E0B' },
    { label: 'AT RISK', value: '$0', icon: Shield, color: s.green },
  ];

  return (
    <DashboardPage title="Trade Finance" subtitle="Finance request management, capital partner coordination and settlement tracking." breadcrumbs={[{ label: 'Finance' }]} metrics={metrics}>
      {/* Finance Partner Dashboard */}
      <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text, marginBottom: '16px' }}>Capital Partner Dashboard — Afreximbank</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { l: 'Total Financed', v: formatCurrency(totalFinanced) },
            { l: 'Outstanding', v: formatCurrency(totalFinanced) },
            { l: 'Buyer Concentration', v: 'Al Rajhi: 60%' },
            { l: 'Transaction Score', v: '94/100' },
            { l: 'Defaults', v: '0' },
            { l: 'Losses', v: '$0' },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', color: '#98A2B3' }}>{item.l}</span>
              <p style={{ fontSize: '16px', fontWeight: 700, color: s.text, margin: '2px 0 0' }}>{item.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Finance Requests */}
      <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${s.border}` }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Finance Requests</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F9FAFB' }}>
            {['Transaction', 'Invoice Value', 'Advance Rate', 'Requested', 'Capital Partner', 'Status', 'Submitted'].map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', borderBottom: `1px solid ${s.border}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {financeRequests.map(req => {
              const txn = getTransactionById(req.transactionId);
              return (
                <tr key={req.id} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text, fontFamily: 'monospace' }}>{txn?.masarId || 'N/A'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text }}>{formatCurrency(req.invoiceValue)}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{req.requestedAdvance}%</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 700, color: s.gold }}>{formatCurrency(req.requestedAmount)}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.textSec }}>{req.capitalPartner}</td>
                  <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: req.status === 'APPROVED' ? s.green : '#F59E0B', padding: '3px 8px', background: req.status === 'APPROVED' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{req.status}</span></td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.textSec }}>{req.submittedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardPage>
  );
}
