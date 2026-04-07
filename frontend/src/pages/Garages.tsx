import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ChevronRight,
  MoreVertical,
  Search,
  Filter,
  Loader2,
  Zap,
  Globe,
  CheckCircle2
} from 'lucide-react';

const StatusBadge = ({ available }: { available: boolean }) => (
  <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
    available 
      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
      : 'bg-slate-500/10 text-slate-500 border border-slate-500/10'
  }`}>
    <div className={`w-2 h-2 rounded-full mr-2.5 animate-pulse ${available ? 'bg-emerald-500 shadow-lg shadow-emerald-400' : 'bg-slate-400'}`} />
    {available ? 'Operational' : 'Off-Duty'}
  </div>
);

const KYCBadge = ({ verified }: { verified: boolean }) => (
  <div className={`inline-flex items-center px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-300 ${
    verified 
      ? 'bg-blue-600/10 text-blue-600 border-blue-600/20' 
      : 'bg-amber-600/10 text-amber-600 border-amber-600/20'
  }`}>
    {verified ? <ShieldCheck size={14} className="mr-2" strokeWidth={3} /> : <Clock size={14} className="mr-2" strokeWidth={3} />}
    {verified ? 'Trusted' : 'Verification Pending'}
  </div>
);

const Garages = () => {
  const [garages, setGarages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const response = await api.get('/garages');
        setGarages(response.data.data || []);
      } catch (err: any) {
        setError('Failed to fetch records');
        setGarages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGarages();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
             <Globe size={14} className="animate-[spin_4s_linear_infinite]" />
             <span className="text-[10px] font-black uppercase tracking-widest">Global Supply Core</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Partner Network</h1>
          <p className="text-slate-500 font-medium italic italic">Managing real-time service infrastructure.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search Terminal ID/Name..." 
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 focus:ring-8 focus:ring-blue-100/30 rounded-[1.5rem] focus:outline-none focus:border-blue-400 transition-all font-bold text-sm w-full sm:w-80 shadow-sm" 
            />
          </div>
          <button className="p-4 bg-slate-900 text-white rounded-[1.5rem] hover:bg-slate-800 transition shadow-2xl shadow-slate-300">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Elite Data Container */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-900/5 border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <Loader2 size={48} className="text-blue-600 animate-spin" strokeWidth={2.5} />
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Accessing Secure Vault...</p>
          </div>
        ) : error && garages.length === 0 ? (
          <div className="p-32 text-center">
            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Zap size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Ecosystem Inactive</h3>
            <p className="text-slate-400 font-medium mt-2">Scale the network by onboarding high-performance partners.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Partner Intelligence</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Deployment Base</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status core</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trust Matrix</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {garages.map((garage: any) => (
                  <tr key={garage._id} className="hover:bg-slate-500/5 transition duration-500 group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-indigo-900/40 transition duration-500 text-white font-black italic tracking-widest text-lg">
                          {garage.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-black text-slate-900 tracking-tighter text-lg italic group-hover:translate-x-1 transition-transform duration-300">{garage.name}</p>
                          <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{garage.owner_id ? 'Pro Member' : 'Guest Entity'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center text-slate-500 font-bold text-sm tracking-tight">
                        <MapPin size={16} className="mr-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        {garage.address}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <StatusBadge available={garage.is_available} />
                    </td>
                    <td className="px-10 py-8">
                      <KYCBadge verified={garage.is_verified} />
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-30 group-hover:opacity-100 transition duration-500">
                        {garage.is_verified ? (
                          <div className="px-5 py-2.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                             <CheckCircle2 size={14} />
                             Operational
                          </div>
                        ) : (
                          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center">
                            Verify KYC
                            <ChevronRight size={14} className="ml-1.5" strokeWidth={3} />
                          </button>
                        )}
                        <button className="p-3 text-slate-300 hover:text-slate-900 transition-colors">
                          <MoreVertical size={24} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Garages;
