'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  ArrowRight
} from 'lucide-react';
import Card from '@/components/shared/Card';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';
import { 
  transactions, 
  buyers, 
  exporters, 
  getBuyerById, 
  getExporterById, 
  formatCurrency, 
  getStatusColor, 
  getRiskColor,
  getClearanceScoreLabel,
  getClearanceScoreColor,
  Transaction 
} from '@/lib/data';

export default function TransactionsPage() {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTransactions = filterStatus === 'all' 
    ? transactions 
    : transactions.filter(t => t.status.toLowerCase().includes(filterStatus.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">Manage all MASAR corridor transactions</p>
        </div>
        <button className="px-4 py-2 bg-masar-navy text-white rounded-lg text-sm font-medium hover:bg-masar-dark flex items-center gap-2">
          <Plus size={16} />
          New Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by MASAR ID, buyer, exporter..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-masar-gold/20"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'active', 'completed', 'risk'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === filter 
                  ? 'bg-masar-navy text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter === 'all' ? 'All' : filter === 'active' ? 'Active' : filter === 'completed' ? 'Completed' : 'At Risk'}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredTransactions.map((txn) => {
            const buyer = getBuyerById(txn.buyerId);
            const exporter = getExporterById(txn.exporterId);
            return (
              <div 
                key={txn.id}
                onClick={() => setSelectedTxn(txn)}
                className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                  selectedTxn?.id === txn.id ? 'border-masar-gold shadow-md' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-gray-900">{txn.masarId}</h3>
                      <StatusBadge status={txn.status} />
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(txn.riskLevel)}`}>
                        {txn.riskLevel}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Buyer</p>
                        <p className="text-sm font-medium text-gray-700">{buyer?.tradingName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Exporter</p>
                        <p className="text-sm font-medium text-gray-700">{exporter?.tradingName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Commodity</p>
                        <p className="text-sm font-medium text-gray-700">{txn.commodity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Value</p>
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(txn.contractValue)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${getClearanceScoreColor(txn.clearanceScore.total)}`}>
                      {txn.clearanceScore.total}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Clearance Score</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <ProgressBar 
                    value={txn.timeline.filter(s => s.completed).length} 
                    max={txn.timeline.length}
                    color={
                      txn.riskLevel === 'CRITICAL' ? 'bg-red-500' :
                      txn.riskLevel === 'HIGH' ? 'bg-orange-500' :
                      txn.riskLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                    }
                    size="sm"
                  />
                </div>

                {/* Exceptions */}
                {txn.exceptions.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-500" />
                    <span className="text-xs text-red-600 font-medium">
                      {txn.exceptions.length} exception{txn.exceptions.length > 1 ? 's' : ''} require attention
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Transaction Detail Panel */}
        <div className="lg:col-span-1">
          {selectedTxn ? (
            <div className="space-y-4 sticky top-6">
              <Card title="Transaction Details">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400">MASAR ID</p>
                    <p className="text-lg font-bold text-masar-navy">{selectedTxn.masarId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Commodity</p>
                      <p className="text-sm font-medium">{selectedTxn.commodity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Quantity</p>
                      <p className="text-sm font-medium">{selectedTxn.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Incoterm</p>
                      <p className="text-sm font-medium">{selectedTxn.incoterm}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Destination</p>
                      <p className="text-sm font-medium">{selectedTxn.destination}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-400">Contract Value</p>
                    <p className="text-2xl font-bold text-masar-navy">{formatCurrency(selectedTxn.contractValue)}</p>
                  </div>
                </div>
              </Card>

              {/* Clearance Score */}
              <Card title="Clearance Score">
                <div className="text-center mb-4">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold ${getClearanceScoreColor(selectedTxn.clearanceScore.total)}`}>
                    {selectedTxn.clearanceScore.total}
                  </div>
                  <p className="text-sm font-medium mt-2">{getClearanceScoreLabel(selectedTxn.clearanceScore.total)}</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Exporter Verification', value: selectedTxn.clearanceScore.exporterVerification, max: 15 },
                    { label: 'Buyer Verification', value: selectedTxn.clearanceScore.buyerVerification, max: 10 },
                    { label: 'Commodity Docs', value: selectedTxn.clearanceScore.commodityDocumentation, max: 15 },
                    { label: 'Lab/COA', value: selectedTxn.clearanceScore.labCOA, max: 15 },
                    { label: 'Phytosanitary', value: selectedTxn.clearanceScore.phytosanitary, max: 10 },
                    { label: 'Origin Docs', value: selectedTxn.clearanceScore.originDocumentation, max: 10 },
                    { label: 'Saudi Import', value: selectedTxn.clearanceScore.saudiImportReadiness, max: 15 },
                    { label: 'Contract', value: selectedTxn.clearanceScore.contractCompleteness, max: 5 },
                    { label: 'Inspection', value: selectedTxn.clearanceScore.inspectionReadiness, max: 5 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-28">{item.label}</span>
                      <div className="flex-1">
                        <ProgressBar value={item.value} max={item.max} size="sm" color={item.value === item.max ? 'bg-green-500' : item.value > 0 ? 'bg-yellow-500' : 'bg-gray-300'} />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{item.value}/{item.max}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Timeline */}
              <Card title="Transaction Timeline">
                <div className="space-y-0">
                  {selectedTxn.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-4 last:pb-0">
                      <div className="flex flex-col items-center">
                        {step.completed ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : (
                          <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300" />
                        )}
                        {idx < selectedTxn.timeline.length - 1 && (
                          <div className={`w-0.5 h-6 mt-1 ${step.completed ? 'bg-green-300' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${step.completed ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                          {step.stage}
                        </p>
                        {step.date && (
                          <p className="text-xs text-gray-400">{step.date}</p>
                        )}
                        {step.note && (
                          <p className="text-xs text-red-500 mt-0.5">{step.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <FileText className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Select a transaction to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
