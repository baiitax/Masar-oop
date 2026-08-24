'use client';

import React, { useState } from 'react';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  FileText,
  Shield,
  Hash,
  Calendar,
  Building2
} from 'lucide-react';
import Card from '@/components/shared/Card';
import StatusBadge from '@/components/shared/StatusBadge';
import { documents, Document, getTransactionById, formatStatus } from '@/lib/data';

export default function DocumentsPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const filteredDocs = filterStatus === 'all' 
    ? documents 
    : documents.filter(d => d.verificationStatus.toLowerCase() === filterStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle size={16} className="text-green-500" />;
      case 'UNDER REVIEW': return <Clock size={16} className="text-yellow-500" />;
      case 'REJECTED': return <XCircle size={16} className="text-red-500" />;
      case 'EXPIRED': return <AlertTriangle size={16} className="text-orange-500" />;
      default: return <FileText size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Vault</h1>
          <p className="text-gray-500 mt-1">Secure transaction document repository</p>
        </div>
        <button className="px-4 py-2 bg-masar-navy text-white rounded-lg text-sm font-medium hover:bg-masar-dark flex items-center gap-2">
          <Upload size={16} />
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              <p className="text-xs text-gray-500">Total Documents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{documents.filter(d => d.verificationStatus === 'VERIFIED').length}</p>
              <p className="text-xs text-gray-500">Verified</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{documents.filter(d => d.verificationStatus === 'UNDER REVIEW').length}</p>
              <p className="text-xs text-gray-500">Under Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">100%</p>
              <p className="text-xs text-gray-500">Hash Coverage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {['all', 'verified', 'under review', 'rejected', 'expired'].map((filter) => (
          <button
            key={filter}
            onClick={() => setFilterStatus(filter)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === filter 
                ? 'bg-masar-navy text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {filter === 'all' ? 'All' : formatStatus(filter)}
          </button>
        ))}
      </div>

      {/* Document List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card noPadding>
            <div className="divide-y divide-gray-100">
              {filteredDocs.map((doc) => {
                const txn = getTransactionById(doc.transactionId);
                return (
                  <div 
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedDoc?.id === doc.id ? 'bg-masar-gold/5 border-l-4 border-l-masar-gold' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileText size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{doc.type}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{doc.issuingOrganization}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-400">#{doc.documentNumber}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">{txn?.masarId}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.verificationStatus)}
                        <StatusBadge status={doc.verificationStatus} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Document Detail */}
        <div className="lg:col-span-1">
          {selectedDoc ? (
            <div className="space-y-4 sticky top-6">
              <Card title="Document Details">
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText size={32} className="text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{selectedDoc.type}</h3>
                    <p className="text-sm text-gray-500">{selectedDoc.documentNumber}</p>
                    <StatusBadge status={selectedDoc.verificationStatus} size="md" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Building2 size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Issuing Organization</p>
                        <p className="text-sm font-medium">{selectedDoc.issuingOrganization}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Issue Date</p>
                        <p className="text-sm font-medium">{selectedDoc.issueDate}</p>
                      </div>
                    </div>
                    {selectedDoc.expiryDate && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Expiry Date</p>
                          <p className="text-sm font-medium">{selectedDoc.expiryDate}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Shield size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Verification</p>
                        <p className="text-sm font-medium">{selectedDoc.verifier || 'Pending'}</p>
                        {selectedDoc.verificationDate && (
                          <p className="text-xs text-gray-400">{selectedDoc.verificationDate}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Hash size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Document Hash</p>
                        <p className="text-xs font-mono text-gray-600 break-all">{selectedDoc.hash}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Version</p>
                        <p className="text-sm font-medium">v{selectedDoc.version}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <button className="flex-1 px-3 py-2 bg-masar-navy text-white rounded-lg text-sm font-medium hover:bg-masar-dark flex items-center justify-center gap-2">
                      <Eye size={14} />
                      View
                    </button>
                    <button className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <FolderOpen className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Select a document to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
