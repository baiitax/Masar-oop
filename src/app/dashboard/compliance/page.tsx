'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  XCircle,
  ChevronRight,
  Download,
  Upload,
  Eye
} from 'lucide-react';
import Card from '@/components/shared/Card';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';
import { transactions, documents, getBuyerById, getExporterById, formatCurrency, getClearanceScoreLabel, getClearanceScoreColor } from '@/lib/data';

interface ComplianceItem {
  id: string;
  name: string;
  category: 'export' | 'saudi';
  status: 'complete' | 'pending' | 'missing' | 'expired';
  required: boolean;
  documentId?: string;
  dueDate?: string;
}

export default function CompliancePage() {
  const [selectedTxn, setSelectedTxn] = useState(transactions[0]);

  const complianceItems: ComplianceItem[] = [
    // Export-side
    { id: 'co', name: 'Certificate of Origin', category: 'export', status: 'complete', required: true, documentId: 'doc-001' },
    { id: 'phyto', name: 'Phytosanitary Certificate', category: 'export', status: selectedTxn.id === 'txn-002' ? 'expired' : 'complete', required: true, dueDate: selectedTxn.id === 'txn-002' ? '2026-08-27' : undefined },
    { id: 'export-doc', name: 'Export Documentation', category: 'export', status: 'complete', required: true },
    { id: 'ci', name: 'Commercial Invoice', category: 'export', status: 'complete', required: true, documentId: 'doc-003' },
    { id: 'pl', name: 'Packing List', category: 'export', status: 'complete', required: true, documentId: 'doc-005' },
    { id: 'ic', name: 'Inspection Certificate', category: 'export', status: selectedTxn.status === 'INSPECTION_PENDING' ? 'pending' : 'complete', required: true },
    { id: 'coa', name: 'Laboratory COA', category: 'export', status: selectedTxn.id === 'txn-003' ? 'missing' : 'complete', required: true },
    // Saudi-side
    { id: 'sfda', name: 'SFDA Requirements', category: 'saudi', status: selectedTxn.id === 'txn-003' ? 'pending' : 'complete', required: true },
    { id: 'reg', name: 'Product Registration', category: 'saudi', status: 'pending', required: true },
    { id: 'label', name: 'Arabic Labelling', category: 'saudi', status: 'complete', required: true },
    { id: 'halal', name: 'Halal Documentation', category: 'saudi', status: 'complete', required: false },
    { id: 'customs', name: 'Customs Documentation', category: 'saudi', status: 'pending', required: true },
    { id: 'zatca', name: 'ZATCA Invoice', category: 'saudi', status: 'pending', required: true },
    { id: 'importer', name: 'Importer Documentation', category: 'saudi', status: 'complete', required: true },
  ];

  const exportItems = complianceItems.filter(i => i.category === 'export');
  const saudiItems = complianceItems.filter(i => i.category === 'saudi');
  const completeCount = complianceItems.filter(i => i.status === 'complete').length;
  const pendingCount = complianceItems.filter(i => i.status === 'pending').length;
  const missingCount = complianceItems.filter(i => i.status === 'missing' || i.status === 'expired').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle size={16} className="text-green-500" />;
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'missing': return <XCircle size={16} className="text-red-500" />;
      case 'expired': return <AlertTriangle size={16} className="text-orange-500" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-50 border-green-200';
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      case 'missing': return 'bg-red-50 border-red-200';
      case 'expired': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance OS</h1>
          <p className="text-gray-500 mt-1">Transaction compliance management</p>
        </div>
      </div>

      {/* Transaction Selector */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {transactions.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').map((txn) => (
          <button
            key={txn.id}
            onClick={() => setSelectedTxn(txn)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl border text-left transition-all ${
              selectedTxn.id === txn.id 
                ? 'bg-masar-navy text-white border-masar-navy' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-masar-gold'
            }`}
          >
            <p className="text-sm font-semibold">{txn.masarId}</p>
            <p className={`text-xs mt-0.5 ${selectedTxn.id === txn.id ? 'text-gray-300' : 'text-gray-400'}`}>
              {txn.commodity} • {txn.quantity}
            </p>
          </button>
        ))}
      </div>

      {/* Clearance Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="MASAR Clearance Score" className="lg:col-span-1">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold ${getClearanceScoreColor(selectedTxn.clearanceScore.total)}`}>
              {selectedTxn.clearanceScore.total}
            </div>
            <p className="text-lg font-semibold mt-3">{getClearanceScoreLabel(selectedTxn.clearanceScore.total)}</p>
            <p className="text-sm text-gray-500 mt-1">{selectedTxn.masarId}</p>
          </div>
          <div className="mt-6 space-y-3">
            {[
              { label: 'Exporter Verification', value: selectedTxn.clearanceScore.exporterVerification, max: 15 },
              { label: 'Buyer Verification', value: selectedTxn.clearanceScore.buyerVerification, max: 10 },
              { label: 'Commodity Documentation', value: selectedTxn.clearanceScore.commodityDocumentation, max: 15 },
              { label: 'Lab/COA', value: selectedTxn.clearanceScore.labCOA, max: 15 },
              { label: 'Phytosanitary', value: selectedTxn.clearanceScore.phytosanitary, max: 10 },
              { label: 'Origin Documentation', value: selectedTxn.clearanceScore.originDocumentation, max: 10 },
              { label: 'Saudi Import Readiness', value: selectedTxn.clearanceScore.saudiImportReadiness, max: 15 },
              { label: 'Contract Completeness', value: selectedTxn.clearanceScore.contractCompleteness, max: 5 },
              { label: 'Inspection Readiness', value: selectedTxn.clearanceScore.inspectionReadiness, max: 5 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-xs font-medium">{item.value}/{item.max}</span>
                </div>
                <ProgressBar 
                  value={item.value} 
                  max={item.max} 
                  size="sm" 
                  color={item.value === item.max ? 'bg-green-500' : item.value > item.max * 0.5 ? 'bg-yellow-500' : item.value > 0 ? 'bg-orange-500' : 'bg-gray-300'} 
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Compliance Checklist */}
        <div className="lg:col-span-2 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
              <CheckCircle className="mx-auto text-green-500 mb-1" size={24} />
              <p className="text-2xl font-bold text-green-700">{completeCount}</p>
              <p className="text-xs text-green-600">Complete</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-200">
              <Clock className="mx-auto text-yellow-500 mb-1" size={24} />
              <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
              <p className="text-xs text-yellow-600">Pending</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
              <AlertTriangle className="mx-auto text-red-500 mb-1" size={24} />
              <p className="text-2xl font-bold text-red-700">{missingCount}</p>
              <p className="text-xs text-red-600">Missing/Expired</p>
            </div>
          </div>

          {/* Export-side Documents */}
          <Card title="Export-Side Compliance" subtitle="Nigerian export requirements">
            <div className="space-y-2">
              {exportItems.map((item) => (
                <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border ${getStatusStyle(item.status)}`}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.required && <span className="text-xs text-gray-400">Required</span>}
                      {item.dueDate && <span className="text-xs text-red-500 ml-2">Due: {item.dueDate}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status.toUpperCase()} />
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Saudi-side Documents */}
          <Card title="Saudi-Side Compliance" subtitle="Saudi import requirements">
            <div className="space-y-2">
              {saudiItems.map((item) => (
                <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border ${getStatusStyle(item.status)}`}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.required && <span className="text-xs text-gray-400">Required</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status.toUpperCase()} />
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Upload size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
