'use client';
import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/shared/PageLayout';
import { ShieldCheck, FileSignature, ClipboardCheck, Search, Lock, BadgeCheck, ArrowRight, CheckCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F7F9FC', text: '#122033', textSec: '#5B6778', card: { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }, btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)', color: '#0B1F3A', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }, container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' } };

  const steps = [
    { num: '01', title: 'VERIFY', icon: ShieldCheck, color: '#C9A24A', desc: 'Buyer and exporter undergo rigorous KYB/KYC verification.', details: ['Identity verification', 'Ownership & UBO screening', 'Sanctions screening', 'Trade history review', 'Commercial assessment', 'MASAR Trust Score (exporters)'] },
    { num: '02', title: 'CONTRACT', icon: FileSignature, color: '#3B82F6', desc: 'Digital transaction terms established in the MASAR deal room.', details: ['Commodity specification', 'Quantity & quality terms', 'Incoterms agreement', 'Release conditions defined', 'Payment structure', 'Inspection requirements'] },
    { num: '03', title: 'COMPLY', icon: ClipboardCheck, color: '#8B5CF6', desc: 'Build the transaction\'s complete compliance pack.', details: ['Certificate of Origin', 'Phytosanitary certificate', 'Laboratory COA', 'SFDA requirements', 'Commercial invoice', 'ZATCA e-invoicing'] },
    { num: '04', title: 'INSPECT', icon: Search, color: '#2D7D46', desc: 'Independent inspection and laboratory evidence.', details: ['Approved inspection partner assigned', 'Sample collection', 'Laboratory testing', 'Results against contract specs', 'PASS / CONDITIONAL / FAIL', 'Evidence enters transaction vault'] },
    { num: '05', title: 'SECURE', icon: Lock, color: '#C9A24A', desc: 'Funds coordinated through licensed financial partners.', details: ['Escrow arrangement', 'Licensed Saudi bank/PSP', 'Release conditions confirmed', 'Capital partner financing', 'Up to 80% advance', 'Funds visibility'] },
    { num: '06', title: 'RELEASE', icon: BadgeCheck, color: '#0B1F3A', desc: 'Settlement when predefined conditions are satisfied.', details: ['All compliance conditions met', 'Inspection passed', 'Funds confirmed', 'Release authorized', 'Settlement executed', 'Transaction scored'] },
  ];

  return (
    <PageLayout title="How MASAR Works" subtitle="One rail. Every critical condition. Six steps from counterparty verification to settlement." breadcrumb={[{ label: 'How It Works' }]}>
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          {/* Transaction Flow */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '4rem', padding: '2rem', background: s.bg, borderRadius: '16px' }}>
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div style={{ padding: '10px 18px', borderRadius: '8px', background: 'white', border: `1px solid ${step.color}30`, fontSize: '12px', fontWeight: 600, color: step.color, letterSpacing: '0.05em' }}>
                  {step.title}
                </div>
                {idx < 5 && <div style={{ display: 'flex', alignItems: 'center', color: '#E5E9F0' }}><ArrowRight size={14} /></div>}
              </React.Fragment>
            ))}
          </div>

          {/* Detailed Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{ ...s.card, padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#E5E9F0' }}>{step.num}</div>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${step.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <step.icon size={24} color={step.color} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: s.text, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: s.textSec, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {step.details.map((detail, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#F7F9FC', borderRadius: '8px' }}>
                      <CheckCircle size={14} color="#2D7D46" />
                      <span style={{ fontSize: '13px', color: s.text }}>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1.5rem', background: s.navy, textAlign: 'center' }}>
        <div style={{ ...s.container, maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Ready to start your first transaction?</h2>
          <Link href="/auth" style={s.btnPrimary}>Start a Trade <ArrowRight size={16} /></Link>
        </div>
      </section>
    </PageLayout>
  );
}
