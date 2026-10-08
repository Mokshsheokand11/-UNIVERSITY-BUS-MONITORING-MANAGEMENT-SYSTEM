import React, { useState } from 'react';
import { Bell, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Notice, NoticeCategory } from '../../types';

interface NoticeManagementPageProps {
  notices: Notice[];
  onAddNotice: (title: string, content: string, category: NoticeCategory) => void;
  onDeleteNotice: (id: number) => void;
}

export const NoticeManagementPage: React.FC<NoticeManagementPageProps> = ({
  notices,
  onAddNotice,
  onDeleteNotice,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('GENERAL');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Notice title and content are required.');
      return;
    }
    onAddNotice(title.trim(), content.trim(), category);
    setTitle('');
    setContent('');
    setCategory('GENERAL');
    setErrorMsg(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            University Transit Notice Board
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast transit announcements, route delays, maintenance alerts, and emergency notifications
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMsg(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Broadcast Notice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <StatusBadge status={notice.category} size="sm" />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this announcement?')) {
                        onDeleteNotice(notice.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{notice.title}</h3>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{notice.content}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
              <span>Author: {notice.publishedBy}</span>
              <span className="font-mono text-[10px]">Notice ID: #{notice.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Broadcast Notice */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Broadcast University Notice">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Notice Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Special Exam Schedule Bus Timing"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoticeCategory)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="GENERAL">GENERAL</option>
              <option value="ROUTE_CHANGE">ROUTE CHANGE</option>
              <option value="DELAY">DELAY</option>
              <option value="EMERGENCY">EMERGENCY</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Announcement Message
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full details of this circular for students and drivers..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
            >
              Publish Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
