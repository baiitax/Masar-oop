'use client';
import React, { useState } from 'react';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { Users, CheckCircle, Clock, Shield, Eye, Building2, MapPin, Globe, Star, TrendingUp, DollarSign, FileText, ArrowUpRight } from 'lucide-react';
import { buyers, formatCurrency } from '@/lib/data';

export default function BuyersPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A' };

  const metrics = [
    { label: 'VERIFIED BUYERS', value: String(buyers.filter(b => b.verificationStatus === 'APPROVED').length), icon: CheckCircle, color: s.green },
    { label: 'PENDING REVIEW', value: String(buyers.filter(b => b.verificationStatus !== 'APPROVED').length), icon: Clock, color: '#F59E0B' },
    { label: 'TOTAL CAPACITY', value: '$42M/yr', icon: TrendingUp, color: s.gold },
    { label: 'REPEAT RATE', value: '67%', icon: Star, color: '#3B82F6' },
  ];

  return (
    <DashboardPage title="Buyer Network" subtitle="Saudi commercial food and agro buyers verified through MASAR KYB protocol." breadcrumbs={[{ label: 'Network' }, { label: 'Buyers' }]} metrics={metrics}>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '16px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F9FAFB' }}>
              {['Buyer', 'Country', 'Category', 'Transactions', 'GMV', 'Risk', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', borderBottom: `1px solid ${s.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {buyers.map(b => (
                <tr key={b.id} onClick={() => setSelected(b.id)} style={{ cursor: 'pointer', background: selected === b.id ? '#FFFBEB' : 'white', borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: '12px 14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={16} color="#3B82F6" /></div><div><p style={{ fontSize: '13px', fontWeight: 600, color: s.text, margin: 0 }}>{b.tradingName}</p><p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>{b.legalName}</p></div></div></td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>🇸🇦 {b.city}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{b.buyerCategory}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text }}>4</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text }}>{b.annualProcurementVolume}</td>
                  <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', fontWeight: 700, color: s.green, padding: '3px 8px', background: '#F0FDF4', borderRadius: '4px' }}>Low</span></td>
                  <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: b.verificationStatus === 'APPROVED' ? s.green : '#F59E0B', padding: '3px 8px', background: b.verificationStatus === 'APPROVED' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{b.verificationStatus}</span></td>
                  <td style={{ padding: '12px 14px' }}><button style={{ padding: '4px 8px', background: '#F9FAFB', border: `1px solid ${s.border}`, borderRadius: '4px', cursor: 'pointer' }}><Eye size={12} color={s.textSec} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (() => {
          const b = buyers.find(x => x.id === selected);
          if (!b) return null;
          return (
            <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '20px', position: 'sticky', top: '80px' }}>
              <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: `1px solid ${s.border}`, marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Building2 size={24} color="#3B82F6" /></div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: s.text, margin: 0 }}>{b.tradingName}</h3>
                <p style={{ fontSize: '12px', color: '#98A2B3', margin: '2px 0' }}>{b.saudiRegistration}</p>
                <span style={{ fontSize: '10px', fontWeight: 600, color: s.green, padding: '3px 8px', background: '#F0FDF4', borderRadius: '4px' }}>{b.verificationStatus}</span>
              </div>
              {[
                { l: 'Industry', v: b.industry }, { l: 'Category', v: b.buyerCategory }, { l: 'Credit Profile', v: b.creditProfile },
                { l: 'Capacity', v: b.estimatedPurchasingCapacity }, { l: 'Volume', v: b.requiredVolume }, { l: 'Incoterms', v: b.incoterms.join(', ') },
                { l: 'Payment', v: b.paymentTerms }, { l: 'Risk Score', v: `${b.riskScore}/100` },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '12px', color: '#98A2B3' }}>{item.l}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: s.text }}>{item.v}</span>
                </div>
              ))}
              <div style={{ marginTop: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>DIRECTORS</span>
                {b.directors.map((d, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '10px', fontWeight: 600 }}>{d.name[0]}</span></div>
                    <div><p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{d.name}</p><p style={{ fontSize: '10px', color: '#98A2B3', margin: 0 }}>{d.role}</p></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </DashboardPage>
  );
}
