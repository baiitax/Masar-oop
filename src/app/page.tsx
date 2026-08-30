'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Globe, Shield, Search, DollarSign, Users, Truck, ArrowLeft, ArrowRight,
  CheckCircle, Star, Ship, FileText, Lock, ChevronDown,
  Menu, X, MapPin, Mail, Building2, Award, TrendingUp, Languages, Eye,
  Scale, Leaf, Package, Clock, ChevronRight,
  Landmark, ShieldCheck, FileCheck, Banknote,
  Wheat, Target, ClipboardCheck, BadgeCheck, FileSignature, ScrollText, Handshake,
  Fingerprint, KeyRound, Activity, Phone, MessageSquare, Play, Pause,
  Volume2, VolumeX, BarChart3, ArrowUpRight, Quote
} from 'lucide-react';

// ============================================================
// PRELOADER
// ============================================================
function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(timer); setTimeout(onComplete, 400); return 100; }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const phaseTimer = setInterval(() => setPhase(prev => (prev + 1) % 4), 600);
    return () => clearInterval(phaseTimer);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #0B1F3A 0%, #102A4C 50%, #0B1F3A 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.5s ease', opacity: progress >= 100 ? 0 : 1, pointerEvents: progress >= 100 ? 'none' : 'all',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%), linear-gradient(150deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%)`, backgroundSize: '60px 100px' }} />
      <div style={{ position: 'relative', marginBottom: '3rem' }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ animation: 'spin 3s linear infinite' }}>
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(201,162,74,0.2)" strokeWidth="1" />
          <circle cx="60" cy="60" r="54" fill="none" stroke="#C9A24A" strokeWidth="2" strokeDasharray={`${progress * 3.4} 340`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.3s ease' }} />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 12L24 28L40 12" stroke="#E3C875" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            <circle cx="24" cy="36" r="2" fill="#C9A24A" />
          </svg>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#C9A24A', letterSpacing: '0.15em', marginTop: '8px' }}>MASAR</span>
          <span style={{ fontSize: '10px', color: 'rgba(201,162,74,0.6)', letterSpacing: '0.2em', marginTop: '2px' }}>مسار</span>
        </div>
      </div>
      <div style={{ width: '200px', height: '2px', background: 'rgba(201,162,74,0.15)', borderRadius: '1px', overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #C9A24A, #E3C875)', borderRadius: '1px', transition: 'width 0.3s ease' }} />
      </div>
      <span style={{ fontSize: '12px', color: 'rgba(201,162,74,0.5)', letterSpacing: '0.1em' }}>
        {phase === 0 && 'Initializing corridor...'}
        {phase === 1 && 'Loading transaction rail...'}
        {phase === 2 && 'Verifying infrastructure...'}
        {phase === 3 && 'Ready'}
      </span>
      <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.4 }}>
        <span style={{ fontSize: '11px', color: '#C9A24A' }}>🇳🇬 NIGERIA</span>
        <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, #C9A24A, transparent, #C9A24A)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-2px', width: '5px', height: '5px', background: '#C9A24A', borderRadius: '50%', animation: 'routeMove 1.5s ease-in-out infinite' }} />
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
// VIDEO PLAYER (Portrait 9:16)
// ============================================================
function PortraitVideoPlayer({ src, poster }: { src: string; poster?: string }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) videoRef.current.pause();
      else videoRef.current.play();
      setPlaying(!playing);
    }
  };

  return (
    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#0B1F3A', maxWidth: '320px', margin: '0 auto', aspectRatio: '9/16' }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,31,58,0.9), transparent 40%, rgba(11,31,58,0.3))', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#C9A24A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>CTO Briefing</span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <button onClick={togglePlay} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(201,162,74,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {playing ? <Pause size={20} color="#0B1F3A" /> : <Play size={20} color="#0B1F3A" />}
            </button>
          </div>
          <button onClick={() => setMuted(!muted)} style={{ display: 'block', margin: '0 auto', padding: '4px 12px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '10px', color: 'white' }}>
            {muted ? '🔇 Unmute' : '🔊 Mute'}
          </button>
        </div>
      </div>
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
  const isRTL = lang === 'ar';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.body.style.direction = isRTL ? 'rtl' : 'ltr';
    document.body.style.textAlign = isRTL ? 'right' : 'left';
  }, [lang, isRTL]);

  useEffect(() => {
    const timer = setInterval(() => setActiveStep(prev => (prev + 1) % 8), 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('masar-lang');
    if (savedLang) { setLang(savedLang as 'en' | 'ar'); return; }
    fetch('https://ipapi.co/json/').then(r => r.json()).then(data => {
      if (['SA','AE','QA','KW','BH','OM'].includes(data.country_code)) { setLang('ar'); localStorage.setItem('masar-lang', 'ar'); }
    }).catch(() => {});
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem('masar-lang', newLang);
  };

  const whatsappUrl = `https://wa.me/2348022220247?text=${encodeURIComponent('Hello MASAR, I am interested in learning more about your trade corridor infrastructure for Africa–Saudi Arabia commerce.')}`;

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

  if (loading) return <Preloader onComplete={() => setLoading(false)} />;

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
                <Link href="/how-it-works" style={{ fontSize: '13px', fontWeight: 500, color: scrolled ? '#5B6778' : 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.3s' }}>How It Works</Link>
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
              <Link key={item.h} href={item.h} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '18px', fontWeight: 500, color: '#0B1F3A', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #E5E9F0' }}>{item.l}</Link>
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
      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      {/* ============================================================ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background Image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="/images/hero-bg.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,31,58,0.92) 0%, rgba(16,42,76,0.88) 50%, rgba(11,31,58,0.95) 100%)' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.04) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.04) 87.5%), linear-gradient(150deg, rgba(201,162,74,0.04) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.04) 87.5%)`, backgroundSize: '60px 100px' }} />
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'rgba(201,162,74,0.08)', borderRadius: '50%', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'rgba(45,125,70,0.06)', borderRadius: '50%', filter: 'blur(80px)' }} />

        <div style={{ ...s.container, padding: '7rem 1.5rem 4rem', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)', borderRadius: '6px', marginBottom: '2rem' }}>
                <div style={{ width: '6px', height: '6px', background: '#C9A24A', borderRadius: '50%' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#C9A24A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>The Saudi–Africa Trade Corridor</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '1.5rem', maxWidth: '600px' }}>
                The trusted path between <span style={{ color: '#C9A24A' }}>African supply</span> and <span style={{ color: '#C9A24A' }}>Saudi demand</span>.
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '2.5rem' }}>
                MASAR connects verified exporters and Saudi buyers through one transaction rail for compliance, inspection, settlement and trade finance.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '2rem' }}>
                <Link href="/auth" style={s.btnPrimary}>Start a Trade <ArrowRight size={16} /></Link>
                <Link href="/how-it-works" style={s.btnSecondary}>Explore the MASAR Rail</Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', marginBottom: '2rem' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Powered by</span>
                <a href="https://kgmlimited.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', fontWeight: 700, color: '#C9A24A', textDecoration: 'none' }}>KGM Limited</a>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>— Kurra Greenfield Merchants Ltd</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {['Verified Counterparties', 'Compliance', 'Independent Inspection', 'Secure Settlement', 'Trade Finance'].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={14} color="#C9A24A" />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Corridor Image */}
            <div className="hidden lg:block">
              <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <img src="/images/hero-corridor.png" alt="MASAR Trade Corridor" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,31,58,0.8), transparent)' }} />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '2rem' }}>🇳🇬</span>
                      <p style={{ fontSize: '11px', color: 'white', fontWeight: 600, margin: '4px 0 0' }}>Nigeria</p>
                    </div>
                    <div style={{ flex: 1, margin: '0 12px', height: '3px', background: 'linear-gradient(90deg, #C9A24A, #E3C875, #C9A24A)', borderRadius: '2px' }} />
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '2rem' }}>🇸🇦</span>
                      <p style={{ fontSize: '11px', color: 'white', fontWeight: 600, margin: '4px 0 0' }}>Saudi Arabia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* COMPLIANCE TRUST BAR */}
      {/* ============================================================ */}
      <section style={{ padding: '2rem 1.5rem', background: 'white', borderBottom: '1px solid #E5E9F0' }}>
        <div style={{ ...s.container, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <span style={{ fontSize: '11px', color: '#9BA3AE', fontWeight: 600, letterSpacing: '0.08em' }}>BACKED BY KGM LIMITED:</span>
          {[
            { label: 'CAC Registered', sub: 'RC 1539036' },
            { label: 'BPP Compliant', sub: 'Federal Bureau' },
            { label: 'SCUML Certified', sub: 'CBN AML' },
            { label: 'MISA Saudi', sub: 'Ministry of Investment' },
          ].map((cert, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#F7F9FC', borderRadius: '6px', border: '1px solid #E5E9F0' }}>
              <ShieldCheck size={14} color="#2D7D46" />
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#122033' }}>{cert.label}</span>
                <span style={{ display: 'block', fontSize: '10px', color: '#9BA3AE' }}>{cert.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* CEO & CTO BRIEFING SECTION */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>Leadership Vision</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>Hear from the leaders building MASAR — the trusted infrastructure for Africa–Saudi trade.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }} className="lg:grid-cols-2">
            {/* CEO Quote */}
            <div style={{ ...s.card, padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem' }}>
                <img src="/images/ceo-portrait.png" alt="CEO" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #C9A24A' }} />
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>Lukman Kura</p>
                  <p style={{ fontSize: '13px', color: '#5B6778', margin: 0 }}>Founder & CEO, MASAR</p>
                </div>
              </div>
              <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '3px solid #C9A24A' }}>
                <Quote size={24} color="#C9A24A" style={{ position: 'absolute', top: '-4px', left: '-14px', opacity: 0.3 }} />
                <p style={{ fontSize: '16px', color: '#122033', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>
                  &ldquo;Our journey at MASAR is fueled by a commitment to innovation and customer success. By bridging the gap between national policy and grassroots delivery, we aren&apos;t just building infrastructure; we are building the future of Africa&apos;s digital economy and its trade connection with the Kingdom.&rdquo;
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1.5rem' }}>
                {['Strategic Vision', 'Corridor Development', 'Partnership Building'].map((tag, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', background: '#F7F9FC', border: '1px solid #E5E9F0', borderRadius: '6px', fontSize: '11px', color: '#5B6778', fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* CTO Briefing Video */}
            <div>
              <div style={{ ...s.card, padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <img src="/images/cto-portrait.png" alt="CTO" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #C9A24A' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>Mujahid Baita</p>
                    <p style={{ fontSize: '12px', color: '#5B6778', margin: 0 }}>Chief Technology Officer</p>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#5B6778', lineHeight: 1.6, marginBottom: '1rem' }}>
                  &ldquo;At MASAR, we are building more than software — we are engineering trust into every cross-border transaction.&rdquo;
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Protocol Architecture', 'Trust Engineering', 'Compliance Automation'].map((tag, idx) => (
                    <span key={idx} style={{ padding: '3px 8px', background: '#F7F9FC', border: '1px solid #E5E9F0', borderRadius: '4px', fontSize: '10px', color: '#5B6778' }}>{tag}</span>
                  ))}
                </div>
              </div>
              <PortraitVideoPlayer src="/assets/video/cto-briefing.mp4" poster="/images/cto-portrait.png" />
              <p style={{ fontSize: '11px', color: '#9BA3AE', textAlign: 'center', marginTop: '8px' }}>CTO Briefing — The MASAR Technology Vision (9:16 Portrait)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MARKET OPPORTUNITY */}
      {/* ============================================================ */}
      <section id="platform" style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>The corridor already exists.<br />The infrastructure doesn&apos;t.</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>Saudi Arabia is heavily dependent on imported food and agricultural products, while African exporters possess significant agricultural supply.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { value: '$20B+', label: 'Saudi food & agricultural imports annually', icon: TrendingUp },
              { value: '70–80%', label: 'Approximate food import reliance', icon: Wheat },
              { value: '$11B+', label: 'Estimated Saudi imports from Africa', icon: Globe },
              { value: '$817M', label: 'Nigeria sesame exports (2024)', icon: Leaf },
            ].map((stat, idx) => (
              <div key={idx} style={{ ...s.card, padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}><stat.icon size={22} color="#C9A24A" /></div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '0.5rem' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: '#5B6778' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SESAME FEATURE */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div>
              <div style={s.goldDivider} />
              <h2 style={s.sectionTitle}>Nigeria → Saudi Arabia<br />The First MASAR Commodity Lane</h2>
              <p style={{ ...s.sectionSubtitle, marginBottom: '1.5rem' }}>Premium Nigerian sesame — verified, inspected, and settled through one controlled transaction rail.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Commodity', value: 'Non-GMO Sesame' },
                  { label: 'Origin', value: 'Nigeria' },
                  { label: 'Destination', value: 'Saudi Arabia' },
                  { label: 'Verification', value: 'Independent' },
                  { label: 'Compliance', value: 'Managed' },
                  { label: 'Settlement', value: 'Controlled' },
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '10px', background: '#F7F9FC', borderRadius: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#9BA3AE' }}>{item.label}</span>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3A', margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
              <img src="/images/sesame-harvest.png" alt="Nigerian Sesame Harvest" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW MASAR WORKS */}
      {/* ============================================================ */}
      <section id="how-it-works" style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>One rail. Every critical condition.</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>Six steps from counterparty verification to settlement.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { num: '01', title: 'VERIFY', desc: 'Buyer and exporter KYB — identity, ownership, sanctions, trade history.', icon: ShieldCheck, color: '#C9A24A' },
              { num: '02', title: 'CONTRACT', desc: 'Digital transaction terms — commodity, quantity, quality, Incoterms, release conditions.', icon: FileSignature, color: '#3B82F6' },
              { num: '03', title: 'COMPLY', desc: 'Build the compliance pack — export docs, SFDA, phytosanitary, lab COA.', icon: ClipboardCheck, color: '#8B5CF6' },
              { num: '04', title: 'INSPECT', desc: 'Independent inspection and laboratory evidence against contract specifications.', icon: Search, color: '#2D7D46' },
              { num: '05', title: 'SECURE', desc: 'Funds coordinated through licensed financial partners — escrow, not custody.', icon: Lock, color: '#C9A24A' },
              { num: '06', title: 'RELEASE', desc: 'Settlement occurs when predefined transaction conditions are satisfied.', icon: BadgeCheck, color: '#0B1F3A' },
            ].map((step, idx) => (
              <div key={idx} style={{ ...s.card, padding: '2rem', display: 'flex', gap: '1.5rem' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#E5E9F0', marginBottom: '0.5rem' }}>{step.num}</div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${step.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><step.icon size={22} color={step.color} /></div>
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
      {/* FOR BUYERS WITH IMAGE */}
      {/* ============================================================ */}
      <section id="for-buyers" style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(45,125,70,0.08)', borderRadius: '6px', marginBottom: '1.5rem' }}><span>🇸🇦</span><span style={{ fontSize: '12px', fontWeight: 600, color: '#2D7D46', letterSpacing: '0.05em' }}>FOR SAUDI BUYERS</span></div>
              <h2 style={s.sectionTitle}>Source with confidence.</h2>
              <p style={{ ...s.sectionSubtitle, marginBottom: '2rem' }}>Saudi buyers gain a structured transaction environment where suppliers, documentation, inspection and transaction status are coordinated through one operating layer.</p>
              <Link href="/for-buyers" style={s.btnPrimary}>Become a MASAR Buyer <ArrowRight size={16} /></Link>
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
              <img src="/images/buyer-saudi.png" alt="Saudi Buyer" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOR EXPORTERS WITH IMAGE */}
      {/* ============================================================ */}
      <section id="for-exporters" style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div style={{ order: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(45,125,70,0.08)', borderRadius: '6px', marginBottom: '1.5rem' }}><span>🇳🇬</span><span style={{ fontSize: '12px', fontWeight: 600, color: '#2D7D46', letterSpacing: '0.05em' }}>FOR AFRICAN EXPORTERS</span></div>
              <h2 style={s.sectionTitle}>Turn verified supply into trusted market access.</h2>
              <p style={{ ...s.sectionSubtitle, marginBottom: '2rem' }}>MASAR helps qualified African exporters reach institutional Saudi buyers while reducing transaction friction.</p>
              <Link href="/for-exporters" style={s.btnPrimary}>Join the Exporter Network <ArrowRight size={16} /></Link>
            </div>
            <div style={{ order: 1, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
              <img src="/images/exporter-nigerian.png" alt="Nigerian Exporter" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TEAM & ABOUT */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
              <img src="/images/about-team.png" alt="MASAR Team" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div>
              <div style={s.goldDivider} />
              <h2 style={s.sectionTitle}>Built by operators who understand trade.</h2>
              <p style={{ ...s.sectionSubtitle, marginBottom: '1.5rem' }}>Our team combines deep expertise in African commodity markets, Saudi regulatory frameworks, international trade finance, and technology infrastructure.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { value: '7+', label: 'Years of Impact' },
                  { value: '31+', label: 'Projects Completed' },
                  { value: '15', label: 'Awards & Recognition' },
                  { value: '10k+', label: 'Daily Transactions' },
                ].map((stat, idx) => (
                  <div key={idx} style={{ padding: '12px', background: '#F7F9FC', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ fontSize: '20px', fontWeight: 800, color: '#0B1F3A', margin: 0 }}>{stat.value}</p>
                    <p style={{ fontSize: '11px', color: '#5B6778', margin: 0 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ROADMAP */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>From first trade to corridor infrastructure.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { phase: 'V0 — 2026', title: 'Concierge Pilot', desc: 'Real transactions. Real inspection. Real settlement.', active: true },
              { phase: 'V1 — 2027', title: 'Protocol Automation', desc: 'KYB automation, compliance engine, inspection integration.' },
              { phase: '2027+', title: 'Embedded Finance', desc: 'Up to 80% advance through capital partners.' },
              { phase: '2028+', title: 'Network Density', desc: 'More buyers. More exporters. More commodity lanes.' },
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
      {/* SAUDI-NIGERIA BUSINESS CULTURE SECTION */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>Different Markets. One Commercial Language.</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>MASAR bridges two complementary commercial cultures—Nigerian entrepreneurial dynamism and Saudi institutional sophistication—through structured trust, verification and accountability.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="lg:grid-cols-3">
            {/* Nigeria */}
            <div style={{ ...s.card, padding: '2rem', borderTop: '4px solid #2D7D46' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem' }}>🇳🇬</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>Nigeria</h3>
                  <p style={{ fontSize: '12px', color: '#5B6778', margin: 0 }}>Production & Enterprise</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Entrepreneurial opportunity & business resilience',
                  'Agricultural depth & manufacturing capacity',
                  'Growing technology ecosystem',
                  'Youth-driven enterprise & innovation',
                  'Resource availability & export capability',
                  'Local market intelligence & networks',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#2D7D46', marginTop: '2px' }}>✓</span>
                    <span style={{ fontSize: '13px', color: '#5B6778', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MASAR Bridge */}
            <div style={{ ...s.card, padding: '2rem', borderTop: '4px solid #C9A24A', background: 'linear-gradient(180deg, rgba(201,162,74,0.03) 0%, white 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #C9A24A, #E3C875)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#0B1F3A' }}>M</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>MASAR</h3>
                  <p style={{ fontSize: '12px', color: '#5B6778', margin: 0 }}>Trust Infrastructure</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Verification & structured transactions',
                  'Evidence-based commercial decisions',
                  'Independent inspection & quality',
                  'Compliance automation & audit trail',
                  'Financial partner coordination',
                  'Settlement & reconciliation',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#C9A24A', marginTop: '2px' }}>◆</span>
                    <span style={{ fontSize: '13px', color: '#5B6778', lineHeight: 1.5 }}>{item}</span>
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
                  <p style={{ fontSize: '12px', color: '#5B6778', margin: 0 }}>Capital & Markets</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Institutional capital & investment strength',
                  'Strategic geography connecting three continents',
                  'World-class logistics infrastructure',
                  'Growing non-oil economy & Vision 2030',
                  'GCC market access & institutional buyers',
                  'Long-term partnership orientation',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: '#0B1F3A', marginTop: '2px' }}>✓</span>
                    <span style={{ fontSize: '13px', color: '#5B6778', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUST PRINCIPLES - ARAB BUSINESS ETHOS */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>Trust Is the Foundation of Partnership.</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>MASAR's philosophy reflects commercial principles familiar within Arab and Nigerian business environments—where reputation, relationships and integrity drive sustainable commerce.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { ar: 'Amanah', en: 'Trustworthiness', desc: 'Every transaction is built on the foundation of trust between counterparties.', icon: Shield },
              { ar: 'Sidq', en: 'Truthfulness', desc: 'Verified information and honest representation drive commercial decisions.', icon: FileCheck },
              { ar: 'Wafa', en: 'Keeping Commitments', desc: 'Structured contracts and protocol conditions ensure obligations are met.', icon: BadgeCheck },
              { ar: 'Adl', en: 'Fairness', desc: 'Independent inspection and transparent workflows protect all parties.', icon: Scale },
              { ar: 'Shura', en: 'Consultation', desc: 'Multi-party approval workflows ensure informed decision-making.', icon: Users },
              { ar: 'Ihsan', en: 'Excellence', desc: 'Quality standards, compliance automation and continuous improvement.', icon: Award },
            ].map((principle, idx) => (
              <div key={idx} style={{ ...s.card, padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <principle.icon size={24} color="#C9A24A" />
                </div>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#C9A24A', margin: '0 0 4px 0' }}>{principle.ar}</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3A', margin: '0 0 8px 0' }}>{principle.en}</p>
                <p style={{ fontSize: '13px', color: '#5B6778', margin: 0, lineHeight: 1.6 }}>{principle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* NIGERIA-SAUDI CORRIDOR SECTION */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div>
              <div style={s.goldDivider} />
              <h2 style={s.sectionTitle}>Building the Nigeria–Saudi Commercial Corridor.</h2>
              <p style={{ ...s.sectionSubtitle, marginBottom: '1.5rem' }}>
                MASAR sits at the intersection of two complementary economic strengths: Nigeria's productive and entrepreneurial capacity and Saudi Arabia's capital, infrastructure, logistics position and expanding investment ecosystem.
              </p>
              <p style={{ ...s.sectionSubtitle, marginBottom: '1.5rem' }}>
                Recent bilateral initiatives have explicitly identified agriculture, mining, food products, banking and financial technology among areas for deeper cooperation. The opportunity is not simply to export commodities—it is to connect Nigerian productive capacity with structured international demand, capital and long-term partnerships.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '1.5rem' }}>
                {[
                  { label: 'Agriculture', value: 'Sesame, Cashew, Soybean' },
                  { label: 'Food Processing', value: 'Value-added exports' },
                  { label: 'Mining', value: 'Solid minerals' },
                  { label: 'Technology', value: 'Digital trade infrastructure' },
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '12px', background: '#F7F9FC', borderRadius: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#9BA3AE' }}>{item.label}</span>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3A', margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
              <img src="/images/trade-handshake.png" alt="Nigeria-Saudi Trade Partnership" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* WHY SAUDI ARABIA */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div style={{ order: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(11,31,58,0.08)', borderRadius: '6px', marginBottom: '1.5rem' }}>
                <span>🇸🇦</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0B1F3A', letterSpacing: '0.05em' }}>STRATEGIC MARKET</span>
              </div>
              <h2 style={s.sectionTitle}>Saudi Arabia: A Gateway Between Three Continents.</h2>
              <p style={{ ...s.sectionSubtitle, marginBottom: '1.5rem' }}>
                Saudi Arabia's national strategy positions the Kingdom as an investment powerhouse and a hub connecting Asia, Europe and Africa. The Kingdom combines capital, infrastructure, strategic geography and an increasingly diversified economy.
              </p>
              <p style={{ ...s.sectionSubtitle, marginBottom: '1.5rem' }}>
                For African businesses, the Kingdom represents not only a destination market but a potential gateway into wider GCC and international commercial networks.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Strategic Geography', 'Investment Capital', 'Logistics Infrastructure', 'Growing Non-Oil Economy', 'GCC Market Access', 'Institutional Buyers'].map((tag, idx) => (
                  <span key={idx} style={{ padding: '6px 12px', background: '#F7F9FC', border: '1px solid #E5E9F0', borderRadius: '6px', fontSize: '12px', color: '#5B6778', fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ order: 1, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
              <img src="/images/saudi-port.png" alt="Saudi Arabia Logistics" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* WHY NIGERIA */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="lg:grid-cols-2">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(45,125,70,0.08)', borderRadius: '6px', marginBottom: '1.5rem' }}>
                <span>🇳🇬</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#2D7D46', letterSpacing: '0.05em' }}>PRODUCTION POWERHOUSE</span>
              </div>
              <h2 style={s.sectionTitle}>Nigeria: A Production and Enterprise Powerhouse.</h2>
              <p style={{ ...s.sectionSubtitle, marginBottom: '1.5rem' }}>
                Nigeria combines a large domestic market, agricultural depth, natural resources, entrepreneurial capacity and a growing technology ecosystem. The opportunity is not simply to export commodities—it is to connect Nigerian productive capacity with structured international demand, capital and long-term partnerships.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Agriculture', value: 'Sesame, Cashew, Soybean, Shea' },
                  { label: 'Food Processing', value: 'Value-added products' },
                  { label: 'Manufacturing', value: 'Industrial capacity' },
                  { label: 'Technology', value: 'Growing tech ecosystem' },
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '12px', background: '#F7F9FC', borderRadius: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#9BA3AE' }}>{item.label}</span>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3A', margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
              <img src="/images/nigeria-port.png" alt="Nigeria Export Capacity" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MARKET INTELLIGENCE */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: '#F7F9FC' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>Know the Market Before You Commit Capital.</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>Good trade decisions begin with good information. MASAR provides decision intelligence around commodities, markets, supply, demand and risk.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { icon: Globe, label: 'Market Overview', value: 'Nigeria → Saudi Arabia' },
              { icon: Leaf, label: 'Supply', value: 'Nigerian agricultural production' },
              { icon: TrendingUp, label: 'Demand', value: 'Saudi food import reliance' },
              { icon: BarChart3, label: 'Price Indicators', value: 'Commodity pricing trends' },
              { icon: Ship, label: 'Trade Flow', value: 'Lagos → Jeddah corridor' },
              { icon: Shield, label: 'Risk Indicators', value: 'Counterparty & market risk' },
            ].map((item, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <item.icon size={20} color="#C9A24A" />
                </div>
                <p style={{ fontSize: '12px', color: '#9BA3AE', margin: '0 0 4px 0' }}>{item.label}</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0B1F3A', margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MASAR COMMERCIAL PRINCIPLES */}
      {/* ============================================================ */}
      <section style={{ ...s.section, background: 'white' }}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ ...s.goldDivider, margin: '0 auto 1.5rem' }} />
            <h2 style={s.sectionTitle}>The MASAR Principles</h2>
            <p style={{ ...s.sectionSubtitle, margin: '0 auto' }}>Seven principles that guide how MASAR enables cross-border commerce.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              { num: '01', title: 'Trust Before Scale', desc: 'Sustainable commerce begins with confidence in the counterparty.' },
              { num: '02', title: 'Evidence Before Assumption', desc: 'Commercial decisions should be supported by verifiable information.' },
              { num: '03', title: 'Relationships Before Transactions', desc: 'The objective is not one sale; it is a durable commercial relationship.' },
              { num: '04', title: 'Capital Follows Clarity', desc: 'Better-structured transactions create better conditions for financing decisions.' },
              { num: '05', title: 'Local Knowledge, International Standards', desc: 'Successful cross-border commerce respects local business realities while operating with international discipline.' },
              { num: '06', title: 'Transparency Creates Confidence', desc: 'Clear information reduces friction between counterparties.' },
              { num: '07', title: 'Partnership Over Intermediation', desc: 'MASAR enables businesses rather than unnecessarily standing between them.' },
            ].map((principle, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem', borderLeft: '4px solid #C9A24A' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#E5E9F0' }}>{principle.num}</span>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0B1F3A', margin: 0 }}>{principle.title}</h4>
                </div>
                <p style={{ fontSize: '13px', color: '#5B6778', margin: 0, lineHeight: 1.6 }}>{principle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL CTA */}
      {/* ============================================================ */}
      <section id="about" style={{ ...s.section, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="/images/compliance-bg.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,31,58,0.95) 0%, rgba(16,42,76,0.92) 100%)' }} />
        </div>
        <div style={{ ...s.container, position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>Build the next trade corridor with MASAR.</h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '2.5rem' }}>Whether you are a Saudi buyer, African exporter, financial institution or strategic infrastructure partner, MASAR is building the transaction rail that makes the corridor work.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            <Link href="/auth" style={s.btnPrimary}>Start a Trade <ArrowRight size={16} /></Link>
            <Link href="/contact" style={s.btnSecondary}>Talk to MASAR</Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
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
              <Link href="/how-it-works" style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>How It Works</Link>
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
          .hidden.lg\\:block { display: block !important; }
        }
        @media (max-width: 1023px) {
          .hidden.lg\\:block { display: none !important; }
        }
      `}</style>
    </div>
  );
}
