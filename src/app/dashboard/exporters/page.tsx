'use client';
import React, { useState } from 'react';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { Truck, CheckCircle, Star, Eye, Building2, Award, TrendingUp, Shield, Package } from 'lucide-react';
import { exporters } from '@/lib/data';

export default function ExportersPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A' };

  const metrics = [
    { label: 'VERIFIED EXPORTERS', value: String(exporters.filter(e => e.verificationStatus === 'APPROVED').length), icon: CheckCircle, color: s.green },
    { label: 'AVG TRUST SCORE', value: String(Math.round(exporters.reduce((s, e) => s + e.trustScore, 0) / exporters.length)), icon: Star, color: s.gold },
    { label: 'TOTAL CAPACITY', value: '5,000 MT', icon: Package, color: '#3B82F6' },
    { label: 'INSPECTION PASS', value: '96%', icon: Shield, color: s.green },
  ];

  return (
    <DashboardPage title="African Exporter Network" subtitle="Verified Nigerian exporters with MASAR Trust Scores and commodity capabilities." breadcrumbs={[{ label: 'Network' }, { label: 'Exporters' }]} metrics={metrics}>
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '16px' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F9FAFB' }}>
              {['Exporter', 'Commodity', 'Capacity', 'Trust Score', 'Transactions', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', borderBottom: `1px solid ${s.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {exporters.map(e => (
                <tr key={e.id} onClick={() => setSelected(e.id)} style={{ cursor: 'pointer', background: selected === e.id ? '#FFFBEB' : 'white', borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: '12px 14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Truck size={16} color={s.green} /></div><div><p style={{ fontSize: '13px', fontWeight: 600, color: s.text, margin: 0 }}>{e.tradingName}</p><p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>🇳🇬 {e.warehouses[0]}</p></div></div></td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{e.sesameGrade}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text }}>{e.availableQuantity}</td>
                  <td style={{ padding: '12px 14px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} color={s.gold} fill={s.gold} /><span style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>{e.trustScore}</span></div></td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text }}>7</td>
                  <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: e.verificationStatus === 'APPROVED' ? s.green : '#F59E0B', padding: '3px 8px', background: e.verificationStatus === 'APPROVED' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{e.verificationStatus}</span></td>
                  <td style={{ padding: '12px 14px' }}><button style={{ padding: '4px 8px', background: '#F9FAFB', border: `1px solid ${s.border}`, borderRadius: '4px', cursor: 'pointer' }}><Eye size={12} color={s.textSec} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (() => {
          const e = exporters.find(x => x.id === selected);
          if (!e) return null;
          return (
            <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '20px', position: 'sticky', top: '80px' }}>
              <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: `1px solid ${s.border}`, marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Truck size={24} color={s.green} /></div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: s.text, margin: 0 }}>{e.tradingName}</h3>
                <p style={{ fontSize: '12px', color: '#98A2B3', margin: '2px 0' }}>{e.cacNumber}</p>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', borderRadius: '10px', marginBottom: '16px' }}>
                <Award size={24} color={s.gold} style={{ margin: '0 auto 4px' }} />
                <p style={{ fontSize: '28px', fontWeight: 800, color: s.text, margin: 0 }}>{e.trustScore}</p>
                <p style={{ fontSize: '10px', fontWeight: 600, color: s.gold, letterSpacing: '0.08em' }}>MASAR TRUST SCORE</p>
              </div>
              {[
                { l: 'Grade', v: e.sesameGrade }, { l: 'Origin', v: e.sesameOrigin }, { l: 'Capacity', v: e.availableQuantity },
                { l: 'Moisture', v: e.moisture }, { l: 'Purity', v: e.purity }, { l: 'Aflatoxin', v: e.aflatoxinStatus },
                { l: 'Harvest', v: e.harvestSeason }, { l: 'Packaging', v: e.packaging },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '12px', color: '#98A2B3' }}>{item.l}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: s.text }}>{item.v}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </DashboardPage>
  );
}
