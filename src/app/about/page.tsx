'use client';
import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/shared/PageLayout';
import { Globe, Shield, Zap, Target, Users, Building2, MapPin, ArrowRight, CheckCircle, Flag, Compass } from 'lucide-react';

export default function AboutPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F7F9FC', text: '#122033', textSec: '#5B6778', card: { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }, btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)', color: '#0B1F3A', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }, container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' } };

  const values = [
    { icon: Shield, title: 'Trust by Design', desc: 'Verified counterparties, independent inspection, compliance orchestration, and auditable settlement.' },
    { icon: Target, title: 'Precision', desc: 'Every transaction is measured, documented and scored. Evidence-led decisions, not assumptions.' },
    { icon: Zap, title: 'Prove First, Automate Second', desc: 'We prove the transaction manually, measure it, standardize it, then automate it. No unproven processes.' },
    { icon: Globe, title: 'Corridor Focus', desc: 'Starting with Nigeria → Saudi Arabia. Building the infrastructure for Africa–GCC trade.' },
  ];

  const milestones = [
    { year: '2026', title: 'V0 — Concierge Pilot', desc: 'First real transactions. Real inspection. Real settlement. Target: 10 completed transactions.' },
    { year: '2027', title: 'V1 — Protocol Automation', desc: 'KYB automation, compliance engine, inspection integration, e-invoicing.' },
    { year: '2027+', title: 'Embedded Finance', desc: 'Up to 80% advance product through capital partners.' },
    { year: '2028+', title: 'Network Density', desc: 'More buyers. More exporter syndicates. More commodity lanes.' },
    { year: '2029+', title: 'Corridor OS', desc: 'Multiple African origins. Multiple GCC destinations.' },
    { year: '2030', title: 'Financial Layer', desc: 'FX, structured finance and institutional licensing.' },
  ];

  return (
    <PageLayout title="About MASAR" subtitle="The trusted transaction infrastructure for the Saudi–Africa trade corridor." breadcrumb={[{ label: 'About' }]}>
      {/* Mission */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ width: '48px', height: '3px', background: 'linear-gradient(90deg, #C9A24A, #E3C875)', borderRadius: '2px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: s.text, marginBottom: '1rem' }}>مسار — The Path</h2>
              <p style={{ fontSize: '1rem', color: s.textSec, lineHeight: 1.7, marginBottom: '1rem' }}>
                MASAR is an asset-light trade infrastructure company that orchestrates the transaction layer between African suppliers and Saudi buyers. We are not a marketplace. We are not a broker.
              </p>
              <p style={{ fontSize: '1rem', color: s.textSec, lineHeight: 1.7, marginBottom: '1rem' }}>
                MASAR owns software, workflow, transaction data, compliance intelligence, relationships and release-condition logic. MASAR does not own farms, commodity inventory, trucks, ships, warehouses, escrow funds, inspection laboratories or a lending balance sheet.
              </p>
              <p style={{ fontSize: '1rem', color: s.textSec, lineHeight: 1.7 }}>
                Our philosophy: <strong style={{ color: s.text }}>Do not automate an unproven process. Prove the transaction manually, measure it, standardize it, then automate it.</strong>
              </p>
            </div>
            <div style={{ ...s.card, padding: '2rem' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em', marginBottom: '1.5rem' }}>CORE COPY</h3>
              {[
                'The trusted path between African supply and Saudi demand.',
                'Trade transaction infrastructure.',
                'Trust is engineered.',
                'Compliance before cargo.',
                'Independent evidence. Controlled release.',
                'Verified trade becomes financeable trade.',
                'We own the rail. Partners move the physical world.',
                'From one corridor to the infrastructure layer for Africa–GCC trade.',
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '10px 0', borderBottom: idx < 7 ? '1px solid #F1F5F9' : 'none' }}>
                  <span style={{ fontSize: '13px', color: s.text, fontStyle: 'italic' }}>&ldquo;{item}&rdquo;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '4rem 1.5rem', background: s.bg }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: s.text }}>Our Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {values.map((v, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <v.icon size={22} color={s.gold} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: s.text, marginBottom: '0.5rem' }}>{v.title}</h3>
                <p style={{ fontSize: '13px', color: s.textSec, lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: s.text }}>From First Trade to Corridor Infrastructure</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {milestones.map((m, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem', borderTop: idx === 0 ? `3px solid ${s.gold}` : '3px solid #E5E9F0' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: idx === 0 ? s.gold : '#9BA3AE', letterSpacing: '0.08em' }}>{m.year}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: s.text, margin: '0.5rem 0' }}>{m.title}</h3>
                <p style={{ fontSize: '13px', color: s.textSec, lineHeight: 1.5 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section style={{ padding: '4rem 1.5rem', background: s.bg }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: s.text }}>Our Presence</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {[
              { flag: '🇸🇦', city: 'Riyadh', country: 'Saudi Arabia', role: 'Buyer Network & Compliance' },
              { flag: '🇳🇬', city: 'Lagos', country: 'Nigeria', role: 'Origin Operations' },
              { flag: '🇳🇬', city: 'Kano', country: 'Nigeria', role: 'Exporter Network' },
            ].map((office, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{office.flag}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: s.text }}>{office.city}</h3>
                <p style={{ fontSize: '13px', color: s.textSec }}>{office.country}</p>
                <p style={{ fontSize: '12px', color: s.gold, marginTop: '0.5rem' }}>{office.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
