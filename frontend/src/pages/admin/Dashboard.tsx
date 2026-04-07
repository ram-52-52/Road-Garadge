import { 
    ShieldCheck, 
    Zap, 
    Activity, 
    TrendingUp, 
    Users, 
    MapPin,
    IndianRupee,
    ArrowUpRight,
    Search,
    ChevronRight
} from 'lucide-react';

import { useState, useEffect } from 'react';
import axiosInstance from '../../helper/apiFunction';
import { END_POINTS } from '../../constants/apiConstants';

/**
 * ADMIN DASHBOARD: High-Fidelity Command Center
 * Scalable ecosystem monitoring and marketplace moderation.
 */
const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axiosInstance.get(END_POINTS.ADMIN.ANALYTICS);
                setAnalytics(response.data.data);
            } catch (err) {
                console.error('Infiltration Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const stats = [
        { label: 'Active SOS missions', value: analytics?.active_jobs || '0', trend: '+4', icon: Activity, color: 'bg-rose-500 shadow-rose-500/20' },
        { label: 'Partner Garages', value: analytics?.total_garages || '0', trend: `+${analytics?.verified_garages || 0}`, icon: ShieldCheck, color: 'bg-blue-600 shadow-blue-600/20' },
        { label: 'Total Marketplace Revenue', value: `₹${(analytics?.gmv || 0).toLocaleString()}`, trend: `+${analytics?.revenue_growth || 0}%`, icon: IndianRupee, color: 'bg-emerald-500 shadow-emerald-500/20' },
        { label: 'Platform Users', value: ((analytics?.total_drivers || 0) + (analytics?.total_garages || 0)).toString(), trend: '+85', icon: Users, color: 'bg-indigo-600 shadow-indigo-600/20' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Command Header */}
            <div className="flex flex-col xs:flex-row items-center justify-between gap-6 xs:gap-0 mt-4 xs:mt-0">
                <div className="text-center xs:text-left">
                    <h2 className="text-2xl xs:text-4xl font-black text-slate-950 tracking-tighter italic underline decoration-blue-600/20 decoration-4 xs:decoration-8 underline-offset-4 xs:underline-offset-8 uppercase leading-none">Marketplace HUD</h2>
                    <p className="text-slate-500 text-[8px] xs:text-[10px] font-black uppercase tracking-[0.2em] xs:tracking-[0.4em] mt-3 xs:mt-4">Real-time Global Operations Hub</p>
                </div>
                <div className="flex items-center gap-4">
                     <div className="hidden sm:flex flex-col items-end pr-6 border-r border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Version</span>
                        <p className="text-sm font-black text-slate-900 italic tracking-tight">1.0.0 Enterprise</p>
                     </div>
                     <div className="w-12 h-12 xs:w-14 xs:h-14 bg-slate-950 rounded-2xl xs:rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/10">
                        <Zap size={22} fill="currentColor" className="text-blue-500" />
                     </div>
                </div>
            </div>

            {/* Tactical Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xs:gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="p-6 xs:p-8 bg-white border border-slate-100 rounded-[2rem] xs:rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 relative group overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000`} />
                        
                        <div className="flex items-center justify-between mb-6 xs:mb-8">
                            <div className={`w-10 h-10 xs:w-12 xs:h-12 rounded-xl xs:rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-700`}>
                                <stat.icon size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex items-center gap-1.5 px-2 xs:px-3 py-1 xs:py-1.5 bg-emerald-50 text-emerald-600 rounded-full">
                                <TrendingUp size={10} />
                                <span className="text-[9px] xs:text-[10px] font-black tracking-tight">{stat.trend}</span>
                            </div>
                        </div>
                        
                        <span className="text-[9px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 xs:mb-2">{stat.label}</span>
                        <h3 className="text-3xl xs:text-4xl font-black text-slate-950 italic tracking-tighter">{loading ? '---' : stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Strategic Activity Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-10">
                
                {/* Live Verification Table Overlay */}
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2rem] xs:rounded-[3rem] shadow-sm relative overflow-hidden flex flex-col">
                    <div className="p-6 xs:p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                        <div className="flex items-center gap-3 xs:gap-4">
                             <ShieldCheck className="text-blue-500" size={20} />
                             <h4 className="text-lg xs:text-xl font-black text-slate-950 italic tracking-tight uppercase">Partner Pipeline</h4>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                             <Search size={18} />
                        </div>
                    </div>
                    
                    <div className="overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="hidden lg:table-header-group bg-slate-50/50">
                                <tr>
                                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Partner Identity</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Sector</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right">Audit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 flex flex-col lg:table-row-group">
                                {[1, 2, 3].map((item) => (
                                    <tr key={item} className="group hover:bg-slate-50/50 transition-colors duration-500 flex flex-col lg:table-row p-6 lg:p-0">
                                        <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                            <div className="flex items-center gap-3 xs:gap-4">
                                                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-slate-100 rounded-xl xs:rounded-2xl flex items-center justify-center text-slate-400 italic font-black text-xs shrink-0">GN</div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-slate-950 italic tracking-tight uppercase truncate">Rapid Rescue</p>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">ID: #GN-9021</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1">Strategic Sector</span>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
                                                <MapPin size={12} className="text-blue-500 shrink-0" />
                                                Varachha
                                            </div>
                                        </td>
                                        <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1">Status Logic</span>
                                            <div className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                                                Pending
                                            </div>
                                        </td>
                                        <td className="lg:px-10 lg:py-8 text-left lg:text-right mt-4 lg:mt-0">
                                            <button className="w-full lg:w-10 lg:h-10 py-3 lg:py-0 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 lg:gap-0">
                                                <span className="lg:hidden text-[10px] font-black uppercase tracking-widest">Audit Logs</span>
                                                <ChevronRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Analytics Snapshot */}
                 <div className="bg-slate-950 rounded-[2rem] xs:rounded-[3rem] p-6 xs:p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-10 rounded-full blur-[100px]" />
                     
                     <div className="relative z-10 space-y-8 xs:space-y-12">
                         <div className="space-y-3 xs:space-y-4">
                             <h4 className="text-base xs:text-xl font-black italic tracking-tight underline decoration-blue-600 decoration-4 underline-offset-4 uppercase">Dispatch Flow</h4>
                             <p className="text-slate-400 text-[9px] xs:text-xs font-medium leading-relaxed italic pr-4">Platform response times are currently in the 99th percentile across all urban sectors.</p>
                         </div>

                         <div className="space-y-7 xs:space-y-10">
                            {[
                                { label: 'Surat', value: analytics?.month_revenue > 0 ? 85 : 0, color: 'bg-blue-600' },
                                { label: 'Ahmedabad', value: analytics?.month_revenue > 0 ? 65 : 0, color: 'bg-indigo-600' },
                                { label: 'Vadodara', value: analytics?.month_revenue > 0 ? 45 : 0, color: 'bg-emerald-600' },
                            ].map((city) => (
                                <div key={city.label} className="space-y-3">
                                    <div className="flex items-center justify-between text-[8px] xs:text-[10px] font-black uppercase tracking-[0.2em]">
                                        <span className="text-white opacity-60 italic">{city.label} Sector Dispatch</span>
                                        <ArrowUpRight size={12} className="text-blue-500" />
                                    </div>
                                    <div className="h-1.5 xs:h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                        <div className={`h-full ${city.color} rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]`} style={{ width: `${city.value}%` }} />
                                    </div>
                                </div>
                            ))}
                         </div>

                         <button className="w-full h-14 xs:h-16 bg-white rounded-2xl xs:rounded-3xl text-slate-950 font-black uppercase tracking-widest text-[10px] xs:text-xs hover:bg-slate-100 transition-all active:scale-95 shadow-xl mt-4">Audit Platform Logs</button>
                     </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
