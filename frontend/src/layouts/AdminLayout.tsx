import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, Wrench, LogOut, ChevronRight, Activity, Menu, X, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { ADMIN_ROUTES } from '../constants/navigationConstant';
import { useState } from 'react';
import NotificationCenter from '../components/notifications/NotificationCenter';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navLinks = [
        { name: 'Control Room', path: ADMIN_ROUTES.DASHBOARD, icon: LayoutDashboard },
        { name: 'Live Radar', path: ADMIN_ROUTES.RADAR, icon: Activity },
        { name: 'Garages', path: ADMIN_ROUTES.GARAGES, icon: ShieldCheck },
        { name: 'Job Feed', path: ADMIN_ROUTES.JOBS, icon: Wrench },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-[100dvh] bg-slate-50 font-sans overflow-hidden relative">
            {/* Desktop Command Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-80 bg-slate-950 flex flex-col shrink-0 transition-transform duration-500 lg:translate-x-0 lg:static z-[150] shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Close Button for Mobile */}
                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-6 right-6 w-10 h-10 bg-white/5 text-white rounded-xl flex items-center justify-center border border-white/10"
                >
                    <X size={20} />
                </button>

                {/* Identity Panel */}
                <div className="h-24 flex items-center px-10 border-b border-white/5 bg-slate-900/50">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 bg-blue-600 rounded-xl xs:rounded-2xl mr-4 flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-500/20 shrink-0">
                        <Zap size={24} fill="white" />
                    </div>
                    <div>
                        <h1 className="text-lg xs:text-xl font-black text-white tracking-tighter italic uppercase leading-tight">GarageNow</h1>
                        <p className="text-[8px] xs:text-[10px] font-black text-blue-500 uppercase tracking-widest">Global Admin</p>
                    </div>
                </div>

                {/* Primary Navigation Hub */}
                <nav className="flex-1 py-8 xs:py-12 px-6 space-y-3 xs:space-y-4 overflow-y-auto custom-scrollbar">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link 
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-4 xs:gap-5 p-4 xs:p-5 rounded-[1.5rem] xs:rounded-[2rem] transition-all duration-500 relative group overflow-hidden ${isActive ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                            >
                                {isActive && <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent group-hover:scale-150 transition-transform duration-1000" />}
                                <link.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10 shrink-0" />
                                <span className="flex-1 font-black text-xs uppercase tracking-widest relative z-10">{link.name}</span>
                                {isActive && <ChevronRight size={16} className="relative z-10 shrink-0" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Secure Account Module */}
                <div className="p-6 xs:p-8 border-t border-white/5">
                    <div className="flex items-center p-4 xs:p-5 bg-white/5 rounded-[1.5rem] xs:rounded-3xl border border-white/5 shadow-inner">
                        <div className="w-10 h-10 xs:w-12 xs:h-12 bg-slate-800 rounded-xl xs:rounded-2xl flex items-center justify-center mr-3 xs:mr-4 text-white font-black italic shadow-lg shadow-black/20 shrink-0">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs xs:text-sm font-black text-white italic tracking-tighter truncate">{user?.name || 'Administrator'}</p>
                            <span className="text-[8px] xs:text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Ops</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Expansive Strategic Viewport */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                {/* Mobile Header Overlay */}
                {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[140] lg:hidden animate-in fade-in duration-500" onClick={() => setIsSidebarOpen(false)} />}

                {/* Adaptive Status Bar */}
                <header className="h-20 xs:h-24 bg-white border-b border-slate-100 px-4 xs:px-12 flex items-center justify-between sticky top-0 z-[90] shrink-0">
                    <div className="flex items-center gap-3 xs:gap-4 min-w-0">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden w-10 h-10 xs:w-12 xs:h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900 shadow-sm active:scale-90 transition-transform shrink-0"
                        >
                            <Menu size={18} />
                        </button>
                        <h2 className="text-lg xs:text-2xl font-black text-slate-950 tracking-tighter italic uppercase leading-none truncate pr-2">
                            {navLinks.find(l => l.path === location.pathname)?.name || 'Control Panel'}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-3 xs:gap-10 shrink-0">
                        <NotificationCenter />
                        <div className="hidden sm:flex items-center gap-4 px-6 py-2.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Secure Node</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center justify-center w-10 h-10 xs:w-auto xs:px-6 xs:py-3.5 bg-rose-50 text-rose-600 rounded-xl xs:rounded-2xl font-black text-[9px] xs:text-xs uppercase tracking-widest hover:bg-rose-100 active:scale-95 transition-all shadow-sm"
                        >
                            <LogOut size={16} strokeWidth={2.5} className="xs:mr-3" />
                            <span className="hidden xs:inline">Log Out</span>
                        </button>
                    </div>
                </header>

                {/* Primary Content Scrollway */}
                <main className="flex-1 overflow-y-auto p-6 xs:p-8 sm:p-12 custom-scrollbar bg-slate-50 relative">
                    <Outlet />
                    {/* Ghost Text Aesthetic Decorative Corner */}
                    <div className="hidden sm:block absolute bottom-10 right-10 opacity-[0.03] select-none pointer-events-none uppercase font-black text-9xl italic tracking-tighter text-slate-900">
                        Admin
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
