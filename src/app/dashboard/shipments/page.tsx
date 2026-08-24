'use client';

import React, { useState } from 'react';
import { 
  Ship, 
  MapPin, 
  Calendar, 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Anchor,
  Navigation,
  Truck,
  Globe,
  ArrowRight
} from 'lucide-react';
import Card from '@/components/shared/Card';
import StatusBadge from '@/components/shared/StatusBadge';
import { shipments, Shipment, getTransactionById, transactions } from '@/lib/data';

export default function ShipmentsPage() {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const shipmentStatuses = ['BOOKED', 'LOADED', 'DEPARTED', 'IN_TRANSIT', 'ARRIVED', 'PORT_INSPECTION', 'CLEARED', 'RELEASE'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipment Control</h1>
          <p className="text-gray-500 mt-1">Monitor and manage shipments</p>
        </div>
      </div>

      {/* Corridor Visualization */}
      <Card title="Active Corridor — Nigeria → Saudi Arabia">
        <div className="relative bg-gradient-to-r from-green-50 via-blue-50 to-yellow-50 rounded-xl p-8">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🇳🇬</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Apapa Port</h4>
              <p className="text-xs text-gray-500">Lagos, Nigeria</p>
            </div>

            <div className="flex-1 mx-6 relative">
              <div className="h-2 bg-gradient-to-r from-green-400 via-blue-400 to-yellow-400 rounded-full" />
              <div className="absolute top-1/2 left-[65%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Ship size={18} className="text-masar-blue" />
                </div>
              </div>
              <div className="absolute -bottom-6 left-0 text-xs text-gray-500">Aug 18</div>
              <div className="absolute -bottom-6 right-0 text-xs text-gray-500">Sep 05</div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-600">In Transit</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🇸🇦</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Jeddah Port</h4>
              <p className="text-xs text-gray-500">Saudi Arabia</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Shipment List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {shipments.map((ship) => {
            const txn = getTransactionById(ship.transactionId);
            return (
              <div 
                key={ship.id}
                onClick={() => setSelectedShipment(ship)}
                className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                  selectedShipment?.id === ship.id ? 'border-masar-gold shadow-md' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Ship size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{txn?.masarId}</h3>
                      <p className="text-sm text-gray-500">{ship.vessel} • {ship.containerNumber}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={12} /> {ship.portOfOrigin}
                        </span>
                        <ArrowRight size={12} className="text-gray-300" />
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={12} /> {ship.destination}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={ship.status} size="md" />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Container</p>
                    <p className="text-sm font-medium">{ship.containerNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">ETD</p>
                    <p className="text-sm font-medium">{ship.etd}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">ETA</p>
                    <p className="text-sm font-medium">{ship.eta}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Customs</p>
                    <StatusBadge status={ship.customsStatus} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Additional Shipment Cards for Demo */}
          {transactions.filter(t => t.status === 'IN_TRANSIT' || t.status === 'SHIPMENT_RELEASED').length > shipments.length && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Package size={24} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">MASAR-SES-2026-000002</h3>
                  <p className="text-sm text-gray-500">Awaiting shipment — Inspection pending</p>
                  <div className="mt-2">
                    <StatusBadge status="PRE_SHIPMENT" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shipment Detail */}
        <div className="lg:col-span-1">
          {selectedShipment ? (
            <div className="space-y-4 sticky top-6">
              <Card title="Shipment Details">
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Ship size={32} className="text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{selectedShipment.containerNumber}</h3>
                    <p className="text-sm text-gray-500">{selectedShipment.vessel}</p>
                    <StatusBadge status={selectedShipment.status} size="md" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Package size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Container</p>
                        <p className="text-sm font-medium">{selectedShipment.containerNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Ship size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Vessel</p>
                        <p className="text-sm font-medium">{selectedShipment.vessel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Navigation size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Booking</p>
                        <p className="text-sm font-medium">{selectedShipment.booking}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">ETD / ETA</p>
                        <p className="text-sm font-medium">{selectedShipment.etd} → {selectedShipment.eta}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Timeline */}
                  <div className="pt-4 border-t">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Shipment Timeline</h4>
                    <div className="space-y-0">
                      {shipmentStatuses.map((status, idx) => {
                        const currentIdx = shipmentStatuses.indexOf(selectedShipment.status);
                        const isCompleted = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        return (
                          <div key={status} className="flex items-start gap-3 pb-3 last:pb-0">
                            <div className="flex flex-col items-center">
                              {isCompleted ? (
                                <CheckCircle size={16} className="text-green-500" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                              )}
                              {idx < shipmentStatuses.length - 1 && (
                                <div className={`w-0.5 h-4 mt-0.5 ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`} />
                              )}
                            </div>
                            <p className={`text-xs ${isCurrent ? 'font-semibold text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                              {status.replace(/_/g, ' ')}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Ship className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Select a shipment to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
