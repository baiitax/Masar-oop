'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Building2, 
  MapPin, 
  Globe, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  TrendingUp,
  FileText,
  ChevronRight
} from 'lucide-react';
import Card from '@/components/shared/Card';
import MetricCard from '@/components/shared/MetricCard';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';
import { buyers, Buyer, formatCurrency } from '@/lib/data';

export default function BuyersPage() {
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const approvedBuyers = buyers.filter(b => b.verificationStatus === 'APPROVED');
  const pendingBuyers = buyers.filter(b => b.verificationStatus !== 'APPROVED' && b.verificationStatus !== 'REJECTED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buyer Management</h1>
          <p className="text-gray-500 mt-1">Saudi commercial food/agro buyers</p>
        </div>
        <button 
          onClick={() => setShowOnboarding(true)}
          className="px-4 py-2 bg-masar-navy text-white rounded-lg text-sm font-medium hover:bg-masar-dark flex items-center gap-2"
        >
          <Plus size={16} />
          Onboard Buyer
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Buyers" value={buyers.length} icon={Users} iconColor="text-blue-600" />
        <MetricCard title="Verified" value={approvedBuyers.length} icon={CheckCircle} iconColor="text-green-600" change="All KYB complete" changeType="positive" />
        <MetricCard title="Pending Review" value={pendingBuyers.length} icon={Clock} iconColor="text-yellow-600" />
        <MetricCard title="Total Capacity" value="$42M/yr" icon={TrendingUp} iconColor="text-masar-gold" subtitle="Combined procurement" />
      </div>

      {/* Buyer List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {buyers.map((buyer) => (
            <div 
              key={buyer.id}
              onClick={() => setSelectedBuyer(buyer)}
              className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                selectedBuyer?.id === buyer.id ? 'border-masar-gold shadow-md' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{buyer.tradingName}</h3>
                    <p className="text-sm text-gray-500">{buyer.legalName}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} /> {buyer.city}, Saudi Arabia
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Globe size={12} /> {buyer.website}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={buyer.verificationStatus} />
                  {buyer.riskScore > 0 && (
                    <p className="text-xs text-gray-400 mt-2">Risk Score: <span className="font-semibold text-green-600">{buyer.riskScore}</span></p>
                  )}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Category</p>
                  <p className="text-sm font-medium">{buyer.buyerCategory}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Annual Volume</p>
                  <p className="text-sm font-medium">{buyer.annualProcurementVolume}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Commodities</p>
                  <p className="text-sm font-medium">{buyer.commodities.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buyer Detail */}
        <div className="lg:col-span-1">
          {selectedBuyer ? (
            <div className="space-y-4 sticky top-6">
              <Card title="Buyer Profile">
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building2 size={32} className="text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{selectedBuyer.tradingName}</h3>
                    <p className="text-sm text-gray-500">{selectedBuyer.saudiRegistration}</p>
                    <StatusBadge status={selectedBuyer.verificationStatus} size="md" />
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Company Info</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Industry</span>
                        <span className="text-sm font-medium">{selectedBuyer.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Credit Profile</span>
                        <span className="text-sm font-medium text-green-600">{selectedBuyer.creditProfile}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Purchasing Capacity</span>
                        <span className="text-sm font-medium">{selectedBuyer.estimatedPurchasingCapacity}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Directors</h4>
                    {selectedBuyer.directors.map((d, idx) => (
                      <div key={idx} className="flex items-center gap-2 py-1.5">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">{d.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{d.name}</p>
                          <p className="text-xs text-gray-400">{d.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Procurement</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Volume</span>
                        <span className="text-sm font-medium">{selectedBuyer.requiredVolume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Incoterms</span>
                        <span className="text-sm font-medium">{selectedBuyer.incoterms.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Payment</span>
                        <span className="text-sm font-medium">{selectedBuyer.paymentTerms}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Bank References</h4>
                    {selectedBuyer.bankReferences.map((bank, idx) => (
                      <p key={idx} className="text-sm text-gray-700">{bank}</p>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Select a buyer to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Buyer Onboarding</h2>
                <button onClick={() => setShowOnboarding(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <p className="text-sm text-gray-500 mt-1">KYB verification workflow</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Verification Steps */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Verification Status</h3>
                {['APPLICATION', 'PENDING DOCUMENTS', 'KYB REVIEW', 'UBO REVIEW', 'SANCTIONS SCREENING', 'COMMERCIAL REVIEW', 'APPROVED'].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx < 3 ? 'bg-green-500 text-white' : idx === 3 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {idx < 3 ? '✓' : idx + 1}
                    </div>
                    <span className={`text-sm ${idx < 3 ? 'font-medium text-gray-900' : idx === 3 ? 'font-medium text-yellow-700' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Company Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Legal Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Company legal name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trading Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Trading name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Saudi Registration (CR)</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="CR Number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                      <option>Riyadh</option>
                      <option>Jeddah</option>
                      <option>Dammam</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={2} placeholder="Full address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                      <option>Food Processing</option>
                      <option>Commodity Trading</option>
                      <option>Food Distribution</option>
                      <option>Manufacturing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Procurement Volume</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="$" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={() => setShowOnboarding(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-masar-navy text-white rounded-lg text-sm font-medium hover:bg-masar-dark">
                  Submit for KYB Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
