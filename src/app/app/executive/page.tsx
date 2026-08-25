'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/dashboard/layout';
import { 
  TrendingUp, Users, Truck, FileText, AlertTriangle, CheckCircle, Clock, 
  DollarSign, Ship, Shield, Activity, Globe, Package, ArrowUpRight, ArrowRight,
  Eye, Banknote, Scale, Target, ChevronRight, MapPin, Calendar, BarChart3,
  ArrowDownRight, Minus, RefreshCw, Download, Star, Crown, Briefcase, Award, Building2
} from 'lucide-react';

export default function ExecutivePage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F6F8FB', text: '#142235', textSec: '#667085', border: '#E4E7EC', green: '#16A34A', red: '#EF4444', amber: '#F59E0B' };

  const kpis = [
    { label: 'GMV', value: '$3.84M', change: '+$420K this month', trend: 'up', icon: TrendingUp, color: s.gold },
    { label: 'REVENUE', value: '$142K', change: '+18% vs target', trend: 'up', icon: DollarSign, color: s.green },
    { label: 'COMPLETED TRADES', value: '12', change: '+3 this month', trend: 'up', icon: CheckCircle, color: '#3B82F6' },
    { label: 'ACTIVE BUYERS', value: '8', change: '+2 new', trend: 'up', icon: Users, color: '#8B5CF6' },
    { label: 'EXPORTER SYNDICATES', value: '5', change: 'Stable', trend: 'neutral', icon: Truck, color: s.gold },
    { label: 'REPEAT RATE', value: '67%', change: '+5% QoQ', trend: 'up', icon: Star, color: s.green },
    { label: 'DISPUTE RATE', value: '0.8%', change: 'Below 1.5% target', trend: 'up', icon: Scale, color: s.green },
    { label: 'TAKE RATE', value: '3.7%', change: 'On target', trend: 'neutral', icon: Target, color: '#3B82F6' },
    { label: 'CONTRIBUTION/TRADE', value: '$4,200', change: '+$300', trend: 'up', icon: BarChart3, color: s.gold },
    { label: 'FINANCED VOLUME', value: '$1.24M', change: '32% of GMV', trend: 'up', icon: Banknote, color: '#10B981' },
  ];

  const strategicAlerts = [
    { type: 'critical', title: 'Strategic buyer approval pending', desc: 'Saudi Anchor Buyer B awaiting KYB completion', action: 'Review KYB' },
    { type: 'warning', title: 'Shipment delayed 48h', desc: 'MSCU1234567 ETA pushed to Sep 10', action: 'Monitor' },
    { type: 'info', title: 'New exporter application', desc: 'Kano Sesame Cooperative applying for verification', action: 'Review' },
  ];

  const corridorHealth = [
    { metric: 'Transaction Velocity', value: '42 days avg', status: 'good', target: '<45 days' },
    { metric: 'Inspection Pass Rate', value: '96%', status: 'excellent', target: '>90%' },
    { metric: 'Compliance Pass Rate', value: '94%', status: 'good', target: '>90%' },
    { metric: 'Settlement Success', value: '100%', status: 'excellent', target: '100%' },
    { metric: 'Dispute Rate', value: '0.8%', status: 'excellent', target: '<1.5%' },
    { metric: 'Repeat Buyer Rate', value: '67%', status: 'good', target: '>60%' },
  ];

  return (
    <DashboardLayout>
      <div>
        {/* Executive Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Crown size={18} color={s.gold} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em' }}>EXECUTIVE COMMAND CENTER</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: s.text, marginBottom: '2px' }}>Corridor Performance Overview</h1>
            <p style={{ fontSize: '13px', color: s.textSec }}>Strategic view of the Saudi–Africa trade corridor · Nigeria → Saudi Arabia</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#98A2B3' }}>25 August 2026 · Last sync: 23:48 UTC+1</span>
            <button style={{ padding: '6px 12px', background: 'white', border: `1px solid ${s.border}`, borderRadius: '6px', fontSize: '12px', fontWeight: 500, color: s.textSec, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={12} /> Refresh</button>
          </div>
        </div>

        {/* Daily Executive Brief */}
        <div style={{ background: 'linear-gradient(135deg, #0B1F3A, #102A4C)', borderRadius: '12px', padding: '20px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%)`, backgroundSize: '60px 100px' }} />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em' }}>DAILY EXECUTIVE BRIEF</span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: '4px 0 0' }}>MASAR Daily Brief — 25 Aug 2026</h3>
              </div>
              <button style={{ padding: '6px 12px', background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: s.gold, cursor: 'pointer' }}>Open Full Brief</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { v: '7', l: 'Active Transactions' },
                { v: '2', l: 'Require Executive Attention' },
                { v: '$3.84M', l: 'Pipeline GMV' },
                { v: '1', l: 'Shipment Delayed' },
                { v: '0', l: 'Critical Compliance Breaches' },
                { v: '1', l: 'Strategic Buyer Pending' },
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: 0 }}>{item.v}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{item.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {kpis.map((kpi, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '10px', border: `1px solid ${s.border}`, padding: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontSize: '9px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>{kpi.label}</span>
                <div style={{ width: '24px', height: '24px', borderRadius: '5px', background: `${kpi.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><kpi.icon size={12} color={kpi.color} /></div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: s.text, lineHeight: 1, marginBottom: '3px' }}>{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {kpi.trend === 'up' ? <ArrowUpRight size={10} color={s.green} /> : kpi.trend === 'down' ? <ArrowDownRight size={10} color={s.red} /> : <Minus size={10} color="#98A2B3" />}
                <span style={{ fontSize: '10px', color: kpi.trend === 'up' ? s.green : kpi.trend === 'down' ? s.red : '#98A2B3' }}>{kpi.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Strategic Alerts + Corridor Health */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {/* Strategic Alerts */}
          <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Strategic Alerts</h3>
            </div>
            <div style={{ padding: '12px' }}>
              {strategicAlerts.map((alert, idx) => (
                <div key={idx} style={{ padding: '12px', borderLeft: `3px solid ${alert.type === 'critical' ? s.red : alert.type === 'warning' ? s.amber : '#3B82F6'}`, background: alert.type === 'critical' ? '#FEF2F2' : alert.type === 'warning' ? '#FFFBEB' : '#EFF6FF', borderRadius: '0 8px 8px 0', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div><p style={{ fontSize: '12px', fontWeight: 600, color: s.text, margin: 0 }}>{alert.title}</p><p style={{ fontSize: '11px', color: s.textSec, margin: '2px 0 0' }}>{alert.desc}</p></div>
                    <button style={{ padding: '4px 10px', background: 'white', border: `1px solid ${s.border}`, borderRadius: '4px', fontSize: '10px', fontWeight: 600, color: s.textSec, cursor: 'pointer' }}>{alert.action}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corridor Health */}
          <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Corridor Health</h3>
            </div>
            <div style={{ padding: '12px' }}>
              {corridorHealth.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < corridorHealth.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <span style={{ fontSize: '12px', color: s.textSec }}>{item.metric}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: s.text }}>{item.value}</span>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: item.status === 'excellent' ? s.green : s.amber, padding: '2px 6px', background: item.status === 'excellent' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{item.status === 'excellent' ? '● Excellent' : '● Good'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Buyers + Top Exporters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Top Buyers</h3>
              <Link href="/dashboard/buyers" style={{ fontSize: '11px', color: s.gold, textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
            </div>
            {[
              { name: 'Al Rajhi Foods', txns: 4, gmv: '$1.8M', risk: 'Low' },
              { name: 'SGT Foods', txns: 2, gmv: '$620K', risk: 'Low' },
              { name: 'JPF Distribution', txns: 1, gmv: '$180K', risk: 'Low' },
            ].map((buyer, idx) => (
              <div key={idx} style={{ padding: '12px 18px', borderBottom: idx < 2 ? `1px solid ${s.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={16} color="#3B82F6" /></div>
                  <div><p style={{ fontSize: '13px', fontWeight: 600, color: s.text, margin: 0 }}>{buyer.name}</p><p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>{buyer.txns} transactions</p></div>
                </div>
                <div style={{ textAlign: 'right' }}><p style={{ fontSize: '13px', fontWeight: 700, color: s.text, margin: 0 }}>{buyer.gmv}</p><span style={{ fontSize: '10px', color: s.green }}>{buyer.risk} Risk</span></div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '12px', border: `1px solid ${s.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${s.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Top Exporters</h3>
              <Link href="/dashboard/exporters" style={{ fontSize: '11px', color: s.gold, textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
            </div>
            {[
              { name: 'Dangote Sesame', txns: 7, score: 94, passRate: '98%' },
              { name: 'NPG Exports', txns: 3, score: 78, passRate: '92%' },
              { name: 'Kano Sesame Union', txns: 0, score: 45, passRate: 'N/A' },
            ].map((exp, idx) => (
              <div key={idx} style={{ padding: '12px 18px', borderBottom: idx < 2 ? `1px solid ${s.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Truck size={16} color={s.green} /></div>
                  <div><p style={{ fontSize: '13px', fontWeight: 600, color: s.text, margin: 0 }}>{exp.name}</p><p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>{exp.txns} completed</p></div>
                </div>
                <div style={{ textAlign: 'right' }}><div style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}><Star size={12} color={s.gold} fill={s.gold} /><span style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>{exp.score}</span></div><span style={{ fontSize: '10px', color: s.green }}>Pass: {exp.passRate}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
