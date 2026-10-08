import React from 'react';
import { Bus, UserCheck, Shield, GraduationCap, Truck, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenDocs?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDocs }) => {
  const { currentUser, role, switchRole } = useAuth();

  const roleConfig: Record<UserRole, { label: string; icon: typeof UserCheck; color: string }> = {
    STUDENT: { label: 'Student Portal', icon: GraduationCap, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    DRIVER: { label: 'Driver Cockpit', icon: Truck, color: 'bg-amber-100 text-amber-800 border-amber-300' },
    ADMIN: { label: 'Admin Terminal', icon: Shield, color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  };

  const CurrentRoleIcon = roleConfig[role].icon;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                UniTransit
              </h1>
              
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              University Bus Monitoring & Management System
            </p>
          </div>
        </div>

        {/* Quick Role Switcher for Academic Evaluation & Presentation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="px-2 py-1 text-slate-400 font-medium">Switch View:</span>
            <button
              onClick={() => switchRole('STUDENT')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                role === 'STUDENT'
                  ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Student
            </button>
            <button
              onClick={() => switchRole('DRIVER')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                role === 'DRIVER'
                  ? 'bg-white text-amber-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Driver
            </button>
            <button
              onClick={() => switchRole('ADMIN')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                role === 'ADMIN'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>

          {/* SPM Docs Modal Trigger */}
          {onOpenDocs && (
            <button
              onClick={onOpenDocs}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
              title="View SPM System Architecture & Diagrams"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">SPM Docs & Diagrams</span>
            </button>
          )}

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
              {currentUser?.fullName.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser?.fullName}
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded border text-[9px] font-bold ${roleConfig[role].color}`}
                >
                  <CurrentRoleIcon className="w-2.5 h-2.5" />
                  {roleConfig[role].label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
