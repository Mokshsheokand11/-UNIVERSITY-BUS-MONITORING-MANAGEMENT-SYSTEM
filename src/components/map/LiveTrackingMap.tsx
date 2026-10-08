import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Bus, Route, Stop, Trip } from '../../types';

interface LiveTrackingMapProps {
  selectedBus?: Bus;
  currentTrip?: Trip;
  route?: Route;
  allStops?: Stop[];
  busCoords?: { lat: number; lng: number };
  onStopSelect?: (stop: Stop) => void;
  heightClass?: string;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  selectedBus,
  currentTrip,
  route,
  allStops = [],
  busCoords,
  onStopSelect,
  heightClass = 'h-[460px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const stopsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center around the University Hub coordinates
    const initialLat = 28.4632;
    const initialLng = 77.0450;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    // OpenStreetMap standard clean tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    stopsLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Route Polyline & Stops
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous stops
    if (stopsLayerGroupRef.current) {
      stopsLayerGroupRef.current.clearLayers();
    }
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (route && route.stops && route.stops.length > 0) {
      const latLngs: [number, number][] = [];

      route.stops.forEach((rs, index) => {
        if (!rs.stop) return;
        const lat = Number(rs.stop.latitude);
        const lng = Number(rs.stop.longitude);
        latLngs.push([lat, lng]);

        // Stop Circle Marker
        const isCurrent = currentTrip?.currentStopId === rs.stopId;
        const isFirst = index === 0;
        const isLast = index === (route.stops?.length ?? 1) - 1;

        const stopColor = isCurrent
          ? '#2563eb' // Blue
          : isFirst
          ? '#16a34a' // Green origin
          : isLast
          ? '#dc2626' // Red destination
          : '#64748b'; // Slate

        const markerHtml = `
          <div style="
            background-color: ${stopColor};
            color: white;
            border-radius: 9999px;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            border: 2px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          ">
            ${rs.stopSequence}
          </div>
        `;

        const customStopIcon = L.divIcon({
          className: 'custom-stop-marker',
          html: markerHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const stopMarker = L.marker([lat, lng], { icon: customStopIcon });
        stopMarker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <div style="font-weight: bold; font-size: 13px; color: #1e293b;">
              Stop #${rs.stopSequence}: ${rs.stop.stopName}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              Landmark: ${rs.stop.landmark || 'N/A'}
            </div>
            <div style="font-size: 11px; color: #0284c7; margin-top: 2px;">
              Est. time from origin: ~${rs.estimatedMinutesFromStart} mins
            </div>
            ${isCurrent ? '<div style="margin-top: 4px; font-weight: bold; color: #2563eb; font-size: 11px;">● Currently At / Approaching This Stop</div>' : ''}
          </div>
        `);

        if (onStopSelect && rs.stop) {
          stopMarker.on('click', () => onStopSelect(rs.stop!));
        }

        if (stopsLayerGroupRef.current) {
          stopsLayerGroupRef.current.addLayer(stopMarker);
        }
      });

      // Draw polyline connecting stops
      if (latLngs.length > 1) {
        polylineRef.current = L.polyline(latLngs, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.8,
          dashArray: '6, 6',
        }).addTo(map);

        map.fitBounds(polylineRef.current.getBounds(), { padding: [40, 40] });
      }
    } else if (allStops.length > 0 && stopsLayerGroupRef.current) {
      // Just render generic stops if no specific route is chosen
      allStops.forEach((st) => {
        const marker = L.circleMarker([Number(st.latitude), Number(st.longitude)], {
          radius: 7,
          fillColor: '#475569',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.9,
        });
        marker.bindPopup(`<b>${st.stopName}</b><br/><small>${st.landmark || ''}</small>`);
        stopsLayerGroupRef.current?.addLayer(marker);
      });
    }
  }, [route, currentTrip, allStops, onStopSelect]);

  // Update Bus Marker Position
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const lat = busCoords?.lat ?? (currentTrip ? 28.4632 : undefined);
    const lng = busCoords?.lng ?? (currentTrip ? 77.0498 : undefined);

    if (lat !== undefined && lng !== undefined) {
      const busHtml = `
        <div style="
          position: relative;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          border-radius: 8px;
          padding: 6px 10px;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.45);
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: sans-serif;
          white-space: nowrap;
          transform: translate(-50%, -100%);
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6v6"></path>
            <path d="M15 6v6"></path>
            <path d="M2 12h19.6"></path>
            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2L21 10h-3"></path>
            <rect width="16" height="16" x="2" y="3" rx="2"></rect>
            <circle cx="7" cy="18" r="2"></circle>
            <path d="M9 18h5"></path>
            <circle cx="16" cy="18" r="2"></circle>
          </svg>
          <div style="text-align: left;">
            <div style="font-weight: 800; font-size: 11px; letter-spacing: 0.5px;">${selectedBus?.busNumber || 'BUS'}</div>
            <div style="font-size: 9px; opacity: 0.9; text-transform: uppercase;">${currentTrip?.tripStatus || 'ACTIVE'}</div>
          </div>
          <div style="
            position: absolute;
            bottom: -6px;
            left: 50%;
            margin-left: -6px;
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #1e40af;
          "></div>
        </div>
      `;

      const busDivIcon = L.divIcon({
        className: 'bus-location-marker',
        html: busHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      if (!busMarkerRef.current) {
        busMarkerRef.current = L.marker([lat, lng], { icon: busDivIcon }).addTo(map);
      } else {
        busMarkerRef.current.setLatLng([lat, lng]);
        busMarkerRef.current.setIcon(busDivIcon);
      }

      busMarkerRef.current.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="margin: 0; font-size: 14px; font-weight: bold; color: #1e3a8a;">Bus ${selectedBus?.busNumber || 'Active'}</h4>
          <p style="margin: 4px 0 0; font-size: 12px; color: #475569;">Route: ${route?.routeName || 'Campus Transit'}</p>
          <p style="margin: 2px 0 0; font-size: 11px; color: #059669; font-weight: 600;">Status: ${currentTrip?.tripStatus || 'ON_ROUTE'}</p>
          <p style="margin: 2px 0 0; font-size: 11px; color: #64748b;">Simulated Lat/Lng: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
        </div>
      `);
    } else if (busMarkerRef.current) {
      busMarkerRef.current.remove();
      busMarkerRef.current = null;
    }
  }, [busCoords, currentTrip, selectedBus, route]);

  return (
    <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 z-0`}>
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] text-slate-600 border border-slate-200 font-mono flex items-center gap-1.5 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Simulated GPS Telemetry • OpenStreetMap
      </div>
    </div>
  );
};
