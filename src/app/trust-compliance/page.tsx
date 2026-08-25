'use client';
import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/shared/PageLayout';
import { Shield, FileCheck, Search, Lock, Eye, CheckCircle, ArrowRight, ShieldCheck, Database, KeyRound, Server, Activity } from 'lucide-react';

export default function TrustCompliancePage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F7F9FC', text: '#122033', textSec: '#5B6778', card: { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }, btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)', color: '#0B1F3A', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }, container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' } };

  const exportDocs = ['Certificate of Origin', 'Phytosanitary Certificate', 'Certificate of Analysis', 'Export License', 'Commercial Invoice', 'Packing List', 'Inspection Certificate'];
  const saudiDocs = ['SFDA Requirements', 'Product Registration', 'Arabic Labelling', 'Halal Documentation', 'Customs Documentation', 'ZATCA E-Invoicing', 'Importer Documentation'];

  const securityFeatures = [
    { icon: Shield, title: 'Role-Based Access', desc: 'Strict RBAC with separation of duties. No single employee can onboard → approve → fund → release.' },
    { icon: KeyRound, title: 'Encrypted Data', desc: 'Encryption at rest and in transit. Secure secrets management.' },
    { icon: Database, title: 'Document Versioning', desc: 'Immutable version history with cryptographic hashing. No document can be silently altered.' },
    { icon: Activity, title: 'Audit Logs', desc: 'Every privileged action logged. Append-only audit trail with timestamp, user, action and evidence.' },
    { icon: Eye, title: 'Transaction Evidence', desc: 'Every decision leaves an evidence trail — from verification to settlement.' },
    { icon: Server, title: 'Partner Controls', desc: 'Controlled access for inspection partners, capital partners and logistics partners.' },
  ];

  const roadmap = [
    { phase: 'V0', year: '2026', items: ['Secure operational controls', 'Encrypted document storage', 'Audit logging', 'Four-eyes control'] },
    { phase: 'V1', year: '2027', items: ['SOC 2 Type I roadmap', 'Automated compliance engine', 'API security hardening'] },
    { phase: 'V2', year: '2028', items: ['SOC 2 Type II roadmap', 'ISO 27001 roadmap', 'Advanced threat detection'] },
  ];

  return (
    <PageLayout title="Trust & Compliance" subtitle="Every transaction leaves an evidence trail. Trust isn't a promise — it's a process." breadcrumb={[{ label: 'Trust & Compliance' }]}>
      {/* Trust Chain */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '3rem', padding: '2rem', background: s.bg, borderRadius: '16px' }}>
            {['Identity', 'Document', 'Inspection', 'Decision', 'Release', 'Settlement'].map((step, idx) => (
              <React.Fragment key={idx}>
                <div style={{ padding: '10px 20px', borderRadius: '8px', background: 'white', border: `1px solid ${s.gold}30`, fontSize: '12px', fontWeight: 600, color: s.gold, letterSpacing: '0.05em' }}>{step}</div>
                {idx < 5 && <div style={{ display: 'flex', alignItems: 'center', color: '#E5E9F0' }}><ArrowRight size={14} /></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Documents */}
      <section style={{ padding: '4rem 1.5rem', background: s.bg }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: s.text }}>Compliance Before the Cargo Moves</h2>
            <p style={{ fontSize: '1rem', color: s.textSec, maxWidth: '500px', margin: '0.5rem auto 0' }}>MASAR transforms fragmented compliance requirements into a managed transaction workflow.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ ...s.card, padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🇳🇬</span>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Export-Side Compliance</h3>
              </div>
              {exportDocs.map((doc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: idx < 6 ? '1px solid #F1F5F9' : 'none' }}>
                  <FileCheck size={14} color="#2D7D46" />
                  <span style={{ fontSize: '13px', color: s.text }}>{doc}</span>
                </div>
              ))}
            </div>
            <div style={{ ...s.card, padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🇸🇦</span>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>Saudi-Side Compliance</h3>
              </div>
              {saudiDocs.map((doc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: idx < 6 ? '1px solid #F1F5F9' : 'none' }}>
                  <FileCheck size={14} color="#2D7D46" />
                  <span style={{ fontSize: '13px', color: s.text }}>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: s.text }}>Security Architecture</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {securityFeatures.map((f, idx) => (
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

      {/* Security Roadmap */}
      <section style={{ padding: '4rem 1.5rem', background: s.bg }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: s.text }}>Security Roadmap</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {roadmap.map((r, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem', borderTop: idx === 0 ? `3px solid ${s.gold}` : '3px solid #E5E9F0' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: idx === 0 ? s.gold : '#9BA3AE', letterSpacing: '0.08em' }}>{r.phase} — {r.year}</span>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {r.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={14} color={idx === 0 ? '#2D7D46' : '#CBD5E1'} />
                      <span style={{ fontSize: '13px', color: s.text }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
