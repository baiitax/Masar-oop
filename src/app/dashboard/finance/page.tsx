'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Building2,
  FileText,
  Percent,
  Calendar,
  Shield,
  BarChart3
} from 'lucide-react';
import Card from '@/components/shared/Card';
import MetricCard from '@/components/shared/MetricCard';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';
import { financeRequests, FinanceRequest, getTransactionById, formatCurrency, transactions } from '@/lib/data';

export default function FinancePage() {
  const [selectedRequest, setSelectedRequest] = useState<FinanceRequest | null>(null);

  const totalFinanced = financeRequests.filter(f => f.status === 'APPROVED').reduce((sum, f) => sum + f.requestedAmount, 0);
  const pendingRequests = financeRequests.filter(f => f.status === 'PENDING');
  const approvedRequests = financeRequests.filter(f => f.status === 'APPROVED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Workspace</h1>
          <p className="text-gray-500 mt-1">Trade finance orchestration</p>
        </div>
        <button className="px-4 py-2 bg-masar-navy text-white rounded-lg text-sm font-medium hover:bg-masar-dark flex items-center gap-2">
          <FileText size={16} />
          New Finance Request
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Financed" value={formatCurrency(totalFinanced)} icon={DollarSign} iconColor="text-green-600" change="2 facilities active" changeType="positive" />
        <MetricCard title="Pending Requests" value={pendingRequests.length} icon={Clock} iconColor="text-yellow-600" />
        <MetricCard title="Approved" value={approvedRequests.length} icon={CheckCircle} iconColor="text-green-600" />
        <MetricCard title="Capital Partners" value="1" icon={Building2} iconColor="text-blue-600" subtitle="Afreximbank" />
      </div>

      {/* Finance Partner Dashboard */}
      <Card title="Capital Partner Dashboard — Afreximbank">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Exposure */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Exposure</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Financed</span>
                <span className="text-sm font-semibold">{formatCurrency(totalFinanced)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Outstanding</span>
                <span className="text-sm font-semibold">{formatCurrency(totalFinanced)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Upcoming Repayments</span>
                <span className="text-sm font-semibold">{formatCurrency(1480000)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Buyer Concentration</span>
                <span className="text-sm font-semibold">Al Rajhi: 100%</span>
              </div>
            </div>
          </div>

          {/* Risk */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Risk Profile</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">Transaction Score</span>
                <span className="text-sm font-semibold text-green-600">94/100</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">Inspection Status</span>
                <StatusBadge status="PASSED" />
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">Compliance Status</span>
                <StatusBadge status="COMPLETE" />
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">Insurance</span>
                <StatusBadge status="ACTIVE" />
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Portfolio</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Active Facilities</span>
                <span className="text-sm font-semibold">2</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Repayment Status</span>
                <span className="text-sm font-semibold text-green-600">Current</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Defaults</span>
                <span className="text-sm font-semibold text-green-600">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Losses</span>
                <span className="text-sm font-semibold text-green-600">$0</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Finance Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {financeRequests.map((req) => {
            const txn = getTransactionById(req.transactionId);
            return (
              <div 
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                  selectedRequest?.id === req.id ? 'border-masar-gold shadow-md' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{txn?.masarId}</h3>
                    <p className="text-sm text-gray-500">{txn?.commodity} • {txn?.quantity}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">Partner: {req.capitalPartner}</span>
                      <span className="text-xs text-gray-500">Submitted: {req.submittedDate}</span>
                    </div>
                  </div>
                  <StatusBadge status={req.status} size="md" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Invoice Value</p>
                    <p className="text-sm font-semibold">{formatCurrency(req.invoiceValue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Advance Rate</p>
                    <p className="text-sm font-semibold">{req.requestedAdvance}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Requested Amount</p>
                    <p className="text-sm font-semibold text-masar-navy">{formatCurrency(req.requestedAmount)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Finance Detail */}
        <div className="lg:col-span-1">
          {selectedRequest ? (
            <div className="space-y-4 sticky top-6">
              <Card title="Finance Request Details">
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <DollarSign size={32} className="text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{getTransactionById(selectedRequest.transactionId)?.masarId}</h3>
                    <StatusBadge status={selectedRequest.status} size="md" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Invoice Value</p>
                        <p className="text-lg font-bold">{formatCurrency(selectedRequest.invoiceValue)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Percent size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Advance Rate</p>
                        <p className="text-lg font-bold">{selectedRequest.requestedAdvance}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-masar-navy rounded-lg">
                      <DollarSign size={16} className="text-masar-gold" />
                      <div>
                        <p className="text-xs text-gray-300">Requested Amount</p>
                        <p className="text-lg font-bold text-white">{formatCurrency(selectedRequest.requestedAmount)}</p>
                      </div>
                    </div>
                    {selectedRequest.interestRate && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <TrendingUp size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Interest Rate</p>
                          <p className="text-lg font-bold">{selectedRequest.interestRate}%</p>
                        </div>
                      </div>
                    )}
                    {selectedRequest.tenor && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Tenor</p>
                          <p className="text-lg font-bold">{selectedRequest.tenor} days</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Building2 size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Capital Partner</p>
                        <p className="text-sm font-medium">{selectedRequest.capitalPartner}</p>
                      </div>
                    </div>
                  </div>

                  {/* Structured Package */}
                  <div className="pt-4 border-t">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Structured Financing Package</h4>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        Capital partner receives a structured financing package including invoice, contract, 
                        buyer verification, shipment details, and inspection status.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <DollarSign className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Select a finance request to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
