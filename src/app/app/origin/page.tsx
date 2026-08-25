'use client';
import React from 'react';
import RoleLayout from '@/components/dashboard/RoleLayout';
import { MapPin, Truck, Package, Calendar, CheckCircle, Building2, Anchor, Ship, BarChart3, Star, Eye, AlertTriangle } from 'lucide-react';

export default function OriginPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A' };

  const exporters = [
    { name: 'Dangote Agro Sesame Export Ltd.', score: 94, capacity: '3,000 MT', completed: 7, passRate: '98%', status: 'Verified' },
    { name: 'Nigerian Premium Grains Ltd.', score: 78, capacity: '1,500 MT', completed: 3, passRate: '92%', status: 'Verified' },
    { name: 'Kano Sesame Cooperative Export Union', score: 45, capacity: '500 MT', completed: 0, passRate: 'N/A', status: 'Pending' },
  ];

  const lots = [
    { id: 'LOT-SES-NG-001', origin: 'Kano', qty: '1,500 MT', grade: 'Premium Hulled', moisture: '1.8%', aflatoxin: '<4 ppb', status: 'Available' },
    { id: 'LOT-SES-NG-002', origin: 'Kaduna', qty: '800 MT', grade: 'Standard Natural', moisture: '2.5%', aflatoxin: '<8 ppb', status: 'Contracted' },
    { id: 'LOT-SES-NG-003', origin: 'Benue', qty: '500 MT', grade: 'Natural', moisture: '3.0%', aflatoxin: '<10 ppb', status: 'Available' },
  ];

  return (
    <RoleLayout>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <MapPin size={18} color={s.gold} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em' }}>ORIGIN OPERATIONS COMMAND CENTER</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: s.text, marginBottom: '2px' }}>Nigeria Origin Operations</h1>
          <p style={{ fontSize: '13px', color: s.textSec }}>Exporter network, commodity lots, and origin logistics</p>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'VERIFIED EXPORTERS', value: '2', icon: Truck, color: s.green },
            { label: 'ACTIVE LOTS', value: '3', icon: Package, color: '#3B82F6' },
            { label: 'CONTRACTED VOLUME', value: '2,500 MT', icon: Package, color: s.gold },
            { label: 'INSPECTION QUEUE', value: '2', icon: Calendar, color: '#F59E0B' },
            { label: 'SHIPMENT QUEUE', value: '1', icon: Ship, color: '#8B5CF6' },
            { label: 'QUALITY EXCEPTIONS', value: '1', icon: AlertTriangle, color: '#EF4444' },
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

        {/* Exporter Network */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Exporter Network</h3>
          </div>
          {exporters.map((exp, idx) => (
            <div key={idx} style={{ padding: '14px 18px', borderBottom: idx < exporters.length - 1 ? `1px solid ${s.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Truck size={20} color={s.green} /></div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: s.text, margin: 0 }}>{exp.name}</p>
                  <p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>Capacity: {exp.capacity} · {exp.completed} completed</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Star size={14} color={s.gold} fill={s.gold} /><span style={{ fontSize: '16px', fontWeight: 800, color: s.text }}>{exp.score}</span></div>
                  <span style={{ fontSize: '9px', color: '#98A2B3' }}>Trust Score</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: s.green, margin: 0 }}>{exp.passRate}</p>
                  <span style={{ fontSize: '9px', color: '#98A2B3' }}>Pass Rate</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: exp.status === 'Verified' ? s.green : '#F59E0B', padding: '3px 8px', background: exp.status === 'Verified' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{exp.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Commodity Lots */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Commodity Lots</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F9FAFB' }}>
              {['Lot ID', 'Origin', 'Quantity', 'Grade', 'Moisture', 'Aflatoxin', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.05em', borderBottom: `1px solid ${s.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {lots.map((lot, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${s.border}` }}>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text, fontFamily: 'monospace' }}>{lot.id}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{lot.origin}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: s.text }}>{lot.qty}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{lot.grade}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.text }}>{lot.moisture}</td>
                  <td style={{ padding: '12px 14px', fontSize: '12px', color: s.green }}>{lot.aflatoxin}</td>
                  <td style={{ padding: '12px 14px' }}><span style={{ fontSize: '10px', fontWeight: 600, color: lot.status === 'Available' ? s.green : '#3B82F6', padding: '3px 8px', background: lot.status === 'Available' ? '#F0FDF4' : '#EFF6FF', borderRadius: '4px' }}>{lot.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RoleLayout>
  );
}
