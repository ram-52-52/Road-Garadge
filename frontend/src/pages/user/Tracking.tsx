import { 
  Phone, 
  Star, 
  MapPin,
  ArrowLeft,
  Activity,
  MessageSquare,
  Navigation,
  Radar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../constants/navigationConstant';
import { useJobStore } from '../../store/jobStore';
import { useState, useEffect } from 'react';
import ChatHUD from '../../components/chat/ChatHUD';
import MapTracker from '../../components/MapTracker';

const UserTracking = () => {
    const navigate = useNavigate();
    const { activeJob, fetchActiveJob } = useJobStore();
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    useEffect(() => {
        fetchActiveJob();
    }, []);

    if (!activeJob) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <Radar size={48} className="text-blue-500" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Synchronizing Hub...</p>
                </div>
            </div>
        );
    }
    
    // Map State
    // The mechanic's position: Live track if available, fallback to garage anchor
    const mechanicLoc = activeJob?.mechanic_location?.coordinates 
        ? [activeJob.mechanic_location.coordinates[1], activeJob.mechanic_location.coordinates[0]] as [number, number]
        : (activeJob?.garage_id as any)?.location?.coordinates 
            ? [(activeJob?.garage_id as any).location.coordinates[1], (activeJob?.garage_id as any).location.coordinates[0]] as [number, number]
            : undefined;

    const [liveDistance, setLiveDistance] = useState("---");
    const [liveEta, setLiveEta] = useState<number>(0);
    const [selfLocation, setSelfLocation] = useState<[number, number] | undefined>(undefined);

    const userLoc = activeJob?.location?.coordinates
        ? [activeJob.location.coordinates[1], activeJob.location.coordinates[0]] as [number, number]
        : undefined;

    // Local Watcher for User's Device

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

    // Store-based tracking replaces local socket listeners for cleaner state


    return (
        <div className="h-full flex-1 relative flex flex-col bg-slate-950 overflow-hidden">
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
                            setLiveDistance(dist);
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
            {/* Strategic Overlay HUD: Responsive & Precise */}
            <div className="relative z-30 flex-1 flex flex-col lg:flex-row p-4 xs:p-8 gap-4 xs:gap-8 pointer-events-none overflow-y-auto">
                {/* Spacer for Map priority on mobile */}
                <div className="flex-1 lg:hidden" />

                {/* Tactical HUD Column */}
                <div className="w-full lg:w-[450px] flex flex-col gap-4 xs:gap-6 pointer-events-auto animate-in slide-in-from-bottom-10 lg:slide-in-from-right-10 duration-700">
                    {activeJob && activeJob.status !== 'PENDING' ? (
                        <>
                             {/* Mechanic Status & Profile Card */}
                             <div className="bg-slate-900/90 backdrop-blur-3xl p-6 xs:p-8 rounded-[2rem] xs:rounded-[3rem] border border-white/10 shadow-2xl flex flex-col gap-6 xs:gap-8">
                                <div className="space-y-6">
                                    {/* Status Indicator */}
                                    <div className="inline-flex px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">
                                            {activeJob.status === 'ACCEPTED' ? 'Preparing Unit' : 
                                             activeJob.status === 'EN_ROUTE' ? 'Unit In Motion' : 
                                             activeJob.status === 'COMPLETED' ? 'Mission Accomplished' :
                                             activeJob.status}
                                        </span>
                                    </div>

                                    {/* Profile Header */}
                                    <div className="flex items-center gap-4 xs:gap-5">
                                        <div className="w-14 h-14 xs:w-16 xs:h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white font-black italic text-lg xs:text-xl">
                                            {(activeJob.garage_id as any)?.name?.charAt(0) || 'G'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg xs:text-xl font-black text-white italic tracking-tighter uppercase truncate">
                                                {(activeJob.garage_id as any)?.name || 'Matching Unit...'}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4.9 Trusted Partner</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/5 w-full" />

                                    {/* Live Metrics: Visibility Locked until Logic Syncs */}
                                    {liveDistance !== "---" && (
                                        <div className="space-y-2 xs:space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Position Data</p>
                                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Live Distance</p>
                                                    <p className="text-xl font-black text-white italic tracking-tighter truncate">{liveDistance}</p>
                                                </div>
                                                <div className="text-right min-w-0">
                                                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Time Remaining</p>
                                                    <p className="text-xl font-black text-blue-400 italic tracking-tighter truncate">{liveEta} MIN</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Service Requirement HUD */}
                                    <div className="space-y-2 xs:space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Target Requirement</p>
                                        <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl flex items-center gap-4">
                                            <Activity className="text-blue-500 shrink-0" size={20} />
                                            <span className="text-xs font-black text-slate-200 uppercase tracking-tight truncate">
                                                {activeJob.service_type || (Array.isArray(activeJob.services) ? activeJob.services.join(' + ') : 'Rescue Mission')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Row */}
                                    <div className="flex flex-col gap-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => setIsChatOpen(!isChatOpen)}
                                                className={`h-14 xs:h-16 rounded-2xl flex items-center justify-center gap-2 border transition duration-300 ${
                                                    isChatOpen ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                                }`}
                                            >
                                                <MessageSquare size={18} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Chat</span>
                                            </button>
                                            <a 
                                                href={`tel:${(activeJob.garage_id as any)?.phone || '+919999999999'}`}
                                                className="h-14 xs:h-16 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl flex items-center justify-center gap-2 transition duration-300 shadow-xl"
                                            >
                                                <Phone size={18} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
                                            </a>
                                        </div>
                                        
                                        <a 
                                            href={
                                                mechanicLoc && userLoc && mechanicLoc[0] && userLoc[0]
                                                ? `https://www.google.com/maps/dir/?api=1&origin=${userLoc[0]},${userLoc[1]}&destination=${mechanicLoc[0]},${mechanicLoc[1]}&travelmode=driving`
                                                : '#'
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full h-14 xs:h-16 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] transition active:scale-95 flex items-center justify-center gap-3 group"
                                        >
                                            <Navigation size={18} className="group-hover:rotate-12 transition-transform" />
                                            Live Google Maps
                                        </a>
                                    </div>
                                    <p className="text-[8px] text-center text-slate-600 uppercase tracking-[0.2em] italic mt-2">Mission ID: {activeJob?._id?.slice(-8).toUpperCase() || 'SYNCHRONIZING'}</p>
                                </div>
                             </div>

                             {/* Location HUD Card */}
                             <div className="bg-slate-900/90 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 shadow-xl flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <MapPin size={18} className="text-blue-500 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Rescue Destination</p>
                                        <p className="text-[10px] font-black text-white uppercase italic truncate">
                                            {activeJob.location.address}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5 w-full" />
                                <div className="flex items-center gap-4">
                                    <Navigation size={18} className="text-emerald-500 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Mechanic Base (Garage)</p>
                                        <p className="text-[10px] font-black text-slate-200 uppercase italic truncate">
                                            {(activeJob.garage_id as any)?.location?.address || 'Locating Base...'}
                                        </p>
                                    </div>
                                </div>
                             </div>
                        </>
                    ) : activeJob?.status === 'COMPLETED' ? (
                        <div className="bg-slate-900/95 backdrop-blur-3xl p-8 xs:p-12 rounded-[2.5rem] xs:rounded-[3rem] border border-emerald-500/30 flex flex-col items-center justify-center text-center space-y-8 xs:space-y-10 shadow-2xl animate-in zoom-in duration-700 pointer-events-auto">
                             <div className="w-20 h-20 xs:w-24 xs:h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-bounce">
                                <Activity size={40} className="text-white" />
                             </div>
                             <div className="space-y-4">
                                <h2 className="text-2xl xs:text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Mission Success</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-relaxed">Assistance mission finalized. Safety protocol secured.</p>
                             </div>
                             <button 
                                onClick={async () => {
                                    const { setActiveJob } = (await import('../../store/jobStore')).useJobStore.getState();
                                    setActiveJob(null);
                                    navigate(USER_ROUTES.HOME);
                                }}
                                className="w-full h-16 bg-white text-slate-950 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] transition active:scale-95 shadow-xl"
                             >
                                Confirm & Return Home
                             </button>
                        </div>
                    ) : activeJob?.status === 'PENDING' ? (
                        <div className="bg-slate-950/90 backdrop-blur-3xl p-8 xs:p-12 rounded-[2.5rem] xs:rounded-[3rem] border border-blue-500/20 flex flex-col items-center justify-center text-center space-y-8 xs:space-y-10 shadow-2xl animate-in zoom-in duration-500">
                             <div className="relative w-24 h-24 xs:w-32 xs:h-32 flex items-center justify-center">
                                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-10 scale-150" />
                                <div className="w-16 h-16 xs:w-20 xs:h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl relative z-10 animate-bounce">
                                    <Radar size={32} className="text-white" />
                                </div>
                             </div>
                             <div className="space-y-4">
                                <h2 className="text-xl xs:text-2xl font-black text-white italic uppercase tracking-tighter">Sector Scanning</h2>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-relaxed max-w-[200px] mx-auto">Broadcasting distress signal. Monitoring for scout unit acceptance.</p>
                             </div>
                             <button 
                                onClick={async () => {
                                    const { cancelActiveJob } = (await import('../../store/jobStore')).useJobStore.getState();
                                    await cancelActiveJob();
                                    navigate(USER_ROUTES.HOME);
                                }}
                                className="w-full h-14 xs:h-16 bg-white/5 hover:bg-red-600/20 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all"
                             >
                                Decommission SOS
                             </button>
                        </div>
                    ) : (
                        <div className="bg-slate-900/90 backdrop-blur-3xl p-8 xs:p-10 rounded-[2.5rem] xs:rounded-[3rem] border border-white/10 shadow-2xl space-y-6 xs:space-y-8 flex flex-col items-center text-center">
                             <div className="w-16 h-16 xs:w-20 xs:h-20 bg-blue-600/10 rounded-[2rem] border border-blue-500/20 flex items-center justify-center text-blue-500">
                                 <Radar size={32} className="animate-pulse" />
                             </div>
                             <div className="space-y-3">
                                 <h3 className="text-lg xs:text-xl font-black text-white italic uppercase tracking-wider">Mission Standby</h3>
                                 <p className="text-[9px] xs:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-[280px]">
                                     Elite mechanic data will materialize here once you initiate an SOS protocol on the Home Hub. 
                                 </p>
                             </div>
                             <div className="h-px bg-white/5 w-full" />
                             <button 
                                onClick={() => navigate(USER_ROUTES.HOME)}
                                className="w-full h-14 xs:h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl"
                             >
                                Initiate SOS Request
                             </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Float Chat HUD: Responsive Postioning */}
            {isChatOpen && activeJob && (
                <div className="fixed bottom-4 xs:bottom-8 right-4 xs:right-8 w-[calc(100vw-2rem)] xs:w-96 z-[150] animate-in slide-in-from-bottom-5 duration-500 shadow-2xl">
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
