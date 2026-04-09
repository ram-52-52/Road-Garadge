import { 
  Activity, 
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
            fetchActiveJob(); // Refresh state to EN_ROUTE
        } catch (err) {
            console.error("Start Job Failure:", err);
        }
    };

    const handleCompleteJob = async () => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${activeJob?._id}/complete`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            navigate(MECHANIC_ROUTES.DASHBOARD);
        } catch (err) {
            console.error("Complete Job Failure:", err);
        }
    };

    useEffect(() => {
        if (!activeJob) return;
        
        let trackingInterval: any;
        let watchId: number;

        if (activeJob.status === 'EN_ROUTE') {
            // Real-time GPS Tracking
            if (navigator.geolocation) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setMyLiveCoords([latitude, longitude]);
                    },
                    (error) => console.error("Geolocation Error:", error),
                    { enableHighAccuracy: true }
                );
            }

            trackingInterval = setInterval(async () => {
                try {
                    // Use the current state value of coords
                    const [lat, lng] = myLiveCoords;
                    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/jobs/${activeJob._id}/track`, {
                        coordinates: [lng, lat]
                    }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                } catch (err) {
                    console.error("Tracking Broadcast Error:", err);
                }
            }, 5000);
        }

        return () => {
            if (trackingInterval) clearInterval(trackingInterval);
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [activeJob, myLiveCoords]);

    // Defensive Build Shield: Halt rendering if no mission is active
    if (!activeJob) {
        return (
            <div className="min-h-full flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300">
                    <Activity size={40} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-tighter">No Active Dispatch</h3>
                    <p className="text-xs font-medium text-slate-500 max-w-[200px] leading-relaxed italic">Your tactical position is currently unassigned. Return to the dashboard to monitor sector alerts.</p>
                </div>
                <button 
                    onClick={() => navigate(MECHANIC_ROUTES.DASHBOARD)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                    <ArrowLeft size={16} /> Return to Command
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-full relative bg-slate-950 overflow-hidden">
            {/* Tactical Map Infrastructure */}
            <div className="absolute inset-0 z-0">
                 <MapTracker 
                     driverLocation={userLoc}
                     mechanicLocation={myLiveCoords}
                     onMetricsCalculated={(dist, eta) => {
                         setLiveDistance(`${dist} KM`);
                         setLiveEta(eta);
                     }}
                 />
            </div>

            {/* Mission Statistics Sidebar (Desktop & Tablet) */}
            <div className="absolute inset-y-0 right-0 z-30 w-[350px] lg:w-[450px] p-4 lg:p-8 hidden md:flex flex-col gap-6 pointer-events-none">
                 <div className="w-full h-full flex flex-col gap-6 pointer-events-auto animate-in slide-in-from-right-10 duration-700">
                    {/* Command Console HUD */}
                    <div className="flex-1 bg-slate-900/90 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="inline-flex px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Mission Critical</span>
                                </div>
                                <button onClick={() => navigate(MECHANIC_ROUTES.DASHBOARD)} className="text-slate-500 hover:text-white transition">
                                    <ArrowLeft size={20} />
                                </button>
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
                                        <div className="px-2 py-0.5 bg-white/5 rounded-md border border-white/5 text-[8px] font-black text-slate-400 uppercase">Sector-NW</div>
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
                                    Start Route / En-Route
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
                                        Google Maps Nav
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
            </div>

            {/* Mobile Adaptive Controls (Floating HUD) */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 z-40 p-4">
                <div className="bg-slate-900/95 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white italic font-black">
                                 {(activeJob.driver_id as any)?.name?.charAt(0) || 'D'}
                             </div>
                             <div>
                                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{liveDistance} • {liveEta} MIN</p>
                                 <p className="text-sm font-black text-white italic truncate w-32">{(activeJob.driver_id as any)?.name}</p>
                             </div>
                         </div>
                         <div className="flex gap-2">
                             {activeJob.status === 'ACCEPTED' ? (
                                 <button onClick={handleStartJob} className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                     <Navigation size={18} />
                                 </button>
                             ) : (
                                 <a 
                                     href={userLoc ? `https://www.google.com/maps/dir/?api=1&origin=${myLiveCoords[0]},${myLiveCoords[1]}&destination=${userLoc[0]},${userLoc[1]}&travelmode=driving` : '#'}
                                     target="_blank"
                                     rel="noreferrer"
                                     className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white border border-white/10"
                                 >
                                     <Navigation size={18} />
                                 </a>
                             )}
                             <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white border border-white/10">
                                 <MessageSquare size={18} />
                             </button>
                         </div>
                    </div>
                </div>
            </div>

            {/* Floating Chat HUD */}
            {isChatOpen && activeJob && (
                <div className="fixed bottom-24 xs:bottom-32 left-1/2 -translate-x-1/2 xs:left-auto xs:right-8 xs:translate-x-0 w-[90vw] xs:w-96 z-[150] animate-in slide-in-from-bottom-5 duration-500">
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
