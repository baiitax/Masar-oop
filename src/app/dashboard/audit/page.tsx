'use client';
import React from 'react';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { History, Shield, Lock, Hash, Eye, Clock, User, FileText, CheckCircle, AlertTriangle, KeyRound, Database, Activity } from 'lucide-react';
import { auditEvents, formatStatus } from '@/lib/data';

export default function AuditPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', red: '#EF4444' };

  const metrics = [
    { label: 'TOTAL EVENTS', value: String(auditEvents.length), icon: History, color: '#3B82F6' },
    { label: 'TODAY', value: '12', icon: Clock, color: s.gold },
    { label: 'CRITICAL', value: '1', icon: AlertTriangle, color: s.red },
    { label: 'IMMUTABLE', value: '100%', icon: Lock, color: s.green },
  ];

  const getActionIcon = (action: string) => {
    if (action.includes('DOCUMENT')) return <FileText size={14} color="#3B82F6" />;
    if (action.includes('APPROVED') || action.includes('VERIFIED')) return <CheckCircle size={14} color={s.green} />;
    if (action.includes('ALERT') || action.includes('FAILED')) return <AlertTriangle size={14} color={s.red} />;
    return <Activity size={14} color="#98A2B3" />;
  };

  return (
    <DashboardPage title="Audit Ledger" subtitle="Immutable audit trail with cryptographic integrity. Every privileged action recorded." breadcrumbs={[{ label: 'Administration' }, { label: 'Audit Log' }]} metrics={metrics}>
      {/* Security Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {[
          { icon: Lock, label: 'Append-Only', desc: 'Immutable audit log', color: s.green },
          { icon: Hash, label: 'Hash-Chained', desc: 'SHA-256 integrity', color: '#3B82F6' },
          { icon: Shield, label: 'RBAC Enforced', desc: 'Role-based access', color: s.gold },
          { icon: Eye, label: 'Full Visibility', desc: 'All actions logged', color: '#8B5CF6' },
        ].map((item, idx) => (
          <div key={idx} style={{ background: 'white', borderRadius: '10px', border: `1px solid ${s.border}`, padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><item.icon size={18} color={item.color} /></div>
            <div><p style={{ fontSize: '13px', fontWeight: 600, color: s.text, margin: 0 }}>{item.label}</p><p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>{item.desc}</p></div>
          </div>
        ))}
      </div>

      {/* Audit Events */}
      <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${s.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Audit Events</h3>
          <span style={{ fontSize: '11px', color: '#98A2B3' }}>Last sync: 23:48 UTC+1</span>
        </div>
        {auditEvents.map((event, idx) => (
          <div key={event.id} style={{ padding: '14px 20px', borderBottom: idx < auditEvents.length - 1 ? `1px solid ${s.border}` : 'none', display: 'flex', gap: '12px' }}>
            <div style={{ marginTop: '2px' }}>{getActionIcon(event.action)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: s.text }}>{formatStatus(event.action)}</span>
                <span style={{ fontSize: '10px', color: '#98A2B3' }}>·</span>
                <span style={{ fontSize: '10px', color: '#98A2B3', fontFamily: 'monospace' }}>{event.entityType}: {event.entityId}</span>
              </div>
              <p style={{ fontSize: '12px', color: s.textSec, margin: '2px 0' }}>{event.details}</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <span style={{ fontSize: '10px', color: '#98A2B3', display: 'flex', alignItems: 'center', gap: '4px' }}><User size={10} /> {event.userName} ({event.userRole})</span>
                <span style={{ fontSize: '10px', color: '#98A2B3', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={10} /> {new Date(event.timestamp).toLocaleString()}</span>
                <span style={{ fontSize: '10px', color: '#98A2B3' }}>IP: {event.ipAddress}</span>
              </div>
            </div>
            <div style={{ padding: '3px 8px', background: '#F0FDF4', borderRadius: '4px', alignSelf: 'flex-start' }}>
              <span style={{ fontSize: '9px', fontWeight: 600, color: s.green }}>IMMUTABLE</span>
            </div>
          </div>
        ))}
      </div>

      {/* Four-Eyes Control */}
      <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '20px', marginTop: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text, marginBottom: '12px' }}>Four-Eyes Control — Separation of Duties</h3>
        <p style={{ fontSize: '13px', color: s.textSec, marginBottom: '16px' }}>No single employee can onboard → approve → fund → release a transaction alone. Critical actions require separation of duties.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Compliance Approval', owner: 'Compliance Officer' },
            { label: 'Inspection Decision', owner: 'Independent Inspector' },
            { label: 'Finance Approval', owner: 'Finance Manager' },
            { label: 'Release Authorization', owner: 'Operations + Finance' },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '12px', background: '#F9FAFB', borderRadius: '8px', borderLeft: `3px solid ${s.gold}` }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{item.label}</p>
              <p style={{ fontSize: '11px', color: '#98A2B3', margin: '2px 0 0' }}>{item.owner}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardPage>
  );
}
