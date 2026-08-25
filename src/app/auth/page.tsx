'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Globe, Languages, 
  Loader2, ChevronDown, Users, Crown, Cpu, Settings, Truck, Search, 
  DollarSign, Landmark, BarChart3, Scale, Building2, MapPin, AlertTriangle,
  KeyRound, Fingerprint
} from 'lucide-react';

const roles = [
  { id: 'ceo', title: 'CEO / Corridor Lead', category: 'Executive', email: 'ceo@demo.masar.local', icon: Crown, color: '#C9A24A', access: ['Executive Overview', 'Corridor Performance', 'Risk & Compliance'], redirect: '/app/executive' },
  { id: 'operations', title: 'Corridor Operations', category: 'Operations', email: 'operations@demo.masar.local', icon: Settings, color: '#8B5CF6', access: ['Transaction Queue', 'RFQs', 'Exception Center'], redirect: '/dashboard' },
  { id: 'compliance', title: 'KSA Compliance', category: 'Compliance', email: 'compliance@demo.masar.local', icon: Shield, color: '#10B981', access: ['Compliance Center', 'KYB / KYC', 'Documents'], redirect: '/dashboard/compliance' },
  { id: 'buyer', title: 'Saudi Anchor Buyer', category: 'External', email: 'buyer@demo.masar.local', icon: Building2, color: '#DC2626', access: ['Trade Desk', 'RFQs', 'Transactions'], redirect: '/buyer' },
  { id: 'exporter', title: 'Nigerian Exporter', category: 'External', email: 'exporter@demo.masar.local', icon: Truck, color: '#16A34A', access: ['Export Operations', 'Orders', 'Financing'], redirect: '/exporter' },
  { id: 'capital', title: 'Capital Partner', category: 'External', email: 'capital@demo.masar.local', icon: Landmark, color: '#7C3AED', access: ['Portfolio', 'Funding Requests', 'Exposure'], redirect: '/capital' },
  { id: 'inspector', title: 'Inspection Partner', category: 'External', email: 'inspector@demo.masar.local', icon: Search, color: '#0891B2', access: ['Assignments', 'Schedule', 'Reports'], redirect: '/inspector' },
  { id: 'auditor', title: 'Audit / Regulatory', category: 'Governance', email: 'auditor@demo.masar.local', icon: Scale, color: '#6B7280', access: ['Audit Overview', 'Evidence', 'Release Ledger'], redirect: '/audit-portal' },
  { id: 'admin', title: 'System Administrator', category: 'Administration', email: 'admin@demo.masar.local', icon: Settings, color: '#4B5563', access: ['Users', 'Roles', 'Settings'], redirect: '/dashboard' },
];

