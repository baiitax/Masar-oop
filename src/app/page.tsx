'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, Shield, Search, DollarSign, Users, Truck, ArrowLeft, ArrowRight,
  CheckCircle, Star, Ship, FileText, Lock, Zap, BarChart3, ChevronDown,
  Menu, X, MapPin, Mail, Building2, Award, TrendingUp, Languages, Leaf
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${scrolled ? 'glass rounded-2xl px-6 py-3' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-masar-gold to-masar-gold-light flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-masar-navy" />
              </div>
              <div>
                <h1 className={`text-xl font-bold tracking-wider transition-colors ${scrolled ? 'text-masar-navy' : 'text-white'}`}>
                  {isRTL ? 'مسار' : 'MASAR'}
                </h1>
                <p className={`text-[9px] tracking-[0.2em] uppercase transition-colors ${scrolled ? 'text-masar-gold' : 'text-masar-gold-light'}`}>
                  {isRTL ? 'نظام تشغيل الممر' : 'Corridor OS'}
                </p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-6">
              {['howItWorks', 'forBuyers', 'forExporters', 'compliance', 'about'].map((item) => (
                <a key={item} href={`#${item === 'howItWorks' ? 'how-it-works' : item}`} className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-masar-navy' : 'text-white/80 hover:text-white'}`}>
                  {t.nav[item as keyof typeof t.nav]}
                </a>
              ))}
              <button onClick={toggleLang} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${scrolled ? 'bg-gray-100 text-gray-700' : 'glass text-white'}`}>
                <Languages size={16} />
                {isRTL ? 'EN' : 'عربي'}
              </button>
              <Link href="/auth" className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${scrolled ? 'bg-masar-navy text-white hover:bg-masar-dark' : 'glass-btn text-masar-navy'}`}>
                {t.nav.login}
              </Link>
              <Link href="/dashboard" className="px-5 py-2.5 bg-masar-gold text-masar-navy rounded-xl text-sm font-bold hover:bg-masar-gold-light transition-all shadow-lg">
                {t.nav.operationsCenter}
              </Link>
            </div>

            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} className={scrolled ? 'text-gray-700' : 'text-white'} /> : <Menu size={24} className={scrolled ? 'text-gray-700' : 'text-white'} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 mx-4 glass-light rounded-2xl p-6 shadow-xl">
            <div className="space-y-4">
              {['howItWorks', 'forBuyers', 'forExporters', 'compliance', 'about'].map((item) => (
                <a key={item} href={`#${item === 'howItWorks' ? 'how-it-works' : item}`} className="block text-base text-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  {t.nav[item as keyof typeof t.nav]}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link href="/auth" className="block w-full py-3 glass-input rounded-xl text-center font-medium">{t.nav.login}</Link>
                <Link href="/dashboard" className="block w-full py-3 bg-masar-gold text-masar-navy rounded-xl text-center font-bold">{t.nav.operationsCenter}</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden mesh-gradient">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-masar-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-saudi-green/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8">
                <div className="w-2.5 h-2.5 bg-masar-gold rounded-full animate-pulse-slow" />
                <span className="text-sm text-masar-gold-light font-medium">{t.hero.badge}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-display">
                {t.hero.title}
                <span className="block mt-2 gradient-text-gold">{t.hero.titleHighlight}</span>
              </h1>
              
              <p className="text-lg text-gray-300 mt-8 max-w-xl leading-relaxed">{t.hero.subtitle}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href="/auth" className="px-8 py-4 glass-btn rounded-xl text-lg font-bold text-masar-navy flex items-center justify-center gap-3 group shadow-xl">
                  {t.hero.ctaPrimary}
                  {isRTL ? <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </Link>
                <a href="#about" className="px-8 py-4 glass rounded-xl text-lg font-semibold text-white flex items-center justify-center gap-2">
                  {t.hero.ctaSecondary}
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-white/10">
                {[{ v: t.hero.stat1, l: t.hero.stat1Label }, { v: t.hero.stat2, l: t.hero.stat2Label }, { v: t.hero.stat3, l: t.hero.stat3Label }].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white">{s.v}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="glass-dark rounded-3xl p-8 relative">
                <div className="flex items-center justify-between mb-10">
                  <div className="text-center">
                    <div className="w-20 h-20 glass rounded-2xl flex items-center justify-center mx-auto mb-3"><span className="text-4xl">🇳🇬</span></div>
                    <p className="text-sm font-semibold text-white">{isRTL ? 'نيجيريا' : 'Nigeria'}</p>
                  </div>
                  <div className="flex-1 mx-6 relative">
                    <div className="h-1.5 bg-gradient-to-r from-green-400 via-masar-gold to-yellow-400 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-masar-gold rounded-2xl flex items-center justify-center shadow-xl animate-float">
                      <Ship size={20} className="text-masar-navy" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 glass rounded-2xl flex items-center justify-center mx-auto mb-3"><span className="text-4xl">🇸🇦</span></div>
                    <p className="text-sm font-semibold text-white">{isRTL ? 'السعودية' : 'Saudi Arabia'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Users, label: isRTL ? 'أطراف موثوقة' : 'Verified Counterparties', s: 'complete' },
                    { icon: Shield, label: isRTL ? 'تنسيق الامتثال' : 'Compliance', s: 'complete' },
                    { icon: Search, label: isRTL ? 'فحص مستقل' : 'Inspection', s: 'active' },
                    { icon: FileText, label: isRTL ? 'إدارة الوثائق' : 'Documents', s: 'complete' },
                    { icon: Lock, label: isRTL ? 'تسوية الضمان' : 'Settlement', s: 'pending' },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 glass rounded-xl">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${step.s === 'complete' ? 'bg-green-500/20' : step.s === 'active' ? 'bg-masar-gold/20' : 'bg-white/10'}`}>
                        <step.icon size={16} className={step.s === 'complete' ? 'text-green-400' : step.s === 'active' ? 'text-masar-gold' : 'text-gray-400'} />
                      </div>
                      <span className="text-sm text-white flex-1">{step.label}</span>
                      {step.s === 'complete' && <CheckCircle size={14} className="text-green-400" />}
                      {step.s === 'active' && <div className="w-2 h-2 bg-masar-gold rounded-full animate-pulse-slow" />}
                    </div>
                  ))}
                </div>
                <div className="absolute -top-4 -left-4 glass-light rounded-xl p-3 shadow-xl animate-float">
                  <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /><span className="text-xs font-semibold text-gray-900">{isRTL ? 'معاملة مكتملة' : 'Transaction Complete'}</span></div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-masar-gold rounded-xl p-3 shadow-xl animate-float" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-2"><Star size={16} className="text-masar-navy" /><span className="text-xs font-bold text-masar-navy">{isRTL ? 'ثقة: ٩٤' : 'Trust: 94'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><ChevronDown size={24} className="text-white/50" /></div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-gray-50 arabesque-pattern">
        <div className="container-masar">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-masar-navy font-display">{t.howItWorks.title}</h2>
            <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.howItWorks.steps.map((step, idx) => {
              const icons = [Users, FileText, Shield, Search, Lock, Ship];
              const colors = ['from-blue-500/20 to-blue-600/10', 'from-purple-500/20 to-purple-600/10', 'from-green-500/20 to-green-600/10', 'from-yellow-500/20 to-yellow-600/10', 'from-masar-gold/20 to-masar-gold/10', 'from-red-500/20 to-red-600/10'];
              const Icon = icons[idx];
              return (
                <div key={idx} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center`}>
                      <Icon size={24} className="text-masar-navy" />
                    </div>
                    <span className="text-3xl font-bold text-gray-200">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Buyers */}
      <section id="for-buyers" className="section-padding">
        <div className="container-masar">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-6">
                <span className="text-xl">🇸🇦</span>
                <span className="text-sm text-green-700 font-semibold">{t.forBuyers.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-masar-navy font-display">{t.forBuyers.title}</h2>
              <p className="text-lg text-gray-500 mt-4">{t.forBuyers.subtitle}</p>
              <div className="mt-8 space-y-3">
                {t.forBuyers.benefits.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 glass-card rounded-xl">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth" className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-masar-navy text-white rounded-xl font-semibold hover:bg-masar-dark transition-all shadow-lg group">
                {t.forBuyers.cta} {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </Link>
            </div>
            <div className="glass-card rounded-3xl p-8 arabesque-pattern">
              {[{ i: Building2, t: isRTL ? 'مصانع الأغذية' : 'Food Processors', d: isRTL ? 'سمسم فاخر' : 'Premium sesame', c: 'text-blue-600' }, { i: Truck, t: isRTL ? 'مستوردو السلع' : 'Commodity Importers', d: isRTL ? 'سمسم بالجملة' : 'Bulk sesame', c: 'text-green-600' }, { i: Building2, t: isRTL ? 'مصانع الأغذية' : 'Food Manufacturers', d: isRTL ? 'إمدادات ثابتة' : 'Consistent supply', c: 'text-purple-600' }, { i: Users, t: isRTL ? 'الموزعون' : 'Distributors', d: isRTL ? 'سلسلة إمداد موثوقة' : 'Verified supply chain', c: 'text-masar-gold' }].map((p, idx) => (
                <div key={idx} className="glass-card rounded-xl p-4 mb-3 last:mb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center"><p.i size={22} className={p.c} /></div>
                    <div><p className="font-semibold text-gray-900">{p.t}</p><p className="text-xs text-gray-500">{p.d}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Exporters */}
      <section id="for-exporters" className="section-padding bg-gray-50 arabesque-pattern">
        <div className="container-masar">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 glass-card rounded-3xl p-8 arabesque-pattern">
              {[{ i: Award, t: isRTL ? 'درجة ثقة مسار' : 'MASAR Trust Score', d: isRTL ? 'بناء السمعة' : 'Build reputation', c: 'text-masar-gold' }, { i: Users, t: isRTL ? 'مشترين موثقين' : 'Verified Buyers', d: isRTL ? 'وصول مباشر' : 'Direct access', c: 'text-blue-600' }, { i: Shield, t: isRTL ? 'دعم الامتثال' : 'Compliance Support', d: isRTL ? 'تنسيق كامل' : 'Full coordination', c: 'text-green-600' }, { i: DollarSign, t: isRTL ? 'مسارات التمويل' : 'Financing', d: isRTL ? 'شركاء رأس المال' : 'Capital partners', c: 'text-purple-600' }].map((p, idx) => (
                <div key={idx} className="glass-card rounded-xl p-4 mb-3 last:mb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center"><p.i size={22} className={p.c} /></div>
                    <div><p className="font-semibold text-gray-900">{p.t}</p><p className="text-xs text-gray-500">{p.d}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-6">
                <span className="text-xl">🇳🇬</span>
                <span className="text-sm text-green-700 font-semibold">{t.forExporters.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-masar-navy font-display">{t.forExporters.title}</h2>
              <p className="text-lg text-gray-500 mt-4">{t.forExporters.subtitle}</p>
              <div className="mt-8 space-y-3">
                {t.forExporters.benefits.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 glass-card rounded-xl">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth" className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition-all shadow-lg group">
                {t.forExporters.cta} {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section id="compliance" className="section-padding">
        <div className="container-masar">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-masar-navy font-display">{t.compliance.title}</h2>
            <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">{t.compliance.subtitle}</p>
          </div>
          <div className="glass-dark rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 islamic-pattern opacity-10" />
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6 font-display">{t.compliance.clearanceTitle}</h3>
                <p className="text-lg text-gray-300">{t.compliance.clearanceDesc}</p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[{ s: '90–100', l: isRTL ? 'جاهز' : 'Ready', c: 'text-green-400' }, { s: '75–89', l: isRTL ? 'مشروط' : 'Conditional', c: 'text-yellow-400' }, { s: '50–74', l: isRTL ? 'في خطر' : 'At Risk', c: 'text-orange-400' }, { s: '<50', l: isRTL ? 'غير جاهز' : 'Not Ready', c: 'text-red-400' }].map((item, idx) => (
                    <div key={idx} className="glass rounded-xl p-4"><p className={`text-2xl font-bold ${item.c}`}>{item.s}</p><p className="text-sm text-gray-300 mt-1">{item.l}</p></div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-green-500/20 border-4 border-green-400 shadow-2xl animate-glow">
                  <div><p className="text-5xl font-bold text-green-400">94</p><p className="text-xs text-green-300 font-semibold">{isRTL ? 'درجة' : 'SCORE'}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section-padding bg-gray-50 arabesque-pattern">
        <div className="container-masar">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-masar-navy font-display">{t.about.title}</h2>
              <p className="text-lg text-gray-500 mt-6">{t.about.subtitle}</p>
              <div className="mt-10 space-y-6">
                {[{ i: Globe, t: isRTL ? 'نظام تشغيل الممر' : 'Corridor OS', d: isRTL ? 'مبني خصيصاً لممر نيجيريا ← السعودية' : 'Purpose-built for Nigeria → Saudi corridor', c: 'bg-blue-100 text-blue-600' }, { i: Shield, t: isRTL ? 'الثقة بالتصميم' : 'Trust by Design', d: isRTL ? 'أطراف موثوقة وفحص مستقل' : 'Verified counterparties, independent inspection', c: 'bg-green-100 text-green-600' }, { i: Zap, t: isRTL ? 'أثبت أولاً' : 'Prove First', d: isRTL ? 'أثبت يدوياً ثم أتمت' : 'Prove manually, then automate', c: 'bg-masar-gold/20 text-masar-gold' }].map((f, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${f.c} flex items-center justify-center flex-shrink-0`}><f.i size={24} /></div>
                    <div><h4 className="text-lg font-bold text-gray-900">{f.t}</h4><p className="text-gray-500 mt-1">{f.d}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-dark rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute inset-0 islamic-pattern opacity-10" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-6 font-display">{isRTL ? 'مبدأ البناء' : 'The Build Principle'}</h3>
                <blockquote className="text-lg text-gray-300 italic border-r-4 border-masar-gold pr-6 leading-relaxed">{t.about.quote}</blockquote>
                <div className="mt-8 space-y-3">
                  {[isRTL ? 'أولى معاملات نيجيريا ← السعودية' : 'First Nigeria → Saudi transactions', isRTL ? 'بروتوكول كامل تم التقاطه' : 'Complete protocol captured', isRTL ? 'الاقتصاديات تم التحقق منها' : 'Economics validated', isRTL ? 'أساس لأتمتة مسار' : 'Foundation for MASAR automation'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3"><CheckCircle size={16} className="text-green-400" /><span className="text-gray-300 text-sm">{item}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 mesh-gradient relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-display">{t.cta.title}</h2>
          <p className="text-xl text-gray-300 mt-6">{t.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/auth" className="px-10 py-5 glass-btn rounded-xl text-lg font-bold text-masar-navy flex items-center justify-center gap-3 shadow-xl">
              {t.cta.primary} {isRTL ? <ArrowLeft size={22} /> : <ArrowRight size={22} />}
            </Link>
            <a href="mailto:info@masar.sa" className="px-10 py-5 glass rounded-xl text-lg font-semibold text-white flex items-center justify-center gap-2">
              {t.cta.secondary}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-masar-navy py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-masar-gold to-masar-gold-light flex items-center justify-center"><Globe className="w-6 h-6 text-masar-navy" /></div>
                <div><h3 className="text-lg font-bold text-white">{isRTL ? 'مسار' : 'MASAR'}</h3><p className="text-[9px] text-masar-gold tracking-widest uppercase">{isRTL ? 'نظام تشغيل الممر' : 'Corridor OS'}</p></div>
              </div>
              <p className="text-sm text-gray-400">{t.footer.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{isRTL ? 'المنصة' : 'Platform'}</h4>
              <div className="space-y-2">
                {['howItWorks', 'forBuyers', 'forExporters', 'compliance'].map((item) => (
                  <a key={item} href={`#${item === 'howItWorks' ? 'how-it-works' : item}`} className="block text-sm text-gray-400 hover:text-white">{t.nav[item as keyof typeof t.nav]}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{isRTL ? 'ممرات التجارة' : 'Corridors'}</h4>
              <p className="text-sm text-gray-400">🇳🇬 {isRTL ? 'نيجيريا' : 'Nigeria'} → 🇸🇦 {isRTL ? 'السعودية' : 'Saudi Arabia'}</p>
              <p className="text-xs text-gray-500 mt-2">{isRTL ? 'ممرات أخرى قريباً' : 'More corridors coming'}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{isRTL ? 'اتصل بنا' : 'Contact'}</h4>
              <div className="space-y-2">
                <a href="mailto:info@masar.sa" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"><Mail size={14} /> info@masar.sa</a>
                <p className="flex items-center gap-2 text-sm text-gray-400"><MapPin size={14} /> {isRTL ? 'الرياض' : 'Riyadh'}, {isRTL ? 'السعودية' : 'Saudi Arabia'}</p>
                <p className="flex items-center gap-2 text-sm text-gray-400"><MapPin size={14} /> {isRTL ? 'لاغوس' : 'Lagos'}, {isRTL ? 'نيجيريا' : 'Nigeria'}</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">{t.footer.copyright}</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-gray-500 hover:text-white">{isRTL ? 'سياسة الخصوصية' : 'Privacy'}</a>
              <a href="#" className="text-xs text-gray-500 hover:text-white">{isRTL ? 'شروط الخدمة' : 'Terms'}</a>
              <a href="#" className="text-xs text-gray-500 hover:text-white">{isRTL ? 'الامتثال' : 'PDPL'}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
