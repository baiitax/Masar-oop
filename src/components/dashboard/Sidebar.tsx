'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Truck, FileText, ClipboardCheck, Shield, 
  FolderOpen, Search, DollarSign, Ship, History, MessageSquare,
  Settings, LogOut, Globe, ChevronLeft, ChevronRight, Bell, Languages
} from 'lucide-react';

const navigation = [
  { name: { ar: 'مركز القيادة', en: 'Command Center' }, href: '/dashboard', icon: LayoutDashboard },
  { name: { ar: 'المعاملات', en: 'Transactions' }, href: '/dashboard/transactions', icon: FileText },
  { name: { ar: 'المستوردون', en: 'Buyers' }, href: '/dashboard/buyers', icon: Users },
  { name: { ar: 'المصدرون', en: 'Exporters' }, href: '/dashboard/exporters', icon: Truck },
  { name: { ar: 'غرفة الصفقات', en: 'Deal Room' }, href: '/dashboard/rfq', icon: MessageSquare },
  { name: { ar: 'الامتثال', en: 'Compliance' }, href: '/dashboard/compliance', icon: Shield },
  { name: { ar: 'الوثائق', en: 'Documents' }, href: '/dashboard/documents', icon: FolderOpen },
  { name: { ar: 'الفحص', en: 'Inspections' }, href: '/dashboard/inspections', icon: Search },
  { name: { ar: 'التمويل', en: 'Finance' }, href: '/dashboard/finance', icon: DollarSign },
  { name: { ar: 'الشحن', en: 'Shipments' }, href: '/dashboard/shipments', icon: Ship },
  { name: { ar: 'التدقيق', en: 'Audit Trail' }, href: '/dashboard/audit', icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} glass-sidebar min-h-screen flex flex-col transition-all duration-300 relative`}>
      {/* Collapse Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -left-3 top-20 w-6 h-6 bg-masar-navy border border-masar-gold/30 rounded-full flex items-center justify-center text-masar-gold hover:bg-masar-dark transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div className={`p-${collapsed ? '4' : '6'} border-b border-white/10 transition-all`}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-masar-gold to-masar-gold-light flex items-center justify-center shadow-lg flex-shrink-0">
            <Globe className="w-5 h-5 text-masar-navy" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-white tracking-wider">{lang === 'ar' ? 'مسار' : 'MASAR'}</h1>
              <p className="text-[9px] text-masar-gold tracking-widest uppercase">{lang === 'ar' ? 'مركز القيادة' : 'Command'}</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-masar-gold/20 text-masar-gold'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
              title={item.name[lang]}
            >
              <item.icon size={18} className={isActive ? 'text-masar-gold' : 'text-gray-500'} />
              {!collapsed && <span>{item.name[lang]}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Language Toggle */}
      <div className="px-3 py-2">
        <button 
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <Languages size={18} />
          {!collapsed && <span>{lang === 'ar' ? 'English' : 'العربية'}</span>}
        </button>
      </div>

      {/* User */}
      <div className={`p-${collapsed ? '3' : '4'} border-t border-white/10`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-masar-gold to-masar-gold-light flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-masar-navy">AH</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{lang === 'ar' ? 'أحمد حسن' : 'Ahmed Hassan'}</p>
              <p className="text-xs text-gray-400 truncate">{lang === 'ar' ? 'مسؤول الامتثال' : 'Compliance Officer'}</p>
            </div>
          )}
          {!collapsed && (
            <Link href="/auth" className="text-gray-400 hover:text-white">
              <LogOut size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
