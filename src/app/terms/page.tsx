'use client';
import React from 'react';
import PageLayout from '@/components/shared/PageLayout';

export default function TermsPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', container: { maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' } };

  const sections = [
    { title: '1. Agreement to Terms', content: 'By accessing or using the MASAR Trade Corridor Operating System ("Platform", "Service") operated by Kurra Greenfield Merchants Limited ("KGM", "we", "us"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform. These Terms constitute a legally binding agreement between you and Kurra Greenfield Merchants Limited, CAC Registration RC 1539036.' },
    { title: '2. Description of Service', content: 'MASAR is a trade transaction infrastructure platform that orchestrates the transaction layer between African commodity exporters and Saudi/GCC buyers. MASAR provides: Counterparty verification (KYB/KYC); Transaction workflow management; Compliance orchestration; Independent inspection coordination; Document management and verification; Clearance readiness scoring; Trade finance coordination; Settlement orchestration through licensed financial partners; Shipment tracking; Audit trail maintenance. MASAR is NOT a marketplace, broker, commodity trader, logistics company, escrow agent, or lender. MASAR owns the software, workflow, transaction data, compliance intelligence, and release-condition logic. MASAR does not own farms, commodity inventory, trucks, ships, warehouses, escrow funds, inspection laboratories, or a lending balance sheet.' },
    { title: '3. Eligibility', content: 'To use MASAR, you must: Be at least 18 years of age; Be a legally registered business entity or authorized representative; Complete our KYB/KYC verification process; Not be subject to international sanctions; Comply with all applicable laws in Nigeria, Saudi Arabia, and your jurisdiction.' },
    { title: '4. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials. You must enable multi-factor authentication (MFA) when required. You must immediately notify us of any unauthorized access. You are responsible for all activities under your account. We reserve the right to suspend or terminate accounts that violate these Terms.' },
    { title: '5. Transaction Terms', content: 'All transactions facilitated through MASAR are governed by: The specific contract terms agreed between buyer and exporter; MASAR transaction protocol and release conditions; Applicable trade laws (Incoterms, UCP 600 where applicable); Nigerian export regulations; Saudi Arabian import regulations including SFDA requirements. MASAR does not guarantee transaction outcomes, commodity quality, delivery timelines, or payment. MASAR coordinates the process; transaction counterparties bear commercial risk.' },
    { title: '6. Fees and Payment', content: 'MASAR charges platform fees for transaction coordination, compliance management, and settlement orchestration. Fee schedules are provided separately and agreed upon during onboarding. All fees are exclusive of applicable taxes. Payment terms are specified in individual transaction agreements.' },
    { title: '7. Compliance Obligations', content: 'Users must: Provide accurate and complete information during verification; Maintain current and valid documentation; Comply with all applicable export/import regulations; Cooperate with inspection and compliance processes; Report any material changes that may affect transaction compliance. MASAR reserves the right to suspend transactions that fail compliance requirements.' },
    { title: '8. Intellectual Property', content: 'The MASAR platform, including all software, algorithms, scoring models, workflow designs, and documentation, is the intellectual property of Kurra Greenfield Merchants Limited. Users are granted a limited, non-exclusive, non-transferable license to use the Platform for its intended purpose. Users retain ownership of their business data and documents uploaded to the Platform.' },
    { title: '9. Limitation of Liability', content: 'To the maximum extent permitted by law: MASAR is not liable for indirect, incidental, consequential, or punitive damages; MASAR is not liable for losses arising from counterparty default, commodity quality issues, or market fluctuations; MASAR is not liable for actions or omissions of third-party partners (inspection companies, laboratories, financial institutions, logistics providers); Our total liability shall not exceed the platform fees paid by you in the 12 months preceding the claim. MASAR provides infrastructure and coordination — commercial risk remains with transaction counterparties.' },
    { title: '10. Dispute Resolution', content: 'Disputes between transaction counterparties should first be resolved through the MASAR dispute management process. Unresolved disputes may be escalated to mediation. These Terms are governed by the laws of the Federal Republic of Nigeria, with Saudi Arabian law applying to Saudi-specific regulatory matters.' },
    { title: '11. Termination', content: 'Either party may terminate with 30 days written notice. We may immediately terminate or suspend access for: Breach of these Terms; Fraudulent activity; Sanctions violations; Non-compliance with regulatory requirements; Failure to complete KYB/KYC verification. Upon termination, your access to the Platform will be revoked, but transaction records will be retained as required by law.' },
    { title: '12. Indemnification', content: 'You agree to indemnify and hold harmless Kurra Greenfield Merchants Limited, its officers, directors, employees, and partners from any claims, losses, or damages arising from: Your use of the Platform; Your violation of these Terms; Your violation of applicable laws; Your transactions with counterparties.' },
    { title: '13. Force Majeure', content: 'MASAR shall not be liable for delays or failures in performance resulting from events beyond our reasonable control, including but not limited to: natural disasters, war, terrorism, pandemics, government actions, port closures, shipping disruptions, or internet outages.' },
    { title: '14. Amendments', content: 'We may modify these Terms from time to time. Material changes will be communicated 30 days in advance. Continued use after changes constitutes acceptance.' },
    { title: '15. Contact', content: 'For legal inquiries: Legal Department, Kurra Greenfield Merchants Limited (MASAR), Email: legal@kgmlimited.com, General: info@masar.sa, WhatsApp: +234 802 222 0247.' },
  ];

  return (
    <PageLayout title="Terms of Service" subtitle="The legal agreement governing your use of the MASAR platform." breadcrumb={[{ label: 'Legal' }, { label: 'Terms of Service' }]}>
      <section style={{ padding: '3rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ padding: '16px 20px', background: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE', marginBottom: '2rem' }}>
            <p style={{ fontSize: '13px', color: '#1E40AF', margin: 0 }}><strong>Last Updated:</strong> 25 August 2026 · <strong>Effective:</strong> 25 August 2026 · <strong>Entity:</strong> Kurra Greenfield Merchants Limited (CAC RC 1539036)</p>
          </div>
          {sections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: s.text, marginBottom: '0.75rem' }}>{sec.title}</h2>
              <p style={{ fontSize: '14px', color: s.textSec, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{sec.content}</p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
