import { 
  TrendingUp, 
  IndianRupee, 
  Calendar, 
  ChevronRight, 
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MECHANIC_ROUTES } from '../../constants/navigationConstant';

const MechanicEarnings = () => {
    const navigate = useNavigate();

    const earnings = [
        { id: 'TRX-9482', date: 'Today, 12:42 PM', service: 'Flat Tire Rescue', amount: '₹ 450.00', status: 'SETTLED' },
        { id: 'TRX-9231', date: 'Yesterday, 04:15 PM', service: 'Battery Jump Handshake', amount: '₹ 300.00', status: 'SETTLED' },
        { id: 'TRX-8912', date: 'Oct 24, 2026', service: 'Engine Diagnostic Protocol', amount: '₹ 1,200.00', status: 'PENDING' },
        { id: 'TRX-8742', date: 'Oct 22, 2026', service: 'Towing Logistics Phase 2', amount: '₹ 2,400.00', status: 'SETTLED' },
    ];

    return (
        <div className="min-h-full bg-slate-50 p-8 space-y-12 animate-in fade-in duration-1000">
            {/* Treasury Header HUD */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 xs:gap-8 bg-white p-8 xs:p-10 rounded-[2.5rem] xs:rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
                <div className="relative z-10 space-y-3 xs:space-y-4 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[8px] xs:text-[9px] font-black uppercase tracking-[0.3em] xs:tracking-[0.4em] text-blue-600">
                        Financial Ledger Active
                    </div>
                    <h2 className="text-3xl xs:text-4xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">Partner Treasury</h2>
                </div>
                <button 
                    onClick={() => navigate(MECHANIC_ROUTES.DASHBOARD)} 
                    className="relative z-10 self-center sm:self-auto w-12 h-12 xs:w-16 xs:h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-950 transition group shadow-sm active:scale-90"
                >
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Financial Multi-Dimensional Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8">
                
                {/* Main Revenue Card */}
                <div className="lg:col-span-2 bg-slate-950 rounded-[2.5rem] xs:rounded-[4rem] p-8 xs:p-10 sm:p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
                    <div className="relative z-10 space-y-8 xs:space-y-12">
                        <div className="flex flex-col xs:flex-row items-center justify-between gap-6 xs:gap-8 text-center xs:text-left">
                            <div className="space-y-2">
                                <p className="text-[8px] xs:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] xs:tracking-[0.4em]">Settled Balance</p>
                                <h3 className="text-4xl xs:text-5xl sm:text-6xl font-black italic tracking-tighter uppercase whitespace-nowrap">₹ 14,802.40</h3>
                            </div>
                            <div className="w-16 h-16 xs:w-20 xs:h-20 bg-white/5 rounded-2xl xs:rounded-3xl border border-white/10 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
                                <IndianRupee size={32} strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Visual Revenue Sparkline Simulation */}
                        <div className="h-32 xs:h-40 flex items-end gap-2 xs:gap-3 px-2">
                            {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85].map((h, i) => (
                                <div 
                                    key={i} 
                                    className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg xs:rounded-t-xl transition-all duration-1000 animate-in slide-in-from-bottom duration-700" 
                                    style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }} 
                                />
                            ))}
                        </div>

                        <div className="flex flex-row justify-center xs:justify-start gap-8 xs:gap-12 pt-6 xs:pt-8 border-t border-white/5">
                            <div className="space-y-1 xs:space-y-2 text-center xs:text-left">
                                <span className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Weekly Alpha</span>
                                <p className="text-xl xs:text-2xl font-black text-emerald-400 italic tracking-tighter leading-none">+₹ 2.4k</p>
                            </div>
                            <div className="space-y-1 xs:space-y-2 text-center xs:text-left">
                                <span className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Growth</span>
                                <p className="text-xl xs:text-2xl font-black text-blue-400 italic tracking-tighter leading-none">8.4%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Payout Focus Card */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] xs:rounded-[4rem] p-8 xs:p-10 sm:p-12 space-y-8 xs:space-y-10 shadow-sm relative overflow-hidden group text-center sm:text-left mx-auto lg:mx-0 w-full max-w-sm">
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-50 blur-[80px] rounded-full" />
                    <div className="relative z-10 space-y-6 xs:space-y-8">
                        <div className="w-14 h-14 xs:w-16 xs:h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl xs:rounded-3xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-500 shadow-sm mx-auto sm:mx-0">
                            <TrendingUp size={28} />
                        </div>
                        <div className="space-y-2 xs:space-y-3">
                             <h4 className="text-xl xs:text-2xl font-black italic tracking-tighter uppercase">Strategic Paycheck</h4>
                             <p className="text-slate-500 text-xs xs:text-sm font-medium leading-relaxed italic">"Your next automated settlement protocol is scheduled for November 1st at 04:00 AM Hub Time."</p>
                        </div>
                        <button className="w-full h-14 xs:h-16 bg-slate-950 text-white rounded-2xl font-black text-[8px] xs:text-[10px] uppercase tracking-widest hover:bg-slate-800 transition active:scale-95 shadow-lg shadow-slate-950/20">
                            Immediate Liquidity Trigger
                        </button>
                    </div>
                </div>
            </div>

            {/* Transaction Ledger Artifacts */}
            <div className="space-y-6 xs:space-y-8">
                <div className="flex items-center justify-between px-2 xs:px-4">
                    <h3 className="text-xl xs:text-2xl font-black text-slate-950 tracking-tighter italic uppercase">Artifact Audit</h3>
                    <div className="flex items-center gap-2 xs:gap-3 px-3 xs:px-5 py-2 bg-white rounded-full border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition">
                         <Calendar size={14} className="text-blue-600" />
                         <span className="text-[8px] xs:text-[10px] font-black text-slate-950 uppercase tracking-widest">Oct 2026 Grid</span>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] xs:rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden pb-6 xs:pb-8 flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px] lg:min-w-0">
                            <thead className="hidden lg:table-header-group">
                                <tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-10 xs:px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Transaction ID</th>
                                    <th className="px-10 xs:px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Service Protocol</th>
                                    <th className="px-10 xs:px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Amount Archetype</th>
                                    <th className="px-10 xs:px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Handshake Status</th>
                                    <th className="px-10 xs:px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right text-right">Audit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 flex flex-col lg:table-row-group">
                                {earnings.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-slate-50/50 transition duration-300 group flex flex-col lg:table-row p-6 xs:p-10 border-b lg:border-none">
                                        <td className="lg:px-12 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1">Transaction ID</span>
                                            <div className="flex flex-col">
                                                <span className="text-xs xs:text-sm font-black text-slate-950 tracking-tighter italic uppercase leading-none">{trx.id}</span>
                                                <span className="text-[8px] xs:text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{trx.date}</span>
                                            </div>
                                        </td>
                                        <td className="lg:px-12 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2">Service Protocol</span>
                                            <span className="text-xs xs:text-sm font-black text-slate-700 italic uppercase leading-tight line-clamp-1">{trx.service}</span>
                                        </td>
                                        <td className="lg:px-12 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-1">Amount Archetype</span>
                                            <span className="text-lg xs:text-2xl lg:text-lg font-black text-slate-950 italic tracking-tighter leading-none">{trx.amount}</span>
                                        </td>
                                        <td className="lg:px-12 lg:py-8 mb-4 lg:mb-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden mb-2">Handshake Status</span>
                                            <div className={`inline-flex items-center gap-2 px-3 xs:px-4 py-1.5 rounded-full text-[8px] xs:text-[10px] font-black uppercase tracking-widest border ${trx.status === 'SETTLED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${trx.status === 'SETTLED' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                                {trx.status}
                                            </div>
                                        </td>
                                        <td className="lg:px-12 lg:py-8 text-left lg:text-right flex items-center justify-between lg:justify-end gap-3 mt-4 lg:mt-0">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block lg:hidden">Audit Ledger</span>
                                            <button className="p-3 xs:p-4 bg-white border border-slate-100 rounded-xl xs:rounded-[1.25rem] flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition active:scale-90 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-8 px-6 xs:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                         <p className="text-[8px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Displaying latest 4 transaction artifacts</p>
                         <button className="text-[8px] xs:text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] xs:tracking-[0.4em] hover:text-indigo-600 transition-all">Audit Full Treasury Protocol</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MechanicEarnings;
