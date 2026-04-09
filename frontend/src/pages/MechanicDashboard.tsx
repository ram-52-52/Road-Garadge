import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Wrench,
  Globe,
  Activity,
  TrendingUp,
  Award,
  LogOut,
  Bell,
  Star,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { socket } from '../services/socket';
import { requestNotificationPermission } from '../services/fcm';
import axios from 'axios';

const MechanicDashboard = () => {
    const { user, logout } = useAuthStore();
    const [status, setStatus] = useState<'OFFLINE' | 'ONLINE' | 'INCOMING_SOCKET' | 'ACTIVE_JOB'>('OFFLINE');
    const [timer, setTimer] = useState(30);
    const [currentJob, setCurrentJob] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [avgRating, setAvgRating] = useState(0);

    // Fetch Performance Data (Reviews & Ratings)
    const fetchPerformance = async () => {
        try {
            // First, get the garage ID for this user
            const garageRes = await axios.get(`${import.meta.env.VITE_API_URL}/garages/nearby?lat=0&lng=0`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const myGarage = garageRes.data.data.find((g: any) => g.owner_id === user?._id);
            
            if (myGarage) {
                const reviewRes = await axios.get(`${import.meta.env.VITE_API_URL}/garages/${myGarage._id}/reviews`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setReviews(reviewRes.data.data);
                setAvgRating(myGarage.rating || 0);
            }
        } catch (err) {
            console.error('Performance Fetch Failure', err);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchPerformance();
        }
    }, [user]);

    // Socket Connection & Job Alerts
    useEffect(() => {
        if (user?._id) {
            socket.connect();
            socket.emit('register', { userId: user._id });
            requestNotificationPermission();

            socket.on('job:new', ({ job }) => {
                if (status === 'ONLINE') {
                    setCurrentJob(job);
                    setStatus('INCOMING_SOCKET');
                    setTimer(30);
                }
            });

            socket.on('job:status_update', ({ status: newStatus }) => {
                if (newStatus === 'CANCELLED') {
                    setStatus('ONLINE');
                    setCurrentJob(null);
                }
            });
        }

        // Notification Interceptor
        const handleServiceWorkerMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'FCM_NOTIFICATION_CLICK_JOB') {
                console.log('Push tapped, switching to ONLINE and loading mission...', event.data);
                setStatus('ONLINE');
                setTimeout(() => {
                   if (event.data.jobData) {
                       setCurrentJob(event.data.jobData);
                       setStatus('INCOMING_SOCKET');
                       setTimer(30);
                   }
                }, 500);
            }
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
        }

        return () => {
            socket.off('job:new');
            socket.off('job:status_update');
            socket.disconnect();
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
            }
        };
    }, [user, status]);

    useEffect(() => {
        let trackingInterval: any;
        if (status === 'ACTIVE_JOB' && currentJob?.status === 'EN_ROUTE') {
            trackingInterval = setInterval(async () => {
                try {
                    // Simulating coordinate updates (Ahmedabad area)
                    const lat = 23.0225 + (Math.random() - 0.5) * 0.01;
                    const lng = 72.5714 + (Math.random() - 0.5) * 0.01;

                    await axios.post(`${import.meta.env.VITE_API_URL}/jobs/${currentJob._id}/track`, {
                        coordinates: [lng, lat]
                    }, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    console.log('📡 GPS Ping Dispatched:', [lng, lat]);
                } catch (err) {
                    console.error('GPS Broadcast Failure', err);
                }
            }, 10000);
        }
        return () => clearInterval(trackingInterval);
    }, [status, currentJob]);

    useEffect(() => {
        let interval: any;
        if (status === 'INCOMING_SOCKET' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0) {
            setStatus('ONLINE');
        }
        return () => clearInterval(interval);
    }, [status, timer]);

    const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg transition duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-2xl xs:text-3xl font-black text-slate-900 tracking-tighter italic">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Enterprise Navigation */}
            <nav className="h-auto min-h-[5rem] bg-white border-b border-slate-100 flex flex-col md:flex-row items-center justify-between px-6 xs:px-12 py-4 md:py-0 gap-4 md:gap-0 sticky top-0 z-[100] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-950/20 group cursor-pointer hover:scale-110 transition duration-500">
                        <Wrench size={24} fill="white" className="group-hover:rotate-45 transition-transform" />
                    </div>
                    <div>
                        <h1 className="text-xl xs:text-2xl font-black text-slate-950 tracking-tighter italic">GarageNow <span className="text-blue-600 border border-blue-600/20 px-2 xs:px-3 py-0.5 rounded-lg text-[8px] xs:text-[10px] not-italic uppercase tracking-[0.2em] ml-2">Partner Node</span></h1>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 xs:gap-10">
                    <div className="flex items-center gap-6 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Status</span>
                            <span className={`text-xs font-black uppercase tracking-widest ${status === 'OFFLINE' ? 'text-slate-400' : 'text-emerald-500'}`}>
                                {status === 'OFFLINE' ? 'System Offline' : 'Active Connection'}
                            </span>
                        </div>
                        <button 
                            onClick={() => setStatus(status === 'OFFLINE' ? 'ONLINE' : 'OFFLINE')}
                            className={`w-14 h-8 rounded-full relative transition-all duration-500 p-1 ${status === 'OFFLINE' ? 'bg-slate-200' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-sm ${status === 'OFFLINE' ? 'translate-x-0' : 'translate-x-6'}`} />
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-950 hover:bg-white transition-all rounded-xl border border-slate-100 shadow-sm relative">
                            <Bell size={20} />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="h-10 w-[1px] bg-slate-100" />
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg">
                                {user?.name?.charAt(0) || 'M'}
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-black text-slate-900 tracking-tight">{user?.name || 'Partner'}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Elite Service Provier</p>
                            </div>
                            <button onClick={logout} className="ml-4 p-3 hover:text-rose-500 transition-colors">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 p-4 xs:p-8 md:p-12 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 xs:gap-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                {/* Dashboard Core */}
                <div className="lg:col-span-2 space-y-8 xs:space-y-12">
                    {/* KPI High-Density HUD */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-8">
                        <StatCard 
                            title="Daily Revenue" 
                            value={`₹ ${(reviews.length * 450).toLocaleString()}`} 
                            icon={TrendingUp} 
                            trend={12.4} 
                            color="bg-emerald-100 text-emerald-600"
                        />
                        <StatCard 
                             title="Job Consistency" 
                             value={reviews.length > 0 ? "99.2%" : "---"} 
                             icon={Award} 
                             trend={0.8} 
                             color="bg-blue-100 text-blue-600"
                        />
                        <StatCard 
                             title="Operational Hours" 
                             value="164h" 
                             icon={Clock} 
                             trend={-2.4} 
                             color="bg-indigo-100 text-indigo-600"
                        />
                    </div>

                    {/* Operational Viewport */}
                    <div className="bg-slate-950 rounded-[2.5rem] xs:rounded-[3.5rem] p-6 xs:p-12 min-h-[400px] xs:min-h-[600px] relative overflow-hidden shadow-2xl group">
                         <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                         
                         {/* IMPOSTER ACTION CENTER */}
                         <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                             
                             {status === 'OFFLINE' && (
                                <div className="space-y-8 animate-in zoom-in-95 duration-700">
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                                        <X size={32} className="text-white/20" />
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-black text-white tracking-tighter italic italic">Systems Suspended</h2>
                                        <p className="text-white/30 font-bold uppercase tracking-[0.4em] text-xs">Switch Node to 'ONLINE' to initiate service pool</p>
                                    </div>
                                </div>
                             )}

                             {status === 'ONLINE' && (
                                <div className="space-y-10 animate-in fade-in duration-1000">
                                    <div className="relative w-48 h-48 flex items-center justify-center mx-auto">
                                        <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20 scale-150 duration-[3000ms]" />
                                        <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
                                            <Globe size={48} className="text-white animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-black text-white tracking-tighter italic italic">Monitoring Dispatch Channels</h2>
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-emerald-500 font-black uppercase tracking-[0.4em] text-[10px]">Real-time Socket Connection Active</p>
                                        </div>
                                    </div>
                                </div>
                             )}

                             {status === 'INCOMING_SOCKET' && (
                                <div className="bg-rose-600 p-16 rounded-[4rem] shadow-[0_50px_100px_rgba(225,29,72,0.4)] animate-in bounce-in duration-700 w-full max-w-2xl">
                                    <div className="flex items-center justify-between mb-12">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-xl">
                                                <Activity size={32} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-3xl font-black text-white tracking-tighter italic">Critical SOS Dispatch</h3>
                                                <p className="text-white/60 font-medium uppercase tracking-widest text-[10px]">Ahmedabad Sector 12 Corridor</p>
                                            </div>
                                        </div>
                                        <div className="relative w-20 h-20">
                                            <svg className="w-full h-full rotate-[-90deg]">
                                                <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/20" />
                                                <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white transition-all duration-1000" 
                                                    strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * timer / 30)}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center text-white font-black italic">{timer}S</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 mb-12">
                                        <div className="bg-white/10 rounded-3xl p-6 text-left border border-white/10 col-span-2">
                                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Subject Issue (Services)</p>
                                            <p className="text-xl font-black text-white italic tracking-tight uppercase">{currentJob?.service_type || (currentJob?.services ? currentJob.services.join(' + ') : 'Rescue Request')}</p>
                                        </div>
                                        <div className="bg-white/10 rounded-3xl p-6 text-left border border-white/10">
                                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Vehicle / Notes</p>
                                            <p className="text-sm font-black text-white">{currentJob?.description || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white/10 rounded-3xl p-6 text-left border border-white/10">
                                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Target Location</p>
                                            <p className="text-sm font-black text-white lowercase capitalize">{currentJob?.location?.address || 'Unknown Region'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={() => setStatus('ONLINE')} className="flex-1 h-20 bg-black/20 hover:bg-black/30 text-white rounded-3xl font-black uppercase tracking-widest text-xs transition active:scale-[0.98]">
                                            Decline Log
                                        </button>
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    await axios.patch(`${import.meta.env.VITE_API_URL}/jobs/${currentJob._id}/accept`, {}, {
                                                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                                    });
                                                    setStatus('ACTIVE_JOB');
                                                } catch (err) {
                                                    console.error('Failed to accept job', err);
                                                    setStatus('ONLINE');
                                                }
                                            }} 
                                            className="flex-2 h-20 bg-white text-rose-600 rounded-3xl font-black uppercase tracking-widest text-xs transition active:scale-105 shadow-2xl flex items-center justify-center gap-4"
                                        >
                                            Accept Strategy
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                             )}

                             {status === 'ACTIVE_JOB' && (
                                <div className="w-full max-w-4xl bg-slate-900 border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
                                    <div className="p-12 space-y-12">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-8">
                                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 shadow-2xl">
                                                    <div className="w-full h-full bg-slate-900 rounded-[1.8rem] flex items-center justify-center italic italic text-white font-black text-2xl tracking-tighter">DS</div>
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-4xl font-black text-white tracking-tighter italic">Deepak Singh</h3>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                            Verified Client
                                                        </div>
                                                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">ID: #UXP-9234</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">Projected Earning</p>
                                                <p className="text-4xl font-black text-white italic tracking-tighter italic italic">₹ 450.00</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-12 text-left">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4 group cursor-pointer">
                                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                                        <MapPin size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Target Anchor</p>
                                                        <p className="text-sm font-black text-white uppercase italic italic">Ambawadi Circle, AHMEDABAD</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 group cursor-pointer">
                                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                                        <ShieldCheck size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Service Logic</p>
                                                        <p className="text-sm font-black text-white uppercase italic italic italic">Emergency Engine Diagnostics</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5">
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Internal Instructions</p>
                                                <p className="text-sm font-medium italic italic text-white/80 leading-relaxed italic italic">"Client reports coolant leakage and high engine temperatures. Prioritize sensor recalibration and fluid replenishment protocols."</p>
                                            </div>
                                        </div>

                                        <button onClick={() => setStatus('ONLINE')} className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-[0.5em] text-sm transition active:scale-[0.98] shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                                            Finalize & Submit Job Artifacts
                                        </button>
                                    </div>
                                </div>
                             )}
                         </div>
                    </div>
                </div>

                {/* Sidebar Intelligence */}
                <div className="space-y-12">
                    {/* Performance Metrics */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-950 tracking-tighter italic">Quality Index</h3>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                <TrendingUp size={18} />
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Star size={16} className="text-amber-400 fill-amber-400" />
                                    <span className="text-sm font-black text-slate-900 tracking-tight">System Rating</span>
                                    <span className="text-sm font-black text-slate-950 italic">{avgRating}/5.0</span>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(avgRating/5)*100}%` }} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                Based on {reviews.length} Performance Artifacts
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Satisfied</p>
                                <p className="text-xl font-black text-slate-900 tracking-tight italic italic italic italic">
                                    {reviews.filter(r => r.rating >= 4).length}
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Critical</p>
                                <p className="text-xl font-black text-slate-900 tracking-tight italic italic italic italic">
                                    {reviews.filter(r => r.rating < 3).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Ledger Entries */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-black text-slate-950 tracking-tighter italic px-4">Latest Experience Logs</h3>
                        <div className="space-y-3">
                            {reviews.slice(0, 3).map((review) => (
                                <div key={review._id} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:scale-[1.02] transition duration-500 cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                            <Star size={20} className={review.rating >= 4 ? 'text-amber-400 fill-amber-400' : ''} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 uppercase italic">{review.driver_id?.name || 'Client'}</p>
                                            <p className="text-[10px] font-bold text-slate-400 line-clamp-1">{review.comment || 'No comment provided'}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-blue-600 italic">★ {review.rating}</p>
                                </div>
                            ))}
                            {reviews.length === 0 && (
                                <div className="text-center py-12 text-slate-400 uppercase tracking-widest text-[10px] font-black">No artifacts recorded yet</div>
                            )}
                        </div>
                        <button className="w-full flex items-center justify-between px-8 py-5 rounded-3xl bg-slate-950 text-white font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition shadow-xl shadow-slate-900/10">
                            See All Revenue Artifacts
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </main>

            {/* Global Status HUD */}
            <footer className="h-auto min-h-[3.5rem] bg-white border-t border-slate-100 px-6 xs:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto">
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 xs:gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic italic">Real-time Node Health: Optimal (24ms)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic italic">Socket Connectivity: Encrypted AES-256</span>
                    </div>
                 </div>
                 <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center md:text-right">Partner Network Infrastructure © 2024.04.07</div>
            </footer>
        </div>
    );
};

export default MechanicDashboard;
