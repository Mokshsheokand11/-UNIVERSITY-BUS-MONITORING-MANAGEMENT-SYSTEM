import React, { useState } from 'react';
import { Users, Search, CheckCircle, XCircle, GraduationCap } from 'lucide-react';
import { StudentProfile, User } from '../../types';

interface StudentManagementPageProps {
  students: StudentProfile[];
  users: User[];
  onToggleStudentStatus: (userId: number) => void;
}

export const StudentManagementPage: React.FC<StudentManagementPageProps> = ({
  students,
  users,
  onToggleStudentStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = students.filter((s) => {
    const u = users.find((user) => user.id === s.userId);
    const q = searchQuery.toLowerCase();
    return (
      s.rollNumber.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      (u?.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u?.email && u.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Student Account Administration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View registered students, search by roll numbers, and manage transport eligibility
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or roll no..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Department & Semester</th>
                <th className="py-3 px-4">Email / Phone</th>
                <th className="py-3 px-4">Transport Pass Status</th>
                <th className="py-3 px-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((student) => {
                const user = users.find((u) => u.id === student.userId);
                const isActive = user?.isActive ?? true;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{student.rollNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                      {user?.fullName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{student.department}</div>
                      <div className="text-[11px] text-slate-400">{student.semester}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800">{user?.email}</div>
                      <div className="text-[11px] text-slate-400">{user?.phone || 'No phone'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono border ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {isActive ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user && (
                        <button
                          onClick={() => onToggleStudentStatus(user.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 ${
                            isActive
                              ? 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                              : 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              Disable
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              Enable
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
