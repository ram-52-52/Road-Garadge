import { useState, useEffect } from 'react';
import { Bell, MapPin, Wrench, ChevronRight, X, AlertTriangle } from 'lucide-react';

interface JobAlertProps {
  job: {
    _id: string;
    service_type?: string;      // legacy single-service format
    services?: string[];         // new multi-service format
    description: string;
    location: {
      address: string;
    };
  };
  onAccept: (jobId: string) => void;
  onDecline: () => void;
}

/**
 * MECHANIC ALERT MODAL: Tactical Interrupt HUD
 * High-fidelity full-screen notification for incoming mission-critical jobs.
 */
const MechanicAlertModal = ({ job, onAccept, onDecline }: JobAlertProps) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown <= 0) {
      onDecline();
      return;
    }
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, onDecline]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-24 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500">
      {/* Visual Emergency Background Pulse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
        
        {/* Tactical Countdown Header */}
        <div className="h-2 bg-slate-100 relative overflow-hidden">
            <div 
                className="absolute inset-y-0 left-0 bg-blue-600 transition-all duration-1000 ease-linear shadow-[0_0_10px_#2563eb]"
                style={{ width: `${(countdown / 30) * 100}%` }}
            />
        </div>

        <div className="p-10 sm:p-14 text-center">
            {/* Mission Identifier Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 border border-blue-100 rounded-3xl mb-8 relative">
                <Bell size={32} className="text-blue-600 animate-bounce" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white">
                    {countdown}s
                </div>
            </div>

            <h2 className="text-3xl font-black text-slate-950 tracking-tighter italic mb-2">New Rescue Request</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-10">Immediate Assistance Required</p>

            {/* Strategic Mission Breakdown */}
            <div className="space-y-4 mb-12">
                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors shadow-sm">
                        <Wrench size={22} />
                    </div>
                    <div className="text-left">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Service Required</span>
                        <p className="font-black text-slate-900 italic tracking-tight">{job.service_type || (job.services || []).join(' + ') || 'Rescue Required'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-rose-500 transition-colors shadow-sm">
                        <MapPin size={22} />
                    </div>
                    <div className="text-left min-w-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Impact Location</span>
                        <p className="font-black text-slate-900 italic tracking-tight truncate">{job.location.address}</p>
                    </div>
                </div>
            </div>

            {/* Strategic Response Grid */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={onDecline}
                    className="h-20 bg-slate-50 text-slate-400 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <X size={16} />
                    Decline Mission
                </button>
                <button 
                    onClick={() => onAccept(job._id)}
                    className="h-20 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                >
                    Confirm Dispatch
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Connection Safety HUD */}
            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-amber-500/50 uppercase tracking-[0.2em]">
                <AlertTriangle size={12} strokeWidth={3} />
                <span>Mission Will Expire in {countdown} Seconds</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicAlertModal;
