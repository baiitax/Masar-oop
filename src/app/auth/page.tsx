'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, Mail, Lock, Eye, EyeOff, User, Building2, Phone, 
  ArrowRight, ArrowLeft, Shield, CheckCircle, AlertTriangle,
  Fingerprint, KeyRound, Smartphone, Clock, Languages, Loader2
} from 'lucide-react';

const content = {
  ar: {
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    company: 'اسم الشركة',
    phone: 'رقم الهاتف',
    role: 'الدور',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    noAccount: 'ليس لديك حساب؟',
    hasAccount: 'لديك حساب بالفعل؟',
    signUp: 'سجل الآن',
    signIn: 'تسجيل الدخول',
    orContinueWith: 'أو تابع بـ',
    secureLogin: 'تسجيل دخول آمن',
    mfaTitle: 'المصادقة الثنائية',
    mfaDesc: 'أدخل رمز التحقق من تطبيق المصادقة',
    verifyCode: 'تحقق من الرمز',
    resendCode: 'إعادة إرسال الرمز',
    passwordStrength: 'قوة كلمة المرور',
    weak: 'ضعيفة',
    medium: 'متوسطة',
    strong: 'قوية',
    veryStrong: 'قوية جداً',
    requirements: 'متطلبات كلمة المرور',
    reqLength: '٨ أحرف على الأقل',
    reqUpper: 'حرف كبير واحد على الأقل',
    reqLower: 'حرف صغير واحد على الأقل',
    reqNumber: 'رقم واحد على الأقل',
    reqSpecial: 'رمز خاص واحد على الأقل',
    roles: {
      buyer: 'مشتري',
      exporter: 'مصدر',
      inspector: 'مفتش',
      partner: 'شريك رأس مال',
    },
    welcomeBack: 'مرحباً بعودتك',
    loginSubtitle: 'سجل دخولك للوصول إلى منصة مسار',
    createAccount: 'أنشئ حسابك',
    registerSubtitle: 'انضم إلى منصة مسار للتجارة الموثوقة',
    termsAgree: 'بإنشاء حساب، أنت توافق على',
    termsOfService: 'شروط الخدمة',
    and: 'و',
    privacyPolicy: 'سياسة الخصوصية',
    securityBadge: 'محمي بتشفير ٢٥٦-بت SSL',
    sessionTimeout: 'انتهاء الجلسة بعد ٣٠ دقيقة من عدم النشاط',
    rateLimiting: 'حماية من هجمات القوة الغاشمة',
    captcha: 'تحقق CAPTCHA بعد ٣ محاولات فاشلة',
  },
  en: {
    login: 'Sign In',
    register: 'Create Account',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    company: 'Company Name',
    phone: 'Phone Number',
    role: 'Role',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember me',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    orContinueWith: 'Or continue with',
    secureLogin: 'Secure Login',
    mfaTitle: 'Two-Factor Authentication',
    mfaDesc: 'Enter the verification code from your authenticator app',
    verifyCode: 'Verify Code',
    resendCode: 'Resend Code',
    passwordStrength: 'Password Strength',
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
    veryStrong: 'Very Strong',
    requirements: 'Password Requirements',
    reqLength: 'At least 8 characters',
    reqUpper: 'At least one uppercase letter',
    reqLower: 'At least one lowercase letter',
    reqNumber: 'At least one number',
    reqSpecial: 'At least one special character',
    roles: {
      buyer: 'Buyer',
      exporter: 'Exporter',
      inspector: 'Inspector',
      partner: 'Capital Partner',
    },
    welcomeBack: 'Welcome Back',
    loginSubtitle: 'Sign in to access the MASAR platform',
    createAccount: 'Create Your Account',
    registerSubtitle: 'Join the MASAR trusted trade platform',
    termsAgree: 'By creating an account, you agree to our',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy',
    securityBadge: 'Protected with 256-bit SSL encryption',
    sessionTimeout: 'Session timeout after 30 minutes of inactivity',
    rateLimiting: 'Brute force protection enabled',
    captcha: 'CAPTCHA verification after 3 failed attempts',
  },
};

