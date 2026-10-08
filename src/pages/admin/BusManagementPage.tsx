import React, { useState } from 'react';
import { Bus, Plus, Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Bus as BusType, BusStatus, Route } from '../../types';

interface BusManagementPageProps {
  buses: BusType[];
  routes: Route[];
  onAddBus: (bus: Omit<BusType, 'id'>) => void;
  onUpdateBus: (bus: BusType) => void;
  onDeleteBus: (id: number) => void;
}

export const BusManagementPage: React.FC<BusManagementPageProps> = ({
  buses,
  routes,
  onAddBus,
  onUpdateBus,
  onDeleteBus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<BusType | null>(null);

  // Form State
  const [busNumber, setBusNumber] = useState('');
  const [registrationPlate, setRegistrationPlate] = useState('');
  const [capacity, setCapacity] = useState(50);
  const [status, setStatus] = useState<BusStatus>('ACTIVE');
  const [currentRouteId, setCurrentRouteId] = useState<number | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingBus(null);
    setBusNumber('');
    setRegistrationPlate('');
    setCapacity(50);
    setStatus('ACTIVE');
    setCurrentRouteId(undefined);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (bus: BusType) => {
    setEditingBus(bus);
    setBusNumber(bus.busNumber);
    setRegistrationPlate(bus.registrationPlate);
    setCapacity(bus.capacity);
    setStatus(bus.status);
    setCurrentRouteId(bus.currentRouteId);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!busNumber.trim() || !registrationPlate.trim()) {
      setErrorMsg('Bus number and registration plate are required.');
      return;
    }

    // Check duplicate bus number
    const duplicate = buses.find(
      (b) => b.busNumber.toLowerCase() === busNumber.trim().toLowerCase() && b.id !== editingBus?.id
    );
    if (duplicate) {
      setErrorMsg(`Unable to create bus because bus number "${busNumber}" already exists.`);
      return;
    }

    if (editingBus) {
      onUpdateBus({
        ...editingBus,
        busNumber: busNumber.trim(),
        registrationPlate: registrationPlate.trim(),
        capacity: Number(capacity),
        status,
        currentRouteId: currentRouteId ? Number(currentRouteId) : undefined,
      });
    } else {
      onAddBus({
        busNumber: busNumber.trim(),
        registrationPlate: registrationPlate.trim(),
        capacity: Number(capacity),
        status,
        currentRouteId: currentRouteId ? Number(currentRouteId) : undefined,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bus className="w-5 h-5 text-blue-600" />
            Bus Fleet Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Register university buses, update seat capacity, assign routes, and schedule maintenance
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add New Bus
        </button>
      </div>

      {/* Buses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Bus ID</th>
                <th className="py-3 px-4">Bus Number</th>
                <th className="py-3 px-4">Registration Plate</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Assigned Route</th>
                <th className="py-3 px-4">Operational Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {buses.map((bus) => {
                const assignedRoute = routes.find((r) => r.id === bus.currentRouteId);
                return (
                  <tr key={bus.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono">#{bus.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm">
                      {bus.busNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{bus.registrationPlate}</td>
                    <td className="py-3 px-4 text-slate-800 font-semibold">{bus.capacity} seats</td>
                    <td className="py-3 px-4">
                      {assignedRoute ? (
                        <div>
                          <span className="font-semibold text-slate-800">{assignedRoute.routeName}</span>
                          <span className="text-[11px] text-slate-400 block">({assignedRoute.routeCode})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={bus.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(bus)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Bus"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${bus.busNumber}?`)) {
                              onDeleteBus(bus.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Bus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Bus Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBus ? `Edit Bus ${editingBus.busNumber}` : 'Register New University Bus'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Bus Number (e.g. MRU-106)
            </label>
            <input
              type="text"
              required
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              placeholder="MRU-106"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Registration Plate Number
            </label>
            <input
              type="text"
              required
              value={registrationPlate}
              onChange={(e) => setRegistrationPlate(e.target.value)}
              placeholder="DL-01-EQ-9988"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Seat Capacity
              </label>
              <input
                type="number"
                required
                min={15}
                max={90}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 50)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Operational Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BusStatus)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Assign to Route
            </label>
            <select
              value={currentRouteId || ''}
              onChange={(e) => setCurrentRouteId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- No Route Assigned (Standby) --</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.routeCode} - {r.routeName}
                </option>
              ))}
            </select>
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
              {editingBus ? 'Save Changes' : 'Create Bus'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
