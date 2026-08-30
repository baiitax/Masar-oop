'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

const colors = {
  navy: '#0B1F3A', navyLight: '#142235', gold: '#C9A24A', goldLight: '#D4B366',
  white: '#FFFFFF', gray: '#6B7280', grayLight: '#E5E7EB', grayLighter: '#F3F4F6',
  green: '#10B981', greenLight: '#D1FAE5', red: '#EF4444', redLight: '#FEE2E2',
  blue: '#3B82F6', blueLight: '#DBEAFE', amber: '#F59E0B', amberLight: '#FEF3C7',
};

const steps = [
  { id: 1, title: 'Account', icon: '👤' },
  { id: 2, title: 'Organization', icon: '🏢' },
  { id: 3, title: 'Verify', icon: '✉️' },
  { id: 4, title: 'KYC', icon: '📄' },
  { id: 5, title: 'Complete', icon: '✅' },
];

const organizationTypes = [
  { value: 'BUYER', label: 'Buyer', icon: '🛒' },
  { value: 'EXPORTER', label: 'Exporter', icon: '📦' },
  { value: 'INSPECTION_PARTNER', label: 'Inspector', icon: '🔍' },
  { value: 'LABORATORY', label: 'Laboratory', icon: '🔬' },
  { value: 'FINANCIAL_PARTNER', label: 'Finance', icon: '💰' },
  { value: 'LOGISTICS_PARTNER', label: 'Logistics', icon: '🚢' },
];

