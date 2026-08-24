'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, Shield, Search, DollarSign, Users, Truck, ArrowLeft, ArrowRight,
  CheckCircle, Star, Ship, FileText, Lock, Zap, BarChart3, ChevronDown,
  Menu, X, MapPin, Mail, Building2, Award, TrendingUp, Languages
} from 'lucide-react';

const content = {
  ar: {
    nav: { howItWorks: 'كيف يعمل', forBuyers: 'للمستوردين', forExporters: 'للمصدرين', compliance: 'الامتثال', about: 'عن مسار', operationsCenter: 'مركز العمليات', login: 'تسجيل الدخول' },
    hero: {
      badge: 'ممر نيجيريا ← المملكة العربية السعودية',
      title: 'البنية التحتية الموثوقة للتجارة بين',
      titleHighlight: 'أفريقيا والمملكة العربية السعودية',
      subtitle: 'أطراف موثوقة. تنسيق امتثال. فحص مستقل. تسوية آمنة. تمويل تجاري. طبقة معاملات مسؤولة واحدة.',
      ctaPrimary: 'ابدأ تجارة',
      ctaSecondary: 'كن شريكاً',
      stat1: '+$817 مليون', stat1Label: 'سوق تصدير السمسم',
      stat2: '١٠٠٪', stat2Label: 'تغطية الامتثال',
      stat3: 'من البداية للنهاية', stat3Label: 'إدارة المعاملات',
    },
    howItWorks: {
      title: 'كيف تعمل مسار',
      subtitle: 'ست خطوات للتجارة العابرة للحدود الموثوقة.',
      steps: [
        { title: 'توثيق الأطراف', desc: 'فحص صارم KYB/KYC للمشتري والمصدر.' },
        { title: 'إنشاء المعاملة', desc: 'عملية طلب عروض أسعار مراقبة.' },
        { title: 'تنسيق الامتثال', desc: 'حزمة امتثال كاملة لوثائق التصدير والاستيراد.' },
        { title: 'فحص مستقل', desc: 'شركاء فحص معتمدون يقدمون أدلة جودة مستقلة.' },
        { title: 'تسوية الضمان', desc: 'الأموال محتفظ بها من قبل بنك سعودي مرخص.' },
        { title: 'الشحن والتسليم', desc: 'مراقبة شحن من البداية للنهاية.' },
      ],
    },
    forBuyers: {
      badge: 'للمستوردين السعوديين',
      title: 'اشترِ سلعًا نيجيرية موثوقة بثقة',
      subtitle: 'طبقة معاملات مسؤولة تغطي توثيق الموردين والامتثال والفحص.',
      benefits: ['مصدرون نيجيريون موثقون', 'حزمة امتثال كاملة', 'فحص مستقل', 'حماية الضمان', 'رؤية كاملة للمعاملة', 'وثائق هيئة الغذاء والدواء مدارة'],
      cta: 'ابدأ الشراء',
    },
    forExporters: {
      badge: 'للمصدرين النيجيريين',
      title: 'الوصول إلى مشترين سعوديين موثقين',
      subtitle: 'مسار تنسق الامتثال والفحص والتوثيق والتمويل.',
      benefits: ['وصول إلى مشترين موثقين', 'تنسيق الامتثال', 'بناء درجة الثقة', 'فحص مستقل', 'مسارات التمويل', 'تسوية آمنة'],
      cta: 'ابدأ التصدير',
    },
    compliance: {
      title: 'الامتثال والثقة',
      subtitle: 'كل معاملة تحكمها معايير امتثال صارمة.',
      clearanceTitle: 'درجة تصفية مسار',
      clearanceDesc: 'كل معاملة تحصل على درجة تصفية (٠-١٠٠) بناءً على اكتمال التوثيق وتوثيق الطرف المقابل.',
    },
    about: {
      title: 'عن مسار',
      subtitle: 'البنية التحتية للتجارة الموثوقة بين أفريقيا والمملكة العربية السعودية.',
      quote: '"لا تتمت عملية غير مثبتة. أثبت المعاملة يدوياً، قِسها، ثم أتمتها."',
    },
    cta: { title: 'هل أنت مستعد لبدء التجارة؟', subtitle: 'انضم إلى مسار والوصول إلى البنية التحتية الموثوقة.', primary: 'ابدأ تجارة', secondary: 'اتصل بنا' },
    footer: { description: 'البنية التحتية الموثوقة للتجارة بين أفريقيا والمملكة العربية السعودية.', copyright: '© ٢٠٢٦ مسار. جميع الحقوق محفوظة.' },
  },
  en: {
    nav: { howItWorks: 'How It Works', forBuyers: 'For Buyers', forExporters: 'For Exporters', compliance: 'Compliance', about: 'About', operationsCenter: 'Operations Center', login: 'Sign In' },
    hero: {
      badge: 'Nigeria → Saudi Arabia Corridor',
      title: 'The Trusted Trade Infrastructure Between',
      titleHighlight: 'Africa & Saudi Arabia',
      subtitle: 'Verified counterparties. Compliance orchestration. Independent inspection. Secure settlement. Trade finance. One accountable transaction layer.',
      ctaPrimary: 'Start a Trade', ctaSecondary: 'Become a Partner',
      stat1: '$817M+', stat1Label: 'Nigeria Sesame Market',
      stat2: '100%', stat2Label: 'Compliance Coverage',
      stat3: 'End-to-End', stat3Label: 'Transaction Management',
    },
    howItWorks: {
      title: 'How MASAR Works',
      subtitle: 'Six steps to trusted cross-border trade.',
      steps: [
        { title: 'Verify Counterparties', desc: 'Rigorous KYB/KYC verification for buyer and exporter.' },
        { title: 'Create Transaction', desc: 'Controlled RFQ process matches verified parties.' },
        { title: 'Compliance Orchestration', desc: 'Complete compliance pack for export and import.' },
        { title: 'Independent Inspection', desc: 'Approved partners provide independent quality evidence.' },
        { title: 'Escrow Settlement', desc: 'Funds held by licensed Saudi bank/PSP partner.' },
        { title: 'Shipment & Delivery', desc: 'End-to-end shipment monitoring.' },
      ],
    },
    forBuyers: {
      badge: 'For Saudi Buyers',
      title: 'Buy Verified Nigerian Commodities with Confidence',
      subtitle: 'One accountable transaction layer covering verification, compliance, inspection.',
      benefits: ['Verified Nigerian exporters', 'Complete compliance pack', 'Independent inspection', 'Escrow protection', 'Full transaction visibility', 'SFDA documentation managed'],
      cta: 'Start Buying',
    },
    forExporters: {
      badge: 'For Nigerian Exporters',
      title: 'Access Verified Saudi Buyers',
      subtitle: 'MASAR coordinates compliance, inspection, documentation and financing.',
      benefits: ['Access verified buyers', 'Compliance coordination', 'Build trust score', 'Independent inspection', 'Financing pathways', 'Secure settlement'],
      cta: 'Start Exporting',
    },
    compliance: {
      title: 'Compliance & Trust',
      subtitle: 'Every transaction governed by rigorous compliance standards.',
      clearanceTitle: 'MASAR Clearance Score',
      clearanceDesc: 'Every transaction receives a clearance score (0–100) based on documentation and verification.',
    },
    about: {
      title: 'About MASAR',
      subtitle: 'The trusted transaction infrastructure for Africa–Saudi trade.',
      quote: '"Do not automate an unproven process. Prove it manually, measure it, then automate."',
    },
    cta: { title: 'Ready to Start Trading?', subtitle: 'Join MASAR and access trusted trade infrastructure.', primary: 'Start a Trade', secondary: 'Contact Us' },
    footer: { description: 'The trusted transaction infrastructure for Africa–Saudi trade.', copyright: '© 2026 MASAR. All rights reserved.' },
  },
};

