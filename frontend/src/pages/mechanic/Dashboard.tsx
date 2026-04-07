import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useJobStore } from '../../store/jobStore';
import OnboardingFlow from '../../components/mechanic/OnboardingFlow';
import MechanicAlertModal from '../../components/mechanic/MechanicAlertModal';
import { 
  Zap, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Activity,
  ChevronRight,
  IndianRupee
} from 'lucide-react';

/**
 * MECHANIC DASHBOARD: Mission-Critical Job Feed & Onboarding
 * Orchestrates the transition from onboarding to active rescue missions.
 */
const MechanicDashboard = () => {
    const { user } = useAuthStore();
    const { 
        initSocket, 
        incomingJob, 
        setIncomingJob, 
        setActiveJob 
    } = useJobStore();

    // Initialize Strategic Socket Connection
    useEffect(() => {
        if (user?._id) {
            initSocket(user._id);
        }
    }, [user, initSocket]);

    const handleAcceptJob = (jobId: string) => {
        console.log('⚔️ Dispatch Confirmed:', jobId);
        // API Call would go here: acceptJob(jobId)
        setActiveJob(incomingJob);
        setIncomingJob(null);
    };

    const handleDeclineJob = () => {
        setIncomingJob(null);
    };

    // PHASE 0: Onboarding Handshake Required
    if (!user?.onboarding_complete) {
        return (
            <div className="min-h-full bg-white">
                <OnboardingFlow onComplete={(data) => console.log('Onboarding Logic Triggered:', data)} />
            </div>
        );
    }

    // PHASE 1: Active Mission Dashboard
    return (
        <div className="p-6 xs:p-8 sm:p-12 space-y-8 xs:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            {/* Incoming Emergency Interrupt Overlay */}
            {incomingJob && (
                <MechanicAlertModal 
                    job={incomingJob}
                    onAccept={handleAcceptJob}
                    onDecline={handleDeclineJob}
                />
            )}

            {/* Tactical Operational Stats */}
            <header className="space-y-3 xs:space-y-4 text-center xs:text-left">
                <div className="flex flex-col xs:flex-row items-center gap-3 xs:gap-4">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 bg-blue-600 rounded-xl xs:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                        <Zap size={24} fill="currentColor" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-2xl xs:text-3xl font-black text-slate-950 tracking-tighter italic uppercase">Mission Feed</h2>
                        <p className="text-slate-400 text-[8px] xs:text-[10px] font-black uppercase tracking-[0.2em] xs:tracking-[0.3em]">Sector Alpha-9 Dispatch active</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8">
                {/* Real-Time Queue Grid */}
                <div className="lg:col-span-2 space-y-4 xs:space-y-6">
                    <div className="p-6 xs:p-8 sm:p-10 bg-white border border-slate-100 rounded-[2rem] xs:rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                        
                        <div className="flex flex-col items-center justify-center py-12 xs:py-20 text-center space-y-4 xs:space-y-6">
                            <div className="w-16 h-16 xs:w-20 xs:h-20 bg-slate-50 border border-slate-100 rounded-[1.5rem] xs:rounded-3xl flex items-center justify-center text-slate-300">
                                <Activity size={32} className="animate-pulse" />
                            </div>
                            <div className="space-y-1 xs:space-y-2">
                                <h3 className="text-lg xs:text-xl font-black text-slate-900 italic tracking-tight uppercase">Scanning Sector Grids</h3>
                                <p className="text-slate-400 text-[10px] xs:text-xs font-medium max-w-[240px] mx-auto leading-relaxed">No emergency SOS signals detected in your immediate 15km sector at this moment.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col xs:flex-row items-center justify-between gap-4 px-6 xs:px-8 py-4 xs:py-5 bg-slate-950 text-white rounded-[1.5rem] xs:rounded-[2rem] shadow-xl shadow-slate-900/10 text-center xs:text-left">
                        <div className="flex items-center gap-3 xs:gap-4">
                             <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-emerald-500 rounded-full animate-pulse" />
                             <span className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest italic">Identity Verification Confirmed</span>
                        </div>
                        <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                    </div>
                </div>

                {/* Performance Analytics Column */}
                <div className="space-y-6 xs:space-y-8">
                    <div className="p-6 xs:p-8 bg-blue-600 rounded-[2rem] xs:rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/40 relative overflow-hidden text-center xs:text-left">
                        <IndianRupee size={80} className="absolute -bottom-4 -right-4 xs:-bottom-6 xs:-right-6 opacity-10 -rotate-12" />
                        <span className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest opacity-60">Fleet Revenue</span>
                        <h4 className="text-3xl xs:text-4xl font-black italic tracking-tighter mt-1 xs:mt-2">₹0.00</h4>
                        <div className="mt-6 xs:mt-8 flex items-center justify-between pt-4 xs:pt-6 border-t border-white/10">
                             <span className="text-[8px] xs:text-[10px] font-black uppercase tracking-widest opacity-60">Response Time</span>
                             <div className="flex items-center gap-2">
                                <Clock size={14} className="text-blue-200" />
                                <span className="text-[10px] xs:text-xs font-black italic">--:--</span>
                             </div>
                        </div>
                    </div>

                    <div className="p-6 xs:p-8 bg-white border border-slate-100 rounded-[2rem] xs:rounded-[2.5rem] shadow-sm space-y-4 xs:space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[8px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Ops</span>
                            <TrendingUp size={16} className="text-blue-500" />
                        </div>
                        <div className="space-y-3 xs:space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-3 xs:gap-4 group">
                                    <div className="w-8 h-8 xs:w-10 xs:h-10 bg-slate-50 border border-slate-100 rounded-lg xs:rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="h-2 w-20 xs:w-24 bg-slate-100 rounded-full mb-2" />
                                        <div className="h-1.5 w-12 xs:w-16 bg-slate-50 rounded-full" />
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MechanicDashboard;
