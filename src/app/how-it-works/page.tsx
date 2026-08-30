'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, Shield, Search, ArrowRight, CheckCircle, Star, Ship, Lock,
  Menu, X, Languages, TrendingUp, Leaf, ShieldCheck, FileCheck, BadgeCheck, 
  FileSignature, ClipboardCheck, Users, Award, Scale, MessageSquare, Mail,
  BarChart3, Quote, ChevronRight, Play, Pause
} from 'lucide-react';

export default function HowItWorksPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
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

  useEffect(() => {
    const savedLang = localStorage.getItem('masar-lang');
    if (savedLang) setLang(savedLang as 'en' | 'ar');
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem('masar-lang', newLang);
  };

  const whatsappUrl = `https://wa.me/2348022220247?text=${encodeURIComponent('Hello MASAR, I am interested in learning more about your trade corridor infrastructure.')}`;

  const s = {
    glass: { background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' },
    glassLight: { background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
    card: { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    gold: '#C9A24A', goldLight: '#E3C875', navy: '#0B1F3A', navyLight: '#102A4C', bg: '#F7F9FC', text: '#122033', textSec: '#5B6778', green: '#2D7D46',
    btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: `linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)`, color: '#0B1F3A', borderRadius: '12px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(201,162,74,0.25)' },
    btnSecondary: { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: 'rgba(255,255,255,0.08)', color: 'white', borderRadius: '12px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.3s ease' },
    section: { padding: '6rem 1.5rem' },
    container: { maxWidth: '1280px', margin: '0 auto' },
    sectionTitle: { fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0B1F3A', marginBottom: '1rem', lineHeight: 1.2 },
    sectionSubtitle: { fontSize: '1.05rem', color: '#5B6778', maxWidth: '640px', lineHeight: 1.7 },
    goldDivider: { width: '48px', height: '3px', background: 'linear-gradient(90deg, #C9A24A, #E3C875)', borderRadius: '2px', marginBottom: '1.5rem' },
  };

  const steps = [
    {
      num: '01', title: 'VERIFY', desc: 'Buyer and exporter KYB — identity, ownership, sanctions, trade history.', icon: ShieldCheck, color: '#C9A24A',
      image: '/images/trade-analytics.png',
      details: ['Entity verification against official registries', 'Ultimate Beneficial Owner (UBO) identification', 'Sanctions screening (OFAC, EU, UN)', 'PEP screening', 'Trade history analysis', 'Risk classification'],
      timeline: '24-72 hours', stats: { avgTime: '4.2h', autoClear: '78%', successRate: '96%' }
    },
    {
      num: '02', title: 'CONTRACT', desc: 'Digital transaction terms — commodity, quantity, quality, Incoterms, release conditions.', icon: FileSignature, color: '#3B82F6',
      image: '/images/trade-handshake.png',
      details: ['Commodity specification', 'Pricing and currency', 'Incoterms (FOB, CIF, CFR)', 'Delivery terms', 'Payment terms', 'Release conditions'],
      timeline: '1-3 business days', stats: { avgTime: '1.5d', completion: '98%', disputes: '<1%' }
    },
    {
      num: '03', title: 'COMPLY', desc: 'Build the compliance pack — export docs, SFDA, phytosanitary, lab COA.', icon: ClipboardCheck, color: '#8B5CF6',
      image: '/images/compliance-bg.png',
      details: ['Certificate of Origin', 'Phytosanitary Certificate', 'Certificate of Analysis', 'Health Certificate', 'Halal Certification', 'SFDA Registration'],
      timeline: '5 business days', stats: { documents: '14', autoRequest: '100%', verification: '94%' }
    },
    {
      num: '04', title: 'INSPECT', desc: 'Independent inspection and laboratory evidence against contract specifications.', icon: Search, color: '#2D7D46',
      image: '/images/inspection-lab.png',
      details: ['Pre-shipment inspection', 'Sample collection with chain of custody', 'Laboratory testing', 'Quality grading', 'Quantity verification', 'Container loading supervision'],
      timeline: '48-72 hours', stats: { passRate: '94%', avgTime: '36h', partners: '3' }
    },
    {
      num: '05', title: 'SECURE', desc: 'Funds coordinated through licensed financial partners — escrow, not custody.', icon: Lock, color: '#C9A24A',
      image: '/images/trade-analytics.png',
      details: ['Funding request submission', 'Credit assessment', 'Advance payment up to 80%', 'Escrow setup', 'Fund confirmation', 'Settlement coordination'],
      timeline: '4-24 hours', stats: { advanceRate: '80%', approvalTime: '4h', partners: '2' }
    },
    {
      num: '06', title: 'RELEASE', desc: 'Settlement occurs when predefined transaction conditions are satisfied.', icon: BadgeCheck, color: '#0B1F3A',
      image: '/images/trade-handshake.png',
      details: ['Release condition evaluation', 'Dual approval for high-value', 'Settlement waterfall', 'ZATCA e-invoicing', 'Payment confirmation', 'Audit trail generation'],
      timeline: '4 hours', stats: { conditions: '10', autoCheck: '100%', approval: '2-person' }
    },
  ];

  const marketData = {
    nigeria: { gdp: '$477B', population: '220M', agriculture: '24% of GDP', exports: '$46B' },
    saudi: { gdp: '$1.1T', population: '36M', foodImports: '$20B+', vision2030: 'Economic diversification' },
    corridor: { bilateralTrade: '$2.5B+', growthRate: '12% annually' },
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      {/* Fixed Language Toggler */}
      <button onClick={toggleLang} style={{
        position: 'fixed', bottom: '90px', right: '24px', zIndex: 90,
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'white', border: '1px solid #E5E9F0',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.3s ease',
      }}>
        <Languages size={16} color="#0B1F3A" />
        <span style={{ fontSize: '9px', fontWeight: 700, color: '#0B1F3A', marginTop: '2px' }}>{lang === 'en' ? 'عربي' : 'EN'}</span>
      </button>

      {/* Fixed WhatsApp Button */}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 90,
        width: '56px', height: '56px', borderRadius: '50%',
        background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
        transition: 'all 0.3s ease', textDecoration: 'none',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all 0.4s ease', padding: scrolled ? '8px 0' : '16px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ ...(scrolled ? { ...s.glassLight, borderRadius: '16px', padding: '10px 20px' } : { padding: '0' }), transition: 'all 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #0B1F3A 0%, #102A4C 100%)', border: '2px solid #C9A24A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
                </div>
                <div>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: scrolled ? '#0B1F3A' : 'white', letterSpacing: '0.08em', transition: 'color 0.3s' }}>MASAR</span>
                  <span style={{ display: 'block', fontSize: '8px', color: scrolled ? '#C9A24A' : 'rgba(201,162,74,0.8)', letterSpacing: '0.15em', transition: 'color 0.3s' }}>مسار — THE PATH</span>
                </div>
              </Link>
              
              <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '20px' }}>
                <Link href="/platform" style={{ fontSize: '13px', fontWeight: 500, color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>Platform</Link>
                <Link href="/how-it-works" style={{ fontSize: '13px', fontWeight: 600, color: scrolled ? '#C9A24A' : '#C9A24A', textDecoration: 'none', transition: 'color 0.3s' }}>How It Works</Link>
                <Link href="/for-buyers" style={{ fontSize: '13px', fontWeight: 500, color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>For Buyers</Link>
                <Link href="/for-exporters" style={{ fontSize: '13px', fontWeight: 500, color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>For Exporters</Link>
                <Link href="/trust-compliance" style={{ fontSize: '13px', fontWeight: 500, color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>Trust & Compliance</Link>
                <Link href="/about" style={{ fontSize: '13px', fontWeight: 500, color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>About</Link>
                <button onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(scrolled ? { background: '#F0F2F5', color: '#5B6778' } : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }), transition: 'all 0.3s' }}>
                  <Languages size={14} /> {lang === 'en' ? 'العربية' : 'EN'}
                </button>
                <Link href="/auth" style={{ ...s.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Start a Trade</Link>
              </div>

              <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                <Menu size={24} color={scrolled ? '#0B1F3A' : 'white'} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'white', padding: '2rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0B1F3A' }}>MASAR</span>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="#0B1F3A" /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { l: 'Platform', h: '/platform' }, { l: 'How It Works', h: '/how-it-works' },
              { l: 'For Buyers', h: '/for-buyers' }, { l: 'For Exporters', h: '/for-exporters' },
              { l: 'Trust & Compliance', h: '/trust-compliance' }, { l: 'About', h: '/about' }, { l: 'Contact', h: '/contact' },
            ].map((item) => (
              <Link key={item.h} href={item.h} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '18px', fontWeight: item.h === '/how-it-works' ? 700 : 500, color: item.h === '/how-it-works' ? '#C9A24A' : '#0B1F3A', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #E5E9F0' }}>{item.l}</Link>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
              <button onClick={toggleLang} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E5E9F0', background: '#F7F9FC', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                {lang === 'en' ? '🇸🇦 العربية' : '🇳🇬 English'}
              </button>
              <Link href="/auth" style={{ ...s.btnPrimary, flex: 2, justifyContent: 'center', padding: '12px' }}>Start a Trade</Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="/images/hero-bg.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,31,58,0.95) 0%, rgba(16,42,76,0.92) 100%)' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.04) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.04) 87.5%), linear-gradient(150deg, rgba(201,162,74,0.04) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.04) 87.5%)`, backgroundSize: '60px 100px' }} />

        <div style={{ ...s.container, padding: '8rem 1.5rem 4rem', position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)', borderRadius: '6px', marginBottom: '2rem' }}>
            <div style={{ width: '6px', height: '6px', background: '#C9A24A', borderRadius: '50%' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#C9A24A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>The MASAR Protocol</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1.5rem', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
            One Rail. Every Critical Condition.
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            MASAR transforms complex cross-border trade into a controlled, auditable, and increasingly automated workflow. From counterparty verification to settlement, every step is orchestrated by the protocol.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            {[
              { value: '8', label: 'Protocol Steps' },
              { value: '22', label: 'Transaction States' },
              { value: '100%', label: 'Audit Coverage' },
              { value: '24/7', label: 'Monitoring' }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#C9A24A', margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Intelligence */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>The Nigeria–Saudi Trade Corridor</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>Understanding the market dynamics that make this corridor strategically important.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="lg:grid-cols-3">
            {/* Nigeria */}
            <div style={{ ...s.card, padding: '2rem', borderTop: '4px solid #2D7D46' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem' }}>🇳🇬</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>Nigeria</h3>
                  <p style={{ fontSize: '12px', color: '#5B6778', margin: 0 }}>Production Powerhouse</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'GDP', value: marketData.nigeria.gdp },
                  { label: 'Population', value: marketData.nigeria.population },
                  { label: 'Agriculture', value: marketData.nigeria.agriculture },
                  { label: 'Exports', value: marketData.nigeria.exports },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#F7F9FC', borderRadius: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#5B6778' }}>{item.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3A' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Corridor */}
            <div style={{ ...s.card, padding: '2rem', borderTop: '4px solid #C9A24A', background: 'linear-gradient(180deg, rgba(201,162,74,0.03) 0%, white 100%)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B1F3A', margin: '0 0 4px 0' }}>Trade Corridor</h3>
                <p style={{ fontSize: '12px', color: '#C9A24A', margin: 0 }}>Nigeria → Saudi Arabia</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Bilateral Trade', value: marketData.corridor.bilateralTrade },
                  { label: 'Growth Rate', value: marketData.corridor.growthRate },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(201,162,74,0.05)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#5B6778' }}>{item.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#C9A24A' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Saudi Arabia */}
            <div style={{ ...s.card, padding: '2rem', borderTop: '4px solid #0B1F3A' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem' }}>🇸🇦</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>Saudi Arabia</h3>
                  <p style={{ fontSize: '12px', color: '#5B6778', margin: 0 }}>Strategic Market</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'GDP', value: marketData.saudi.gdp },
                  { label: 'Population', value: marketData.saudi.population },
                  { label: 'Food Imports', value: marketData.saudi.foodImports },
                  { label: 'Vision 2030', value: marketData.saudi.vision2030 },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#F7F9FC', borderRadius: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#5B6778' }}>{item.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3A' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Steps */}
      <section id="protocol" style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>The MASAR Protocol Flow</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>Every transaction follows a controlled sequence. Each step must satisfy its conditions before the next can begin.</p>
          </div>

          {/* Step Navigation */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '2rem' }}>
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                style={{
                  padding: '10px 16px',
                  background: activeStep === index ? '#0B1F3A' : 'white',
                  color: activeStep === index ? 'white' : '#0B1F3A',
                  border: activeStep === index ? 'none' : '1px solid #E5E9F0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <span>{step.icon && React.createElement(step.icon, { size: 14 })}</span>
                {step.title}
              </button>
            ))}
          </div>

          {/* Active Step Detail */}
          <div style={{ ...s.card, padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="lg:grid-cols-2">
              {/* Left: Image & Overview */}
              <div>
                <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <img src={steps[activeStep].image} alt={steps[activeStep].title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${steps[activeStep].color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {steps[activeStep].icon && React.createElement(steps[activeStep].icon, { size: 24, color: steps[activeStep].color })}
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#9BA3AE', margin: 0 }}>Step {steps[activeStep].num}</p>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>{steps[activeStep].title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: '15px', color: '#5B6778', lineHeight: 1.7, marginBottom: '1rem' }}>{steps[activeStep].desc}</p>
                
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {Object.entries(steps[activeStep].stats).map(([key, value]) => (
                    <div key={key} style={{ padding: '12px', background: '#F7F9FC', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ fontSize: '10px', color: '#9BA3AE', margin: '0 0 4px 0', textTransform: 'uppercase' }}>{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Details */}
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0B1F3A', margin: '0 0 12px 0' }}>Key Components</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                  {steps[activeStep].details.map((detail, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <CheckCircle size={14} color="#2D7D46" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#5B6778', lineHeight: 1.5 }}>{detail}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '14px', background: '#D1FAE5', borderRadius: '8px', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#2D7D46', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Timeline</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3A', margin: 0 }}>⏱️ {steps[activeStep].timeline}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Culture */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>Built for Two Business Cultures</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>MASAR bridges Nigerian entrepreneurial dynamism with Saudi institutional sophistication.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="lg:grid-cols-2">
            {/* Nigerian */}
            <div style={{ ...s.card, padding: '2rem', borderTop: '4px solid #2D7D46' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem' }}>🇳🇬</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>Nigerian Business Ethos</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { title: 'Entrepreneurial Resilience', desc: 'Nigerian businesses thrive through adaptability, resourcefulness and deep local market knowledge.' },
                  { title: 'Production Capacity', desc: 'From agriculture to manufacturing, Nigeria has significant capacity to supply international markets.' },
                  { title: 'Relationship-Driven Commerce', desc: 'Business in Nigeria is built on trust, personal relationships and demonstrated capability.' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '14px', background: '#F7F9FC', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3A', margin: '0 0 4px 0' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: '#5B6778', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Saudi */}
            <div style={{ ...s.card, padding: '2rem', borderTop: '4px solid #0B1F3A' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem' }}>🇸🇦</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>Saudi Business Ethos</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { title: 'Trust & Reputation', desc: 'Saudi business culture prioritizes trust, reputation and long-term relationships over quick transactions.' },
                  { title: 'Institutional Sophistication', desc: 'Gulf businesses expect professional presentation, financial strength and commercial discipline.' },
                  { title: 'Strategic Partnerships', desc: 'Saudi buyers seek reliable, long-term supply partnerships rather than one-off purchases.' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '14px', background: '#F7F9FC', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3A', margin: '0 0 4px 0' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: '#5B6778', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ ...s.section, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="/images/compliance-bg.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,31,58,0.95) 0%, rgba(16,42,76,0.92) 100%)' }} />
        </div>
        <div style={{ ...s.container, position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Ready to Experience the Protocol?</h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '2.5rem' }}>Join MASAR and trade through a controlled, auditable, and automated corridor.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            <Link href="/register" style={s.btnPrimary}>Create Account <ArrowRight size={16} /></Link>
            <Link href="/auth" style={s.btnSecondary}>Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0B1F3A', padding: '4rem 1.5rem 2rem', borderTop: '1px solid rgba(201,162,74,0.1)' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
                </div>
                <div>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: 'white', letterSpacing: '0.08em' }}>MASAR</span>
                  <span style={{ display: 'block', fontSize: '9px', color: 'rgba(201,162,74,0.6)', letterSpacing: '0.1em' }}>مسار — The Path</span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Trust. Compliance. Capital. One transaction rail.</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>Powered by <a href="https://kgmlimited.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A24A', textDecoration: 'none' }}>Kurra Greenfield Merchants Limited</a></p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>CAC RC 1539036 · BPP · SCUML · MISA Saudi</p>
            </div>
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '1rem' }}>PLATFORM</h4>
              <Link href="/platform" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>Platform</Link>
              <Link href="/how-it-works" style={{ display: 'block', fontSize: '12px', color: '#C9A24A', textDecoration: 'none', marginBottom: '6px' }}>How It Works</Link>
              <Link href="/for-buyers" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>For Buyers</Link>
              <Link href="/for-exporters" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>For Exporters</Link>
              <Link href="/for-capital-partners" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>Capital Partners</Link>
              <Link href="/trust-compliance" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>Trust & Compliance</Link>
              <Link href="/about" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>About</Link>
            </div>
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '1rem' }}>CORPORATE</h4>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>🇸🇦 Riyadh, Saudi Arabia</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>🇸🇦 Makkah, Saudi Arabia</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>🇳🇬 Lagos, Nigeria</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>🇳🇬 Kano, Nigeria</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>🇳🇬 Abuja, Nigeria</p>
            </div>
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '1rem' }}>CONTACT</h4>
              <a href="mailto:info@masar.sa" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '8px' }}><Mail size={12} /> info@masar.sa</a>
              <a href="https://wa.me/2348022220247" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '8px' }}><MessageSquare size={12} /> WhatsApp: +234 802 222 0247</a>
              <Link href="/contact" style={{ display: 'block', fontSize: '12px', color: '#C9A24A', textDecoration: 'none', marginTop: '12px' }}>Contact Form →</Link>
            </div>
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '1rem' }}>LEGAL</h4>
              <Link href="/privacy" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>Privacy Policy</Link>
              <Link href="/terms" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>Terms of Service</Link>
              <Link href="/data-protection" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>Data Protection</Link>
              <Link href="/compliance-legal" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>Compliance</Link>
            </div>
          </div>
          <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>© 2026 MASAR — مسار. A product of Kurra Greenfield Merchants Limited (CAC RC 1539036). All rights reserved.</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>Building trusted infrastructure for Saudi–Africa trade.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @media (min-width: 1024px) { 
          .lg\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
          .lg\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
          .hidden.lg\\:block { display: block !important; }
        }
        @media (max-width: 1023px) {
          .hidden.lg\\:block { display: none !important; }
        }
      `}</style>
    </div>
  );
}
