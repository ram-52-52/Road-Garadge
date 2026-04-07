import { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Wrench, 
  Truck, 
  Battery, 
  CircleDot, 
  ShieldCheck, 
  Star, 
  Zap,
  Radar,
  CheckCircle2,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { socket } from '../services/socket';
import { requestNotificationPermission } from '../services/fcm';
import axios from 'axios';

const DriverDashboard = () => {
    const { user, logout } = useAuthStore();
    const [appState, setAppState] = useState<'HOME' | 'SELECT_SERVICE' | 'SEARCHING_SOCKET' | 'TRACKING' | 'PAYMENT'>('HOME');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [activeJob, setActiveJob] = useState<any>(null);

    // Socket Connection & Job Updates
    useEffect(() => {
        if (user?._id) {
            socket.connect();
            socket.emit('register', { userId: user._id });
            requestNotificationPermission();

            socket.on('job:accepted', ({ job }) => {
                setActiveJob(job);
                setAppState('TRACKING');
            });

            socket.on('job:status_update', ({ status: newStatus, job }) => {
                if (newStatus === 'COMPLETED') {
                    setAppState('PAYMENT');
                } else if (newStatus === 'CANCELLED') {
                    setAppState('HOME');
                    setActiveJob(null);
                } else {
                    setActiveJob(job);
                }
            });

            socket.on('mechanic:location', ({ coordinates }) => {
                // Update mechanic location on map (if we had a real map)
                console.log('Mechanic Moving:', coordinates);
                setActiveJob((prev: any) => ({
                    ...prev,
                    mechanic_location: coordinates
                }));
            });
        }

        return () => {
            socket.off('job:accepted');
            socket.off('job:status_update');
            socket.off('mechanic:location');
            socket.disconnect();
        };
    }, [user]);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-500/30 overflow-hidden flex flex-col">
            {/* Top Identity Bar */}
            <header className="h-auto min-h-[5rem] bg-slate-900/50 backdrop-blur-3xl border-b border-white/5 px-4 xs:px-8 py-4 md:py-0 flex flex-col md:flex-row items-center justify-between relative z-[100] shadow-2xl gap-4 md:gap-0">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-white/10 group cursor-pointer hover:scale-110 transition duration-500">
                        <Zap size={22} fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="text-lg xs:text-xl font-black tracking-tighter italic">GarageNow <span className="text-blue-500 not-italic uppercase text-[8px] xs:text-[10px] tracking-[0.3em] font-black ml-2 font-sans px-2 py-0.5 border border-blue-500/20 rounded">Driver Console</span></h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 xs:gap-6">
                    <div className="flex flex-col items-end">
                        <p className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-slate-500">Authenticated As</p>
                        <p className="text-xs xs:text-sm font-black text-white italic tracking-tighter">{user?.name || 'Elite Member'}</p>
                    </div>
                    <button onClick={logout} className="p-2.5 xs:p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-2xl border border-white/10 transition-all group">
                        <LogOut className="w-[18px] h-[18px] xs:w-5 xs:h-5 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                    <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black italic shadow-lg">
                        {user?.name?.charAt(0) || 'D'}
                    </div>
                </div>
            </header>

            {/* Immersive Main Display */}
            <main className="flex-1 relative flex overflow-hidden">
                {/* Background Map Canvas (100% Viewport) */}
                <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute inset-0 opacity-[0.2]" 
                        style={{ 
                            backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', 
                            backgroundSize: '40px 40px' 
                        }} 
                    />
                    {/* Simulated Major Roads Layer */}
                    <svg width="100%" height="100%" className="opacity-[0.05]">
                        <path d="M -100 400 L 2000 800" stroke="white" strokeWidth="60" fill="none" opacity="0.3" />
                        <path d="M 400 -100 L 800 2000" stroke="white" strokeWidth="40" fill="none" opacity="0.2" />
                    </svg>
                    
                    {/* Pulsing Location Anchor */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.8)] relative z-10 border-4 border-slate-950" />
                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 scale-[3] duration-[3000ms]" />
                    </div>
                </div>

                {/* Left Action Sidebar (Floating Glassmorphism) */}
                <div className="relative z-50 w-full max-w-md p-8 flex flex-col pointer-events-none">
                    <div className="flex-1 flex flex-col justify-center pointer-events-auto">
                        
                        {/* THE SOS CONTROL */}
                        {appState === 'HOME' && (
                           <div className="space-y-6 xs:space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000 items-center lg:items-start text-center lg:text-left">
                               <div className="space-y-3 xs:space-y-4">
                                   <div className="inline-flex items-center gap-2 px-3 xs:px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                       <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-emerald-500 animate-pulse" />
                                       Global Hub Synchronized
                                   </div>
                                   <h2 className="text-3xl xs:text-5xl font-black text-white tracking-tighter leading-none italic uppercase">Vehicle Immobile?</h2>
                                   <p className="text-slate-400 font-medium italic text-xs xs:text-base lg:pr-4">Precision aid at the touch of a button. Our elite partners are standing by across Ahmedabad Sector 12.</p>
                               </div>

                               <div className="flex justify-center lg:justify-start w-full">
                               <button 
                                  onClick={() => setAppState('SELECT_SERVICE')}
                                  className="group relative w-52 h-52 xs:w-64 xs:h-64 flex items-center justify-center transition-transform active:scale-95 duration-500"
                               >
                                  <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-10 scale-125 duration-[4000ms]" />
                                  <div className="absolute inset-0 bg-red-600 rounded-full animate-pulse opacity-20 scale-110" />
                                  <div className="w-40 h-40 xs:w-52 xs:h-52 bg-gradient-to-tr from-red-700 to-rose-500 rounded-full shadow-[0_30px_70px_rgba(225,29,72,0.4)] flex flex-col items-center justify-center border-[8px] xs:border-[12px] border-white/10 hover:scale-105 transition-all duration-700 relative z-20">
                                       <span className="text-white text-4xl xs:text-5xl font-black italic tracking-tighter drop-shadow-2xl">S.O.S</span>
                                       <span className="text-white/60 text-[8px] xs:text-[9px] font-black uppercase tracking-widest mt-1 group-hover:text-white transition-colors">Immediate Aid</span>
                                  </div>
                               </button>
                               </div>
                           </div>
                        )}

                        {/* SERVICE SELECTION OVERLAY */}
                        {appState === 'SELECT_SERVICE' && (
                            <div className="bg-white rounded-[2rem] xs:rounded-[3rem] p-6 xs:p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-100 flex flex-col space-y-6 xs:space-y-8 animate-in slide-in-from-left-40 duration-700 w-full max-w-sm pointer-events-auto">
                                <div className="space-y-1 text-center xs:text-left">
                                    <h3 className="text-2xl xs:text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Select Logistics</h3>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] xs:text-[10px]">Dispatching elite mechanics to your anchor</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 xs:gap-4">
                                    {[
                                        { id: 'Tire Repair', name: 'Flat Tire', icon: CircleDot, style: 'bg-indigo-50 text-indigo-600' },
                                        { id: 'Battery Jumpstart', name: 'Battery', icon: Battery, style: 'bg-emerald-50 text-emerald-600' },
                                        { id: 'Engine Diagnostics', name: 'Engine', icon: Wrench, style: 'bg-rose-50 text-rose-600' },
                                        { id: 'Towing Service', name: 'Towing', icon: Truck, style: 'bg-amber-50 text-amber-600' },
                                    ].map((service) => (
                                        <button 
                                            key={service.id}
                                            onClick={async () => {
                                                try {
                                                    setAppState('SEARCHING_SOCKET');
                                                    await axios.post(`${import.meta.env.VITE_API_URL}/jobs`, {
                                                        service_type: service.id,
                                                        description: `Emergency ${service.name} requested via SOS`,
                                                        location: {
                                                            coordinates: [72.5714, 23.0225],
                                                            address: "Ahmedabad Sector 12"
                                                        }
                                                    }, {
                                                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                                    });
                                                } catch (err) {
                                                    console.error('Job Creation Failed', err);
                                                    setAppState('SELECT_SERVICE');
                                                }
                                            }}
                                            className="flex flex-col items-center justify-center p-4 xs:p-6 bg-slate-50 border border-slate-100 rounded-2xl xs:rounded-[2.5rem] hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-300 group active:scale-95"
                                        >
                                            <div className={`w-10 h-10 xs:w-14 xs:h-14 rounded-xl xs:rounded-2xl ${service.style} flex items-center justify-center mb-3 xs:mb-4 shadow-sm group-hover:scale-110 transition duration-500`}>
                                                <service.icon size={20} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-xs xs:text-sm font-black text-slate-800 tracking-tight uppercase leading-tight">{service.name}</span>
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => setAppState('HOME')}
                                    className="w-full text-[8px] xs:text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.3em] xs:tracking-[0.4em] py-2"
                                >
                                    Dismiss Request Protocol
                                </button>
                            </div>
                        )}

                        {/* TRACKING CARD */}
                        {appState === 'TRACKING' && (
                            <div className="bg-slate-900/60 backdrop-blur-3xl p-6 xs:p-10 rounded-[2.5rem] xs:rounded-[3.5rem] border border-white/10 shadow-2xl space-y-8 xs:space-y-10 animate-in zoom-in-95 duration-1000 w-full max-w-sm pointer-events-auto">
                                <div className="flex items-center justify-between pb-6 xs:pb-8 border-b border-white/5">
                                    <div className="flex items-center gap-4 xs:gap-5">
                                        <div className="w-12 h-12 xs:w-16 xs:h-16 bg-blue-600 rounded-2xl xs:rounded-3xl flex items-center justify-center shadow-xl border border-white/20 text-white font-black italic text-lg xs:text-xl">
                                            {activeJob?.mechanic_id?.name?.charAt(0) || 'M'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl xs:text-2xl font-black text-white italic tracking-tighter">{activeJob?.mechanic_id?.name || 'Partner'}</h3>
                                                <ShieldCheck size={18} className="text-blue-400" />
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/10 w-fit">
                                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                                <span className="text-[10px] font-black text-white tracking-widest">4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-12 h-12 xs:w-16 xs:h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 active:scale-90 transition group">
                                        <Phone size={20} className="group-hover:animate-bounce" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 xs:gap-8">
                                    <div className="space-y-3 xs:space-y-4">
                                        <p className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Positioning</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] xs:text-xs font-bold text-white italic tracking-tight">
                                                <span>Arriving</span>
                                                <span className="text-blue-400">4 MIN</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full w-[70%] animate-in slide-in-from-left duration-[3000ms]" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 xs:space-y-4">
                                        <p className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Asset</p>
                                        <div className="flex flex-col">
                                            <span className="text-xs xs:text-sm font-black text-white tracking-tight uppercase truncate">{activeJob?.mechanic_id?.garage_name || 'Partner Mobile'}</span>
                                            <span className="text-[8px] xs:text-[10px] text-slate-400 font-bold uppercase tracking-widest">EN-ROUTE</span>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => setAppState('PAYMENT')} className="w-full h-14 xs:h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black tracking-[0.2em] xs:tracking-[0.3em] uppercase text-[10px] xs:text-xs transition active:scale-[0.98] flex items-center justify-center gap-3 xs:gap-4">
                                    Proceed to Settlement
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* SEARCHING RADAR OVERLAY */}
                {appState === 'SEARCHING_SOCKET' && (
                    <div className="absolute inset-0 z-[60] bg-slate-950/95 backdrop-blur-3xl flex flex-col items-center justify-center px-6 xs:px-12 animate-in fade-in duration-1000">
                        <div className="relative w-72 h-72 xs:w-[400px] xs:h-[400px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
                            <div className="absolute inset-0 border border-white/5 rounded-full" />
                            <div className="absolute inset-8 border border-white/5 rounded-full" />
                            <div className="absolute inset-16 border border-white/5 rounded-full" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-full rounded-full border-[2px] border-blue-500 animate-[ping_3s_linear_infinite] opacity-10" />
                            </div>
                            <div className="absolute inset-0 animate-spin-slow opacity-20">
                                <Radar size="100%" className="text-blue-500/20" strokeWidth={0.5} />
                            </div>
                            <div className="w-24 h-24 xs:w-32 xs:h-32 bg-blue-600 rounded-3xl xs:rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/50 relative z-10 animate-bounce">
                                <MapPin size={32} className="text-white" />
                            </div>
                        </div>
                        <div className="mt-12 xs:mt-20 text-center space-y-4 max-w-lg">
                            <h4 className="text-3xl xs:text-4xl font-black text-white tracking-tighter italic uppercase">Scanning Sector 12</h4>
                            <p className="text-white/40 font-bold uppercase tracking-[0.3em] xs:tracking-[0.4em] text-[8px] xs:text-[10px] animate-pulse leading-relaxed">Establishing handshake with encrypted socket pool...</p>
                        </div>
                    </div>
                )}

                {/* PAYMENT & REVIEW */}
                {appState === 'PAYMENT' && (
                  <div className="absolute inset-0 z-[70] bg-slate-950/90 backdrop-blur-3xl flex items-center justify-center px-6 xs:px-8 py-10 animate-in slide-in-from-right-full duration-1000 overflow-y-auto">
                    <div className="w-full max-w-2xl bg-white rounded-[2.5rem] xs:rounded-[4rem] p-8 xs:p-16 shadow-2xl flex flex-col items-center text-center">
                        <div className="w-20 h-20 xs:w-28 xs:h-28 bg-emerald-100 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/10 mb-8 xs:mb-10">
                            <CheckCircle2 size={40} className="text-emerald-600" />
                        </div>
                        
                        <div className="space-y-2 xs:space-y-4 mb-10 xs:mb-16">
                            <h2 className="text-3xl xs:text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Interaction Success</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] xs:text-xs">Settlement Finalized via Secure Ledger</p>
                        </div>

                        <div className="w-full space-y-10 xs:space-y-12">
                            <div className="space-y-4 xs:space-y-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] xs:tracking-[0.4em] text-slate-400">Experience Index</p>
                                <div className="flex justify-center gap-2 xs:gap-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button key={s} onClick={() => setRating(s)} className="transition-all active:scale-90 hover:scale-110">
                                            <Star size={32} className={`transition-all duration-300 ${s <= rating ? 'text-amber-400 fill-amber-400 drop-shadow-2xl' : 'text-slate-100'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 xs:space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] xs:tracking-[0.4em] text-slate-400">Moderation Feedback</p>
                                <textarea 
                                    placeholder="Help our network grow with your insights..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] xs:rounded-[2.5rem] p-6 xs:p-8 text-sm xs:text-lg font-bold focus:ring-[8px] xs:ring-[12px] focus:ring-blue-100/30 focus:outline-none transition-all placeholder-slate-300 min-h-[120px] xs:min-h-[160px]"
                                ></textarea>
                            </div>

                            <button 
                                onClick={async () => {
                                    try {
                                        await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, {
                                            job_id: activeJob?._id,
                                            garage_id: activeJob?.garage_id?._id || activeJob?.garage_id,
                                            rating,
                                            comment
                                        }, {
                                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                        });
                                        setAppState('HOME');
                                        setActiveJob(null);
                                        setRating(0);
                                        setComment("");
                                    } catch (err) {
                                        console.error('Review Submission Failed', err);
                                        setAppState('HOME');
                                    }
                                }} 
                                className="w-full h-16 xs:h-20 bg-slate-950 text-white rounded-2xl xs:rounded-[2rem] font-black uppercase tracking-[0.3em] xs:tracking-[0.4em] text-xs xs:text-sm transition active:scale-[0.98] shadow-2xl"
                            >
                                Finalize Interaction
                            </button>
                        </div>
                    </div>
                  </div>
                )}
            </main>

            {/* Bottom Status Ticker */}
            <footer className="h-auto py-2 bg-slate-950 border-t border-white/5 px-4 xs:px-8 flex flex-col sm:flex-row items-center justify-between relative z-50 gap-2 sm:gap-0">
                <div className="flex flex-col sm:flex-row items-center gap-2 xs:gap-6 lg:gap-10">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[7px] xs:text-[8px] font-black text-slate-500 uppercase tracking-widest">Protocol Secured: 256-bit Node</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <MapPin size={10} className="text-blue-500" />
                         <span className="text-[7px] xs:text-[8px] font-black text-slate-500 uppercase tracking-widest">Primary Anchor: GJ-12 REGIONAL HUB</span>
                    </div>
                </div>
                <div className="text-[7px] xs:text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] xs:tracking-[0.5em] text-center">GarageNow Elite Engine © 2026</div>
            </footer>
        </div>
    );
};

export default DriverDashboard;
