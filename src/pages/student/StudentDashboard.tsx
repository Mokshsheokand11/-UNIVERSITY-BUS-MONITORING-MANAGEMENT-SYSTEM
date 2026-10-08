import React from 'react';
import { Bus, MapPin, Calendar, Bell, ArrowRight, Clock, Navigation } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Bus as BusType, Notice, Route, Trip } from '../../types';

interface StudentDashboardProps {
  buses: BusType[];
  routes: Route[];
  trips: Trip[];
  notices: Notice[];
  onNavigateToTracking: (busId?: number) => void;
  onNavigateToSchedules: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  buses,
  routes,
  trips,
  notices,
  onNavigateToTracking,
  onNavigateToSchedules,
}) => {
  const activeTrips = trips.filter((t) => t.tripStatus === 'ON_ROUTE' || t.tripStatus === 'DELAYED');
  const availableBuses = buses.filter((b) => b.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-blue-200 text-xs font-semibold uppercase tracking-wider">
              Student Transit Portal
            </span>
            <h2 className="text-2xl font-bold mt-1">Welcome to University Bus Monitoring</h2>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Track simulated campus bus positions, check scheduled departures, and stay updated with transport notices.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTracking()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors shadow-sm"
          >
            <Navigation className="w-4 h-4 text-blue-600" />
            Track Live Buses
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Buses on Route"
          value={activeTrips.length}
          subtitle="Currently running trips"
          icon={Bus}
          color="blue"
        />
        <StatCard
          title="Total Fleet Buses"
          value={availableBuses.length}
          subtitle="Operational campus vehicles"
          icon={MapPin}
          color="emerald"
        />
        <StatCard
          title="Active Routes"
          value={routes.length}
          subtitle="Connecting city & campus"
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Active Announcements"
          value={notices.length}
          subtitle="University transit notices"
          icon={Bell}
          color="amber"
        />
      </div>

      {/* Main Grid: Active Buses & Recent Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Buses Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Campus Buses</h3>
              <p className="text-xs text-slate-500">Live operational status and current simulated stop</p>
            </div>
            <button
              onClick={() => onNavigateToTracking()}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View on Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeTrips.map((trip) => {
              const bus = buses.find((b) => b.id === trip.busId);
              const route = routes.find((r) => r.id === trip.routeId);
              const currentStop = route?.stops?.find((s) => s.stopId === trip.currentStopId)?.stop;

              return (
                <div
                  key={trip.id}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 transition-colors bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{bus?.busNumber}</span>
                        <StatusBadge status={trip.tripStatus} size="sm" />
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">{route?.routeName}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          Stop: {currentStop?.stopName || 'Departing Origin'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Est. Duration: ~{route?.approxDurationMinutes} mins
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateToTracking(trip.busId)}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Track Now
                  </button>
                </div>
              );
            })}

            {activeTrips.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No active trips currently in transit. Check scheduled departures below.
              </div>
            )}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Transit Notices
              </h3>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <StatusBadge status={notice.category} size="sm" />
                    <span className="text-[10px] text-slate-400">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{notice.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={onNavigateToSchedules}
              className="w-full py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              View Timetable & Schedules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
