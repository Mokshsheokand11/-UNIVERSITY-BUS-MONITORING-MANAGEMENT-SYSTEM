import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Bell,
  Bus,
  Users,
  Route as RouteIcon,
  Navigation,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { role } = useAuth();

  const studentNav = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'student-tracking', label: 'Live Bus Tracking', icon: MapPin },
    { id: 'student-schedules', label: 'Routes & Timetables', icon: Calendar },
    { id: 'student-notices', label: 'Campus Notices', icon: Bell },
  ];

  const driverNav = [
    { id: 'driver-dashboard', label: 'Driver Cockpit', icon: LayoutDashboard },
    { id: 'driver-simulator', label: 'GPS Simulator & Route', icon: Navigation },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'admin-buses', label: 'Bus Fleet Management', icon: Bus },
    { id: 'admin-drivers', label: 'Driver Directory', icon: UserCheck },
    { id: 'admin-routes', label: 'Routes & Stops', icon: RouteIcon },
    { id: 'admin-schedules', label: 'Timetable Schedules', icon: Calendar },
    { id: 'admin-students', label: 'Student Directory', icon: Users },
    { id: 'admin-notices', label: 'Broadcast Notices', icon: FileText },
  ];

  const navItems = role === 'ADMIN' ? adminNav : role === 'DRIVER' ? driverNav : studentNav;

  return (
    <aside className="w-64 bg-slate-50/70 border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {role} PORTAL
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Academic Role Explanation box */}
        <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-xs text-blue-900">
          <p className="font-semibold mb-1 flex items-center gap-1">
            <span>ℹ️</span> SPM Role Isolation
          </p>
          <p className="text-[11px] text-blue-700 leading-relaxed">
            {role === 'STUDENT' && 'Students can view live bus telemetry, routes, and arrival stops.'}
            {role === 'DRIVER' && 'Drivers control their active trip, advance stops, and update simulated coordinates.'}
            {role === 'ADMIN' && 'Admins manage buses, drivers, routes, stops, schedules, and alerts.'}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200/80 text-[11px] text-slate-400 text-center">
        UBMMS • SPM Academic v1.0
      </div>
    </aside>
  );
};
