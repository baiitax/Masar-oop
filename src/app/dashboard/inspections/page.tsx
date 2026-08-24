'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Calendar,
  User,
  FileText,
  Beaker,
  Package,
  Truck
} from 'lucide-react';
import Card from '@/components/shared/Card';
import StatusBadge from '@/components/shared/StatusBadge';
import { inspections, Inspection, getTransactionById, transactions } from '@/lib/data';

export default function InspectionsPage() {
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

  const scheduledInspections = inspections.filter(i => i.status === 'SCHEDULED');
  const completedInspections = inspections.filter(i => i.status === 'COMPLETED');
  const passedInspections = inspections.filter(i => i.result === 'PASS');
  const failedInspections = inspections.filter(i => i.result === 'FAIL');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspection Control</h1>
          <p className="text-gray-500 mt-1">Independent inspection orchestration</p>
        </div>
        <button className="px-4 py-2 bg-masar-navy text-white rounded-lg text-sm font-medium hover:bg-masar-dark flex items-center gap-2">
          <Plus size={16} />
          Schedule Inspection
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{inspections.length}</p>
              <p className="text-xs text-gray-500">Total Inspections</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{scheduledInspections.length}</p>
              <p className="text-xs text-gray-500">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{passedInspections.length}</p>
              <p className="text-xs text-gray-500">Passed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{failedInspections.length}</p>
              <p className="text-xs text-gray-500">Failed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Workflow */}
      <Card title="Inspection Workflow">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          {['Request', 'Assign', 'Schedule', 'Sample', 'Testing', 'Report', 'Validate', 'Decision'].map((step, idx) => (
            <React.Fragment key={step}>
              <div className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  idx < 5 ? 'bg-green-500 text-white' : idx === 5 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {idx < 5 ? '✓' : idx + 1}
                </div>
                <p className="text-xs mt-1 text-gray-600">{step}</p>
              </div>
              {idx < 7 && <div className={`flex-1 h-0.5 mx-1 ${idx < 5 ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Inspection List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {inspections.map((insp) => {
            const txn = getTransactionById(insp.transactionId);
            return (
              <div 
                key={insp.id}
                onClick={() => setSelectedInspection(insp)}
                className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                  selectedInspection?.id === insp.id ? 'border-masar-gold shadow-md' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      insp.result === 'PASS' ? 'bg-green-100' :
                      insp.result === 'FAIL' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <Beaker size={24} className={
                        insp.result === 'PASS' ? 'text-green-600' :
                        insp.result === 'FAIL' ? 'text-red-600' : 'text-yellow-600'
                      } />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{txn?.masarId}</h3>
                      <p className="text-sm text-gray-500">{insp.inspectorName}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar size={12} /> {insp.scheduledDate}
                        </span>
                        {insp.completedDate && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <CheckCircle size={12} /> {insp.completedDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={insp.status} />
                    {insp.result && (
                      <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        insp.result === 'PASS' ? 'bg-green-100 text-green-800' :
                        insp.result === 'FAIL' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {insp.result}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inspection Detail */}
        <div className="lg:col-span-1">
          {selectedInspection ? (
            <div className="space-y-4 sticky top-6">
              <Card title="Inspection Report">
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      selectedInspection.result === 'PASS' ? 'bg-green-100' :
                      selectedInspection.result === 'FAIL' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <Beaker size={32} className={
                        selectedInspection.result === 'PASS' ? 'text-green-600' :
                        selectedInspection.result === 'FAIL' ? 'text-red-600' : 'text-yellow-600'
                      } />
                    </div>
                    <h3 className="font-semibold text-gray-900">{getTransactionById(selectedInspection.transactionId)?.masarId}</h3>
                    <p className="text-sm text-gray-500">{selectedInspection.inspectorName}</p>
                    {selectedInspection.result && (
                      <div className={`mt-2 inline-flex items-center px-4 py-1.5 rounded-full text-lg font-bold ${
                        selectedInspection.result === 'PASS' ? 'bg-green-100 text-green-800' :
                        selectedInspection.result === 'FAIL' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedInspection.result}
                      </div>
                    )}
                  </div>

                  {/* Test Results */}
                  {selectedInspection.testResults && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Test Results</h4>
                      <div className="space-y-2">
                        {selectedInspection.testResults.map((test, idx) => (
                          <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${
                            test.status === 'PASS' ? 'bg-green-50' : 'bg-red-50'
                          }`}>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{test.parameter}</p>
                              <p className="text-xs text-gray-500">Threshold: {test.threshold}</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-semibold ${test.status === 'PASS' ? 'text-green-700' : 'text-red-700'}`}>
                                {test.value}
                              </p>
                              <StatusBadge status={test.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedInspection.notes && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Inspector Notes</h4>
                      <div className={`p-3 rounded-lg ${
                        selectedInspection.result === 'FAIL' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                      }`}>
                        <p className="text-sm text-gray-700">{selectedInspection.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Decision */}
                  {selectedInspection.result && (
                    <div className="pt-4 border-t">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Final Decision</h4>
                      <p className="text-sm text-gray-500">
                        The inspector—not MASAR—owns the independent technical determination.
                      </p>
                      <div className={`mt-2 p-3 rounded-lg text-center font-bold text-lg ${
                        selectedInspection.result === 'PASS' ? 'bg-green-100 text-green-800' :
                        selectedInspection.result === 'FAIL' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedInspection.result === 'PASS' ? '✓ RECOMMENDED FOR RELEASE' :
                         selectedInspection.result === 'FAIL' ? '✕ RELEASE BLOCKED' : '⚠ CONDITIONAL'}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Beaker className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Select an inspection to view report</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
