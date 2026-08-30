'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, MapPin, Phone, Globe, Shield, FileText, Users, Building2 } from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'ar';
}

export default function Footer({ lang }: FooterProps) {
  const isRTL = lang === 'ar';
  const whatsappNumber = '2348141815466';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    lang === 'ar' 
      ? 'السلام عليكم ورحمة الله وبركاته،\n\nأنا مهتم بمعرفة المزيد عن خدمات منصة مسار للتجارة بين أفريقيا والمملكة العربية السعودية.\n\nشكراً لوقتكم الكريم.'
      : 'Assalamu Alaikum,\n\nI am interested in learning more about MASAR\'s trade corridor infrastructure for Africa–Saudi Arabia commerce.\n\nThank you for your time.'
  )}`;

  return (
    <footer style={{ background: '#0B1F3A', padding: '4rem 1.5rem 2rem', borderTop: '1px solid rgba(201,162,74,0.1)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
              </div>
              <div>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'white', letterSpacing: '0.08em' }}>MASAR</span>
                <span style={{ display: 'block', fontSize: '9px', color: 'rgba(201,162,74,0.6)', letterSpacing: '0.1em' }}>مسار — The Path</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '1rem' }}>
              {isRTL 
                ? 'البنية التحتية الموثوقة للتجارة بين أفريقيا والمملكة العربية السعودية.'
                : 'The trusted transaction infrastructure for the Saudi–Africa trade corridor.'}
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              {isRTL ? 'مدعوم من' : 'Powered by'} <a href="https://kgmlimited.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A24A', textDecoration: 'none' }}>Kurra Greenfield Merchants Limited</a>
            </p>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>CAC RC 1539036 · BPP · SCUML · MISA Saudi</p>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '1rem', textTransform: 'uppercase' }}>
              {isRTL ? 'المنصة' : 'Platform'}
            </h4>
            {[
              { label: isRTL ? 'كيف يعمل' : 'How It Works', href: '/how-it-works' },
              { label: isRTL ? 'للمستوردين' : 'For Buyers', href: '/for-buyers' },
              { label: isRTL ? 'للمصدرين' : 'For Exporters', href: '/for-exporters' },
              { label: isRTL ? 'شركاء رأس المال' : 'Capital Partners', href: '/for-capital-partners' },
              { label: isRTL ? 'الامتثال والثقة' : 'Trust & Compliance', href: '/trust-compliance' },
              { label: isRTL ? 'من نحن' : 'About', href: '/about' },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Corporate */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '1rem', textTransform: 'uppercase' }}>
              {isRTL ? 'المكاتب' : 'Offices'}
            </h4>
            {[
              { flag: '🇸🇦', city: isRTL ? 'الرياض' : 'Riyadh', country: isRTL ? 'السعودية' : 'Saudi Arabia' },
              { flag: '🇸🇦', city: isRTL ? 'مكة المكرمة' : 'Makkah', country: isRTL ? 'السعودية' : 'Saudi Arabia' },
              { flag: '🇳🇬', city: isRTL ? 'لاغوس' : 'Lagos', country: isRTL ? 'نيجيريا' : 'Nigeria' },
              { flag: '🇳🇬', city: isRTL ? 'كانو' : 'Kano', country: isRTL ? 'نيجيريا' : 'Nigeria' },
              { flag: '🇳🇬', city: isRTL ? 'أبوجا' : 'Abuja', country: isRTL ? 'نيجيريا' : 'Nigeria' },
            ].map((office, idx) => (
              <p key={idx} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                {office.flag} {office.city}, {office.country}
              </p>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '1rem', textTransform: 'uppercase' }}>
              {isRTL ? 'تواصل معنا' : 'Contact'}
            </h4>
            <a href="mailto:info@masar.sa" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '10px' }}>
              <Mail size={14} /> info@masar.sa
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '10px' }}>
              <MessageSquare size={14} /> WhatsApp: +234 814 181 5466
            </a>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#C9A24A', textDecoration: 'none', marginTop: '8px', fontWeight: 600 }}>
              {isRTL ? 'نموذج الاتصال' : 'Contact Form'} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '1rem', textTransform: 'uppercase' }}>
              {isRTL ? 'قانوني' : 'Legal'}
            </h4>
            {[
              { label: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy', href: '/privacy' },
              { label: isRTL ? 'شروط الخدمة' : 'Terms of Service', href: '/terms' },
              { label: isRTL ? 'حماية البيانات' : 'Data Protection', href: '/data-protection' },
              { label: isRTL ? 'الامتثال' : 'Compliance', href: '/compliance-legal' },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            © 2026 MASAR — مسار. {isRTL ? 'منتج شركة كورا غرينفيلد ميرCHANTS المحدودة' : 'A product of Kurra Greenfield Merchants Limited'} (CAC RC 1539036). {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>
            {isRTL ? 'بناء بنية تحتية موثوقة للتجارة بين أفريقيا والسعودية' : 'Building trusted infrastructure for Saudi–Africa trade.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}
