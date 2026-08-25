'use client';
import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/shared/PageLayout';
import { Shield, Search, Lock, FileText, Banknote, Ship, Eye, Activity, CheckCircle, ArrowRight, Globe, Layers, Database, Cpu, Network, Users, Truck } from 'lucide-react';

export default function PlatformPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F7F9FC', text: '#122033', textSec: '#5B6778', card: { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }, btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)', color: '#0B1F3A', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', border: 'none', cursor: 'pointer' }, container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' } };

  const modules = [
    { icon: Globe, title: 'Command Center', desc: 'Executive dashboard with real-time transaction visibility, GMV tracking, risk monitoring and operational SLAs.', color: '#C9A24A' },
    { icon: Users, title: 'Buyer Management', desc: 'Complete KYB verification, sanctions screening, UBO verification and commercial review for Saudi buyers.', color: '#3B82F6' },
    { icon: Truck, title: 'Exporter Management', desc: 'Exporter verification, MASAR Trust Score calculation, commodity capability tracking and quality history.', color: '#2D7D46' },
    { icon: FileText, title: 'RFQ & Deal Room', desc: 'Controlled transaction room — not a marketplace. Buyer creates RFQ, MASAR identifies suitable exporters.', color: '#8B5CF6' },
    { icon: Layers, title: 'Transaction Workspace', desc: 'Every deal receives its own workspace with timeline, clearance score, documents and status tracking.', color: '#C9A24A' },
    { icon: Shield, title: 'Compliance OS', desc: 'Transaction compliance checklist covering export-side and Saudi-side requirements with clearance scoring.', color: '#3B82F6' },
    { icon: Database, title: 'Document Vault', desc: 'Secure document repository with cryptographic hashing, version control and verification workflow.', color: '#2D7D46' },
    { icon: Search, title: 'Inspection Control', desc: 'MASAR orchestrates inspection through approved partners. Independent evidence controls release.', color: '#8B5CF6' },
    { icon: Banknote, title: 'Finance Workspace', desc: 'Structured financing packages for capital partners with exposure tracking and risk assessment.', color: '#C9A24A' },
    { icon: Lock, title: 'Escrow & Settlement', desc: 'Funds held by licensed Saudi bank/PSP partner. Release conditions tied to compliance milestones.', color: '#3B82F6' },
    { icon: Ship, title: 'Shipment Control', desc: 'End-to-end shipment monitoring from port loading through transit to Saudi port verification.', color: '#2D7D46' },
    { icon: Activity, title: 'Audit & Risk Engine', desc: 'Append-only audit trail with cryptographic integrity. Four-eyes control for critical actions.', color: '#8B5CF6' },
  ];

  return (
    <PageLayout title="The MASAR Platform" subtitle="Twelve operational modules powering the complete transaction lifecycle — from counterparty verification to settlement." breadcrumb={[{ label: 'Platform' }]}>
      {/* Intro */}
      <section style={{ padding: '4rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ width: '48px', height: '3px', background: 'linear-gradient(90deg, #C9A24A, #E3C875)', borderRadius: '2px', marginBottom: '1.5rem' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: s.text, marginBottom: '1rem' }}>One rail. Every critical condition.</h2>
              <p style={{ fontSize: '1rem', color: s.textSec, lineHeight: 1.7, marginBottom: '1.5rem' }}>
                MASAR is not a marketplace. It is not a broker. It is an asset-light trade infrastructure company that orchestrates the transaction layer between African suppliers and Saudi buyers.
              </p>
              <p style={{ fontSize: '1rem', color: s.textSec, lineHeight: 1.7, marginBottom: '2rem' }}>
                MASAR owns software, workflow, transaction data, compliance intelligence, relationships and release-condition logic. MASAR does not own farms, commodity inventory, trucks, ships, warehouses, escrow funds, inspection laboratories or a lending balance sheet.
              </p>
              <Link href="/auth" style={s.btnPrimary}>Start a Trade <ArrowRight size={16} /></Link>
            </div>
            <div style={{ ...s.card, padding: '2rem' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em', marginBottom: '1.5rem' }}>PLATFORM CAPABILITIES</h3>
              {['Transaction orchestration', 'Counterparty verification', 'Compliance management', 'Inspection coordination', 'Document vault', 'Clearance scoring', 'Finance workspace', 'Settlement coordination', 'Audit trail', 'Risk engine'].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: idx < 9 ? '1px solid #F1F5F9' : 'none' }}>
                  <CheckCircle size={14} color="#2D7D46" />
                  <span style={{ fontSize: '14px', color: s.text }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section style={{ padding: '4rem 1.5rem', background: s.bg }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: s.text }}>Twelve Operational Modules</h2>
            <p style={{ fontSize: '1rem', color: s.textSec, maxWidth: '600px', margin: '0.5rem auto 0' }}>Every module is designed around the transaction, not around users browsing a marketplace.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {modules.map((mod, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem', transition: 'all 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${mod.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <mod.icon size={20} color={mod.color} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: s.text }}>{mod.title}</h3>
                </div>
                <p style={{ fontSize: '13px', color: s.textSec, lineHeight: 1.6 }}>{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1.5rem', background: s.navy, textAlign: 'center' }}>
        <div style={{ ...s.container, maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Ready to explore the MASAR platform?</h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Whether you are a Saudi buyer, African exporter or capital partner, MASAR has a place for you.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth" style={s.btnPrimary}>Start a Trade <ArrowRight size={16} /></Link>
            <Link href="/contact" style={{ ...s.btnPrimary, background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
