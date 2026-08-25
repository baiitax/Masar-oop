'use client';
import React from 'react';
import RoleLayout from '@/components/dashboard/RoleLayout';
import { DollarSign, TrendingUp, Clock, CheckCircle, AlertTriangle, BarChart3, Shield, Building2, FileText, Eye, Landmark } from 'lucide-react';

export default function TradeFinancePage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', red: '#EF4444' };

  const requests = [
    { txn: 'MASAR-SES-2026-000001', buyer: 'Al Rajhi Foods', exporter: 'Dangote Sesame', contract: '$500,000', advance: '$400,000', ratio: '80%', inspection: 'Passed', compliance: 'Ready', risk: 'Low', status: 'Approved', score: 86 },
    { txn: 'MASAR-SES-2026-000002', buyer: 'SGT Foods', exporter: 'Dangote Sesame', contract: '$250,000', advance: '$187,500', ratio: '75%', inspection: 'Scheduled', compliance: 'In Progress', risk: 'Low', status: 'Pending', score: 72 },
  ];

  return (
    <RoleLayout>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <DollarSign size={18} color={s.gold} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em' }}>TRADE FINANCE COMMAND CENTER</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: s.text, marginBottom: '2px' }}>Trade Finance Overview</h1>
          <p style={{ fontSize: '13px', color: s.textSec }}>Funding requests, underwriting, exposure management</p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'FUNDING REQUESTED', value: '$1.24M', icon: FileText, color: '#3B82F6' },
            { label: 'APPROVED', value: '$820K', icon: CheckCircle, color: s.green },
            { label: 'FUNDED', value: '$520K', icon: DollarSign, color: s.gold },
            { label: 'OUTSTANDING', value: '$410K', icon: Clock, color: '#F59E0B' },
            { label: 'FACILITY UTIL.', value: '78%', icon: BarChart3, color: '#8B5CF6' },
            { label: 'LOSS RATE', value: '0%', icon: Shield, color: s.green },
          ].map((kpi, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '10px', border: `1px solid ${s.border}`, padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontSize: '9px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>{kpi.label}</span>
                <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: `${kpi.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><kpi.icon size={12} color={kpi.color} /></div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: s.text }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Funding Requests */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Funding Requests</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F9FAFB' }}>
              {['Transaction', 'Buyer', 'Exporter', 'Contract', 'Advance', 'Ratio', 'Inspection', 'Compliance', 'Risk', 'Score', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', borderBottom: `1px solid ${s.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {requests.map((req, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: '12px', fontSize: '11px', fontWeight: 600, color: s.text, fontFamily: 'monospace' }}>{req.txn}</td>
                  <td style={{ padding: '12px', fontSize: '11px', color: s.text }}>{req.buyer}</td>
                  <td style={{ padding: '12px', fontSize: '11px', color: s.text }}>{req.exporter}</td>
                  <td style={{ padding: '12px', fontSize: '11px', fontWeight: 600, color: s.text }}>{req.contract}</td>
                  <td style={{ padding: '12px', fontSize: '11px', fontWeight: 700, color: s.gold }}>{req.advance}</td>
                  <td style={{ padding: '12px', fontSize: '11px', color: s.text }}>{req.ratio}</td>
                  <td style={{ padding: '12px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: req.inspection === 'Passed' ? s.green : '#F59E0B', padding: '3px 6px', background: req.inspection === 'Passed' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{req.inspection}</span></td>
                  <td style={{ padding: '12px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: req.compliance === 'Ready' ? s.green : '#F59E0B', padding: '3px 6px', background: req.compliance === 'Ready' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{req.compliance}</span></td>
                  <td style={{ padding: '12px' }}><span style={{ fontSize: '10px', fontWeight: 700, color: s.green, padding: '3px 6px', background: '#F0FDF4', borderRadius: '4px' }}>{req.risk}</span></td>
                  <td style={{ padding: '12px' }}><span style={{ fontSize: '12px', fontWeight: 700, color: req.score >= 80 ? s.green : '#F59E0B' }}>{req.score}/100</span></td>
                  <td style={{ padding: '12px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: req.status === 'Approved' ? s.green : '#F59E0B', padding: '3px 6px', background: req.status === 'Approved' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{req.status}</span></td>
                  <td style={{ padding: '12px' }}><div style={{ display: 'flex', gap: '4px' }}><button style={{ padding: '4px 8px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: s.green, cursor: 'pointer' }}>Approve</button><button style={{ padding: '4px 8px', background: '#F9FAFB', border: `1px solid ${s.border}`, borderRadius: '4px', cursor: 'pointer' }}><Eye size={10} color="#98A2B3" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RoleLayout>
  );
}
