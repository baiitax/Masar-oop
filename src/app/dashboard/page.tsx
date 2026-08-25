'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, Users, Truck, FileText, AlertTriangle, CheckCircle, Clock, 
  DollarSign, Ship, Shield, Activity, Globe, Package, ArrowUpRight, ArrowRight,
  Eye, Banknote, Scale, Target, ChevronRight, MapPin, Calendar, BarChart3,
  ArrowDownRight, Minus, RefreshCw, Download, Filter, Search
} from 'lucide-react';
import { transactions, buyers, exporters, formatCurrency, getClearanceScoreColor, getClearanceScoreLabel } from '@/lib/data';

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F6F8FB', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', red: '#EF4444', amber: '#F59E0B' };

  const activeTxns = transactions.filter(t => !['COMPLETED', 'CANCELLED', 'SETTLED'].includes(t.status));
  const completedTxns = transactions.filter(t => ['COMPLETED', 'SETTLED'].includes(t.status));
  const totalGMV = transactions.reduce((sum, t) => sum + t.contractValue, 0);
  const exceptions = transactions.flatMap(t => t.exceptions.map(e => ({ ...e, transactionId: t.masarId, commodity: t.commodity })));

  // Pipeline stages
  const pipelineStages = [
    { label: 'RFQ', count: 4, color: '#667085' },
    { label: 'Verification', count: 3, color: '#3B82F6' },
    { label: 'Contracting', count: 2, color: '#8B5CF6' },
    { label: 'Compliance', count: 3, color: '#F59E0B' },
    { label: 'Inspection', count: 2, color: '#C9A24A' },
    { label: 'Financing', count: 2, color: '#10B981' },
    { label: 'Shipment', count: 4, color: '#3B82F6' },
    { label: 'Port Verif.', count: 1, color: '#F59E0B' },
    { label: 'Release', count: 1, color: '#16A34A' },
    { label: 'Completed', count: 12, color: '#16A34A' },
  ];

  // KPI Cards
  const kpis = [
    { label: 'ACTIVE TRANSACTIONS', value: '07', change: '+2 this week', trend: 'up', icon: FileText, color: '#3B82F6' },
    { label: 'PIPELINE GMV', value: '$3.84M', change: '+$420K this month', trend: 'up', icon: TrendingUp, color: s.gold },
    { label: 'CONTRACTED GMV', value: '$1.92M', change: '50% of pipeline', trend: 'neutral', icon: Shield, color: '#8B5CF6' },
    { label: 'IN-TRANSIT VALUE', value: '$740K', change: '2 shipments', trend: 'up', icon: Ship, color: '#3B82F6' },
    { label: 'FINANCED', value: '$520K', change: 'Afreximbank', trend: 'up', icon: Banknote, color: '#10B981' },
    { label: 'PENDING RELEASE', value: '$310K', change: '1 transaction', trend: 'neutral', icon: Lock, color: s.gold },
    { label: 'AT-RISK', value: '02', change: 'Compliance issues', trend: 'down', icon: AlertTriangle, color: '#EF4444' },
    { label: 'DISPUTES', value: '01', change: 'Under mediation', trend: 'down', icon: Scale, color: '#EF4444' },
  ];

  // Transaction cards for pipeline
  const txnCards = [
    { id: 'MASAR-SES-2026-000001', buyer: 'Al Rajhi Foods', exporter: 'Dangote Sesame', commodity: 'Sesame', qty: '1,000 MT', value: '$500,000', stage: 'Inspection', risk: 'LOW', status: '🟢 On Track', next: 'Review inspection certificate' },
    { id: 'MASAR-SES-2026-000002', buyer: 'SGT Foods', exporter: 'Dangote Sesame', commodity: 'Sesame', qty: '500 MT', value: '$250,000', stage: 'Compliance', risk: 'MEDIUM', status: '🟡 Watch', next: 'Renew phytosanitary certificate' },
    { id: 'MASAR-CAS-2026-000003', buyer: 'Al Rajhi Foods', exporter: 'NPG Exports', commodity: 'Cashew', qty: '300 MT', value: '$180,000', stage: 'Financing', risk: 'LOW', status: '🟢 On Track', next: 'Confirm escrow funding' },
    { id: 'MASAR-SES-2026-000004', buyer: 'SGT Foods', exporter: 'Dangote Sesame', commodity: 'Sesame', qty: '2,000 MT', value: '$1,000,000', stage: 'Shipment', risk: 'LOW', status: '🟢 On Track', next: 'Monitor vessel ETA' },
  ];

  // Recent activity
  const recentActivity = [
    { time: '14:20', event: 'Inspection report uploaded', txn: 'SES-001', user: 'SGS Nigeria', type: 'inspection' },
    { time: '13:05', event: 'Laboratory certificate verified', txn: 'SES-001', user: 'Compliance Officer', type: 'document' },
    { time: '11:30', event: 'Finance partner approved facility', txn: 'SES-001', user: 'Afreximbank', type: 'finance' },
    { time: '09:15', event: 'Compliance pack approved', txn: 'CAS-003', user: 'KSA Compliance', type: 'compliance' },
    { time: '08:44', event: 'Contract executed', txn: 'SES-004', user: 'Operations Manager', type: 'contract' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: s.text, marginBottom: '4px' }}>MASAR Command Center</h1>
          <p style={{ fontSize: '13px', color: s.textSec }}>Real-time operational view of the Saudi–Africa trade corridor</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#98A2B3' }}>Tuesday, 25 August 2026 · Last sync: 23:48 UTC+1</span>
          <button style={{ padding: '6px 12px', background: 'white', border: `1px solid ${s.border}`, borderRadius: '6px', fontSize: '12px', fontWeight: 500, color: s.textSec, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={12} /> Refresh</button>
          <button style={{ padding: '6px 12px', background: 'white', border: `1px solid ${s.border}`, borderRadius: '6px', fontSize: '12px', fontWeight: 500, color: s.textSec, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Download size={12} /> Export</button>
        </div>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} style={{ background: 'white', borderRadius: '10px', border: `1px solid ${s.border}`, padding: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>{kpi.label}</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: `${kpi.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={14} color={kpi.color} />
              </div>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: s.text, lineHeight: 1, marginBottom: '4px' }}>{kpi.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {kpi.trend === 'up' ? <ArrowUpRight size={12} color={s.green} /> : kpi.trend === 'down' ? <ArrowDownRight size={12} color={s.red} /> : <Minus size={12} color="#98A2B3" />}
              <span style={{ fontSize: '11px', color: kpi.trend === 'up' ? s.green : kpi.trend === 'down' ? s.red : '#98A2B3' }}>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Pipeline */}
      <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${s.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: s.text }}>Transaction Pipeline</h2>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['pipeline', 'cards', 'map'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(activeTab === tab ? { background: s.navy, color: 'white' } : { background: '#F9FAFB', color: s.textSec }) }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {activeTab === 'pipeline' && (
          <div style={{ padding: '20px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: '8px', minWidth: '900px' }}>
              {pipelineStages.map((stage, idx) => (
                <div key={idx} style={{ flex: 1, minWidth: '80px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>{stage.label}</span>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: stage.color, marginTop: '2px' }}>{stage.count}</div>
                  </div>
                  <div style={{ height: '4px', background: '#F3F4F6', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${(stage.count / 12) * 100}%`, height: '100%', background: stage.color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'cards' && (
          <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
            {txnCards.map((txn, idx) => (
              <div key={idx} style={{ border: `1px solid ${s.border}`, borderRadius: '10px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: s.text, fontFamily: 'monospace' }}>{txn.id}</span>
                    <p style={{ fontSize: '11px', color: s.textSec, margin: '2px 0 0' }}>{txn.buyer} → {txn.exporter}</p>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: txn.risk === 'LOW' ? s.green : txn.risk === 'MEDIUM' ? s.amber : s.red, padding: '2px 8px', background: txn.risk === 'LOW' ? '#F0FDF4' : txn.risk === 'MEDIUM' ? '#FFFBEB' : '#FEF2F2', borderRadius: '4px' }}>{txn.risk}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px', padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}>
                  <div><span style={{ fontSize: '9px', color: '#98A2B3' }}>Commodity</span><p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{txn.commodity}</p></div>
                  <div><span style={{ fontSize: '9px', color: '#98A2B3' }}>Quantity</span><p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{txn.qty}</p></div>
                  <div><span style={{ fontSize: '9px', color: '#98A2B3' }}>Value</span><p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{txn.value}</p></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#98A2B3' }}>Stage: </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: s.gold }}>{txn.stage}</span>
                    <span style={{ fontSize: '10px', color: s.textSec, marginLeft: '8px' }}>{txn.status}</span>
                  </div>
                </div>
                <div style={{ marginTop: '8px', padding: '8px', background: '#FFFBEB', borderRadius: '6px', fontSize: '11px', color: s.text }}>
                  <span style={{ fontWeight: 600 }}>Next: </span>{txn.next}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
        {/* Exceptions */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${s.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: s.text }}>Active Exceptions</h2>
            <span style={{ fontSize: '11px', fontWeight: 600, color: s.red, padding: '2px 8px', background: '#FEF2F2', borderRadius: '4px' }}>{exceptions.length} active</span>
          </div>
          <div style={{ padding: '12px' }}>
            {exceptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><CheckCircle size={32} color={s.green} style={{ margin: '0 auto 8px' }} /><p style={{ fontSize: '13px', color: s.textSec }}>No active exceptions</p></div>
            ) : exceptions.map((exc, idx) => (
              <div key={idx} style={{ padding: '12px', borderLeft: `3px solid ${exc.severity === 'CRITICAL' ? '#EF4444' : exc.severity === 'HIGH' ? '#F59E0B' : '#3B82F6'}`, background: exc.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB', borderRadius: '0 8px 8px 0', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', fontFamily: 'monospace' }}>{exc.transactionId}</span>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: '2px 0' }}>{exc.description}</p>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: exc.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B', padding: '2px 6px', background: 'white', borderRadius: '4px', border: `1px solid ${exc.severity === 'CRITICAL' ? '#FECACA' : '#FDE68A'}` }}>{exc.severity}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#98A2B3' }}>Owner: {exc.assignedTo}</span>
                  <span style={{ fontSize: '10px', color: '#98A2B3' }}>Due: {exc.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${s.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: s.text }}>Activity Timeline</h2>
            <Link href="/dashboard/audit" style={{ fontSize: '11px', color: s.gold, textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
          </div>
          <div style={{ padding: '12px 16px' }}>
            {recentActivity.map((act, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: idx < recentActivity.length - 1 ? `1px solid #F3F4F6` : 'none' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: act.type === 'inspection' ? '#3B82F6' : act.type === 'finance' ? '#10B981' : act.type === 'compliance' ? '#F59E0B' : '#8B5CF6', marginTop: '6px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12px', color: s.text, margin: 0 }}>{act.event}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                    <span style={{ fontSize: '10px', color: '#98A2B3', fontFamily: 'monospace' }}>{act.txn}</span>
                    <span style={{ fontSize: '10px', color: '#98A2B3' }}>· {act.user}</span>
                  </div>
                </div>
                <span style={{ fontSize: '10px', color: '#98A2B3', flexShrink: 0 }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Finance Overview */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${s.border}` }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: s.text }}>Finance & Settlement</h2>
          </div>
          <div style={{ padding: '16px' }}>
            {[
              { label: 'Financing Pipeline', value: '$1.24M', color: '#3B82F6' },
              { label: 'Approved', value: '$820K', color: '#10B981' },
              { label: 'Funded', value: '$520K', color: s.gold },
              { label: 'Outstanding', value: '$410K', color: '#F59E0B' },
              { label: 'At Risk', value: '$0', color: '#16A34A' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < 4 ? '1px solid #F3F4F6' : 'none' }}>
                <span style={{ fontSize: '13px', color: s.textSec }}>{item.label}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipment Control */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${s.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: s.text }}>Shipment Control</h2>
            <Link href="/dashboard/shipments" style={{ fontSize: '11px', color: s.gold, textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: s.text, fontFamily: 'monospace' }}>MSCU1234567</span>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#3B82F6', padding: '2px 8px', background: '#EFF6FF', borderRadius: '4px' }}>IN TRANSIT</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: s.textSec }}>🇳🇬 Lagos</span>
                <div style={{ flex: 1, height: '2px', background: '#E5E7EB', borderRadius: '1px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '65%', top: '-3px', width: '8px', height: '8px', background: '#3B82F6', borderRadius: '50%' }} />
                </div>
                <span style={{ fontSize: '11px', color: s.textSec }}>🇸🇦 Jeddah</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', color: '#98A2B3' }}>ETA: 08 Sep 2026</span>
                <span style={{ fontSize: '10px', color: '#98A2B3' }}>MSC Aurora</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[{ l: 'In Transit', v: '1', c: '#3B82F6' }, { l: 'Preparing', v: '3', c: '#F59E0B' }, { l: 'Arrived', v: '0', c: '#16A34A' }, { l: 'Released', v: '1', c: '#16A34A' }].map((item, idx) => (
                <div key={idx} style={{ textAlign: 'center', padding: '10px', background: '#F9FAFB', borderRadius: '6px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: item.c }}>{item.v}</div>
                  <div style={{ fontSize: '10px', color: '#98A2B3' }}>{item.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Corridor Map */}
      <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, marginTop: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${s.border}` }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: s.text }}>Corridor Intelligence — Nigeria → Saudi Arabia</h2>
        </div>
        <div style={{ padding: '20px', background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 50%, #FFFBEB 100%)', borderRadius: '0 0 12px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🇳🇬</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: s.text }}>Nigeria</div>
              <div style={{ fontSize: '11px', color: s.textSec }}>Lagos · Kano · Abuja</div>
            </div>
            <div style={{ flex: 1, margin: '0 2rem', position: 'relative', height: '6px' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #16A34A, #C9A24A, #3B82F6)', borderRadius: '3px', opacity: 0.3 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #16A34A, #C9A24A, #3B82F6)', borderRadius: '3px', width: '65%', transition: 'width 1s ease' }} />
              {[20, 40, 65, 85].map((pos, i) => (
                <div key={i} style={{ position: 'absolute', top: '-4px', left: `${pos}%`, width: '14px', height: '14px', background: 'white', borderRadius: '50%', border: '2px solid #C9A24A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '6px', height: '6px', background: i === 2 ? '#3B82F6' : '#C9A24A', borderRadius: '50%' }} />
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🇸🇦</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: s.text }}>Saudi Arabia</div>
              <div style={{ fontSize: '11px', color: s.textSec }}>Jeddah · Riyadh · Dammam</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
            {[
              { l: 'Active GMV', v: '$3.84M' }, { l: 'Avg Transaction', v: '$480K' }, { l: 'Avg Cycle', v: '42 days' },
              { l: 'Inspection Pass', v: '96%' }, { l: 'Compliance Pass', v: '94%' }, { l: 'Repeat Buyers', v: '67%' },
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: s.text }}>{item.v}</div>
                <div style={{ fontSize: '10px', color: s.textSec }}>{item.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
