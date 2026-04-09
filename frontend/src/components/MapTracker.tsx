import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapTrackerProps {
  driverLocation?: [number, number]; // [lat, lng]
  mechanicLocation?: [number, number]; // [lat, lng]
  selfLocation?: [number, number]; // [lat, lng] - Device's own live location
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
const selfIcon = L.divIcon({
  className: 'self-map-icon',
  html: `
    <div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2); display: flex; align-items: center; justify-content: center; border: 2px solid white;">
      <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
      <div class="pulse-ring"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

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
const MapFitter = ({ driverLoc, mechanicLoc, selfLoc }: { driverLoc?: [number, number], mechanicLoc?: [number, number], selfLoc?: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (driverLoc && mechanicLoc) {
      const bounds = L.latLngBounds([driverLoc, mechanicLoc]);
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 16 });
    } else if (driverLoc) {
      map.setView(driverLoc, 16);
    } else if (mechanicLoc) {
      map.setView(mechanicLoc, 16);
    } else if (selfLoc) {
      map.setView(selfLoc, 16);
    }
  }, [driverLoc, mechanicLoc, selfLoc, map]);
  return null;
};

const MapTracker: React.FC<MapTrackerProps> = ({ 
  driverLocation, 
  mechanicLocation, 
  selfLocation,
  onMetricsCalculated,
  className = "w-full h-full" 
}) => {

  // Safe Coordinate Protocol: Deep validation to prevent Leaflet crashes
  const isValidCoord = (coord?: [number, number]): coord is [number, number] => {
    return Array.isArray(coord) && 
           coord.length === 2 && 
           typeof coord[0] === 'number' && !isNaN(coord[0]) &&
           typeof coord[1] === 'number' && !isNaN(coord[1]);
  };

  const metrics = useMemo(() => {
    // Only calculate if both coordinates are operational and valid
    if (!isValidCoord(driverLocation) || !isValidCoord(mechanicLocation)) return null;
    
    const distKm = getDistance(driverLocation[0], driverLocation[1], mechanicLocation[0], mechanicLocation[1]);
    
    // Safety check for NaN results after distance calc
    if (isNaN(distKm)) return null;

    const speedKmPerMin = 0.5; // 30 km/h
    const timeMinutes = Math.ceil(distKm / speedKmPerMin);
    const displayDist = distKm < 0.1 ? "Nearby" : `${distKm.toFixed(2)} KM`;
    
    return {
      distance: displayDist,
      eta: Math.max(1, timeMinutes) 
    };
  }, [driverLocation, mechanicLocation]);

  useEffect(() => {
    if (metrics && onMetricsCalculated) {
      onMetricsCalculated(metrics.distance, metrics.eta);
    }
  }, [metrics, onMetricsCalculated]);

  const getSafeCenter = (): [number, number] => {
    if (isValidCoord(driverLocation)) return driverLocation;
    if (isValidCoord(mechanicLocation)) return mechanicLocation;
    if (isValidCoord(selfLocation)) return selfLocation;
    return [23.0225, 72.5714]; // Sector Default (Ahmedabad)
  };

  const defaultCenter = getSafeCenter();

  // Filter invalid markers to prevent LatLng errors
  const safeDriverLoc = isValidCoord(driverLocation) ? driverLocation : undefined;
  const safeMechLoc = isValidCoord(mechanicLocation) ? mechanicLocation : undefined;
  const safeSelfLoc = isValidCoord(selfLocation) ? selfLocation : undefined;

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
        
        {safeDriverLoc && safeMechLoc && (
          <Polyline 
            positions={[safeDriverLoc, safeMechLoc]} 
            color="#3b82f6" 
            weight={6} 
            opacity={0.8}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {safeDriverLoc && (
          <Marker position={safeDriverLoc as L.LatLngExpression} icon={userIcon}>
            <Popup className="font-bold uppercase tracking-widest text-xs">Target Location</Popup>
          </Marker>
        )}

        {safeMechLoc && (
          <Marker position={safeMechLoc as L.LatLngExpression} icon={mechanicIcon}>
            <Popup className="font-bold uppercase tracking-widest text-xs">Dispatch Unit</Popup>
          </Marker>
        )}
        
        {!safeDriverLoc && !safeMechLoc && safeSelfLoc && (
           <Marker position={safeSelfLoc as L.LatLngExpression} icon={selfIcon}>
             <Popup className="font-bold uppercase tracking-widest text-xs">Your Fleet Location</Popup>
           </Marker>
        )}

        <MapFitter driverLoc={safeDriverLoc} mechanicLoc={safeMechLoc} selfLoc={safeSelfLoc} />
      </MapContainer>
      <style>
         {`
           .custom-map-icon, .mechanic-map-icon, .user-map-icon { isolation: isolate; }
           .map-tiles { filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(100%); transition: filter 1s ease; }
           .leaflet-container { background: #020617 !important; font-family: inherit; }
           .leaflet-popup-content-wrapper { background: #1e293b; color: white; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
           .leaflet-popup-tip { background: #1e293b; }
           .pulse-ring {
             position: absolute;
             width: 48px;
             height: 48px;
             border: 2px solid #3b82f6;
             border-radius: 50%;
             animation: map-pulse 2s infinite;
             opacity: 0;
           }
           @keyframes map-pulse {
             0% { transform: scale(0.5); opacity: 0; }
             50% { opacity: 0.5; }
             100% { transform: scale(1.5); opacity: 0; }
           }
         `}
      </style>
    </div>
  );
};

export default MapTracker;
