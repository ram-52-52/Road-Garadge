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

const MechanicActiveJob = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-full bg-white p-4 xs:p-6 sm:p-8 space-y-8 xs:space-y-12 animate-in fade-in duration-1000">
            {/* Header Strategic HUD */}
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-2 xs:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[7px] xs:text-[8px] font-black uppercase tracking-[0.2em] xs:tracking-[0.4em] text-emerald-600">
                        Operational Dispatch Active
                    </div>
                    <h2 className="text-2xl xs:text-4xl font-black text-slate-950 tracking-tighter italic uppercase leading-tight">Interaction Hub</h2>
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
                                <div className="space-y-1 xs:space-y-2">
                                    <h3 className="text-xl xs:text-3xl font-black italic tracking-tighter uppercase">Rahul Mehta</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-slate-400 text-[8px] xs:text-[10px] font-black uppercase tracking-widest">
                                            Sector Ahmedabad-04
                                        </div>
                                    </div>
                                </div>
                                <div className="w-14 h-14 xs:w-20 xs:h-20 bg-blue-600 rounded-2xl xs:rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 text-white italic font-black text-xl xs:text-2xl shrink-0">RM</div>
                            </div>
                            
                            <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 xs:gap-8">
                                <div className="space-y-3 xs:space-y-4">
                                     <p className="text-[9px] xs:text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Position Data</p>
                                     <div className="flex items-center gap-3 xs:gap-4 group cursor-pointer hover:bg-white/5 p-3 xs:p-4 rounded-xl xs:rounded-2xl transition duration-500 border border-white/5">
                                         <MapPin size={24} className="text-blue-500 shrink-0" />
                                         <span className="text-[11px] xs:text-sm font-black uppercase italic tracking-tight underline truncate">Navrangpura Hub</span>
                                     </div>
                                </div>
                                <div className="space-y-3 xs:space-y-4">
                                     <p className="text-[9px] xs:text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Operational Requirement</p>
                                     <div className="flex items-center gap-3 xs:gap-4 group p-3 xs:p-4 bg-white/5 rounded-xl xs:rounded-2xl border border-white/5">
                                         <Activity size={24} className="text-emerald-500 shrink-0" />
                                         <span className="text-[11px] xs:text-sm font-black uppercase italic tracking-tight truncate">Flat Tire Rescue</span>
                                     </div>
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-white/5 flex flex-wrap gap-3 xs:gap-4">
                                <button className="h-14 xs:h-16 flex-1 bg-blue-600 hover:bg-blue-500 rounded-xl xs:rounded-2xl font-black text-[9px] xs:text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 xs:gap-3 shrink-0 min-w-[140px]">
                                    <Navigation size={18} />
                                    Launch Navigation
                                </button>
                                <div className="flex gap-3 xs:gap-4">
                                    <button className="h-14 w-14 xs:h-16 xs:w-16 bg-white/5 hover:bg-white/10 rounded-xl xs:rounded-2xl flex items-center justify-center transition active:scale-95 border border-white/5 shrink-0">
                                        <Phone size={20} />
                                    </button>
                                    <button className="h-14 w-14 xs:h-16 xs:w-16 bg-white/5 hover:bg-white/10 rounded-xl xs:rounded-2xl flex items-center justify-center transition active:scale-95 border border-white/5 shrink-0">
                                        <MessageSquare size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 xs:p-10 bg-slate-50 rounded-[2rem] xs:rounded-[3rem] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                         <div className="flex items-center gap-4 xs:gap-6">
                             <div className="w-12 h-12 xs:w-14 xs:h-14 bg-white rounded-xl xs:rounded-2xl flex items-center justify-center text-slate-900 shadow-sm border border-slate-100 shrink-0">
                                 <Clock size={24} />
                             </div>
                             <div>
                                 <p className="text-[8px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Operational Window</p>
                                 <p className="text-lg xs:text-xl font-black text-slate-950 italic tracking-tighter uppercase">14 Min Response</p>
                             </div>
                         </div>
                         <div className="h-1.5 w-full sm:w-40 bg-slate-200 rounded-full overflow-hidden shrink-0">
                             <div className="h-full bg-blue-600 rounded-full w-[45%]" />
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
                        <button className="w-full h-14 xs:h-18 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl xs:rounded-2xl font-black text-[9px] xs:text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-600/10 active:scale-95 transition-all flex items-center justify-center gap-2 xs:gap-3">
                            Finalize Handshake
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MechanicActiveJob;
