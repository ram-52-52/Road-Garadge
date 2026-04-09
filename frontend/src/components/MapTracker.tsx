import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapTrackerProps {
  driverLocation?: [number, number]; // [lat, lng]
  mechanicLocation?: [number, number]; // [lat, lng]
  onMetricsCalculated?: (distance: string, eta: number) => void;
  className?: string;
}

// Custom Marker Icons
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; border: 3px solid white;">
        <span style="color: white; font-weight: bold; font-family: sans-serif; font-style: italic;">${label}</span>
      </div>
      <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 12px solid ${color}; position: absolute; bottom: -8px; left: 10px;"></div>
    `,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48]
  });
};

const userIcon = createCustomIcon('#2563eb', 'U'); // Blue 600
const mechanicIcon = createCustomIcon('#10b981', 'M'); // Emerald 500

// Helper: Haversine distance formula
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);  
  const dLon = (lon2 - lon1) * (Math.PI / 180); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

// Sub-component to auto-fit map bounds
const MapFitter = ({ driverLoc, mechanicLoc }: { driverLoc?: [number, number], mechanicLoc?: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (driverLoc && mechanicLoc) {
      const bounds = L.latLngBounds([driverLoc, mechanicLoc]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (driverLoc) {
      map.setView(driverLoc, 15);
    } else if (mechanicLoc) {
      map.setView(mechanicLoc, 15);
    }
  }, [driverLoc, mechanicLoc, map]);
  return null;
};

const MapTracker: React.FC<MapTrackerProps> = ({ 
  driverLocation, 
  mechanicLocation, 
  onMetricsCalculated,
  className = "w-full h-full" 
}) => {

  const metrics = useMemo(() => {
    if (!driverLocation || !mechanicLocation) return null;
    const distKm = getDistance(driverLocation[0], driverLocation[1], mechanicLocation[0], mechanicLocation[1]);
    
    // Assume average city speed of 30 km/h (0.5 km/min)
    const speedKmPerMin = 0.5;
    const timeMinutes = Math.ceil(distKm / speedKmPerMin);
    
    // Add 2 min buffer
    return {
      distance: distKm.toFixed(1),
      eta: Math.max(3, timeMinutes + 2) 
    };
  }, [driverLocation, mechanicLocation]);

  useEffect(() => {
    if (metrics && onMetricsCalculated) {
      onMetricsCalculated(metrics.distance, metrics.eta);
    }
  }, [metrics, onMetricsCalculated]);

  const defaultCenter: [number, number] = driverLocation || mechanicLocation || [23.0225, 72.5714]; // Default Ahmedabad

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <MapContainer 
        center={defaultCenter} 
        zoom={14} 
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', background: '#0f172a' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        {driverLocation && mechanicLocation && (
          <Polyline 
            positions={[driverLocation, mechanicLocation]} 
            color="#3b82f6" 
            weight={4} 
            dashArray="10, 10" 
            opacity={0.6}
            className="animate-pulse"
          />
        )}

        {driverLocation && (
          <Marker position={driverLocation} icon={userIcon}>
            <Popup className="font-bold uppercase tracking-widest text-xs">Target Location</Popup>
          </Marker>
        )}

        {mechanicLocation && (
          <Marker position={mechanicLocation} icon={mechanicIcon}>
            <Popup className="font-bold uppercase tracking-widest text-xs">Dispatch Unit</Popup>
          </Marker>
        )}

        <MapFitter driverLoc={driverLocation} mechanicLoc={mechanicLocation} />
      </MapContainer>

      {/* Dark mode filter overlay for OpenStreetMap standard tiles */}
      <style>
         {`
           .map-tiles { filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(100%); transition: filter 1s ease; }
           .leaflet-container { background: #020617 !important; font-family: inherit; }
           .leaflet-popup-content-wrapper { background: #1e293b; color: white; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
           .leaflet-popup-tip { background: #1e293b; }
         `}
      </style>
    </div>
  );
};

export default MapTracker;
