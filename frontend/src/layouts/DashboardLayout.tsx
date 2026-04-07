import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  LogOut, 
  ChevronRight,
  User,
  IndianRupee,
  Star
} from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Garages', path: '/dashboard/garages', icon: Car },
    { name: 'Jobs', path: '/dashboard/jobs', icon: Wrench },
    { name: 'Finance', path: '/dashboard/earnings', icon: IndianRupee },
    { name: 'Reviews', path: '/dashboard/reviews', icon: Star },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Desktop Only for now */}
      <aside className="hidden lg:flex w-72 bg-slate-900 flex-col shrink-0 transition-all duration-300">
        {/* Brand */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800/50">
          <div className="w-8 h-8 bg-blue-500 rounded-lg mr-3 flex items-center justify-center font-bold text-white italic">GN</div>
          <h1 className="text-xl font-bold text-white tracking-tight">GarageNow <span className="text-blue-500 text-xs align-top ml-0.5">Admin</span></h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-10 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`group flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <link.icon size={22} className={`mr-4 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-white'}`} />
                <span className="flex-1">{link.name}</span>
                {isActive && <ChevronRight size={14} className="text-blue-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Area */}
        <div className="p-6 border-t border-slate-800/50">
          <div className="flex items-center p-3 bg-slate-800/30 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center mr-3">
              <User size={20} className="text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user?.role || 'ADMIN'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">
            {navLinks.find(l => l.path === location.pathname)?.name || 'Admin Panel'}
          </h2>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 active:scale-[0.98] transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>

        {/* Main Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar animate-in fade-in duration-500 delay-150">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
