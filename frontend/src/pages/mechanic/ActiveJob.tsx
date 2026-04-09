import { 
  MapPin, 
  Phone, 
  ArrowLeft,
  Navigation,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MECHANIC_ROUTES } from '../../constants/navigationConstant';
import { useJobStore } from '../../store/jobStore';
import { useState, useEffect } from 'react';
import ChatHUD from '../../components/chat/ChatHUD';
import MapTracker from '../../components/MapTracker';
import axios from 'axios';

const MechanicActiveJob = () => {
    const navigate = useNavigate();
    const { activeJob, fetchActiveJob } = useJobStore();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selfLocation, setSelfLocation] = useState<[number, number] | undefined>(undefined);

    useEffect(() => {
        fetchActiveJob();
    }, []);

    const userLoc = activeJob?.location?.coordinates
        ? [activeJob.location.coordinates[1], activeJob.location.coordinates[0]] as [number, number]
        : undefined;

    const [myLiveCoords, setMyLiveCoords] = useState<[number, number]>(
        activeJob && (activeJob.garage_id as any)?.location?.coordinates
            ? [(activeJob.garage_id as any).location.coordinates[1], (activeJob.garage_id as any).location.coordinates[0]]
            : [23.025, 72.571]
    );
    const [liveDistance, setLiveDistance] = useState("---");
    const [liveEta, setLiveEta] = useState(0);

    const handleStartJob = async () => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${activeJob?._id}/start`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchActiveJob(); 
        } catch (err) {
            console.error("Start Job Failure:", err);
        }
    };

    const handleCompleteJob = async () => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${activeJob?._id}/complete`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchActiveJob(); // This will clear the activeJob as it's no longer PENDING/ACCEPTED/EN_ROUTE
        } catch (err) {
            console.error("Complete Job Failure:", err);
        }
    };

    // Device Location Watcher (Always active)
    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                    setSelfLocation(coords);
                    if (activeJob?.status === 'EN_ROUTE') {
                        setMyLiveCoords(coords);
                    }
                },
                (err) => console.error("Self Watch Error:", err),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [activeJob?.status]);

    // Mission Broadcast logic
    useEffect(() => {
        if (!activeJob || activeJob.status !== 'EN_ROUTE') return;
        
        const trackingInterval = setInterval(async () => {
            try {
                const [lat, lng] = myLiveCoords;
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/jobs/${activeJob._id}/track`, {
                    coordinates: [lng, lat]
                }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            } catch (err) {
                console.error("Tracking Broadcast Error:", err);
            }
        }, 5000);

        return () => clearInterval(trackingInterval);
    }, [activeJob, myLiveCoords]);

    return (
        <div className="min-h-full relative bg-slate-950 overflow-hidden">
            {/* Tactical Map Infrastructure */}
            <div className="absolute inset-0 z-0">
                 <MapTracker 
                     driverLocation={userLoc}
                     mechanicLocation={activeJob ? myLiveCoords : undefined}
                     selfLocation={selfLocation}
                     onMetricsCalculated={(dist, eta) => {
                         setLiveDistance(`${dist} KM`);
                         setLiveEta(eta);
                     }}
                 />
            </div>

            {/* Back & Status Header HUD */}
            <div className="relative z-20 p-8 flex items-center justify-between pointer-events-none">
                <button 
                    onClick={() => navigate(MECHANIC_ROUTES.DASHBOARD)} 
                    className="p-4 bg-slate-900/50 backdrop-blur-3xl rounded-2xl border border-white/5 hover:bg-white/5 transition duration-500 flex items-center gap-3 group pointer-events-auto"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Dashboard</span>
                </button>

                {!activeJob && (
                    <div className="bg-slate-900/80 backdrop-blur-3xl px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4 animate-in fade-in zoom-in duration-1000">
                         <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                             <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">Monitoring Sector</span>
                         </div>
                         <div className="h-4 w-px bg-white/10" />
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Awaiting Calls</span>
                    </div>
                )}
            </div>

            {/* Mission Statistics Sidebar (Desktop Only) */}
            <div className="absolute inset-y-0 right-0 z-30 w-[450px] p-8 hidden lg:flex flex-col gap-6 pointer-events-none">
                {activeJob && (
                     <div className="w-full h-full flex flex-col gap-6 pointer-events-auto animate-in slide-in-from-right-10 duration-700">
                        {/* Command Console HUD */}
                        <div className="flex-1 bg-slate-900/90 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="inline-flex px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Mission Critical</span>
                                    </div>
                                </div>

                                {/* Driver Profile */}
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white font-black italic text-xl">
                                        {(activeJob.driver_id as any)?.name?.charAt(0) || 'D'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase truncate w-60">
                                            {(activeJob.driver_id as any)?.name || 'Unknown Driver'}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="px-2 py-0.5 bg-white/5 rounded-md border border-white/5 text-[8px] font-black text-slate-400 uppercase">Sector-Active</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 w-full" />

                                {/* Logistics & Navigation HUD */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Target Logistics</p>
                                        <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                                            <MapPin className="text-blue-500" size={20} />
                                            <div className="min-w-0">
                                                <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Address</p>
                                                <p className="text-[10px] font-black text-slate-200 uppercase italic truncate">{activeJob.location.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mission Dist</p>
                                            <p className="text-xl font-black text-white italic tracking-tighter">{liveDistance}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">ETA</p>
                                            <p className="text-xl font-black text-emerald-400 italic tracking-tighter">{liveEta} MIN</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Operational Command Suite */}
                            <div className="mt-8 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <a 
                                        href="tel:+919999999999"
                                        className="h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl flex items-center justify-center gap-2 border border-white/5 transition"
                                    >
                                        <Phone size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Call</span>
                                    </a>
                                    <button 
                                        onClick={() => setIsChatOpen(!isChatOpen)}
                                        className={`h-14 rounded-2xl flex items-center justify-center gap-2 border transition ${
                                            isChatOpen ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-slate-400'
                                        }`}
                                    >
                                        <MessageSquare size={18} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Chat</span>
                                    </button>
                                </div>

                                {activeJob.status === 'ACCEPTED' ? (
                                    <button 
                                        onClick={handleStartJob}
                                        className="w-full h-18 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] transition active:scale-95 flex items-center justify-center gap-3 shadow-xl"
                                    >
                                        <Navigation size={18} />
                                        Start Route
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <a 
                                            href={userLoc ? `https://www.google.com/maps/dir/?api=1&origin=${myLiveCoords[0]},${myLiveCoords[1]}&destination=${userLoc[0]},${userLoc[1]}&travelmode=driving` : '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full h-18 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] transition active:scale-95 flex items-center justify-center gap-3 border border-white/5 shadow-lg"
                                        >
                                            <Navigation size={18} />
                                            Go to Google Maps
                                        </a>
                                        <button 
                                            onClick={handleCompleteJob}
                                            className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] transition active:scale-95 shadow-lg shadow-emerald-500/20"
                                        >
                                            Complete Mission
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                     </div>
                )}
            </div>

            {/* Responsive Bottom HUD (Shown on Mobile & Tablet) */}
            <div className="lg:hidden absolute bottom-28 xs:bottom-32 left-0 right-0 z-40 p-4 animate-in slide-in-from-bottom-10 duration-700">
                {activeJob && (
                    <div className="bg-slate-900/95 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                 <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white italic font-black shadow-lg">
                                     {(activeJob.driver_id as any)?.name?.charAt(0) || 'D'}
                                 </div>
                                 <div>
                                     <div className="flex items-center gap-2 mb-1">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{liveDistance} • {liveEta} MIN</p>
                                     </div>
                                     <p className="text-sm font-black text-white italic truncate w-32">{(activeJob.driver_id as any)?.name}</p>
                                 </div>
                             </div>
                             <div className="flex gap-2">
                                 {activeJob.status === 'ACCEPTED' ? (
                                     <button onClick={handleStartJob} className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl">
                                         <Navigation size={18} />
                                     </button>
                                 ) : (
                                     <a 
                                         href={userLoc ? `https://www.google.com/maps/dir/?api=1&origin=${myLiveCoords[0]},${myLiveCoords[1]}&destination=${userLoc[0]},${userLoc[1]}&travelmode=driving` : '#'}
                                         target="_blank"
                                         rel="noreferrer"
                                         className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white border border-white/10 shadow-lg"
                                     >
                                         <Navigation size={18} />
                                     </a>
                                 )}
                                 <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isChatOpen ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>
                                     <MessageSquare size={18} />
                                 </button>
                             </div>
                        </div>
                        
                        <div className="px-4 py-3 bg-white/5 rounded-2xl flex items-center gap-3 border border-white/5">
                            <MapPin size={14} className="text-blue-500 flex-shrink-0" />
                            <div>
                                <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Target Position</p>
                                <p className="text-[9px] font-black text-slate-200 uppercase italic truncate">{activeJob.location.address}</p>
                            </div>
                        </div>

                        {activeJob.status === 'EN_ROUTE' && (
                            <button 
                                onClick={handleCompleteJob}
                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] transition active:scale-95 shadow-lg shadow-emerald-500/20"
                            >
                                Complete Mission
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Floating Chat HUD */}
            {isChatOpen && activeJob && (
                <div className="fixed bottom-24 xs:bottom-32 left-1/2 -translate-x-1/2 xs:left-auto xs:right-8 xs:translate-x-0 w-[90vw] xs:w-96 z-[150] animate-in slide-in-from-bottom-5 duration-500 shadow-2xl">
                    <ChatHUD 
                        jobId={activeJob._id} 
                        recipientId={(activeJob.driver_id as any)?._id || activeJob.driver_id || ''} 
                        onClose={() => setIsChatOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default MechanicActiveJob;
