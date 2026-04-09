import { 
  Activity, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Clock, 
  ArrowLeft,
  Navigation,
  CheckCircle2,
  ChevronRight,
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

    const [myLiveCoords, setMyLiveCoords] = useState<[number, number]>([23.025, 72.571]);
    const [liveDistance, setLiveDistance] = useState("---");
    const [liveEta, setLiveEta] = useState(0);

    const handleStartJob = async () => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/jobs/${activeJob?._id}/start`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchActiveJob(); // Refresh state to EN_ROUTE
        } catch (err) {
            console.error("Start Job Failure:", err);
        }
    };

    const handleCompleteJob = async () => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/jobs/${activeJob?._id}/complete`, {}, {
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
        if (activeJob.status === 'EN_ROUTE') {
            trackingInterval = setInterval(async () => {
                try {
                    const lat = 23.025 + (Math.random() - 0.5) * 0.01;
                    const lng = 72.571 + (Math.random() - 0.5) * 0.01;
                    setMyLiveCoords([lat, lng]);

                    await axios.post(`${import.meta.env.VITE_API_URL}/jobs/${activeJob._id}/track`, {
                        coordinates: [lng, lat]
                    }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                } catch (err) {
                    console.error("Tracking Error:", err);
                }
            }, 5000);
        }

        return () => {
            if (trackingInterval) clearInterval(trackingInterval);
        };
    }, [activeJob]);

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
        <div className="min-h-full bg-slate-50 p-2 xs:p-8 space-y-4 xs:space-y-12 animate-in fade-in duration-1000">
            {/* Header Strategic HUD */}
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 xs:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[6px] xs:text-[8px] font-black uppercase tracking-[0.2em] xs:tracking-[0.4em] text-emerald-600">
                        Mission Active: Sector-09
                    </div>
                    <h2 className="text-base xs:text-3xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">Interaction Hub</h2>
                </div>
                <button 
                    onClick={() => navigate(MECHANIC_ROUTES.DASHBOARD)} 
                    className="w-12 h-12 xs:w-16 xs:h-16 bg-slate-50 rounded-xl xs:rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 hover:bg-slate-100/50 hover:text-slate-950 transition group shrink-0"
                >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Active Logistics / Client Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xs:gap-12">
                <div className="lg:col-span-2 space-y-6 xs:space-y-8">
                    <div className="bg-slate-950 rounded-[2.5rem] xs:rounded-[4rem] p-6 xs:p-12 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
                        <div className="relative z-10 space-y-8 xs:space-y-12">
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1 xs:space-y-2 min-w-0 flex-1">
                                    <h3 className="text-sm xs:text-3xl font-black italic tracking-tighter uppercase truncate leading-none">
                                        {activeJob?.driver_id?.name || 'Unknown Driver'}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-slate-400 text-[7px] xs:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                            Sector Ahmedabad-NW
                                        </div>
                                    </div>
                                </div>
                                <div className="w-10 h-10 xs:w-20 xs:h-20 bg-blue-600 rounded-lg xs:rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 text-white italic font-black text-xs xs:text-2xl shrink-0">
                                    {(activeJob?.driver_id?.name || 'DR').slice(0, 2).toUpperCase()}
                                </div>
                            </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-8">
                                <div className="space-y-2 xs:space-y-4">
                                     <p className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Position Data</p>
                                     <div className="flex items-center gap-3 xs:gap-4 group cursor-pointer hover:bg-white/5 p-3 rounded-xl xs:rounded-2xl transition duration-500 border border-white/5 min-w-0">
                                         <MapPin size={20} className="text-blue-500 shrink-0" />
                                         <span className="text-[10px] xs:text-sm font-black uppercase italic tracking-tight underline truncate">
                                             {activeJob?.location?.address || 'Near Location'}
                                         </span>
                                     </div>
                                </div>
                                <div className="space-y-2 xs:space-y-4">
                                     <p className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Operational Requirement</p>
                                     <div className="flex items-center gap-3 xs:gap-4 group p-3 bg-white/5 rounded-xl xs:rounded-2xl border border-white/5 min-w-0">
                                         <Activity size={20} className="text-emerald-500 shrink-0" />
                                         <span className="text-[10px] xs:text-sm font-black uppercase italic tracking-tight truncate">
                                             {activeJob?.services?.join(' + ') || 'Rescue Protocol'}
                                         </span>
                                     </div>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-white/5 space-y-3 xs:space-y-4">
                                {activeJob.status === 'ACCEPTED' ? (
                                    <button 
                                        onClick={handleStartJob}
                                        className="w-full h-12 xs:h-16 bg-blue-600 hover:bg-blue-500 rounded-xl xs:rounded-2xl font-black text-[9px] xs:text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 xs:gap-3 text-white"
                                    >
                                        <Navigation size={18} />
                                        Start Mission / En-Route
                                    </button>
                                ) : (
                                    <a 
                                        href={userLoc ? `https://www.google.com/maps/dir/?api=1&origin=${myLiveCoords[0]},${myLiveCoords[1]}&destination=${userLoc[0]},${userLoc[1]}&travelmode=driving` : '#'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full h-12 xs:h-16 bg-slate-800 hover:bg-slate-700 rounded-xl xs:rounded-2xl font-black text-[9px] xs:text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 xs:gap-3 text-white border border-white/5"
                                    >
                                        <Navigation size={18} />
                                        Navigate in Google Maps
                                    </a>
                                )}
                                <div className="grid grid-cols-2 gap-3 xs:gap-4">
                                    <a 
                                        href="tel:+919999999999"
                                        className="h-12 xs:h-16 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl xs:rounded-2xl flex items-center justify-center transition active:scale-95 border border-emerald-500/30 text-emerald-500"
                                        title="Call Customer via GarageNow"
                                    >
                                        <Phone size={18} />
                                    </a>
                                    <button 
                                        onClick={() => setIsChatOpen(!isChatOpen)}
                                        className={`h-12 xs:h-16 rounded-xl xs:rounded-2xl flex items-center justify-center transition active:scale-95 border ${
                                            isChatOpen ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 hover:bg-white/10 border-white/5 text-white'
                                        }`}
                                    >
                                        <MessageSquare size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2rem] xs:rounded-[3rem] border border-slate-800 overflow-hidden relative shadow-2xl min-h-[300px]">
                         <MapTracker 
                             driverLocation={userLoc}
                             mechanicLocation={myLiveCoords}
                             onMetricsCalculated={(dist, eta) => {
                                 setLiveDistance(`${dist} KM`);
                                 setLiveEta(eta);
                             }}
                         />
                         <div className="absolute bottom-5 left-5 right-5 z-[500]">
                             <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
                                 <div className="flex items-center gap-3 xs:gap-4">
                                     <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                         <Clock size={16} />
                                     </div>
                                     <div>
                                         <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest italic mb-0.5">Estimated Time</p>
                                         <p className="text-sm font-black text-white italic truncate">{liveEta > 0 ? `${liveEta} MIN` : 'CALC'}</p>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic mb-0.5">Live Dist</p>
                                     <p className="text-xs font-black text-slate-300 italic truncate">{liveDistance}</p>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="space-y-6 xs:space-y-8">
                    <div className="bg-white border border-slate-100 rounded-[2rem] xs:rounded-[3rem] p-6 xs:p-10 space-y-8 xs:space-y-10 shadow-sm">
                        <h4 className="text-lg xs:text-xl font-black italic tracking-tighter uppercase">Interaction Protocol</h4>
                        <div className="space-y-4 xs:space-y-6">
                            {[
                                { title: 'Security Check', desc: 'Verify vehicle identification.', status: 'VERIFIED', icon: ShieldCheck, color: 'text-emerald-500' },
                                { title: 'Diagnostic', desc: 'Perform tire parity check.', status: 'PENDING', icon: Activity, color: 'text-blue-500' },
                                { title: 'Execution', desc: 'Apply tire replacement.', status: 'NOT READY', icon: CheckCircle2, color: 'text-slate-400' },
                            ].map((step) => (
                                <div key={step.title} className="flex gap-4 xs:gap-5">
                                    <div className={`mt-1 xs:mt-1.5 ${step.color} shrink-0`}>
                                        <step.icon size={18} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3">
                                            <p className="text-xs xs:text-sm font-black text-slate-950 uppercase italic leading-none">{step.title}</p>
                                            <span className="text-[7px] xs:text-[8px] font-black text-slate-400 uppercase tracking-tighter">{step.status}</span>
                                        </div>
                                        <p className="text-[10px] xs:text-xs font-medium text-slate-500 italic truncate">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={handleCompleteJob}
                            disabled={activeJob.status !== 'EN_ROUTE'}
                            className={`w-full h-14 xs:h-18 rounded-xl xs:rounded-2xl font-black text-[9px] xs:text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 xs:gap-3 shadow-xl ${
                                activeJob.status === 'EN_ROUTE' 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10 active:scale-95' 
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            Finalize Handshake
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Chat HUD */}
            {isChatOpen && activeJob && (
                <div className="fixed bottom-24 xs:bottom-32 left-1/2 -translate-x-1/2 xs:left-auto xs:right-8 xs:translate-x-0 w-[90vw] xs:w-96 z-[150] animate-in slide-in-from-bottom-5 duration-500">
                    <ChatHUD 
                        jobId={activeJob._id} 
                        recipientId={(activeJob.driver_id as any)?._id || activeJob.driver_id || ''} 
                    />
                </div>
            )}
        </div>
    );
};

export default MechanicActiveJob;
