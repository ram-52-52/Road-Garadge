import { 
  Radar, 
  MapPin, 
  Activity, 
  Zap, 
  Map as MapIcon,
  Filter,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';

const AdminRadar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const activeJobs = [
        { id: 'JOB-9421', type: 'Flat Tire', driver: 'Rahul Mehta', mechanic: 'Amit Sharma', location: 'Satellite', status: 'EN_ROUTE', eta: '4m' },
        { id: 'JOB-9425', type: 'Battery Jump', driver: 'Sneha Rao', mechanic: 'Precision Motors', location: 'Navrangpura', status: 'ACCEPTED', eta: '12m' },
        { id: 'JOB-9430', type: 'Engine Failure', driver: 'Vikram Seth', mechanic: 'Spark Garage', location: 'Vastrapur', status: 'COMPLETED', eta: 'N/A' },
        { id: 'JOB-9432', type: 'Towing Requirement', driver: 'Priya Shah', mechanic: 'Searching...', location: 'Bopal', status: 'PENDING', eta: 'PENDING' },
    ];

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'EN_ROUTE': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'ACCEPTED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-400 border-slate-100';
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            
            {/* Command Header / Geo-Filters HUD */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic italic">
                        <Radar size={14} className="animate-pulse text-blue-400" />
                        Live City Radar Active
                    </div>
                    <h2 className="text-4xl font-black text-slate-950 tracking-tighter italic italic italic italic">Operational Handshakes</h2>
                    <p className="text-slate-500 font-medium italic italic italic italic">Real-time logistics monitoring across the strategic sector pool.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Locate Dispatch ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-80 h-16 pl-14 pr-6 bg-white border border-slate-100 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                    <button className="h-16 px-10 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition shadow-lg active:scale-95 flex items-center gap-3">
                        <MapIcon size={18} className="text-blue-500" />
                        Switch to Visual Grid
                    </button>
                    <button className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-950 hover:bg-slate-50 transition shadow-sm">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Live Logistics Radar Table */}
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50 bg-slate-50/50">
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Dispatch ID</th>
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Aid Type</th>
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Driver Anchor</th>
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Mechanic Node</th>
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Status Logic</th>
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Sector Hub</th>
                            <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Logistics ETA</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {activeJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-50/50 transition duration-300 group">
                                <td className="px-10 py-8">
                                    <span className="text-xs font-black text-slate-950 tracking-widest italic">{job.id}</span>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                            <Zap size={18} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-sm font-black text-slate-950 tracking-tighter italic italic">{job.type}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <p className="text-sm font-black text-slate-950 italic italic italic">{job.driver}</p>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-3">
                                        <Activity size={14} className={job.mechanic === 'Searching...' ? 'text-rose-500 animate-pulse' : 'text-emerald-500'} />
                                        <p className="text-sm font-black text-slate-950 italic italic italic">{job.mechanic}</p>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(job.status)}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${job.status === 'EN_ROUTE' ? 'bg-blue-500 animate-pulse' : 'bg-current opacity-30'}`} />
                                        {job.status}
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-2.5">
                                        <MapPin size={14} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500 italic italic">{job.location}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    {job.status === 'COMPLETED' ? (
                                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                            <ArrowUpRight size={16} />
                                        </div>
                                    ) : (
                                        <span className={`text-sm font-black tracking-tighter italic italic italic ${job.eta === 'PENDING' ? 'text-rose-500 animate-pulse' : 'text-slate-950'}`}>
                                            {job.eta}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Radar Decorative Footer HUD */}
            <div className="bg-slate-950 p-12 rounded-[4rem] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div className="space-y-6 max-w-xl">
                        <Radar size={48} className="text-blue-500 animate-[spin_10s_linear_infinite] opacity-50" />
                        <div className="space-y-2">
                             <h4 className="text-3xl font-black italic tracking-tighter italic italic">Platform Operational Equilibrium</h4>
                             <p className="text-slate-500 text-sm font-medium leading-relaxed italic italic italic pr-12">"Real-time dispatch logic is currently optimal. All regional sector handshakes are verified and active."</p>
                        </div>
                    </div>
                    <div className="flex gap-12">
                        {[
                            { label: 'Dispatch Saturation', value: '72%', color: 'text-emerald-500' },
                            { label: 'Mean Logistics ETA', value: '14.2m', color: 'text-blue-400' },
                            { label: 'Resource Availability', value: 'High', color: 'text-white' },
                        ].map((stat) => (
                            <div key={stat.label} className="space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                <p className={`text-3xl font-black italic tracking-tighter italic italic italic italic ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRadar;
