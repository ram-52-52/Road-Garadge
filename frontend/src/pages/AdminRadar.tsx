import { useState, useEffect } from 'react';
import { 
  Zap,
  Globe,
  Activity,
  ExternalLink
} from 'lucide-react';

const AdminRadar = () => {
    const [pings, setPings] = useState<any[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newPing = {
                id: Math.random().toString(36).substr(2, 9),
                type: Math.random() > 0.5 ? 'COMPLETED' : Math.random() > 0.3 ? 'ACCEPTED' : 'PENDING',
                service: Math.random() > 0.5 ? 'Flat Tire' : 'Engine Issue',
                driver: 'DRIVER_' + Math.floor(Math.random() * 9000 + 1000),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            };
            setPings(prev => [newPing, ...prev.slice(0, 9)]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: any = {
            PENDING: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
            ACCEPTED: 'bg-blue-600/10 text-blue-600 border-blue-600/20',
            COMPLETED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        };
        return (
            <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="h-full flex flex-col space-y-10 animate-in fade-in duration-1000">
            {/* Header with Live Socket Indicator */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 xs:gap-8 bg-slate-900 p-8 xs:p-10 rounded-[2.5rem] xs:rounded-[3.5rem] shadow-2xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] transition-transform duration-1000 group-hover:scale-125" />
                
                <div className="relative z-10 space-y-3">
                    <div className="flex flex-col xs:flex-row items-center gap-3 xs:gap-4 mb-2 text-center xs:text-left">
                        <div className="w-10 h-10 xs:w-12 xs:h-12 bg-blue-600 rounded-xl xs:rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Globe size={20} className="text-white animate-pulse" />
                        </div>
                        <h1 className="text-2xl xs:text-4xl font-black text-white tracking-tighter italic uppercase leading-none">Operational Radar</h1>
                    </div>
                    <div className="flex items-center gap-2 xs:gap-3 px-3 xs:px-4 py-1.5 xs:py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 w-fit mx-auto xs:mx-0">
                         <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-emerald-500 animate-ping shadow-lg shadow-emerald-500" />
                         <span className="text-[8px] xs:text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] xs:tracking-[0.3em]">Signal Locked</span>
                    </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 lg:flex gap-3 xs:gap-4">
                    <div className="p-4 xs:p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl xs:rounded-[2rem] flex-1">
                        <p className="text-[7px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Uptime</p>
                        <p className="text-sm xs:text-xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">99.2% Hub</p>
                    </div>
                    <div className="p-4 xs:p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl xs:rounded-[2rem] flex-1">
                        <p className="text-[7px] xs:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active</p>
                        <p className="text-sm xs:text-xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">1,042 Nodes</p>
                    </div>
                </div>
            </div>

            {/* Premium Operational Table */}
            <div className="bg-white rounded-[2.5rem] xs:rounded-[3.5rem] shadow-2xl shadow-indigo-900/5 border border-slate-100 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px] lg:min-w-0">
                        <thead className="hidden lg:table-header-group">
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Trace Artifact</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Service Logistics</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Status Protocol</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Market Identity</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Sync Time</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right italic">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 flex flex-col lg:table-row-group">
                            {pings.map((ping) => (
                                <tr key={ping.id} className="hover:bg-slate-500/5 transition duration-500 group flex flex-col lg:table-row p-6 xs:p-10 border-b lg:border-none">
                                    <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${ping.type === 'PENDING' ? 'bg-amber-500 animate-pulse' : 'bg-slate-200'}`} />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1 italic">Trace Artifact</span>
                                                <span className="font-mono text-xs font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors italic">
                                                     #{ping.id.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2 italic">Service Logistics</span>
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 xs:w-12 xs:h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition duration-500">
                                                <Zap size={18} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-sm font-black text-slate-800 italic uppercase tracking-tight">{ping.service}</span>
                                        </div>
                                    </td>
                                    <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2 italic">Status Protocol</span>
                                        <StatusBadge status={ping.type} />
                                    </td>
                                    <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2 italic">Market Identity</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 xs:w-9 xs:h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-white text-[10px] font-black italic shadow-lg">UI</div>
                                            <span className="text-xs font-black text-slate-500 italic uppercase tracking-widest italic">{ping.driver}</span>
                                        </div>
                                    </td>
                                    <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0 font-mono text-[9px] xs:text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1 italic">Sync Horizon</span>
                                        {ping.timestamp}
                                    </td>
                                    <td className="lg:px-10 lg:py-8 text-left lg:text-right flex items-center justify-between lg:justify-end gap-3 mt-4 lg:mt-0">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden italic">Action Ledger</span>
                                        <button className="p-3 xs:p-4 bg-slate-100 rounded-xl xs:rounded-[1.2rem] text-slate-400 hover:bg-slate-950 hover:text-white transition-all shadow-sm active:scale-95 group-hover:bg-blue-600 group-hover:text-white">
                                            <ExternalLink size={18} strokeWidth={2.5} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Radar Footer Activity */}
            <div className="flex flex-col sm:flex-row items-center gap-4 xs:gap-6 px-10 py-8 bg-slate-900 rounded-[2.5rem] border border-white/5 relative overflow-hidden text-center sm:text-left">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
                 <Activity size={24} className="text-blue-500 relative z-10 shrink-0" strokeWidth={3} />
                 <div className="relative z-10">
                    <p className="text-[7px] xs:text-[8px] font-black uppercase tracking-[0.4em] text-white/40 mb-1">Grid Intelligence Overlay</p>
                    <p className="text-[10px] xs:text-xs font-black text-white italic tracking-tighter uppercase leading-relaxed">Currently monitoring all active execution nodes throughout the regional network topology.</p>
                 </div>
            </div>
        </div>
    );
};

export default AdminRadar;
