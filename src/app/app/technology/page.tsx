'use client';
import React from 'react';
import RoleLayout from '@/components/dashboard/RoleLayout';
import { Cpu, Activity, Network, Server, Shield, Database, AlertTriangle, GitBranch, Flag, Settings, CheckCircle, Clock, Globe } from 'lucide-react';

export default function TechnologyPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', red: '#EF4444', blue: '#3B82F6' };

  const integrations = [
    { name: 'KYB Provider', status: 'operational', type: 'Identity Verification' },
    { name: 'Sanctions Provider', status: 'operational', type: 'AML Screening' },
    { name: 'Inspection Partner', status: 'operational', type: 'Quality Verification' },
    { name: 'Laboratory', status: 'operational', type: 'Testing & Analysis' },
    { name: 'E-Invoicing Partner', status: 'degraded', type: 'ZATCA Compliance' },
    { name: 'Financial Partner', status: 'operational', type: 'Escrow & Settlement' },
    { name: 'Logistics Provider', status: 'operational', type: 'Shipment Tracking' },
  ];

  const systemHealth = [
    { metric: 'API Uptime', value: '99.97%', status: 'excellent' },
    { metric: 'Response Time', value: '142ms', status: 'good' },
    { metric: 'Queue Health', value: 'Healthy', status: 'excellent' },
    { metric: 'Failed Jobs', value: '0', status: 'excellent' },
    { metric: 'Doc Processing', value: '2.3s avg', status: 'good' },
    { metric: 'Webhook Events', value: '1,247 today', status: 'good' },
    { metric: 'Auth Events', value: '89 today', status: 'good' },
    { metric: 'Security Alerts', value: '0', status: 'excellent' },
  ];

  return (
    <RoleLayout>
      <div>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Cpu size={18} color={s.blue} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: s.blue, letterSpacing: '0.08em' }}>TECHNOLOGY COMMAND CENTER</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: s.text, marginBottom: '2px' }}>MASAR Technology Overview</h1>
          <p style={{ fontSize: '13px', color: s.textSec }}>System health, integrations, and infrastructure monitoring</p>
        </div>

        {/* System Health */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {systemHealth.map((item, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '10px', border: `1px solid ${s.border}`, padding: '14px' }}>
              <span style={{ fontSize: '10px', color: '#98A2B3', letterSpacing: '0.05em' }}>{item.metric}</span>
              <p style={{ fontSize: '18px', fontWeight: 800, color: s.text, margin: '4px 0 0' }}>{item.value}</p>
              <span style={{ fontSize: '10px', fontWeight: 600, color: item.status === 'excellent' ? s.green : '#F59E0B' }}>{item.status === 'excellent' ? '● Excellent' : '● Good'}</span>
            </div>
          ))}
        </div>

        {/* Integration Monitor */}
        <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Integration Monitor</h3>
          </div>
          {integrations.map((int, idx) => (
            <div key={idx} style={{ padding: '12px 18px', borderBottom: idx < integrations.length - 1 ? `1px solid ${s.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: int.status === 'operational' ? s.green : '#F59E0B' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: s.text, margin: 0 }}>{int.name}</p>
                  <p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>{int.type}</p>
                </div>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: int.status === 'operational' ? s.green : '#F59E0B', padding: '3px 8px', background: int.status === 'operational' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>
                {int.status === 'operational' ? '🟢 Operational' : '🟡 Degraded'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </RoleLayout>
  );
}
