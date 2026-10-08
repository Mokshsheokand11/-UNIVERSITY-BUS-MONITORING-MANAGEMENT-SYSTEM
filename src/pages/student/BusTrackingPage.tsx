import React, { useState } from 'react';
import { Bus, Clock, MapPin, Navigation, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LiveTrackingMap } from '../../components/map/LiveTrackingMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Bus as BusType, DriverProfile, Route, Stop, Trip, User } from '../../types';

interface BusTrackingPageProps {
  buses: BusType[];
  routes: Route[];
  trips: Trip[];
  drivers: DriverProfile[];
  users: User[];
  allStops: Stop[];
  initialBusId?: number;
}

export const BusTrackingPage: React.FC<BusTrackingPageProps> = ({
  buses,
  routes,
  trips,
  drivers,
  users,
  allStops,
  initialBusId,
}) => {
  const activeBuses = buses.filter((b) => b.status === 'ACTIVE');
  const [selectedBusId, setSelectedBusId] = useState<number>(initialBusId || activeBuses[0]?.id || 1);

  const selectedBus = buses.find((b) => b.id === selectedBusId);
  const currentTrip = trips.find((t) => t.busId === selectedBusId);
  const route = routes.find((r) => r.id === (currentTrip?.routeId || selectedBus?.currentRouteId));
  const driverProfile = drivers.find((d) => d.id === currentTrip?.driverId || d.assignedBusId === selectedBusId);
  const driverUser = users.find((u) => u.id === driverProfile?.userId);

  // Find current stop
  const currentStop = allStops.find((s) => s.id === currentTrip?.currentStopId) || route?.stops?.[0]?.stop;

  // Calculate simulated coords for the bus
  const busCoords = currentStop
    ? { lat: Number(currentStop.latitude), lng: Number(currentStop.longitude) }
    : { lat: 28.4632, lng: 77.0498 };

  // Calculate estimated arrival to destination based on current stop sequence
  const currentSequenceIndex = route?.stops?.findIndex((s) => s.stopId === currentStop?.id) ?? 0;
  const currentSeqStop = route?.stops?.[currentSequenceIndex];
  const lastSeqStop = route?.stops?.[(route?.stops?.length ?? 1) - 1];

  const estimatedArrivalMinutes = Math.max(
    3,
    (lastSeqStop?.estimatedMinutesFromStart ?? 35) - (currentSeqStop?.estimatedMinutesFromStart ?? 0)
  );

  return (
    <div className="space-y-6">
      {/* Header & Bus Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            Live Simulated Bus Monitoring
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic GPS telemetry synchronized with driver trip updates
          </p>
        </div>

        {/* Bus selector pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 mr-1">Select Bus:</span>
          {activeBuses.map((bus) => {
            const hasTrip = trips.find((t) => t.busId === bus.id && t.tripStatus === 'ON_ROUTE');
            const isSelected = bus.id === selectedBusId;
            return (
              <button
                key={bus.id}
                onClick={() => setSelectedBusId(bus.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                {bus.busNumber}
                {hasTrip && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Monitoring Board: Spec Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-base shrink-0">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Bus Vehicle</span>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">{selectedBus?.busNumber}</div>
            <div className="text-xs text-slate-500 font-mono">{selectedBus?.registrationPlate}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Driver on Duty</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {driverUser?.fullName || 'Assigned Staff'}
            </div>
            <div className="text-xs text-slate-500">{driverUser?.phone || 'Campus Extension'}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current Stop</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5 truncate max-w-[180px]">
              {currentStop?.stopName}
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              Landmark: {currentStop?.landmark || 'Stop Area'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-base shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status & ETA</span>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusBadge status={currentTrip?.tripStatus || 'SCHEDULED'} size="sm" />
            </div>
            <div className="text-xs text-slate-600 font-medium mt-1">
              Estimated Arrival: <strong className="text-blue-700 font-bold">{estimatedArrivalMinutes} mins</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Map + Stop Sequence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {route?.routeName || 'Transit Route'}
                </h3>
                <p className="text-xs text-slate-500">
                  Origin: {route?.origin} → Destination: {route?.destination}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  Route {route?.routeCode}
                </span>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <LiveTrackingMap
              selectedBus={selectedBus}
              currentTrip={currentTrip}
              route={route}
              allStops={allStops}
              busCoords={busCoords}
              heightClass="h-[440px]"
            />

            {/* Simulation Notice Disclaimer */}
            <div className="mt-3 p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Academic GPS Simulation Note:</span> This project utilizes simulated live coordinates operated from the Driver Cockpit. Coordinates update in real-time as the driver advances stops along the route.
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Route Stop Sequence Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Route Stop Sequence</h3>
          <p className="text-xs text-slate-500 mb-4">Progress of stops along this journey</p>

          <div className="relative pl-6 space-y-6 flex-1 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {route?.stops?.map((routeStop, idx) => {
              const isCurrent = routeStop.stopId === currentStop?.id;
              const isPassed = currentSequenceIndex > idx;

              return (
                <div key={routeStop.id} className="relative group">
                  {/* Circle marker on line */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ring-4 ring-white transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-blue-100 scale-110 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      routeStop.stopSequence
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-blue-700'
                            : isPassed
                            ? 'text-slate-500 line-through'
                            : 'text-slate-800'
                        }`}
                      >
                        {routeStop.stop?.stopName}
                      </h4>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 animate-pulse">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {routeStop.stop?.landmark}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-mono font-semibold text-slate-500">
                      +{routeStop.estimatedMinutesFromStart} min from start
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {currentTrip?.remarks && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
              <span className="font-semibold text-slate-900 block mb-0.5">Driver Remarks:</span>
              {currentTrip.remarks}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
