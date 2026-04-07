import { 
  Phone, 
  ShieldCheck, 
  Star, 
  ChevronRight,
  MapPin,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../constants/navigationConstant';

const UserTracking = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-full relative flex flex-col bg-slate-950">
            {/* Immersive Navigation Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-slate-900" />
                <div className="absolute inset-0 opacity-[0.2]" 
                    style={{ 
                        backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', 
                        backgroundSize: '40px 40px' 
                    }} 
                />
                
                {/* Route visualization simulation */}
                <svg width="100%" height="100%" className="absolute inset-0 opacity-20">
                    <path d="M 100 600 Q 200 400 400 350" stroke="#3b82f6" strokeWidth="4" fill="none" strokeDasharray="10 6" className="animate-[dash_20s_linear_infinite]" />
                </svg>

                {/* Mechanic Anchor */}
                <div className="absolute top-[350px] left-[400px] -translate-x-1/2 -translate-y-1/2">
                    <div className="w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 border-2 border-blue-500 font-black italic shadow-blue-500/20">GN</div>
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 scale-125" />
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

            {/* Tracking Status Card (Expansive Glassmorphism) */}
            <div className="mt-auto relative z-10 p-8 space-y-6">
                <div className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/10 shadow-2xl space-y-10 animate-in slide-in-from-bottom-20 duration-1000 max-w-lg">
                    <div className="flex items-center justify-between pb-8 border-b border-white/5">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl border border-white/20 text-white font-black italic text-xl italic italic">JA</div>
                            <div>
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    <h3 className="text-2xl font-black text-white italic tracking-tighter italic">John Andrews</h3>
                                    <ShieldCheck size={20} className="text-blue-400" />
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 w-fit">
                                    <Star size={14} className="text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-black text-white tracking-widest italic">4.8 Global Rating</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 active:scale-90 transition group">
                            <Phone size={24} className="group-hover:animate-bounce" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Global Positioning</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-white italic tracking-tight">
                                    <span className="flex items-center gap-2"><Clock size={12} className="text-blue-500" /> Arriving In</span>
                                    <span className="text-blue-400 uppercase italic">4 MINS</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full w-[70%] animate-in slide-in-from-left duration-[3000ms]" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Fleet Identification</p>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-white tracking-tight uppercase">Mahindra Thar</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">GJ01-AX-9234</span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full h-16 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black tracking-[0.3em] uppercase text-[10px] transition active:scale-[0.98] flex items-center justify-center gap-4">
                        Strategic Status Update
                        <ChevronRight size={16} />
                    </button>
                </div>
                
                {/* Secondary Hub Status */}
                <div className="max-w-lg px-8 py-4 bg-slate-900/30 backdrop-blur-xl rounded-full border border-white/5 flex items-center justify-between shadow-2xl">
                    <div className="flex items-center gap-3">
                         <MapPin size={14} className="text-blue-500" />
                         <span className="text-[8px] font-black uppercase tracking-widest text-white/40 italic">Regional Sector 12 - AHMEDABAD HUB</span>
                    </div>
                    <div className="h-1 w-20 bg-white/5 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default UserTracking;
