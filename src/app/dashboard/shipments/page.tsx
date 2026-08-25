'use client';
import React from 'react';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { Ship, MapPin, Calendar, CheckCircle, Clock, Package, ArrowRight, Anchor, Globe } from 'lucide-react';
import { shipments, getTransactionById } from '@/lib/data';

export default function ShipmentsPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', blue: '#3B82F6' };

  const metrics = [
    { label: 'IN TRANSIT', value: '1', icon: Ship, color: s.blue },
    { label: 'PREPARING', value: '3', icon: Package, color: '#F59E0B' },
    { label: 'ARRIVED', value: '0', icon: Anchor, color: s.green },
    { label: 'RELEASED', value: '1', icon: CheckCircle, color: s.green },
  ];

  const shipmentStatuses = ['BOOKED', 'LOADED', 'DEPARTED', 'IN_TRANSIT', 'ARRIVED', 'PORT_INSPECTION', 'CLEARED', 'RELEASED'];

  return (
    <DashboardPage title="Shipment Control Tower" subtitle="End-to-end shipment monitoring from port loading to Saudi port verification and release." breadcrumbs={[{ label: 'Logistics' }, { label: 'Shipments' }]} metrics={metrics}>
      {/* Corridor Map */}
      <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text, marginBottom: '16px' }}>Active Corridor — Nigeria → Saudi Arabia</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'linear-gradient(135deg, #F0FDF4, #EFF6FF, #FFFBEB)', borderRadius: '10px' }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', marginBottom: '4px' }}>🇳🇬</div><p style={{ fontSize: '13px', fontWeight: 700, color: s.text, margin: 0 }}>Apapa Port</p><p style={{ fontSize: '11px', color: s.textSec, margin: 0 }}>Lagos, Nigeria</p></div>
          <div style={{ flex: 1, margin: '0 2rem', position: 'relative', height: '6px' }}>
            <div style={{ position: 'absolute', inset: 0, background: '#E5E7EB', borderRadius: '3px' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #16A34A, #C9A24A, #3B82F6)', borderRadius: '3px', width: '65%' }} />
            <div style={{ position: 'absolute', top: '-5px', left: '65%', width: '16px', height: '16px', background: 'white', borderRadius: '50%', border: `3px solid ${s.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ship size={8} color={s.blue} /></div>
          </div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', marginBottom: '4px' }}>🇸🇦</div><p style={{ fontSize: '13px', fontWeight: 700, color: s.text, margin: 0 }}>Jeddah Port</p><p style={{ fontSize: '11px', color: s.textSec, margin: 0 }}>Saudi Arabia</p></div>
        </div>
      </div>

      {/* Shipment Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
        {shipments.map(ship => {
          const txn = getTransactionById(ship.transactionId);
          const currentIdx = shipmentStatuses.indexOf(ship.status);
          return (
            <div key={ship.id} style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div><span style={{ fontSize: '13px', fontWeight: 700, color: s.text, fontFamily: 'monospace' }}>{txn?.masarId}</span><p style={{ fontSize: '12px', color: s.textSec, margin: '2px 0 0' }}>{ship.vessel} · {ship.containerNumber}</p></div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: s.blue, padding: '3px 8px', background: '#EFF6FF', borderRadius: '4px' }}>{ship.status.replace('_', ' ')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: s.textSec }}>🇳🇬 {ship.portOfOrigin}</span>
                <div style={{ flex: 1, height: '2px', background: '#E5E7EB', borderRadius: '1px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: `${((currentIdx + 1) / shipmentStatuses.length) * 100}%`, top: '-3px', width: '8px', height: '8px', background: s.blue, borderRadius: '50%' }} />
                </div>
                <span style={{ fontSize: '11px', color: s.textSec }}>🇸🇦 {ship.destination}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: '#98A2B3' }}>ETD</span><p style={{ fontSize: '11px', fontWeight: 600, color: s.text, margin: 0 }}>{ship.etd}</p></div>
                <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: '#98A2B3' }}>ETA</span><p style={{ fontSize: '11px', fontWeight: 600, color: s.text, margin: 0 }}>{ship.eta}</p></div>
                <div style={{ padding: '8px', background: '#F9FAFB', borderRadius: '6px' }}><span style={{ fontSize: '9px', color: '#98A2B3' }}>Customs</span><p style={{ fontSize: '11px', fontWeight: 600, color: s.text, margin: 0 }}>{ship.customsStatus}</p></div>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {shipmentStatuses.map((status, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 6px', borderRadius: '4px', background: idx <= currentIdx ? '#F0FDF4' : '#F9FAFB', border: `1px solid ${idx <= currentIdx ? '#BBF7D0' : '#E5E7EB'}` }}>
                    {idx <= currentIdx ? <CheckCircle size={8} color={s.green} /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D0D5DD' }} />}
                    <span style={{ fontSize: '8px', color: idx <= currentIdx ? s.green : '#98A2B3' }}>{status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardPage>
  );
}
