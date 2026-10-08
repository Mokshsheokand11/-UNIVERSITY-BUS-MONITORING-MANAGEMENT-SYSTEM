import React, { useState } from 'react';
import { UserCheck, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Bus, DriverProfile, User } from '../../types';

interface DriverManagementPageProps {
  drivers: DriverProfile[];
  users: User[];
  buses: Bus[];
  onAddDriver: (fullName: string, email: string, phone: string, licenseNumber: string, experienceYears: number, busId?: number) => void;
  onUpdateDriver: (driver: DriverProfile) => void;
  onDeleteDriver: (id: number) => void;
}

export const DriverManagementPage: React.FC<DriverManagementPageProps> = ({
  drivers,
  users,
  buses,
  onAddDriver,
  onUpdateDriver,
  onDeleteDriver,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [assignedBusId, setAssignedBusId] = useState<number | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openAddModal = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setLicenseNumber('');
    setExperienceYears(5);
    setAssignedBusId(undefined);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !licenseNumber.trim()) {
      setErrorMsg('Full name, email, and driver license number are required.');
      return;
    }

    onAddDriver(
      fullName.trim(),
      email.trim(),
      phone.trim(),
      licenseNumber.trim(),
      experienceYears,
      assignedBusId
    );
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            University Driver Directory & Assignments
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage licensed drivers, contact records, and bus vehicle assignments
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Register New Driver
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Driver ID</th>
                <th className="py-3 px-4">Staff Name</th>
                <th className="py-3 px-4">Contact Email & Phone</th>
                <th className="py-3 px-4">License Number</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Assigned Bus</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drivers.map((driver) => {
                const user = users.find((u) => u.id === driver.userId);
                const assignedBus = buses.find((b) => b.id === driver.assignedBusId);

                return (
                  <tr key={driver.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono">#{driver.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                      {user?.fullName || 'Driver Staff'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800">{user?.email}</div>
                      <div className="text-[11px] text-slate-400">{user?.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{driver.licenseNumber}</td>
                    <td className="py-3 px-4 text-slate-600">{driver.experienceYears} Years</td>
                    <td className="py-3 px-4">
                      {assignedBus ? (
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                          {assignedBus.busNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No Bus Assigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this driver record?')) {
                            onDeleteDriver(driver.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

      {/* Add Driver Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register University Driver">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver4@university.edu"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                License Number
              </label>
              <input
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="DL-042022-778899"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                min={1}
                max={40}
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Assign Dedicated Bus
            </label>
            <select
              value={assignedBusId || ''}
              onChange={(e) => setAssignedBusId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- No Bus (Reserve Driver) --</option>
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.busNumber} ({b.registrationPlate})
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
              Register Driver
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