// Glass style objects
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
};

const glassLightStyle = {
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.9)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
};

const glassDarkStyle = {
  background: 'rgba(10, 22, 40, 0.75)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(200, 169, 81, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
};

const glassCardStyle = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s ease',
};

const glassBtnStyle = {
  background: 'linear-gradient(135deg, #C8A951 0%, #E8D48B 100%)',
  border: '1px solid rgba(200, 169, 81, 0.5)',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(200, 169, 81, 0.3)',
};

const meshGradientStyle = {
  background: `
    radial-gradient(at 20% 20%, rgba(200,169,81,0.15) 0px, transparent 50%),
    radial-gradient(at 80% 80%, rgba(0,108,53,0.1) 0px, transparent 50%),
    radial-gradient(at 50% 50%, rgba(30,77,140,0.1) 0px, transparent 50%),
    linear-gradient(135deg, #0A1628 0%, #0F2847 100%)
  `,
};

const islamicPatternStyle = {
  backgroundImage: `
    linear-gradient(30deg, rgba(200,169,81,0.06) 12%, transparent 12.5%, transparent 87%, rgba(200,169,81,0.06) 87.5%),
    linear-gradient(150deg, rgba(200,169,81,0.06) 12%, transparent 12.5%, transparent 87%, rgba(200,169,81,0.06) 87.5%),
    linear-gradient(30deg, rgba(200,169,81,0.06) 12%, transparent 12.5%, transparent 87%, rgba(200,169,81,0.06) 87.5%),
    linear-gradient(150deg, rgba(200,169,81,0.06) 12%, transparent 12.5%, transparent 87%, rgba(200,169,81,0.06) 87.5%),
    linear-gradient(60deg, rgba(0,108,53,0.04) 25%, transparent 25.5%, transparent 75%, rgba(0,108,53,0.04) 75%),
    linear-gradient(60deg, rgba(0,108,53,0.04) 25%, transparent 25.5%, transparent 75%, rgba(0,108,53,0.04) 75%)
  `,
  backgroundSize: '80px 140px',
};

const arabesquePatternStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a951' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

export default function LandingPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = content[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar');

  return (
    <div className={`min-h-screen ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.5s ease',
        padding: scrolled ? '8px 0' : '16px 0',
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem',
        }}>
          <div style={{
            ...(scrolled ? glassStyle : {}),
            borderRadius: scrolled ? '1rem' : '0',
            padding: scrolled ? '12px 24px' : '0',
            transition: 'all 0.5s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #C8A951 0%, #E8D48B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(200,169,81,0.3)',
                }}>
                  <Globe size={24} color="#0A1628" />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: scrolled ? '#0A1628' : 'white',
                    transition: 'color 0.3s ease',
                    margin: 0,
                    lineHeight: 1.2,
                  }}>{isRTL ? 'مسار' : 'MASAR'}</h1>
                  <p style={{
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: scrolled ? '#C8A951' : 'rgba(232,212,139,0.9)',
                    margin: 0,
                  }}>{isRTL ? 'نظام تشغيل الممر' : 'Corridor OS'}</p>
                </div>
              </div>
              
              {/* Desktop Nav */}
              <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '24px' }}>
                {['howItWorks', 'forBuyers', 'forExporters', 'compliance', 'about'].map((item) => (
                  <a key={item} href={`#${item === 'howItWorks' ? 'how-it-works' : item}`} style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: scrolled ? '#374151' : 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}>
                    {t.nav[item as keyof typeof t.nav]}
                  </a>
                ))}
                <button onClick={toggleLang} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  ...(scrolled ? { background: '#f3f4f6', color: '#374151' } : { ...glassStyle, color: 'white' }),
                  border: 'none',
                  cursor: 'pointer',
                }}>
                  <Languages size={16} />
                  {isRTL ? 'EN' : 'عربي'}
                </button>
                <Link href="/auth" style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  ...(scrolled ? { background: '#0A1628', color: 'white' } : { ...glassStyle, color: 'white' }),
                }}>
                  {t.nav.login}
                </Link>
                <Link href="/dashboard" style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  ...glassBtnStyle,
                  color: '#0A1628',
                }}>
                  {t.nav.operationsCenter}
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button className="lg:hidden" style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={24} color={scrolled ? '#374151' : 'white'} /> : <Menu size={24} color={scrolled ? '#374151' : 'white'} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden" style={{ marginTop: '8px', margin: '8px 16px 0', ...glassLightStyle, borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['howItWorks', 'forBuyers', 'forExporters', 'compliance', 'about'].map((item) => (
                <a key={item} href={`#${item === 'howItWorks' ? 'how-it-works' : item}`} style={{ fontSize: '1rem', color: '#374151', fontWeight: 500, textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
                  {t.nav[item as keyof typeof t.nav]}
                </a>
              ))}
              <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/auth" style={{ display: 'block', padding: '12px', borderRadius: '12px', textAlign: 'center', fontWeight: 500, textDecoration: 'none', color: '#374151', ...glassCardStyle }}>{t.nav.login}</Link>
                <Link href="/dashboard" style={{ display: 'block', padding: '12px', borderRadius: '12px', textAlign: 'center', fontWeight: 700, textDecoration: 'none', color: '#0A1628', ...glassBtnStyle }}>{t.nav.operationsCenter}</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        ...meshGradientStyle,
      }}>
        {/* Islamic Pattern Overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, ...islamicPatternStyle }} />
        
        {/* Decorative Blurs */}
        <div style={{ position: 'absolute', top: '5rem', right: '5rem', width: '24rem', height: '24rem', background: 'rgba(200,169,81,0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '5rem', left: '5rem', width: '20rem', height: '20rem', background: 'rgba(0,108,53,0.1)', borderRadius: '50%', filter: 'blur(80px)' }} />

        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '8rem 1rem 5rem', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            {/* Left Content */}
            <div className="animate-fade-in">
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                ...glassStyle,
                borderRadius: '9999px',
                marginBottom: '2rem',
              }}>
                <div style={{ width: '10px', height: '10px', background: '#C8A951', borderRadius: '50%' }} className="animate-pulse-slow" />
                <span style={{ fontSize: '0.875rem', color: 'rgba(232,212,139,0.9)', fontWeight: 500 }}>{t.hero.badge}</span>
              </div>
              
              {/* Title */}
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3.75rem)',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.1,
                margin: 0,
              }} className="font-display">
                {t.hero.title}
                <span style={{ display: 'block', marginTop: '8px' }} className="gradient-text-gold">{t.hero.titleHighlight}</span>
              </h1>
              
              {/* Subtitle */}
              <p style={{ fontSize: '1.125rem', color: '#d1d5db', marginTop: '2rem', maxWidth: '36rem', lineHeight: 1.7 }}>
                {t.hero.subtitle}
              </p>
              
              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '2.5rem' }}>
                <Link href="/auth" style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  ...glassBtnStyle,
                  color: '#0A1628',
                }}>
                  {t.hero.ctaPrimary}
                  {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                </Link>
                <a href="#about" style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  ...glassStyle,
                }}>
                  {t.hero.ctaSecondary}
                </a>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[{ v: t.hero.stat1, l: t.hero.stat1Label }, { v: t.hero.stat2, l: t.hero.stat2Label }, { v: t.hero.stat3, l: t.hero.stat3Label }].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 700, color: 'white', margin: 0 }}>{s.v}</p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px', margin: '4px 0 0' }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual - Corridor Card */}
            <div className="hidden lg:block animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div style={{ ...glassDarkStyle, borderRadius: '24px', padding: '2rem', position: 'relative' }}>
                {/* Corridor Visualization */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '5rem', height: '5rem', ...glassStyle, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <span style={{ fontSize: '2.5rem' }}>🇳🇬</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', margin: 0 }}>{isRTL ? 'نيجيريا' : 'Nigeria'}</p>
                  </div>
                  <div style={{ flex: 1, margin: '0 24px', position: 'relative' }}>
                    <div style={{ height: '6px', background: 'linear-gradient(to right, #4ade80, #C8A951, #facc15)', borderRadius: '9999px' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: '#C8A951', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(200,169,81,0.4)' }} className="animate-float">
                      <Ship size={20} color="#0A1628" />
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '5rem', height: '5rem', ...glassStyle, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <span style={{ fontSize: '2.5rem' }}>🇸🇦</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', margin: 0 }}>{isRTL ? 'السعودية' : 'Saudi Arabia'}</p>
                  </div>
                </div>

                {/* Transaction Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { icon: Users, label: isRTL ? 'أطراف موثوقة' : 'Verified Counterparties', s: 'complete' },
                    { icon: Shield, label: isRTL ? 'تنسيق الامتثال' : 'Compliance', s: 'complete' },
                    { icon: Search, label: isRTL ? 'فحص مستقل' : 'Inspection', s: 'active' },
                    { icon: FileText, label: isRTL ? 'إدارة الوثائق' : 'Documents', s: 'complete' },
                    { icon: Lock, label: isRTL ? 'تسوية الضمان' : 'Settlement', s: 'pending' },
                  ].map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', ...glassStyle, borderRadius: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: step.s === 'complete' ? 'rgba(74,222,128,0.2)' : step.s === 'active' ? 'rgba(200,169,81,0.2)' : 'rgba(255,255,255,0.1)',
                      }}>
                        <step.icon size={16} color={step.s === 'complete' ? '#4ade80' : step.s === 'active' ? '#C8A951' : '#9ca3af'} />
                      </div>
                      <span style={{ fontSize: '0.875rem', color: 'white', flex: 1 }}>{step.label}</span>
                      {step.s === 'complete' && <CheckCircle size={14} color="#4ade80" />}
                      {step.s === 'active' && <div style={{ width: '8px', height: '8px', background: '#C8A951', borderRadius: '50%' }} className="animate-pulse-slow" />}
                    </div>
                  ))}
                </div>

                {/* Floating Badges */}
                <div style={{ position: 'absolute', top: '-16px', left: '-16px', ...glassLightStyle, borderRadius: '12px', padding: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} className="animate-float">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="#22c55e" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827' }}>{isRTL ? 'معاملة مكتملة' : 'Transaction Complete'}</span>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', background: '#C8A951', borderRadius: '12px', padding: '12px', boxShadow: '0 8px 24px rgba(200,169,81,0.4)' }} className="animate-float">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={16} color="#0A1628" fill="#0A1628" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0A1628' }}>{isRTL ? 'ثقة: ٩٤' : 'Trust: 94'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }} className="animate-bounce">
          <ChevronDown size={24} color="rgba(255,255,255,0.5)" />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '5rem 1rem', background: '#f9fafb', ...arabesquePatternStyle }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 3rem)', fontWeight: 700, color: '#0A1628', margin: 0 }} className="font-display">{t.howItWorks.title}</h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginTop: '1rem', maxWidth: '40rem', margin: '1rem auto 0' }}>{t.howItWorks.subtitle}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {t.howItWorks.steps.map((step, idx) => {
              const icons = [Users, FileText, Shield, Search, Lock, Ship];
              const bgColors = ['rgba(59,130,246,0.1)', 'rgba(168,85,247,0.1)', 'rgba(34,197,94,0.1)', 'rgba(234,179,8,0.1)', 'rgba(200,169,81,0.1)', 'rgba(239,68,68,0.1)'];
              const Icon = icons[idx];
              return (
                <div key={idx} style={{ ...glassCardStyle, borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: bgColors[idx], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={24} color="#0A1628" />
                    </div>
                    <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#e5e7eb' }}>{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', marginBottom: '8px', margin: '0 0 8px' }}>{step.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Buyers */}
      <section id="for-buyers" style={{ padding: '5rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(34,197,94,0.1)', borderRadius: '9999px', marginBottom: '24px' }}>
                <span style={{ fontSize: '1.25rem' }}>🇸🇦</span>
                <span style={{ fontSize: '0.875rem', color: '#15803d', fontWeight: 600 }}>{t.forBuyers.badge}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700, color: '#0A1628', margin: 0 }} className="font-display">{t.forBuyers.title}</h2>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', marginTop: '16px' }}>{t.forBuyers.subtitle}</p>
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {t.forBuyers.benefits.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', ...glassCardStyle, borderRadius: '12px' }}>
                    <CheckCircle size={18} color="#22c55e" />
                    <span style={{ color: '#374151' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '2rem', padding: '16px 32px', background: '#0A1628', color: 'white', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(10,22,40,0.3)' }}>
                {t.forBuyers.cta} {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </Link>
            </div>
            <div style={{ ...glassCardStyle, borderRadius: '24px', padding: '32px', ...arabesquePatternStyle }}>
              {[{ i: Building2, t: isRTL ? 'مصانع الأغذية' : 'Food Processors', d: isRTL ? 'سمسم فاخر' : 'Premium sesame', c: '#2563eb' }, { i: Truck, t: isRTL ? 'مستوردو السلع' : 'Commodity Importers', d: isRTL ? 'سمسم بالجملة' : 'Bulk sesame', c: '#16a34a' }, { i: Building2, t: isRTL ? 'مصانع الأغذية' : 'Food Manufacturers', d: isRTL ? 'إمدادات ثابتة' : 'Consistent supply', c: '#9333ea' }, { i: Users, t: isRTL ? 'الموزعون' : 'Distributors', d: isRTL ? 'سلسلة إمداد موثوقة' : 'Verified supply chain', c: '#C8A951' }].map((p, idx) => (
                <div key={idx} style={{ ...glassCardStyle, borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', background: '#f9fafb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p.i size={22} color={p.c} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>{p.t}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '2px 0 0' }}>{p.d}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Exporters */}
      <section id="for-exporters" style={{ padding: '5rem 1rem', background: '#f9fafb', ...arabesquePatternStyle }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div className="order-2 lg:order-1" style={{ ...glassCardStyle, borderRadius: '24px', padding: '32px', ...arabesquePatternStyle }}>
              {[{ i: Award, t: isRTL ? 'درجة ثقة مسار' : 'MASAR Trust Score', d: isRTL ? 'بناء السمعة' : 'Build reputation', c: '#C8A951' }, { i: Users, t: isRTL ? 'مشترين موثقين' : 'Verified Buyers', d: isRTL ? 'وصول مباشر' : 'Direct access', c: '#2563eb' }, { i: Shield, t: isRTL ? 'دعم الامتثال' : 'Compliance Support', d: isRTL ? 'تنسيق كامل' : 'Full coordination', c: '#16a34a' }, { i: DollarSign, t: isRTL ? 'مسارات التمويل' : 'Financing', d: isRTL ? 'شركاء رأس المال' : 'Capital partners', c: '#9333ea' }].map((p, idx) => (
                <div key={idx} style={{ ...glassCardStyle, borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', background: '#f9fafb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p.i size={22} color={p.c} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>{p.t}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '2px 0 0' }}>{p.d}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-1 lg:order-2">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(34,197,94,0.1)', borderRadius: '9999px', marginBottom: '24px' }}>
                <span style={{ fontSize: '1.25rem' }}>🇳🇬</span>
                <span style={{ fontSize: '0.875rem', color: '#15803d', fontWeight: 600 }}>{t.forExporters.badge}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700, color: '#0A1628', margin: 0 }} className="font-display">{t.forExporters.title}</h2>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', marginTop: '16px' }}>{t.forExporters.subtitle}</p>
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {t.forExporters.benefits.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', ...glassCardStyle, borderRadius: '12px' }}>
                    <CheckCircle size={18} color="#22c55e" />
                    <span style={{ color: '#374151' }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '2rem', padding: '16px 32px', background: '#15803d', color: 'white', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(21,128,61,0.3)' }}>
                {t.forExporters.cta} {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section id="compliance" style={{ padding: '5rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 3rem)', fontWeight: 700, color: '#0A1628', margin: 0 }} className="font-display">{t.compliance.title}</h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginTop: '1rem', maxWidth: '40rem', margin: '1rem auto 0' }}>{t.compliance.subtitle}</p>
          </div>
          <div style={{ ...glassDarkStyle, borderRadius: '24px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, ...islamicPatternStyle }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center', position: 'relative', zIndex: 10 }} className="lg:grid-cols-2">
              <div>
                <h3 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem', margin: '0 0 1.5rem' }} className="font-display">{t.compliance.clearanceTitle}</h3>
                <p style={{ fontSize: '1.125rem', color: '#d1d5db' }}>{t.compliance.clearanceDesc}</p>
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {[{ s: '90–100', l: isRTL ? 'جاهز' : 'Ready', c: '#4ade80' }, { s: '75–89', l: isRTL ? 'مشروط' : 'Conditional', c: '#facc15' }, { s: '50–74', l: isRTL ? 'في خطر' : 'At Risk', c: '#fb923c' }, { s: '<50', l: isRTL ? 'غير جاهز' : 'Not Ready', c: '#f87171' }].map((item, idx) => (
                    <div key={idx} style={{ ...glassStyle, borderRadius: '12px', padding: '16px' }}>
                      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: item.c, margin: 0 }}>{item.s}</p>
                      <p style={{ fontSize: '0.875rem', color: '#d1d5db', marginTop: '4px', margin: '4px 0 0' }}>{item.l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '144px',
                  height: '144px',
                  borderRadius: '50%',
                  background: 'rgba(74,222,128,0.2)',
                  border: '4px solid #4ade80',
                  boxShadow: '0 0 40px rgba(74,222,128,0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }} className="animate-glow">
                  <div>
                    <p style={{ fontSize: '3rem', fontWeight: 700, color: '#4ade80', margin: 0 }}>94</p>
                    <p style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 600, margin: 0 }}>{isRTL ? 'درجة' : 'SCORE'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: '5rem 1rem', background: '#f9fafb', ...arabesquePatternStyle }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div>
              <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 3rem)', fontWeight: 700, color: '#0A1628', margin: 0 }} className="font-display">{t.about.title}</h2>
              <p style={{ fontSize: '1.125rem', color: '#6b7280', marginTop: '1.5rem' }}>{t.about.subtitle}</p>
              <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[{ i: Globe, t: isRTL ? 'نظام تشغيل الممر' : 'Corridor OS', d: isRTL ? 'مبني خصيصاً لممر نيجيريا ← السعودية' : 'Purpose-built for Nigeria → Saudi corridor', bg: 'rgba(59,130,246,0.1)', c: '#2563eb' }, { i: Shield, t: isRTL ? 'الثقة بالتصميم' : 'Trust by Design', d: isRTL ? 'أطراف موثوقة وفحص مستقل' : 'Verified counterparties, independent inspection', bg: 'rgba(34,197,94,0.1)', c: '#16a34a' }, { i: Zap, t: isRTL ? 'أثبت أولاً' : 'Prove First', d: isRTL ? 'أثبت يدوياً ثم أتمت' : 'Prove manually, then automate', bg: 'rgba(200,169,81,0.1)', c: '#C8A951' }].map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <f.i size={24} color={f.c} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>{f.t}</h4>
                      <p style={{ color: '#6b7280', marginTop: '4px', margin: '4px 0 0' }}>{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...glassDarkStyle, borderRadius: '24px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.1, ...islamicPatternStyle }} />
              <div style={{ position: 'relative', zIndex: 10 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem', margin: '0 0 1.5rem' }} className="font-display">{isRTL ? 'مبدأ البناء' : 'The Build Principle'}</h3>
                <blockquote style={{ fontSize: '1.125rem', color: '#d1d5db', fontStyle: 'italic', borderRight: isRTL ? '4px solid #C8A951' : 'none', borderLeft: isRTL ? 'none' : '4px solid #C8A951', paddingRight: isRTL ? '24px' : 0, paddingLeft: isRTL ? 0 : '24px', lineHeight: 1.7, margin: 0 }}>
                  {t.about.quote}
                </blockquote>
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[isRTL ? 'أولى معاملات نيجيريا ← السعودية' : 'First Nigeria → Saudi transactions', isRTL ? 'بروتوكول كامل تم التقاطه' : 'Complete protocol captured', isRTL ? 'الاقتصاديات تم التحقق منها' : 'Economics validated', isRTL ? 'أساس لأتمتة مسار' : 'Foundation for MASAR automation'].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle size={16} color="#4ade80" />
                      <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 1rem', ...meshGradientStyle, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, ...islamicPatternStyle }} />
        <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 3rem)', fontWeight: 700, color: 'white', margin: 0 }} className="font-display">{t.cta.title}</h2>
          <p style={{ fontSize: '1.25rem', color: '#d1d5db', marginTop: '1.5rem' }}>{t.cta.subtitle}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: '3rem' }}>
            <Link href="/auth" style={{ padding: '20px 40px', borderRadius: '12px', fontSize: '1.25rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', ...glassBtnStyle, color: '#0A1628', boxShadow: '0 8px 24px rgba(200,169,81,0.4)' }}>
              {t.cta.primary} {isRTL ? <ArrowLeft size={22} /> : <ArrowRight size={22} />}
            </Link>
            <a href="mailto:info@masar.sa" style={{ padding: '20px 40px', borderRadius: '12px', fontSize: '1.25rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', ...glassStyle }}>
              {t.cta.secondary}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0A1628', padding: '4rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #C8A951 0%, #E8D48B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={24} color="#0A1628" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', margin: 0 }}>{isRTL ? 'مسار' : 'MASAR'}</h3>
                  <p style={{ fontSize: '9px', color: '#C8A951', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>{isRTL ? 'نظام تشغيل الممر' : 'Corridor OS'}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{t.footer.description}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', marginBottom: '16px', margin: '0 0 16px' }}>{isRTL ? 'المنصة' : 'Platform'}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['howItWorks', 'forBuyers', 'forExporters', 'compliance'].map((item) => (
                  <a key={item} href={`#${item === 'howItWorks' ? 'how-it-works' : item}`} style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none' }}>{t.nav[item as keyof typeof t.nav]}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', marginBottom: '16px', margin: '0 0 16px' }}>{isRTL ? 'ممرات التجارة' : 'Corridors'}</h4>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>🇳🇬 {isRTL ? 'نيجيريا' : 'Nigeria'} → 🇸🇦 {isRTL ? 'السعودية' : 'Saudi Arabia'}</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '8px', margin: '8px 0 0' }}>{isRTL ? 'ممرات أخرى قريباً' : 'More corridors coming'}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', marginBottom: '16px', margin: '0 0 16px' }}>{isRTL ? 'اتصل بنا' : 'Contact'}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="mailto:info@masar.sa" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none' }}><Mail size={14} /> info@masar.sa</a>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}><MapPin size={14} /> {isRTL ? 'الرياض' : 'Riyadh'}, {isRTL ? 'السعودية' : 'Saudi Arabia'}</p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}><MapPin size={14} /> {isRTL ? 'لاغوس' : 'Lagos'}, {isRTL ? 'نيجيريا' : 'Nigeria'}</p>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{t.footer.copyright}</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ fontSize: '0.75rem', color: '#6b7280', textDecoration: 'none' }}>{isRTL ? 'سياسة الخصوصية' : 'Privacy'}</a>
              <a href="#" style={{ fontSize: '0.75rem', color: '#6b7280', textDecoration: 'none' }}>{isRTL ? 'شروط الخدمة' : 'Terms'}</a>
              <a href="#" style={{ fontSize: '0.75rem', color: '#6b7280', textDecoration: 'none' }}>{isRTL ? 'الامتثال' : 'PDPL'}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
