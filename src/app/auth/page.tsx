'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

const colors = {
  navy: '#0B1F3A', navyLight: '#142235', navyLighter: '#1a2f4a', navyDark: '#071428',
  gold: '#C9A24A', goldLight: '#D4B366', white: '#FFFFFF',
  gray: '#6B7280', grayLight: '#D1D5DB', grayLighter: '#F3F4F6',
  green: '#10B981', greenLight: '#D1FAE5', red: '#EF4444', redLight: '#FEE2E2',
  blue: '#3B82F6', blueLight: '#DBEAFE', amber: '#F59E0B', amberLight: '#FEF3C7',
};

// Demo accounts matching database seed data
const demoAccounts = [
  { 
    id: 'ceo', 
    email: 'demo.ceo@masar.local', 
    password: 'MasarDemo2026!', 
    role: 'CEO', 
    name: 'Lukman Kura', 
    organization: 'MASAR Platform',
    icon: '👔', 
    dashboard: '/app/executive', 
    color: '#8B5CF6',
    description: 'Executive Command Center'
  },
  { 
    id: 'operations', 
    email: 'demo.operations@masar.local', 
    password: 'MasarDemo2026!', 
    role: 'Operations', 
    name: 'Operations Manager', 
    organization: 'MASAR Platform',
    icon: '⚙️', 
    dashboard: '/app/operations', 
    color: '#3B82F6',
    description: 'Operations Dashboard'
  },
  { 
    id: 'compliance', 
    email: 'demo.compliance@masar.local', 
    password: 'MasarDemo2026!', 
    role: 'Compliance', 
    name: 'Compliance Officer', 
    organization: 'MASAR Platform',
    icon: '📋', 
    dashboard: '/app/compliance', 
    color: '#10B981',
    description: 'KYB & Compliance'
  },
  { 
    id: 'finance', 
    email: 'demo.finance@masar.local', 
    password: 'MasarDemo2026!', 
    role: 'Finance', 
    name: 'Finance Manager', 
    organization: 'MASAR Platform',
    icon: '💰', 
    dashboard: '/app/tradefinance', 
    color: '#F59E0B',
    description: 'Trade Finance'
  },
  { 
    id: 'buyer', 
    email: 'demo.buyer@masar.local', 
    password: 'MasarDemo2026!', 
    role: 'Buyer', 
    name: 'Ahmed Al Rajhi', 
    organization: 'Al Rajhi Foods',
    icon: '🛒', 
    dashboard: '/buyer', 
    color: '#EC4899',
    description: 'Saudi Buyer Portal'
  },
  { 
    id: 'exporter', 
    email: 'demo.exporter@masar.local', 
    password: 'MasarDemo2026!', 
    role: 'Exporter', 
    name: 'Oluwaseun Adebayo', 
    organization: 'Nigerian Sesame Co.',
    icon: '📦', 
    dashboard: '/exporter', 
    color: '#14B8A6',
    description: 'Nigerian Exporter Portal'
  },
  { 
    id: 'inspector', 
    email: 'demo.inspector@masar.local', 
    password: 'MasarDemo2026!', 
    role: 'Inspector', 
    name: 'Inspector SGS', 
    organization: 'SGS Nigeria',
    icon: '🔍', 
    dashboard: '/inspector', 
    color: '#6366F1',
    description: 'Inspection Portal'
  },
  { 
    id: 'auditor', 
    email: 'demo.auditor@masar.local', 
    password: 'MasarDemo2026!', 
    role: 'Auditor', 
    name: 'Internal Auditor', 
    organization: 'MASAR Platform',
    icon: '📊', 
    dashboard: '/audit-portal', 
    color: '#84CC16',
    description: 'Audit & Compliance'
  },
];

