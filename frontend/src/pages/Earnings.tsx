import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  IndianRupee, 
  ArrowUpRight, 
  History, 
  Loader2, 
  Download,
  Calendar,
  CreditCard,
  Zap,
  TrendingDown
} from 'lucide-react';

const Earnings = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await api.get('/payments/earnings');
        setData(response.data.data);
      } catch (error) {
        setData({ totalEarnings: 0, totalJobs: 0, recentTransactions: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Financial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 xs:gap-8">
        <div className="space-y-1 xs:space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
             <IndianRupee size={12} strokeWidth={3} />
             <span className="text-[8px] xs:text-[10px] font-black uppercase tracking-[0.2em] xs:tracking-widest text-emerald-700 leading-none">Revenue Ledger</span>
          </div>
          <h1 className="text-3xl xs:text-4xl font-black text-slate-900 tracking-tighter italic">Financial Intelligence</h1>
          <p className="text-slate-500 font-medium italic text-xs xs:text-sm">Audited transaction records and platform liquidity.</p>
        </div>
        <button className="flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl xs:rounded-[1.5rem] font-black uppercase tracking-widest text-[9px] xs:text-[10px] hover:bg-slate-800 shadow-2xl shadow-slate-300 transition-all active:scale-[0.98]">
          <Download size={18} />
          Protocol Export
        </button>
      </div>

      {/* Hero Financial Card */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] xs:rounded-[3.5rem] p-8 xs:p-12 text-white shadow-2xl shadow-indigo-900/40 border border-white/5">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />
        <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 xs:gap-16 items-center">
          <div className="space-y-6 xs:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-5 xs:px-6 py-2.5 bg-white/5 backdrop-blur-3xl rounded-xl xs:rounded-2xl border border-white/10 font-black text-[9px] xs:text-[10px] uppercase tracking-[0.2em] text-blue-300 shadow-xl shadow-slate-950/20">
              <CreditCard size={16} className="text-blue-500" />
              Aggregate Marketplace GMV
            </div>
            
            <div className="space-y-2">
              <h2 className="text-5xl xs:text-7xl font-black flex items-baseline justify-center lg:justify-start gap-4 tracking-tighter italic">
                <span className="text-3xl xs:text-4xl text-blue-500/60 font-black">₹</span>
                {loading ? '---' : data?.totalEarnings?.toLocaleString() || '0'}
              </h2>
              <div className="inline-flex items-center gap-2 text-emerald-400 font-black text-[9px] xs:text-xs uppercase tracking-widest px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <ArrowUpRight size={16} strokeWidth={3} />
                +18.4% Net Increase
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 xs:gap-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-10 lg:pt-0 lg:pl-16">
            <div className="space-y-2 xs:space-y-3">
              <p className="text-slate-500 font-black text-[8px] xs:text-[10px] uppercase tracking-[0.2em] xs:tracking-[0.3em]">Execution Count</p>
              <div className="flex items-center gap-3">
                 <p className="text-3xl xs:text-4xl font-black text-white italic tracking-tighter">{loading ? '--' : data?.totalJobs || '0'}</p>
                 <Zap size={20} className="text-blue-500/40 hidden xs:block" />
              </div>
            </div>
            <div className="space-y-2 xs:space-y-3">
              <p className="text-slate-500 font-black text-[8px] xs:text-[10px] uppercase tracking-[0.2em] xs:tracking-[0.3em]">Platform Payout (15%)</p>
              <div className="flex items-center gap-3">
                 <p className="text-3xl xs:text-4xl font-black text-white italic tracking-tighter">₹{loading ? '--' : (data?.totalEarnings * 0.15 || 0).toLocaleString()}</p>
                 <TrendingDown size={20} className="text-rose-500/40 hidden xs:block" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Artifacts */}
      <div className="space-y-6 xs:space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 xs:w-12 xs:h-12 bg-slate-100 rounded-xl xs:rounded-2xl flex items-center justify-center text-slate-400 shadow-inner">
                 <History size={18} />
              </div>
              <h3 className="text-xl xs:text-2xl font-black text-slate-800 tracking-tight italic">Verified Ledger</h3>
            </div>
            <span className="text-[8px] xs:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] xs:tracking-[0.4em] hidden sm:block">Protocol Sync Active</span>
        </div>

        <div className="bg-white rounded-[2rem] xs:rounded-[3rem] shadow-2xl shadow-indigo-900/5 border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-20 xs:p-32 text-center">
              <Loader2 className="w-12 h-12 xs:w-16 xs:h-16 text-slate-900 animate-spin mx-auto mb-6" strokeWidth={2.5} />
              <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] xs:text-[10px]">Accessing Vault Protocols...</p>
            </div>
          ) : !data?.recentTransactions || data.recentTransactions.length === 0 ? (
            <div className="p-20 xs:p-32 text-center">
              <div className="w-20 h-20 xs:w-24 xs:h-24 bg-slate-50 border border-slate-100 rounded-[2rem] xs:rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <IndianRupee size={32} className="text-slate-200" strokeWidth={3} />
              </div>
              <h3 className="text-xl xs:text-2xl font-black text-slate-800 tracking-tight italic">Financial Zero-State</h3>
              <p className="text-slate-400 mt-2 font-medium text-xs xs:text-sm">As soon as marketplace cycles complete, results will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px] lg:min-w-0">
                <thead className="hidden lg:table-header-group">
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Audit Ref</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Market Entity</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-center">Liquidity</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Audit Link</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 flex flex-col lg:table-row-group">
                  {data?.recentTransactions?.map((tx: any) => (
                    <tr key={tx._id} className="hover:bg-slate-500/5 transition duration-500 group flex flex-col lg:table-row p-6 xs:p-8 lg:p-0 border-b lg:border-none">
                      <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2">Audit Timestamp</span>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">
                             <Calendar size={16} />
                          </div>
                          <span className="text-xs xs:text-sm font-black text-slate-950 italic">
                            {new Date(tx.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1">Market Entity</span>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors text-sm xs:text-base italic">{tx.garage_name || 'Marketplace Partner'}</span>
                          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em] italic">Service Delivery Finalization</span>
                        </div>
                      </td>
                      <td className="lg:px-10 lg:py-8 border-y lg:border-none py-4 my-4 lg:my-0 flex justify-between items-center lg:table-cell text-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden">Settlement</span>
                        <span className="text-xl xs:text-2xl font-black text-slate-900 tracking-tighter italic">₹{tx.amount || 0}</span>
                      </td>
                      <td className="lg:px-10 lg:py-8 mb-4 lg:mb-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1">Razorpay UUID</span>
                        <span className="font-mono text-[9px] xs:text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                          {tx.razorpay_payment_id || 'PROT_X_PAY_NULL'}
                        </span>
                      </td>
                      <td className="lg:px-10 lg:py-8 text-right flex items-center justify-between lg:justify-end gap-3 lg:gap-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden">State</span>
                        <span className="inline-flex items-center px-4 xs:px-5 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 text-[9px] xs:text-[10px] font-black uppercase tracking-[0.2em] xs:tracking-[0.3em] border border-emerald-500/20 shadow-sm transition-all duration-500 group-hover:bg-emerald-500 group-hover:text-white">
                          Verified Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;
