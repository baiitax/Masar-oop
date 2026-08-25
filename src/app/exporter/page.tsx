'use client';
import React from 'react';
import DashboardLayout from '@/app/dashboard/layout';
import { 
  Truck, FileText, Search, DollarSign, Ship, CheckCircle, Clock, Star,
  TrendingUp, Eye, Plus, Package, Shield, Award, BarChart3, Activity
} from 'lucide-react';

export default function ExporterPortal() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F6F8FB', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A' };

  const kpis = [
    { label: 'OPEN OPPORTUNITIES', value: '3', icon: FileText, color: '#3B82F6' },
    { label: 'ACTIVE ORDERS', value: '2', icon: Package, color: s.gold },
    { label: 'AVAILABLE SUPPLY', value: '1,500 MT', icon: Truck, color: s.green },
    { label: 'COMPLIANCE', value: '94%', icon: Shield, color: s.green },
    { label: 'TRUST SCORE', value: '94', icon: Star, color: s.gold },
    { label: 'PENDING PAYMENTS', value: '$180K', icon: DollarSign, color: '#F59E0B' },
  ];

  const orders = [
    { id: 'MASAR-SES-2026-000001', buyer: 'Al Rajhi Foods', commodity: 'Sesame', qty: '1,000 MT', value: '$500,000', stage: 'In Transit', payment: 'Pending', progress: 75 },
    { id: 'MASAR-SES-2026-000002', buyer: 'SGT Foods', commodity: 'Sesame', qty: '500 MT', value: '$250,000', stage: 'Compliance', payment: 'N/A', progress: 40 },
  ];

  const automationSteps = [
    { step: 'Contract Task', status: 'complete', desc: 'Contract executed' },
    { step: 'Compliance Checklist', status: 'complete', desc: 'All documents verified' },
    { step: 'Inspection Request', status: 'complete', desc: 'Inspection passed' },
    { step: 'Financing Option', status: 'active', desc: 'Finance approved' },
    { step: 'Shipment Preparation', status: 'pending', desc: 'Awaiting release' },
    { step: 'Payment Tracking', status: 'pending', desc: 'Settlement pending' },
  ];

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>🇳🇬</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em' }}>EXPORTER PORTAL</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: s.text, marginBottom: '2px' }}>Export Operations</h1>
            <p style={{ fontSize: '13px', color: s.textSec }}>Dangote Agro Sesame Export Ltd. · Nigeria</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '8px 14px', background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', borderRadius: '8px', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color={s.gold} />
              <span style={{ fontSize: '14px', fontWeight: 800, color: s.text }}>94</span>
              <span style={{ fontSize: '10px', color: s.gold }}>Trust Score</span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
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

        {/* Orders + Automation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
          {/* Orders */}
          <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Active Orders</h3>
            </div>
            {orders.map((order, idx) => (
              <div key={idx} style={{ padding: '14px 18px', borderBottom: idx < orders.length - 1 ? `1px solid ${s.border}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div><span style={{ fontSize: '12px', fontWeight: 700, color: s.text, fontFamily: 'monospace' }}>{order.id}</span><p style={{ fontSize: '11px', color: '#98A2B3', margin: '2px 0 0' }}>{order.buyer}</p></div>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: order.stage === 'In Transit' ? '#3B82F6' : s.gold, padding: '3px 8px', background: order.stage === 'In Transit' ? '#EFF6FF' : '#FFFBEB', borderRadius: '4px' }}>{order.stage}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ padding: '6px', background: '#F9FAFB', borderRadius: '4px' }}><span style={{ fontSize: '9px', color: '#98A2B3' }}>Commodity</span><p style={{ fontSize: '11px', fontWeight: 600, color: s.text, margin: 0 }}>{order.commodity}</p></div>
                  <div style={{ padding: '6px', background: '#F9FAFB', borderRadius: '4px' }}><span style={{ fontSize: '9px', color: '#98A2B3' }}>Quantity</span><p style={{ fontSize: '11px', fontWeight: 600, color: s.text, margin: 0 }}>{order.qty}</p></div>
                  <div style={{ padding: '6px', background: '#F9FAFB', borderRadius: '4px' }}><span style={{ fontSize: '9px', color: '#98A2B3' }}>Value</span><p style={{ fontSize: '11px', fontWeight: 600, color: s.text, margin: 0 }}>{order.value}</p></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#98A2B3' }}>Progress</span>
                  <div style={{ flex: 1, height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: `${order.progress}%`, height: '100%', background: s.green, borderRadius: '2px' }} /></div>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: s.text }}>{order.progress}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Automation Progress */}
          <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Order Automation — MASAR-SES-2026-000001</h3>
              <p style={{ fontSize: '11px', color: '#98A2B3', margin: '2px 0 0' }}>System automatically creates workflow steps</p>
            </div>
            <div style={{ padding: '16px' }}>
              {automationSteps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', paddingBottom: idx < automationSteps.length - 1 ? '16px' : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {step.status === 'complete' ? <CheckCircle size={18} color={s.green} /> : step.status === 'active' ? <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: s.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} /></div> : <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #E5E7EB' }} />}
                    {idx < automationSteps.length - 1 && <div style={{ width: '2px', flex: 1, background: step.status === 'complete' ? '#BBF7D0' : '#E5E7EB', marginTop: '4px' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: step.status === 'pending' ? '#98A2B3' : s.text, margin: 0 }}>{step.step}</p>
                    <p style={{ fontSize: '11px', color: '#98A2B3', margin: '2px 0 0' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
