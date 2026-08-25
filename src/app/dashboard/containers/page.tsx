'use client';
import React from 'react';
import DashboardPage from '@/components/dashboard/DashboardPage';
import { Target, FileText, Scale, Network, Eye, BadgeCheck, Target as TargetIcon, ClipboardCheck, AlertTriangle, Landmark, BarChart3, Package, Anchor, Activity, Wheat, AlertTriangle as RiskIcon, Users, Settings, Clock } from 'lucide-react';

export default function ContainersPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', amber: '#F59E0B' };

  return (
    <DashboardPage 
      title="Containers" 
      subtitle="MASAR containers management — V0 concierge operations."
      breadcrumbs={[{ label: 'Containers' }]}
    >
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid ' + s.border, padding: '48px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Target size={28} color={s.gold} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: s.text, marginBottom: '8px' }}>MASAR Containers</h2>
        <p style={{ fontSize: '14px', color: s.textSec, maxWidth: '500px', margin: '0 auto 24px' }}>
          This module is part of the MASAR V0 concierge operations system. Full functionality is being validated through real transactions before protocol automation in V1.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#FFFBEB', borderRadius: '8px', border: '1px solid #FDE68A' }}>
          <Clock size={14} color={s.amber} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#92400E' }}>V0 Concierge Mode — Human-in-the-loop</span>
        </div>
        <div style={{ marginTop: '24px', padding: '16px', background: '#F9FAFB', borderRadius: '8px', maxWidth: '400px', margin: '24px auto 0' }}>
          <p style={{ fontSize: '12px', color: '#98A2B3', margin: 0 }}>
            Trust is engineered. MASAR — The Path<br/>
            Verify. Comply. Inspect. Finance. Settle.
          </p>
        </div>
      </div>
    </DashboardPage>
  );
}
