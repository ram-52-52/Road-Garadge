import { 
  MapPin, 
  Phone, 
  Lock, 
  ChevronRight, 
  LogOut, 
  ShieldCheck, 
  Star
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-full bg-slate-950 p-8 space-y-12 animate-in fade-in duration-1000">
            {/* Identity Banner */}
            <div className="space-y-3 xs:space-y-4 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-[8px] xs:text-[9px] font-black uppercase tracking-[0.3em] xs:tracking-[0.4em] text-blue-400">
                    Verified Driver Profile
                </div>
                <h2 className="text-3xl xs:text-4xl font-black text-white tracking-tighter italic uppercase leading-none">Account Protocol</h2>
            </div>

            {/* Profile Strategic Information Card */}
            <div className="bg-slate-900/50 p-6 xs:p-8 sm:p-10 rounded-[2.5rem] xs:rounded-[3rem] border border-white/5 backdrop-blur-3xl space-y-8 xs:space-y-10 max-w-lg mx-auto lg:mx-0">
                <div className="flex flex-col xs:flex-row items-center gap-5 xs:gap-6 pb-8 xs:pb-10 border-b border-white/5 text-center xs:text-left">
                    <div className="w-20 h-20 xs:w-24 xs:h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl xs:rounded-[2rem] p-1 flex items-center justify-center italic text-white font-black text-3xl italic">
                        <div className="w-full h-full bg-slate-900 rounded-xl xs:rounded-[1.8rem] flex items-center justify-center">
                            {user?.name?.charAt(0) || 'D'}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl xs:text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">{user?.name || 'Driver Identity'}</h3>
                        <div className="flex items-center justify-center xs:justify-start gap-2 mt-2">
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                            <span className="text-[10px] xs:text-xs font-black text-white/60 tracking-widest uppercase italic">4.9 Master Rating</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 xs:space-y-6">
                    {[
                        { icon: Phone, label: 'Handshake Phone', value: user?.phone || 'Not Configured' },
                        { icon: MapPin, label: 'Strategic Sector', value: 'Ahmedabad (Global Hub)' },
                        { icon: Lock, label: 'Access Protocol', value: '****************' },
                    ].map((item) => (
                        <div key={item.label} className="group flex items-center justify-between p-4 xs:p-6 bg-white/5 rounded-2xl xs:rounded-3xl border border-white/5 transition duration-500 hover:bg-white/10 active:scale-[0.98]">
                            <div className="flex items-center gap-4 xs:gap-5">
                                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-slate-800 rounded-xl xs:rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <item.icon size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[8px] xs:text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-[12px] xs:text-sm font-black text-white tracking-tight italic uppercase">{item.value}</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-700" />
                        </div>
                    ))}
                </div>

                <button 
                    onClick={handleLogout}
                    className="w-full h-14 xs:h-16 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] xs:tracking-[0.4em] text-[9px] xs:text-[10px] transition-all flex items-center justify-center gap-3 xs:gap-4 shadow-2xl shadow-rose-600/20 active:scale-[0.98]"
                >
                    Decommission Session
                    <LogOut size={18} />
                </button>
            </div>

            {/* Performance Visual Metric Footer */}
            <div className="p-8 xs:p-10 bg-slate-900 border border-white/5 rounded-[2.5rem] xs:rounded-[3rem] lg:rounded-[4rem] max-w-lg mx-auto lg:mx-0 overflow-hidden relative text-center xs:text-left">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full" />
                 <div className="relative z-10 space-y-4 xs:space-y-6">
                    <ShieldCheck size={32} className="text-emerald-500 mx-auto xs:mx-0" />
                    <div className="space-y-1 xs:space-y-2">
                         <h4 className="text-lg xs:text-xl font-black italic tracking-tighter text-white uppercase leading-none">Strategic Profile</h4>
                         <p className="text-slate-500 text-[10px] xs:text-xs font-medium leading-relaxed italic uppercase italic">Your driver identity is synchronized across all active global sectors for priority dispatch logic.</p>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default UserProfile;
