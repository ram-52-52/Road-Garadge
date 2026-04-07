import { useState, useEffect } from 'react';
import { MapPin, Target, Loader2, Navigation } from 'lucide-react';

interface LocationData {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface LocationPickerProps {
  onLocationChange: (data: LocationData) => void;
}

const LocationPicker = ({ onLocationChange }: LocationPickerProps) => {
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // FREE: Reverse Geocoding Integration (OpenStreetMap Nominatim)
  const fetchDetailedAddress = async (lat: number, lng: number): Promise<string> => {
    console.log(`📡 Free Geocoding Handshake: Lat ${lat}, Lng ${lng}`);
    
    try {
      // Nominatim Usage Policy suggests a descriptive User-Agent or Referer in production
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.address) {
        const { road, neighbourhood, suburb, city, postcode } = data.address;
        
        // Construct a high-precision address string from available OSM nodes
        const parts = [
          road,
          neighbourhood || suburb,
          city,
          postcode
        ].filter(Boolean);
        
        return parts.length > 0 ? parts.join(', ') : data.display_name;
      }
      
      return data.display_name || "Location Identified (No Detail)";
    } catch (error) {
      console.error("OSM Protocol Failure:", error);
      return "Network Error - Please Configure Manually";
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation hardware not detected on this node.");
      return;
    }

    setIsLocating(true);
    
    // HIGH-ACCURACY GPS PROTOCOL
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Ensure EXACT street-level coordinates for mechanic dispatch
        const newCoords: [number, number] = [longitude, latitude]; // [lng, lat] for GeoJSON
        
        const detailedAddress = await fetchDetailedAddress(latitude, longitude);
        
        setCoords(newCoords);
        setAddress(detailedAddress);
        setIsLocating(false);
        
        onLocationChange({
          address: detailedAddress,
          coordinates: newCoords
        });
      },
      (error) => {
        console.error("GPS Lock Error:", error);
        setIsLocating(false);
        let msg = "Unable to confirm GPS Lock.";
        if (error.code === error.TIMEOUT) msg = "GPS Lock Timeout (10s reached).";
        alert(msg);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };

  // Initial Sync
  useEffect(() => {
    handleLocateMe();
  }, []);

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    if (coords) {
      onLocationChange({
        address: newAddress,
        coordinates: coords
      });
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="relative group">
        {/* Visual Anchor Icon */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-500">
          <MapPin size={22} fill="currentColor" strokeWidth={2.5} className="fill-rose-500/20" />
        </div>

        {/* Editable Strategic Address Input */}
        <input 
          type="text"
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="Acquiring Precise Identity..."
          className="w-full h-16 pl-14 pr-16 bg-white border-2 border-slate-100 rounded-3xl text-sm font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-lg shadow-slate-200/50 italic italic"
        />

        {/* Tactical Sync Button */}
        <button 
          onClick={handleLocateMe}
          disabled={isLocating}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-white transition-all shadow-sm active:scale-90"
        >
          {isLocating ? (
            <Loader2 size={18} className="animate-spin text-blue-500" />
          ) : (
            <Target size={18} />
          )}
        </button>
      </div>

      {/* Connection Optimization HUD */}
      {!isLocating && address && (
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in zoom-in duration-500">
           <Navigation size={14} className="text-emerald-500" />
           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">High-Precision Uplink Established</span>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
