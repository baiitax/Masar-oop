'use client';
import React from 'react';
import PageLayout from '@/components/shared/PageLayout';
import { Shield, Lock, KeyRound, Database, Eye, Server, Activity, CheckCircle, FileText, Globe } from 'lucide-react';

export default function DataProtectionPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', container: { maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' } };

  const frameworks = [
    { name: 'NDPR', full: 'Nigeria Data Protection Regulation', desc: 'Primary data protection framework for Nigerian operations. We comply with registration, audit, and reporting requirements.', status: 'Compliant' },
    { name: 'PDPL', full: 'Saudi Arabia Personal Data Protection Law', desc: 'Governs personal data processing for Saudi operations. We comply with data residency, consent, and cross-border transfer requirements.', status: 'Compliant' },
    { name: 'AML/CFT', full: 'Anti-Money Laundering / Counter Financing of Terrorism', desc: 'SCUML certified. KYB/KYC procedures, sanctions screening, and suspicious transaction reporting.', status: 'Certified' },
    { name: 'ZATCA', full: 'Zakat, Tax and Customs Authority', desc: 'E-invoicing compliance for Saudi transactions. Integration planned for V1 protocol.', status: 'Roadmap' },
  ];

  const measures = [
    { icon: Lock, title: 'Encryption', desc: 'AES-256 encryption at rest. TLS 1.3 in transit. All sensitive data encrypted.' },
    { icon: KeyRound, title: 'Access Control', desc: 'Role-based access control (RBAC) with separation of duties. Four-eyes approval for critical actions.' },
    { icon: Shield, title: 'Authentication', desc: 'Multi-factor authentication (MFA) required. Session timeout after 30 minutes. Brute force protection.' },
    { icon: Database, title: 'Document Integrity', desc: 'SHA-256 cryptographic hashing for all documents. Immutable version history.' },
    { icon: Activity, title: 'Audit Trail', desc: 'Append-only audit log. Every privileged action recorded with timestamp, user, and evidence.' },
    { icon: Eye, title: 'Monitoring', desc: 'Real-time security monitoring. Anomaly detection. Incident response procedures.' },
    { icon: Server, title: 'Infrastructure', desc: 'Cloud hosting with Saudi data residency evaluation. Regular backups. Disaster recovery.' },
    { icon: FileText, title: 'Vendor Management', desc: 'Data processing agreements with all third-party providers. Regular security assessments.' },
  ];

  const roadmap = [
    { year: '2026', phase: 'V0', items: ['Secure operational controls', 'Encrypted document storage', 'Audit logging', 'RBAC implementation', 'MFA enforcement'] },
    { year: '2027', phase: 'V1', items: ['SOC 2 Type I certification', 'Automated compliance engine', 'API security hardening', 'Penetration testing', 'Security awareness training'] },
    { year: '2028', phase: 'V2', items: ['SOC 2 Type II certification', 'ISO 27001 certification', 'Advanced threat detection', 'Zero-trust architecture', 'Continuous compliance monitoring'] },
  ];

  return (
    <PageLayout title="Data Protection" subtitle="How MASAR protects your data across the Saudi–Africa trade corridor." breadcrumb={[{ label: 'Legal' }, { label: 'Data Protection' }]}>
      {/* Frameworks */}
      <section style={{ padding: '3rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: s.text, marginBottom: '1.5rem' }}>Regulatory Frameworks</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px', marginBottom: '3rem' }}>
            {frameworks.map((fw, idx) => (
              <div key={idx} style={{ background: 'white', border: `1px solid ${s.border}`, borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: s.gold }}>{fw.name}</span>
                    <p style={{ fontSize: '12px', color: s.textSec, margin: '2px 0 0' }}>{fw.full}</p>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: fw.status === 'Compliant' || fw.status === 'Certified' ? '#16A34A' : '#F59E0B', padding: '3px 8px', background: fw.status === 'Compliant' || fw.status === 'Certified' ? '#F0FDF4' : '#FFFBEB', borderRadius: '4px' }}>{fw.status}</span>
                </div>
                <p style={{ fontSize: '13px', color: s.textSec, lineHeight: 1.6 }}>{fw.desc}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: s.text, marginBottom: '1.5rem' }}>Security Measures</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '3rem' }}>
            {measures.map((m, idx) => (
              <div key={idx} style={{ background: 'white', border: `1px solid ${s.border}`, borderRadius: '12px', padding: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <m.icon size={20} color={s.gold} />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.text, marginBottom: '4px' }}>{m.title}</h3>
                <p style={{ fontSize: '13px', color: s.textSec, lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: s.text, marginBottom: '1.5rem' }}>Security Roadmap</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {roadmap.map((r, idx) => (
              <div key={idx} style={{ background: 'white', border: `1px solid ${s.border}`, borderRadius: '12px', padding: '20px', borderTop: idx === 0 ? `3px solid ${s.gold}` : `3px solid ${s.border}` }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: idx === 0 ? s.gold : '#98A2B3', letterSpacing: '0.08em' }}>{r.phase} — {r.year}</span>
                <div style={{ marginTop: '12px' }}>
                  {r.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                      <CheckCircle size={14} color={idx === 0 ? '#16A34A' : '#D0D5DD'} />
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
