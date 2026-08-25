'use client';
import React from 'react';
import DashboardLayout from '@/app/dashboard/layout';
import { Scale, FileText, Shield, Lock, Eye, CheckCircle, Hash, Clock, Database, Activity, Globe } from 'lucide-react';

export default function AuditorPortal() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A' };

  const evidenceChain = [
    { step: 'Buyer Verification', status: 'complete', evidence: 'KYB-001', hash: '7f4c...92ab', timestamp: '25 Jul 2026 09:15' },
    { step: 'Exporter Verification', status: 'complete', evidence: 'KYB-002', hash: 'a3b1...45cd', timestamp: '28 Jul 2026 14:30' },
    { step: 'Contract', status: 'complete', evidence: 'DOC-0045', hash: 'e8f2...78gh', timestamp: '20 Jul 2026 11:00' },
    { step: 'Compliance Pack', status: 'complete', evidence: 'DOC-0052', hash: '1c9d...34ef', timestamp: '28 Jul 2026 16:45' },
    { step: 'Inspection Report', status: 'complete', evidence: 'INSP-001', hash: '5a7b...90ij', timestamp: '05 Aug 2026 10:20' },
    { step: 'Finance Approval', status: 'complete', evidence: 'FIN-001', hash: '2d4e...56kl', timestamp: '10 Aug 2026 09:00' },
    { step: 'Escrow Confirmation', status: 'complete', evidence: 'ESC-001', hash: '8f1a...12mn', timestamp: '12 Aug 2026 14:00' },
    { step: 'Shipment', status: 'active', evidence: 'SHIP-001', hash: '3b6c...78op', timestamp: '18 Aug 2026 08:30' },
    { step: 'Port Verification', status: 'pending', evidence: '—', hash: '—', timestamp: '—' },
    { step: 'Release', status: 'pending', evidence: '—', hash: '—', timestamp: '—' },
    { step: 'Settlement', status: 'pending', evidence: '—', hash: '—', timestamp: '—' },
  ];

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Scale size={18} color={s.gold} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em' }}>AUDITOR / REGULATORY PORTAL</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: s.text, marginBottom: '2px' }}>MASAR Evidence Center</h1>
            <p style={{ fontSize: '13px', color: s.textSec }}>Read-only access to complete transaction evidence chains</p>
          </div>
          <div style={{ padding: '6px 12px', background: '#FEF3C7', borderRadius: '6px', border: '1px solid #FDE68A' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#92400E' }}>⚠️ READ-ONLY · No financial release · No document deletion</span>
          </div>
        </div>

        {/* Transaction Evidence */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${s.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Complete Evidence Chain</h3>
              <p style={{ fontSize: '12px', color: '#98A2B3', margin: '2px 0 0' }}>MASAR-SES-2026-000001 · Nigeria → Saudi Arabia · Sesame · 1,000 MT · $500,000</p>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600, color: s.green, padding: '3px 8px', background: '#F0FDF4', borderRadius: '4px' }}>IMMUTABLE RECORD</span>
          </div>
          <div style={{ padding: '16px 20px' }}>
            {evidenceChain.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '14px', paddingBottom: idx < evidenceChain.length - 1 ? '14px' : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {item.status === 'complete' ? <CheckCircle size={18} color={s.green} /> : item.status === 'active' ? <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: s.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} /></div> : <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #E5E7EB' }} />}
                  {idx < evidenceChain.length - 1 && <div style={{ width: '2px', flex: 1, background: item.status === 'complete' ? '#BBF7D0' : '#E5E7EB', marginTop: '4px' }} />}
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: item.status === 'pending' ? '#98A2B3' : s.text, margin: 0 }}>{item.step}</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '2px' }}>
                      <span style={{ fontSize: '10px', color: '#98A2B3' }}>Evidence: {item.evidence}</span>
                      <span style={{ fontSize: '10px', color: '#98A2B3', fontFamily: 'monospace' }}>Hash: {item.hash}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', color: '#98A2B3' }}>{item.timestamp}</span>
                    {item.status === 'complete' && <div style={{ marginTop: '2px' }}><span style={{ fontSize: '9px', fontWeight: 600, color: s.green, padding: '2px 6px', background: '#F0FDF4', borderRadius: '3px' }}>VERIFIED</span></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { icon: Database, label: 'Total Audit Events', value: '847', color: '#3B82F6' },
            { icon: Lock, label: 'Immutable Records', value: '847', color: s.green },
            { icon: Hash, label: 'Hash Coverage', value: '100%', color: s.gold },
            { icon: Activity, label: 'Today\'s Events', value: '12', color: '#8B5CF6' },
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '10px', border: `1px solid ${s.border}`, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><item.icon size={20} color={item.color} /></div>
              <div><p style={{ fontSize: '18px', fontWeight: 800, color: s.text, margin: 0 }}>{item.value}</p><p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>{item.label}</p></div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
