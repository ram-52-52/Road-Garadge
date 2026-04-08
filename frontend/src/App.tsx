import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// Layouts
import UserLayout from './layouts/UserLayout';
import MechanicLayout from './layouts/MechanicLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthGuard from './components/AuthGuard';

// Pages - Auth
import Login from './pages/Login';

// Pages - User
import UserHome from './pages/user/Home';
import UserTracking from './pages/user/Tracking';
import UserHistory from './pages/user/History';
import UserProfile from './pages/user/Profile';
import MyGarage from './pages/user/MyGarage';

// Pages - Mechanic
import MechanicDashboard from './pages/mechanic/Dashboard';
import MechanicActiveJob from './pages/mechanic/ActiveJob';
import MechanicEarnings from './pages/mechanic/Earnings';
import MechanicProfile from './pages/mechanic/Profile';
import NotificationHistory from './pages/shared/NotificationHistory';

// Pages - Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminGarages from './pages/admin/Garages';
import AdminRadar from './pages/admin/Radar';
import AdminJobs from './pages/admin/Jobs';

// Constants
import { USER_ROUTES, MECHANIC_ROUTES, ADMIN_ROUTES } from './constants/navigationConstant';
import Register from './pages/RegisterComponent';
import SelectRole from './pages/auth/SelectRole';
import MechanicOnboarding from './components/mechanic/OnboardingFlow';

/**
 * STRATEGIC REDIRECTOR: Mission-Critical Identity Controller
 */
const Home = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" />;

  // PHASE 0: Identity Finalization Required
  if (user?.role === null) return <Navigate to="/select-role" />;

  // PHASE 1: Role-Based Strategic Redirection
  switch (user?.role) {
    case 'ADMIN':
      return <Navigate to={ADMIN_ROUTES.DASHBOARD} />;
    case 'GARAGE_OWNER':
      // Tactical Lifecycle Check: Onboarding Status
      if (!user.onboarding_complete) return <Navigate to="/mechanic/onboarding" />;
      return <Navigate to={MECHANIC_ROUTES.DASHBOARD} />;
    case 'DRIVER':
      return <Navigate to={USER_ROUTES.HOME} />;
    default:
      return <Navigate to="/login" />;
  }
};

/**
 * Global Scroll Lifecycle Controller
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const App = () => {
  return (
    <Router>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#020617',
            color: '#fff',
            border: '1px solid #1e293b',
            fontSize: '10px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '1rem',
          },
        }}
      />
      <ScrollToTop />
      <Routes>
        {/* Public Global Hub */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        {/* Identity Finalization Phase */}
        <Route path="/select-role" element={<AuthGuard allowedRoles={[null]}><SelectRole /></AuthGuard>} />

        {/* User (Rescue Driver) Module */}
        <Route element={<AuthGuard allowedRoles={['DRIVER']} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to={USER_ROUTES.HOME} />} />
            <Route path="home" element={<UserHome />} />
            <Route path="track" element={<UserTracking />} />
            <Route path="history" element={<UserHistory />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="garage" element={<MyGarage />} />
            <Route path="notifications" element={<NotificationHistory />} />
          </Route>
        </Route>

        {/* Mechanic (Service Partner) Module */}
        <Route element={<AuthGuard allowedRoles={['GARAGE_OWNER']} />}>
          <Route path="/mechanic" element={<MechanicLayout />}>
            <Route index element={<Navigate to={MECHANIC_ROUTES.DASHBOARD} />} />
            <Route path="dashboard" element={<MechanicDashboard />} />
            
            {/* Mission-Critical Onboarding Flow */}
            <Route path="onboarding" element={<div className="min-h-full bg-white"><MechanicOnboarding onComplete={() => {}} /></div>} />
            
            <Route path="active-job" element={<MechanicActiveJob />} />
            <Route path="earnings" element={<MechanicEarnings />} />
            <Route path="profile" element={<MechanicProfile />} />
            <Route path="notifications" element={<NotificationHistory />} />
          </Route>
        </Route>

        {/* Admin (Command Hub) Module */}
        <Route element={<AuthGuard allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to={ADMIN_ROUTES.DASHBOARD} />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="garages" element={<AdminGarages />} />
            <Route path="radar" element={<AdminRadar />} />
            <Route path="jobs" element={<AdminJobs />} />
          </Route>
        </Route>

        {/* Tactical Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
