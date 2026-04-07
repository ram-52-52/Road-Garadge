import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, History, User, MapPin, Zap } from 'lucide-react';
import { USER_ROUTES } from '../constants/navigationConstant';

/**
 * DRIVER HUD: High-Fidelity Mobile-First Layout
 * Optimized for emergency response and field logistics.
 */
const UserLayout = () => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'SOS', path: USER_ROUTES.HOME },
        { icon: MapPin, label: 'Tracking', path: USER_ROUTES.TRACK },
        { icon: History, label: 'History', path: USER_ROUTES.HISTORY },
        { icon: User, label: 'Profile', path: USER_ROUTES.PROFILE },
    ];

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-950 text-white font-sans overflow-hidden selection:bg-blue-500/30">
            {/* Mission-Critical HUD Header */}
            <header className="fixed top-0 left-0 right-0 h-14 xs:h-16 bg-slate-950/50 backdrop-blur-3xl border-b border-white/5 px-4 xs:px-6 flex items-center justify-between z-[120]">
                <div className="flex items-center gap-2 xs:gap-3">
                    <div className="w-7 h-7 xs:w-8 xs:h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                        <Zap size={16} fill="white" className="text-white" />
                    </div>
                    <span className="text-xs xs:text-sm font-black tracking-tighter uppercase italic leading-none truncate max-w-[120px] xs:max-w-none">GarageNow</span>
                </div>
                <div className="flex items-center gap-1.5 xs:gap-2 px-2.5 xs:px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shrink-0">
                    <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] xs:text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                </div>
            </header>

            {/* Strategic Content Feed */}
            <main className="flex-1 overflow-y-auto relative custom-scrollbar pt-16 pb-28">
                <Outlet />
            </main>

            {/* Tactical Bottom Navigation Grid */}
            <nav className="fixed bottom-4 xs:bottom-6 left-4 xs:left-6 right-4 xs:right-6 h-18 xs:h-20 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] xs:rounded-[2.5rem] px-4 xs:px-8 flex items-center justify-between z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center gap-1 transition-all duration-500 relative group ${isActive ? 'text-blue-500 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <div className={`p-1.5 xs:p-2 rounded-xl xs:rounded-2xl transition-all duration-500 ${isActive ? 'bg-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'group-hover:bg-white/5'}`}>
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

export default UserLayout;
