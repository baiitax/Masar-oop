'use client';

import React from 'react';
import { 
  TrendingUp, Users, Truck, FileText, AlertTriangle, CheckCircle, 
  Clock, DollarSign, Ship, Shield, Activity, Globe, Package, ArrowUpRight
} from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { transactions, buyers, exporters, formatCurrency, getClearanceScoreColor, getClearanceScoreLabel } from '@/lib/data';

export default function CommandCenter() {
  const activeTransactions = transactions.filter(t => !['COMPLETED', 'CANCELLED', 'SETTLED'].includes(t.status));
  const completedTransactions = transactions.filter(t => ['COMPLETED', 'SETTLED'].includes(t.status));
  const totalGMV = transactions.reduce((sum, t) => sum + t.contractValue, 0);
  const completedGMV = completedTransactions.reduce((sum, t) => sum + t.contractValue, 0);
  const exceptions = transactions.flatMap(t => t.exceptions.map(e => ({ ...e, transactionId: t.masarId })));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مركز القيادة — Command Center</h1>
          <p className="text-gray-500 mt-1">مسار — Nigeria → Saudi Arabia Corridor</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 glass-card rounded-xl text-sm font-medium text-gray-700">تصدير التقرير</button>
          <button className="px-4 py-2.5 bg-masar-navy text-white rounded-xl text-sm font-medium hover:bg-masar-dark transition-colors shadow-lg">+ معاملة جديدة</button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'المعاملات النشطة', value: activeTransactions.length, change: '+2 هذا الأسبوع', icon: FileText, color: 'from-blue-500/20 to-blue-600/5', iconColor: 'text-blue-600' },
          { title: 'قيمةライン', value: formatCurrency(totalGMV), change: '+$1.2M هذا الشهر', icon: TrendingUp, color: 'from-green-500/20 to-green-600/5', iconColor: 'text-green-600' },
          { title: 'مشترون موثقون', value: buyers.filter(b => b.verificationStatus === 'APPROVED').length, change: '+1 هذا الشهر', icon: Users, color: 'from-purple-500/20 to-purple-600/5', iconColor: 'text-purple-600' },
          { title: 'مصدرون موثقون', value: exporters.filter(e => e.verificationStatus === 'APPROVED').length, change: '2 نشط', icon: Truck, color: 'from-masar-gold/20 to-masar-gold/5', iconColor: 'text-masar-gold' },
        ].map((metric, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><ArrowUpRight size={12} />{metric.change}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                <metric.icon size={22} className={metric.iconColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Pipeline */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">خط أنابيب المعاملات — Transaction Pipeline</h3>
          <div className="space-y-3">
            {transactions.filter(t => t.status !== 'COMPLETED' && t.status !== 'SETTLED').map((txn) => (
              <div key={txn.id} className="flex items-center gap-4 p-4 glass-card rounded-xl cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  txn.riskLevel === 'CRITICAL' ? 'bg-red-100' : txn.riskLevel === 'HIGH' ? 'bg-orange-100' : txn.riskLevel === 'MEDIUM' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <Package size={18} className={
                    txn.riskLevel === 'CRITICAL' ? 'text-red-600' : txn.riskLevel === 'HIGH' ? 'text-orange-600' : txn.riskLevel === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{txn.masarId}</p>
                    <StatusBadge status={txn.status} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{txn.commodity} • {txn.quantity} • {formatCurrency(txn.contractValue)}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getClearanceScoreColor(txn.clearanceScore.total)}`}>
                  {txn.clearanceScore.total} — {getClearanceScoreLabel(txn.clearanceScore.total)}
                </div>
                {txn.exceptions.length > 0 && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    <AlertTriangle size={12} /> {txn.exceptions.length}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Exceptions */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الاستثناءات النشطة — Exceptions</h3>
          <div className="space-y-3">
            {exceptions.length === 0 ? (
              <div className="text-center py-8"><CheckCircle className="mx-auto text-green-500 mb-2" size={32} /><p className="text-sm text-gray-500">لا توجد استثناءات</p></div>
            ) : (
              exceptions.map((exc, idx) => (
                <div key={idx} className={`p-3 rounded-xl border-r-4 ${
                  exc.severity === 'CRITICAL' ? 'bg-red-50 border-red-500' : exc.severity === 'HIGH' ? 'bg-orange-50 border-orange-500' : 'bg-yellow-50 border-yellow-500'
                }`}>
                  <p className="text-xs font-medium text-gray-500">{exc.transactionId}</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{exc.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{exc.deadline}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Corridor Map */}
      <div className="glass-card rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">حالة الممر — Corridor Status</h3>
        <div className="relative bg-gradient-to-r from-green-50 via-blue-50 to-yellow-50 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center mx-auto mb-3"><span className="text-3xl">🇳🇬</span></div>
              <h4 className="font-semibold text-gray-900">نيجيريا</h4>
              <p className="text-xs text-gray-500">لاغوس • كانو</p>
            </div>
            <div className="flex-1 mx-8 relative">
              <div className="h-2 bg-gradient-to-r from-green-400 via-masar-gold to-yellow-400 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"><Ship size={20} className="text-masar-blue" /></div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 glass-card rounded-2xl flex items-center justify-center mx-auto mb-3"><span className="text-3xl">🇸🇦</span></div>
              <h4 className="font-semibold text-gray-900">السعودية</h4>
              <p className="text-xs text-gray-500">جدة • الرياض</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-4 gap-4">
            {[{ v: '1', l: 'في العبور' }, { v: '3', l: 'قيد التحضير' }, { v: '1', l: 'مكتملة' }, { v: formatCurrency(totalGMV), l: 'إجمالي GMV' }].map((s, i) => (
              <div key={i} className="text-center p-3 glass-card rounded-xl"><p className="text-xl font-bold text-masar-navy">{s.v}</p><p className="text-xs text-gray-500">{s.l}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
