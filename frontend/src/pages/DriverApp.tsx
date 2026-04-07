import { useState } from 'react';
import { 
  Phone, 
  Wrench, 
  Truck, 
  Battery, 
  CircleDot, 
  ShieldCheck, 
  Star, 
  Bell, 
  Zap,
  Clock
} from 'lucide-react';

const DriverApp = () => {
    const [showTracking, setShowTracking] = useState(true);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-red-500/30 overflow-hidden">
            {/* Real Hardware Phone Shell */}
            <div className="w-full max-w-md h-[800px] border-[10px] border-slate-800 rounded-[3.5rem] overflow-hidden relative bg-slate-900 shadow-[0_0_100px_-20px_rgba(30,41,59,1)] flex flex-col scale-95 sm:scale-100 transition-transform duration-700">
                
                {/* Hardware Notch / Dynamic Island Component */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-slate-800 rounded-b-3xl z-50 flex items-center justify-center border-x border-b border-slate-700/50">
                    <div className="w-10 h-1 bg-slate-700/60 rounded-full" />
                </div>

                {/* Substrate: Map Dots / Radar Grid */}
                <div className="absolute inset-0 bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.15]" 
                        style={{ 
                            backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', 
                            backgroundSize: '30px 30px' 
                        }} 
                    />
                    {/* Simulated Major Roads */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-800 -rotate-12" />
                    <div className="absolute top-0 left-1/3 w-[1px] h-full bg-slate-800 rotate-45" />
                    
                    {/* Pulsing My Location Indicator */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] relative z-10" />
                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 scale-150" />
                    </div>
                </div>

                {/* Header: Identity & Notifications */}
                <header className="relative z-20 px-8 pt-12 pb-6 flex justify-between items-center">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900">
                                <Zap size={14} fill="currentColor" />
                             </div>
                             <h1 className="text-xl font-black text-white italic tracking-tighter italic">GarageNow</h1>
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Ahmedabad Sector 12</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition group">
                            <Bell size={18} className="group-hover:animate-swing" />
                        </button>
                        <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black italic shadow-lg">AM</div>
                    </div>
                </header>

                {/* Content: The High-Stakes SOS View */}
                <main className="flex-1 relative flex flex-col items-center justify-center z-10 px-8">
                     <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-top-12 duration-1000">
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[8px] font-black uppercase tracking-widest text-red-500 italic">
                             <Clock size={10} className="animate-pulse" />
                             Real-Time Emergency Monitor Active
                         </div>
                         <h2 className="text-4xl font-black text-white tracking-tight leading-none italic italic">Require Urgent Assistance?</h2>
                     </div>

                     {/* The Legend SOS Pulsing Button */}
                     <button className="group relative w-64 h-64 flex items-center justify-center transition-transform active:scale-95 duration-500">
                        {/* Ripple Layers */}
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20 scale-150" />
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-30 scale-125" />
                        
                        {/* Button Core */}
                        <div className="w-52 h-52 bg-gradient-to-tr from-red-700 to-rose-500 rounded-full shadow-[0_20px_50px_rgba(225,29,72,0.4)] flex flex-col items-center justify-center border-[12px] border-white/20 hover:scale-105 transition-all duration-700 relative z-20 overflow-hidden">
                             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                             <span className="text-white text-5xl font-black italic tracking-tighter drop-shadow-lg">S.O.S</span>
                             <span className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2 group-hover:text-white transition-colors">Help Now</span>
                        </div>
                     </button>
                </main>

                {/* Floating Tracking Card Overlay (Glassmorphism) */}
                {showTracking && (
                   <div className="absolute top-1/4 left-6 right-6 z-40 animate-in slide-in-from-bottom-20 duration-1000">
                      <div className="bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full translate-x-12 -translate-y-12" />
                         
                         <div className="flex items-center justify-between pb-6 border-b border-white/5">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl border border-white/20 text-white font-black italic text-xl">JA</div>
                               <div>
                                  <div className="flex items-center gap-2 mb-1">
                                     <h3 className="text-xl font-black text-white italic tracking-tight">John Andrews</h3>
                                     <ShieldCheck size={18} className="text-blue-400" />
                                  </div>
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/10 w-fit">
                                     <Star size={12} className="text-amber-400 fill-amber-400" />
                                     <span className="text-xs font-black text-white tracking-widest">4.8</span>
                                  </div>
                               </div>
                            </div>
                            <button className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/10 active:scale-90 transition group">
                               <Phone size={24} className="group-hover:animate-bounce" />
                            </button>
                         </div>

                         <div className="space-y-2">
                             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Mechanic is 5 mins away</span>
                                <span className="text-blue-500 italic">1.2 KM</span>
                             </div>
                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full w-[65%] animate-in slide-in-from-left duration-[2000ms]" />
                             </div>
                         </div>

                         <div className="flex items-center justify-between pt-2">
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Vehicle Identity</span>
                               <span className="text-sm font-black text-white tracking-tight uppercase">Mahindra Thar • GJ01-9234</span>
                            </div>
                            <button onClick={() => setShowTracking(false)} className="text-xs font-black text-rose-500/60 hover:text-rose-500 transition-colors uppercase tracking-[0.2em] border-b border-rose-500/20">Cancel request</button>
                         </div>
                      </div>
                   </div>
                )}

                {/* Bottom Service Drawer: Always Active Presence */}
                <div className="relative z-30 mt-auto px-8 pb-10">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-950/20 border border-slate-100 flex flex-col space-y-8 animate-in slide-in-from-bottom-40 duration-700">
                        <div className="w-10 h-1 bg-slate-100 rounded-full mx-auto" />
                        
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter">Select Essential Service</h3>
                            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">See all</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { name: 'Flat Tire', icon: CircleDot, style: 'bg-indigo-50 text-indigo-600' },
                                { name: 'Battery', icon: Battery, style: 'bg-emerald-50 text-emerald-600' },
                                { name: 'Engine', icon: Wrench, style: 'bg-rose-50 text-rose-600' },
                                { name: 'Towing', icon: Truck, style: 'bg-amber-50 text-amber-600' },
                            ].map((s) => (
                                <button key={s.name} className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100/50 rounded-3xl hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-300 group active:scale-95">
                                    <div className={`w-14 h-14 rounded-2xl ${s.style} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition duration-500`}>
                                        <s.icon size={26} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-sm font-black text-slate-800 tracking-tight">{s.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* iPhone Style Navigation Bar Indicator */}
                <div className="h-2 w-32 bg-slate-800 rounded-full mx-auto mb-2 opacity-50" />
            </div>
        </div>
    );
};

export default DriverApp;
