import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, Clock, Wifi } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useNavigate } from 'react-router-dom';
import { USER_ROUTES, MECHANIC_ROUTES } from '../../constants/navigationConstant';
import { useAuthStore } from '../../store/authStore';
import { useJobStore } from '../../store/jobStore';
import { getMyGarage, toggleGarageStatus } from '../../api/garageAPI';
import toast from 'react-hot-toast';

const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, fetchNotifications, markRead, loading } = useNotificationStore();
  const { user } = useAuthStore();
  const { setOnlineStatus } = useJobStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isGoingOnline, setIsGoingOnline] = useState(false);
  const navigate = useNavigate();

  const isMechanic = user?.role === 'GARAGE_OWNER';

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'JOB': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'PAYMENT': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'SYSTEM': return <AlertCircle className="w-4 h-4 text-blue-400" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  /**
   * MECHANIC NOTIFICATION TAP:
   * 1. Mark notification as read
   * 2. Fetch their garage profile
   * 3. If offline, toggle online (is_available = true)
   * 4. Navigate to dashboard — the socket job:new event will fire the popup
   */
  const handleMechanicNotificationClick = async (notifId: string, isRead: boolean) => {
    if (!isRead) markRead(notifId);

    setIsGoingOnline(true);
    setIsOpen(false);

    try {
      // Fetch garage to get its ID and current status
      const res = await getMyGarage();
      if (res.data.success) {
        const garage = res.data.data;

        // Only toggle if currently offline — don't flip if already online
        if (!garage.is_available) {
          await toggleGarageStatus(garage._id);
          setOnlineStatus(true); // ← sync the layout header toggle to green
          toast.success('🟢 You are now Online — watching for requests!', {
            duration: 3000,
            style: {
              background: '#0f172a',
              color: '#e2e8f0',
              border: '1px solid #1e293b',
              borderRadius: '1rem',
              fontWeight: 'bold',
              fontSize: '13px',
            }
          });
        }

        // Navigate to dashboard where job:new socket will trigger the popup
        navigate(MECHANIC_ROUTES.DASHBOARD);
      }
    } catch (err) {
      console.error('Online Toggle Failure:', err);
      toast.error('Could not go online. Please try manually from dashboard.');
      navigate(MECHANIC_ROUTES.DASHBOARD);
    } finally {
      setIsGoingOnline(false);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon & Badge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isGoingOnline}
        className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all active:scale-90 disabled:opacity-50"
      >
        <Bell className={`w-5 h-5 ${isGoingOnline ? 'animate-pulse text-emerald-400' : 'text-slate-300'}`} />
        {unreadCount > 0 && !isGoingOnline && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-950">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {isGoingOnline && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-slate-950 animate-pulse">
            <Wifi className="w-2.5 h-2.5" />
          </span>
        )}
      </button>

      {/* Dropdown Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className={`fixed xs:absolute top-16 xs:top-full xs:right-0 inset-x-4 xs:inset-auto xs:w-80 bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-[200] overflow-hidden backdrop-blur-3xl animate-in slide-in-from-top-2 duration-300`}>
          <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Notifications</h3>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-mono">
              {unreadCount} UNREAD
            </span>
          </div>

          {/* Mechanic Online Tip Banner */}
          {isMechanic && unreadCount > 0 && (
            <div className="px-4 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Tap a notification to go online & see the request
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs animate-pulse lowercase tracking-widest">
                Scanning for updates...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-600 space-y-2">
                <Bell className="w-8 h-8 mx-auto opacity-10" />
                <p className="text-xs uppercase tracking-tighter">Horizon is clear</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id}
                  onClick={() => {
                    if (isMechanic) {
                      handleMechanicNotificationClick(notif._id, notif.isRead);
                    } else {
                      if (!notif.isRead) markRead(notif._id);
                    }
                  }}
                  className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer relative group ${
                    !notif.isRead ? 'bg-blue-500/5' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center border ${
                      !notif.isRead ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-slate-800'
                    }`}>
                      {getTypeIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-bold truncate ${!notif.isRead ? 'text-slate-100' : 'text-slate-400'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {notif.body}
                      </p>
                      {isMechanic && !notif.isRead && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                          <Wifi className="w-2.5 h-2.5" /> Tap to go online
                        </span>
                      )}
                      <span className="text-[9px] text-slate-600 mt-1 block font-mono">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {!notif.isRead && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shadow-lg shadow-blue-500/50"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-800/20 text-center border-t border-slate-800">
             <button 
               onClick={() => {
                 setIsOpen(false);
                 const path = user?.role === 'DRIVER' ? USER_ROUTES.NOTIFICATIONS : MECHANIC_ROUTES.NOTIFICATIONS;
                 navigate(path);
               }}
               className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:text-blue-300 transition-colors w-full py-1"
             >
               Explore Mission Archive
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