export default function AuthPage() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mode, setMode] = useState<'login' | 'forgot' | 'magic'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { emailRef.current?.focus(); }, []);

  useEffect(() => {
    if (isLocked && lockTimer > 0) {
      const interval = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) { setIsLocked(false); setLoginAttempts(0); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLocked, lockTimer]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: membership } = await supabase
          .from('organization_members').select('roles:role_id(code)')
          .eq('user_id', session.user.id).eq('status', 'active').limit(1).single();
        const roleCode = (membership?.roles as any)?.code;
        if (roleCode) redirectBasedOnRole(roleCode);
      }
    };
    checkSession();
  }, []);

  const redirectBasedOnRole = (roleCode: string) => {
    const redirects: Record<string, string> = {
      'SUPER_ADMIN': '/dashboard', 'CEO': '/app/executive', 'CTO': '/app/technology',
      'OPERATIONS': '/app/operations', 'COMPLIANCE': '/app/compliance', 'ORIGIN_OPERATIONS': '/app/origin',
      'TRADE_FINANCE': '/app/tradefinance', 'CFO': '/app/cfo', 'BUYER_ADMIN': '/buyer', 'BUYER_USER': '/buyer',
      'EXPORTER_ADMIN': '/exporter', 'EXPORTER_USER': '/exporter', 'INSPECTOR': '/inspector', 'AUDITOR': '/audit-portal',
    };
    router.push(redirects[roleCode] || '/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError(''); setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), password,
      });
      if (authError) {
        setLoginAttempts(prev => prev + 1);
        if (loginAttempts >= 4) { setIsLocked(true); setLockTimer(30); setError('Too many failed attempts. Account locked for 30 seconds.'); }
        else { setError(authError.message || 'Invalid email or password'); }
        setLoading(false); return;
      }
      setLoginAttempts(0);
      const { data: membership } = await supabase
        .from('organization_members').select('roles:role_id(code)')
        .eq('user_id', data.user.id).eq('status', 'active').limit(1).single();
      const roleCode = (membership?.roles as any)?.code;
      if (rememberMe) localStorage.setItem('masar_remember', 'true');
      localStorage.setItem('masar_user', JSON.stringify({ id: data.user.id, email: data.user.email, role: roleCode }));
      redirectBasedOnRole(roleCode);
    } catch { setError('An unexpected error occurred.'); }
    finally { setLoading(false); }
  };

  const handleDemoLogin = async (account: typeof demoAccounts[0]) => {
    setSelectedDemo(account.id); setError(''); setLoading(true);
    try {
      // Try to sign in first
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: account.email, password: account.password,
      });

      if (authError) {
        // If user doesn't exist, create them
        if (authError.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: account.email, 
            password: account.password,
            options: { 
              data: { 
                full_name: account.name, 
                role: account.role,
                organization: account.organization
              }, 
              emailRedirectTo: `${window.location.origin}/auth` 
            },
          });

          if (signUpError) { 
            setError(`Failed to create demo account: ${signUpError.message}`); 
            setLoading(false); 
            return; 
          }

          // Store user info
          localStorage.setItem('masar_user', JSON.stringify({ 
            id: signUpData.user?.id, 
            email: account.email, 
            role: account.role, 
            name: account.name,
            organization: account.organization
          }));

          // Redirect to dashboard
          router.push(account.dashboard);
        } else { 
          setError(authError.message); 
        }
      } else {
        // Successful login
        localStorage.setItem('masar_user', JSON.stringify({ 
          id: data.user.id, 
          email: data.user.email, 
          role: account.role, 
          name: account.name,
          organization: account.organization
        }));
        router.push(account.dashboard);
      }
    } catch { 
      setError('An unexpected error occurred.'); 
    }
    finally { 
      setLoading(false); 
      setSelectedDemo(null); 
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email: email.trim().toLowerCase(), 
        options: { emailRedirectTo: `${window.location.origin}/auth` } 
      });
      if (error) setError(error.message); 
      else setSuccess('Magic link sent! Check your email.');
    } catch { setError('Failed to send magic link.'); }
    finally { setLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(), 
        { redirectTo: `${window.location.origin}/auth/reset-password` }
      );
      if (error) setError(error.message); 
      else setSuccess('Password reset email sent!');
    } catch { setError('Failed to send reset email.'); }
    finally { setLoading(false); }
  };

  const inputStyle = (field: string, hasIcon = true) => ({
    width: '100%', 
    padding: isMobile ? '16px' : '14px 16px 14px ' + (hasIcon ? '42px' : '16px'),
    border: `2px solid ${focusedField === field ? colors.blue : colors.grayLight}`,
    borderRadius: '10px', 
    fontSize: isMobile ? '16px' : '14px', 
    outline: 'none',
    transition: 'border-color 0.2s', 
    background: focusedField === field ? colors.white : colors.grayLighter,
    boxSizing: 'border-box' as const,
  });

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        @media (max-width: 767px) {
          .auth-branding { display: none !important; }
          .auth-form { flex: 0 0 100% !important; padding: 24px 20px !important; }
          .demo-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 768px) {
          .auth-mobile-header { display: none !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', background: colors.navy }}>
        {/* Left Panel - Branding (hidden on mobile) */}
        <div className="auth-branding" style={{
          flex: '0 0 55%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: '60px', position: 'relative', overflow: 'hidden',
          background: `linear-gradient(135deg, ${colors.navyDark} 0%, ${colors.navy} 50%, ${colors.navyLight} 100%)`
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `radial-gradient(${colors.gold} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
          <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, ${colors.gold}10 0%, transparent 70%)`, filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, ${colors.blue}10 0%, transparent 70%)`, filter: 'blur(30px)' }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ width: '100px', height: '100px', background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: `0 20px 60px ${colors.gold}30` }}>
              <span style={{ fontSize: '42px', fontWeight: 800, color: colors.navy }}>M</span>
            </div>
            <h1 style={{ fontSize: '52px', fontWeight: 800, color: colors.white, margin: '0 0 4px 0', letterSpacing: '-2px', lineHeight: 1 }}>MASAR</h1>
            <p style={{ fontSize: '22px', color: colors.gold, margin: '0 0 8px 0', fontWeight: 500 }}>مسار</p>
            <p style={{ fontSize: '17px', color: colors.gray, margin: '0 0 48px 0', lineHeight: 1.6 }}>Trusted Trade Infrastructure for Africa–Saudi Arabia</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}>
              {[
                { value: '$50M+', label: 'Transaction Volume' },
                { value: '100+', label: 'Verified Partners' },
                { value: '99.9%', label: 'Uptime SLA' },
              ].map((stat, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: colors.gold, margin: '0 0 4px 0' }}>{stat.value}</p>
                  <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', textAlign: 'left' }}>
              {[
                { icon: '🔒', title: 'Secure Transactions', desc: 'End-to-end encryption' },
                { icon: '✓', title: 'Verified Counterparties', desc: 'KYB/KYC verified' },
                { icon: '📋', title: 'Compliance Automation', desc: 'Lane-specific rules' },
                { icon: '💰', title: 'Trade Finance', desc: 'Integrated escrow' },
              ].map((f, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '18px' }}>{f.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.white }}>{f.title}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: colors.gray, margin: 0, paddingLeft: '28px' }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '48px', padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '10px', color: colors.gray, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>Powered by</p>
              <p style={{ fontSize: '15px', color: colors.white, margin: 0, fontWeight: 600 }}>KGM Limited</p>
              <p style={{ fontSize: '10px', color: colors.gray, margin: '4px 0 0 0' }}>Kurra Greenfield Merchants Ltd • CAC RC 1539036</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="auth-form" style={{
          flex: '0 0 45%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px', background: colors.white, position: 'relative', overflow: 'auto'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '200px', background: `linear-gradient(180deg, ${colors.grayLighter} 0%, ${colors.white} 100%)`, zIndex: 0 }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '420px', margin: '0 auto', width: '100%' }}>
            {/* Mobile Logo Header */}
            <div className="auth-mobile-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: `0 10px 30px ${colors.gold}30` }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: colors.navy }}>M</span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: colors.navy, margin: '0 0 2px 0' }}>MASAR</h1>
              <p style={{ fontSize: '12px', color: colors.gold, margin: 0 }}>مسار — Trade Infrastructure</p>
            </div>

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 700, color: colors.navy, margin: '0 0 8px 0' }}>Welcome Back</h2>
              <p style={{ fontSize: '15px', color: colors.gray, margin: 0 }}>Sign in to access your MASAR workspace</p>
            </div>

            {/* Mode Tabs */}
            {mode !== 'forgot' && (
              <div style={{ display: 'flex', gap: '0', marginBottom: '24px', background: colors.grayLighter, borderRadius: '12px', padding: '4px' }}>
                {[
                  { id: 'login', label: 'Email & Password', icon: '🔑' },
                  { id: 'magic', label: 'Magic Link', icon: '✨' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => { setMode(tab.id as any); setError(''); setSuccess(''); }}
                    style={{
                      flex: 1, padding: isMobile ? '14px 8px' : '12px', background: mode === tab.id ? colors.white : 'transparent',
                      color: mode === tab.id ? colors.navy : colors.gray, border: 'none', borderRadius: '10px',
                      fontSize: isMobile ? '12px' : '13px', fontWeight: mode === tab.id ? 600 : 400, cursor: 'pointer',
                      boxShadow: mode === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
                    }}>
                    <span>{tab.icon}</span>
                    {!isMobile ? tab.label : tab.id === 'login' ? 'Password' : 'Magic Link'}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            {error && (
              <div style={{ padding: '14px 16px', background: colors.redLight, borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px', animation: 'shake 0.3s ease-in-out' }}>
                <span style={{ fontSize: '16px', marginTop: '1px' }}>⚠️</span>
                <p style={{ fontSize: '13px', color: colors.red, margin: 0, lineHeight: 1.5 }}>{error}</p>
              </div>
            )}
            {success && (
              <div style={{ padding: '14px 16px', background: colors.greenLight, borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '16px', marginTop: '1px' }}>✓</span>
                <p style={{ fontSize: '13px', color: colors.green, margin: 0, lineHeight: 1.5 }}>{success}</p>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '8px' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.5 }}>✉️</span>
                    <input ref={emailRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                      placeholder="you@company.com" required style={inputStyle('email')} />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy }}>Password</label>
                    <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                      style={{ background: 'none', border: 'none', color: colors.blue, fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.5 }}>🔒</span>
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password" required style={inputStyle('password')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: colors.gray, padding: '4px' }}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: colors.blue }} />
                    <span style={{ fontSize: '13px', color: colors.gray }}>Remember me</span>
                  </label>
                  {loginAttempts > 0 && <span style={{ fontSize: '11px', color: colors.red }}>{5 - loginAttempts} attempts left</span>}
                </div>

                <button type="submit" disabled={loading || isLocked}
                  style={{
                    width: '100%', padding: isMobile ? '18px' : '16px',
                    background: loading || isLocked ? colors.gray : `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
                    color: colors.white, border: 'none', borderRadius: '10px',
                    fontSize: isMobile ? '16px' : '15px', fontWeight: 600,
                    cursor: loading || isLocked ? 'not-allowed' : 'pointer', marginBottom: '20px',
                    boxShadow: loading || isLocked ? 'none' : `0 4px 16px ${colors.navy}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}>
                  {loading ? <><span style={{ animation: 'spin 1s linear infinite' }}>⟳</span> Signing in...</>
                   : isLocked ? `Locked (${lockTimer}s)` : 'Sign In'}
                </button>
              </form>
            )}

            {/* Magic Link Form */}
            {mode === 'magic' && (
              <form onSubmit={handleMagicLink}>
                <div style={{ padding: '20px', background: colors.blueLight, borderRadius: '12px', marginBottom: '24px', textAlign: 'center' }}>
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>✨</span>
                  <p style={{ fontSize: '14px', color: colors.navy, margin: 0, fontWeight: 500 }}>Enter your email for a magic sign-in link.</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '8px' }}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required style={inputStyle('magic-email', false)} />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: isMobile ? '18px' : '16px', background: loading ? colors.blue + '80' : colors.blue, color: colors.white, border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '12px' }}>
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </button>
                <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                  style={{ width: '100%', padding: '12px', background: 'transparent', color: colors.gray, border: 'none', fontSize: '13px', cursor: 'pointer' }}>
                  ← Back to password login
                </button>
              </form>
            )}

            {/* Forgot Password Form */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotPassword}>
                <div style={{ padding: '20px', background: colors.amberLight, borderRadius: '12px', marginBottom: '24px', textAlign: 'center' }}>
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🔑</span>
                  <p style={{ fontSize: '14px', color: colors.navy, margin: 0, fontWeight: 500 }}>Enter your email for a password reset link.</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '8px' }}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required style={inputStyle('forgot-email', false)} />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: isMobile ? '18px' : '16px', background: loading ? colors.amber + '80' : colors.amber, color: colors.white, border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '12px' }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                  style={{ width: '100%', padding: '12px', background: 'transparent', color: colors.gray, border: 'none', fontSize: '13px', cursor: 'pointer' }}>
                  ← Back to sign in
                </button>
              </form>
            )}

            {/* Demo Accounts */}
            {mode === 'login' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ flex: 1, height: '1px', background: colors.grayLight }} />
                  <span style={{ fontSize: '11px', color: colors.gray, fontWeight: 500, whiteSpace: 'nowrap' }}>Quick Demo Access</span>
                  <div style={{ flex: 1, height: '1px', background: colors.grayLight }} />
                </div>

                {/* Demo Credentials Info */}
                <div style={{ 
                  padding: '12px 16px', 
                  background: colors.amberLight, 
                  borderRadius: '8px', 
                  marginBottom: '16px',
                  fontSize: '12px',
                  color: colors.navy
                }}>
                  <strong>Demo Password:</strong> MasarDemo2026! (same for all accounts)
                </div>

                <div className="demo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  {demoAccounts.map((account) => (
                    <button key={account.id} onClick={() => handleDemoLogin(account)} disabled={loading}
                      style={{
                        padding: isMobile ? '16px 14px' : '14px',
                        background: selectedDemo === account.id ? `${account.color}10` : colors.grayLighter,
                        border: selectedDemo === account.id ? `2px solid ${account.color}` : '2px solid transparent',
                        borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', textAlign: 'left',
                        transition: 'all 0.2s', opacity: loading && selectedDemo !== account.id ? 0.5 : 1,
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ 
                          fontSize: '20px', 
                          width: '40px', 
                          height: '40px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          background: `${account.color}15`, 
                          borderRadius: '8px',
                          flexShrink: 0
                        }}>
                          {account.icon}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{account.role}</p>
                          <p style={{ fontSize: '10px', color: colors.gray, margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{account.organization}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Register Link */}
            <div style={{ textAlign: 'center', padding: '20px', background: colors.grayLighter, borderRadius: '12px', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: colors.gray, margin: '0 0 8px 0' }}>Don't have an account?</p>
              <button onClick={() => router.push('/register')}
                style={{ background: 'none', border: 'none', color: colors.blue, fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Create Account →
              </button>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', paddingBottom: isMobile ? '40px' : '0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <a href="/privacy" style={{ fontSize: '11px', color: colors.gray, textDecoration: 'none' }}>Privacy</a>
                <a href="/terms" style={{ fontSize: '11px', color: colors.gray, textDecoration: 'none' }}>Terms</a>
                <a href="/data-protection" style={{ fontSize: '11px', color: colors.gray, textDecoration: 'none' }}>Data Protection</a>
                <a href="/contact" style={{ fontSize: '11px', color: colors.gray, textDecoration: 'none' }}>Support</a>
              </div>
              <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>© 2026 MASAR — مسار. KGM Limited.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
