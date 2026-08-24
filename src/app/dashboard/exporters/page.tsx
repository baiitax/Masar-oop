'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Truck, 
  MapPin, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Star,
  Package,
  Building2,
  Award
} from 'lucide-react';
import Card from '@/components/shared/Card';
import MetricCard from '@/components/shared/MetricCard';
import StatusBadge from '@/components/shared/StatusBadge';
import ProgressBar from '@/components/shared/ProgressBar';
import { exporters, Exporter } from '@/lib/data';

export default function ExportersPage() {
  const [selectedExporter, setSelectedExporter] = useState<Exporter | null>(null);

  const approvedExporters = exporters.filter(e => e.verificationStatus === 'APPROVED');
  const avgTrustScore = Math.round(exporters.reduce((sum, e) => sum + e.trustScore, 0) / exporters.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exporter Management</h1>
          <p className="text-gray-500 mt-1">Nigerian commodity exporters</p>
        </div>
        <button className="px-4 py-2 bg-masar-navy text-white rounded-lg text-sm font-medium hover:bg-masar-dark flex items-center gap-2">
          <Plus size={16} />
          Onboard Exporter
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Exporters" value={exporters.length} icon={Truck} iconColor="text-blue-600" />
        <MetricCard title="Verified" value={approvedExporters.length} icon={CheckCircle} iconColor="text-green-600" />
        <MetricCard title="Avg Trust Score" value={avgTrustScore} icon={Star} iconColor="text-masar-gold" subtitle="MASAR Exporter Trust Score" />
        <MetricCard title="Total Capacity" value="5,000 MT" icon={Package} iconColor="text-purple-600" subtitle="Available sesame" />
      </div>

      {/* Exporter List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {exporters.map((exporter) => (
            <div 
              key={exporter.id}
              onClick={() => setSelectedExporter(exporter)}
              className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                selectedExporter?.id === exporter.id ? 'border-masar-gold shadow-md' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Truck size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{exporter.tradingName}</h3>
                    <p className="text-sm text-gray-500">{exporter.legalName}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} /> {exporter.warehouses[0]}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Shield size={12} /> CAC: {exporter.cacNumber}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={exporter.verificationStatus} />
                  <div className="mt-2 flex items-center gap-1">
                    <Star size={14} className="text-masar-gold fill-masar-gold" />
                    <span className="text-sm font-bold text-gray-900">{exporter.trustScore}</span>
                    <span className="text-xs text-gray-400">/100</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Grade</p>
                  <p className="text-sm font-medium">{exporter.sesameGrade}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Available</p>
                  <p className="text-sm font-medium">{exporter.availableQuantity}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Moisture</p>
                  <p className="text-sm font-medium">{exporter.moisture}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Aflatoxin</p>
                  <p className="text-sm font-medium">{exporter.aflatoxinStatus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Exporter Detail */}
        <div className="lg:col-span-1">
          {selectedExporter ? (
            <div className="space-y-4 sticky top-6">
              <Card title="Exporter Profile">
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Truck size={32} className="text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{selectedExporter.tradingName}</h3>
                    <p className="text-sm text-gray-500">{selectedExporter.cacNumber}</p>
                    <StatusBadge status={selectedExporter.verificationStatus} size="md" />
                  </div>

                  {/* Trust Score */}
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                    <Award className="mx-auto text-masar-gold mb-2" size={28} />
                    <p className="text-3xl font-bold text-masar-navy">{selectedExporter.trustScore}</p>
                    <p className="text-sm text-gray-500">MASAR Exporter Trust Score</p>
                    <div className="mt-3 space-y-1">
                      {[
                        { label: 'Identity', score: selectedExporter.trustScore > 80 ? 15 : 10 },
                        { label: 'Export History', score: selectedExporter.trustScore > 80 ? 18 : 10 },
                        { label: 'Documentation', score: selectedExporter.trustScore > 80 ? 16 : 12 },
                        { label: 'Inspection', score: selectedExporter.trustScore > 80 ? 15 : 8 },
                        { label: 'Fulfilment', score: selectedExporter.trustScore > 80 ? 15 : 8 },
                        { label: 'Quality', score: selectedExporter.trustScore > 80 ? 14 : 7 },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-24">{item.label}</span>
                          <ProgressBar value={item.score} max={20} size="sm" color={item.score > 15 ? 'bg-green-500' : item.score > 10 ? 'bg-yellow-500' : 'bg-red-500'} />
                          <span className="text-xs font-medium w-6">{item.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Commodity Specs</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Grade</span>
                        <span className="text-sm font-medium">{selectedExporter.sesameGrade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Origin</span>
                        <span className="text-sm font-medium">{selectedExporter.sesameOrigin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Quantity</span>
                        <span className="text-sm font-medium">{selectedExporter.availableQuantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Harvest</span>
                        <span className="text-sm font-medium">{selectedExporter.harvestSeason}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Moisture</span>
                        <span className="text-sm font-medium">{selectedExporter.moisture}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Purity</span>
                        <span className="text-sm font-medium">{selectedExporter.purity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Foreign Matter</span>
                        <span className="text-sm font-medium">{selectedExporter.foreignMatter}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Aflatoxin</span>
                        <span className="text-sm font-medium text-green-600">{selectedExporter.aflatoxinStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Facilities</h4>
                    {selectedExporter.warehouses.map((w, idx) => (
                      <p key={idx} className="text-sm text-gray-700 flex items-center gap-1">
                        <Building2 size={12} /> {w}
                      </p>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Banking</h4>
                    <p className="text-sm text-gray-700">{selectedExporter.bankName}</p>
                    <p className="text-xs text-gray-400">Account: ****{selectedExporter.bankAccount.slice(-4)}</p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Truck className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Select an exporter to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
