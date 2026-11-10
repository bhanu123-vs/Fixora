import React from 'react';
import { ComplaintStatus } from '../../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStatusConfig = (st: ComplaintStatus) => {
    switch (st) {
      case 'Submitted':
        return {
          textColor: 'text-slate-700',
          bgColor: 'bg-slate-100',
          dotColor: 'bg-slate-500',
          label: 'Submitted',
        };
      case 'Under Review':
        return {
          textColor: 'text-amber-800',
          bgColor: 'bg-amber-50',
          dotColor: 'bg-amber-500',
          label: 'Under Review',
        };
      case 'Assigned':
        return {
          textColor: 'text-indigo-800',
          bgColor: 'bg-indigo-50',
          dotColor: 'bg-indigo-500',
          label: 'Assigned',
        };
      case 'In Progress':
        return {
          textColor: 'text-red-800',
          bgColor: 'bg-red-50',
          dotColor: 'bg-red-600',
          label: 'In Progress',
        };
      case 'Resolved':
        return {
          textColor: 'text-emerald-800',
          bgColor: 'bg-emerald-50',
          dotColor: 'bg-emerald-600',
          label: 'Resolved',
        };
      case 'Reopened':
        return {
          textColor: 'text-rose-800',
          bgColor: 'bg-rose-50',
          dotColor: 'bg-rose-600',
          label: 'Reopened',
        };
      default:
        return {
          textColor: 'text-slate-700',
          bgColor: 'bg-slate-100',
          dotColor: 'bg-slate-400',
          label: st,
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md ${config.bgColor} ${config.textColor} ${sizeClasses} whitespace-nowrap shrink-0`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
};
