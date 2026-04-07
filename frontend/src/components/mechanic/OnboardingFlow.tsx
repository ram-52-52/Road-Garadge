import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, MapPin, Wrench, Camera, ShieldCheck,
  ChevronLeft, ArrowRight, CheckCircle2, Upload, X, Plus
} from 'lucide-react';
import LocationPicker from '../LocationPicker';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useAuthStore } from '../../store/authStore';
import axiosInstance from '../../helper/apiFunction';
import { END_POINTS } from '../../constants/apiConstants';

const STEPS = [
  { id: 1, title: 'Business Identity', icon: Building2, desc: 'Garage Name & Owner Details' },
  { id: 2, title: 'Geo-Spatial Anchor', icon: MapPin, desc: 'High-Precision Location Pin' },
  { id: 3, title: 'Service Catalog', icon: Wrench, desc: 'Repair Capabilities Checklist' },
  { id: 4, title: 'Facility Gallery', icon: Camera, desc: 'Workshop Visual Verification' },
  { id: 5, title: 'KYC Clearance', icon: ShieldCheck, desc: 'Identity & Registration Docs' },
];

const SERVICE_OPTIONS = [
  'Tyre Puncture', 'Battery Jump Start', 'Engine Failure',
  'Fuel Delivery', 'Towing', 'Brake Repair',
  'AC Repair', 'Oil Change', 'General Service'
];

