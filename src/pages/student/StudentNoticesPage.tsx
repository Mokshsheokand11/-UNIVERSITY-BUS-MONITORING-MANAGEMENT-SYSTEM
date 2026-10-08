import React, { useState } from 'react';
import { Bell, Calendar, UserCheck, Tag } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Notice, NoticeCategory } from '../../types';

interface StudentNoticesPageProps {
  notices: Notice[];
}

export const StudentNoticesPage: React.FC<StudentNoticesPageProps> = ({ notices }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredNotices = notices.filter(
    (n) => selectedCategory === 'ALL' || n.category === selectedCategory
  );

  const categories: { label: string; value: string }[] = [
    { label: 'All Notices', value: 'ALL' },
    { label: 'General', value: 'GENERAL' },
    { label: 'Route Changes', value: 'ROUTE_CHANGE' },
    { label: 'Delays', value: 'DELAY' },
    { label: 'Emergency', value: 'EMERGENCY' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            University Transit Notices & Circulars
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official alerts, route changes, delay notifications, and schedule adjustments
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <StatusBadge status={notice.category as NoticeCategory} size="sm" />
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(notice.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{notice.title}</h3>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{notice.content}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                {notice.publishedBy}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono">
                <Tag className="w-3 h-3" />
                Ref: #{notice.id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
