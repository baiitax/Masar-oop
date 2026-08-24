'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign,
  Users,
  Truck,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Star
} from 'lucide-react';
import Card from '@/components/shared/Card';
import StatusBadge from '@/components/shared/StatusBadge';
import { transactions, buyers, exporters, getBuyerById, getExporterById, formatCurrency } from '@/lib/data';

interface RFQ {
  id: string;
  masarId: string;
  buyerId: string;
  commodity: string;
  origin: string;
  quantity: string;
  quality: string;
  delivery: string;
  incoterm: string;
  paymentStructure: string;
  inspection: string;
  status: string;
  createdAt: string;
  matchedExporters: string[];
}

const rfqs: RFQ[] = [
  {
    id: 'rfq-001',
    masarId: 'RFQ-2026-001',
    buyerId: 'buyer-001',
    commodity: 'Premium Hulled Sesame',
    origin: 'Nigeria',
    quantity: '1,000 MT',
    quality: 'Contract specification: <2% moisture, >99% purity, <1% foreign matter, <10 ppb aflatoxin',
    delivery: 'Saudi Arabia',
    incoterm: 'CIF Jeddah',
    paymentStructure: 'Escrow',
    inspection: 'Independent (SGS/Bureau Veritas)',
    status: 'MATCHED',
    createdAt: '2026-07-10',
    matchedExporters: ['exp-001'],
  },
  {
    id: 'rfq-002',
    masarId: 'RFQ-2026-002',
    buyerId: 'buyer-002',
    commodity: 'Premium Hulled Sesame',
    origin: 'Nigeria',
    quantity: '500 MT',
    quality: 'Standard grade, <3% moisture',
    delivery: 'Dammam, Saudi Arabia',
    incoterm: 'CIF Dammam',
    paymentStructure: 'Escrow',
    inspection: 'Independent',
    status: 'MATCHED',
    createdAt: '2026-08-06',
    matchedExporters: ['exp-001'],
  },
  {
    id: 'rfq-003',
    masarId: 'RFQ-2026-003',
    buyerId: 'buyer-001',
    commodity: 'Standard Natural Sesame',
    origin: 'Nigeria',
    quantity: '750 MT',
    quality: 'Standard grade, <3% moisture, >98% purity',
    delivery: 'Riyadh, Saudi Arabia',
    incoterm: 'CFR Riyadh',
    paymentStructure: 'Escrow',
    inspection: 'Independent',
    status: 'MATCHED',
    createdAt: '2026-08-15',
    matchedExporters: ['exp-002'],
  },
];

export default function RFQPage() {
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [showCreateRFQ, setShowCreateRFQ] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFQ & Deal Room</h1>
          <p className="text-gray-500 mt-1">Controlled transaction room — not a public marketplace</p>
        </div>
        <button 
          onClick={() => setShowCreateRFQ(true)}
          className="px-4 py-2 bg-masar-navy text-white rounded-lg text-sm font-medium hover:bg-masar-dark flex items-center gap-2"
        >
          <Plus size={16} />
          Create RFQ
        </button>
      </div>

      {/* RFQ Process */}
      <Card title="RFQ Process">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          {['Buyer RFQ', 'MASAR Review', 'Exporter Match', 'Commercial Terms', 'Deal Room', 'Contract'].map((step, idx) => (
            <React.Fragment key={step}>
              <div className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  idx < 4 ? 'bg-green-500 text-white' : idx === 4 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {idx < 4 ? '✓' : idx + 1}
                </div>
                <p className="text-xs mt-1 text-gray-600">{step}</p>
              </div>
              {idx < 5 && <div className={`flex-1 h-0.5 mx-1 ${idx < 4 ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* RFQ List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {rfqs.map((rfq) => {
            const buyer = getBuyerById(rfq.buyerId);
            return (
              <div 
                key={rfq.id}
                onClick={() => setSelectedRFQ(rfq)}
                className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                  selectedRFQ?.id === rfq.id ? 'border-masar-gold shadow-md' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900">{rfq.masarId}</h3>
                      <StatusBadge status={rfq.status} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{buyer?.tradingName}</p>
                  </div>
                  <span className="text-xs text-gray-400">{rfq.createdAt}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Commodity</p>
                    <p className="text-sm font-medium">{rfq.commodity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Quantity</p>
                    <p className="text-sm font-medium">{rfq.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Incoterm</p>
                    <p className="text-sm font-medium">{rfq.incoterm}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Matched</p>
                    <p className="text-sm font-medium text-green-600">{rfq.matchedExporters.length} exporter(s)</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RFQ Detail */}
        <div className="lg:col-span-1">
          {selectedRFQ ? (
            <div className="space-y-4 sticky top-6">
              <Card title="RFQ Details">
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare size={32} className="text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{selectedRFQ.masarId}</h3>
                    <StatusBadge status={selectedRFQ.status} size="md" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Buyer</p>
                        <p className="text-sm font-medium">{getBuyerById(selectedRFQ.buyerId)?.tradingName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Package size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Commodity</p>
                        <p className="text-sm font-medium">{selectedRFQ.commodity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Origin → Destination</p>
                        <p className="text-sm font-medium">{selectedRFQ.origin} → {selectedRFQ.delivery}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <DollarSign size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Payment Structure</p>
                        <p className="text-sm font-medium">{selectedRFQ.paymentStructure}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Quality Specification</h4>
                    <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">{selectedRFQ.quality}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Matched Exporters</h4>
                    {selectedRFQ.matchedExporters.map((expId) => {
                      const exp = getExporterById(expId);
                      return exp ? (
                        <div key={expId} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <Truck size={16} className="text-green-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{exp.tradingName}</p>
                            <p className="text-xs text-gray-500">{exp.sesameGrade} • {exp.availableQuantity}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-masar-gold fill-masar-gold" />
                            <span className="text-sm font-bold">{exp.trustScore}</span>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Inspection Requirement</h4>
                    <p className="text-sm text-gray-700">{selectedRFQ.inspection}</p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <MessageSquare className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Select an RFQ to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Create RFQ Modal */}
      {showCreateRFQ && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create RFQ</h2>
                <button onClick={() => setShowCreateRFQ(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Request for Quotation — Controlled Transaction Room</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commodity</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>Premium Hulled Sesame</option>
                    <option>Standard Natural Sesame</option>
                    <option>Cashew</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>Nigeria</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g., 1,000 MT" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>Saudi Arabia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incoterm</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>CIF</option>
                    <option>CFR</option>
                    <option>FOB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Structure</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>Escrow</option>
                    <option>LC</option>
                    <option>Advance Payment</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality Specification</label>
                <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" rows={3} placeholder="Detailed quality requirements..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={() => setShowCreateRFQ(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-masar-navy text-white rounded-lg text-sm font-medium hover:bg-masar-dark">
                  Submit RFQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
