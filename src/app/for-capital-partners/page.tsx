'use client';
import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/shared/PageLayout';
import { ShieldCheck, Eye, Lock, BarChart3, Banknote, ArrowRight, CheckCircle, Landmark, FileText, Activity } from 'lucide-react';

export default function ForCapitalPartnersPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F7F9FC', text: '#122033', textSec: '#5B6778', card: { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }, btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)', color: '#0B1F3A', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }, container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' } };

  const features = [
    { icon: Eye, title: 'Visible Risk', desc: 'Complete transaction visibility — counterparty verification, compliance status, inspection results, and documentation in one view.' },
    { icon: FileText, title: 'Structured Packages', desc: 'MASAR provides structured financing packages with invoice, contract, buyer verification, and inspection evidence.' },
    { icon: Lock, title: 'Escrow Protection', desc: 'Funds held by licensed Saudi bank/PSP partner. Release conditions tied to verified milestones.' },
    { icon: BarChart3, title: 'Portfolio Tracking', desc: 'Active facilities, repayment status, defaults, losses and cycle time — all visible in the Finance Partner Dashboard.' },
    { icon: Activity, title: 'Risk Monitoring', desc: 'Transaction score, inspection status, compliance status, buyer score, exporter score and insurance status.' },
    { icon: Banknote, title: 'Exposure Management', desc: 'Total financed, outstanding, upcoming repayments, concentration by buyer, exporter and commodity.' },
  ];

  const financeable = [
    'Verified Buyer', 'Verified Exporter', 'Verified Commodity', 'Independent Inspection', 'Transaction Evidence', 'Compliance Pack', 'Release Conditions'
  ];

  return (
    <PageLayout title="Finance Transactions with Better Visibility" subtitle="For banks, DFIs, trade-finance institutions, institutional funds and structured-finance providers." breadcrumb={[{ label: 'For Capital Partners' }]}>
      {/* Equation */}
      <section style={{ padding: '3rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', padding: '2rem', background: s.bg, borderRadius: '16px', alignItems: 'center' }}>
            {financeable.map((item, idx) => (
              <React.Fragment key={idx}>
                <div style={{ padding: '10px 18px', borderRadius: '8px', background: 'white', border: '1px solid #E5E9F0', fontSize: '13px', fontWeight: 500, color: s.text }}>{item}</div>
                {idx < 6 && <span style={{ color: '#CBD5E1', fontSize: '16px' }}>+</span>}
              </React.Fragment>
            ))}
            <span style={{ color: s.gold, fontSize: '24px', fontWeight: 700, margin: '0 8px' }}>=</span>
            <div style={{ padding: '12px 24px', borderRadius: '8px', background: 'rgba(201,162,74,0.1)', border: `1px solid ${s.gold}30`, fontSize: '14px', fontWeight: 700, color: s.gold }}>Financeable Trade</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {features.map((f, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.icon size={20} color={s.gold} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: s.text }}>{f.title}</h3>
                </div>
                <p style={{ fontSize: '13px', color: s.textSec, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Note */}
      <section style={{ padding: '3rem 1.5rem', background: s.bg }}>
        <div style={{ ...s.container, maxWidth: '700px' }}>
          <div style={{ ...s.card, padding: '2rem', borderLeft: `4px solid ${s.gold}` }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: s.text, marginBottom: '0.75rem' }}>Important</h3>
            <p style={{ fontSize: '14px', color: s.textSec, lineHeight: 1.7 }}>
              MASAR does not represent itself as the custodian of client funds unless the appropriate regulated structure actually exists. Funds should be held by a licensed Saudi bank/PSP partner while MASAR orchestrates the process. MASAR uses institutional capital partners while building the underwriting, exposure and transaction orchestration layer.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1.5rem', background: s.navy, textAlign: 'center' }}>
        <div style={{ ...s.container, maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Explore Capital Partnerships</h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Partner with MASAR to finance verified trade across the Saudi–Africa corridor.</p>
          <Link href="/contact" style={s.btnPrimary}>Contact Trade Desk <ArrowRight size={16} /></Link>
        </div>
      </section>
    </PageLayout>
  );
}
