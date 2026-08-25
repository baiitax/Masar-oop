'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RoleSidebar from './RoleSidebar';
import { getCurrentRole } from '@/lib/roles';
import { Bell, Search, Languages, ChevronDown, Loader2 } from 'lucide-react';

interface RoleLayoutProps {
  children: React.ReactNode;
}

export default function RoleLayout({ children }: RoleLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [role, setRole] = useState(getCurrentRole());
  const router = useRouter();

  useEffect(() => {
    const currentRole = getCurrentRole();
    if (!currentRole) {
      router.push('/auth');
      return;
    }
    setRole(currentRole);
    setLoading(false);
  }, [router]);

  if (loading || !role) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1F3A' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={32} color="#C9A24A" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '12px', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F6F8FB', fontFamily: "'Inter', 'IBM Plex Sans Arabic', system-ui, sans-serif" }}>
      <RoleSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div style={{ flex: 1, marginLeft: collapsed ? '72px' : '260px', transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <header style={{ background: 'white', borderBottom: '1px solid #E4E7EC', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#98A2B3' }} />
              <input type="text" placeholder="Search transactions, documents, counterparties..." style={{
                width: '100%', padding: '8px 12px 8px 36px', background: '#F9FAFB', border: '1px solid #E4E7EC',
                borderRadius: '8px', fontSize: '13px', color: '#142235', outline: 'none',
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#F0FDF4', borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: '#22C55E', borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#16A34A' }}>OPERATIONAL</span>
            </div>
            <div style={{ padding: '4px 8px', background: 'rgba(201,162,74,0.08)', borderRadius: '4px', border: '1px solid rgba(201,162,74,0.15)' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#C9A24A', letterSpacing: '0.05em' }}>V0 CONCIERGE</span>
            </div>
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, border: '1px solid #E4E7EC', background: 'white', color: '#667085', cursor: 'pointer' }}>
              <Languages size={14} /> {lang === 'en' ? 'عربي' : 'EN'}
            </button>
            <button style={{ position: 'relative', padding: '6px', background: 'none', border: '1px solid #E4E7EC', borderRadius: '8px', cursor: 'pointer' }}>
              <Bell size={18} color="#667085" />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: '#EF4444', borderRadius: '50%', fontSize: '9px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${role.color}, ${role.color}CC)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>{role.title.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#142235', margin: 0 }}>{role.title}</p>
                <p style={{ fontSize: '10px', color: '#667085', margin: 0 }}>{role.category}</p>
              </div>
              <ChevronDown size={14} color="#667085" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '24px' }}>{children}</main>

        {/* Status Bar */}
        <footer style={{ background: 'white', borderTop: '1px solid #E4E7EC', padding: '8px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#C9A24A', letterSpacing: '0.05em' }}>MASAR V0</span>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Concierge Operations · Human-in-the-loop</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Operations: <span style={{ color: '#16A34A', fontWeight: 600 }}>Operational</span></span>
            <span style={{ fontSize: '10px', color: '#98A2B3' }}>Settlement: <span style={{ color: '#C9A24A', fontWeight: 600 }}>Licensed Partner</span></span>
          </div>
        </footer>
      </div>

      <style jsx>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
