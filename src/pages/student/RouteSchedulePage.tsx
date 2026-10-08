import React, { useState } from 'react';
import { Search, Route as RouteIcon, Clock, Calendar, Bus } from 'lucide-react';
import { Bus as BusType, Route, Schedule } from '../../types';

interface RouteSchedulePageProps {
  routes: Route[];
  schedules: Schedule[];
  buses: BusType[];
  onTrackBus: (busId: number) => void;
}

export const RouteSchedulePage: React.FC<RouteSchedulePageProps> = ({
  routes,
  schedules,
  buses,
  onTrackBus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShift, setSelectedShift] = useState<'ALL' | 'MORNING' | 'AFTERNOON' | 'EVENING'>('ALL');

  const filteredRoutes = routes.filter(
    (r) =>
      r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.routeCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSchedules = schedules.filter((s) => {
    const matchShift = selectedShift === 'ALL' || s.shift === selectedShift;
    return matchShift;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <RouteIcon className="w-5 h-5 text-blue-600" />
            University Routes & Timetables
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore bus network paths, sequenced stops, and departure schedules
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search route or stop..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-xs"
          />
        </div>
      </div>

      {/* Routes Directory */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 mb-3">
          Available Routes ({filteredRoutes.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {route.routeCode}
                  </span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    ~{route.approxDurationMinutes} mins
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-1">{route.routeName}</h4>

                <div className="mt-3 text-xs space-y-1.5 text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-700">Origin:</span> {route.origin}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="font-semibold text-slate-700">Destination:</span> {route.destination}
                  </div>
                </div>

                {/* Stops Pill sequence */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Route Stops ({route.stops?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {route.stops?.map((st) => (
                      <span
                        key={st.id}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        #{st.stopSequence} {st.stop?.stopName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Scheduled Timetable Departures
            </h3>
            <p className="text-xs text-slate-500">Official university departure timings</p>
          </div>

          {/* Shift filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {(['ALL', 'MORNING', 'AFTERNOON', 'EVENING'] as const).map((shift) => (
              <button
                key={shift}
                onClick={() => setSelectedShift(shift)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedShift === shift
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {shift}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Departure</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Bus Vehicle</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4">Operating Days</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchedules.map((schedule) => {
                const route = routes.find((r) => r.id === schedule.routeId);
                const bus = buses.find((b) => b.id === schedule.busId);

                return (
                  <tr key={schedule.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                      {schedule.departureTime}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{route?.routeName}</div>
                      <div className="text-[11px] text-slate-500">Code: {route?.routeCode}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {bus?.busNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {schedule.shift}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{schedule.daysOfOperation}</td>
                    <td className="py-3 px-4 text-right">
                      {bus && (
                        <button
                          onClick={() => onTrackBus(bus.id)}
                          className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
                        >
                          <Bus className="w-3 h-3" />
                          Track
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
