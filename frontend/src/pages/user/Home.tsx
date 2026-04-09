import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  CircleDot, 
  Battery, 
  Truck, 
  MapPin, 
  Radar,
  CheckCircle2,
  Fuel,
  Disc,
  Wind,
  Droplet,
  Settings,
  Cog
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../constants/navigationConstant';
import LocationPicker from '../../components/LocationPicker';
import { handleCreateJob } from '../../api/jobAPI';
import { useJobStore } from '../../store/jobStore';

const UserHome = () => {
    const navigate = useNavigate();
    const { activeJob } = useJobStore();
    const [appState, setAppState] = useState<'HOME' | 'SELECT_SERVICE' | 'SEARCHING_SOCKET'>('HOME');
    const [location, setLocation] = useState<any>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Deep Scanning Persistence Hook: Restore Radar if SOS is still active on-mount
    useEffect(() => {
        if (activeJob?.status === 'PENDING') {
            setAppState('SEARCHING_SOCKET');
            setIsSearching(true);
        }
    }, [activeJob]);

    // Precise Strategic Redirection: Only move to tracking once a mechanic explicitly accepts
    useEffect(() => {
        // Condition: Must have an active job AND be in a searching flow AND status must have advanced beyond PENDING
        if (activeJob && isSearching && activeJob.status !== 'PENDING') {
            console.log('🚀 Tactical Transition Triggered:', activeJob.status);
            navigate(USER_ROUTES.TRACK);
        }
    }, [activeJob?.status, isSearching, navigate]);

    const toggleService = (service: string) => {
        setSelectedServices(prev => 
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        );
    };

    const handleSOSDispatch = async () => {
        if (!location) {
            toast.error("Strategic location mapping required for SOS dispatch.");
            return;
        }

        if (selectedServices.length === 0) {
            toast.error("Select at least one operational requirement.");
            return;
        }

        setAppState('SEARCHING_SOCKET');
        setIsSearching(true);
        
        try {
            await handleCreateJob({
                services: selectedServices,
                description: `Emergency ${selectedServices.join(' + ')} assistance requested.`,
                location: {
                    type: 'Point',
                    coordinates: location.coordinates,
                    address: location.address
                }
            });
        } catch (error) {
            console.error("Dispatch Protocol Failure:", error);
        }
    };

    return (
        <div className="min-h-full relative flex flex-col bg-slate-950">
            {/* Immersive Map Canvas Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-slate-900" />
                <div className="absolute inset-0 opacity-[0.1]" 
                    style={{ 
                        backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', 
                        backgroundSize: '40px 40px' 
                    }} 
                />
                
                {/* Pulsing Location Anchor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.8)] relative z-10 border-4 border-slate-950" />
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 scale-[3] duration-[3000ms]" />
                </div>
            </div>

            {/* Foreground Controls */}
            <div className="relative z-10 flex-1 flex flex-col p-4 xs:p-8 pointer-events-none">
                <div className="flex-1 flex flex-col justify-center pointer-events-auto items-center xs:items-start">
                    
                    {/* THE SOS CONTROL */}
                    {appState === 'HOME' && (
                       <div className="space-y-8 xs:space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000 flex flex-col items-center xs:items-start text-center xs:text-left pt-6 xs:pt-0">
                           <div className="space-y-3 xs:space-y-4">
                               <div className="inline-flex items-center gap-1.5 xs:gap-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[6px] xs:text-[10px] font-black uppercase tracking-widest text-emerald-400 leading-none">
                                   <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                   Dispatch Hub Active
                               </div>
                               <h2 className="text-xl xs:text-5xl font-black text-white tracking-tighter leading-none italic uppercase">Vehicle Immobile?</h2>
                               <p className="text-slate-400 font-medium italic text-[10px] xs:text-base lg:text-lg lg:pr-4 max-w-[240px] xs:max-w-sm">Precision aid at the touch of a button. Elite partners standing by.</p>
                           </div>

                           <button 
                               onClick={() => setAppState('SELECT_SERVICE')}
                               className="group relative w-40 h-40 xs:w-64 xs:h-64 flex items-center justify-center transition-transform active:scale-90 duration-500"
                           >
                               <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-10 scale-125 duration-[4000ms]" />
                               <div className="absolute inset-0 bg-red-600 rounded-full animate-pulse opacity-20 scale-110" />
                               <div className="w-24 h-24 xs:w-52 xs:h-52 bg-gradient-to-tr from-red-700 to-rose-500 rounded-full shadow-[0_20px_50px_rgba(225,29,72,0.4)] flex flex-col items-center justify-center border-4 xs:border-[12px] border-white/10 hover:scale-105 transition-all duration-700 relative z-20">
                                    <span className="text-white text-base xs:text-5xl font-black italic tracking-tighter drop-shadow-2xl">S.O.S</span>
                                    <span className="text-white/60 text-[5px] xs:text-[9px] font-black uppercase tracking-widest mt-0.5 group-hover:text-white transition-colors">Immediate Aid</span>
                               </div>
                           </button>
                       </div>
                    )}

                    {/* SERVICE GRID */}
                    {appState === 'SELECT_SERVICE' && (
                        <div className="bg-white rounded-[2rem] xs:rounded-[3rem] p-6 xs:p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-100 flex flex-col space-y-6 xs:space-y-8 animate-in slide-in-from-left-40 duration-700 w-full max-w-sm pointer-events-auto">
                            <div className="space-y-1 text-center xs:text-left">
                                <h3 className="text-2xl xs:text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Select Logistics</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] xs:text-[10px]">Dispatching elite mechanics to your anchor</p>
                            </div>

                            {/* Location Precise Picker HUD */}
                            <LocationPicker onLocationChange={(data) => setLocation(data)} />

                             <div className="grid grid-cols-2 gap-2 xs:gap-3 max-h-[40vh] overflow-y-auto pr-1 scrollbar-hide">
                                 {[
                                     { id: 'tire', name: 'Tyre Puncture', icon: CircleDot, style: 'from-indigo-500 to-blue-600' },
                                     { id: 'battery', name: 'Battery Jump Start', icon: Battery, style: 'from-emerald-500 to-teal-600' },
                                     { id: 'engine', name: 'Engine Failure', icon: Cog, style: 'from-rose-500 to-pink-600' },
                                     { id: 'fuel', name: 'Fuel Delivery', icon: Fuel, style: 'from-amber-500 to-orange-600' },
                                     { id: 'towing', name: 'Towing', icon: Truck, style: 'from-slate-600 to-slate-800' },
                                     { id: 'brake', name: 'Brake Repair', icon: Disc, style: 'from-red-600 to-rose-700' },
                                     { id: 'ac', name: 'AC Repair', icon: Wind, style: 'from-cyan-400 to-blue-500' },
                                     { id: 'oil', name: 'Oil Change', icon: Droplet, style: 'from-yellow-600 to-amber-700' },
                                     { id: 'general', name: 'General Service', icon: Settings, style: 'from-blue-600 to-indigo-700' },
                                 ].map((service) => {
                                     const isSelected = selectedServices.includes(service.name);
                                     return (
                                        <button 
                                            key={service.id}
                                            onClick={() => toggleService(service.name)}
                                            className={`flex flex-col items-center justify-center p-3 xs:p-4 rounded-2xl xs:rounded-[2rem] border transition-all duration-500 group relative overflow-hidden ${
                                                isSelected 
                                                ? 'bg-slate-900 border-slate-900 scale-95 shadow-lg shadow-slate-900/20' 
                                                : 'bg-slate-50 border-slate-100 hover:border-blue-200'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 xs:w-10 xs:h-10 rounded-xl bg-gradient-to-tr ${service.style} flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition duration-500 relative z-10`}>
                                                <service.icon size={16} className="text-white" strokeWidth={2.5} />
                                            </div>
                                            <span className={`text-[8px] xs:text-[10px] font-black tracking-tight uppercase leading-none text-center relative z-10 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                                {service.name}
                                            </span>
                                            {isSelected && (
                                                <CheckCircle2 size={12} className="absolute top-2 right-2 text-emerald-400 animate-in zoom-in duration-300" />
                                            )}
                                        </button>
                                     );
                                 })}
                             </div>

                             {selectedServices.length > 0 && (
                                <button 
                                    onClick={handleSOSDispatch}
                                    className="w-full h-14 xs:h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl xs:rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] xs:text-xs transition-all shadow-xl shadow-blue-500/20 animate-in slide-in-from-bottom-4 duration-500"
                                >
                                    Initiate SOS Dispatch ({selectedServices.length})
                                </button>
                             )}

                            <button 
                                onClick={() => setAppState('HOME')}
                                className="w-full text-[8px] xs:text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.3em] xs:tracking-[0.4em] py-2"
                            >
                                Dismiss Protocol
                            </button>
                        </div>
                    )}

                    {/* SEARCHING RADAR */}
                    {appState === 'SEARCHING_SOCKET' && (
                        <div className="absolute inset-0 z-[60] bg-slate-950/95 backdrop-blur-3xl flex flex-col items-center justify-center px-8 xs:px-12 animate-in fade-in duration-1000">
                             <div className="relative w-64 h-64 xs:w-72 xs:h-72 lg:w-96 lg:h-96 flex items-center justify-center">
                                <div className="absolute inset-0 border border-white/5 rounded-full" />
                                <div className="absolute inset-8 xs:inset-12 border border-white/5 rounded-full" />
                                <div className="absolute inset-16 xs:inset-24 border border-white/5 rounded-full" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-full rounded-full border-[2px] border-blue-500 animate-[ping_3s_linear_infinite] opacity-10" />
                                </div>
                                <div className="absolute inset-0 animate-spin-slow opacity-20">
                                    <Radar size="100%" className="text-blue-500/20" strokeWidth={0.5} />
                                </div>
                                <div className="w-16 h-16 xs:w-20 xs:h-20 bg-blue-600 rounded-2xl xs:rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/50 relative z-10 animate-bounce">
                                    <MapPin size={28} className="text-white" />
                                </div>
                            </div>
                             <div className="mt-12 text-center space-y-6 xs:space-y-8 max-w-lg">
                                <div className="space-y-3 xs:space-y-4">
                                    <h4 className="text-2xl xs:text-3xl font-black text-white tracking-tighter italic uppercase">Scanning Sector</h4>
                                    <p className="text-white/40 font-bold uppercase tracking-[0.3em] xs:tracking-[0.4em] text-[7px] xs:text-[8px] animate-pulse leading-relaxed">Establishing handshake with encrypted pool...</p>
                                </div>

                                <button 
                                    onClick={async () => {
                                        try {
                                            const { cancelActiveJob } = (await import('../../store/jobStore')).useJobStore.getState();
                                            await cancelActiveJob();
                                            setIsSearching(false);
                                            setAppState('HOME');
                                            toast.success("Strategic SOS Terminated");
                                        } catch (err) {
                                            toast.error("Termination Failed: Mission locked/accepted.");
                                        }
                                    }}
                                    className="w-full h-14 xs:h-16 bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/50 rounded-2xl text-[8px] xs:text-[10px] font-black text-white uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 group"
                                >
                                    <div className="w-1 h-1 rounded-full bg-red-500 group-hover:animate-ping" />
                                    Terminate Mission Protocol
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default UserHome;
