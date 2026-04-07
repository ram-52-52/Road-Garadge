import { 
  MoreVertical, 
  Filter,
  ChevronRight,
  Search,
  MapPin
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosInstance from '../../helper/apiFunction';
import { END_POINTS } from '../../constants/apiConstants';
import { Loader2 } from 'lucide-react';

const AdminGarages = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [garages, setGarages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGarages = async () => {
            try {
                const response = await axiosInstance.get(END_POINTS.ADMIN.GARAGES);
                setGarages(response.data.data);
            } catch (err) {
                console.error('Handshake Failure:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchGarages();
    }, []);

    const handleVerify = async (id: string) => {
        try {
            await axiosInstance.patch(`${END_POINTS.ADMIN.GARAGES}/${id}/verify`);
            setGarages(prev => prev.map(g => g._id === id ? { ...g, is_verified: true } : g));
        } catch (err) {
            console.error('Logic Override Failed:', err);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            
            {/* Table Header / Filters HUD */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 xs:gap-8 bg-white p-6 xs:p-8 rounded-[2rem] xs:rounded-[3rem] border border-slate-100 shadow-sm text-center lg:text-left">
                <div className="space-y-1 xs:space-y-2">
                    <h2 className="text-3xl xs:text-4xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">Partner Registry</h2>
                    <p className="text-slate-500 font-medium italic text-[10px] xs:text-sm uppercase tracking-tight">Auditing the elite network pool of verified mechanics.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Locate Anchor ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 xs:h-16 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-[1.25rem] xs:rounded-[2rem] text-xs xs:text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
                        />
                    </div>
                    <div className="flex items-center gap-3 xs:gap-4 w-full sm:w-auto justify-center">
                        <button className="w-14 h-14 xs:w-16 xs:h-16 bg-white border border-slate-100 rounded-xl xs:rounded-2xl flex items-center justify-center text-slate-900 hover:bg-slate-50 transition shadow-sm">
                            <Filter size={20} />
                        </button>
                        <button className="flex-1 sm:flex-none h-14 xs:h-16 px-6 xs:px-10 bg-blue-600 text-white rounded-xl xs:rounded-[2rem] font-black uppercase tracking-widest text-[8px] xs:text-[10px] hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-95">
                            Add Partner
                        </button>
                    </div>
                </div>
            </div>

            {/* Elite Partner Data HUD */}
            <div className="bg-white rounded-[2.5rem] xs:rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                {loading ? (
                    <div className="p-20 xs:p-32 text-center flex flex-col items-center">
                        <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Partner Identities...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
                            <thead className="hidden lg:table-header-group">
                                <tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Anchor ID</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Identity Hub</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Strategic Sector</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status Logic</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right">Audit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 flex flex-col lg:table-row-group">
                                {garages.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map((garage) => (
                                    <tr key={garage._id} className="hover:bg-slate-50/50 transition duration-300 group flex flex-col lg:table-row p-6 xs:p-8 lg:p-0 border-b lg:border-none">
                                        <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1">Anchor ID</span>
                                            <span className="text-[10px] xs:text-xs font-black text-slate-950 tracking-widest italic leading-none">#{garage._id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2">Identity Identity</span>
                                            <div className="flex items-center gap-3 xs:gap-4">
                                                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-slate-100 rounded-xl xs:rounded-2xl flex items-center justify-center text-slate-950 font-black italic shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0">
                                                    {garage.name.charAt(0)}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs xs:text-base font-black text-slate-950 tracking-tighter italic uppercase leading-tight">{garage.name}</p>
                                                    <p className="text-[8px] xs:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px] xs:max-w-none">Owner: {garage.owner_id?.name || 'Redacted'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2 text-left">Strategic Sector</span>
                                            <div className="flex items-center gap-2 xs:gap-2.5">
                                                <MapPin size={14} className="text-blue-500 shrink-0" />
                                                <span className="text-[10px] xs:text-xs font-bold text-slate-600 italic truncate max-w-[200px] xs:max-w-none">{garage.address || 'Global Sector'}</span>
                                            </div>
                                        </td>
                                        <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2 text-left">Status Logic</span>
                                            <div className={`inline-flex items-center gap-2 px-3 xs:px-4 py-1.5 rounded-full text-[8px] xs:text-[10px] font-black uppercase tracking-widest border ${garage.is_verified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${garage.is_verified ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                                                {garage.is_verified ? 'VERIFIED' : 'PENDING'}
                                            </div>
                                        </td>
                                        <td className="lg:px-10 lg:py-8 text-left lg:text-right flex items-center justify-between lg:justify-end gap-3 mt-4 lg:mt-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden">Operational Overrides</span>
                                            <div className="flex items-center gap-2 xs:gap-3">
                                                {!garage.is_verified && (
                                                    <button onClick={() => handleVerify(garage._id)} className="px-4 xs:px-6 py-3 bg-emerald-600 text-white rounded-lg xs:rounded-xl font-black text-[8px] xs:text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/10 active:scale-95">
                                                        Verify
                                                    </button>
                                                )}
                                                <button className="w-10 h-10 xs:w-12 xs:h-12 bg-slate-50 text-slate-400 rounded-lg xs:rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-950 transition">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer / Pagination HUD */}
                <div className="px-6 xs:px-10 py-6 xs:py-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6 text-center sm:text-left">
                    <p className="text-[8px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Showing elite partners active on global network nodes.</p>
                    <div className="flex gap-3 xs:gap-4">
                        <button className="w-12 h-12 xs:w-14 xs:h-14 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-950 transition shadow-sm cursor-not-allowed opacity-50">
                            <ChevronRight size={18} className="rotate-180" />
                        </button>
                        <button className="w-12 h-12 xs:w-14 xs:h-14 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-950 hover:bg-blue-600 hover:text-white transition shadow-sm active:scale-95">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGarages;
