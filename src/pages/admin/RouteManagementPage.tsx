import React, { useState } from 'react';
import { Route as RouteIcon, Plus, MapPin, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Route, Stop } from '../../types';

interface RouteManagementPageProps {
  routes: Route[];
  allStops: Stop[];
  onAddRoute: (routeCode: string, routeName: string, origin: string, destination: string, approxDurationMinutes: number) => void;
  onAddStop: (stopName: string, latitude: number, longitude: number, landmark?: string) => void;
  onDeleteRoute: (id: number) => void;
}

export const RouteManagementPage: React.FC<RouteManagementPageProps> = ({
  routes,
  allStops,
  onAddRoute,
  onAddStop,
  onDeleteRoute,
}) => {
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);

  // Route Form State
  const [routeCode, setRouteCode] = useState('');
  const [routeName, setRouteName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(30);

  // Stop Form State
  const [stopName, setStopName] = useState('');
  const [latitude, setLatitude] = useState('28.4600');
  const [longitude, setLongitude] = useState('77.0300');
  const [landmark, setLandmark] = useState('');

  const handleRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRoute(routeCode.trim(), routeName.trim(), origin.trim(), destination.trim(), Number(duration));
    setRouteCode('');
    setRouteName('');
    setOrigin('');
    setDestination('');
    setIsRouteModalOpen(false);
  };

  const handleStopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStop(stopName.trim(), parseFloat(latitude), parseFloat(longitude), landmark.trim());
    setStopName('');
    setLandmark('');
    setIsStopModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <RouteIcon className="w-5 h-5 text-indigo-600" />
            Route Planning & Geographic Stops
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure transit pathways, sequential stops, and coordinate waypoints for GPS tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStopModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            New Geographic Stop
          </button>
          <button
            onClick={() => setIsRouteModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Create Route
          </button>
        </div>
      </div>

      {/* Routes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200">
                  {route.routeCode}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{route.approxDurationMinutes} mins
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete route ${route.routeName}?`)) {
                        onDeleteRoute(route.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">{route.routeName}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {route.origin} → {route.destination}
              </p>

              {/* Stops Timeline */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ordered Sequence ({route.stops?.length || 0} Stops)
                </h4>
                <div className="space-y-1.5">
                  {route.stops?.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center">
                          {st.stopSequence}
                        </span>
                        <span className="font-medium text-slate-800">{st.stop?.stopName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        +{st.estimatedMinutesFromStart}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registered Stops Catalog */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          Master Stops Geographic Catalog ({allStops.length} Physical Locations)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allStops.map((stop) => (
            <div key={stop.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
              <div className="font-bold text-slate-900">{stop.stopName}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{stop.landmark || 'No landmark'}</div>
              <div className="font-mono text-[10px] text-blue-600 mt-2 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block">
                {Number(stop.latitude).toFixed(4)}, {Number(stop.longitude).toFixed(4)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create Route */}
      <Modal isOpen={isRouteModalOpen} onClose={() => setIsRouteModalOpen(false)} title="Create New Route">
        <form onSubmit={handleRouteSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Route Code</label>
              <input
                type="text"
                required
                value={routeCode}
                onChange={(e) => setRouteCode(e.target.value)}
                placeholder="R-04"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Est. Duration (Mins)</label>
              <input
                type="number"
                required
                min={10}
                max={180}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Route Display Name</label>
            <input
              type="text"
              required
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Main Campus ↔ City Square Express"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Origin Point</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="University Campus"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destination</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="City Square"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsRouteModalOpen(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
            >
              Create Route
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: New Stop */}
      <Modal isOpen={isStopModalOpen} onClose={() => setIsStopModalOpen(false)} title="Add Geographic Stop">
        <form onSubmit={handleStopSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stop Name</label>
            <input
              type="text"
              required
              value={stopName}
              onChange={(e) => setStopName(e.target.value)}
              placeholder="e.g. University Sports Complex"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Latitude</label>
              <input
                type="text"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="28.4600"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Longitude</label>
              <input
                type="text"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="77.0300"
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Landmark / Notes</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Opposite Indoor Stadium Gate 3"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsStopModalOpen(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Stop
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
