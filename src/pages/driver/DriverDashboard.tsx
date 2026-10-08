import React, { useState } from 'react';
import {
  Truck,
  Play,
  Square,
  MapPin,
  Clock,
  AlertTriangle,
  ArrowRight,
  Send,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LiveTrackingMap } from '../../components/map/LiveTrackingMap';
import { Bus, DriverProfile, Route, Stop, Trip, User } from '../../types';

interface DriverDashboardProps {
  currentDriver: DriverProfile;
  currentUser: User;
  buses: Bus[];
  routes: Route[];
  trips: Trip[];
  allStops: Stop[];
  onUpdateTrip: (updatedTrip: Trip) => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  currentDriver,
  currentUser,
  buses,
  routes,
  trips,
  allStops,
  onUpdateTrip,
}) => {
  const assignedBus = buses.find((b) => b.id === currentDriver.assignedBusId) || buses[0];
  const assignedRoute = routes.find((r) => r.id === assignedBus?.currentRouteId) || routes[0];
  const activeTrip = trips.find((t) => t.busId === assignedBus?.id) || trips[0];

  const currentStop = allStops.find((s) => s.id === activeTrip?.currentStopId) || assignedRoute?.stops?.[0]?.stop;

  // Driver GPS simulation manual form state
  const [customLat, setCustomLat] = useState<string>(currentStop?.latitude?.toString() || '28.4632');
  const [customLng, setCustomLng] = useState<string>(currentStop?.longitude?.toString() || '77.0498');
  const [remarksText, setRemarksText] = useState<string>(activeTrip?.remarks || '');
  const [simulationNotification, setSimulationNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSimulationNotification(msg);
    setTimeout(() => setSimulationNotification(null), 3500);
  };

  // Handlers for driver actions
  const handleStartTrip = () => {
    if (!activeTrip) return;
    const updated: Trip = {
      ...activeTrip,
      tripStatus: 'ON_ROUTE',
      startedAt: new Date().toISOString(),
      currentStopId: assignedRoute?.stops?.[0]?.stopId || 1,
      remarks: 'Trip initiated from origin.',
    };
    onUpdateTrip(updated);
    showNotification('Trip started! Status set to ON_ROUTE.');
  };

  const handleEndTrip = () => {
    if (!activeTrip) return;
    const lastStopId = assignedRoute?.stops?.[assignedRoute.stops.length - 1]?.stopId;
    const updated: Trip = {
      ...activeTrip,
      tripStatus: 'COMPLETED',
      completedAt: new Date().toISOString(),
      currentStopId: lastStopId,
      remarks: 'Trip successfully finished at final destination.',
    };
    onUpdateTrip(updated);
    showNotification('Trip marked as COMPLETED. Bus returned to depot.');
  };

  const handleAdvanceStop = () => {
    if (!activeTrip || !assignedRoute?.stops) return;
    const currentIndex = assignedRoute.stops.findIndex((s) => s.stopId === activeTrip.currentStopId);
    const nextIndex = currentIndex + 1;

    if (nextIndex < assignedRoute.stops.length) {
      const nextRouteStop = assignedRoute.stops[nextIndex];
      const updated: Trip = {
        ...activeTrip,
        currentStopId: nextRouteStop.stopId,
        tripStatus: 'ON_ROUTE',
        remarks: `Arrived at Stop #${nextRouteStop.stopSequence}: ${nextRouteStop.stop?.stopName}`,
      };
      if (nextRouteStop.stop) {
        setCustomLat(nextRouteStop.stop.latitude.toString());
        setCustomLng(nextRouteStop.stop.longitude.toString());
      }
      onUpdateTrip(updated);
      showNotification(`Advanced to Stop #${nextRouteStop.stopSequence} (${nextRouteStop.stop?.stopName})`);
    } else {
      showNotification('Already at the final stop of this route. You can end the trip now.');
    }
  };

  const handleManualCoordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip) return;

    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);

    if (isNaN(lat) || isNaN(lng)) {
      showNotification('Error: Latitude and Longitude must be valid numbers.');
      return;
    }

    const updated: Trip = {
      ...activeTrip,
      remarks: remarksText || activeTrip.remarks,
    };
    onUpdateTrip(updated);
    showNotification(`Simulated GPS updated: (${lat.toFixed(4)}, ${lng.toFixed(4)}) recorded.`);
  };

  const handleStatusChange = (newStatus: 'ON_ROUTE' | 'DELAYED') => {
    if (!activeTrip) return;
    const updated: Trip = {
      ...activeTrip,
      tripStatus: newStatus,
      remarks: newStatus === 'DELAYED' ? 'Delayed due to traffic or weather.' : activeTrip.remarks,
    };
    onUpdateTrip(updated);
    showNotification(`Trip status updated to ${newStatus}.`);
  };

  const currentCoords = {
    lat: parseFloat(customLat) || 28.4632,
    lng: parseFloat(customLng) || 77.0498,
  };

  return (
    <div className="space-y-6">
      {/* Simulation Feedback Alert */}
      {simulationNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {simulationNotification}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            Driver Operational Cockpit & GPS Simulator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Driver: {currentUser.fullName} • License: {currentDriver.licenseNumber}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={activeTrip?.tripStatus || 'SCHEDULED'} />
        </div>
      </div>

      {/* Top Controls: Assigned Bus Card & Trip Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Bus Info */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Assigned Vehicle & Route
            </span>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{assignedBus?.busNumber}</h3>
                <p className="text-xs font-mono text-slate-500">{assignedBus?.registrationPlate}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Assigned Route:</span>
                <span className="font-semibold text-slate-800">{assignedRoute?.routeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Seating Capacity:</span>
                <span className="font-semibold text-slate-800">{assignedBus?.capacity} Seats</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Current Stop:</span>
                <span className="font-bold text-blue-700">{currentStop?.stopName}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Trip ID: #{activeTrip?.id} • Started: {activeTrip?.startedAt ? new Date(activeTrip.startedAt).toLocaleTimeString() : 'Not Started'}
          </div>
        </div>

        {/* Action Controls: Start / End / Advance */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Trip Control Panel</h3>
            <p className="text-xs text-slate-500 mb-4">
              Trigger operational lifecycle states that update student live tracking in real time
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Start Trip */}
              <button
                onClick={handleStartTrip}
                disabled={activeTrip?.tripStatus === 'ON_ROUTE'}
                className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-1.5"
              >
                <Play className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold">Start Trip</span>
                <span className="text-[10px] text-emerald-600">Set ON_ROUTE</span>
              </button>

              {/* Advance to Next Stop */}
              <button
                onClick={handleAdvanceStop}
                disabled={activeTrip?.tripStatus !== 'ON_ROUTE'}
                className="p-3.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-1.5"
              >
                <ArrowRight className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold">Next Stop</span>
                <span className="text-[10px] text-blue-600">Advance Sequence</span>
              </button>

              {/* End Trip */}
              <button
                onClick={handleEndTrip}
                disabled={activeTrip?.tripStatus === 'COMPLETED'}
                className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-1.5"
              >
                <Square className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-bold">End Trip</span>
                <span className="text-[10px] text-rose-600">Set COMPLETED</span>
              </button>
            </div>

            {/* Quick Status Toggles */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">Status Override:</span>
              <button
                onClick={() => handleStatusChange('ON_ROUTE')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  activeTrip?.tripStatus === 'ON_ROUTE'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Normal Transit
              </button>
              <button
                onClick={() => handleStatusChange('DELAYED')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                  activeTrip?.tripStatus === 'DELAYED'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                Report Delay
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            Current Status: <strong>{activeTrip?.tripStatus}</strong> • Latest Remark: &quot;{activeTrip?.remarks}&quot;
          </div>
        </div>
      </div>

      {/* Manual GPS Telemetry Simulator & Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator Form */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900">Academic GPS Simulator</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Simulate satellite coordinates directly. Changes immediately reposition the bus on the student tracking map.
          </p>

          <form onSubmit={handleManualCoordUpdate} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Simulated Latitude
              </label>
              <input
                type="text"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
                placeholder="e.g. 28.4595"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Simulated Longitude
              </label>
              <input
                type="text"
                value={customLng}
                onChange={(e) => setCustomLng(e.target.value)}
                placeholder="e.g. 77.0266"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>

            {/* Quick Waypoints: Pick from assigned route stops */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Quick Waypoint Preset
              </label>
              <select
                onChange={(e) => {
                  const selected = allStops.find((s) => s.id === parseInt(e.target.value));
                  if (selected) {
                    setCustomLat(selected.latitude.toString());
                    setCustomLng(selected.longitude.toString());
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">-- Jump to Route Stop Preset --</option>
                {assignedRoute?.stops?.map((st) => (
                  <option key={st.id} value={st.stopId}>
                    Stop #{st.stopSequence}: {st.stop?.stopName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Driver Route Remarks / Traffic
              </label>
              <input
                type="text"
                value={remarksText}
                onChange={(e) => setRemarksText(e.target.value)}
                placeholder="e.g. Cleared toll plaza. Smooth traffic."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Transmit Simulated GPS Ping
            </button>
          </form>
        </div>

        {/* Live Map Preview for Driver */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Driver Map Telemetry View</h3>
              <p className="text-xs text-slate-500">Live reflection of your transmitted coordinates</p>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Transmitting
            </span>
          </div>

          <LiveTrackingMap
            selectedBus={assignedBus}
            currentTrip={activeTrip}
            route={assignedRoute}
            allStops={allStops}
            busCoords={currentCoords}
            heightClass="h-[380px]"
          />
        </div>
      </div>
    </div>
  );
};
