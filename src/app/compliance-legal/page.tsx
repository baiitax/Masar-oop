'use client';
import React from 'react';
import PageLayout from '@/components/shared/PageLayout';
import { Shield, CheckCircle, FileText, Globe, Building2, Award, Scale, Landmark } from 'lucide-react';

export default function ComplianceLegalPage() {
  const s = { navy: '#0B1F3A', gold: '#C9A24A', text: '#142235', textSec: '#667085', border: '#E4E7EC', container: { maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' } };

  const registrations = [
    { name: 'CAC', full: 'Corporate Affairs Commission', number: 'RC 1539036', desc: 'Federal Republic of Nigeria company registration.', country: '🇳🇬' },
    { name: 'BPP', full: 'Bureau of Public Procurement', number: 'Compliant', desc: 'Eligible for federal and state government contracts.', country: '🇳🇬' },
    { name: 'SCUML', full: 'Special Control Unit Against Money Laundering', number: 'Certified', desc: 'CBN anti-money laundering compliance certification.', country: '🇳🇬' },
    { name: 'FIRS', full: 'Federal Inland Revenue Service', number: 'Registered', desc: 'Tax registration and compliance.', country: '🇳🇬' },
    { name: 'PenCom', full: 'National Pension Commission', number: 'Compliant', desc: 'Employee pension scheme compliance.', country: '🇳🇬' },
    { name: 'ITF', full: 'Industrial Training Fund', number: 'Compliant', desc: 'Workforce development contribution.', country: '🇳🇬' },
    { name: 'NSITF', full: 'Nigeria Social Insurance Trust Fund', number: 'Compliant', desc: 'Employee compensation scheme.', country: '🇳🇬' },
    { name: 'MISA', full: 'Ministry of Investment Saudi Arabia', number: 'Registered', desc: 'Foreign investment registration for Saudi operations. 100% foreign ownership permitted.', country: '🇸🇦' },
  ];

  const tradeCompliance = [
    { title: 'Nigerian Export Requirements', items: ['NEPC Export License', 'Certificate of Origin', 'Phytosanitary Certificate (NAQS)', 'SONCAP Certification', 'Commercial Invoice', 'Packing List', 'Bill of Lading', 'Insurance Certificate'] },
    { title: 'Saudi Import Requirements', items: ['SFDA Product Registration', 'Arabic Labelling Compliance', 'Halal Certification (where applicable)', 'ZATCA E-Invoicing', 'Customs Declaration', 'Importer of Record Documentation', 'Certificate of Conformity', 'Saudi Standards Compliance'] },
  ];

  return (
    <PageLayout title="Compliance & Legal" subtitle="KGM/MASAR regulatory compliance, certifications, and legal framework." breadcrumb={[{ label: 'Legal' }, { label: 'Compliance' }]}>
      <section style={{ padding: '3rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          {/* Entity Info */}
          <div style={{ background: '#F9FAFB', borderRadius: '12px', border: `1px solid ${s.border}`, padding: '24px', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Building2 size={24} color={s.gold} />
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: s.text, margin: 0 }}>Kurra Greenfield Merchants Limited</h2>
                <p style={{ fontSize: '13px', color: s.textSec, margin: 0 }}>Operating as MASAR — Trade Corridor Operating System</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'white', borderRadius: '8px', border: `1px solid ${s.border}` }}><span style={{ fontSize: '11px', color: '#98A2B3' }}>CAC Registration</span><p style={{ fontSize: '14px', fontWeight: 600, color: s.text, margin: 0 }}>RC 1539036</p></div>
              <div style={{ padding: '12px', background: 'white', borderRadius: '8px', border: `1px solid ${s.border}` }}><span style={{ fontSize: '11px', color: '#98A2B3' }}>Nigeria Offices</span><p style={{ fontSize: '14px', fontWeight: 600, color: s.text, margin: 0 }}>Lagos · Kano · Abuja</p></div>
              <div style={{ padding: '12px', background: 'white', borderRadius: '8px', border: `1px solid ${s.border}` }}><span style={{ fontSize: '11px', color: '#98A2B3' }}>Saudi Offices</span><p style={{ fontSize: '14px', fontWeight: 600, color: s.text, margin: 0 }}>Riyadh · Makkah</p></div>
              <div style={{ padding: '12px', background: 'white', borderRadius: '8px', border: `1px solid ${s.border}` }}><span style={{ fontSize: '11px', color: '#98A2B3' }}>MISA Registration</span><p style={{ fontSize: '14px', fontWeight: 600, color: s.text, margin: 0 }}>Active · 100% Foreign Ownership</p></div>
            </div>
          </div>

          {/* Registrations */}
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: s.text, marginBottom: '1.5rem' }}>Registrations & Certifications</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginBottom: '3rem' }}>
            {registrations.map((reg, idx) => (
              <div key={idx} style={{ background: 'white', border: `1px solid ${s.border}`, borderRadius: '10px', padding: '16px', display: 'flex', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={18} color="#16A34A" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: s.text }}>{reg.name}</span>
                      <span style={{ fontSize: '14px', marginLeft: '6px' }}>{reg.country}</span>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#16A34A', padding: '2px 6px', background: '#F0FDF4', borderRadius: '4px' }}>{reg.number}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#98A2B3', margin: '2px 0' }}>{reg.full}</p>
                  <p style={{ fontSize: '12px', color: s.textSec, margin: 0 }}>{reg.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trade Compliance */}
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: s.text, marginBottom: '1.5rem' }}>Trade Compliance Framework</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
            {tradeCompliance.map((tc, idx) => (
              <div key={idx} style={{ background: 'white', border: `1px solid ${s.border}`, borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: s.text, marginBottom: '12px' }}>{tc.title}</h3>
                {tc.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: i < tc.items.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                    <CheckCircle size={14} color="#16A34A" />
                    <span style={{ fontSize: '13px', color: s.text }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
