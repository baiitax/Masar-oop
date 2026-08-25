'use client';
import React from 'react';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { MessageSquare, Plus, Package, MapPin, DollarSign, Users, Truck, Star, CheckCircle, Clock, Eye } from 'lucide-react';
import { buyers, exporters, getBuyerById, getExporterById } from '@/lib/data';

const rfqs = [
  { id: 'RFQ-2026-001', buyerId: 'buyer-001', commodity: 'Premium Hulled Sesame', origin: 'Nigeria', quantity: '1,000 MT', quality: '<2% moisture, >99% purity, <10 ppb aflatoxin', delivery: 'Jeddah, Saudi Arabia', incoterm: 'CIF', payment: 'Escrow', status: 'MATCHED', createdAt: '2026-07-10', matchedExporters: ['exp-001'] },
  { id: 'RFQ-2026-002', buyerId: 'buyer-002', commodity: 'Premium Hulled Sesame', origin: 'Nigeria', quantity: '500 MT', quality: '<3% moisture, >98% purity', delivery: 'Dammam, Saudi Arabia', incoterm: 'CIF', payment: 'Escrow', status: 'MATCHED', createdAt: '2026-08-06', matchedExporters: ['exp-001'] },
  { id: 'RFQ-2026-003', buyerId: 'buyer-001', commodity: 'Standard Natural Sesame', origin: 'Nigeria', quantity: '750 MT', quality: '<3% moisture, >98% purity', delivery: 'Riyadh, Saudi Arabia', incoterm: 'CFR', payment: 'Escrow', status: 'OPEN', createdAt: '2026-08-15', matchedExporters: [] },
];

export default function RFQPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A' };

  const metrics = [
    { label: 'OPEN RFQS', value: String(rfqs.filter(r => r.status === 'OPEN').length), icon: MessageSquare, color: '#3B82F6' },
    { label: 'MATCHED', value: String(rfqs.filter(r => r.status === 'MATCHED').length), icon: CheckCircle, color: s.green },
    { label: 'TOTAL VALUE', value: '$1.43M', icon: DollarSign, color: s.gold },
    { label: 'AVG RESPONSE', value: '2.4 days', icon: Clock, color: '#8B5CF6' },
  ];

  return (
    <DashboardPage title="RFQ & Deal Room" subtitle="Controlled transaction room — not a marketplace. Buyer creates RFQ, MASAR identifies suitable exporters." breadcrumbs={[{ label: 'Transactions' }, { label: 'RFQs' }]} metrics={metrics}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
        {rfqs.map(rfq => {
          const buyer = getBuyerById(rfq.buyerId);
          return (
            <div key={rfq.id} style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div><span style={{ fontSize: '13px', fontWeight: 700, color: s.text }}>{rfq.id}</span><p style={{ fontSize: '12px', color: s.textSec, margin: '2px 0 0' }}>{buyer?.tradingName}</p></div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: rfq.status === 'MATCHED' ? s.green : '#3B82F6', padding: '3px 8px', background: rfq.status === 'MATCHED' ? '#F0FDF4' : '#EFF6FF', borderRadius: '4px' }}>{rfq.status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: '#98A2B3' }}>Commodity</span><p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{rfq.commodity}</p></div>
                <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: '#98A2B3' }}>Quantity</span><p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{rfq.quantity}</p></div>
                <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: '#98A2B3' }}>Incoterm</span><p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{rfq.incoterm}</p></div>
                <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: '#98A2B3' }}>Payment</span><p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{rfq.payment}</p></div>
              </div>
              <div style={{ padding: '10px', background: '#F9FAFB', borderRadius: '6px', marginBottom: '12px' }}>
                <span style={{ fontSize: '9px', color: '#98A2B3' }}>Quality Spec</span>
                <p style={{ fontSize: '11px', color: s.text, margin: '2px 0 0' }}>{rfq.quality}</p>
              </div>
              {rfq.matchedExporters.length > 0 && (
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>MATCHED EXPORTERS</span>
                  {rfq.matchedExporters.map(expId => {
                    const exp = getExporterById(expId);
                    return exp ? (
                      <div key={expId} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#F0FDF4', borderRadius: '6px', border: '1px solid #BBF7D0', marginTop: '6px' }}>
                        <Truck size={16} color={s.green} />
                        <div style={{ flex: 1 }}><p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{exp.tradingName}</p><p style={{ fontSize: '10px', color: '#98A2B3', margin: 0 }}>{exp.sesameGrade} · {exp.availableQuantity}</p></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Star size={12} color={s.gold} fill={s.gold} /><span style={{ fontSize: '12px', fontWeight: 700, color: s.text }}>{exp.trustScore}</span></div>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DashboardPage>
  );
}
