import { useState } from 'react';
import MobileUI from './MobileUI';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from './Dashboard';
import Garages from './Garages';
import Jobs from './Jobs';
import Earnings from './Earnings';
import Reviews from './Reviews';
import AdminRadar from './AdminRadar';
import { 
  Smartphone, 
  Settings, 
  Zap, 
  Shield, 
  Map, 
  BarChart3, 
  Users, 
  Layers,
  ChevronRight,
  Globe
} from 'lucide-react';

const PrototypeHub = () => {
    const [view, setView] = useState<'DRIVER' | 'GARAGE' | 'ADMIN'>('DRIVER');
    const [adminSubView, setAdminSubView] = useState<'RADAR' | 'DASHBOARD' | 'GARAGES' | 'JOBS' | 'EARNINGS' | 'REVIEWS'>('RADAR');

    const renderAdminContent = () => {
        switch(adminSubView) {
            case 'RADAR': return <AdminRadar />;
            case 'DASHBOARD': return <Dashboard />;
            case 'GARAGES': return <Garages />;
            case 'JOBS': return <Jobs />;
            case 'EARNINGS': return <Earnings />;
            case 'REVIEWS': return <Reviews />;
            default: return <AdminRadar />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
            {/* Global Elite Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-[100] h-24 bg-slate-900/50 backdrop-blur-3xl border-b border-white/5 px-8 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shadow-white/10 group cursor-pointer hover:scale-110 transition duration-500">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tighter italic italic">GarageNow <span className="text-blue-500 not-italic uppercase text-[10px] tracking-[0.3em] font-black ml-2">PROTOTYPE HUB</span></h1>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-white/10 shadow-inner">
                    <button 
                        onClick={() => setView('DRIVER')}
                        className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${view === 'DRIVER' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Smartphone size={16} />
                        Driver App
                    </button>
                    <button 
                        onClick={() => setView('GARAGE')}
                        className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${view === 'GARAGE' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Settings size={16} />
                        Garage App
                    </button>
                    <button 
                        onClick={() => setView('ADMIN')}
                        className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${view === 'ADMIN' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Shield size={16} />
                        Admin Panel
                    </button>
                </nav>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end hidden sm:block">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Environment</p>
                     <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Live Prototype</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10" />
                </div>
            </header>

            {/* Viewport Content */}
            <main className="flex-1 pt-32 p-8 flex items-center justify-center relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px]" />

                {view === 'ADMIN' ? (
                    <div className="w-full max-w-[1600px] h-full flex gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        {/* Admin Internal Sidebar */}
                        <aside className="w-80 shrink-0 bg-slate-900 rounded-[3rem] p-8 border border-white/5 space-y-12 shadow-2xl relative z-10 hidden xl:block overflow-y-auto max-h-[85vh]">
                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Ecosystem Monitor</p>
                              {[
                                { id: 'RADAR', label: 'Job Radar', icon: Globe },
                                { id: 'DASHBOARD', label: 'KPI Summary', icon: BarChart3 },
                                { id: 'GARAGES', label: 'Garage Deck', icon: Layers },
                                { id: 'JOBS', label: 'Execution', icon: Settings },
                                { id: 'EARNINGS', label: 'Finance', icon: BarChart3 },
                                { id: 'REVIEWS', label: 'Safety', icon: Users },
                              ].map((item) => (
                                <button 
                                  key={item.id}
                                  onClick={() => setAdminSubView(item.id as any)}
                                  className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 group ${adminSubView === item.id ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-900/40' : 'bg-slate-950/50 border-white/5 text-slate-400 hover:border-white/10 hover:text-white'}`}
                                >
                                  <div className="flex items-center gap-4">
                                     <item.icon size={20} className={adminSubView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-500 transition-colors'} />
                                     <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                                  </div>
                                  <ChevronRight size={14} className={`transition-transform duration-300 ${adminSubView === item.id ? 'translate-x-1' : ''}`} />
                                </button>
                              ))}
                           </div>

                           <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[2rem] space-y-4">
                                <div className="flex items-center gap-3">
                                   <Shield size={24} className="text-blue-400" />
                                   <p className="text-xs font-black uppercase tracking-widest">Protocol Active</p>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium italic italic italic">The Admin panel provides full marketplace control and verified transactions auditing.</p>
                           </div>
                        </aside>

                        {/* Admin Display Area */}
                        <div className="flex-1 overflow-y-auto max-h-[85vh] custom-scrollbar px-4 relative z-10">
                            {renderAdminContent()}
                        </div>
                    </div>
                ) : (
                    /* App Simulator View */
                    <div className="relative w-full max-w-[500px] flex justify-center animate-in fade-in zoom-in-95 duration-1000">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
                            <Smartphone size={16} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Simulating High-End Device Context</span>
                        </div>
                        
                        <div className="w-full max-w-md">
                           <MobileUI />
                        </div>

                        {/* Floating Interaction Tips */}
                        <div className="absolute top-1/2 -right-48 -translate-y-1/2 hidden 2xl:block space-y-8 max-w-[150px]">
                            <div className="p-6 bg-slate-900/50 border border-white/5 rounded-3xl backdrop-blur-xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 italic">Context</p>
                                <p className="text-[10px] text-slate-400 font-medium italic italic">Toggle apps in the header to switch roles.</p>
                            </div>
                            <div className="p-6 bg-slate-900/50 border border-white/5 rounded-3xl backdrop-blur-xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2 italic">Driver</p>
                                <p className="text-[10px] text-slate-400 font-medium italic italic">Trigger an SOS to see the radar cycle.</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Global Activity Ticker */}
            <footer className="h-10 bg-slate-950 border-t border-white/5 px-8 flex items-center justify-between overflow-hidden relative z-50">
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-1.5 grayscale">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Protocol 104.2-A</span>
                  </div>
                  <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap">
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mx-10">Live Marketplace Pings: [Ahmedabad-12] Request #829 Status: RESOLVED</span>
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mx-10">System Load: 24% Efficiency: 100% Signal: PERSISTENT</span>
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mx-10">Partner Node "Racer-Forge" reported online for Duty Cycle</span>
                  </div>
               </div>
               <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.2em] text-blue-500 drop-shadow-sm">
                  <Globe size={10} className="animate-spin-slow" />
                  Grid Locked
               </div>
            </footer>
        </div>
    );
};

export default PrototypeHub;
