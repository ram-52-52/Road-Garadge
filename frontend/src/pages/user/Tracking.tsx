import { 
  Phone, 
  Star, 
  MapPin,
  ArrowLeft,
  Activity,
  MessageSquare,
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../constants/navigationConstant';
import { useJobStore } from '../../store/jobStore';
import { useState, useEffect } from 'react';
import ChatHUD from '../../components/chat/ChatHUD';
import { socket } from '../../services/socket';
import MapTracker from '../../components/MapTracker';

const UserTracking = () => {
    const navigate = useNavigate();
    const { activeJob, fetchActiveJob } = useJobStore();
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    useEffect(() => {
        fetchActiveJob();
    }, []);
    
    // Map State
    const [mechanicLoc, setMechanicLoc] = useState<[number, number] | undefined>(
         activeJob && (activeJob?.garage_id as any)?.location?.coordinates 
             ? [(activeJob?.garage_id as any).location.coordinates[1], (activeJob?.garage_id as any).location.coordinates[0]] 
             : undefined
    );
    const [liveDistance, setLiveDistance] = useState("---");
    const [liveEta, setLiveEta] = useState<number>(0);
    const [selfLocation, setSelfLocation] = useState<[number, number] | undefined>(undefined);

    const userLoc = activeJob?.location?.coordinates
        ? [activeJob.location.coordinates[1], activeJob.location.coordinates[0]] as [number, number]
        : undefined;

    useEffect(() => {
        if (activeJob && !mechanicLoc) {
             const coords = (activeJob.garage_id as any)?.location?.coordinates;
             if (coords) {
                 setMechanicLoc([coords[1], coords[0]]);
             }
        }
    }, [activeJob, mechanicLoc]);

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => setSelfLocation([pos.coords.latitude, pos.coords.longitude]),
                (err) => console.error("Self Track Error:", err),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    useEffect(() => {
        const handleLocation = (data: any) => {
            if (activeJob && data.jobId === activeJob._id) {
                setMechanicLoc([data.coordinates[1], data.coordinates[0]]);
            }
        };
        socket.on('mechanic:location', handleLocation);
        return () => {
            socket.off('mechanic:location', handleLocation);
        };
    }, [activeJob]);

    return (
        <div className="min-h-full relative flex flex-col bg-slate-950 overflow-hidden">
            {/* Immersive Navigation Background */}
            <div className="absolute inset-0 z-0 scale-110">
                <div className="absolute inset-0 bg-slate-900" />
                <div className="absolute inset-0 opacity-[0.2]" 
                    style={{ 
                        backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', 
                        backgroundSize: '40px 40px' 
                    }} 
                />
                
                {/* Real-time OpenStreetMap / Leaflet Integration */}
                <div className="absolute inset-0 border-b border-blue-900/50">
                    <MapTracker 
                        driverLocation={userLoc}
                        mechanicLocation={mechanicLoc}
                        selfLocation={selfLocation}
                        onMetricsCalculated={(dist, eta) => {
                            setLiveDistance(`${dist} KM`);
                            setLiveEta(eta);
                        }}
                    />
                </div>
            </div>

            {/* Nav & Status Header HUD */}
            <div className="relative z-20 p-8 flex items-center justify-between pointer-events-none">
                <button 
                    onClick={() => navigate(USER_ROUTES.HOME)} 
                    className="p-4 bg-slate-900/50 backdrop-blur-3xl rounded-2xl border border-white/5 hover:bg-white/5 transition duration-500 flex items-center gap-3 group pointer-events-auto shadow-2xl"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Home Hub</span>
                </button>

                {!activeJob && (
                    <div className="bg-slate-900/80 backdrop-blur-3xl px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4 animate-in fade-in zoom-in duration-1000">
                         <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                             <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">System Standby</span>
                         </div>
                         <div className="h-4 w-px bg-white/10" />
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sector Active</span>
                    </div>
                )}
            </div>

            {/* Main Content Area (Sidebar Layout - Desktop Only) */}
            <div className="absolute inset-y-0 right-0 z-30 w-[450px] p-8 hidden lg:flex flex-col gap-6 pointer-events-none">
                {activeJob && (
                     <div className="w-full h-full flex flex-col gap-6 pointer-events-auto animate-in slide-in-from-right-10 duration-700">
                        {/* Status HUD Card */}
                        <div className="flex-1 bg-slate-900/80 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto custom-scrollbar">
                            <div className="space-y-8">
                                {/* Status Toggle Label */}
                                <div className="inline-flex px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">
                                        {activeJob.status === 'ACCEPTED' ? 'Preparing Unit' : 
                                         activeJob.status === 'EN_ROUTE' ? 'Unit In Motion' : 
                                         activeJob.status}
                                    </span>
                                </div>

                                {/* Mechanic Profile */}
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white font-black italic text-xl">
                                        {(activeJob.garage_id as any)?.name?.charAt(0) || 'G'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase truncate w-60">
                                            {(activeJob.garage_id as any)?.name || 'Matching Mechanic...'}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Star size={12} className="text-amber-400 fill-amber-400" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4.9 Trusted</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 w-full" />

                                {/* Tactics & Metrics */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Position Data</p>
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Live Distance</p>
                                                <p className="text-xl font-black text-white italic tracking-tighter">{liveDistance}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Time Remaining</p>
                                                <p className="text-xl font-black text-blue-400 italic tracking-tighter">{liveEta} MIN</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Target Requirement</p>
                                        <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex items-center gap-4">
                                            <Activity className="text-blue-500" size={20} />
                                            <span className="text-xs font-black text-slate-200 uppercase tracking-tight truncate">
                                                {activeJob.service_type || (Array.isArray(activeJob.services) ? activeJob.services.join(' + ') : 'Rescue')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tactical Actions */}
                            <div className="mt-8 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => setIsChatOpen(!isChatOpen)}
                                        className={`h-16 rounded-2xl flex items-center justify-center gap-2 border transition duration-300 ${
                                            isChatOpen ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                        }`}
                                    >
                                        <MessageSquare size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Chat</span>
                                    </button>
                                    <a 
                                        href="tel:+919999999999"
                                        className="h-16 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl flex items-center justify-center gap-2 transition duration-300 shadow-lg shadow-emerald-500/20"
                                    >
                                        <Phone size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Support</span>
                                    </a>
                                </div>
                                <a 
                                    href={
                                        mechanicLoc && userLoc
                                        ? `https://www.google.com/maps/dir/?api=1&origin=${userLoc[0]},${userLoc[1]}&destination=${mechanicLoc[0]},${mechanicLoc[1]}&travelmode=driving`
                                        : '#'
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full h-18 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] transition active:scale-95 flex items-center justify-center gap-3 shadow-lg group"
                                >
                                    <Navigation size={18} />
                                    Open Google Maps
                                </a>
                                <p className="text-[8px] text-center text-slate-600 uppercase tracking-[0.2em] italic mt-2">Mission ID: {activeJob._id.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>

                        {/* Destination HUD */}
                        <div className="bg-slate-900/80 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-xl flex items-center gap-4">
                            <MapPin size={18} className="text-blue-500" />
                            <div className="min-w-0">
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Position</p>
                                <p className="text-[10px] font-black text-white uppercase italic truncate">
                                    {activeJob.location.address}
                                </p>
                            </div>
                        </div>
                     </div>
                )}
            </div>

            {/* Responsive Bottom HUD (Shown on Mobile & Tablet) - Boosted bottom to avoid nav overlap */}
            <div className="lg:hidden fixed bottom-28 xs:bottom-32 left-0 right-0 z-40 p-4 animate-in slide-in-from-bottom-10 duration-700">
                {activeJob && (
                    <div className="bg-slate-900/95 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg">
                                   {(activeJob.garage_id as any)?.name?.charAt(0) || 'G'}
                               </div>
                               <div>
                                   <div className="flex items-center gap-2 mb-1">
                                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                       <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{liveDistance} • {liveEta} MIN</p>
                                   </div>
                                   <p className="text-sm font-black text-white uppercase italic truncate w-40">{(activeJob.garage_id as any)?.name}</p>
                               </div>
                            </div>
                            <div className="flex gap-2">
                                 <button 
                                    onClick={() => setIsChatOpen(!isChatOpen)} 
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isChatOpen ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 border border-white/5'}`}
                                 >
                                     <MessageSquare size={18} />
                                 </button>
                                 <a href="tel:+919999999999" className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                     <Phone size={18} />
                                 </a>
                            </div>
                        </div>
                        
                        {/* Compact Location Footer */}
                        <div className="px-4 py-3 bg-white/5 rounded-2xl flex items-center gap-3 border border-white/5">
                            <MapPin size={14} className="text-blue-500 flex-shrink-0" />
                            <p className="text-[9px] font-black text-slate-400 uppercase italic truncate">{activeJob.location.address}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Chat HUD */}
            {isChatOpen && activeJob && (
                <div className="fixed bottom-24 xs:bottom-32 left-1/2 -translate-x-1/2 xs:left-auto xs:right-8 xs:translate-x-0 w-[90vw] xs:w-96 z-[150] animate-in slide-in-from-bottom-5 duration-500 shadow-2xl">
                    <ChatHUD 
                        jobId={activeJob._id} 
                        recipientId={(activeJob.garage_id as any)?.owner_id || (activeJob.garage_id as any)?._id || (typeof activeJob.garage_id === 'string' ? activeJob.garage_id : '')} 
                        onClose={() => setIsChatOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default UserTracking;
