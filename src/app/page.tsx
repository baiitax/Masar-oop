'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Globe, Shield, Search, DollarSign, Users, Truck, ArrowLeft, ArrowRight,
  CheckCircle, Star, Ship, FileText, Lock, Zap, BarChart3, ChevronDown,
  Menu, X, MapPin, Mail, Building2, Award, TrendingUp, Languages, Eye,
  Scale, Leaf, Package, Clock, ArrowUpRight, ChevronRight, ExternalLink,
  Briefcase, Landmark, Network, ShieldCheck, FileCheck, Banknote, TruckIcon,
  Factory, Wheat, CircleDot, Hexagon, Diamond, Target, Layers, GitBranch,
  Route, Waypoints, Milestone, Flag, Compass, Navigation2, Anchor, Boxes,
  Receipt, BadgeCheck, FileSignature, ScrollText, ClipboardCheck, Handshake,
  Building, CircleUser, Fingerprint, KeyRound, Server, Database, Cpu, Activity
} from 'lucide-react';

// ============================================================
// PRELOADER COMPONENT
// ============================================================
function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const phaseTimer = setInterval(() => {
      setPhase(prev => (prev + 1) % 4);
    }, 600);
    return () => clearInterval(phaseTimer);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #0B1F3A 0%, #102A4C 50%, #0B1F3A 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.5s ease',
      opacity: progress >= 100 ? 0 : 1,
      pointerEvents: progress >= 100 ? 'none' : 'all',
    }}>
      {/* Islamic Pattern Background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05,
        backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%),
          linear-gradient(150deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%)`,
        backgroundSize: '60px 100px',
      }} />

      {/* Animated Logo */}
      <div style={{ position: 'relative', marginBottom: '3rem' }}>
        {/* Outer Ring Animation */}
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ animation: 'spin 3s linear infinite' }}>
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(201,162,74,0.2)" strokeWidth="1" />
          <circle cx="60" cy="60" r="54" fill="none" stroke="#C9A24A" strokeWidth="2" 
            strokeDasharray={`${progress * 3.4} 340`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.3s ease' }} />
        </svg>
        
        {/* MASAR Logo */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* Geometric M Logo */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 12L24 28L40 12" stroke="#E3C875" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            <circle cx="24" cy="36" r="2" fill="#C9A24A" />
          </svg>
          <span style={{
            fontSize: '18px', fontWeight: 800, color: '#C9A24A',
            letterSpacing: '0.15em', marginTop: '8px',
          }}>MASAR</span>
          <span style={{
            fontSize: '10px', color: 'rgba(201,162,74,0.6)',
            letterSpacing: '0.2em', marginTop: '2px',
          }}>مسار</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '200px', height: '2px', background: 'rgba(201,162,74,0.15)',
        borderRadius: '1px', overflow: 'hidden', marginBottom: '1rem',
      }}>
        <div style={{
          width: `${progress}%`, height: '100%',
          background: 'linear-gradient(90deg, #C9A24A, #E3C875)',
          borderRadius: '1px', transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Loading Text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: 'rgba(201,162,74,0.5)', letterSpacing: '0.1em' }}>
          {phase === 0 && 'Initializing corridor...'}
          {phase === 1 && 'Loading transaction rail...'}
          {phase === 2 && 'Verifying infrastructure...'}
          {phase === 3 && 'Ready'}
        </span>
      </div>

      {/* Route Animation */}
      <div style={{
        position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.4,
      }}>
        <span style={{ fontSize: '11px', color: '#C9A24A' }}>🇳🇬 NIGERIA</span>
        <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, #C9A24A, transparent, #C9A24A)', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: '-2px', width: '5px', height: '5px',
            background: '#C9A24A', borderRadius: '50%',
            animation: 'routeMove 1.5s ease-in-out infinite',
          }} />
        </div>
        <span style={{ fontSize: '11px', color: '#C9A24A' }}>🇸🇦 SAUDI ARABIA</span>
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes routeMove { 0% { left: 0; } 100% { left: 100%; } }
      `}</style>
    </div>
  );
}

// ============================================================
// MAIN LANDING PAGE
// ============================================================
export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
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

  // Auto-advance transaction steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 8);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // IP-based language detection
  useEffect(() => {
    const savedLang = localStorage.getItem('masar-lang');
    if (savedLang) {
      setLang(savedLang as 'en' | 'ar');
      return;
    }
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        if (data.country_code === 'SA' || data.country_code === 'AE' || data.country_code === 'QA' || data.country_code === 'KW' || data.country_code === 'BH' || data.country_code === 'OM') {
          setLang('ar');
        }
      })
      .catch(() => {});
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem('masar-lang', newLang);
  };

  // Style constants
  const s = {
    glass: { background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' },
    glassLight: { background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
    card: { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    cardHover: { transition: 'all 0.3s ease' },
    gold: '#C9A24A',
    goldLight: '#E3C875',
    navy: '#0B1F3A',
    navyLight: '#102A4C',
    bg: '#F7F9FC',
    text: '#122033',
    textSecondary: '#5B6778',
    green: '#2D7D46',
    meshBg: { background: `radial-gradient(at 20% 30%, rgba(201,162,74,0.08) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(45,125,70,0.06) 0px, transparent 50%), linear-gradient(135deg, #0B1F3A 0%, #102A4C 100%)` },
    pattern: { backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.04) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.04) 87.5%), linear-gradient(150deg, rgba(201,162,74,0.04) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.04) 87.5%)`, backgroundSize: '60px 100px' },
    btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: `linear-gradient(135deg, ${'#C9A24A'} 0%, ${'#E3C875'} 100%)`, color: '#0B1F3A', borderRadius: '12px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(201,162,74,0.25)' },
    btnSecondary: { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: 'rgba(255,255,255,0.08)', color: 'white', borderRadius: '12px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.3s ease', backdropFilter: 'blur(10px)' },
    btnNavy: { display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: '#0B1F3A', color: 'white', borderRadius: '12px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(11,31,58,0.25)' },
    section: { padding: '6rem 1.5rem' },
    container: { maxWidth: '1280px', margin: '0 auto' },
    sectionTitle: { fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0B1F3A', marginBottom: '1rem', lineHeight: 1.2 },
    sectionSubtitle: { fontSize: '1.05rem', color: '#5B6778', maxWidth: '640px', lineHeight: 1.7 },
    goldDivider: { width: '48px', height: '3px', background: 'linear-gradient(90deg, #C9A24A, #E3C875)', borderRadius: '2px', marginBottom: '1.5rem' },
  };

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all 0.4s ease', padding: scrolled ? '8px 0' : '16px 0',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            ...(scrolled ? { ...s.glassLight, borderRadius: '16px', padding: '10px 24px' } : { padding: '0' }),
            transition: 'all 0.4s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Logo */}
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0B1F3A 0%, #102A4C 100%)',
                  border: '2px solid #C9A24A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                    <path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="24" cy="36" r="2" fill="#C9A24A" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: scrolled ? '#0B1F3A' : 'white', letterSpacing: '0.08em', transition: 'color 0.3s' }}>MASAR</span>
                  <span style={{ display: 'block', fontSize: '9px', color: scrolled ? '#C9A24A' : 'rgba(201,162,74,0.8)', letterSpacing: '0.15em', transition: 'color 0.3s' }}>مسار — THE PATH</span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '28px' }}>
                {['Platform', 'How It Works', 'For Buyers', 'For Exporters', 'Trust & Compliance', 'About'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} style={{
                    fontSize: '13px', fontWeight: 500, letterSpacing: '0.02em',
                    color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none', transition: 'color 0.3s',
                  }}>{item}</a>
                ))}
                <button onClick={toggleLang} style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
                  borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
                  ...(scrolled ? { background: '#F0F2F5', color: '#5B6778' } : { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }),
                  transition: 'all 0.3s',
                }}>
                  <Languages size={14} />
                  {lang === 'en' ? 'العربية' : 'EN'}
                </button>
                <Link href="/auth" style={{ ...s.btnPrimary, padding: '10px 20px', fontSize: '13px' }}>
                  Start a Trade
                </Link>
              </div>

              {/* Mobile */}
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
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} color="#0B1F3A" />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Platform', 'How It Works', 'For Buyers', 'For Exporters', 'Trust & Compliance', 'About'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: '18px', fontWeight: 500, color: '#0B1F3A', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #E5E9F0' }}>
                {item}
              </a>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
              <button onClick={() => { toggleLang(); }} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E5E9F0', background: '#F7F9FC', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                {lang === 'en' ? '🇸🇦 العربية' : '🇳🇬 English'}
              </button>
              <Link href="/auth" style={{ ...s.btnPrimary, flex: 2, justifyContent: 'center', padding: '12px' }}>Start a Trade</Link>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section style={{ ...s.meshBg, position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, ...s.pattern }} />
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'rgba(201,162,74,0.08)', borderRadius: '50%', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'rgba(45,125,70,0.06)', borderRadius: '50%', filter: 'blur(80px)' }} />

        <div style={{ ...s.container, padding: '7rem 1.5rem 4rem', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '4rem', alignItems: 'center' }} className="lg-hero-grid">
            {/* Left Content */}
            <div>
              {/* Eyebrow */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)', borderRadius: '6px', marginBottom: '2rem' }}>
                <div style={{ width: '6px', height: '6px', background: '#C9A24A', borderRadius: '50%' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#C9A24A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>The Saudi–Africa Trade Corridor</span>
              </div>

              {/* Headline */}
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1.5rem', maxWidth: '600px' }}>
                The trusted path between{' '}
                <span style={{ color: '#C9A24A' }}>African supply</span> and{' '}
                <span style={{ color: '#C9A24A' }}>Saudi demand</span>.
              </h1>

              {/* Subtitle */}
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '2.5rem' }}>
                MASAR connects verified exporters and Saudi buyers through one transaction rail for compliance, inspection, settlement and trade finance.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '3rem' }}>
                <Link href="/auth" style={s.btnPrimary}>
                  Start a Trade <ArrowRight size={16} />
                </Link>
                <a href="#how-it-works" style={s.btnSecondary}>
                  Explore the MASAR Rail
                </a>
                <a href="#for-capital-partners" style={{ ...s.btnSecondary, borderColor: 'rgba(201,162,74,0.3)', color: '#C9A24A' }}>
                  Partner With MASAR
                </a>
              </div>

              {/* Trust Strip */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {['Verified Counterparties', 'Compliance', 'Independent Inspection', 'Secure Settlement', 'Trade Finance'].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={14} color="#C9A24A" />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Transaction Visual */}
            <div className="hidden lg:block">
              <div style={{ position: 'relative' }}>
                {/* Corridor Map */}
                <div style={{ ...s.glass, borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🇳🇬</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>Nigeria</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Lagos · Kano</div>
                    </div>
                    <div style={{ flex: 1, margin: '0 2rem', position: 'relative', height: '4px' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(201,162,74,0.2), rgba(201,162,74,0.6), rgba(201,162,74,0.2))', borderRadius: '2px' }} />
                      <div style={{ position: 'absolute', top: '-4px', width: '12px', height: '12px', background: '#C9A24A', borderRadius: '50%', boxShadow: '0 0 12px rgba(201,162,74,0.6)', animation: 'routePulse 3s ease-in-out infinite' }} />
                      {/* Route dots */}
                      {[20, 40, 60, 80].map((pos, i) => (
                        <div key={i} style={{ position: 'absolute', top: '-1px', left: `${pos}%`, width: '6px', height: '6px', background: 'rgba(201,162,74,0.3)', borderRadius: '50%' }} />
                      ))}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🇸🇦</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'white' }}>Saudi Arabia</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Jeddah · Riyadh</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                    One transaction rail connects both sides
                  </div>
                </div>

                {/* Transaction Card */}
                <div style={{ ...s.glass, borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#C9A24A', letterSpacing: '0.08em' }}>MASAR TRANSACTION</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>MASAR-SES-2026-000001</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
                    <div><span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Route</span><div style={{ fontSize: '13px', color: 'white', fontWeight: 600 }}>NG → SA</div></div>
                    <div><span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Commodity</span><div style={{ fontSize: '13px', color: 'white', fontWeight: 600 }}>Sesame</div></div>
                    <div><span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Quantity</span><div style={{ fontSize: '13px', color: 'white', fontWeight: 600 }}>1,000 MT</div></div>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                    {[
                      { label: 'Buyer Verified', done: true },
                      { label: 'Compliance Ready', done: true },
                      { label: 'Inspection Passed', done: true },
                      { label: 'Funds Secured', done: activeStep >= 4 },
                      { label: 'Shipment', done: false, active: activeStep === 5 },
                      { label: 'Settlement', done: false },
                    ].map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: step.done ? 'rgba(45,125,70,0.2)' : step.active ? 'rgba(201,162,74,0.2)' : 'rgba(255,255,255,0.05)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {step.done ? <CheckCircle size={12} color="#2D7D46" /> : step.active ? <div style={{ width: '6px', height: '6px', background: '#C9A24A', borderRadius: '50%' }} /> : <div style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />}
                        </div>
                        <span style={{ fontSize: '12px', color: step.done ? 'rgba(255,255,255,0.8)' : step.active ? '#C9A24A' : 'rgba(255,255,255,0.3)', fontWeight: step.active ? 600 : 400 }}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes routePulse { 0%, 100% { left: 0; } 50% { left: calc(100% - 12px); } }
          @media (min-width: 1024px) { .lg-hero-grid { grid-template-columns: 1fr 1fr !important; } }
          @media (min-width: 1024px) { .hidden.lg\\:block { display: block !important; } }
        `}</style>
      </section>

      {/* ============================================================ */}
      {/* MARKET OPPORTUNITY */}
      {/* ============================================================ */}
      <section id="platform" style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={s.goldDivider} />
            <h2 style={s.sectionTitle}>The corridor already exists.<br />The infrastructure doesn&apos;t.</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>
              Saudi Arabia is heavily dependent on imported food and agricultural products, while African exporters possess significant agricultural supply. The problem isn&apos;t supply — it&apos;s making the transaction trusted, compliant and financeable.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { value: '$20B+', label: 'Saudi food & agricultural imports annually', icon: TrendingUp },
              { value: '70–80%', label: 'Approximate food import reliance', icon: Wheat },
              { value: '$11B+', label: 'Estimated Saudi imports from Africa', icon: Globe },
              { value: '$817M', label: 'Nigeria sesame exports (2024)', icon: Leaf },
            ].map((stat, idx) => (
              <div key={idx} style={{ ...s.card, padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <stat.icon size={22} color="#C9A24A" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '0.5rem' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: '#5B6778' }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: '#9BA3AE', textAlign: 'center', marginTop: '1.5rem' }}>
            Market figures are based on sources and assumptions documented in the MASAR Business Plan and may be revised as source data changes.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PROBLEM SECTION */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>Cross-border trade doesn&apos;t fail because supply is missing.</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>It fails because trust, compliance and liquidity are fragmented across too many parties.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { title: 'TRUST', icon: Shield, color: '#C9A24A', items: ['Unknown counterparties', 'Weak transaction history', 'Limited visibility into supplier performance'] },
              { title: 'COMPLIANCE', icon: FileText, color: '#3B82F6', items: ['Multiple documents', 'Different authorities', 'Time-sensitive certifications', 'Saudi import requirements'] },
              { title: 'QUALITY', icon: Search, color: '#8B5CF6', items: ['Inspection across fragmented providers', 'Results disconnected from settlement', 'No standardized evidence chain'] },
              { title: 'LIQUIDITY', icon: Banknote, color: '#2D7D46', items: ['Exporters need working capital', 'Buyers need confidence', 'Banks need better transaction visibility'] },
            ].map((card, idx) => (
              <div key={idx} style={{ ...s.card, padding: '2rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${card.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <card.icon size={24} color={card.color} />
                </div>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: card.color, letterSpacing: '0.1em', marginBottom: '1rem' }}>{card.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {card.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ width: '4px', height: '4px', background: '#CBD5E1', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#5B6778', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* THE MASAR ANSWER */}
      {/* ============================================================ */}
      <section style={{ ...s.section, ...s.meshBg, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, ...s.pattern }} />
        <div style={{ ...s.container, position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={{ ...s.sectionTitle, color: 'white' }}>MASAR turns a fragmented trade into one controlled transaction.</h2>
          </div>
          {/* Transaction Flow */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', maxWidth: '900px', margin: '0 auto' }}>
            {['BUYER', 'VERIFICATION', 'CONTRACT', 'COMPLIANCE', 'INSPECTION', 'FINANCE', 'SECURE SETTLEMENT', 'SHIPMENT', 'PORT VERIFICATION', 'RELEASE'].map((step, idx) => (
              <React.Fragment key={idx}>
                <div style={{
                  padding: '10px 16px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em',
                  background: idx <= activeStep ? 'rgba(201,162,74,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${idx <= activeStep ? 'rgba(201,162,74,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  color: idx <= activeStep ? '#C9A24A' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.5s ease',
                }}>
                  {step}
                </div>
                {idx < 9 && <div style={{ display: 'flex', alignItems: 'center', color: idx < activeStep ? '#C9A24A' : 'rgba(255,255,255,0.1)', transition: 'color 0.5s' }}>
                  <ChevronRight size={14} />
                </div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW MASAR WORKS */}
      {/* ============================================================ */}
      <section id="how-it-works" style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>One rail. Every critical condition.</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>Six steps from counterparty verification to settlement.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { num: '01', title: 'VERIFY', desc: 'Buyer and exporter KYB — identity, ownership, sanctions, trade history.', icon: ShieldCheck, color: '#C9A24A' },
              { num: '02', title: 'CONTRACT', desc: 'Digital transaction terms — commodity, quantity, quality, Incoterms, release conditions.', icon: FileSignature, color: '#3B82F6' },
              { num: '03', title: 'COMPLY', desc: 'Build the transaction\'s compliance pack — export docs, SFDA, phytosanitary, lab COA.', icon: ClipboardCheck, color: '#8B5CF6' },
              { num: '04', title: 'INSPECT', desc: 'Independent inspection and laboratory evidence against contract specifications.', icon: Search, color: '#2D7D46' },
              { num: '05', title: 'SECURE', desc: 'Funds coordinated through licensed financial partners — escrow, not custody.', icon: Lock, color: '#C9A24A' },
              { num: '06', title: 'RELEASE', desc: 'Settlement occurs when predefined transaction conditions are satisfied.', icon: BadgeCheck, color: '#0B1F3A' },
            ].map((step, idx) => (
              <div key={idx} style={{ ...s.card, padding: '2rem', display: 'flex', gap: '1.5rem' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#E5E9F0', marginBottom: '0.5rem' }}>{step.num}</div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${step.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <step.icon size={22} color={step.color} />
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0B1F3A', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: '#5B6778', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUST IS ENGINEERED */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={s.goldDivider} />
              <h2 style={s.sectionTitle}>Trust isn&apos;t a promise.<br />It&apos;s a process.</h2>
              <p style={{ ...s.sectionSubtitle, marginBottom: '2rem' }}>
                MASAR connects transaction evidence to transaction conditions, creating a verifiable chain from counterparty onboarding to settlement.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Document verification', 'Inspection evidence', 'Release conditions', 'Settlement triggers', 'Audit trail'].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'white', borderRadius: '10px', border: '1px solid #E5E9F0' }}>
                    <CheckCircle size={16} color="#2D7D46" />
                    <span style={{ fontSize: '14px', color: '#122033', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {/* Trust Chain Visual */}
              <div style={{ ...s.card, padding: '2rem' }}>
                {[
                  { icon: FileText, label: 'DOCUMENT', color: '#3B82F6' },
                  { icon: ShieldCheck, label: 'VERIFICATION', color: '#8B5CF6' },
                  { icon: Search, label: 'INSPECTION', color: '#C9A24A' },
                  { icon: Eye, label: 'EVIDENCE', color: '#2D7D46' },
                  { icon: Lock, label: 'RELEASE CONDITION', color: '#0B1F3A' },
                  { icon: Banknote, label: 'SETTLEMENT', color: '#C9A24A' },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <item.icon size={20} color={item.color} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3A', letterSpacing: '0.05em' }}>{item.label}</span>
                    </div>
                    {idx < 5 && <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: '1px', height: '20px', background: '#E5E9F0' }} />
                    </div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* COMPLIANCE SECTION */}
      {/* ============================================================ */}
      <section id="trust-&-compliance" style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>Compliance before the cargo moves.</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>MASAR transforms fragmented compliance requirements into a managed transaction workflow.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {[
              'Certificate of Origin', 'Phytosanitary Certificate', 'Certificate of Analysis',
              'SFDA Requirements', 'Halal Documentation', 'Arabic Labelling',
              'Commercial Invoice', 'ZATCA E-Invoicing', 'Packing List',
              'Export License', 'Import Documentation', 'Inspection Certificate',
            ].map((doc, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: '#F7F9FC', borderRadius: '10px', border: '1px solid #E5E9F0' }}>
                <FileCheck size={16} color="#2D7D46" />
                <span style={{ fontSize: '13px', color: '#122033', fontWeight: 500 }}>{doc}</span>
              </div>
            ))}
          </div>

          {/* Clearance Score */}
          <div style={{ marginTop: '3rem', ...s.card, padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '160px', height: '160px', borderRadius: '50%', margin: '0 auto 1rem',
                background: 'conic-gradient(#2D7D46 0deg, #2D7D46 338deg, #E5E9F0 338deg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0B1F3A' }}>94</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#2D7D46', letterSpacing: '0.1em' }}>CLEARANCE READY</span>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: '#9BA3AE' }}>MASAR Clearance Readiness</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '1rem' }}>Clearance Readiness Score</h3>
              <p style={{ fontSize: '14px', color: '#5B6778', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Every transaction receives a proprietary clearance score based on documentation completeness, counterparty verification, inspection readiness, and compliance status.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Counterparty verified', 'Required documents complete', 'Inspection scheduled', 'Laboratory results verified', 'Saudi import requirements satisfied'].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={14} color="#2D7D46" />
                    <span style={{ fontSize: '13px', color: '#122033' }}>{item}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '11px', color: '#9BA3AE', marginTop: '1rem' }}>Powered by MASAR operations — evolving into automated protocol intelligence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOR SAUDI BUYERS */}
      {/* ============================================================ */}
      <section id="for-buyers" style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(45,125,70,0.08)', borderRadius: '6px', marginBottom: '1.5rem' }}>
                <span>🇸🇦</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#2D7D46', letterSpacing: '0.05em' }}>FOR SAUDI BUYERS</span>
              </div>
              <h2 style={s.sectionTitle}>Source with confidence.</h2>
              <p style={{ ...s.sectionSubtitle, marginBottom: '2rem' }}>
                Saudi buyers gain a structured transaction environment where suppliers, documentation, inspection and transaction status are coordinated through one operating layer.
              </p>
              <Link href="/auth" style={{ ...s.btnNavy, display: 'inline-flex' }}>
                Become a MASAR Buyer <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'grid', gap: '14px' }}>
              {[
                { icon: ShieldCheck, title: 'Verified suppliers', desc: 'Know who you are buying from.' },
                { icon: Search, title: 'Quality evidence', desc: 'Independent inspection and laboratory results.' },
                { icon: Eye, title: 'Compliance visibility', desc: 'Know what is complete before shipment.' },
                { icon: Activity, title: 'Transaction visibility', desc: 'Track the entire deal in real time.' },
                { icon: Banknote, title: 'Capital access', desc: 'Enable eligible supplier financing through capital partners.' },
              ].map((item, idx) => (
                <div key={idx} style={{ ...s.card, padding: '1.25rem', display: 'flex', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={20} color="#C9A24A" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3A', marginBottom: '2px' }}>{item.title}</h4>
                    <p style={{ fontSize: '13px', color: '#5B6778' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOR AFRICAN EXPORTERS */}
      {/* ============================================================ */}
      <section id="for-exporters" style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div style={{ order: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(45,125,70,0.08)', borderRadius: '6px', marginBottom: '1.5rem' }}>
                <span>🇳🇬</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#2D7D46', letterSpacing: '0.05em' }}>FOR AFRICAN EXPORTERS</span>
              </div>
              <h2 style={s.sectionTitle}>Turn verified supply into trusted market access.</h2>
              <p style={{ ...s.sectionSubtitle, marginBottom: '2rem' }}>
                MASAR helps qualified African exporters reach institutional Saudi buyers while reducing transaction friction.
              </p>
              <Link href="/auth" style={{ ...s.btnPrimary, display: 'inline-flex' }}>
                Join the Exporter Network <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ order: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { icon: Users, label: 'Buyer access' },
                { icon: ShieldCheck, label: 'KYB verification' },
                { icon: FileText, label: 'Compliance support' },
                { icon: Search, label: 'Inspection coordination' },
                { icon: ScrollText, label: 'Documentation' },
                { icon: Banknote, label: 'Financing pathway' },
                { icon: Handshake, label: 'Settlement coordination' },
                { icon: Award, label: 'Performance history' },
              ].map((item, idx) => (
                <div key={idx} style={{ ...s.card, padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                    <item.icon size={20} color="#C9A24A" />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3A' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOR CAPITAL PARTNERS */}
      {/* ============================================================ */}
      <section id="for-capital-partners" style={{ ...s.section, ...s.meshBg, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, ...s.pattern }} />
        <div style={{ ...s.container, position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={{ ...s.sectionTitle, color: 'white' }}>Finance transactions with better visibility.</h2>
            <p style={{ ...s.sectionSubtitle, color: 'rgba(255,255,255,0.6)', margin: '0 auto' }}>
              For banks, DFIs, trade-finance institutions and structured-finance providers.
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginBottom: '2rem' }}>
            {['Verified Buyer', 'Verified Exporter', 'Verified Commodity', 'Independent Inspection', 'Transaction Evidence'].map((item, idx) => (
              <React.Fragment key={idx}>
                <div style={{ padding: '10px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
                  {item}
                </div>
                {idx < 4 && <span style={{ color: 'rgba(201,162,74,0.5)', display: 'flex', alignItems: 'center' }}>+</span>}
              </React.Fragment>
            ))}
            <span style={{ color: '#C9A24A', fontSize: '20px', display: 'flex', alignItems: 'center', margin: '0 8px' }}>=</span>
            <div style={{ padding: '10px 20px', borderRadius: '8px', background: 'rgba(201,162,74,0.15)', border: '1px solid rgba(201,162,74,0.3)', fontSize: '13px', fontWeight: 700, color: '#C9A24A' }}>
              Financeable Trade
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href="#contact" style={{ ...s.btnPrimary, display: 'inline-flex' }}>
              Explore Capital Partnerships <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ASSET-LIGHT MODEL */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>We don&apos;t own the cargo.<br />We own the coordination.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { title: 'MASAR OWNS', color: '#C9A24A', items: ['Software', 'Data', 'Transaction protocol', 'Relationships', 'Compliance intelligence', 'Audit ledger'] },
              { title: 'MASAR ORCHESTRATES', color: '#3B82F6', items: ['Inspection', 'Compliance', 'Trade finance', 'Settlement', 'E-invoicing', 'Customs coordination'] },
              { title: 'PARTNERS OPERATE', color: '#2D7D46', items: ['Ships', 'Trucks', 'Warehouses', 'Escrow', 'Laboratories', 'Capital', 'Insurance'] },
            ].map((col, idx) => (
              <div key={idx} style={{ ...s.card, padding: '2rem', borderTop: `3px solid ${col.color}` }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: col.color, letterSpacing: '0.1em', marginBottom: '1.5rem' }}>{col.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: col.color, opacity: 0.5 }} />
                      <span style={{ fontSize: '14px', color: '#122033' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* WHY MASAR */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>Why MASAR</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#5B6778', borderBottom: '2px solid #E5E9F0' }}></th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#5B6778', borderBottom: '2px solid #E5E9F0' }}>Traditional Broker</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#5B6778', borderBottom: '2px solid #E5E9F0' }}>Bank / LC</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#C9A24A', borderBottom: '2px solid #C9A24A', background: 'rgba(201,162,74,0.04)' }}>MASAR</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Counterparty verification', broker: 'Limited', bank: 'Partial', masar: 'Native' },
                  { feature: 'Compliance workflow', broker: 'Fragmented', bank: 'Limited', masar: 'Native' },
                  { feature: 'Independent inspection', broker: 'Separate', bank: 'Separate', masar: 'Integrated' },
                  { feature: 'Settlement coordination', broker: 'Basic', bank: 'Bank-led', masar: 'Protocol-led' },
                  { feature: 'Trade finance', broker: 'Separate', bank: 'Traditional', masar: 'Embedded pathway' },
                  { feature: 'Transaction data', broker: 'Fragmented', bank: 'Limited', masar: 'Proprietary' },
                  { feature: 'Network effect', broker: 'Low', bank: 'Institutional', masar: 'Corridor network' },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#122033', fontWeight: 500, borderBottom: '1px solid #E5E9F0' }}>{row.feature}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: '#9BA3AE', borderBottom: '1px solid #E5E9F0' }}>{row.broker}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: '#9BA3AE', borderBottom: '1px solid #E5E9F0' }}>{row.bank}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#0B1F3A', borderBottom: '1px solid #E5E9F0', background: 'rgba(201,162,74,0.04)' }}>{row.masar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ROADMAP */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>From first trade to corridor infrastructure.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { phase: 'V0 — 2026', title: 'Concierge Pilot', desc: 'Real transactions. Real inspection. Real settlement. Target: 10 completed transactions.', active: true },
              { phase: 'V1 — 2027', title: 'Protocol Automation', desc: 'KYB automation, compliance engine, inspection integration, e-invoicing.' },
              { phase: '2027+', title: 'Embedded Finance', desc: 'Up to 80% advance product through capital partners.' },
              { phase: '2028+', title: 'Network Density', desc: 'More buyers. More exporter syndicates. More commodity lanes.' },
              { phase: '2029+', title: 'Corridor OS', desc: 'Multiple African origins. Multiple GCC destinations.' },
              { phase: '2030', title: 'Financial Layer', desc: 'FX, structured finance and institutional licensing.' },
            ].map((item, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem', borderTop: item.active ? '3px solid #C9A24A' : '3px solid #E5E9F0' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: item.active ? '#C9A24A' : '#9BA3AE', letterSpacing: '0.08em' }}>{item.phase}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0B1F3A', margin: '0.5rem 0' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#5B6778', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL CTA */}
      {/* ============================================================ */}
      <section id="about" style={{ ...s.section, ...s.meshBg, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, ...s.pattern }} />
        <div style={{ ...s.container, position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Build the next trade corridor with MASAR.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Whether you are a Saudi buyer, African exporter, financial institution or strategic infrastructure partner, MASAR is building the transaction rail that makes the corridor work.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            <Link href="/auth" style={s.btnPrimary}>Start a Trade <ArrowRight size={16} /></Link>
            <a href="#for-capital-partners" style={s.btnSecondary}>Become a Partner</a>
            <a href="mailto:info@masar.sa" style={{ ...s.btnSecondary, borderColor: 'rgba(201,162,74,0.3)', color: '#C9A24A' }}>Talk to MASAR</a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer style={{ background: '#0B1F3A', padding: '4rem 1.5rem 2rem', borderTop: '1px solid rgba(201,162,74,0.1)' }}>
        <div style={{ ...s.container }}>
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
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Trust. Compliance. Capital. One transaction rail.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '1rem' }}>PLATFORM</h4>
              {['How It Works', 'Buyers', 'Exporters', 'Capital Partners', 'Trust & Compliance', 'About'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '8px' }}>{item}</a>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '1rem' }}>CORPORATE</h4>
              {['Saudi Arabia', 'Nigeria'].map((item) => (
                <p key={item} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>{item}</p>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '1rem' }}>LEGAL</h4>
              {['Privacy', 'Terms', 'Compliance', 'Data Protection'].map((item) => (
                <a key={item} href="#" style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '8px' }}>{item}</a>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: '1rem' }}>CONTACT</h4>
              {['Institutional Partnerships', 'Trade Desk', 'Investor Relations'].map((item) => (
                <a key={item} href="mailto:info@masar.sa" style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '8px' }}>{item}</a>
              ))}
              <a href="mailto:info@masar.sa" style={{ display: 'block', fontSize: '13px', color: '#C9A24A', textDecoration: 'none', marginTop: '12px' }}>info@masar.sa</a>
            </div>
          </div>
          <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>© 2026 MASAR — مسار. All rights reserved.</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>Building trusted infrastructure for Saudi–Africa trade.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
