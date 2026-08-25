'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { FileText, TrendingUp, AlertTriangle, CheckCircle, Clock, Ship, DollarSign, Eye, ChevronRight, Search, Filter, ArrowUpRight, Shield, Package } from 'lucide-react';
import { transactions, getBuyerById, getExporterById, formatCurrency, getClearanceScoreColor, getClearanceScoreLabel } from '@/lib/data';

export default function TransactionsPage() {
  const [view, setView] = useState('list');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', red: '#EF4444', amber: '#F59E0B' };

  const filtered = filter === 'all' ? transactions : filter === 'active' ? transactions.filter(t => !['COMPLETED','SETTLED','CANCELLED'].includes(t.status)) : filter === 'risk' ? transactions.filter(t => ['HIGH','CRITICAL'].includes(t.riskLevel)) : transactions.filter(t => ['COMPLETED','SETTLED'].includes(t.status));

  const metrics = [
    { label: 'TOTAL TRANSACTIONS', value: String(transactions.length), icon: FileText, color: '#3B82F6' },
    { label: 'ACTIVE', value: String(transactions.filter(t => !['COMPLETED','SETTLED','CANCELLED'].includes(t.status)).length), icon: Clock, color: s.gold },
    { label: 'COMPLETED', value: String(transactions.filter(t => ['COMPLETED','SETTLED'].includes(t.status)).length), icon: CheckCircle, color: s.green },
    { label: 'AT RISK', value: String(transactions.filter(t => ['HIGH','CRITICAL'].includes(t.riskLevel)).length), icon: AlertTriangle, color: s.red },
    { label: 'TOTAL GMV', value: formatCurrency(transactions.reduce((sum, t) => sum + t.contractValue, 0)), icon: DollarSign, color: s.gold },
  ];

  const stageColors: Record<string, string> = {
    'DRAFT': '#667085', 'RFQ_OPEN': '#667085', 'COUNTERPARTIES_VERIFIED': '#3B82F6', 'COMMERCIAL_AGREEMENT': '#8B5CF6',
    'CONTRACT_EXECUTED': '#8B5CF6', 'COMPLIANCE_IN_PROGRESS': '#F59E0B', 'CLEARANCE_READY': '#10B981',
    'INSPECTION_PENDING': '#C9A24A', 'INSPECTION_PASSED': '#10B981', 'FINANCING_APPROVED': '#10B981',
    'FUNDS_SECURED': '#10B981', 'SHIPMENT_RELEASED': '#3B82F6', 'IN_TRANSIT': '#3B82F6',
    'PORT_VERIFICATION': '#F59E0B', 'RELEASE_ELIGIBLE': '#16A34A', 'FUNDS_RELEASED': '#16A34A',
    'SETTLED': '#16A34A', 'COMPLETED': '#16A34A', 'INSPECTION_FAILED': '#EF4444', 'COMPLIANCE_FAILED': '#EF4444',
  };

  return (
    <DashboardPage title="All Transactions" subtitle="Manage the complete transaction lifecycle across the Saudi–Africa corridor." breadcrumbs={[{ label: 'Transactions' }]} metrics={metrics}
      filters={
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'active', 'completed', 'risk'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(filter === f ? { background: s.navy, color: 'white' } : { background: '#F3F4F6', color: s.textSec }) }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: '16px' }}>
        {/* Transaction List */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Transaction', 'Buyer', 'Exporter', 'Commodity', 'Value', 'Stage', 'Risk', 'Clearance', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', borderBottom: `1px solid ${s.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(txn => {
                  const buyer = getBuyerById(txn.buyerId);
                  const exporter = getExporterById(txn.exporterId);
                  const isSelected = selected === txn.id;
                  return (
                    <tr key={txn.id} onClick={() => setSelected(txn.id)} style={{ cursor: 'pointer', background: isSelected ? '#FFFBEB' : 'white', borderBottom: `1px solid ${s.border}`, transition: 'background 0.2s' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: s.text, fontFamily: 'monospace' }}>{txn.masarId}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{buyer?.tradingName || 'N/A'}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{exporter?.tradingName || 'N/A'}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{txn.commodity}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text }}>{formatCurrency(txn.contractValue)}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: stageColors[txn.status] || '#667085', padding: '3px 8px', background: `${stageColors[txn.status] || '#667085'}10`, borderRadius: '4px' }}>{txn.status.replace(/_/g, ' ')}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: txn.riskLevel === 'LOW' ? s.green : txn.riskLevel === 'MEDIUM' ? s.amber : s.red, padding: '3px 8px', background: txn.riskLevel === 'LOW' ? '#F0FDF4' : txn.riskLevel === 'MEDIUM' ? '#FFFBEB' : '#FEF2F2', borderRadius: '4px' }}>{txn.riskLevel}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '40px', height: '4px', background: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${txn.clearanceScore.total}%`, height: '100%', background: txn.clearanceScore.total >= 75 ? s.green : txn.clearanceScore.total >= 50 ? s.amber : s.red, borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: s.text }}>{txn.clearanceScore.total}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button style={{ padding: '4px 8px', background: '#F9FAFB', border: `1px solid ${s.border}`, borderRadius: '4px', fontSize: '11px', color: s.textSec, cursor: 'pointer' }}><Eye size={12} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (() => {
          const txn = transactions.find(t => t.id === selected);
          if (!txn) return null;
          const buyer = getBuyerById(txn.buyerId);
          const exporter = getExporterById(txn.exporterId);
          return (
            <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '20px', position: 'sticky', top: '80px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: s.text, fontFamily: 'monospace' }}>{txn.masarId}</span>
                  <p style={{ fontSize: '12px', color: s.textSec, margin: '2px 0 0' }}>{txn.commodity} · {txn.quantity}</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#98A2B3' }}>✕</button>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>TRANSACTION LIFECYCLE</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                  {txn.timeline.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', background: step.completed ? '#F0FDF4' : '#F9FAFB', border: `1px solid ${step.completed ? '#BBF7D0' : '#E5E7EB'}` }}>
                      {step.completed ? <CheckCircle size={10} color={s.green} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D0D5DD' }} />}
                      <span style={{ fontSize: '9px', fontWeight: 500, color: step.completed ? s.green : '#98A2B3' }}>{step.stage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                {[
                  { l: 'Buyer', v: buyer?.tradingName || 'N/A' },
                  { l: 'Exporter', v: exporter?.tradingName || 'N/A' },
                  { l: 'Value', v: formatCurrency(txn.contractValue) },
                  { l: 'Incoterm', v: txn.incoterm },
                  { l: 'Origin', v: txn.origin },
                  { l: 'Destination', v: txn.destination },
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}>
                    <span style={{ fontSize: '9px', color: '#98A2B3' }}>{item.l}</span>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{item.v}</p>
                  </div>
                ))}
              </div>

              {/* Clearance Score */}
              <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>CLEARANCE SCORE</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: txn.clearanceScore.total >= 75 ? s.green : txn.clearanceScore.total >= 50 ? s.amber : s.red }}>{txn.clearanceScore.total}</span>
                </div>
                {[
                  { l: 'Exporter Verification', v: txn.clearanceScore.exporterVerification, m: 15 },
                  { l: 'Buyer Verification', v: txn.clearanceScore.buyerVerification, m: 10 },
                  { l: 'Documentation', v: txn.clearanceScore.commodityDocumentation, m: 15 },
                  { l: 'Lab/COA', v: txn.clearanceScore.labCOA, m: 15 },
                  { l: 'Phytosanitary', v: txn.clearanceScore.phytosanitary, m: 10 },
                  { l: 'Saudi Import', v: txn.clearanceScore.saudiImportReadiness, m: 15 },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', color: '#98A2B3', width: '100px' }}>{item.l}</span>
                    <div style={{ flex: 1, height: '3px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${(item.v / item.m) * 100}%`, height: '100%', background: item.v === item.m ? s.green : item.v > 0 ? s.amber : '#E5E7EB', borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: s.text, width: '30px', textAlign: 'right' }}>{item.v}/{item.m}</span>
                  </div>
                ))}
              </div>

              {/* Exceptions */}
              {txn.exceptions.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>EXCEPTIONS</span>
                  {txn.exceptions.map((exc, idx) => (
                    <div key={idx} style={{ padding: '10px', borderLeft: `3px solid ${exc.severity === 'CRITICAL' ? s.red : s.amber}`, background: exc.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB', borderRadius: '0 6px 6px 0', marginTop: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{exc.description}</p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '10px', color: '#98A2B3' }}>Owner: {exc.assignedTo}</span>
                        <span style={{ fontSize: '10px', color: '#98A2B3' }}>Due: {exc.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link href={`/dashboard/transactions`} style={{ display: 'block', textAlign: 'center', padding: '10px', background: s.navy, color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Open Full Transaction</Link>
            </div>
          );
        })()}
      </div>
    </DashboardPage>
  );
}
