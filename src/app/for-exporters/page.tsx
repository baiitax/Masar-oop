'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, Shield, Search, ArrowRight, CheckCircle, Star, Ship, Lock,
  Menu, X, Languages, TrendingUp, Leaf, ShieldCheck, FileCheck, BadgeCheck, 
  FileSignature, ClipboardCheck, Users, Award, Scale, MessageSquare, Mail,
  BarChart3, Quote, ChevronRight, Play, Pause, Package, Truck, DollarSign,
  Eye, Clock, Target, Fingerprint, KeyRound, Activity, Building2,
  AlertTriangle, FileText, MapPin, Calendar, Zap, RefreshCw, Layers, Handshake
} from 'lucide-react';

export default function ForExportersPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
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

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem('masar-lang', newLang);
  };

  const whatsappUrl = `https://wa.me/2348022220247?text=${encodeURIComponent('Hello MASAR, I am a Nigerian exporter interested in accessing Saudi markets through your platform.')}`;

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

  const exporterJourney = [
    {
      num: '01', title: 'REGISTER', icon: Building2, color: '#3B82F6',
      desc: 'Build your verified exporter profile with KYB documentation and business credentials.',
      details: ['Complete KYB verification', 'Upload business registration', 'Provide ownership details', 'List certifications and capabilities', 'Define commodity expertise'],
      outcome: 'Verified exporter profile visible to institutional buyers'
    },
    {
      num: '02', title: 'LIST', icon: Package, color: '#8B5CF6',
      desc: 'Showcase products, production capacity, quality certifications and available quantities.',
      details: ['Add product specifications', 'Define quality grades', 'Set available quantities', 'Upload product certifications', 'Set pricing and terms'],
      outcome: 'Products discoverable by qualified Saudi and GCC buyers'
    },
    {
      num: '03', title: 'RECEIVE', icon: Target, color: '#2D7D46',
      desc: 'Get matched with qualified Saudi and GCC buyers seeking your products.',
      details: ['Receive buyer inquiries', 'Review buyer verification', 'Evaluate commercial terms', 'Assess order requirements', 'Respond to RFQs'],
      outcome: 'Structured requests from verified institutional buyers'
    },
    {
      num: '04', title: 'QUOTE', icon: FileSignature, color: '#C9A24A',
      desc: 'Submit competitive quotations with clear terms, specifications and delivery conditions.',
      details: ['Define pricing and terms', 'Specify quality guarantees', 'Set delivery timelines', 'Include inspection requirements', 'Clarify payment terms'],
      outcome: 'Professional quotation submitted to buyer'
    },
    {
      num: '05', title: 'EXECUTE', icon: ClipboardCheck, color: '#0B1F3A',
      desc: 'Manage compliance, inspection, documentation and logistics for the export transaction.',
      details: ['Generate compliance documents', 'Coordinate inspection', 'Prepare shipping documentation', 'Manage quality evidence', 'Track logistics'],
      outcome: 'Goods verified, documented and ready for shipment'
    },
    {
      num: '06', title: 'SETTLE', icon: DollarSign, color: '#14B8A6',
      desc: 'Receive payment through secure settlement workflow with complete audit trail.',
      details: ['Submit invoice', 'Track payment status', 'Receive settlement confirmation', 'Access financing if needed', 'Complete reconciliation'],
      outcome: 'Payment received with complete documentation'
    },
  ];

  const painPoints = [
    { problem: 'How do I reach institutional Saudi buyers?', solution: 'MASAR connects you directly with verified Saudi and GCC buyers who are actively seeking African commodities through structured procurement processes.' },
    { problem: 'How do I prove my business is legitimate?', solution: 'Your KYB verification, certifications, and trade history are documented and visible to buyers, building trust before any transaction begins.' },
    { problem: 'How do I handle complex export documentation?', solution: 'MASAR automatically generates lane-specific compliance packs with all required documents for Nigeria → Saudi Arabia trade.' },
    { problem: 'How do I get paid securely?', solution: 'Funds are held in escrow through licensed financial partners and released only when predefined conditions are satisfied.' },
    { problem: 'How do I access trade finance?', solution: 'Eligible transactions can be structured for consideration by participating financial institutions for advance payment.' },
    { problem: 'How do I build long-term buyer relationships?', solution: 'Transaction history, performance metrics, and quality records build your reputation for repeat business.' },
  ];

  const exporterCapabilities = [
    { icon: Building2, title: 'Verified Profile', desc: 'Build a comprehensive business profile with KYB verification, certifications, production capacity, and trade history.' },
    { icon: Package, title: 'Product Showcase', desc: 'List products with specifications, quality grades, available quantities, and certifications for buyer discovery.' },
    { icon: Target, title: 'Buyer Matching', desc: 'Get matched with qualified Saudi and GCC buyers seeking your specific products and capabilities.' },
    { icon: FileSignature, title: 'Quotation Management', desc: 'Submit and manage quotations with clear commercial terms, delivery conditions, and quality guarantees.' },
    { icon: ClipboardCheck, title: 'Compliance Automation', desc: 'Automated compliance pack generation based on lane, commodity, and destination country requirements.' },
    { icon: ShieldCheck, title: 'Inspection Coordination', desc: 'Coordinate independent inspection and laboratory testing through approved inspection partners.' },
    { icon: DollarSign, title: 'Finance Access', desc: 'Access trade finance opportunities from participating financial partners for advance payment.' },
    { icon: Truck, title: 'Logistics Support', desc: 'Shipment tracking, documentation coordination, and port verification through integrated logistics.' },
    { icon: BarChart3, title: 'Performance Analytics', desc: 'Track export performance, buyer relationships, quality metrics, and transaction history.' },
    { icon: Handshake, title: 'Relationship Building', desc: 'Build long-term commercial relationships with institutional buyers through verified track record.' },
  ];

  const exporterTypes = [
    { type: 'Agricultural Producers', desc: 'Sesame, cashew, soybean, shea and other agricultural commodities for Saudi food industry.', icon: Leaf },
    { type: 'Food Processors', desc: 'Value-added food products meeting Saudi quality standards and Halal requirements.', icon: Package },
    { type: 'Manufacturing Companies', desc: 'Industrial products and manufactured goods for GCC markets.', icon: Building2 },
    { type: 'Commodity Traders', desc: 'Bulk commodity trading with institutional buyers and structured settlement.', icon: Globe },
  ];

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      {/* Fixed Buttons */}
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
                <Link href="/platform" style={{ fontSize: '13px', fontWeight: 500, color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Platform</Link>
                <Link href="/how-it-works" style={{ fontSize: '13px', fontWeight: 500, color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>How It Works</Link>
                <Link href="/for-buyers" style={{ fontSize: '13px', fontWeight: 500, color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>For Buyers</Link>
                <Link href="/for-exporters" style={{ fontSize: '13px', fontWeight: 600, color: '#C9A24A', textDecoration: 'none' }}>For Exporters</Link>
                <Link href="/trust-compliance" style={{ fontSize: '13px', fontWeight: 500, color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Trust</Link>
                <Link href="/about" style={{ fontSize: '13px', fontWeight: 500, color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>About</Link>
                <button onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', ...(scrolled ? { background: '#F0F2F5', color: '#5B6778' } : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }) }}>
                  <Languages size={14} /> {lang === 'en' ? 'العربية' : 'EN'}
                </button>
                <Link href="/auth" style={{ ...s.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>Sign In</Link>
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
            {['Platform', 'How It Works', 'For Buyers', 'For Exporters', 'Trust & Compliance', 'About', 'Contact'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase().replace(/\s+/g, '-').replace('&-', '')}`} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '18px', fontWeight: item === 'For Exporters' ? 700 : 500, color: item === 'For Exporters' ? '#C9A24A' : '#0B1F3A', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #E5E9F0' }}>{item}</Link>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
              <Link href="/auth" style={{ ...s.btnPrimary, flex: 1, justifyContent: 'center', padding: '12px' }}>Sign In</Link>
              <Link href="/register" style={{ flex: 1, padding: '12px', background: '#0B1F3A', color: 'white', borderRadius: '12px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>Register</Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="/images/exporter-nigerian.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,31,58,0.95) 0%, rgba(16,42,76,0.90) 100%)' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: `radial-gradient(rgba(45,125,70,0.3) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

        <div style={{ ...s.container, padding: '8rem 1.5rem 4rem', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(45,125,70,0.1)', border: '1px solid rgba(45,125,70,0.2)', borderRadius: '6px', marginBottom: '2rem' }}>
                <span>🇳🇬</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#2D7D46', letterSpacing: '0.12em', textTransform: 'uppercase' }}>For African Exporters</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1.5rem', maxWidth: '600px' }}>
                Turn verified supply into <span style={{ color: '#C9A24A' }}>trusted market access.</span>
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '2.5rem' }}>
                MASAR helps qualified African exporters reach institutional Saudi buyers while reducing transaction friction. Build your verified profile, access markets, and scale your international trade with structured workflows.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '2rem' }}>
                <Link href="/register" style={s.btnPrimary}>Become a MASAR Exporter <ArrowRight size={16} /></Link>
                <Link href="/auth" style={s.btnSecondary}>Sign In</Link>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {['Verified Profile', 'Market Access', 'Finance Opportunities', 'Secure Settlement', 'Compliance Support'].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={14} color="#C9A24A" />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <img src="/images/exporter-nigerian.png" alt="Nigerian Exporter" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>From Local Production to Global Markets.</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>Nigerian exporters face unique challenges accessing international markets. MASAR transforms these challenges into structured workflows.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {painPoints.map((item, idx) => (
              <div key={idx} style={{ ...s.card, padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3A', margin: 0 }}>{item.problem}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', paddingLeft: '32px' }}>
                  <CheckCircle size={16} color="#2D7D46" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '13px', color: '#5B6778', margin: 0, lineHeight: 1.6 }}>{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exporter Journey - Interactive */}
      <section style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>The Exporter Journey</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>From registration to settlement, build your international trade presence step by step.</p>
          </div>

          {/* Journey Steps */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
            {exporterJourney.map((step, index) => (
              <button key={index} onClick={() => setActiveJourneyStep(index)}
                style={{
                  padding: '10px 16px',
                  background: activeJourneyStep === index ? '#0B1F3A' : 'white',
                  color: activeJourneyStep === index ? 'white' : '#0B1F3A',
                  border: activeJourneyStep === index ? 'none' : '1px solid #E5E9F0',
                  borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                <step.icon size={14} /> {step.title}
              </button>
            ))}
          </div>

          {/* Active Step Detail */}
          <div style={{ ...s.card, padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="lg:grid-cols-2">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `${exporterJourney[activeJourneyStep].color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {React.createElement(exporterJourney[activeJourneyStep].icon, { size: 28, color: exporterJourney[activeJourneyStep].color })}
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#9BA3AE', margin: 0 }}>Step {exporterJourney[activeJourneyStep].num}</p>
                    <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>{exporterJourney[activeJourneyStep].title}</h3>
                  </div>
                </div>
                <p style={{ fontSize: '16px', color: '#5B6778', lineHeight: 1.7, marginBottom: '20px' }}>{exporterJourney[activeJourneyStep].desc}</p>
                <div style={{ padding: '16px', background: '#D1FAE5', borderRadius: '8px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#2D7D46', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Outcome</p>
                  <p style={{ fontSize: '14px', color: '#0B1F3A', margin: 0 }}>{exporterJourney[activeJourneyStep].outcome}</p>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0B1F3A', margin: '0 0 12px 0' }}>What Happens</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {exporterJourney[activeJourneyStep].details.map((detail, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle size={16} color="#2D7D46" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#5B6778', lineHeight: 1.5 }}>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>What Exporters Can Do</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>Everything you need to export, verify, ship and settle in one workspace.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {exporterCapabilities.map((cap, idx) => (
              <div key={idx} style={{ ...s.card, padding: '24px', display: 'flex', gap: '14px' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <cap.icon size={24} color="#C9A24A" />
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>{cap.title}</h3>
                  <p style={{ fontSize: '13px', color: '#5B6778', margin: 0, lineHeight: 1.6 }}>{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Use MASAR */}
      <section style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>Who Should Use MASAR?</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>MASAR is designed for African producers and exporters seeking structured access to international markets.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {exporterTypes.map((type, idx) => (
              <div key={idx} style={{ ...s.card, padding: '28px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(45,125,70,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <type.icon size={28} color="#2D7D46" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B1F3A', marginBottom: '8px' }}>{type.type}</h3>
                <p style={{ fontSize: '13px', color: '#5B6778', margin: 0, lineHeight: 1.6 }}>{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nigeria Market Intelligence */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div>
              <div style={s.goldDivider} />
              <h2 style={s.sectionTitle}>Nigeria: A Production Powerhouse</h2>
              <p style={{ ...s.sectionSubtitle, marginBottom: '1.5rem' }}>
                Nigeria combines a large domestic market, agricultural depth, natural resources, entrepreneurial capacity and a growing technology ecosystem. The opportunity is to connect Nigerian productive capacity with structured international demand.
              </p>
              <p style={{ ...s.sectionSubtitle, marginBottom: '1.5rem' }}>
                MASAR enables Nigerian exporters to reach institutional Saudi buyers through verified profiles, structured transactions, and secure settlement.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'GDP', value: '$477B' },
                  { label: 'Agriculture', value: '24% of GDP' },
                  { label: 'Exports', value: '$46B annually' },
                  { label: 'Key Products', value: 'Sesame, Cashew, Soy' },
                  { label: 'Growth Rate', value: '12% corridor growth' },
                  { label: 'Market Access', value: 'Saudi & GCC' },
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '12px', background: '#F7F9FC', borderRadius: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#9BA3AE' }}>{item.label}</span>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3A', margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
              <img src="/images/nigeria-port.png" alt="Nigeria Export" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ ...s.section, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="/images/compliance-bg.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,31,58,0.95) 0%, rgba(16,42,76,0.92) 100%)' }} />
        </div>
        <div style={{ ...s.container, position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Ready to Export Internationally?</h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '2.5rem' }}>Join MASAR and access Saudi and GCC markets through a structured, verified export platform.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            <Link href="/register" style={s.btnPrimary}>Join the Exporter Network <ArrowRight size={16} /></Link>
            <Link href="/contact" style={s.btnSecondary}>Explore Export Opportunities</Link>
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
              {['Platform', 'How It Works', 'For Buyers', 'For Exporters', 'Capital Partners', 'Trust & Compliance', 'About'].map((link) => (
                <Link key={link} href={`/${link.toLowerCase().replace(/\s+/g, '-').replace('&-', '')}`} style={{ display: 'block', fontSize: '12px', color: link === 'For Exporters' ? '#C9A24A' : 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>{link}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '1rem' }}>CORPORATE</h4>
              {['🇸🇦 Riyadh, Saudi Arabia', '🇸🇦 Makkah, Saudi Arabia', '🇳🇬 Lagos, Nigeria', '🇳🇬 Kano, Nigeria', '🇳🇬 Abuja, Nigeria'].map((office) => (
                <p key={office} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>{office}</p>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '1rem' }}>CONTACT</h4>
              <a href="mailto:info@masar.sa" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '8px' }}><Mail size={12} /> info@masar.sa</a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '8px' }}><MessageSquare size={12} /> WhatsApp: +234 802 222 0247</a>
              <Link href="/contact" style={{ display: 'block', fontSize: '12px', color: '#C9A24A', textDecoration: 'none', marginTop: '12px' }}>Contact Form →</Link>
            </div>
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '1rem' }}>LEGAL</h4>
              {['Privacy Policy', 'Terms of Service', 'Data Protection', 'Compliance'].map((link) => (
                <Link key={link} href={`/${link.toLowerCase().replace(/\s+/g, '-')}`} style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>{link}</Link>
              ))}
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
          .hidden.lg\\:block { display: block !important; }
        }
        @media (max-width: 1023px) {
          .hidden.lg\\:block { display: none !important; }
        }
      `}</style>
    </div>
  );
}
