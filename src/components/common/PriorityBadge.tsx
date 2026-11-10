import React from 'react';
import { PriorityLevel } from '../../types';

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getConfig = (p: PriorityLevel) => {
    switch (p) {
      case 'Urgent':
        return {
          text: 'text-rose-700',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          indicator: 'bg-rose-500',
        };
      case 'High':
        return {
          text: 'text-amber-700',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          indicator: 'bg-amber-500',
        };
      case 'Medium':
        return {
          text: 'text-slate-800',
          bg: 'bg-slate-100',
          border: 'border-slate-300',
          indicator: 'bg-slate-600',
        };
      case 'Low':
      default:
        return {
          text: 'text-slate-600',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          indicator: 'bg-slate-400',
        };
    }
  };

  const c = getConfig(priority);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${c.bg} ${c.text} ${c.border} whitespace-nowrap shrink-0`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.indicator}`} />
      <span>{priority}</span>
    </span>
  );
};
