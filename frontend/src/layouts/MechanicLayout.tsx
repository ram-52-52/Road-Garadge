import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, IndianRupee, User, Activity, CheckCircle2 } from 'lucide-react';
import { MECHANIC_ROUTES } from '../constants/navigationConstant';
import { useAuthStore } from '../store/authStore';

/**
 * MECHANIC HUD: Mission-Critical Partner Layout
 * Optimized for job feed management and rapid onboarding.
 */
const MechanicLayout = () => {
    const location = useLocation();
    const { user } = useAuthStore();
    const [isOnline, setIsOnline] = useState(false);

    // Operational Metrics
    const navItems = [
        { icon: LayoutDashboard, label: 'Feed', path: MECHANIC_ROUTES.DASHBOARD },
        { icon: Activity, label: 'Active', path: MECHANIC_ROUTES.ACTIVE_JOB },
        { icon: IndianRupee, label: 'Earnings', path: MECHANIC_ROUTES.EARNINGS },
        { icon: User, label: 'Account', path: MECHANIC_ROUTES.PROFILE },
    ];

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 font-sans overflow-hidden selection:bg-blue-600/10">
            {/* High-Fidelity Operational Header */}
            <header className="h-20 xs:h-24 bg-white border-b border-slate-100 px-4 xs:px-8 flex items-center justify-between sticky top-0 z-[100] shadow-sm shrink-0">
                <div className="flex items-center gap-3 xs:gap-4">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 bg-slate-900 rounded-xl xs:rounded-[1.25rem] flex items-center justify-center text-white italic font-black shadow-xl shadow-slate-200 shrink-0">
                        <Zap size={22} fill="currentColor" strokeWidth={2.5} className="text-blue-500" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-lg xs:text-xl font-black text-slate-950 tracking-tighter italic leading-none uppercase">GarageNow</h1>
                        <span className="text-[8px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 block">Command Hub</span>
                    </div>
                </div>

                {/* Handshaking Logic: Online/Offline Stealth Toggle */}
                <div className="flex items-center gap-3 xs:gap-6">
                    <div className="flex items-center gap-2 xs:gap-4 px-3 xs:px-5 py-2 xs:py-2.5 bg-slate-50 rounded-xl xs:rounded-2xl border border-slate-100 shadow-sm transition-all duration-700">
                        <div className="flex flex-col items-end">
                            <span className={`text-[8px] xs:text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {isOnline ? 'Online' : 'Standby'}
                            </span>
                            <span className="hidden xs:block text-[8px] font-bold text-slate-400 uppercase tracking-tight">Geo-Match</span>
                        </div>
                        <button 
                            onClick={() => setIsOnline(!isOnline)}
                            className={`w-10 xs:w-14 h-6 xs:h-8 rounded-full p-1 transition-all duration-700 relative ${isOnline ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-300'}`}
                        >
                            <div className={`w-4 xs:w-6 h-4 xs:h-6 bg-white rounded-full shadow-md transition-all duration-700 transform ${isOnline ? 'translate-x-4 xs:translate-x-6' : 'translate-x-0'}`} />
                            {isOnline && <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500/20" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Tactical Onboarding Progress Overlay (If Incomplete) */}
            {!user?.onboarding_complete && (
                <div className="bg-slate-900 text-white px-8 py-3 flex items-center justify-between z-[110] animate-in slide-in-from-top duration-700">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-blue-400" />
                        <span className="text-xs font-black uppercase tracking-widest italic">Phase 1: Profile Initialization Complete</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1 bg-blue-500 rounded-full" />
                        <div className="w-12 h-1 bg-white/20 rounded-full" />
                        <div className="w-12 h-1 bg-white/20 rounded-full" />
                        <div className="w-12 h-1 bg-white/20 rounded-full" />
                    </div>
                </div>
            )}

            {/* Strategic Content Feed */}
            <main className="flex-1 overflow-y-auto relative custom-scrollbar pb-28">
                <Outlet />
            </main>

            {/* Tactical Partner Navigation Grid */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 xs:h-24 bg-white/80 backdrop-blur-3xl border-t border-slate-100 px-6 xs:px-10 flex items-center justify-around z-[100] shadow-[0_-15px_40px_rgba(0,0,0,0.05)]">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center gap-1 transition-all duration-500 relative group ${isActive ? 'text-blue-600 scale-105' : 'text-slate-400 hover:text-slate-950'}`}
                        >
                            <div className={`p-2 xs:p-2.5 rounded-xl xs:rounded-2xl transition-all duration-500 ${isActive ? 'bg-blue-600/10 shadow-inner' : 'group-hover:bg-slate-50'}`}>
                                <item.icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[7px] xs:text-[8px] font-black uppercase tracking-[0.2em] xs:tracking-widest transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default MechanicLayout;
