import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';

const ITEMS_PER_PAGE = 10;

const NotificationHistory: React.FC = () => {
  const { notifications, fetchNotifications, markRead, loading } = useNotificationStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = notifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'JOB': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'PAYMENT': return <Clock className="w-5 h-5 text-amber-400" />;
      case 'SYSTEM': return <AlertCircle className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-full bg-slate-950 p-3 xs:p-8 space-y-6 animate-in fade-in duration-1000">
      {/* Tactical Header HUD */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/40 p-6 xs:p-8 rounded-[2rem] xs:rounded-[3rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
        <div className="relative z-10 space-y-1 xs:space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-[8px] xs:text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">
            System Intelligence
          </div>
          <h2 className="text-lg xs:text-3xl font-black text-white tracking-tighter italic uppercase leading-tight">History Archive</h2>
        </div>
        <button 
          onClick={() => window.history.back()} 
          className="relative z-10 w-12 h-12 xs:w-16 xs:h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 hover:bg-white/10 transition group active:scale-90"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Strategic Notification Feed */}
      <div className="space-y-4">
        {loading && notifications.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Establishing secure link...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/20 rounded-[3rem] border border-white/5 space-y-6">
             <Bell size={48} className="text-slate-800 mx-auto opacity-20" />
             <div className="space-y-2">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Horizon is Clear</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">No mission logs detected in your sector.</p>
             </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {currentItems.map((notif) => (
                <div 
                  key={notif._id}
                  onClick={() => !notif.isRead && markRead(notif._id)}
                  className={`p-6 bg-slate-900/40 border border-white/5 rounded-[2rem] xs:rounded-[2.5rem] backdrop-blur-3xl hover:bg-white/5 transition-all duration-500 group relative overflow-hidden ${!notif.isRead ? 'border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.05)]' : ''}`}
                >
                  <div className="flex gap-5 items-start">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 shrink-0 ${
                      !notif.isRead ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-950 border-white/5'
                    }`}>
                      {getTypeIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h4 className={`text-sm xs:text-base font-black italic tracking-tight uppercase truncate ${!notif.isRead ? 'text-white' : 'text-slate-400'}`}>
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)] flex-shrink-0 animate-pulse" />
                        )}
                      </div>
                      <p className={`text-xs xs:text-sm font-medium leading-relaxed italic ${!notif.isRead ? 'text-slate-300' : 'text-slate-500'}`}>
                        {notif.body}
                      </p>
                      <div className="mt-4 flex items-center gap-3 flex-wrap">
                        {notif.data?.services ? (
                          notif.data.services.map((s: string) => (
                            <span key={s} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[7px] font-black text-blue-400 uppercase tracking-widest italic">{s}</span>
                          ))
                        ) : (
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">{notif.type} Protocol</span>
                        )}
                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-8">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white disabled:opacity-20 transition-all group"
                >
                  <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Sector Back
                </button>
                <div className="flex items-center gap-3">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                        currentPage === page ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white disabled:opacity-20 transition-all group"
                >
                  Next Sector
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationHistory;
