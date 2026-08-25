'use client';
import React from 'react';
import PageLayout from '@/components/shared/PageLayout';

export default function PrivacyPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F6F8FB', text: '#142235', textSec: '#667085', border: '#E4E7EC', container: { maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' } };

  const sections = [
    { title: '1. Introduction', content: 'Kurra Greenfield Merchants Limited ("KGM", "we", "us", or "operating as MASAR") is committed to protecting the privacy and personal data of all individuals who interact with our platform, services, and operations. This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use the MASAR Trade Corridor Operating System and related services. This policy applies to all users including buyers, exporters, capital partners, inspection partners, and visitors to our website. We operate under the Nigeria Data Protection Regulation (NDPR), the Saudi Arabia Personal Data Protection Law (PDPL), and other applicable data protection frameworks.' },
    { title: '2. Data Controller', content: 'The data controller for all personal data processed through MASAR is Kurra Greenfield Merchants Limited, CAC Registration Number RC 1539036, with registered operations in Lagos, Kano, and Abuja, Nigeria, and Riyadh and Makkah, Saudi Arabia. For data protection inquiries, please contact our Data Protection Officer at dpo@kgmlimited.com.' },
    { title: '3. Information We Collect', content: 'We collect the following categories of personal data: Identity Information (full name, date of birth, nationality, government-issued identification numbers); Contact Information (email address, phone number, physical address); Business Information (company name, registration number, CAC details, NEPC registration, trade licenses, beneficial ownership information); Financial Information (bank account details, transaction history, credit references, payment information); Transaction Data (commodity specifications, contract terms, inspection results, compliance documents, shipment details); Technical Data (IP address, browser type, device information, login credentials, session data); and Communication Data (correspondence, support tickets, feedback).' },
    { title: '4. How We Use Your Information', content: 'We process personal data for the following purposes: To verify counterparty identity (KYB/KYC) as required by our trust protocol; To facilitate and manage trade transactions between buyers and exporters; To conduct compliance checks including sanctions screening and AML verification; To coordinate independent inspection and quality verification; To process financing requests and settlement coordination through licensed partners; To maintain audit trails and transaction evidence as required by our operating model; To communicate transaction updates, system notifications, and service information; To improve our platform, services, and user experience; To comply with legal and regulatory obligations in Nigeria and Saudi Arabia.' },
    { title: '5. Legal Basis for Processing', content: 'We process personal data based on: Contract Performance (processing necessary to fulfill our contractual obligations); Legitimate Interest (processing for fraud prevention, platform security, and service improvement); Legal Obligation (processing required by Nigerian and Saudi Arabian law); and Consent (where specifically obtained for marketing communications or optional features).' },
    { title: '6. Data Sharing', content: 'We may share personal data with: Transaction Counterparties (buyers, exporters, and their authorized representatives within a transaction); Inspection Partners (independent inspection companies and laboratories for quality verification); Financial Partners (licensed banks, escrow providers, and trade finance institutions for settlement); Regulatory Authorities (as required by Nigerian and Saudi Arabian law); Technology Service Providers (cloud hosting, security, and platform infrastructure providers under strict data processing agreements). We do not sell personal data to third parties.' },
    { title: '7. International Data Transfers', content: 'As a cross-border trade platform, personal data may be transferred between Nigeria and Saudi Arabia. We ensure appropriate safeguards are in place for international transfers, including contractual clauses, adequacy assessments, and compliance with both NDPR and PDPL requirements. Data residency requirements are evaluated before production deployment.' },
    { title: '8. Data Security', content: 'We implement comprehensive security measures including: Encryption at rest and in transit (256-bit SSL/TLS); Role-based access control (RBAC) with separation of duties; Multi-factor authentication (MFA); Cryptographic document hashing for integrity verification; Append-only audit trails; Regular security assessments; Incident response procedures. Our security roadmap includes SOC 2 Type I (2027) and SOC 2 Type II / ISO 27001 (2028) certifications.' },
    { title: '9. Data Retention', content: 'We retain personal data for as long as necessary to fulfill the purposes for which it was collected, plus additional periods as required by law. Transaction data and audit trails are retained for a minimum of 7 years as required by financial regulations. KYB/KYC documentation is retained for 5 years after the end of the business relationship. Marketing consent data is retained until consent is withdrawn.' },
    { title: '10. Your Rights', content: 'Under applicable data protection laws, you have the right to: Access your personal data; Rectify inaccurate data; Request erasure (subject to legal retention requirements); Restrict processing; Data portability; Object to processing; Withdraw consent (where applicable); Lodge a complaint with a supervisory authority. To exercise these rights, contact dpo@kgmlimited.com.' },
    { title: '11. Cookies and Tracking', content: 'Our website uses essential cookies for platform functionality, authentication, and security. We do not use tracking cookies for advertising purposes. Session cookies are automatically deleted when you close your browser. You may configure your browser to reject non-essential cookies.' },
    { title: '12. Children\'s Privacy', content: 'MASAR services are not directed at individuals under 18 years of age. We do not knowingly collect personal data from children.' },
    { title: '13. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. Material changes will be communicated through the platform and via email. Continued use of the platform after changes constitutes acceptance of the updated policy.' },
    { title: '14. Contact', content: 'For privacy-related inquiries: Data Protection Officer, Kurra Greenfield Merchants Limited (MASAR), Email: dpo@kgmlimited.com, General: info@masar.sa, WhatsApp: +234 802 222 0247.' },
  ];

  return (
    <PageLayout title="Privacy Policy" subtitle="How MASAR collects, uses, and protects your personal data." breadcrumb={[{ label: 'Legal' }, { label: 'Privacy Policy' }]}>
      <section style={{ padding: '3rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ padding: '16px 20px', background: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0', marginBottom: '2rem' }}>
            <p style={{ fontSize: '13px', color: '#166534', margin: 0 }}><strong>Last Updated:</strong> 25 August 2026 · <strong>Effective:</strong> 25 August 2026 · <strong>Entity:</strong> Kurra Greenfield Merchants Limited (CAC RC 1539036)</p>
          </div>
          {sections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: s.text, marginBottom: '0.75rem' }}>{sec.title}</h2>
              <p style={{ fontSize: '14px', color: s.textSec, lineHeight: 1.8 }}>{sec.content}</p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