const DEMO_PASSWORD = 'MasarDemo@2026!';

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(true);
  const [error, setError] = useState('');
  const isRTL = lang === 'ar';

  const selectRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setSelectedRole(roleId);
      setEmail(role.email);
      setPassword(DEMO_PASSWORD);
      setError('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your credentials'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const role = roles.find(r => r.email === email);
    if (role) {
      localStorage.setItem('masar-role', role.id);
      localStorage.setItem('masar-user', JSON.stringify({ name: role.title, email: role.email, role: role.id }));
      router.push(role.redirect);
    } else {
      // Default login
      localStorage.setItem('masar-role', 'admin');
      localStorage.setItem('masar-user', JSON.stringify({ name: 'Mujaheed Baita', email, role: 'admin' }));
      router.push('/dashboard');
    }
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex" style={{ width: '45%', background: 'linear-gradient(135deg, #0B1F3A 0%, #102A4C 50%, #0B1F3A 100%)', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `linear-gradient(30deg, rgba(201,162,74,0.1) 12%, transparent 12.5%, transparent 87%, rgba(201,162,74,0.1) 87.5%)`, backgroundSize: '60px 100px' }} />
        <div style={{ padding: '3rem', position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '4rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0B1F3A', border: '2px solid #C9A24A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
            </div>
            <div>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '0.08em' }}>MASAR</span>
              <span style={{ display: 'block', fontSize: '10px', color: 'rgba(201,162,74,0.7)', letterSpacing: '0.15em' }}>مسار — THE PATH</span>
            </div>
          </Link>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '1rem' }}>The trusted path for cross-border trade.</h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '2rem' }}>Secure access to the MASAR Trade Corridor Operating System.</p>
          <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ textAlign: 'center' }}><span style={{ fontSize: '1.5rem' }}>🇳🇬</span><p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Nigeria</p></div>
              <div style={{ flex: 1, margin: '0 1rem', height: '3px', background: 'linear-gradient(90deg, rgba(201,162,74,0.2), rgba(201,162,74,0.6), rgba(201,162,74,0.2))', borderRadius: '2px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-3px', width: '9px', height: '9px', background: '#C9A24A', borderRadius: '50%', animation: 'routePulse 3s ease-in-out infinite' }} />
              </div>
              <div style={{ textAlign: 'center' }}><span style={{ fontSize: '1.5rem' }}>🇸🇦</span><p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Saudi Arabia</p></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {['Verify', 'Comply', 'Inspect', 'Finance', 'Settle'].map((step, idx) => (
                <React.Fragment key={idx}>
                  <span style={{ fontSize: '11px', color: '#C9A24A', fontWeight: 600 }}>{step}</span>
                  {idx < 4 && <span style={{ color: 'rgba(201,162,74,0.3)' }}>·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: Shield, label: '256-bit SSL encryption' },
              { icon: KeyRound, label: 'Multi-factor authentication' },
              { icon: Fingerprint, label: 'Role-based access control' },
              { icon: Lock, label: 'Session timeout protection' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <item.icon size={14} color="#C9A24A" />
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '2rem 3rem', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 10 }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>© 2026 Kurra Greenfield Merchants Limited · CAC RC 1539036</p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#F6F8FB', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#0B1F3A', border: '2px solid #C9A24A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
            </div>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#0B1F3A' }}>MASAR</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: '1px solid #E4E7EC', background: 'white', color: '#667085', cursor: 'pointer' }}>
              <Languages size={13} /> {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>

          {/* Login Card */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E4E7EC', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#142235', marginBottom: '4px' }}>{isRTL ? 'مرحباً بعودتك' : 'Welcome back'}</h2>
            <p style={{ fontSize: '14px', color: '#667085', marginBottom: '1.5rem' }}>{isRTL ? 'سجل دخولك إلى مسار' : 'Sign in to MASAR'}</p>

            {error && (
              <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={14} color="#EF4444" />
                <span style={{ fontSize: '13px', color: '#991B1B' }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#667085', marginBottom: '6px' }}>{isRTL ? 'البريد الإلكتروني' : 'Work Email'}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#98A2B3' }} />
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSelectedRole(null); }} style={{ width: '100%', padding: '11px 14px 11px 36px', background: '#F9FAFB', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '14px', color: '#142235', outline: 'none', direction: 'ltr' }} placeholder="name@company.com" />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#667085', marginBottom: '6px' }}>{isRTL ? 'كلمة المرور' : 'Password'}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#98A2B3' }} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '11px 40px 11px 36px', background: '#F9FAFB', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '14px', color: '#142235', outline: 'none', direction: 'ltr' }} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#98A2B3', padding: 0 }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: '#C9A24A' }} />
                  <span style={{ fontSize: '13px', color: '#667085' }}>{isRTL ? 'تذكرني' : 'Remember me'}</span>
                </label>
                <a href="#" style={{ fontSize: '13px', color: '#C9A24A', textDecoration: 'none', fontWeight: 500 }}>{isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}</a>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? '#98A2B3' : 'linear-gradient(135deg, #C9A24A 0%, #E3C875 100%)', color: '#0B1F3A', borderRadius: '10px', fontSize: '15px', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <>{isRTL ? 'تسجيل الدخول' : 'Sign In'} <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>

          {/* Demo Access */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E4E7EC', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <button onClick={() => setShowDemo(!showDemo)} style={{ width: '100%', padding: '16px 20px', background: '#FFFBEB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(201,162,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={16} color="#C9A24A" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#142235', margin: 0 }}>Demo Access</p>
                  <p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>Select a role to explore MASAR</p>
                </div>
              </div>
              <ChevronDown size={18} color="#98A2B3" style={{ transform: showDemo ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </button>

            {showDemo && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid #FDE68A' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                  {roles.map(role => (
                    <button key={role.id} onClick={() => selectRole(role.id)} style={{ padding: '10px 12px', background: selectedRole === role.id ? '#FFFBEB' : '#F9FAFB', border: `1px solid ${selectedRole === role.id ? '#FDE68A' : '#E4E7EC'}`, borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: `${role.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <role.icon size={14} color={role.color} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: '#142235', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{role.title}</p>
                        <p style={{ fontSize: '9px', color: '#98A2B3', margin: 0 }}>{role.category}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedRoleData && (
                  <div style={{ padding: '14px', background: '#F9FAFB', borderRadius: '10px', border: `1px solid ${selectedRoleData.color}20` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${selectedRoleData.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <selectedRoleData.icon size={18} color={selectedRoleData.color} />
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#142235', margin: 0 }}>{selectedRoleData.title}</p>
                        <p style={{ fontSize: '11px', color: '#98A2B3', margin: 0 }}>{selectedRoleData.email}</p>
                      </div>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>ACCESS</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                        {selectedRoleData.access.map((item, idx) => (
                          <span key={idx} style={{ fontSize: '10px', padding: '3px 8px', background: 'white', border: '1px solid #E4E7EC', borderRadius: '4px', color: '#667085' }}>{item}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => { selectRole(selectedRoleData.id); handleLogin(new Event('submit') as any); }} style={{ width: '100%', padding: '10px', background: `linear-gradient(135deg, ${selectedRoleData.color}, ${selectedRoleData.color}CC)`, color: 'white', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      Continue as {selectedRoleData.title} <ArrowRight size={14} />
                    </button>
                  </div>
                )}

                <div style={{ marginTop: '10px', padding: '8px 12px', background: '#FEF3C7', borderRadius: '6px', border: '1px solid #FDE68A' }}>
                  <p style={{ fontSize: '10px', color: '#92400E', margin: 0, textAlign: 'center' }}>⚠️ DEMO ENVIRONMENT — credentials are fictional</p>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#98A2B3' }}>Powered by <a href="https://kgmlimited.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A24A', textDecoration: 'none', fontWeight: 600 }}>KGM Limited</a> · CAC RC 1539036</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes routePulse { 0%, 100% { left: 0; } 50% { left: calc(100% - 9px); } }
        @media (min-width: 1024px) { .hidden.lg\\:flex { display: flex !important; } }
        @media (max-width: 1023px) { .hidden.lg\\:flex { display: none !important; } }
        input:focus { border-color: #C9A24A !important; box-shadow: 0 0 0 3px rgba(201,162,74,0.1) !important; }
      `}</style>
    </div>
  );
}
