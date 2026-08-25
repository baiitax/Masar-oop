'use client';
import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/shared/PageLayout';
import { Users, ShieldCheck, FileText, Search, Banknote, Handshake, Award, Star, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';

export default function ForExportersPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F7F9FC', text: '#122033', textSec: '#5B6778', card: { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }, btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)', color: '#0B1F3A', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }, container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' } };

  const benefits = [
    { icon: Users, title: 'Buyer Access', desc: 'Access verified Saudi commercial food and agro buyers. Institutional buyers with procurement capacity.' },
    { icon: ShieldCheck, title: 'KYB Verification', desc: 'Build credibility through MASAR verification. Your identity, ownership and credentials become trusted.' },
    { icon: FileText, title: 'Compliance Support', desc: 'MASAR coordinates all export documentation — Certificate of Origin, phytosanitary, lab COA and more.' },
    { icon: Search, title: 'Inspection Coordination', desc: 'Independent inspection validates your quality. Approved partners provide evidence that builds trust.' },
    { icon: Banknote, title: 'Financing Pathway', desc: 'Access trade finance through MASAR capital partners. Up to 80% advance on verified transactions.' },
    { icon: Handshake, title: 'Settlement Coordination', desc: 'Secure settlement through licensed escrow partners. Release when conditions are met.' },
    { icon: Award, title: 'MASAR Trust Score', desc: 'Build your reputation with verified transaction history. Higher score means more buyer access.' },
    { icon: TrendingUp, title: 'Performance History', desc: 'Every completed transaction builds your track record. Quality consistency becomes your competitive advantage.' },
  ];

  const trustFactors = [
    { label: 'Identity Verification', weight: '15 pts' },
    { label: 'Export History', weight: '18 pts' },
    { label: 'Documentation Quality', weight: '16 pts' },
    { label: 'Inspection Results', weight: '15 pts' },
    { label: 'Fulfilment Record', weight: '15 pts' },
    { label: 'Quality Consistency', weight: '14 pts' },
    { label: 'Dispute History', weight: '7 pts' },
  ];

  return (
    <PageLayout title="Turn Verified Supply into Trusted Market Access" subtitle="MASAR helps qualified African exporters reach institutional Saudi buyers while reducing transaction friction." breadcrumb={[{ label: 'For Exporters' }]}>
      {/* Benefits */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {benefits.map((b, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <b.icon size={20} color={s.gold} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: s.text }}>{b.title}</h3>
                </div>
                <p style={{ fontSize: '13px', color: s.textSec, lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Score */}
      <section style={{ padding: '4rem 1.5rem', background: s.bg }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: s.text, marginBottom: '1rem' }}>MASAR Exporter Trust Score</h2>
              <p style={{ fontSize: '14px', color: s.textSec, lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Every exporter receives a proprietary Trust Score (0-100) based on identity verification, export history, documentation quality, inspection results, fulfilment record and quality consistency.
              </p>
              <p style={{ fontSize: '13px', color: '#9BA3AE' }}>Initially rules-based. Evolving into protocol intelligence.</p>
            </div>
            <div style={{ ...s.card, padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'conic-gradient(#C9A24A 0deg, #C9A24A 338deg, #E5E9F0 338deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: s.text }}>94</span>
                    <span style={{ fontSize: '9px', fontWeight: 600, color: s.gold, letterSpacing: '0.08em' }}>TRUST SCORE</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {trustFactors.map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#F7F9FC', borderRadius: '6px' }}>
                    <span style={{ fontSize: '12px', color: s.text }}>{f.label}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: s.gold }}>{f.weight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1.5rem', background: s.navy, textAlign: 'center' }}>
        <div style={{ ...s.container, maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Join the Exporter Network</h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Connect with verified Saudi buyers and build your MASAR Trust Score.</p>
          <Link href="/auth" style={s.btnPrimary}>Apply Now <ArrowRight size={16} /></Link>
        </div>
      </section>
    </PageLayout>
  );
}
