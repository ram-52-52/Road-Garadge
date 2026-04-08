import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, IndianRupee, User, Activity, CheckCircle2 } from 'lucide-react';
import { MECHANIC_ROUTES } from '../constants/navigationConstant';
import { useAuthStore } from '../store/authStore';
import { useJobStore } from '../store/jobStore';
import NotificationCenter from '../components/notifications/NotificationCenter';
import { getMyGarage, toggleGarageStatus } from '../api/garageAPI';
import toast from 'react-hot-toast';

/**
 * MECHANIC HUD: Mission-Critical Partner Layout
 * Online status is shared via jobStore so NotificationCenter tap → toggle turns green.
 */
const MechanicLayout = () => {
    const location = useLocation();
    const { user } = useAuthStore();
    const { isOnline, setOnlineStatus } = useJobStore();

    // Navs
    const navItems = [
        { icon: LayoutDashboard, label: 'Feed', path: MECHANIC_ROUTES.DASHBOARD },
        { icon: Activity, label: 'Active', path: MECHANIC_ROUTES.ACTIVE_JOB },
        { icon: IndianRupee, label: 'Earnings', path: MECHANIC_ROUTES.EARNINGS },
        { icon: User, label: 'Account', path: MECHANIC_ROUTES.PROFILE },
    ];

    // Sync online status from backend on mount (so toggle reflects real DB state)
    useEffect(() => {
        const syncStatus = async () => {
            try {
                const res = await getMyGarage();
                if (res.data?.success) {
                    setOnlineStatus(res.data.data.is_available ?? false);
                }
            } catch {
                // Silent fail — default stays false
            }
        };
        if (user?.onboarding_complete) syncStatus();
    }, [user]);

    const handleToggle = async () => {
        try {
            const res = await getMyGarage();
            if (!res.data?.success) return;
            const garage = res.data.data;
            const toggleRes = await toggleGarageStatus(garage._id);
            const newStatus = toggleRes.data?.data?.is_available ?? !isOnline;
            setOnlineStatus(newStatus);
            toast.success(
                newStatus ? '🟢 You are now Online — watching for requests!' : '🔴 You are now Offline',
                {
                    style: {
                        background: '#0f172a',
                        color: '#e2e8f0',
                        border: '1px solid #1e293b',
                        borderRadius: '1rem',
                        fontWeight: 'bold',
                        fontSize: '13px',
                    }
                }
            );
        } catch {
            toast.error('Could not update status. Check connection.');
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 font-sans overflow-hidden selection:bg-blue-600/10">
            {/* High-Fidelity Operational Header */}
            <header className="h-14 xs:h-24 bg-white border-b border-slate-100 px-3 xs:px-8 flex items-center justify-between sticky top-0 z-[100] shadow-sm shrink-0">
                <div className="flex items-center gap-1 xs:gap-4 min-w-0">
                    <div className="w-7 h-7 xs:w-12 xs:h-12 bg-slate-900 rounded-lg xs:rounded-[1.25rem] flex items-center justify-center text-white italic font-black shadow-lg shadow-slate-200 shrink-0">
                        <Zap size={14} fill="currentColor" strokeWidth={2.5} className="text-blue-500" />
                    </div>
                    <div className="text-left min-w-0">
                        <h1 className="text-xs xs:text-xl font-black text-slate-950 tracking-tighter italic leading-none uppercase truncate">GarageNow</h1>
                        <span className="hidden xs:block text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Command Hub</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 xs:gap-6 shrink-0">
                    <NotificationCenter />

                    {/* Online/Offline Toggle — driven by shared jobStore.isOnline */}
                    <button
                        onClick={handleToggle}
                        className={`flex items-center gap-1.5 xs:gap-4 px-2 xs:px-5 py-1 xs:py-2.5 rounded-lg xs:rounded-2xl border shadow-sm transition-all duration-500 ${
                            isOnline
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-slate-50 border-slate-100'
                        }`}
                    >
                        <div className="hidden xs:flex flex-col items-end">
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {isOnline ? 'Online' : 'Standby'}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className={`text-[9px] font-bold uppercase tracking-tighter ${isOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {isOnline ? 'Sector-01' : 'No Signal'}
                                </span>
                            </div>
                        </div>
                        <div className={`w-2 h-2 xs:w-1.5 xs:h-1.5 rounded-full transition-all duration-500 ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                        {/* Pill toggle visual */}
                        <div className={`w-10 h-6 xs:w-14 xs:h-8 rounded-full p-1 transition-all duration-500 shadow-inner relative pointer-events-none ${isOnline ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            <div className={`w-4 h-4 xs:w-6 xs:h-6 bg-white rounded-full shadow-lg transition-all duration-500 flex items-center justify-center ${isOnline ? 'translate-x-4 xs:translate-x-6' : 'translate-x-0'}`}>
                                <Activity size={10} className={`${isOnline ? 'text-emerald-500' : 'text-slate-400'} xs:block hidden`} />
                            </div>
                        </div>
                    </button>
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
                            <div className={`p-1 xs:p-2 rounded-xl xs:rounded-2xl transition-all duration-500 ${isActive ? 'bg-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'group-hover:bg-white/5'}`}>
                                <item.icon size={isActive ? 24 : 20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`hidden xs:block text-[8px] font-black uppercase tracking-widest transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
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
