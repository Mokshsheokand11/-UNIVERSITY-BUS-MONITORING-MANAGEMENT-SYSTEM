import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Clock, Bus } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Bus as BusType, Route, Schedule, ShiftType } from '../../types';

interface ScheduleManagementPageProps {
  schedules: Schedule[];
  routes: Route[];
  buses: BusType[];
  onAddSchedule: (routeId: number, busId: number, departureTime: string, shift: ShiftType, daysOfOperation: string) => void;
  onDeleteSchedule: (id: number) => void;
}

export const ScheduleManagementPage: React.FC<ScheduleManagementPageProps> = ({
  schedules,
  routes,
  buses,
  onAddSchedule,
  onDeleteSchedule,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routeId, setRouteId] = useState<number>(routes[0]?.id || 1);
  const [busId, setBusId] = useState<number>(buses[0]?.id || 1);
  const [departureTime, setDepartureTime] = useState('08:00 AM');
  const [shift, setShift] = useState<ShiftType>('MORNING');
  const [daysOfOperation, setDaysOfOperation] = useState('Mon - Fri');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSchedule(Number(routeId), Number(busId), departureTime.trim(), shift, daysOfOperation.trim());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Timetable & Departure Schedules
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Link buses to routes with departure times and operational shifts
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Departure Time</th>
                <th className="py-3 px-4">Assigned Route</th>
                <th className="py-3 px-4">Assigned Bus</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map((schedule) => {
                const route = routes.find((r) => r.id === schedule.routeId);
                const bus = buses.find((b) => b.id === schedule.busId);

                return (
                  <tr key={schedule.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                      {schedule.departureTime}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{route?.routeName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{route?.routeCode}</div>
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
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this schedule entry?')) {
                            onDeleteSchedule(schedule.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Schedule */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Bus Schedule">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Route</label>
            <select
              value={routeId}
              onChange={(e) => setRouteId(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.routeCode} - {r.routeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Bus</label>
            <select
              value={busId}
              onChange={(e) => setBusId(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.busNumber} ({b.capacity} Seats)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departure Time</label>
              <input
                type="text"
                required
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                placeholder="07:45 AM"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as ShiftType)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="MORNING">MORNING</option>
                <option value="AFTERNOON">AFTERNOON</option>
                <option value="EVENING">EVENING</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Operating Days</label>
            <input
              type="text"
              required
              value={daysOfOperation}
              onChange={(e) => setDaysOfOperation(e.target.value)}
              placeholder="Mon - Fri"
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
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
