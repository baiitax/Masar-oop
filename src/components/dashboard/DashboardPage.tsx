'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Download, Filter, Plus, RefreshCw, Search } from 'lucide-react';

interface DashboardPageProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  metrics?: { label: string; value: string; change?: string; color?: string; icon?: React.ElementType }[];
  children: React.ReactNode;
  filters?: React.ReactNode;
}

export default function DashboardPage({ title, subtitle, breadcrumbs, actions, metrics, children, filters }: DashboardPageProps) {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          {breadcrumbs && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Link href="/dashboard" style={{ fontSize: '12px', color: '#98A2B3', textDecoration: 'none' }}>Dashboard</Link>
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight size={12} color="#D0D5DD" />
                  {b.href ? <Link href={b.href} style={{ fontSize: '12px', color: '#98A2B3', textDecoration: 'none' }}>{b.label}</Link> : <span style={{ fontSize: '12px', color: s.gold }}>{b.label}</span>}
                </React.Fragment>
              ))}
            </div>
          )}
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: s.text, marginBottom: '2px' }}>{title}</h1>
          {subtitle && <p style={{ fontSize: '13px', color: s.textSec }}>{subtitle}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {actions || (
            <>
              <button style={{ padding: '7px 14px', background: 'white', border: `1px solid ${s.border}`, borderRadius: '8px', fontSize: '12px', fontWeight: 500, color: s.textSec, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={13} /> Refresh</button>
              <button style={{ padding: '7px 14px', background: 'white', border: `1px solid ${s.border}`, borderRadius: '8px', fontSize: '12px', fontWeight: 500, color: s.textSec, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Download size={13} /> Export</button>
              <button style={{ padding: '7px 14px', background: s.navy, border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Plus size={13} /> New</button>
            </>
          )}
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {metrics.map((m, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '10px', border: `1px solid ${s.border}`, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>{m.label}</span>
                {m.icon && <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: `${m.color || s.gold}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><m.icon size={14} color={m.color || s.gold} /></div>}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.text }}>{m.value}</div>
              {m.change && <span style={{ fontSize: '11px', color: '#98A2B3' }}>{m.change}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      {filters && (
        <div style={{ background: 'white', borderRadius: '10px', border: `1px solid ${s.border}`, padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Filter size={14} color="#98A2B3" />
          {filters}
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  );
}
