import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../helper/apiFunction';
import { END_POINTS } from '../constants/apiConstants';
import { Loader2, Phone, Key, ShieldCheck, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';

/**
 * UNIFIED OTP AUTHENTICATION HUB
 * Replaces legacy Password-Based Login/Register.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  // Phase Management
  const [authStep, setAuthStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  // Step 1: Request Twilio OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(END_POINTS.AUTH.REQUEST_OTP, { phone });
      if (response.data.success) {
        setAuthStep('OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Handshake failed. Ensure API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP & Identity
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter a valid OTP.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(END_POINTS.AUTH.VERIFY_OTP, { phone, otp });
      
      if (response.data.success) {
        const { token, ...userData } = response.data.data;
        
        login(userData, token);

        // Redirect based on Enterprise Rules
        if (userData.role === null) navigate('/select-role');
        else if (userData.role === 'DRIVER') navigate('/driver/home');
        else if (userData.role === 'GARAGE_OWNER' && !userData.onboarding_complete) navigate('/mechanic/onboarding');
        else if (userData.role === 'GARAGE_OWNER') navigate('/mechanic/dashboard');
        else if (userData.role === 'ADMIN') navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-slate-950 font-sans selection:bg-blue-500/30">
      {/* Decorative Elite Meshes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] px-4 xs:px-6 py-6 xs:py-12 animate-in fade-in zoom-in duration-1000">
        <div className="text-center mb-6 xs:mb-10">
          <div className="inline-flex items-center justify-center p-3 xs:p-4 bg-white/5 backdrop-blur-xl rounded-[1.5rem] xs:rounded-[2rem] border border-white/10 shadow-2xl mb-4 xs:mb-6 shadow-blue-900/20">
             <div className="w-10 h-10 xs:w-12 xs:h-12 bg-blue-600 rounded-xl xs:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 italic font-black text-white text-lg xs:text-xl tracking-tighter">GN</div>
          </div>
          <h1 className="text-2xl xs:text-4xl font-black text-white tracking-tighter italic mb-1 xs:mb-2 uppercase">Platform Access</h1>
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] xs:tracking-[0.3em] text-[8px] xs:text-[10px]">Unified Identity Authentication Hub</p>
        </div>

        <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] xs:rounded-[2.5rem] p-6 xs:p-8 sm:p-10 shadow-2xl overflow-hidden">
             
             {/* Progress HUD */}
             <div className="flex items-center justify-center gap-3 xs:gap-4 mb-8 xs:mb-10">
                 <div className={`w-2.5 h-2.5 xs:w-3 xs:h-3 rounded-full ${authStep === 'PHONE' ? 'bg-blue-500 ring-4 ring-blue-500/20' : 'bg-emerald-500'}`} />
                 <div className={`w-8 xs:w-12 h-0.5 ${authStep === 'OTP' ? 'bg-emerald-500' : 'bg-white/10'}`} />
                 <div className={`w-2.5 h-2.5 xs:w-3 xs:h-3 rounded-full ${authStep === 'OTP' ? 'bg-blue-500 ring-4 ring-blue-500/20' : 'bg-white/10'}`} />
             </div>

            {/* PHASE 1: PHONE */}
            {authStep === 'PHONE' && (
                <form onSubmit={handleRequestOtp} className="space-y-5 xs:space-y-6 animate-in slide-in-from-left duration-500">
                  <div className="space-y-2 xs:space-y-3">
                    <label className="block text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Terminal Phone ID</label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 group-focus-within/input:text-blue-400 transition-colors">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210"
                        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl xs:rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm xs:text-base transition-all"
                      />
                    </div>
                  </div>
                  
                  {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black text-center uppercase tracking-tight">{error}</div>}

                  <button disabled={isLoading} type="submit" className="w-full h-14 xs:h-16 bg-blue-600 hover:bg-blue-500 rounded-xl xs:rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-[10px] xs:text-xs text-white shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Initialize Dispatch <ChevronRight size={16} /></>}
                  </button>
                </form>
            )}

            {/* PHASE 2: OTP */}
            {authStep === 'OTP' && (
                <form onSubmit={handleVerifyOtp} className="space-y-5 xs:space-y-6 animate-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-2">
                     <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                     <p className="text-[8px] xs:text-[10px] font-black text-emerald-400 uppercase tracking-widest">Handshake Dispatched: +91 {phone}</p>
                  </div>

                  <div className="space-y-2 xs:space-y-3">
                    <label className="block text-[8px] xs:text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Identity Verification Protocol</label>
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 group-focus-within/input:text-blue-400 transition-colors">
                        <Key size={18} />
                      </div>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl xs:rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 tracking-[0.4em] xs:tracking-[0.5em] focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-black text-sm xs:text-base text-center transition-all"
                      />
                    </div>
                  </div>

                  {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black text-center uppercase tracking-tight">{error}</div>}

                  <button disabled={isLoading} type="submit" className="w-full h-14 xs:h-16 bg-blue-600 hover:bg-blue-500 rounded-xl xs:rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-[10px] xs:text-xs text-white shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Zap size={16} /> Establish Connection</>}
                  </button>

                  <button onClick={() => setAuthStep('PHONE')} type="button" className="w-full text-center text-[9px] xs:text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] xs:tracking-[0.3em] transition-colors mt-2 italic">
                    Modify Terminal ID
                  </button>
                </form>
            )}

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
               <p className="text-slate-600 text-[9px] xs:text-[10px] font-black uppercase tracking-widest mb-2">New Identity Initialization?</p>
               <button onClick={() => navigate('/register')} className="text-blue-500 hover:text-blue-400 font-black text-[10px] xs:text-xs uppercase tracking-[0.4em] transition-colors italic">Construct Profile</button>
            </div>

        </div>
        
        <div className="mt-10 text-center flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] italic">Enterprise Grade Security Tunnel</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
