'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FileText, Users, Truck, MessageSquare, Shield, FolderOpen, 
  Search, DollarSign, Ship, History, Settings, LogOut, Globe, Bell, ChevronDown,
  ChevronRight, ChevronLeft, Languages, Menu, X, BarChart3, AlertTriangle,
  CheckCircle, Clock, Eye, KeyRound, Database, Activity, Package, Scale,
  Building2, Landmark, Network, Target, Layers, Compass, Flag, Receipt,
  ClipboardCheck, BadgeCheck, Anchor, Boxes, Wheat, Cpu, Server, Crown,
  MapPin, Calendar, Unlock, UserPlus, Beaker, Percent, Banknote, TrendingUp,
  GitBranch, Cog
} from 'lucide-react';
import { getCurrentRole, RoleConfig } from '@/lib/roles';

// Icon mapping
const iconMap: Record<string, any> = {
  LayoutDashboard, FileText, Users, Truck, MessageSquare, Shield, FolderOpen,
  Search, DollarSign, Ship, History, Settings, LogOut, Globe, Bell,
  BarChart3, AlertTriangle, CheckCircle, Clock, Eye, KeyRound, Database,
  Activity, Package, Scale, Building2, Landmark, Network, Target, Layers,
  Compass, Flag, Receipt, ClipboardCheck, BadgeCheck, Anchor, Boxes, Wheat,
  Cpu, Server, Crown, MapPin, Calendar, Unlock, UserPlus, Beaker, Percent,
  Banknote, TrendingUp, GitBranch, Cog
};

interface RoleSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function RoleSidebar({ collapsed, onToggle }: RoleSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<RoleConfig | null>(null);

  useEffect(() => {
    const currentRole = getCurrentRole();
    setRole(currentRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('masar-role');
    localStorage.removeItem('masar-user');
    router.push('/auth');
  };

  if (!role) return null;

  return (
    <aside style={{
      width: collapsed ? '72px' : '260px',
      background: '#0B1F3A',
      borderRight: '1px solid rgba(201,162,74,0.1)',
      position: 'fixed',
      top: 0,
      bottom: 0,
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '16px 12px' : '16px 20px', borderBottom: '1px solid rgba(201,162,74,0.1)', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '64px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(201,162,74,0.1)', border: '1px solid rgba(201,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
        </div>
        {!collapsed && (
          <div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'white', letterSpacing: '0.06em' }}>MASAR</span>
            <span style={{ display: 'block', fontSize: '8px', color: 'rgba(201,162,74,0.6)', letterSpacing: '0.12em' }}>{role.title.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(201,162,74,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: `${role.color}15`, borderRadius: '8px', border: `1px solid ${role.color}30` }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `${role.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: role.color }}>{role.title[0]}</span>
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'white', margin: 0 }}>{role.title}</p>
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{role.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {role.sidebar.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '4px' }}>
            {!collapsed && (
              <div style={{ padding: '12px 20px 4px', fontSize: '10px', fontWeight: 700, color: 'rgba(201,162,74,0.4)', letterSpacing: '0.1em' }}>
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = iconMap[item.icon] || FileText;
              const isActive = pathname === item.href || (item.href !== role.redirect && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: collapsed ? '10px 0' : '9px 20px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    background: isActive ? 'rgba(201,162,74,0.1)' : 'transparent',
                    borderRight: isActive ? '2px solid #C9A24A' : '2px solid transparent',
                  }}
                >
                  <Icon size={18} color={isActive ? '#C9A24A' : 'rgba(255,255,255,0.4)'} />
                  {!collapsed && (
                    <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400, color: isActive ? '#C9A24A' : 'rgba(255,255,255,0.5)' }}>
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute', top: '20px', right: '-12px', width: '24px', height: '24px', borderRadius: '50%',
          background: '#0B1F3A', border: '1px solid rgba(201,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10, color: '#C9A24A',
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* User & Logout */}
      <div style={{ padding: collapsed ? '12px 8px' : '12px 16px', borderTop: '1px solid rgba(201,162,74,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${role.color}, ${role.color}CC)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{role.title.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{role.title}</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{role.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: collapsed ? 'center' : 'flex-start',
            padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <LogOut size={16} color="#EF4444" />
          {!collapsed && <span style={{ fontSize: '12px', fontWeight: 500, color: '#EF4444' }}>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