const OnboardingFlow = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const { currentStep, data, setStep, updateData, reset } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = () => { setError(null); setStep(Math.min(currentStep + 1, 5)); };
  const prevStep = () => { setError(null); setStep(Math.max(currentStep - 1, 1)); };

  const toggleService = (s: string) => {
    const updated = data.services.includes(s)
      ? data.services.filter(x => x !== s)
      : [...data.services, s];
    updateData({ services: updated });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateData({ photos: [...data.photos, ...Array.from(e.target.files)].slice(0, 5) });
    }
  };

  const handleFinalSubmit = async () => {
    if (!data.location) { setError('Please set your garage location in Step 2.'); return; }
    if (data.services.length === 0) { setError('Please select at least one service.'); return; }

    setIsSubmitting(true);
    try {
      // 1. Create the garage
      const garageRes = await axiosInstance.post(END_POINTS.GARAGE.BASE, {
        name: data.name,
        address: data.location.address,
        location: { type: 'Point', coordinates: data.location.coordinates, address: data.location.address },
        services: data.services
      });

      if (garageRes.data.success) {
        // 2. Mark onboarding complete on user
        const meRes = await axiosInstance.get(END_POINTS.AUTH.ME);
        if (meRes.data.success) updateUser(meRes.data.data);

        reset();
        onComplete(garageRes.data.data);
        navigate('/mechanic/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed. Check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return data.name.trim().length > 2 && data.phone.length >= 10;
    if (currentStep === 2) return data.location !== null;
    if (currentStep === 3) return data.services.length > 0;
    return true;
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col">
      {/* Sticky Progress HUD */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 xs:px-6 py-4 xs:py-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 xs:gap-4 mb-4 xs:mb-6">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Step {currentStep} <span className="text-slate-300 mx-1">/</span> {STEPS.length}
            </span>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 xs:w-12 xs:h-12 bg-blue-600 rounded-xl xs:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
                {(() => {
                    const StepIcon = STEPS[currentStep - 1].icon;
                    return <StepIcon size={24} />;
                })()}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg xs:text-xl font-black text-slate-950 tracking-tighter uppercase truncate leading-none mb-1">
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="text-[9px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                {STEPS[currentStep - 1].desc}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Step Content */}
      <main className="flex-1 px-4 xs:px-6 py-6 xs:py-8 max-w-lg mx-auto w-full">
        {/* STEP 1: Business Info */}
        {currentStep === 1 && (
          <div className="space-y-6 xs:space-y-8 animate-in fade-in duration-500">
            <div className="group space-y-2">
              <label className="text-[9px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest block group-focus-within:text-blue-500 transition-colors">Official Garage Identity *</label>
              <input 
                value={data.name} 
                onChange={e => updateData({ name: e.target.value })}
                className="w-full h-14 xs:h-16 px-4 xs:px-5 bg-white border-2 border-slate-100 rounded-xl xs:rounded-2xl text-slate-950 font-black focus:outline-none focus:border-blue-500 transition-all text-sm xs:text-base uppercase placeholder:text-slate-300"
                placeholder="e.g. Surat Rescue Zone" 
              />
            </div>
            <div className="group space-y-2">
              <label className="text-[9px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest block group-focus-within:text-blue-500 transition-colors">Owner Call-sign</label>
              <input 
                value={data.ownerName} 
                onChange={e => updateData({ ownerName: e.target.value })}
                className="w-full h-14 xs:h-16 px-4 xs:px-5 bg-white border-2 border-slate-100 rounded-xl xs:rounded-2xl text-slate-950 font-black focus:outline-none focus:border-blue-500 transition-all text-sm xs:text-base uppercase placeholder:text-slate-300"
                placeholder="e.g. Ramesh Patel" 
              />
            </div>
            <div className="group space-y-2">
              <label className="text-[9px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest block group-focus-within:text-blue-500 transition-colors">Verified Handshake # *</label>
              <input 
                value={data.phone} 
                onChange={e => updateData({ phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                type="tel" 
                className="w-full h-14 xs:h-16 px-4 xs:px-5 bg-white border-2 border-slate-100 rounded-xl xs:rounded-2xl text-slate-950 font-black focus:outline-none focus:border-blue-500 transition-all text-sm xs:text-base tracking-widest placeholder:text-slate-300"
                placeholder="9876543210" 
              />
            </div>
          </div>
        )}

        {/* STEP 2: Location */}
        {currentStep === 2 && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <p className="text-xs font-bold text-blue-700">📍 Enable GPS for automatic address detection. This pin defines where mechanics receive job alerts!</p>
            </div>
            <LocationPicker onLocationChange={(loc) => updateData({ location: loc as any })} />
            {data.location && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <p className="text-xs font-bold text-emerald-700">{data.location.address}</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Services */}
        {currentStep === 3 && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <p className="text-xs xs:text-sm font-medium text-slate-500">Initialize your strategic repair capabilities:</p>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
              {SERVICE_OPTIONS.map(service => {
                const selected = data.services.includes(service);
                return (
                  <button key={service} onClick={() => toggleService(service)}
                    className={`h-14 xs:h-16 rounded-xl xs:rounded-2xl px-4 text-[9px] xs:text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center justify-between gap-3 ${selected ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-300'}`}
                  >
                    <span className="truncate">{service}</span>
                    {selected && <CheckCircle2 size={14} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
            {data.services.length > 0 && (
              <p className="text-[10px] font-black text-blue-600 text-center uppercase tracking-widest">{data.services.length} Capabilities Verified</p>
            )}
          </div>
        )}

        {/* STEP 4: Gallery */}
        {currentStep === 4 && (
          <div className="animate-in fade-in duration-500 space-y-4">
            <p className="text-sm font-medium text-slate-500">Upload up to 5 photos of your workshop facility:</p>
            <label className="flex flex-col items-center justify-center w-full h-40 bg-white border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-400 transition-colors group">
              <Camera size={32} className="text-slate-300 group-hover:text-blue-400 mb-2 transition-colors" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Tap to upload photos</span>
              <input type="file" className="hidden" multiple accept="image/*" onChange={handlePhotoUpload} />
            </label>
            {data.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {data.photos.map((file, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => updateData({ photos: data.photos.filter((_, idx) => idx !== i) })}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {data.photos.length < 5 && (
                  <label className="aspect-square rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                    <Plus size={20} className="text-slate-300" />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: KYC */}
        {currentStep === 5 && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <p className="text-xs font-bold text-amber-700">⚠️ Documents are reviewed by our Admin team within 24 hours. Your garage will go live after verification.</p>
            </div>
            {[
              { key: 'kycAadhar', label: 'Aadhar Card / Government ID', icon: '🪪' },
              { key: 'kycShopAct', label: 'Shop Act / Business Registration', icon: '🏪' }
            ].map(({ key, label, icon }) => (
              <div key={key}>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{icon} {label}</label>
                <label className={`flex items-center justify-between w-full h-16 px-5 rounded-2xl border-2 cursor-pointer transition-all ${(data as any)[key] ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-dashed border-slate-200 hover:border-blue-400'}`}>
                  <div className="flex items-center gap-3">
                    {(data as any)[key] ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Upload size={18} className="text-slate-400" />}
                    <span className="text-xs font-bold text-slate-600">
                      {(data as any)[key] ? ((data as any)[key] as File).name : 'Click to upload (PDF/Image)'}
                    </span>
                  </div>
                  <input type="file" className="hidden" accept=".pdf,image/*" onChange={e => {
                    if (e.target.files?.[0]) updateData({ [key]: e.target.files[0] } as any);
                  }} />
                </label>
              </div>
            ))}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">{error}</div>
            )}
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 xs:p-6 flex gap-3 xs:gap-4 max-w-lg mx-auto w-full z-30">
        {currentStep > 1 && (
          <button onClick={prevStep} className="w-12 h-12 xs:w-16 xs:h-16 bg-slate-50 rounded-xl xs:rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-100 border border-slate-100 transition-all active:scale-95 shrink-0">
            <ChevronLeft size={24} />
          </button>
        )}
        <button
          onClick={currentStep === 5 ? handleFinalSubmit : nextStep}
          disabled={!canProceed() || isSubmitting}
          className="flex-1 h-12 xs:h-16 bg-blue-600 text-white rounded-xl xs:rounded-2xl font-black uppercase tracking-[0.2em] xs:tracking-widest text-[10px] xs:text-xs flex items-center justify-center gap-2 xs:gap-3 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
        >
          {isSubmitting ? 'Syncing...' : currentStep === 5 ? 'Launch Mission' : (
            <>Proceed Step <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
          )}
        </button>
      </footer>
    </div>
  );
};

export default OnboardingFlow;
