import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Wrench, ChevronRight, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import axiosInstance from '../../helper/apiFunction';
import { END_POINTS } from '../../constants/apiConstants';

/**
 * SELECT ROLE: High-Fidelity Identity Initializer
 * Glassmorphism UI for post-auth role selection.
 */
const SelectRole = () => {
    const navigate = useNavigate();
    const { updateUser } = useAuthStore();
    const [name, setName] = useState('');
    const [selectedRole, setSelectedRole] = useState<'DRIVER' | 'GARAGE_OWNER' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFinalize = async () => {
        if (!name || !selectedRole) return;
        setIsLoading(true);

        try {
            const response = await axiosInstance.post(END_POINTS.AUTH.COMPLETE_PROFILE, {
                name,
                role: selectedRole
            });

            if (response.data.success) {
                updateUser(response.data.data);
                
                // Tactical Redirection logic
                if (selectedRole === 'DRIVER') {
                    navigate('/driver/home');
                } else {
                    navigate('/mechanic/onboarding');
                }
            }
        } catch (error) {
            console.error('Identity Finalization Failure:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-4 xs:p-6 relative overflow-hidden selection:bg-blue-500/30">
            {/* Immersive Background Glow */}
            <div className="absolute top-1/4 left-1/4 w-[300px] xs:w-[500px] h-[300px] xs:h-[500px] bg-blue-600/10 rounded-full blur-[80px] xs:blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] xs:w-[500px] h-[300px] xs:h-[500px] bg-indigo-600/10 rounded-full blur-[80px] xs:blur-[120px] animate-pulse delay-700" />

            <div className="w-full max-w-md space-y-8 xs:space-y-10 relative z-10">
                <div className="text-center space-y-3 xs:space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 xs:w-16 xs:h-16 bg-blue-600 rounded-xl xs:rounded-[1.25rem] shadow-2xl shadow-blue-600/40 mb-2 xs:mb-4 animate-bounce">
                        <Zap size={24} fill="white" className="text-white" />
                    </div>
                    <h1 className="text-2xl xs:text-4xl font-black text-white tracking-tighter italic uppercase leading-none">Initialize Identity</h1>
                    <p className="text-slate-500 text-[8px] xs:text-[10px] font-black uppercase tracking-[0.2em] xs:tracking-[0.3em]">Configure your platform persona</p>
                </div>

                <div className="space-y-6">
                    {/* Name Input Logic */}
                    <div className="group space-y-2">
                        <label className="text-[8px] xs:text-[10px] font-black text-slate-500 uppercase tracking-widest block group-focus-within:text-blue-500 transition-colors">Tactical Call-sign (Name)</label>
                        <div className="relative">
                            <div className="absolute left-4 xs:left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                <User size={18} />
                            </div>
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Identify..."
                                className="w-full h-14 xs:h-16 bg-white/5 border border-white/10 rounded-2xl xs:rounded-3xl pl-12 xs:pl-14 pr-4 xs:pr-6 text-white font-black placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm xs:text-base uppercase"
                            />
                        </div>
                    </div>

                    {/* Role Selection Grid */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                        <button 
                            onClick={() => setSelectedRole('DRIVER')}
                            className={`flex flex-col items-center justify-center p-4 xs:p-6 rounded-2xl xs:rounded-3xl border-2 transition-all duration-500 group ${selectedRole === 'DRIVER' ? 'bg-blue-600/10 border-blue-600 shadow-2xl shadow-blue-600/20 text-blue-500' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                        >
                            <div className={`p-3 xs:p-4 rounded-xl xs:rounded-2xl mb-3 xs:mb-4 transition-all duration-500 ${selectedRole === 'DRIVER' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                                <User size={24} />
                            </div>
                            <span className={`text-[8px] xs:text-[10px] font-black uppercase tracking-widest leading-none ${selectedRole === 'DRIVER' ? 'text-white' : 'text-slate-500'}`}>Rescue Driver</span>
                        </button>

                        <button 
                            onClick={() => setSelectedRole('GARAGE_OWNER')}
                            className={`flex flex-col items-center justify-center p-4 xs:p-6 rounded-2xl xs:rounded-3xl border-2 transition-all duration-500 group ${selectedRole === 'GARAGE_OWNER' ? 'bg-indigo-600/10 border-indigo-600 shadow-2xl shadow-indigo-600/20 text-indigo-500' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                        >
                            <div className={`p-3 xs:p-4 rounded-xl xs:rounded-2xl mb-3 xs:mb-4 transition-all duration-500 ${selectedRole === 'GARAGE_OWNER' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                                <Wrench size={24} />
                            </div>
                            <span className={`text-[8px] xs:text-[10px] font-black uppercase tracking-widest leading-none ${selectedRole === 'GARAGE_OWNER' ? 'text-white' : 'text-slate-500'}`}>Service Partner</span>
                        </button>
                    </div>

                    <button 
                        onClick={handleFinalize}
                        disabled={!name || !selectedRole || isLoading}
                        className="w-full h-14 xs:h-18 bg-blue-600 text-white rounded-2xl xs:rounded-3xl font-black uppercase tracking-[0.2em] xs:tracking-widest text-[10px] xs:text-xs flex items-center justify-center gap-2 xs:gap-3 shadow-2xl shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group shrink-0"
                    >
                        {isLoading ? 'Establishing Link...' : 'Finalize Identity'}
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Identity Artifacts Secured via SSL</span>
                </div>
            </div>
        </div>
    );
};

export default SelectRole;
