import { useState, useEffect } from 'react';
import { 
  CircleDot, 
  Battery, 
  Wrench, 
  Truck, 
  MapPin, 
  Radar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../constants/navigationConstant';
import LocationPicker from '../../components/LocationPicker';
import { handleCreateJob } from '../../api/jobAPI';

const UserHome = () => {
    const navigate = useNavigate();
    const [appState, setAppState] = useState<'HOME' | 'SELECT_SERVICE' | 'SEARCHING_SOCKET'>('HOME');
    const [location, setLocation] = useState<any>(null);

    // Simulated Socket Matchmaking
    useEffect(() => {
        if (appState === 'SEARCHING_SOCKET') {
            const timer = setTimeout(() => navigate(USER_ROUTES.TRACK), 4000);
            return () => clearTimeout(timer);
        }
    }, [appState, navigate]);

    const handleServiceSelect = async (serviceType: string) => {
        if (!location) {
            alert("Strategic location mapping required for SOS dispatch.");
            return;
        }

        setAppState('SEARCHING_SOCKET');
        
        try {
            await handleCreateJob({
                service_type: serviceType,
                description: `Emergency ${serviceType} assistance requested.`,
                location: {
                    type: 'Point',
                    coordinates: location.coordinates,
                    address: location.address
                }
            });
        } catch (error) {
            console.error("Dispatch Protocol Failure:", error);
            // Fallback: Continue simulation for UI walkthrough stability
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
                               <div className="inline-flex items-center gap-2 px-3 xs:px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[7px] xs:text-[10px] font-black uppercase tracking-widest text-emerald-400 leading-none">
                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                   Dispatch Hub Active
                               </div>
                               <h2 className="text-3xl xs:text-5xl font-black text-white tracking-tighter leading-none italic uppercase">Vehicle Immobile?</h2>
                               <p className="text-slate-400 font-medium italic text-[11px] xs:text-base lg:text-lg lg:pr-4 max-w-[280px] xs:max-w-sm">Precision aid at the touch of a button. Elite partners standing by.</p>
                           </div>

                           <button 
                               onClick={() => setAppState('SELECT_SERVICE')}
                               className="group relative w-40 h-40 xs:w-64 xs:h-64 flex items-center justify-center transition-transform active:scale-90 duration-500"
                           >
                               <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-10 scale-125 duration-[4000ms]" />
                               <div className="absolute inset-0 bg-red-600 rounded-full animate-pulse opacity-20 scale-110" />
                               <div className="w-32 h-32 xs:w-52 xs:h-52 bg-gradient-to-tr from-red-700 to-rose-500 rounded-full shadow-[0_20px_50px_rgba(225,29,72,0.4)] flex flex-col items-center justify-center border-8 xs:border-[12px] border-white/10 hover:scale-105 transition-all duration-700 relative z-20">
                                    <span className="text-white text-3xl xs:text-5xl font-black italic tracking-tighter drop-shadow-2xl">S.O.S</span>
                                    <span className="text-white/60 text-[7px] xs:text-[9px] font-black uppercase tracking-widest mt-1 group-hover:text-white transition-colors">Immediate Aid</span>
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

                            <div className="grid grid-cols-2 gap-3 xs:gap-4">
                                {[
                                    { id: 'tire', name: 'Flat Tire', icon: CircleDot, style: 'bg-indigo-50 text-indigo-600' },
                                    { id: 'battery', name: 'Battery', icon: Battery, style: 'bg-emerald-50 text-emerald-600' },
                                    { id: 'engine', name: 'Engine', icon: Wrench, style: 'bg-rose-50 text-rose-600' },
                                    { id: 'towing', name: 'Towing', icon: Truck, style: 'bg-amber-50 text-amber-600' },
                                ].map((service) => (
                                    <button 
                                        key={service.id}
                                        onClick={() => handleServiceSelect(service.name)}
                                        className="flex flex-col items-center justify-center p-4 xs:p-6 bg-slate-50 border border-slate-100 rounded-2xl xs:rounded-[2.5rem] hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-300 group active:scale-95"
                                    >
                                        <div className={`w-10 h-10 xs:w-12 xs:h-12 rounded-xl xs:rounded-2xl ${service.style} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition duration-500`}>
                                            <service.icon size={20} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-[10px] xs:text-xs font-black text-slate-800 tracking-tight uppercase leading-tight">{service.name}</span>
                                    </button>
                                ))}
                            </div>

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
                            <div className="mt-12 text-center space-y-3 xs:space-y-4 max-w-lg">
                                <h4 className="text-2xl xs:text-3xl font-black text-white tracking-tighter italic uppercase">Scanning Sector</h4>
                                <p className="text-white/40 font-bold uppercase tracking-[0.3em] xs:tracking-[0.4em] text-[7px] xs:text-[8px] animate-pulse leading-relaxed">Establishing handshake with encrypted pool...</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default UserHome;
