'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const getStatusStyle = (s: string) => {
    const lower = s.toLowerCase();
    if (lower.includes('completed') || lower.includes('approved') || lower.includes('verified') || lower.includes('pass') || lower.includes('ready') || lower.includes('active') || lower.includes('settled')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (lower.includes('progress') || lower.includes('pending') || lower.includes('scheduled') || lower.includes('review') || lower.includes('conditional') || lower.includes('transit') || lower.includes('funded')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    if (lower.includes('fail') || lower.includes('reject') || lower.includes('critical') || lower.includes('cancel') || lower.includes('exception') || lower.includes('dispute')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (lower.includes('warning') || lower.includes('risk') || lower.includes('restricted')) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${getStatusStyle(status)} ${sizeClasses}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
