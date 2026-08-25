'use client';
import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/dashboard/layout';
import { 
  Package, FileText, Search, Ship, DollarSign, MessageSquare, Clock, CheckCircle,
  ArrowUpRight, TrendingUp, Eye, Plus, AlertTriangle, MapPin, Calendar, Truck, Shield
} from 'lucide-react';

export default function BuyerPortal() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F6F8FB', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', red: '#EF4444', blue: '#3B82F6' };

  const kpis = [
    { label: 'OPEN RFQS', value: '2', icon: FileText, color: s.blue },
    { label: 'ACTIVE PURCHASES', value: '3', icon: Package, color: s.gold },
    { label: 'IN TRANSIT', value: '1', icon: Ship, color: '#8B5CF6' },
    { label: 'DELIVERED', value: '8', icon: CheckCircle, color: s.green },
    { label: 'TOTAL PROCUREMENT', value: '$2.4M', icon: DollarSign, color: s.gold },
  ];

  const purchases = [
    { id: 'MASAR-SES-2026-000001', commodity: 'Sesame', qty: '1,000 MT', value: '$500,000', supplier: 'Dangote Sesame', stage: 'In Transit', eta: '08 Sep 2026', compliance: 94, inspection: 'Passed' },
    { id: 'MASAR-SES-2026-000002', commodity: 'Sesame', qty: '500 MT', value: '$250,000', supplier: 'Dangote Sesame', stage: 'Compliance', eta: 'Pending', compliance: 72, inspection: 'Scheduled' },
    { id: 'MASAR-CAS-2026-000003', commodity: 'Cashew', qty: '300 MT', value: '$180,000', supplier: 'NPG Exports', stage: 'Financing', eta: 'Pending', compliance: 85, inspection: 'Pending' },
  ];

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>🇸🇦</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em' }}>BUYER PORTAL</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: s.text, marginBottom: '2px' }}>Your Trade Desk</h1>
            <p style={{ fontSize: '13px', color: s.textSec }}>Al Rajhi Foods · Saudi Arabia</p>
          </div>
          <button style={{ padding: '8px 16px', background: s.navy, color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={14} /> Create RFQ</button>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px', marginBottom: '20px' }}>
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

        {/* Purchases */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Active Purchases</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F9FAFB' }}>
              {['Transaction', 'Commodity', 'Quantity', 'Value', 'Supplier', 'Stage', 'Compliance', 'Inspection', 'ETA', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', borderBottom: `1px solid ${s.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {purchases.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text, fontFamily: 'monospace' }}>{p.id}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{p.commodity}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{p.qty}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text }}>{p.value}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{p.supplier}</td>
                  <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: p.stage === 'In Transit' ? s.blue : s.gold, padding: '3px 8px', background: p.stage === 'In Transit' ? '#EFF6FF' : '#FFFBEB', borderRadius: '4px' }}>{p.stage}</span></td>
                  <td style={{ padding: '12px 14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '30px', height: '3px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${p.compliance}%`, height: '100%', background: p.compliance >= 75 ? s.green : s.gold, borderRadius: '2px' }} /></div><span style={{ fontSize: '10px', fontWeight: 600 }}>{p.compliance}%</span></div></td>
                  <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: p.inspection === 'Passed' ? s.green : p.inspection === 'Scheduled' ? s.gold : '#98A2B3', padding: '3px 8px', background: p.inspection === 'Passed' ? '#F0FDF4' : p.inspection === 'Scheduled' ? '#FFFBEB' : '#F9FAFB', borderRadius: '4px' }}>{p.inspection}</span></td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.textSec }}>{p.eta}</td>
                  <td style={{ padding: '12px 14px' }}><button style={{ padding: '4px 8px', background: '#F9FAFB', border: `1px solid ${s.border}`, borderRadius: '4px', cursor: 'pointer' }}><Eye size={12} color={s.textSec} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* What buyer cares about */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '20px', marginTop: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text, marginBottom: '12px' }}>What You Need to Know</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { q: 'What did I buy?', a: '3 active purchases across sesame and cashew', icon: Package },
              { q: 'Where is it?', a: '1 shipment in transit, ETA Sep 8', icon: Ship },
              { q: 'Has it passed inspection?', a: '1 passed, 1 scheduled, 1 pending', icon: Search },
              { q: 'Is everything compliant?', a: 'Average compliance: 84%', icon: Shield },
              { q: 'What do I need to do?', a: 'No pending actions required', icon: CheckCircle },
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '14px', background: '#F9FAFB', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <item.icon size={14} color={s.gold} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: s.text }}>{item.q}</span>
                </div>
                <p style={{ fontSize: '12px', color: s.textSec, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