export default function AuthPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [mode, setMode] = useState<'login' | 'register' | 'mfa'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', fullName: '', company: '', phone: '', role: 'buyer',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordChecks, setPasswordChecks] = useState({
    length: false, upper: false, lower: false, number: false, special: false,
  });

  const t = content[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  useEffect(() => {
    const p = formData.password;
    setPasswordChecks({
      length: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(p),
    });
    const score = [p.length >= 8, /[A-Z]/.test(p), /[a-z]/.test(p), /[0-9]/.test(p), /[!@#$%^&*(),.?":{}|<>]/.test(p)].filter(Boolean).length;
    setPasswordStrength(score);
  }, [formData.password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-orange-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return t.weak;
    if (passwordStrength <= 2) return t.medium;
    if (passwordStrength <= 3) return t.strong;
    return t.veryStrong;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.password) newErrors.password = 'Required';
    if (mode === 'register') {
      if (!formData.fullName) newErrors.fullName = 'Required';
      if (!formData.company) newErrors.company = 'Required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (passwordStrength < 3) newErrors.password = 'Password too weak';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    if (mode === 'login') {
      setMode('mfa');
    } else {
      window.location.href = '/dashboard';
    }
    setLoading(false);
  };

  const handleMfaSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    window.location.href = '/dashboard';
    setLoading(false);
  };

  const handleMfaInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`mfa-${index + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="min-h-screen login-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-masar-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-saudi-green/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-masar-blue/5 rounded-full blur-3xl" />

      {/* Language Switcher */}
      <button 
        onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 glass rounded-xl text-white/80 hover:text-white transition-colors"
      >
        <Languages size={18} />
        <span className="text-sm font-medium">{lang === 'ar' ? 'English' : 'العربية'}</span>
      </button>

      {/* Main Container */}
      <div className="w-full max-w-5xl relative z-10">
        <div className="grid lg:grid-cols-5 gap-0">
          
          {/* Left Panel - Branding */}
          <div className="lg:col-span-2 hidden lg:flex flex-col justify-between p-10 glass-dark rounded-l-3xl">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-masar-gold to-masar-gold-light flex items-center justify-center shadow-lg">
                  <Globe className="w-8 h-8 text-masar-navy" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-wider">{isRTL ? 'مسار' : 'MASAR'}</h1>
                  <p className="text-[10px] text-masar-gold tracking-[0.2em] uppercase">
                    {isRTL ? 'نظام تشغيل الممر التجاري' : 'Trade Corridor OS'}
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-4 font-display leading-tight">
                {isRTL ? 'البنية التحتية الموثوقة للتجارة بين أفريقيا والمملكة العربية السعودية' : 'The Trusted Trade Infrastructure for Africa–Saudi Commerce'}
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {isRTL ? 'أطراف موثوقة. تنسيق امتثال. فحص مستقل. تسوية آمنة. تمويل تجاري.' : 'Verified counterparties. Compliance orchestration. Independent inspection. Secure settlement. Trade finance.'}
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-4 mt-10">
              <h3 className="text-xs font-semibold text-masar-gold uppercase tracking-wider mb-4">
                {isRTL ? 'مزايا الأمان' : 'Security Features'}
              </h3>
              {[
                { icon: Shield, label: t.securityBadge },
                { icon: Clock, label: t.sessionTimeout },
                { icon: KeyRound, label: t.rateLimiting },
                { icon: Fingerprint, label: t.captcha },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-400">
                  <item.icon size={16} className="text-masar-gold" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Corridor Visual */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <span className="text-3xl">🇳🇬</span>
                  <p className="text-xs text-gray-400 mt-1">{isRTL ? 'نيجيريا' : 'Nigeria'}</p>
                </div>
                <div className="flex-1 mx-4 h-0.5 bg-gradient-to-r from-green-500 via-masar-gold to-yellow-500 rounded-full relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-masar-gold rounded-full flex items-center justify-center">
                    <Globe size={14} className="text-masar-navy" />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-3xl">🇸🇦</span>
                  <p className="text-xs text-gray-400 mt-1">{isRTL ? 'السعودية' : 'Saudi Arabia'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="lg:col-span-3">
            <div className="glass-light rounded-3xl lg:rounded-l-none p-8 lg:p-12">
              
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-masar-gold to-masar-gold-light flex items-center justify-center">
                  <Globe className="w-7 h-7 text-masar-navy" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-masar-navy">{isRTL ? 'مسار' : 'MASAR'}</h1>
                  <p className="text-[9px] text-masar-gold tracking-widest uppercase">{isRTL ? 'نظام تشغيل الممر التجاري' : 'Trade Corridor OS'}</p>
                </div>
              </div>

              {/* Mode Tabs */}
              {mode !== 'mfa' && (
                <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
                  <button
                    onClick={() => { setMode('login'); setErrors({}); }}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                      mode === 'login' ? 'bg-white text-masar-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t.login}
                  </button>
                  <button
                    onClick={() => { setMode('register'); setErrors({}); }}
                    className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all ${
                      mode === 'register' ? 'bg-white text-masar-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t.register}
                  </button>
                </div>
              )}

              {/* MFA View */}
              {mode === 'mfa' ? (
                <div className="animate-fade-in">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-masar-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Smartphone size={36} className="text-masar-gold" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 font-display">{t.mfaTitle}</h2>
                    <p className="text-gray-500 mt-2">{t.mfaDesc}</p>
                  </div>

                  <div className="flex justify-center gap-3 mb-8" dir="ltr">
                    {mfaCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`mfa-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleMfaInput(idx, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !mfaCode[idx] && idx > 0) {
                            const prev = document.getElementById(`mfa-${idx - 1}`);
                            prev?.focus();
                          }
                        }}
                        className="w-14 h-16 text-center text-2xl font-bold glass-input rounded-xl focus:ring-2 focus:ring-masar-gold"
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleMfaSubmit}
                    disabled={loading || mfaCode.some(d => !d)}
                    className="w-full py-4 glass-btn rounded-xl text-masar-navy font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <>{t.verifyCode} <ArrowRight size={18} /></>}
                  </button>

                  <button 
                    onClick={() => setMode('login')}
                    className="w-full mt-4 py-3 text-sm text-gray-500 hover:text-gray-700"
                  >
                    {isRTL ? 'العودة لتسجيل الدخول' : 'Back to login'}
                  </button>
                </div>
              ) : (
                /* Login / Register Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 font-display">
                      {mode === 'login' ? t.welcomeBack : t.createAccount}
                    </h2>
                    <p className="text-gray-500 mt-1">
                      {mode === 'login' ? t.loginSubtitle : t.registerSubtitle}
                    </p>
                  </div>

                  {/* Register Fields */}
                  {mode === 'register' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.fullName}</label>
                          <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                              className={`w-full pl-11 pr-4 py-3.5 glass-input rounded-xl text-sm ${errors.fullName ? 'border-red-500' : ''}`}
                              placeholder={isRTL ? 'أحمد محمد' : 'Ahmed Mohammed'}
                            />
                          </div>
                          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.company}</label>
                          <div className="relative">
                            <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={formData.company}
                              onChange={(e) => setFormData({...formData, company: e.target.value})}
                              className={`w-full pl-11 pr-4 py-3.5 glass-input rounded-xl text-sm ${errors.company ? 'border-red-500' : ''}`}
                              placeholder={isRTL ? 'اسم الشركة' : 'Company Name'}
                            />
                          </div>
                          {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.phone}</label>
                          <div className="relative">
                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full pl-11 pr-4 py-3.5 glass-input rounded-xl text-sm"
                              placeholder="+966 5XX XXX XXXX"
                              dir="ltr"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t.role}</label>
                          <select
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className="w-full px-4 py-3.5 glass-input rounded-xl text-sm"
                          >
                            <option value="buyer">{t.roles.buyer}</option>
                            <option value="exporter">{t.roles.exporter}</option>
                            <option value="inspector">{t.roles.inspector}</option>
                            <option value="partner">{t.roles.partner}</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full pl-11 pr-4 py-3.5 glass-input rounded-xl text-sm ${errors.email ? 'border-red-500' : ''}`}
                        placeholder={isRTL ? 'name@example.com' : 'name@example.com'}
                        dir="ltr"
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.password}</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className={`w-full pl-11 pr-12 py-3.5 glass-input rounded-xl text-sm ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="••••••••"
                        dir="ltr"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}

                    {/* Password Strength (Register only) */}
                    {mode === 'register' && formData.password && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">{t.passwordStrength}</span>
                            <span className={`text-xs font-medium ${
                              passwordStrength <= 1 ? 'text-red-500' :
                              passwordStrength <= 2 ? 'text-orange-500' :
                              passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                            }`}>{getStrengthLabel()}</span>
                          </div>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => (
                              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                                i <= passwordStrength ? getStrengthColor() : 'bg-gray-200'
                              }`} />
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: 'length', label: t.reqLength },
                            { key: 'upper', label: t.reqUpper },
                            { key: 'lower', label: t.reqLower },
                            { key: 'number', label: t.reqNumber },
                            { key: 'special', label: t.reqSpecial },
                          ].map(req => (
                            <div key={req.key} className="flex items-center gap-2">
                              <CheckCircle size={14} className={passwordChecks[req.key as keyof typeof passwordChecks] ? 'text-green-500' : 'text-gray-300'} />
                              <span className={`text-xs ${passwordChecks[req.key as keyof typeof passwordChecks] ? 'text-green-700' : 'text-gray-400'}`}>{req.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password (Register) */}
                  {mode === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.confirmPassword}</label>
                      <div className="relative">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className={`w-full pl-11 pr-12 py-3.5 glass-input rounded-xl text-sm ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          placeholder="••••••••"
                          dir="ltr"
                          autoComplete="new-password"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                    </div>
                  )}

                  {/* Remember / Forgot */}
                  {mode === 'login' && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-masar-gold focus:ring-masar-gold" />
                        <span className="text-sm text-gray-600">{t.rememberMe}</span>
                      </label>
                      <a href="#" className="text-sm text-masar-gold hover:text-masar-gold-light font-medium">{t.forgotPassword}</a>
                    </div>
                  )}

                  {/* Terms (Register) */}
                  {mode === 'register' && (
                    <div className="flex items-start gap-2">
                      <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 text-masar-gold focus:ring-masar-gold" />
                      <span className="text-xs text-gray-500">
                        {t.termsAgree} <a href="#" className="text-masar-gold hover:underline">{t.termsOfService}</a> {t.and} <a href="#" className="text-masar-gold hover:underline">{t.privacyPolicy}</a>
                      </span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 glass-btn rounded-xl text-masar-navy font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? t.login : t.register}
                        {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-sm text-gray-400">{t.orContinueWith}</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" className="flex items-center justify-center gap-2 py-3 glass-input rounded-xl hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      <span className="text-sm font-medium text-gray-700">Google</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 py-3 glass-input rounded-xl hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      <span className="text-sm font-medium text-gray-700">GitHub</span>
                    </button>
                  </div>

                  {/* Switch Mode */}
                  <p className="text-center text-sm text-gray-500 mt-6">
                    {mode === 'login' ? t.noAccount : t.hasAccount}{' '}
                    <button
                      type="button"
                      onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); }}
                      className="text-masar-gold hover:text-masar-gold-light font-semibold"
                    >
                      {mode === 'login' ? t.signUp : t.signIn}
                    </button>
                  </p>
                </form>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Lock size={12} />
                  <span>{isRTL ? 'محمي بتشفير SSL' : 'SSL Encrypted'}</span>
                </div>
                <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
                  {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
