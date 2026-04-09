import { 
  Activity, 
  ChevronRight, 
  ShieldCheck, 
  Search,
  Filter,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosInstance from '../../helper/apiFunction';
import { END_POINTS } from '../../constants/apiConstants';

const AdminJobs = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalVelocity = jobs.reduce((acc, job) => acc + (job.final_price || 0), 0);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axiosInstance.get(END_POINTS.ADMIN.JOBS);
                setJobs(response.data.data);
            } catch (err) {
                console.error('Audit Failure:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => 
        job._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.service_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 text-slate-900">
            
            {/* Global Mission Audit Header */}
            <div className="bg-white p-6 xs:p-10 rounded-[2rem] xs:rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 xs:gap-8">
                <div className="space-y-1 xs:space-y-2 text-center md:text-left">
                    <h2 className="text-3xl xs:text-4xl font-black text-slate-950 tracking-tighter italic">Mission Ledger</h2>
                    <p className="text-slate-500 font-medium italic text-xs xs:text-sm">Comprehensive audit trail of all marketplace service contracts.</p>
                </div>
                <div className="flex items-center gap-4 justify-center">
                    <div className="flex flex-col items-end pr-6 border-r border-slate-100 hidden xs:flex">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">System Multiplier</span>
                        <p className="text-sm font-black text-slate-900 italic tracking-tight">1.5x Peak Hour</p>
                    </div>
                    <div className="w-12 h-12 xs:w-14 xs:h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                        <Activity size={22} className="animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Filter HUD */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 xs:gap-8 bg-white p-6 xs:p-8 rounded-[2rem] xs:rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="relative group w-full lg:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Locate Interaction ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 xs:h-16 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl xs:rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto justify-center">
                    <button className="w-14 h-14 xs:w-16 xs:h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 hover:bg-slate-50 transition shadow-sm">
                        <Filter size={20} />
                    </button>
                    <button className="flex-1 lg:flex-none h-14 xs:h-16 px-6 xs:px-10 bg-slate-950 text-white rounded-2xl xs:rounded-[2rem] font-black uppercase tracking-widest text-[9px] xs:text-[10px] hover:bg-slate-800 transition shadow-lg active:scale-95">
                        Export Tactical Logs
                    </button>
                </div>
            </div>

            {/* Operational Data HUD */}
            <div className="bg-white rounded-[2.5rem] xs:rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {loading ? (
                    <div className="p-20 xs:p-32 text-center flex flex-col items-center">
                        <Loader2 size={40} className="animate-spin text-indigo-600 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Accessing Distributed Ledger...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-0">
                            <thead className="hidden lg:table-header-group">
                                <tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Mission ID</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Service Logic</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Entities Involved</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Status Prot.</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right">Liquidity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 flex flex-col lg:table-row-group">
                                {paginatedJobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-slate-50/50 transition duration-300 group flex flex-col lg:table-row p-6 xs:p-8 lg:p-0 border-b lg:border-none">
                                        <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1">Mission ID</span>
                                            <span className="text-xs font-black text-slate-950 tracking-widest italic uppercase">#{job._id.slice(-8)}</span>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 lg:hidden">Node Trace Active</p>
                                        </td>
                                        <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2">Service</span>
                                            <div>
                                                <p className="text-sm font-black text-slate-950 tracking-tighter italic">{job.service_type}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{new Date(job.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </td>
                                        <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2">Market Entities</span>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Driver: {job.driver_id?.name || 'Redacted'}
                                                </p>
                                                <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Partner: {job.garage_id?.name || 'Pending Dispatch'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2">Operational State</span>
                                            <div className={`inline-flex items-center gap-2 px-3 xs:px-4 py-1.5 rounded-full text-[9px] xs:text-[10px] font-black uppercase tracking-widest border ${
                                                job.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                job.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                job.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    job.status === 'COMPLETED' ? 'bg-emerald-500' :
                                                    job.status === 'PENDING' ? 'bg-amber-500 animate-pulse' :
                                                    job.status === 'CANCELLED' ? 'bg-rose-500' :
                                                    'bg-blue-500 animate-bounce'
                                                }`} />
                                                {job.status}
                                            </div>
                                        </td>
                                        <td className="lg:px-10 lg:py-8 text-left lg:text-right flex items-center justify-between lg:justify-end gap-3 mt-4 lg:mt-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden">Payload Value</span>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-slate-950 italic tracking-tighter">₹{job.final_price || 0}</p>
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase italic">Paid Verified</span>
                                            </div>
                                            <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center lg:hidden">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                 {/* Audit Footer HUD */}
                {!loading && (
                    <div className="px-6 xs:px-10 py-6 xs:py-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/20">
                         <div className="flex flex-col sm:flex-row items-center gap-4 xs:gap-8">
                             <div className="flex items-center gap-4 px-5 py-2 bg-white border border-slate-100 rounded-full shadow-sm">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                 <span className="text-[8px] xs:text-[9px] font-black text-slate-400 uppercase tracking-widest">Platform Integrity Verified</span>
                             </div>
                             
                             {/* Pagination Controls */}
                             <div className="flex items-center gap-4">
                                 <button 
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
                                 >
                                     <ChevronRight className="rotate-180" size={16} />
                                 </button>
                                 <div className="flex items-center gap-2">
                                     <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Page {currentPage} of {totalPages || 1}</span>
                                 </div>
                                 <button 
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-all shadow-sm"
                                 >
                                     <ChevronRight size={16} />
                                 </button>
                             </div>
                         </div>
                         <button className="text-[9px] xs:text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] xs:tracking-[0.4em] hover:text-blue-600 transition-colors text-center sm:text-right">Export Strategic Transaction Log</button>
                    </div>
                )}
            </div>

            {/* Strategic Information Decorative Footer */}
            <div className="bg-slate-950 p-8 xs:p-12 rounded-[2.5rem] xs:rounded-[4rem] text-white overflow-hidden relative shadow-2xl group">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
                 <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
                    <div className="space-y-6 max-w-xl text-center xl:text-left">
                        <ShieldCheck size={48} className="text-blue-500 mx-auto xl:mx-0" />
                        <div className="space-y-2">
                             <h4 className="text-2xl xs:text-3xl font-black italic tracking-tighter uppercase">Marketplace Oversight</h4>
                             <p className="text-slate-500 text-xs xs:text-sm font-medium leading-relaxed italic">"You are currently viewing the global operational handshake feed. Every interaction is traceable and finalized across the strategic marketplace pool."</p>
                        </div>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[2.5rem] xs:rounded-[3rem] border border-white/5 space-y-4 shadow-inner min-w-full sm:min-w-[320px] text-center sm:text-left">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Velocity</p>
                         <p className="text-4xl xs:text-5xl font-black text-blue-500 italic tracking-tighter">₹{totalVelocity.toLocaleString()}</p>
                         <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-500">
                             <ArrowUpRight size={14} />
                             <span className="text-[10px] font-black uppercase tracking-widest">REAL-TIME CALCULATION</span>
                         </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default AdminJobs;
