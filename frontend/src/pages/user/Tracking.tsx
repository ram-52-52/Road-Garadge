import { 
  Phone, 
  ShieldCheck, 
  Star, 
  ChevronRight,
  MapPin,
  Clock,
  ArrowLeft,
  Activity,
  MessageSquare,
  Headphones,
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

    const userLoc = activeJob?.location?.coordinates
        ? [activeJob.location.coordinates[1], activeJob.location.coordinates[0]] as [number, number]
        : undefined;

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
                        onMetricsCalculated={(dist, eta) => {
                            setLiveDistance(`${dist} KM`);
                            setLiveEta(eta);
                        }}
                    />
                </div>
            </div>

            {/* Back Button HUD */}
            <div className="relative z-20 p-8">
                <button 
                    onClick={() => navigate(USER_ROUTES.HOME)} 
                    className="p-4 bg-slate-900/50 backdrop-blur-3xl rounded-2xl border border-white/5 hover:bg-white/5 transition duration-500 flex items-center gap-3 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Home Hub</span>
                </button>
            </div>

            {/* Main Content Area (Centered) */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-8">
                {activeJob ? (
                     <div className="w-full max-w-2xl space-y-6 animate-in zoom-in-95 duration-700">
                        {/* Status Label */}
                        <div className="flex justify-center">
                            <div className="px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">
                                    {activeJob.status === 'ACCEPTED' ? 'Partner Dispatching: Unit Preparing' : 
                                     activeJob.status === 'EN_ROUTE' ? 'Tactical Interception: Unit In Motion' : 
                                     `Mission Status: ${activeJob.status}`}
                                </span>
                            </div>
                        </div>

                        {/* Tracking Status Card (Centered & Expansive) */}
                        <div className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/10 shadow-2xl space-y-10">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pb-8 border-b border-white/5">
                                <div className="flex items-center gap-6 text-center sm:text-left">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 text-white font-black italic text-2xl">
                                        {(activeJob.garage_id as any)?.name?.charAt(0) || 'G'}
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                                            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase line-clamp-1">
                                                {(activeJob.garage_id as any)?.name || 'Matching Mechanic...'}
                                            </h3>
                                            <ShieldCheck size={20} className="text-blue-400 shrink-0" />
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-start gap-1.5">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                                <span className="text-xs font-black text-white tracking-widest italic">4.9 Strategic Trust</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setIsChatOpen(!isChatOpen)}
                                        className={`w-14 h-14 xs:w-16 xs:h-16 rounded-2xl flex items-center justify-center shadow-2xl transition active:scale-90 border ${
                                            isChatOpen ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/30' : 'bg-slate-800 border-white/5 text-slate-400'
                                        }`}
                                    >
                                        <MessageSquare size={22} />
                                    </button>
                                    {/* MASKED COMPANY NUMBER — user calls us, we route to mechanic */}
                                    <a 
                                        href="tel:+919999999999"
                                        className="flex flex-col items-center justify-center w-auto px-5 h-14 xs:h-16 bg-emerald-500 rounded-2xl text-white shadow-2xl shadow-emerald-500/20 active:scale-90 transition group gap-0.5"
                                        title="Call GarageNow Support — we will connect you to your mechanic"
                                    >
                                        <Headphones size={18} className="group-hover:animate-bounce" />
                                        <span className="text-[7px] font-black uppercase tracking-widest leading-none">Call Support</span>
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Interception Protocol</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-white italic tracking-tight">
                                            <span className="flex items-center gap-2"><Clock size={12} className="text-blue-500" /> Estimated Time</span>
                                            <span className="text-blue-400 uppercase italic">{liveEta > 0 ? `${liveEta} MINS` : 'CALCULATING'}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full w-[45%] animate-pulse" />
                                        </div>
                                        <div className="mt-2 text-[10px] text-white/50 lowercase tracking-widest text-right">Distance: {liveDistance}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Target Identification</p>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-white tracking-tight uppercase leading-tight italic">
                                            {activeJob.service_type || (Array.isArray(activeJob.services) ? activeJob.services.join(' + ') : 'Rescue Protocol')}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{activeJob._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Call masking info banner */}
                            <div className="flex items-center gap-3 px-5 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                                <Phone size={14} className="text-amber-400 shrink-0" />
                                <p className="text-[10px] font-bold text-amber-400 italic leading-relaxed">
                                    Tap <span className="font-black">Call Support</span> — our team will connect you directly to your mechanic. Your numbers stay private.
                                </p>
                            </div>

                            <a 
                                href={
                                    mechanicLoc && userLoc
                                    ? `https://www.google.com/maps/dir/?api=1&origin=${userLoc[0]},${userLoc[1]}&destination=${mechanicLoc[0]},${mechanicLoc[1]}&travelmode=driving`
                                    : '#'
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black tracking-[0.3em] uppercase text-[10px] transition active:scale-[0.98] flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                            >
                                <Navigation size={16} /> Open in Google Maps
                                <ChevronRight size={16} className="text-blue-300" />
                            </a>
                        </div>
                        
                        {/* Secondary Hub Status (Centered) */}
                        <div className="mx-auto px-8 py-4 bg-slate-900/30 backdrop-blur-xl rounded-full border border-white/5 flex items-center justify-between shadow-2xl max-w-lg">
                            <div className="flex items-center gap-3">
                                <MapPin size={14} className="text-blue-500" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/60 italic truncate">
                                    {activeJob.location.address}
                                </span>
                            </div>
                            <div className="h-1 w-12 bg-blue-500/20 rounded-full shrink-0 ml-4" />
                        </div>
                     </div>
                ) : (
                    <div className="text-center space-y-8 animate-in fade-in duration-1000">
                        <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto border border-white/5">
                            <Activity size={40} className="text-slate-700" />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">No Active Mission</h2>
                            <p className="text-slate-500 font-medium italic text-sm uppercase tracking-widest">Awaiting tactical help request broadcast.</p>
                        </div>
                        <button 
                            onClick={() => navigate(USER_ROUTES.HOME)}
                            className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition active:scale-95"
                        >
                            Initialize New Request
                        </button>
                    </div>
                )}
            </div>

            {/* Floating Chat HUD */}
            {isChatOpen && activeJob && (
                <div className="fixed bottom-10 right-8 w-96 z-[150] animate-in slide-in-from-bottom-5 duration-500 shadow-2xl">
                    <ChatHUD 
                        jobId={activeJob._id} 
                        recipientId={(activeJob.garage_id as any)?.owner_id || (activeJob.garage_id as any)?._id || (typeof activeJob.garage_id === 'string' ? activeJob.garage_id : '')} 
                    />
                </div>
            )}
        </div>
    );
};

export default UserTracking;
