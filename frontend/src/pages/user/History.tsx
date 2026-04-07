import { 
  MapPin, 
  ArrowLeft,
  Calendar,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../constants/navigationConstant';

const UserHistory = () => {
    const navigate = useNavigate();

    const historyItems = [
        { id: 'SOS-9482', type: 'Flat Tire', date: 'Oct 24, 202 strata', location: 'Navrangpura Node', status: 'COMPLETED', mechanic: 'Amit Sharma', cost: '₹ 450' },
        { id: 'SOS-9231', type: 'Battery Jump', date: 'Oct 20, 202 strata', location: 'Satellite Sector', status: 'CANCELLED', mechanic: 'N/A', cost: '₹ 0' },
        { id: 'SOS-8912', type: 'Engine Check', date: 'Sep 15, 202 strata', location: 'Vastrapur Hub', status: 'COMPLETED', mechanic: 'Precision Motors', cost: '₹ 1,200' },
    ];

    return (
        <div className="min-h-full bg-slate-950 p-8 space-y-12 animate-in fade-in duration-1000">
            {/* Header HUD */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8 bg-slate-900/50 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                <div className="relative z-10 space-y-2 text-center sm:text-left">
                    <h2 className="text-3xl xs:text-4xl font-black text-white tracking-tighter italic uppercase">Logistics Archive</h2>
                    <p className="text-slate-500 font-medium italic text-xs xs:text-sm">Audit trail of past emergency rescue protocols.</p>
                </div>
                <button 
                    onClick={() => navigate(USER_ROUTES.HOME)} 
                    className="relative z-10 self-center sm:self-auto w-12 h-12 xs:w-16 xs:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition group active:scale-90"
                >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>

            {/* History Feed */}
            <div className="space-y-4 xs:space-y-6 max-w-2xl mx-auto lg:mx-0">
                {historyItems.map((item) => (
                    <div key={item.id} className="bg-slate-900/40 border border-white/5 p-6 xs:p-8 rounded-[2rem] xs:rounded-[3rem] backdrop-blur-3xl hover:bg-white/5 hover:border-white/10 transition-all duration-500 group relative overflow-hidden active:scale-[0.98]">
                        <div className="flex flex-col xs:flex-row items-center justify-between gap-4 mb-6 xs:mb-8 text-center xs:text-left">
                            <div className="flex items-center gap-3 xs:gap-4">
                                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl xs:rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">
                                    <Activity size={20} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h4 className="text-lg xs:text-xl font-black text-white italic tracking-tighter uppercase leading-tight">{item.type}</h4>
                                    <span className="text-[8px] xs:text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.id}</span>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${item.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                {item.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 xs:gap-8 mb-6 xs:mb-8 pb-6 xs:pb-8 border-b border-white/5">
                            <div className="flex flex-col xs:flex-row items-center gap-2 xs:gap-3 text-center xs:text-left">
                                <Calendar size={14} className="text-slate-500" />
                                <span className="text-[10px] xs:text-xs font-bold text-white/60 italic leading-tight">{item.date}</span>
                            </div>
                            <div className="flex flex-col xs:flex-row items-center gap-2 xs:gap-3 text-center xs:text-left">
                                <MapPin size={14} className="text-slate-500" />
                                <span className="text-[10px] xs:text-xs font-bold text-white/60 italic leading-tight truncate w-full">{item.location}</span>
                            </div>
                        </div>

                        <div className="flex flex-col xs:flex-row items-center justify-between gap-4 text-center xs:text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white font-black text-[10px] uppercase italic">
                                    {item.mechanic.charAt(0)}
                                </div>
                                <span className="text-[10px] xs:text-xs font-black text-white italic tracking-tight truncate">{item.mechanic}</span>
                            </div>
                            <p className="text-lg xs:text-2xl font-black text-white italic tracking-tighter leading-none">{item.cost}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State Simulation Offset Card */}
            <div className="p-8 xs:p-10 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] xs:rounded-[3rem] max-w-2xl mx-auto lg:mx-0 text-center space-y-3 xs:space-y-4">
                 <ShieldCheck size={40} className="text-blue-500 mx-auto" />
                 <h4 className="text-lg xs:text-xl font-black text-white italic uppercase tracking-tighter">Cipher Verification Locked</h4>
                 <p className="text-slate-500 text-xs xs:text-sm font-medium italic leading-relaxed uppercase">All past interactions are encrypted and archived for strategic auditing purposes.</p>
            </div>
        </div>
    );
};

export default UserHistory;
