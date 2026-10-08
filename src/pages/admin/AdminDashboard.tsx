import React from 'react';
import { Bus, Users, Route as RouteIcon, Navigation, UserCheck, Bell, Shield, Plus } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Bus as BusType, DriverProfile, Notice, Route, StudentProfile, Trip } from '../../types';

interface AdminDashboardProps {
  buses: BusType[];
  drivers: DriverProfile[];
  students: StudentProfile[];
  routes: Route[];
  trips: Trip[];
  notices: Notice[];
  onNavigateTab: (tabId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  buses,
  drivers,
  students,
  routes,
  trips,
  notices,
  onNavigateTab,
}) => {
  const activeTrips = trips.filter((t) => t.tripStatus === 'ON_ROUTE' || t.tripStatus === 'DELAYED');
  const activeBuses = buses.filter((b) => b.status === 'ACTIVE');
  const maintenanceBuses = buses.filter((b) => b.status === 'MAINTENANCE');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">University Fleet Administration</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
              Admin Terminal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational telemetry, vehicle management, route planning, and academic system audits
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('admin-buses')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Bus
          </button>
          <button
            onClick={() => onNavigateTab('admin-notices')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            New Notice
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Buses"
          value={buses.length}
          subtitle={`${activeBuses.length} active • ${maintenanceBuses.length} maintenance`}
          icon={Bus}
          color="blue"
        />
        <StatCard
          title="Active Trips Running"
          value={activeTrips.length}
          subtitle="Currently simulated on road"
          icon={Navigation}
          color="emerald"
        />
        <StatCard
          title="Registered Drivers"
          value={drivers.length}
          subtitle="Licensed university staff"
          icon={UserCheck}
          color="amber"
        />
        <StatCard
          title="Enrolled Students"
          value={students.length}
          subtitle="Active transport users"
          icon={Users}
          color="indigo"
        />
      </div>

      {/* Fleet Status & Active Trips Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Trips Monitor */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Trip Fleet Operations</h3>
              <p className="text-xs text-slate-500">Real-time tracking status across all active vehicles</p>
            </div>
            <button
              onClick={() => onNavigateTab('student-tracking')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Open Live Map →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Bus Number</th>
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">Driver</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trips.map((trip) => {
                  const bus = buses.find((b) => b.id === trip.busId);
                  const route = routes.find((r) => r.id === trip.routeId);

                  return (
                    <tr key={trip.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {bus?.busNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{route?.routeName}</div>
                        <div className="text-[11px] text-slate-400">{route?.routeCode}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">Staff #{trip.driverId}</td>
                      <td className="py-3 px-3">
                        <StatusBadge status={trip.tripStatus} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px] max-w-[200px] truncate">
                        {trip.remarks || 'Normal schedule'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fleet Composition & Quick Links */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">System Directory Quick Links</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('admin-buses')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-white text-left transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Bus Fleet Registry</h4>
                    <p className="text-[11px] text-slate-500">{buses.length} Vehicles Managed</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600">Manage →</span>
              </button>

              <button
                onClick={() => onNavigateTab('admin-routes')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-white text-left transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                    <RouteIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Route Network & Stops</h4>
                    <p className="text-[11px] text-slate-500">{routes.length} Active Routes</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600">Manage →</span>
              </button>

              <button
                onClick={() => onNavigateTab('admin-drivers')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-white text-left transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Driver Assignments</h4>
                    <p className="text-[11px] text-slate-500">{drivers.length} Drivers on Roster</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600">Manage →</span>
              </button>

              <button
                onClick={() => onNavigateTab('admin-students')}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-white text-left transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Student Directory</h4>
                    <p className="text-[11px] text-slate-500">{students.length} Enrolled Accounts</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600">Manage →</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Database Sync: MySQL 3NF Normalized Architecture
          </div>
        </div>
      </div>
    </div>
  );
};
