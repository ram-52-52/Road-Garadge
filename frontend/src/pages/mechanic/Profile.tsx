import { 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Award, 
  LogOut, 
  ChevronRight, 
  Wrench,
  Star,
  ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { MECHANIC_ROUTES } from '../../constants/navigationConstant';

const MechanicProfile = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-full bg-slate-50 p-4 xs:p-6 sm:p-8 space-y-8 xs:space-y-12 animate-in fade-in duration-1000">
            {/* Identity Header HUD */}
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-2 xs:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-white rounded-full text-[7px] xs:text-[8px] font-black uppercase tracking-[0.2em] xs:tracking-[0.4em]">
                        Verified Partner Identity
                    </div>
                    <h2 className="text-2xl xs:text-4xl font-black text-slate-950 tracking-tighter italic uppercase leading-tight">Partner Profile</h2>
                </div>
                <button 
                    onClick={() => navigate(MECHANIC_ROUTES.DASHBOARD)} 
                    className="w-12 h-12 xs:w-16 xs:h-16 bg-white rounded-xl xs:rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-950 transition group shadow-sm shadow-slate-100 shrink-0"
                >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Profile Strategic Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Identity Module */}
                <div className="bg-white border border-slate-100 p-6 xs:p-12 rounded-[2.5rem] xs:rounded-[4rem] space-y-8 xs:space-y-10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[100px] rounded-full" />
                    <div className="flex items-center gap-5 xs:gap-8 pb-8 xs:pb-10 border-b border-slate-50 relative z-10">
                        <div className="w-16 h-16 xs:w-24 xs:h-24 bg-slate-950 rounded-2xl xs:rounded-[2.5rem] flex items-center justify-center text-white italic font-black text-xl xs:text-3xl shadow-2xl shrink-0">
                             {user?.name?.charAt(0) || 'M'}
                        </div>
                        <div className="space-y-1 xs:space-y-2 min-w-0">
                             <h3 className="text-xl xs:text-3xl font-black text-slate-950 italic tracking-tighter uppercase truncate">{user?.name || 'Partner Node'}</h3>
                             <div className="flex items-center gap-1.5 xs:gap-2.5 px-3 xs:px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 w-fit shrink-0">
                                 <Star size={14} className="fill-emerald-500" />
                                 <span className="text-[7px] xs:text-[10px] font-black uppercase tracking-widest italic leading-none">4.9 Performance</span>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-4 xs:space-y-6 relative z-10">
                        {[
                            { icon: Phone, label: 'Phone', value: user?.phone || 'Not Configured' },
                            { icon: MapPin, label: 'Hub Sector', value: 'Satellite Node, Ahmedabad' },
                            { icon: ShieldCheck, label: 'Protocol', value: 'Verified Strategy Alpha' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between p-4 xs:p-6 bg-slate-50 border border-slate-100 rounded-2xl xs:rounded-3xl transition duration-500 hover:bg-slate-100/50 group cursor-default">
                                <div className="flex items-center gap-4 xs:gap-5 min-w-0">
                                    <div className="w-10 h-10 xs:w-12 xs:h-12 bg-white rounded-xl xs:rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm shrink-0">
                                        <item.icon size={20} />
                                    </div>
                                    <div className="text-left min-w-0">
                                        <p className="text-[8px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest italic truncate">{item.label}</p>
                                        <p className="text-[11px] xs:text-sm font-black text-slate-950 tracking-tight italic uppercase truncate">{item.value}</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-200 shrink-0" />
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="w-full h-14 xs:h-18 bg-slate-950 hover:bg-slate-800 text-white rounded-xl xs:rounded-2xl font-black uppercase tracking-[0.2em] xs:tracking-[0.4em] text-[10px] transition shadow-2xl shadow-slate-950/20 active:scale-[0.98] flex items-center justify-center gap-3 xs:gap-4 relative z-10"
                    >
                        Decommission Session
                        <LogOut size={18} />
                    </button>
                </div>

                 {/* Performance Analytics Sidebar */}
                <div className="space-y-6 xs:space-y-8">
                     <div className="bg-slate-950 p-8 xs:p-12 rounded-[2.5rem] xs:rounded-[4rem] text-white overflow-hidden relative shadow-2xl group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent opacity-50" />
                        <div className="relative z-10 space-y-6 xs:space-y-8">
                            <Award size={48} className="text-blue-500 animate-[bounce_3s_ease-in-out_infinite]" />
                            <div className="space-y-2">
                                <h4 className="text-xl xs:text-2xl font-black italic tracking-tighter uppercase">Sector Milestone</h4>
                                <p className="text-slate-500 text-[11px] xs:text-sm font-medium leading-relaxed italic pr-4 xs:pr-12">"Peak partner node capacity detected. Priority routing active."</p>
                            </div>
                            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-6 xs:gap-8 pt-6 border-t border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[8px] xs:text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Node Ranking</p>
                                    <p className="text-xl xs:text-2xl font-black text-white italic tracking-tighter uppercase">Top 1%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] xs:text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Global Sector</p>
                                    <p className="text-xl xs:text-2xl font-black text-white italic tracking-tighter uppercase">Gujarat-01</p>
                                </div>
                            </div>
                        </div>
                     </div>

                     <div className="bg-white border border-slate-100 p-6 xs:p-10 rounded-[1.5rem] xs:rounded-[3rem] shadow-sm flex items-center gap-5 xs:gap-8 hover:scale-[1.02] transition duration-700 cursor-pointer group">
                        <div className="w-12 h-12 xs:w-16 xs:h-16 bg-blue-50 rounded-xl xs:rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-sm shadow-blue-100 shrink-0">
                             <Wrench size={28} />
                        </div>
                        <div className="flex-1 min-w-0">
                             <h5 className="text-base xs:text-lg font-black text-slate-950 italic tracking-tighter uppercase truncate">Fleet Identity</h5>
                             <p className="text-[10px] xs:text-xs font-bold text-slate-400 italic truncate">Configure logistical tools.</p>
                        </div>
                        <ChevronRight size={20} className="text-slate-200 shrink-0" />
                     </div>
                </div>

            </div>
        </div>
    );
};

export default MechanicProfile;
