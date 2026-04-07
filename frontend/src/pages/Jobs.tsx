import { useState, useEffect } from 'react';
import { socket } from '../services/socket';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { 
  Radar, 
  MapPin, 
  Loader2, 
  ArrowUpRight,
  Zap,
  Activity
} from 'lucide-react';

const JobStatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    PENDING: 'bg-amber-500/10 text-amber-600 border-amber-500/10',
    ACCEPTED: 'bg-blue-600/10 text-blue-600 border-blue-600/10',
    COMPLETED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10',
    CANCELLED: 'bg-rose-500/10 text-rose-600 border-rose-100/10',
    EN_ROUTE: 'bg-indigo-600/10 text-indigo-600 border-indigo-600/10',
  };

  return (
    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all duration-300 ${styles[status] || 'bg-slate-500/10 text-slate-600'}`}>
      {status}
    </span>
  );
};

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('register', { userId: user?._id });
    });
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('job:new', (data) => setJobs((prev) => [data.job || data, ...prev]));
    socket.on('job:accepted', (data) => setJobs((prev) => prev.map((j) => (j._id === (data.job?._id || data._id) ? (data.job || data) : j))));
    socket.on('job:completed', (data) => setJobs((prev) => prev.map((j) => (j._id === (data.job?._id || data._id) ? (data.job || data) : j))));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('job:new');
      socket.off('job:accepted');
      socket.off('job:completed');
      socket.disconnect();
    };
  }, [user?._id]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        setJobs(response.data.data || []);
      } catch (error) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Real-time Status Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 xs:gap-8 bg-slate-900 p-8 xs:p-10 rounded-[2.5rem] xs:rounded-[3rem] shadow-2xl shadow-blue-900/20 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-3 mb-3 lg:mb-4">
             <div className="w-10 h-10 xs:w-12 xs:h-12 bg-blue-600 rounded-xl xs:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                <Radar size={20} className="text-white animate-pulse" />
             </div>
             <h1 className="text-3xl xs:text-4xl font-black text-white tracking-tighter italic uppercase">Live Dispatch Radar</h1>
          </div>
          <p className="text-slate-400 font-medium italic text-xs xs:text-sm">Protocol: WebSocket Active // Monitoring Marketplace Pulse.</p>
        </div>

        <div className={`relative z-10 flex items-center justify-center gap-4 px-6 py-3 rounded-2xl xs:rounded-[1.5rem] border ${
          isConnected ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        } backdrop-blur-xl transition-all duration-500`}>
          <div className={`w-2.5 h-2.5 xs:w-3 xs:h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping shadow-lg shadow-emerald-500' : 'bg-rose-500 shadow-lg shadow-rose-500'}`} />
          <span className="font-black text-[9px] xs:text-[10px] uppercase tracking-[0.2em] xs:tracking-[0.3em]">
            {isConnected ? 'Signal Locked' : 'Link Offline'}
          </span>
        </div>
      </div>

      {/* Operations Table HUD */}
      <div className="bg-white rounded-[2.5rem] xs:rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-20 xs:p-32 text-center flex flex-col items-center">
            <Loader2 size={40} className="text-blue-600 animate-spin mb-4" strokeWidth={2.5} />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] xs:text-[10px]">Initializing High-Frequency Sync...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-20 xs:p-32 text-center">
             <div className="w-20 h-20 xs:w-24 xs:h-24 bg-slate-50 border border-slate-100 rounded-2xl xs:rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Activity size={32} className="text-slate-200" />
             </div>
             <h3 className="text-xl xs:text-2xl font-black text-slate-800 tracking-tight italic">Radar Silence</h3>
             <p className="text-slate-400 mt-2 font-medium text-xs xs:text-sm">Monitoring the grid. New requests will appear instantaneously.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px] lg:min-w-0">
              <thead className="hidden lg:table-header-group">
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Request Trace</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Timestamp</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Service Logistics</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Global Coordinates</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Execution Status</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right italic">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 flex flex-col lg:table-row-group">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-500/5 transition duration-500 group flex flex-col lg:table-row p-6 xs:p-8 lg:p-0 border-b lg:border-none">
                    <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1">Trace ID</span>
                      <span className="font-mono text-[9px] xs:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        #{job._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1">Dispatch Time</span>
                       <p className="text-sm font-black text-slate-950 group-hover:text-blue-600 transition-colors italic">
                        {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                    </td>
                    <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2">Service Logic</span>
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-800 text-sm tracking-tight italic uppercase">{job.service_type}</span>
                        <div className="flex items-center gap-2">
                           <Zap size={10} className="text-amber-500" />
                           <span className="text-[9px] xs:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{job.description || 'Routine Assistance'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2">Market Coordinates</span>
                      <div className="flex items-center text-slate-500 font-bold text-xs xs:text-sm tracking-tight">
                        <MapPin size={14} className="mr-3 text-blue-500/60 group-hover:animate-bounce" />
                        <span className="truncate max-w-[150px] italic">Regional Dispatch Sector</span>
                      </div>
                    </td>
                    <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2">State Protocol</span>
                      <JobStatusBadge status={job.status} />
                    </td>
                    <td className="lg:px-10 lg:py-8 text-right flex items-center justify-between lg:justify-end gap-3 mt-4 lg:mt-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden">Mission Audit</span>
                      <button className="p-3 xs:p-4 bg-slate-100 text-slate-400 hover:bg-slate-950 hover:text-white rounded-xl xs:rounded-[1.2rem] transition-all duration-300 shadow-sm active:scale-95 group-hover:translate-x-1 group-hover:bg-blue-600 group-hover:text-white">
                        <ArrowUpRight size={18} strokeWidth={3} />
                      </button>
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

export default Jobs;