const countries = [
  { code: 'NG', name: 'Nigeria' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'UAE' }, { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' }, { code: 'GB', name: 'UK' },
];

export default function RegistrationPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Step 2
  const [orgType, setOrgType] = useState('');
  const [orgName, setOrgName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [country, setCountry] = useState('NG');
  const [city, setCity] = useState('');

  // Step 4
  const [kycStep, setKycStep] = useState(1);
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [regCertFile, setRegCertFile] = useState<File | null>(null);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
    setPasswordStrength(Math.min(strength, 100));
  }, [password]);

  const getStrengthColor = () => passwordStrength < 30 ? colors.red : passwordStrength < 60 ? colors.amber : passwordStrength < 80 ? colors.blue : colors.green;
  const getStrengthLabel = () => passwordStrength < 30 ? 'Weak' : passwordStrength < 60 ? 'Fair' : passwordStrength < 80 ? 'Good' : 'Strong';

  const handleCreateAccount = async () => {
    setError('');
    if (!fullName.trim()) { setError('Full name is required'); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Valid email required'); return; }
    if (password.length < 8) { setError('Password must be 8+ characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (!agreeTerms) { setError('Agree to Terms of Service'); return; }

    setLoading(true);
    try {
      // Sign up with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: fullName, phone },
          emailRedirectTo: `${window.location.origin}/register?verified=true`,
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Wait a moment for the session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sign in to establish session
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (signInError) {
          setError('Account created but login failed. Please sign in manually.');
          setLoading(false);
          return;
        }

        setSuccess('Account created! Please continue with organization details.');
        setCurrentStep(2);
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrganization = async () => {
    setError('');
    if (!orgType) { setError('Select organization type'); return; }
    if (!orgName.trim()) { setError('Organization name required'); return; }
    if (!city.trim()) { setError('City required'); return; }

    setLoading(true);
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please sign in first to create an organization.');
        setLoading(false);
        return;
      }

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          legal_name: orgName,
          organization_type: orgType,
          registration_number: regNumber || null,
          country_code: country,
          country: countries.find(c => c.code === country)?.name || country,
          city,
          email: email,
          phone: phone || null,
          status: 'pending',
          verification_status: 'unverified',
        })
        .select()
        .single();

      if (orgError) {
        setError('Failed to create organization: ' + orgError.message);
        setLoading(false);
        return;
      }

      // Get the appropriate role
      const roleCode = orgType === 'BUYER' ? 'BUYER_ADMIN' : 
                       orgType === 'EXPORTER' ? 'EXPORTER_ADMIN' : 'PARTNER_ADMIN';

      const { data: role } = await supabase
        .from('roles')
        .select('id')
        .eq('code', roleCode)
        .single();

      if (role) {
        // Create organization membership
        const { error: memberError } = await supabase
          .from('organization_members')
          .insert({
            organization_id: org.id,
            user_id: session.user.id,
            role_id: role.id,
            status: 'active',
            is_primary: true,
          });

        if (memberError) {
          console.error('Failed to create membership:', memberError);
          // Continue anyway - organization was created
        }
      }

      setSuccess('Organization created successfully!');
      setCurrentStep(3);
    } catch (err: any) {
      setError('An unexpected error occurred: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setCurrentStep(4);
        setSuccess('Email verified!');
      } else {
        setError('Email not yet verified. Check your inbox.');
      }
    } catch {
      setError('Unable to verify.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/register?verified=true` },
      });
      if (error) setError(error.message);
      else setSuccess('Verification email sent!');
    } catch {
      setError('Failed to resend.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '16px' : '12px 16px',
    border: `1px solid ${colors.grayLight}`,
    borderRadius: '8px',
    fontSize: isMobile ? '16px' : '14px',
    outline: 'none',
    background: colors.white,
    boxSizing: 'border-box' as const,
  };

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        @media (max-width: 767px) {
          .register-content { padding: 20px 16px 40px !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          .org-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .progress-text { display: none !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: isMobile ? '16px 20px' : '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: colors.gold, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: colors.navy }}>M</span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: colors.white }}>MASAR</span>
          </div>
          <button onClick={() => router.push('/auth')}
            style={{ padding: '8px 16px', background: 'transparent', color: colors.white, border: `1px solid ${colors.gray}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
            Sign In
          </button>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: isMobile ? '16px' : '20px 40px 40px' }}>
          <div style={{ width: '100%', maxWidth: '900px', background: colors.white, borderRadius: isMobile ? '16px' : '20px', boxShadow: '0 25px 80px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
            {/* Progress Bar */}
            <div style={{ padding: isMobile ? '16px 20px' : '24px 40px', background: colors.grayLighter, borderBottom: `1px solid ${colors.grayLight}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px', opacity: currentStep >= step.id ? 1 : 0.4 }}>
                      <div style={{
                        width: isMobile ? '32px' : '36px', height: isMobile ? '32px' : '36px', borderRadius: '50%',
                        background: currentStep > step.id ? colors.green : currentStep === step.id ? colors.navy : colors.grayLight,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '12px' : '14px'
                      }}>
                        {currentStep > step.id ? '✓' : step.icon}
                      </div>
                      <div className="progress-text">
                        <p style={{ fontSize: '12px', fontWeight: 600, color: currentStep >= step.id ? colors.navy : colors.gray, margin: 0 }}>{step.title}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div style={{ flex: 1, height: '2px', background: currentStep > step.id ? colors.green : colors.grayLight, margin: isMobile ? '0 4px' : '0 12px' }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="register-content" style={{ padding: isMobile ? '20px 20px 40px' : '30px 40px 40px' }}>
              {error && (
                <div style={{ padding: '12px 16px', background: colors.redLight, borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>⚠️</span>
                  <p style={{ fontSize: '13px', color: colors.red, margin: 0 }}>{error}</p>
                </div>
              )}
              {success && (
                <div style={{ padding: '12px 16px', background: colors.greenLight, borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>✓</span>
                  <p style={{ fontSize: '13px', color: colors.green, margin: 0 }}>{success}</p>
                </div>
              )}

              {/* Step 1: Account */}
              {currentStep === 1 && (
                <div>
                  <h2 style={{ fontSize: isMobile ? '22px' : '24px', fontWeight: 700, color: colors.navy, margin: '0 0 8px 0' }}>Create Your Account</h2>
                  <p style={{ fontSize: '14px', color: colors.gray, margin: '0 0 24px 0' }}>Join MASAR's trusted trade infrastructure</p>

                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '6px' }}>Full Name *</label>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '6px' }}>Email *</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '6px' }}>Phone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 xxx xxx xxxx" style={inputStyle} />
                  </div>

                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '6px' }}>Password *</label>
                      <div style={{ position: 'relative' }}>
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" style={inputStyle} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                          {showPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                      {password && (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', color: colors.gray }}>Strength</span>
                            <span style={{ fontSize: '11px', color: getStrengthColor(), fontWeight: 600 }}>{getStrengthLabel()}</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', background: colors.grayLight, borderRadius: '2px' }}>
                            <div style={{ width: `${passwordStrength}%`, height: '100%', background: getStrengthColor(), borderRadius: '2px', transition: 'width 0.3s' }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '6px' }}>Confirm Password *</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" style={inputStyle} />
                      {confirmPassword && password !== confirmPassword && <p style={{ fontSize: '11px', color: colors.red, margin: '6px 0 0 0' }}>Passwords don't match</p>}
                    </div>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }} />
                    <span style={{ fontSize: '13px', color: colors.gray }}>I agree to the <a href="/terms" style={{ color: colors.blue }}>Terms</a> and <a href="/privacy" style={{ color: colors.blue }}>Privacy Policy</a></span>
                  </label>

                  <button onClick={handleCreateAccount} disabled={loading}
                    style={{ width: '100%', padding: isMobile ? '18px' : '14px', background: loading ? colors.gray : colors.navy, color: colors.white, border: 'none', borderRadius: '8px', fontSize: isMobile ? '16px' : '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Creating Account...' : 'Continue'}
                  </button>
                </div>
              )}

              {/* Step 2: Organization */}
              {currentStep === 2 && (
                <div>
                  <h2 style={{ fontSize: isMobile ? '22px' : '24px', fontWeight: 700, color: colors.navy, margin: '0 0 8px 0' }}>Organization Details</h2>
                  <p style={{ fontSize: '14px', color: colors.gray, margin: '0 0 24px 0' }}>Tell us about your organization</p>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '12px' }}>Organization Type *</label>
                    <div className="org-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '10px' }}>
                      {organizationTypes.map((type) => (
                        <div key={type.value} onClick={() => setOrgType(type.value)}
                          style={{
                            padding: isMobile ? '14px' : '16px', background: orgType === type.value ? colors.navy : colors.grayLighter, borderRadius: '10px',
                            cursor: 'pointer', border: orgType === type.value ? `2px solid ${colors.gold}` : '2px solid transparent', transition: 'all 0.2s'
                          }}>
                          <span style={{ fontSize: '22px', display: 'block', marginBottom: '6px' }}>{type.icon}</span>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: orgType === type.value ? colors.white : colors.navy, margin: 0 }}>{type.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '6px' }}>Legal Name *</label>
                      <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Company name" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '6px' }}>Registration Number</label>
                      <input type="text" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} placeholder="CAC / CR number" style={inputStyle} />
                    </div>
                  </div>

                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '6px' }}>Country *</label>
                      <select value={country} onChange={(e) => setCountry(e.target.value)} style={inputStyle}>
                        {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '6px' }}>City *</label>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setCurrentStep(1)}
                      style={{ padding: isMobile ? '16px 20px' : '12px 24px', background: colors.grayLighter, color: colors.navy, border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                      Back
                    </button>
                    <button onClick={handleSaveOrganization} disabled={loading}
                      style={{ flex: 1, padding: isMobile ? '16px' : '12px', background: loading ? colors.gray : colors.navy, color: colors.white, border: 'none', borderRadius: '8px', fontSize: isMobile ? '16px' : '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
                      {loading ? 'Saving...' : 'Continue'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Email Verification */}
              {currentStep === 3 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', background: colors.blueLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <span style={{ fontSize: '36px' }}>✉️</span>
                  </div>
                  <h2 style={{ fontSize: isMobile ? '22px' : '24px', fontWeight: 700, color: colors.navy, margin: '0 0 8px 0' }}>Verify Your Email</h2>
                  <p style={{ fontSize: '14px', color: colors.gray, margin: '0 0 8px 0' }}>We sent a verification link to</p>
                  <p style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: '0 0 24px 0', wordBreak: 'break-all' }}>{email}</p>

                  <div style={{ padding: '20px', background: colors.grayLighter, borderRadius: '12px', marginBottom: '24px' }}>
                    <p style={{ fontSize: '14px', color: colors.gray, margin: 0 }}>Click the link in your email to verify. Expires in 24 hours.</p>
                  </div>

                  <button onClick={handleCheckVerification} disabled={loading}
                    style={{ width: '100%', padding: isMobile ? '18px' : '14px', background: loading ? colors.gray : colors.navy, color: colors.white, border: 'none', borderRadius: '8px', fontSize: isMobile ? '16px' : '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '12px' }}>
                    {loading ? 'Checking...' : "I've Verified My Email"}
                  </button>
                  <button onClick={handleResendVerification} disabled={loading}
                    style={{ width: '100%', padding: isMobile ? '16px' : '12px', background: 'transparent', color: colors.blue, border: `1px solid ${colors.blue}`, borderRadius: '8px', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    Resend Verification Email
                  </button>
                </div>
              )}

              {/* Step 4: KYC */}
              {currentStep === 4 && (
                <div>
                  <h2 style={{ fontSize: isMobile ? '22px' : '24px', fontWeight: 700, color: colors.navy, margin: '0 0 8px 0' }}>Identity Verification (KYC)</h2>
                  <p style={{ fontSize: '14px', color: colors.gray, margin: '0 0 24px 0' }}>Upload documents to verify your identity</p>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    {['Identity', 'Organization', 'Review'].map((step, i) => (
                      <div key={step} style={{ flex: 1, padding: '10px', background: kycStep > i + 1 ? colors.greenLight : kycStep === i + 1 ? colors.navy : colors.grayLighter, borderRadius: '8px', textAlign: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: kycStep > i + 1 ? colors.green : kycStep === i + 1 ? colors.white : colors.gray }}>
                          {kycStep > i + 1 ? '✓ ' : ''}{step}
                        </span>
                      </div>
                    ))}
                  </div>

                  {kycStep === 1 && (
                    <div>
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '6px' }}>ID Front</label>
                        <div style={{ padding: '24px', border: `2px dashed ${idFrontFile ? colors.green : colors.grayLight}`, borderRadius: '10px', textAlign: 'center', background: idFrontFile ? colors.greenLight : colors.grayLighter, cursor: 'pointer' }}>
                          <input type="file" accept="image/*,.pdf" onChange={(e) => e.target.files && setIdFrontFile(e.target.files[0])} style={{ display: 'none' }} id="id-front" />
                          <label htmlFor="id-front" style={{ cursor: 'pointer' }}>
                            {idFrontFile ? <><span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>✓</span><p style={{ fontSize: '13px', fontWeight: 600, color: colors.green, margin: 0 }}>{idFrontFile.name}</p></>
                             : <><span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📁</span><p style={{ fontSize: '13px', color: colors.gray, margin: 0 }}>Tap to upload ID</p></>}
                          </label>
                        </div>
                      </div>

                      <button onClick={() => setKycStep(2)}
                        style={{ width: '100%', padding: isMobile ? '18px' : '12px', background: colors.navy, color: colors.white, border: 'none', borderRadius: '8px', fontSize: isMobile ? '16px' : '14px', fontWeight: 600, cursor: 'pointer' }}>
                        Continue
                      </button>
                    </div>
                  )}

                  {kycStep === 2 && (
                    <div>
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: colors.navy, display: 'block', marginBottom: '6px' }}>Certificate of Incorporation</label>
                        <div style={{ padding: '24px', border: `2px dashed ${regCertFile ? colors.green : colors.grayLight}`, borderRadius: '10px', textAlign: 'center', background: regCertFile ? colors.greenLight : colors.grayLighter, cursor: 'pointer' }}>
                          <input type="file" accept="image/*,.pdf" onChange={(e) => e.target.files && setRegCertFile(e.target.files[0])} style={{ display: 'none' }} id="reg-cert" />
                          <label htmlFor="reg-cert" style={{ cursor: 'pointer' }}>
                            {regCertFile ? <><span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>✓</span><p style={{ fontSize: '13px', fontWeight: 600, color: colors.green, margin: 0 }}>{regCertFile.name}</p></>
                             : <><span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📁</span><p style={{ fontSize: '13px', color: colors.gray, margin: 0 }}>Tap to upload</p></>}
                          </label>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => setKycStep(1)}
                          style={{ padding: isMobile ? '16px 20px' : '12px 24px', background: colors.grayLighter, color: colors.navy, border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                          Back
                        </button>
                        <button onClick={() => { setCurrentStep(5); setSuccess('Registration complete!'); }}
                          style={{ flex: 1, padding: isMobile ? '16px' : '12px', background: colors.green, color: colors.white, border: 'none', borderRadius: '8px', fontSize: isMobile ? '16px' : '14px', fontWeight: 600, cursor: 'pointer' }}>
                          Submit for Review
                        </button>
                        <button onClick={() => { setCurrentStep(5); }}
                          style={{ padding: isMobile ? '16px 14px' : '12px 16px', background: 'transparent', color: colors.gray, border: `1px solid ${colors.grayLight}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                          Skip
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Complete */}
              {currentStep === 5 && (
                <div style={{ textAlign: 'center', paddingBottom: isMobile ? '40px' : '0' }}>
                  <div style={{ width: '100px', height: '100px', background: colors.greenLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <span style={{ fontSize: '48px' }}>🎉</span>
                  </div>
                  <h2 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 700, color: colors.navy, margin: '0 0 8px 0' }}>Registration Complete!</h2>
                  <p style={{ fontSize: '16px', color: colors.gray, margin: '0 0 24px 0' }}>Welcome to MASAR</p>

                  <div style={{ padding: '20px', background: colors.grayLighter, borderRadius: '12px', marginBottom: '24px', textAlign: 'left' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: colors.navy, margin: '0 0 12px 0' }}>What's Next?</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { icon: '✉️', text: 'Verify your email' },
                        { icon: '📄', text: 'Complete KYC verification' },
                        { icon: '🏢', text: 'Set up organization profile' },
                        { icon: '🤝', text: 'Start trading on MASAR' },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '16px' }}>{item.icon}</span>
                          <span style={{ fontSize: '14px', color: colors.navy }}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => router.push('/auth')}
                    style={{ width: '100%', padding: isMobile ? '18px' : '14px', background: colors.navy, color: colors.white, border: 'none', borderRadius: '8px', fontSize: isMobile ? '16px' : '15px', fontWeight: 600, cursor: 'pointer' }}>
                    Go to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>© 2026 MASAR — مسار. KGM Limited (CAC RC 1539036).</p>
        </div>
      </div>
    </>
  );
}
