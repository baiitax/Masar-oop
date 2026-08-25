'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Languages, ChevronRight, ArrowRight } from 'lucide-react';
import FloatingButtons from './FloatingButtons';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  heroImage?: string;
  darkHero?: boolean;
}

export default function PublicLayout({ children, title, subtitle, breadcrumb, heroImage, darkHero }: PublicLayoutProps) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isRTL = lang === 'ar';

  useEffect(() => {
    const saved = localStorage.getItem('masar-lang');
    if (saved) setLang(saved as 'en' | 'ar');
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const toggleLang = () => {
    const n = lang === 'en' ? 'ar' : 'en';
    setLang(n);
    localStorage.setItem('masar-lang', n);
  };

  const navLinks = [
    { label: lang === 'ar' ? 'المنصة' : 'Platform', href: '/platform' },
    { label: lang === 'ar' ? 'كيف يعمل' : 'How It Works', href: '/how-it-works' },
    { label: lang === 'ar' ? 'للمستوردين' : 'For Buyers', href: '/for-buyers' },
    { label: lang === 'ar' ? 'للمصدرين' : 'For Exporters', href: '/for-exporters' },
    { label: lang === 'ar' ? 'الامتثال' : 'Trust & Compliance', href: '/trust-compliance' },
    { label: lang === 'ar' ? 'من نحن' : 'About', href: '/about' },
  ];

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.95)' : 'white', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: '1px solid #E5E9F0', transition: 'all 0.3s', boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.04)' : 'none' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #0B1F3A 0%, #102A4C 100%)', border: '2px solid #C9A24A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
              </div>
              <div>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0B1F3A', letterSpacing: '0.08em' }}>MASAR</span>
                <span style={{ display: 'block', fontSize: '8px', color: '#C9A24A', letterSpacing: '0.15em' }}>مسار — THE PATH</span>
              </div>
            </Link>
            
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '24px' }}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ fontSize: '13px', fontWeight: 500, color: '#5B6778', textDecoration: 'none', transition: 'color 0.2s' }}>{link.label}</Link>
              ))}
              <button onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: '1px solid #E5E9F0', background: '#F7F9FC', color: '#5B6778', cursor: 'pointer' }}>
                <Languages size={14} /> {lang === 'en' ? 'العربية' : 'EN'}
              </button>
              <Link href="/auth" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C9A24A, #E3C875)', color: '#0B1F3A', borderRadius: '10px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                {lang === 'ar' ? 'ابدأ تجارة' : 'Start a Trade'}
              </Link>
            </div>

            <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
              <Menu size={24} color="#0B1F3A" />
            </button>
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
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '18px', fontWeight: 500, color: '#0B1F3A', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid #E5E9F0' }}>{link.label}</Link>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
              <button onClick={() => { toggleLang(); }} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E5E9F0', background: '#F7F9FC', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                {lang === 'en' ? '🇸🇦 العربية' : '🇳🇬 English'}
              </button>
              <Link href="/auth" style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #C9A24A, #E3C875)', color: '#0B1F3A', borderRadius: '10px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {lang === 'ar' ? 'ابدأ تجارة' : 'Start a Trade'}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <section style={{ position: 'relative', paddingTop: '120px', paddingBottom: '60px', overflow: 'hidden' }}>
        {heroImage ? (
          <>
            <div style={{ position: 'absolute', inset: 0 }}>
              <img src={heroImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: darkHero ? 'linear-gradient(135deg, rgba(11,31,58,0.95) 0%, rgba(16,42,76,0.92) 100%)' : 'linear-gradient(135deg, rgba(11,31,58,0.88) 0%, rgba(16,42,76,0.85) 100%)' }} />
            </div>
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0B1F3A 0%, #102A4C 100%)' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%)`, backgroundSize: '60px 100px' }} />
          </div>
        )}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          {breadcrumb && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <Link href="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
              {breadcrumb.map((item, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight size={12} color="rgba(255,255,255,0.3)" />
                  {item.href ? (
                    <Link href={item.href} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{item.label}</Link>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#C9A24A' }}>{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '1rem', maxWidth: '700px' }}>{title}</h1>
          {subtitle && <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', lineHeight: 1.7 }}>{subtitle}</p>}
        </div>
      </section>

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Floating Buttons */}
      <FloatingButtons lang={lang} onToggleLang={toggleLang} />

      <style jsx>{`
        @media (min-width: 1024px) { .hidden.lg\\:flex { display: flex !important; } }
        @media (max-width: 1023px) { .hidden.lg\\:flex { display: none !important; } }
      `}</style>
    </div>
  );
}
