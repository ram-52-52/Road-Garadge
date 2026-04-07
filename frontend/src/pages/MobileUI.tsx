import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  Phone, 
  MapPin, 
  Wrench, 
  Truck, 
  Battery, 
  CircleDot, 
  Navigation, 
  ShieldCheck, 
  Star, 
  LogOut, 
  Bell, 
  TrendingUp, 
  CheckCircle2, 
  X,
  Award,
  Radar,
  Globe,
  User
} from 'lucide-react';

const MobileUI = () => {
  const { user } = useAuthStore();
  const [activeApp] = useState<'DRIVER' | 'GARAGE'>(
    user?.role === 'GARAGE_OWNER' ? 'GARAGE' : 'DRIVER'
  );
  
  // Driver States: 'HOME' | 'SELECT_SERVICE' | 'SEARCHING_SOCKET' | 'TRACKING' | 'PAYMENT'
  const [appState, setAppState] = useState<'HOME' | 'SELECT_SERVICE' | 'SEARCHING_SOCKET' | 'TRACKING' | 'PAYMENT'>('HOME');
  
  // Garage States: 'OFFLINE' | 'ONLINE' | 'INCOMING_SOCKET' | 'ACTIVE_JOB'
  const [status, setStatus] = useState<'OFFLINE' | 'ONLINE' | 'INCOMING_SOCKET' | 'ACTIVE_JOB'>('OFFLINE');
  
  const [rating, setRating] = useState(0);
  const [timer, setTimer] = useState(30);

  // Simulated Radar & Socket Effects
  useEffect(() => {
    if (appState === 'SEARCHING_SOCKET') {
      const timer = setTimeout(() => setAppState('TRACKING'), 4000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // Garage Incoming Timer
  useEffect(() => {
    let interval: any;
    if (status === 'INCOMING_SOCKET' && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setStatus('ONLINE');
      setTimer(30);
    }
    return () => clearInterval(interval);
  }, [status, timer]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative border-[12px] border-slate-800 shadow-blue-900/20 animate-in fade-in zoom-in duration-700">
        {/* Dynamic Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-10 h-1 bg-slate-700/50 rounded-full" />
        </div>

        {activeApp === 'DRIVER' ? (
          <div className="flex-1 flex flex-col relative h-full">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-[#ebebeb] grayscale contrast-125 opacity-20">
                <svg width="100%" height="100%" className="opacity-10">
                    <pattern id="dot-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="black" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#dot-grid)" />
                </svg>
            </div>

            {/* DRIVER HOME */}
            {appState === 'HOME' && (
              <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8">
                <div className="text-center mb-24 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <h2 className="text-4xl font-black text-white tracking-tighter italic leading-none mb-4">Broken Down?</h2>
                    <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Elite Assistance protocol active</p>
                </div>

                <button 
                  onClick={() => setAppState('SELECT_SERVICE')}
                  className="group relative w-60 h-60 flex items-center justify-center transition-transform active:scale-95 duration-500"
                >
                  <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20 scale-150" />
                  <div className="absolute inset-0 bg-red-600 rounded-full animate-pulse opacity-40 scale-125" />
                  <div className="w-52 h-52 bg-gradient-to-tr from-red-700 to-rose-500 rounded-full shadow-2xl flex flex-col items-center justify-center border-[10px] border-white/20 hover:scale-105 transition-all duration-500">
                    <span className="text-white text-4xl font-black italic tracking-tighter">S.O.S</span>
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2 group-hover:text-white transition">Help Now</span>
                  </div>
                </button>
              </div>
            )}

            {/* SELECT SERVICE SHEETS */}
            {appState === 'SELECT_SERVICE' && (
              <div className="flex-1 flex flex-col relative z-20">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="mt-auto bg-white rounded-t-[3.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-700 relative z-30">
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-10" />
                  <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter italic">Select Critical Service</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Flat Tire', icon: CircleDot, style: 'bg-indigo-50 text-indigo-600' },
                      { name: 'Towing', icon: Truck, style: 'bg-amber-50 text-amber-600' },
                      { name: 'Engine', icon: Wrench, style: 'bg-rose-50 text-rose-600' },
                      { name: 'Battery', icon: Battery, style: 'bg-emerald-50 text-emerald-600' },
                    ].map((s) => (
                      <button 
                        key={s.name}
                        onClick={() => setAppState('SEARCHING_SOCKET')}
                        className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-blue-50/50 hover:border-blue-200 transition-all active:scale-95 group"
                      >
                        <div className={`w-14 h-14 rounded-2xl ${s.style} flex items-center justify-center mb-4 transition duration-500 group-hover:scale-110 shadow-sm`}>
                          <s.icon size={26} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-black text-slate-800 tracking-tight">{s.name}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setAppState('HOME')} className="w-full mt-10 p-5 text-slate-400 font-black uppercase tracking-widest text-[10px]">Discard Request</button>
                </div>
              </div>
            )}

            {/* SEARCHING SOCKET RADAR */}
            {appState === 'SEARCHING_SOCKET' && (
              <div className="flex-1 flex flex-col items-center justify-center z-20 bg-slate-950/95 backdrop-blur-2xl px-12">
                <div className="relative w-72 h-72 flex items-center justify-center">
                    <div className="absolute inset-0 border border-white/5 rounded-full" />
                    <div className="absolute inset-8 border border-white/10 rounded-full" />
                    <div className="absolute inset-16 border border-white/20 rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-full h-full rounded-full border-[2px] border-blue-500 animate-[ping_2s_linear_infinite] opacity-20" />
                    </div>
                    <div className="absolute inset-0 animate-spin-slow opacity-40">
                         <Radar size={288} className="text-blue-500/20" strokeWidth={1} />
                    </div>
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 relative z-10">
                        <MapPin size={36} className="text-white animate-bounce" />
                    </div>
                </div>
                <div className="mt-16 text-center space-y-4">
                    <h4 className="text-2xl font-black text-white tracking-tighter italic">Finding nearby mechanics...</h4>
                    <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing with Socket Gateway 8080</p>
                </div>
              </div>
            )}

            {/* TRACKING OVERLAY */}
            {appState === 'TRACKING' && (
              <div className="flex-1 flex flex-col justify-end p-8 z-20 relative">
                <div className="absolute top-16 left-8 right-8 p-6 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-2xl flex items-center gap-5 animate-in slide-in-from-top-12 duration-1000">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                        <Navigation size={26} className="animate-bounce" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Arriving In</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter italic">5 Min <span className="text-slate-400 text-sm font-medium not-italic ml-2">• 1.4 km</span></p>
                    </div>
                </div>

                <div className="bg-slate-950/80 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-12 duration-700">
                     <div className="flex items-center gap-6 mb-10 pb-8 border-b border-white/5">
                        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl border border-white/20 text-white font-black italic text-xl">JA</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2.5 mb-1.5">
                                <h3 className="text-2xl font-black text-white italic tracking-tighter">John Andrews</h3>
                                <ShieldCheck size={20} className="text-blue-500" />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 w-fit">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-black text-white tracking-widest">4.8</span>
                            </div>
                        </div>
                     </div>

                     <div className="flex gap-4 h-16">
                        <button onClick={() => setAppState('PAYMENT')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-2xl flex items-center justify-center transition shadow-2xl shadow-emerald-900/20 font-black tracking-widest uppercase text-xs">
                          <Phone size={20} className="mr-3" />
                          Call Agent
                        </button>
                        <button onClick={() => setAppState('HOME')} className="px-6 border-2 border-white/10 text-white/40 rounded-2xl active:scale-90 transition hover:border-white/30 hover:text-white">
                          <X size={24} />
                        </button>
                     </div>
                </div>
              </div>
            )}

            {/* PAYMENT & REVIEW SUCCESS */}
            {appState === 'PAYMENT' && (
              <div className="flex-1 flex flex-col relative z-20 bg-white p-10 animate-in slide-in-from-right-12 duration-700">
                <div className="mt-16 text-center space-y-6">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-100">
                        <CheckCircle2 size={48} className="text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Payment Success</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Razorpay UUID: #X92-23190</p>
                    </div>
                </div>

                <div className="mt-16 flex-1 space-y-12">
                    <div className="text-center space-y-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Moderation Rating</p>
                        <div className="flex justify-center gap-3">
                           {[1, 2, 3, 4, 5].map((s) => (
                             <button key={s} onClick={() => setRating(s)} className="transition-transform active:scale-90">
                               <Star size={36} className={`transition-all duration-300 ${s <= rating ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-lg' : 'text-slate-100'}`} />
                             </button>
                           ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-1">Testimonial Ledger</p>
                        <textarea 
                            placeholder="Detail your operational experience..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 text-sm font-bold focus:ring-8 focus:ring-blue-100/30 focus:outline-none transition-all placeholder-slate-300 min-h-[140px]"
                        ></textarea>
                    </div>
                </div>

                <div className="mt-auto">
                    <button onClick={() => setAppState('HOME')} className="w-full h-18 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl transition active:scale-[0.98]">
                        Submit & Finalize Protocol
                    </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* GARAGE OWNER APP EXPERIENCE */
          <div className="flex-1 flex flex-col bg-slate-50 p-8 h-full relative overflow-hidden">
            <header className="flex justify-between items-center mb-12 pt-6 relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Terminal Node</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">Racer-Forge Ops</h3>
              </div>
              <button 
                onClick={() => setStatus(prev => prev === 'OFFLINE' ? 'ONLINE' : 'OFFLINE')}
                className={`p-1.5 rounded-full w-28 h-12 flex transition-all duration-700 relative bg-white border-2 shadow-inner ${status !== 'OFFLINE' ? 'border-emerald-500/20' : 'border-slate-100'}`}
              >
                  <div className={`h-full w-12 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center ${status !== 'OFFLINE' ? 'translate-x-12 bg-emerald-500' : 'bg-slate-300'}`}>
                    <LogOut size={16} className={`text-white rotate-180 transition-transform ${status !== 'OFFLINE' ? 'rotate-0' : ''}`} />
                  </div>
                  <span className={`absolute top-1/2 -translate-y-1/2 left-0 w-full text-center pointer-events-none text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${status !== 'OFFLINE' ? 'opacity-0' : 'opacity-100'}`}>Offline</span>
                  <span className={`absolute top-1/2 -translate-y-1/2 left-0 w-full text-center pointer-events-none text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 opacity-0 ${status !== 'OFFLINE' ? 'opacity-100' : 'opacity-0'}`}>Online</span>
              </button>
            </header>

            {/* DASHBOARD SUMMARY */}
            <div className="grid grid-cols-2 gap-6 mb-12 relative z-10">
              <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl group overflow-hidden active:scale-95 transition">
                <TrendingUp size={24} className="text-blue-500 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Earnings</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter italic">₹ 1,500</p>
              </div>
              <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl group overflow-hidden active:scale-95 transition">
                <CheckCircle2 size={24} className="text-emerald-500 mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jobs Done</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter italic">03</p>
              </div>
            </div>

            {/* LIVE FEED STUB */}
            <div className="flex-1 bg-white rounded-[3rem] border border-slate-100 p-10 relative flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
                <div className="absolute top-8 left-8 flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${status === 'ONLINE' ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Signal</h4>
                </div>
                
                {status === 'ONLINE' ? (
                  <>
                    <div className="w-24 h-24 relative flex items-center justify-center">
                        <Radar size={80} className="text-blue-500 opacity-10 animate-[spin_4s_linear_infinite]" />
                        <Globe size={40} className="text-blue-600 absolute animate-pulse" />
                    </div>
                    <div>
                        <p className="text-xl font-black text-slate-900 tracking-tight italic">Monitoring Socket 1102...</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Ahmedabad Sector 12 Corridor</p>
                    </div>
                    <button 
                      onClick={() => setStatus('INCOMING_SOCKET')}
                      className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-300 hover:scale-105 active:scale-95 transition"
                    >
                        Simulate Job Payload
                    </button>
                  </>
                ) : (
                   <div className="opacity-20 flex flex-col items-center space-y-6">
                        <LogOut size={64} className="rotate-180" />
                        <p className="text-lg font-black italic tracking-tighter italic">Node Inactive</p>
                   </div>
                )}
            </div>

            {/* INCOMING SOCKET ALERT */}
            {status === 'INCOMING_SOCKET' && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl z-50 p-10 flex items-center justify-center animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3.5rem] p-12 w-full shadow-2xl relative overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-500">
                        {/* 30s Circular Countdown Overlay */}
                        <div className="absolute top-10 right-10 flex items-center justify-center w-20 h-20">
                            <svg className="w-20 h-20 -rotate-90">
                                <circle 
                                    className="text-slate-100" 
                                    strokeWidth="8" 
                                    stroke="currentColor" 
                                    fill="transparent" 
                                    r="34" 
                                    cx="40" 
                                    cy="40" 
                                />
                                <circle 
                                    className="text-red-500 transition-all duration-1000" 
                                    strokeWidth="8" 
                                    strokeDasharray={214}
                                    strokeDashoffset={214 - (214 * timer) / 30}
                                    strokeLinecap="round" 
                                    stroke="currentColor" 
                                    fill="transparent" 
                                    r="34" 
                                    cx="40" 
                                    cy="40" 
                                />
                            </svg>
                            <span className="absolute text-xl font-black text-slate-900 italic tracking-tighter italic">{timer}</span>
                        </div>

                        <div className="flex items-center gap-3 mb-12">
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="font-black text-red-600 uppercase text-xs tracking-widest italic animate-pulse">🚨 NEW REQUEST DETECTED</span>
                        </div>
                        
                        <div className="space-y-8 mb-16">
                            <div>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic italic">Flat Tire</h1>
                                <div className="flex items-center gap-3 mt-3 text-slate-400 font-bold text-sm uppercase tracking-widest">
                                    <MapPin size={18} className="text-blue-500" />
                                    2.0 km away • Sector 12
                                </div>
                            </div>
                            <div className="flex gap-5 p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
                                <Award size={24} className="text-amber-500" strokeWidth={3} />
                                <div>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Priority Assistance</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Value: ₹ 280.00</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button 
                              onClick={() => setStatus('ACTIVE_JOB')}
                              className="w-full h-20 bg-emerald-500 text-white rounded-[2rem] font-black tracking-[0.2em] uppercase text-sm shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-4"
                            >
                                <CheckCircle2 size={24} />
                                ACCEPT REQUEST
                            </button>
                            <button 
                              onClick={() => setStatus('ONLINE')}
                              className="w-full h-16 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-slate-900 active:scale-95 transition-all"
                            >
                                DECLINE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ACTIVE JOB ROUTE VIEW */}
            {status === 'ACTIVE_JOB' && (
              <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-right-full duration-700">
                 {/* Simulated Route Background */}
                 <div className="flex-1 bg-slate-50 relative overflow-hidden">
                    <svg width="100%" height="100%" className="opacity-20">
                        <path d="M 0 400 Q 200 400 400 0" stroke="blue" strokeWidth="12" fill="none" className="animate-[dash_10s_linear_infinite]" strokeLinecap="round" />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-6">
                        <Navigation size={64} className="text-blue-600 animate-bounce" />
                        <div className="px-6 py-3 bg-white shadow-2xl rounded-2xl text-[10px] font-black uppercase tracking-widest italic italic">Navigating to Amit Sharma</div>
                    </div>
                 </div>

                 <div className="bg-slate-900 p-10 rounded-t-[4rem] shadow-[0_-20px_80px_rgba(0,0,0,0.4)] space-y-10 relative z-10">
                    <div className="flex items-center justify-between pb-10 border-b border-white/10">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-white font-black italic text-xl border border-white/10">AS</div>
                            <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1.5 font-sans">Driver Contact</p>
                                <p className="text-2xl font-black text-white tracking-tighter italic">Amit Sharma</p>
                            </div>
                        </div>
                        <button className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 active:scale-90 transition">
                            <Phone size={28} />
                        </button>
                    </div>
                    
                    <button 
                      onClick={() => { setStatus('ONLINE'); setTimer(30); }}
                      className="w-full h-20 bg-emerald-500 text-white rounded-[2rem] font-black tracking-[0.3em] uppercase text-xs shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                    >
                        <CheckCircle2 size={24} className="group-hover:scale-125 transition duration-500" />
                        MARK COMPLETED
                    </button>
                 </div>
              </div>
            )}
            
            <div className="mt-auto h-24 bg-white/10 backdrop-blur-3xl border-t border-slate-100 flex items-center justify-around px-10 relative z-50">
                <Bell size={22} className="text-slate-400 hover:text-slate-900 transition" />
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black italic tracking-widest text-lg shadow-xl shadow-slate-200">GN</div>
                <User size={22} className="text-slate-400 hover:text-slate-900 transition" />
            </div>
          </div>
        )}
    </div>
  );
};

export default MobileUI;
