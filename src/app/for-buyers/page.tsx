'use client';
import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/shared/PageLayout';
import { ShieldCheck, Search, Eye, Activity, Banknote, CheckCircle, ArrowRight, Building2, Globe, Star } from 'lucide-react';

export default function ForBuyersPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F7F9FC', text: '#122033', textSec: '#5B6778', card: { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }, btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)', color: '#0B1F3A', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }, container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' } };

  const features = [
    { icon: ShieldCheck, title: 'Verified Suppliers', desc: 'Every exporter undergoes rigorous KYB verification. Know who you are buying from with MASAR Trust Scores and verified credentials.' },
    { icon: Search, title: 'Quality Evidence', desc: 'Independent inspection by approved partners. Laboratory results against your contract specifications. PASS/CONDITIONAL/FAIL determination.' },
    { icon: Eye, title: 'Compliance Visibility', desc: 'Know what is complete before shipment. MASAR Clearance Score shows exactly where every document stands in real-time.' },
    { icon: Activity, title: 'Transaction Visibility', desc: 'Track the entire deal from verification to settlement. Every stage, every document, every decision in one workspace.' },
    { icon: Banknote, title: 'Capital Access', desc: 'Enable eligible supplier financing through institutional capital partners. Up to 80% advance for verified transactions.' },
    { icon: Globe, title: 'Saudi Import Compliance', desc: 'SFDA requirements, Arabic labelling, halal documentation, ZATCA e-invoicing — all managed through MASAR.' },
  ];

  const buyerTypes = [
    { title: 'Food Processors', desc: 'Premium sesame for tahini and oil production. Verified supply with quality evidence.', icon: '🏭' },
    { title: 'Commodity Importers', desc: 'Bulk sesame, cashew and agricultural commodities with compliance managed.', icon: '📦' },
    { title: 'Food Manufacturers', desc: 'Consistent supply for manufacturing lines with transaction visibility.', icon: '⚙️' },
    { title: 'Distributors & Wholesalers', desc: 'Verified supply chain for retail distribution with settlement coordination.', icon: '🏪' },
    { title: 'Institutional Buyers', desc: 'Large-volume procurement with structured financing and compliance.', icon: '🏛️' },
  ];

  return (
    <PageLayout title="Source with Confidence" subtitle="Saudi buyers gain a structured transaction environment where suppliers, documentation, inspection and transaction status are coordinated through one operating layer." breadcrumb={[{ label: 'For Buyers' }]}>
      {/* Features */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {features.map((f, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.icon size={22} color={s.gold} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: s.text }}>{f.title}</h3>
                </div>
                <p style={{ fontSize: '14px', color: s.textSec, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buyer Types */}
      <section style={{ padding: '4rem 1.5rem', background: s.bg }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: s.text }}>Who MASAR Serves</h2>
            <p style={{ fontSize: '1rem', color: s.textSec, maxWidth: '500px', margin: '0.5rem auto 0' }}>Commercial food and agro buyers across Saudi Arabia.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {buyerTypes.map((bt, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{bt.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: s.text, marginBottom: '0.5rem' }}>{bt.title}</h3>
                <p style={{ fontSize: '13px', color: s.textSec, lineHeight: 1.5 }}>{bt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Process */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: s.text }}>Buyer Onboarding</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {['Application', 'KYB Review', 'UBO Verification', 'Sanctions Screening', 'Commercial Review', 'Approved'].map((step, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.25rem', textAlign: 'center', borderTop: idx === 5 ? `3px solid ${s.gold}` : '3px solid #E5E9F0' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: idx === 5 ? 'rgba(201,162,74,0.1)' : '#F7F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '14px', fontWeight: 700, color: idx === 5 ? s.gold : '#9BA3AE' }}>{idx + 1}</div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: idx === 5 ? s.gold : s.text }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1.5rem', background: s.navy, textAlign: 'center' }}>
        <div style={{ ...s.container, maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Become a MASAR Buyer</h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Join the network of verified Saudi buyers sourcing African commodities through trusted infrastructure.</p>
          <Link href="/auth" style={s.btnPrimary}>Start Your Application <ArrowRight size={16} /></Link>
        </div>
      </section>
    </PageLayout>
  );
}
