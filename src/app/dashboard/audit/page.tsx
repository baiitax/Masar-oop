'use client';

import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Shield, 
  User, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Eye,
  Download,
  Hash,
  Lock
} from 'lucide-react';
import Card from '@/components/shared/Card';
import StatusBadge from '@/components/shared/StatusBadge';
import { auditEvents, AuditEvent, formatStatus } from '@/lib/data';

export default function AuditPage() {
  const [filterAction, setFilterAction] = useState('all');

  const filteredEvents = filterAction === 'all' 
    ? auditEvents 
    : auditEvents.filter(e => e.action.toLowerCase().includes(filterAction.toLowerCase()));

  const getActionIcon = (action: string) => {
    if (action.includes('DOCUMENT')) return <FileText size={16} className="text-blue-500" />;
    if (action.includes('KYB') || action.includes('APPROVED')) return <CheckCircle size={16} className="text-green-500" />;
    if (action.includes('ALERT') || action.includes('FAILED')) return <AlertTriangle size={16} className="text-red-500" />;
    if (action.includes('STATUS') || action.includes('CONTRACT')) return <Shield size={16} className="text-purple-500" />;
    if (action.includes('INSPECTION')) return <Eye size={16} className="text-yellow-500" />;
    return <Clock size={16} className="text-gray-500" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('APPROVED') || action.includes('VERIFIED')) return 'bg-green-50 border-green-200';
    if (action.includes('ALERT') || action.includes('FAILED')) return 'bg-red-50 border-red-200';
    if (action.includes('UPLOADED') || action.includes('SCHEDULED')) return 'bg-blue-50 border-blue-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit & Risk Engine</h1>
          <p className="text-gray-500 mt-1">Append-only audit trail with cryptographic integrity</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download size={16} />
            Export Audit Log
          </button>
        </div>
      </div>

      {/* Security Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lock size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Append-Only</p>
              <p className="text-xs text-gray-500">Immutable audit log</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Hash size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Hash-Chained</p>
              <p className="text-xs text-gray-500">SHA-256 integrity</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">RBAC Enforced</p>
              <p className="text-xs text-gray-500">Role-based access</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Eye size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{auditEvents.length} Events</p>
              <p className="text-xs text-gray-500">All actions logged</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search audit events..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-masar-gold/20"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'document', 'approval', 'alert', 'status'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterAction(filter)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterAction === filter 
                  ? 'bg-masar-navy text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter === 'all' ? 'All' : formatStatus(filter)}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Events */}
      <Card noPadding>
        <div className="divide-y divide-gray-100">
          {filteredEvents.map((event) => (
            <div key={event.id} className={`p-4 ${getActionColor(event.action)} border-l-4`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getActionIcon(event.action)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">{formatStatus(event.action)}</h4>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{event.entityType}: {event.entityId}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <User size={12} /> {event.userName} ({event.userRole})
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} /> {new Date(event.timestamp).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        IP: {event.ipAddress}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Four-Eyes Control */}
      <Card title="Four-Eyes Control — Separation of Duties">
        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="flex items-start gap-3">
            <Shield size={24} className="text-yellow-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900">Critical Action Controls</h4>
              <p className="text-sm text-gray-600 mt-1">
                No single employee can onboard → approve → fund → release a transaction alone. 
                Critical actions require separation of duties.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Compliance Approval</p>
                  <p className="text-sm text-gray-700 mt-1">Compliance Officer</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Inspection Approval</p>
                  <p className="text-sm text-gray-700 mt-1">Independent Inspector</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Release Authorization</p>
                  <p className="text-sm text-gray-700 mt-1">Operations + Finance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
