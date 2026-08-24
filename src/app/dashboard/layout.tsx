'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Bell, Search, Globe, Languages } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isRTL = lang === 'ar';

  return (
    <div className={`flex min-h-screen dashboard-bg ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="glass-light border-b border-gray-200/50 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder={isRTL ? 'بحث في المعاملات...' : 'Search transactions...'}
                  className="pl-10 pr-4 py-2.5 w-80 glass-input rounded-xl text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow" />
                <span className="text-xs font-medium text-green-700">{isRTL ? 'النظام متصل' : 'Online'}</span>
              </div>
              <button className="relative p-2.5 glass-card rounded-xl text-gray-500 hover:text-gray-700">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="h-6 w-px bg-gray-200" />
              <div className="text-right">
                <p className="text-xs text-gray-500">{isRTL ? 'اليوم' : 'Today'}</p>
                <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
