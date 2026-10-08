import React from 'react';
import { BusStatus, NoticeCategory, TripStatus } from '../../types';

interface StatusBadgeProps {
  status: BusStatus | TripStatus | NoticeCategory | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'ACTIVE':
    case 'ON_ROUTE':
    case 'COMPLETED':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'SCHEDULED':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'DELAYED':
    case 'ROUTE_CHANGE':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'MAINTENANCE':
    case 'CANCELLED':
    case 'EMERGENCY':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'INACTIVE':
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
      break;
    default:
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  const formattedText = status.replace('_', ' ');

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${colorClasses} tracking-wide uppercase font-mono text-[10px]`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {formattedText}
    </span>
  );
};
