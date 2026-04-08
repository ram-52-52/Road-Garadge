import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../constants/navigationConstant';
import { 
  MapPin, 
  ArrowLeft,
  Calendar,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getJobs } from '../../services/jobService';

const UserHistory = () => {
    const navigate = useNavigate();
    const [historyItems, setHistoryItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getJobs();
                if (response.success) {
                    setHistoryItems(response.data);
                }
            } catch (error) {
                console.error('History Fetch Error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-full bg-slate-950 p-4 xs:p-8 space-y-8 xs:space-y-12 animate-in fade-in duration-1000">
            {/* Header HUD */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8 bg-slate-900/50 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
                <div className="relative z-10 space-y-1 text-center sm:text-left">
                    <h2 className="text-lg xs:text-4xl font-black text-white tracking-tighter italic uppercase">Logistics Archive</h2>
                    <p className="text-slate-500 font-medium italic text-[10px] xs:text-sm">Audit trail of rescue protocols.</p>
                </div>
                <button 
                    onClick={() => navigate(USER_ROUTES.HOME)} 
                    className="relative z-10 self-center sm:self-auto w-12 h-12 xs:w-16 xs:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition group active:scale-90"
                >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>

            {/* History Feed */}
            <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
                {isLoading ? (
                    <div className="space-y-6 w-full animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 bg-slate-900/50 rounded-[3rem] border border-white/5" />
                        ))}
                    </div>
                ) : historyItems.length > 0 ? (
                    historyItems.map((item) => (
                        <div key={item._id} className="w-full bg-slate-900/40 border border-white/5 p-6 xs:p-10 rounded-[2.5rem] xs:rounded-[3.5rem] backdrop-blur-3xl hover:bg-white/5 hover:border-white/10 transition-all duration-500 group relative overflow-hidden active:scale-[0.99]">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
                             
                                <div className="flex flex-col xs:flex-row items-center justify-between gap-6 mb-8 text-center xs:text-left">
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl sm:rounded-3xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-xl">
                                        <Activity size={24} strokeWidth={2.5} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-lg sm:text-2xl font-black text-white italic tracking-tighter uppercase leading-tight truncate">
                                            {item.service_type || (Array.isArray(item.services) ? item.services.join(' + ') : 'Service Request')}
                                        </h4>
                                        <span className="text-[8px] xs:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{item._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className={`px-4 xs:px-6 py-1.5 xs:py-2 rounded-full text-[8px] xs:text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                                    item.status === 'COMPLETED'  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5' : 
                                    item.status === 'CANCELLED'  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5' :
                                    item.status === 'REJECTED'   ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-orange-500/5' :
                                    item.status === 'ACCEPTED'   ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5' :
                                    item.status === 'EN_ROUTE'   ? 'bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-violet-500/5' :
                                    'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5' // PENDING
                                }`}>
                                    {item.status === 'PENDING'   ? '⏳ Searching Mechanic' :
                                     item.status === 'ACCEPTED'  ? '✅ Mechanic Assigned' :
                                     item.status === 'EN_ROUTE'  ? '🚗 On the Way' :
                                     item.status === 'COMPLETED' ? '✔ Completed' :
                                     item.status === 'REJECTED'  ? '✖ Rejected' :
                                     item.status === 'CANCELLED' ? '✖ Cancelled' :
                                     item.status}
                                </div>
                            </div>
    
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 mb-8 pb-8 border-b border-white/5">
                                <div className="flex items-center gap-4 justify-center sm:justify-start">
                                    <Calendar size={16} className="text-slate-500" />
                                    <span className="text-xs sm:text-sm font-bold text-white/60 italic">
                                        {new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 justify-center sm:justify-start">
                                    <MapPin size={16} className="text-slate-500" />
                                    <span className="text-xs sm:text-sm font-bold text-white/60 italic truncate max-w-[200px]">
                                        {item.location.address}
                                    </span>
                                </div>
                            </div>
    
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black text-xs italic">
                                        {item.garage_id?.name?.charAt(0) || 'G'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Assigned Unit</span>
                                        <span className="text-xs sm:text-sm font-black text-white italic tracking-tight">{item.garage_id?.name || 'Searching...'}</span>
                                    </div>
                                </div>
                                <p className="text-lg sm:text-4xl font-black text-white italic tracking-tighter leading-none">{formatPrice(item.amount || 0)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full py-24 text-center space-y-6 bg-slate-900/40 rounded-[4rem] border border-white/5 animate-in fade-in duration-700">
                        <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto border border-white/10">
                            <Activity size={36} className="text-slate-600" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">No Requests Found</h4>
                            <p className="text-slate-500 text-xs font-medium italic uppercase tracking-widest leading-relaxed max-w-xs mx-auto">You haven't made any service requests yet. Go back home to request roadside assistance.</p>
                        </div>
                        <button
                            onClick={() => navigate(USER_ROUTES.HOME)}
                            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition hover:bg-blue-500"
                        >
                            Request Assistance →
                        </button>
                    </div>
                )}

                {/* Verification HUD Footer */}
                <div className="w-full p-8 xs:p-10 bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] xs:rounded-[3.5rem] text-center space-y-3 xs:space-y-4">
                     <ShieldCheck size={40} className="text-blue-500 mx-auto" />
                     <h4 className="text-lg xs:text-xl font-black text-white italic uppercase tracking-tighter">Cipher Verification Locked</h4>
                     <p className="text-slate-500 text-xs xs:text-sm font-medium italic leading-relaxed uppercase">All past interactions are encrypted and archived for strategic auditing purposes.</p>
                </div>
            </div>
        </div>
    );
};

export default UserHistory;
