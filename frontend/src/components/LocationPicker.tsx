import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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
  const [isLocating, setIsLocating] = useState(false);
  
  // SUGGESTION ENGINE STATE
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // FETCH SUGGESTIONS (Nominatim Search with persistent debounce protocol)
  useEffect(() => {
    // Only search if not currently using GPS and query is significant
    if (address.length < 3 || isLocating) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearching(true);
      try {
        const params = new URLSearchParams();
        params.append('q', address);
        params.append('format', 'json');
        params.append('addressdetails', '1');
        params.append('namedetails', '1');
        params.append('extratags', '1'); // Fetch deep POI metadata
        params.append('countrycodes', 'in');
        params.append('limit', '15');

        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        console.error('Tactical Mapping Failure:', error);
      } finally {
        setIsSearching(false);
      }
    }, 450); // 450ms Precision Debounce

    return () => clearTimeout(handler);
  }, [address, isLocating]);

  // HANDLE SUGGESTION SELECTION
  const handleSelectSuggestion = (s: any) => {
    const newCoords: [number, number] = [parseFloat(s.lon), parseFloat(s.lat)];
    
    // Construct highest-precision address string from components
    const addr = s.address;
    const POI = s.name || s.display_name.split(',')[0];
    const preciseParts = [
      POI,
      addr.road,
      addr.neighbourhood || addr.suburb,
      addr.city || addr.town || addr.village,
      addr.postcode
    ].filter(Boolean);
    
    // De-duplicate parts
    const uniqueParts = Array.from(new Set(preciseParts));
    const finalAddress = uniqueParts.join(', ');

    setAddress(finalAddress);
    setShowSuggestions(false);
    setSuggestions([]);
    
    onLocationChange({
      address: finalAddress,
      coordinates: newCoords
    });
  };

  // FREE: Reverse Geocoding Integration (OpenStreetMap Nominatim)
  const fetchDetailedAddress = async (lat: number, lng: number): Promise<string> => {
    console.log(`📡 Free Geocoding Handshake: Lat ${lat}, Lng ${lng}`);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { 'Accept-Language': 'en-US,en;q=0.9' } }
      );
      
      const data = await response.json();
      
      if (data && data.address) {
        const { road, neighbourhood, suburb, city, postcode } = data.address;
        const parts = [road, neighbourhood || suburb, city, postcode].filter(Boolean);
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
      toast.error("Geolocation hardware not detected on this node.");
      return;
    }

    setIsLocating(true);
    setShowSuggestions(false); 
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords: [number, number] = [longitude, latitude]; 
        const detailedAddress = await fetchDetailedAddress(latitude, longitude);
        
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
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Initial Sync
  useEffect(() => {
    handleLocateMe();
  }, []);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700 relative">
      <div className="relative group">
        {/* Visual Anchor Icon */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-500">
          <MapPin size={22} fill="currentColor" strokeWidth={2.5} className="fill-rose-500/20" />
        </div>

        {/* Editable Strategic Address Input */}
        <input 
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Acquiring Precise Identity..."
          className="w-full h-16 pl-14 pr-16 bg-white border-2 border-slate-100 rounded-3xl text-sm font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-lg shadow-slate-200/50 italic"
        />

        {/* Tactical Sync Button */}
        <button 
          onClick={handleLocateMe}
          disabled={isLocating}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-white transition-all shadow-sm active:scale-90"
        >
          {isLocating || isSearching ? (
            <Loader2 size={18} className="animate-spin text-blue-500" />
          ) : (
            <Target size={18} />
          )}
        </button>

        {/* INTELLIGENT SUGGESTIONS DROPDOWN */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-[500] animate-in slide-in-from-top-2 duration-300">
             <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Precision Sectors Identified</span>
                {isSearching && <Loader2 size={12} className="animate-spin text-blue-500" />}
             </div>
             <div className="max-h-72 overflow-y-auto">
                {suggestions.map((s, i) => {
                  const subTitle = [s.address?.road, s.address?.neighbourhood || s.address?.suburb].filter(Boolean).join(', ');
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full p-4 xs:p-5 flex items-start gap-4 hover:bg-slate-50 transition-all text-left border-b border-slate-50 last:border-none group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0">
                         <Navigation size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-black text-slate-950 tracking-tight leading-tight uppercase mb-0.5 line-clamp-1 italic">{s.name || subTitle || 'Sector Unknown'}</p>
                          <p className="text-[9px] font-bold text-slate-400 line-clamp-2 leading-relaxed uppercase tracking-tighter">{s.display_name}</p>
                      </div>
                    </button>
                  );
                })}
             </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default LocationPicker;
