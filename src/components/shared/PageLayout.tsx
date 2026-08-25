'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Languages, ArrowRight, Mail, MapPin, Globe, ChevronRight } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  dark?: boolean;
}

export default function PageLayout({ children, title, subtitle, breadcrumb, dark }: PageLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const isRTL = lang === 'ar';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('masar-lang');
    if (saved) setLang(saved as 'en' | 'ar');
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem('masar-lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const navLinks = [
    { label: 'Platform', href: '/platform' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'For Buyers', href: '/for-buyers' },
    { label: 'For Exporters', href: '/for-exporters' },
    { label: 'Trust & Compliance', href: '/trust-compliance' },
    { label: 'About', href: '/about' },
  ];

  const s = {
    navy: '#0B1F3A',
    gold: '#C9A24A',
    goldLight: '#E3C875',
    bg: '#F7F9FC',
    text: '#122033',
    textSec: '#5B6778',
    card: { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: `linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)`, color: '#0B1F3A', borderRadius: '10px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.3s' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' },
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.95)' : 'white', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: '1px solid #E5E9F0', transition: 'all 0.3s', boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.04)' : 'none' }}>
        <div style={s.container}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: s.navy, border: `2px solid ${s.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
              </div>
              <span style={{ fontSize: '17px', fontWeight: 800, color: s.navy, letterSpacing: '0.06em' }}>MASAR</span>
            </Link>
            <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '24px' }}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ fontSize: '13px', fontWeight: 500, color: '#5B6778', textDecoration: 'none', transition: 'color 0.2s' }}>{link.label}</Link>
              ))}
              <button onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: '1px solid #E5E9F0', background: '#F7F9FC', color: '#5B6778', cursor: 'pointer' }}>
                <Languages size={13} /> {lang === 'en' ? 'العربية' : 'EN'}
              </button>
              <Link href="/auth" style={s.btnPrimary}>Start a Trade</Link>
            </div>
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}>
              <Menu size={22} color={s.navy} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'white', padding: '1.5rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: s.navy }}>MASAR</span>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} /></button>
          </div>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', fontSize: '16px', fontWeight: 500, color: s.text, textDecoration: 'none', padding: '14px 0', borderBottom: '1px solid #E5E9F0' }}>{link.label}</Link>
          ))}
          <Link href="/auth" onClick={() => setMobileMenuOpen(false)} style={{ ...s.btnPrimary, display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>Start a Trade</Link>
        </div>
      )}

      {/* Hero Banner */}
      <section style={{ background: dark ? s.navy : `linear-gradient(135deg, ${s.navy} 0%, #102A4C 100%)`, padding: '8rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%)`, backgroundSize: '60px 100px' }} />
        <div style={{ ...s.container, position: 'relative', zIndex: 10 }}>
          {breadcrumb && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <Link href="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
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
      <footer style={{ background: s.navy, padding: '4rem 1.5rem 2rem', borderTop: '1px solid rgba(201,162,74,0.1)' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '7px', background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'white', letterSpacing: '0.06em' }}>MASAR</span>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Trust. Compliance. Capital. One transaction rail.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>PLATFORM</h4>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}>{link.label}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>CONTACT</h4>
              <a href="mailto:info@masar.sa" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '6px' }}><Mail size={12} /> info@masar.sa</a>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '0 0 6px' }}><MapPin size={12} /> Riyadh, Saudi Arabia</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}><MapPin size={12} /> Lagos, Nigeria</p>
            </div>
          </div>
          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px' }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>© 2026 MASAR — مسار. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Privacy</a>
              <a href="#" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Terms</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @media (min-width: 1024px) { .hidden.lg\\:flex { display: flex !important; } }
        @media (max-width: 1023px) { .hidden.lg\\:flex { display: none !important; } }
        @media (min-width: 1024px) { .lg\\:hidden { display: none !important; } }
      `}</style>
    </div>
  );
}
