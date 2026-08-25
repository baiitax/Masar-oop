'use client';
import React from 'react';
import RoleLayout from '@/components/dashboard/RoleLayout';
import { BarChart3, TrendingUp, DollarSign, FileText, Landmark, CheckCircle, Percent, Users, Banknote, Shield, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export default function CFOPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', red: '#EF4444' };

  const kpis = [
    { label: 'GMV', value: '$3.84M', change: '+$420K', trend: 'up', icon: TrendingUp, color: s.gold },
    { label: 'RECOGNIZED REVENUE', value: '$142K', change: '+18%', trend: 'up', icon: DollarSign, color: s.green },
    { label: 'PENDING REVENUE', value: '$38K', change: 'In pipeline', trend: 'neutral', icon: Clock, color: '#F59E0B' },
    { label: 'PLATFORM FEES', value: '$96K', change: '3.7% take rate', trend: 'up', icon: Percent, color: '#3B82F6' },
    { label: 'GROSS MARGIN', value: '68%', change: '+2% QoQ', trend: 'up', icon: BarChart3, color: s.green },
    { label: 'CONTRIBUTION/TRADE', value: '$4,200', change: '+$300', trend: 'up', icon: DollarSign, color: s.gold },
    { label: 'OPERATING EXPENSE', value: '$89K', change: 'On budget', trend: 'neutral', icon: FileText, color: '#8B5CF6' },
    { label: 'CASH RUNWAY', value: '18 months', change: 'Healthy', trend: 'up', icon: Banknote, color: s.green },
  ];

  const revenueBreakdown = [
    { source: 'Platform Fees', amount: '$96K', pct: '67.6%', desc: 'Transaction coordination fees' },
    { source: 'Compliance Fees', amount: '$24K', pct: '16.9%', desc: 'Compliance management fees' },
    { source: 'Inspection Orchestration', amount: '$12K', pct: '8.5%', desc: 'Inspection coordination fees' },
    { source: 'Settlement Fees', amount: '$10K', pct: '7.0%', desc: 'Settlement coordination fees' },
  ];

  return (
    <RoleLayout>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <BarChart3 size={18} color={s.gold} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em' }}>FINANCIAL CONTROL CENTER</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: s.text, marginBottom: '2px' }}>CFO Financial Overview</h1>
          <p style={{ fontSize: '13px', color: s.textSec }}>Revenue, GMV, settlement, reconciliation, and financial controls</p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {kpis.map((kpi, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '10px', border: `1px solid ${s.border}`, padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontSize: '9px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>{kpi.label}</span>
                <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: `${kpi.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><kpi.icon size={12} color={kpi.color} /></div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: s.text, lineHeight: 1, marginBottom: '3px' }}>{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {kpi.trend === 'up' ? <ArrowUpRight size={10} color={s.green} /> : kpi.trend === 'down' ? <ArrowDownRight size={10} color={s.red} /> : null}
                <span style={{ fontSize: '10px', color: kpi.trend === 'up' ? s.green : kpi.trend === 'down' ? s.red : '#98A2B3' }}>{kpi.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Breakdown */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Revenue Breakdown</h3>
          </div>
          {revenueBreakdown.map((rev, idx) => (
            <div key={idx} style={{ padding: '14px 18px', borderBottom: idx < revenueBreakdown.length - 1 ? `1px solid ${s.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: s.text, margin: 0 }}>{rev.source}</p>
                <p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>{rev.desc}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: s.text, margin: 0 }}>{rev.amount}</p>
                <p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>{rev.pct}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleLayout>
  );
}
