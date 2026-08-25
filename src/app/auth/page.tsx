'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, Building2, Phone, ArrowRight, ArrowLeft, Shield, CheckCircle, Smartphone, Languages, Loader2, Globe } from 'lucide-react';

export default function AuthPage() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [mode, setMode] = useState<'login' | 'register' | 'mfa'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', fullName: '', company: '', phone: '', role: 'buyer' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordChecks, setPasswordChecks] = useState({ length: false, upper: false, lower: false, number: false, special: false });
  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  useEffect(() => {
    const p = formData.password;
    setPasswordChecks({ length: p.length >= 8, upper: /[A-Z]/.test(p), lower: /[a-z]/.test(p), number: /[0-9]/.test(p), special: /[!@#$%^&*(),.?":{}|<>]/.test(p) });
    setPasswordStrength([p.length >= 8, /[A-Z]/.test(p), /[a-z]/.test(p), /[0-9]/.test(p), /[!@#$%^&*(),.?":{}|<>]/.test(p)].filter(Boolean).length);
  }, [formData.password]);

  const getStrengthColor = () => passwordStrength <= 1 ? '#EF4444' : passwordStrength <= 2 ? '#F97316' : passwordStrength <= 3 ? '#EAB308' : '#22C55E';
  const getStrengthLabel = () => passwordStrength <= 1 ? (isRTL ? 'ضعيفة' : 'Weak') : passwordStrength <= 2 ? (isRTL ? 'متوسطة' : 'Fair') : passwordStrength <= 3 ? (isRTL ? 'جيدة' : 'Good') : (isRTL ? 'قوية' : 'Strong');

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.email) e.email = 'Required';
    if (!formData.password) e.password = 'Required';
    if (mode === 'register') {
      if (!formData.fullName) e.fullName = 'Required';
      if (!formData.company) e.company = 'Required';
      if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
      if (passwordStrength < 3) e.password = 'Password too weak';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    if (mode === 'login') setMode('mfa');
    else window.location.href = '/dashboard';
    setLoading(false);
  };

  const handleMfaSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    window.location.href = '/dashboard';
  };

  const s = {
    navy: '#0B1F3A', gold: '#C9A24A', goldLight: '#E3C875', bg: '#F7F9FC', text: '#122033', textSec: '#5B6778',
    glassInput: { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.7)', border: '1px solid #E5E9F0', borderRadius: '10px', fontSize: '14px', color: '#122033', outline: 'none', transition: 'all 0.2s', backdropFilter: 'blur(10px)' },
    btnPrimary: { width: '100%', padding: '14px', background: `linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)`, color: '#0B1F3A', borderRadius: '10px', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s', boxShadow: '0 4px 16px rgba(201,162,74,0.25)' },
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex" style={{ width: '45%', background: `linear-gradient(135deg, ${s.navy} 0%, #102A4C 100%)`, padding: '3rem', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%)`, backgroundSize: '60px 100px' }} />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '3rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: s.navy, border: `2px solid ${s.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
            </div>
            <div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '0.08em' }}>MASAR</span>
              <span style={{ display: 'block', fontSize: '10px', color: 'rgba(201,162,74,0.7)', letterSpacing: '0.15em' }}>مسار — THE PATH</span>
            </div>
          </Link>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', lineHeight: 1.3, marginBottom: '1rem' }}>The trusted path between African supply and Saudi demand.</h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>MASAR connects verified exporters and Saudi buyers through one transaction rail for compliance, inspection, settlement and trade finance.</p>
        </div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: s.gold, letterSpacing: '0.1em', marginBottom: '1rem' }}>SECURITY FEATURES</h3>
          {['256-bit SSL encryption', 'Two-factor authentication', 'Session timeout after 30 minutes', 'Brute force protection'].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Shield size={14} color={s.gold} />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{item}</span>
            </div>
          ))}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: '1.5rem' }}>🇳🇬</span><p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Nigeria</p></div>
            <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, rgba(201,162,74,0.3), rgba(201,162,74,0.6), rgba(201,162,74,0.3))', borderRadius: '1px' }} />
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: '1.5rem' }}>🇸🇦</span><p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Saudi Arabia</p></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: s.bg }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {/* Mobile Logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: s.navy, border: `2px solid ${s.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
            </div>
            <span style={{ fontSize: '17px', fontWeight: 800, color: s.navy }}>MASAR</span>
          </div>

          {/* Language Toggle */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => { const n = lang === 'en' ? 'ar' : 'en'; setLang(n); localStorage.setItem('masar-lang', n); }} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: '1px solid #E5E9F0', background: 'white', color: '#5B6778', cursor: 'pointer' }}>
              <Languages size={13} /> {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>

          {/* Mode Tabs */}
          {mode !== 'mfa' && (
            <div style={{ display: 'flex', gap: '4px', padding: '4px', background: '#E5E9F0', borderRadius: '10px', marginBottom: '1.5rem' }}>
              {['login', 'register'].map((m) => (
                <button key={m} onClick={() => { setMode(m as any); setErrors({}); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', ...(mode === m ? { background: 'white', color: s.navy, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { background: 'transparent', color: '#9BA3AE' }) }}>
                  {m === 'login' ? (isRTL ? 'تسجيل الدخول' : 'Sign In') : (isRTL ? 'إنشاء حساب' : 'Create Account')}
                </button>
              ))}
            </div>
          )}

          {/* MFA View */}
          {mode === 'mfa' ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(201,162,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Smartphone size={28} color={s.gold} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: s.text, marginBottom: '0.5rem' }}>{isRTL ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}</h2>
                <p style={{ fontSize: '14px', color: '#9BA3AE' }}>{isRTL ? 'أدخل رمز التحقق من تطبيق المصادقة' : 'Enter the verification code from your authenticator app'}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '2rem', direction: 'ltr' }}>
                {mfaCode.map((digit, idx) => (
                  <input key={idx} type="text" maxLength={1} value={digit} onChange={(e) => { const n = [...mfaCode]; n[idx] = e.target.value; setMfaCode(n); if (e.target.value && idx < 5) document.getElementById(`mfa-${idx+1}`)?.focus(); }}
                    id={`mfa-${idx}`} style={{ width: '48px', height: '56px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, ...s.glassInput, borderRadius: '12px' }} />
                ))}
              </div>
              <button onClick={handleMfaSubmit} disabled={loading || mfaCode.some(d => !d)} style={{ ...s.btnPrimary, opacity: loading || mfaCode.some(d => !d) ? 0.5 : 1 }}>
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <>{isRTL ? 'تحقق من الرمز' : 'Verify Code'} <ArrowRight size={16} /></>}
              </button>
              <button onClick={() => setMode('login')} style={{ display: 'block', width: '100%', marginTop: '1rem', padding: '10px', background: 'none', border: 'none', fontSize: '13px', color: '#9BA3AE', cursor: 'pointer', textAlign: 'center' }}>
                {isRTL ? 'العودة لتسجيل الدخول' : 'Back to login'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: s.text, marginBottom: '0.5rem' }}>
                {mode === 'login' ? (isRTL ? 'مرحباً بعودتك' : 'Welcome Back') : (isRTL ? 'أنشئ حسابك' : 'Create Your Account')}
              </h2>
              <p style={{ fontSize: '14px', color: '#9BA3AE', marginBottom: '1.5rem' }}>
                {mode === 'login' ? (isRTL ? 'سجل دخولك للوصول إلى منصة مسار' : 'Sign in to access the MASAR platform') : (isRTL ? 'انضم إلى منصة مسار للتجارة الموثوقة' : 'Join the MASAR trusted trade platform')}
              </p>

              {/* Register Fields */}
              {mode === 'register' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>{isRTL ? 'الاسم الكامل' : 'Full Name'}</label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9BA3AE' }} />
                        <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} style={{ ...s.glassInput, paddingLeft: '36px', borderColor: errors.fullName ? '#EF4444' : '#E5E9F0' }} placeholder={isRTL ? 'أحمد محمد' : 'Ahmed Mohammed'} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>{isRTL ? 'اسم الشركة' : 'Company'}</label>
                      <div style={{ position: 'relative' }}>
                        <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9BA3AE' }} />
                        <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} style={{ ...s.glassInput, paddingLeft: '36px', borderColor: errors.company ? '#EF4444' : '#E5E9F0' }} placeholder={isRTL ? 'اسم الشركة' : 'Company Name'} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>{isRTL ? 'رقم الهاتف' : 'Phone'}</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9BA3AE' }} />
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ ...s.glassInput, paddingLeft: '36px', direction: 'ltr' }} placeholder="+966 5XX XXX XXXX" />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>{isRTL ? 'الدور' : 'Role'}</label>
                      <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ ...s.glassInput, cursor: 'pointer' }}>
                        <option value="buyer">{isRTL ? 'مشتري' : 'Buyer'}</option>
                        <option value="exporter">{isRTL ? 'مصدر' : 'Exporter'}</option>
                        <option value="partner">{isRTL ? 'شريك رأس مال' : 'Capital Partner'}</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>{isRTL ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9BA3AE' }} />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ ...s.glassInput, paddingLeft: '36px', direction: 'ltr', borderColor: errors.email ? '#EF4444' : '#E5E9F0' }} placeholder="name@example.com" autoComplete="email" />
                </div>
                {errors.email && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>{isRTL ? 'كلمة المرور' : 'Password'}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9BA3AE' }} />
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ ...s.glassInput, paddingLeft: '36px', paddingRight: '40px', direction: 'ltr', borderColor: errors.password ? '#EF4444' : '#E5E9F0' }} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9BA3AE', padding: 0 }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.password}</p>}
                {mode === 'register' && formData.password && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#9BA3AE' }}>{isRTL ? 'قوة كلمة المرور' : 'Password Strength'}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: getStrengthColor() }}>{getStrengthLabel()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= passwordStrength ? getStrengthColor() : '#E5E9F0', transition: 'all 0.3s' }} />)}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '8px' }}>
                      {[
                        { key: 'length', label: isRTL ? '٨ أحرف' : '8+ chars' },
                        { key: 'upper', label: isRTL ? 'حرف كبير' : 'Uppercase' },
                        { key: 'lower', label: isRTL ? 'حرف صغير' : 'Lowercase' },
                        { key: 'number', label: isRTL ? 'رقم' : 'Number' },
                      ].map(req => (
                        <div key={req.key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={12} color={passwordChecks[req.key as keyof typeof passwordChecks] ? '#22C55E' : '#E5E9F0'} />
                          <span style={{ fontSize: '11px', color: passwordChecks[req.key as keyof typeof passwordChecks] ? '#16A34A' : '#9BA3AE' }}>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              {mode === 'register' && (
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>{isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9BA3AE' }} />
                    <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} style={{ ...s.glassInput, paddingLeft: '36px', direction: 'ltr', borderColor: errors.confirmPassword ? '#EF4444' : '#E5E9F0' }} placeholder="••••••••" autoComplete="new-password" />
                  </div>
                  {errors.confirmPassword && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Remember / Forgot */}
              {mode === 'login' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: s.gold }} />
                    <span style={{ fontSize: '13px', color: '#5B6778' }}>{isRTL ? 'تذكرني' : 'Remember me'}</span>
                  </label>
                  <a href="#" style={{ fontSize: '13px', color: s.gold, textDecoration: 'none', fontWeight: 500 }}>{isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}</a>
                </div>
              )}

              {/* Terms */}
              {mode === 'register' && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '1.5rem' }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: s.gold, marginTop: '2px' }} />
                  <span style={{ fontSize: '12px', color: '#9BA3AE', lineHeight: 1.5 }}>
                    {isRTL ? 'بإنشاء حساب، أنت توافق على' : 'By creating an account, you agree to our'}{' '}
                    <a href="#" style={{ color: s.gold, textDecoration: 'none' }}>{isRTL ? 'شروط الخدمة' : 'Terms of Service'}</a>{' '}
                    {isRTL ? 'و' : 'and'}{' '}
                    <a href="#" style={{ color: s.gold, textDecoration: 'none' }}>{isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
                  </span>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} style={{ ...s.btnPrimary, opacity: loading ? 0.6 : 1 }}>
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <>{mode === 'login' ? (isRTL ? 'تسجيل الدخول' : 'Sign In') : (isRTL ? 'إنشاء حساب' : 'Create Account')} <ArrowRight size={16} /></>}
              </button>

              {/* Divider */}
              <div style={{ position: 'relative', margin: '1.5rem 0' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}><div style={{ width: '100%', borderTop: '1px solid #E5E9F0' }} /></div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}><span style={{ padding: '0 12px', background: s.bg, fontSize: '12px', color: '#9BA3AE' }}>{isRTL ? 'أو تابع بـ' : 'Or continue with'}</span></div>
              </div>

              {/* Social Login */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', background: 'white', border: '1px solid #E5E9F0', borderRadius: '10px', fontSize: '13px', fontWeight: 500, color: '#5B6778', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', background: 'white', border: '1px solid #E5E9F0', borderRadius: '10px', fontSize: '13px', fontWeight: 500, color: '#5B6778', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#122033"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </button>
              </div>

              {/* Switch Mode */}
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#9BA3AE' }}>
                {mode === 'login' ? (isRTL ? 'ليس لديك حساب؟' : "Don't have an account?") : (isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?')}{' '}
                <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); }} style={{ background: 'none', border: 'none', color: s.gold, fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                  {mode === 'login' ? (isRTL ? 'سجل الآن' : 'Sign Up') : (isRTL ? 'تسجيل الدخول' : 'Sign In')}
                </button>
              </p>
            </form>
          )}

          {/* Footer */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E9F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#9BA3AE' }}><Lock size={11} /> SSL Encrypted</div>
            <Link href="/" style={{ fontSize: '11px', color: '#9BA3AE', textDecoration: 'none' }}>{isRTL ? 'العودة للرئيسية' : 'Back to Home'}</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (min-width: 1024px) { .hidden.lg\\:flex { display: flex !important; } }
        @media (max-width: 1023px) { .hidden.lg\\:flex { display: none !important; } }
        @media (min-width: 1024px) { .lg\\:hidden { display: none !important; } }
        input:focus, select:focus { border-color: #C9A24A !important; box-shadow: 0 0 0 3px rgba(201,162,74,0.1) !important; }
      `}</style>
    </div>
  );
}
