import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  LogOut,
  Award,
  Star,
  ArrowLeft,
  X,
  Trash2,
  Edit2,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { MECHANIC_ROUTES } from '../../constants/navigationConstant';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getMyGarage, updateGarageProfile, deleteGarageProfile } from '../../api/garageAPI';

const SERVICE_OPTIONS = [
  'Tyre Puncture', 'Battery Jump Start', 'Engine Failure',
  'Fuel Delivery', 'Towing', 'Brake Repair',
  'AC Repair', 'Oil Change', 'General Service'
];

const MechanicProfile = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [garage, setGarage] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [editData, setEditData] = useState({
        name: '',
        address: '',
        location: null as any,
        services: [] as string[]
    });

    // Address Autocomplete State
    const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
    const [isSearchingAddress, setIsSearchingAddress] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const searchAddress = async (query: string) => {
        if (query.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        setIsSearchingAddress(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`);
            const data = await response.json();
            setAddressSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Address Search Failure:", error);
        } finally {
            setIsSearchingAddress(false);
        }
    };

    useEffect(() => {
        fetchGarage();
    }, []);

    const fetchGarage = async () => {
        try {
            const res = await getMyGarage();
            const data = res.data.data;
            setGarage(data);
            
            // Normalize: API returns objects {service_type,...} OR plain strings
            const rawServices = (data.services || []).map((s: any) => 
                typeof s === 'string' ? s : (s.service_type || s.name || '')
            ).filter(Boolean);

            // De-duplicate AND validate: only keep services that match our canonical SERVICE_OPTIONS list
            // This eliminates stale legacy data (e.g. "Flat Tire" vs "Tyre Puncture") from older DB entries
            const seen = new Set<string>();
            const normalizedServices: string[] = [];
            for (const raw of rawServices) {
                // Find matching canonical option (case-insensitive)
                const match = SERVICE_OPTIONS.find(
                    opt => opt.toLowerCase() === raw.toLowerCase()
                );
                const canonical = match || raw;
                if (match && !seen.has(canonical)) {
                    seen.add(canonical);
                    normalizedServices.push(canonical);
                }
            }

            setEditData({
                name: data.name,
                address: data.address,
                location: data.location,
                services: normalizedServices
            });
        } catch (error) {
            console.error("Identity Fetch Failure:", error);
        }
    };

    const toggleService = (s: string) => {
        const updated = editData.services.includes(s)
            ? editData.services.filter(x => x !== s)
            : [...editData.services, s];
        setEditData({ ...editData, services: updated });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleUpdate = async () => {
        const t = toast.loading("Transmitting operational updates...");
        setLoading(true);
        try {
            await updateGarageProfile(editData);
            await fetchGarage();
            setIsEditModalOpen(false);
            toast.success("Identity profile updated.", { id: t });
        } catch (error) {
            toast.error("Update Protocol Rejected", { id: t });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("CRITICAL: Decommissioning will erase your operational node. Proceed?")) return;
        const t = toast.loading("Decommissioning hub...");
        setLoading(true);
        try {
            await deleteGarageProfile();
            toast.success("Mission Terminated. Account Reset.", { id: t });
            logout();
            navigate('/login');
        } catch (error) {
            toast.error("Decommission Fail", { id: t });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full bg-slate-50 p-3 xs:p-8 space-y-6 xs:space-y-12 animate-in fade-in duration-1000">
            {/* Identity Header HUD */}
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 xs:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[7px] xs:text-[9px] font-black uppercase tracking-[0.2em] xs:tracking-[0.4em] text-white/60">
                        Verified Partner Identity
                    </div>
                    <h2 className="text-lg xs:text-3xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">Partner Profile</h2>
                </div>
                <button 
                    onClick={() => navigate(MECHANIC_ROUTES.DASHBOARD)} 
                    className="w-10 h-10 xs:w-16 xs:h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-950 transition group shadow-sm active:scale-90"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-12">
                {/* Tactical Bio Card */}
                <div className="lg:col-span-2 bg-white p-6 xs:p-12 rounded-[2rem] xs:rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
                    <div className="relative z-10 flex flex-col xs:flex-row items-center gap-6 xs:gap-10 pb-8 xs:pb-12 border-b border-slate-50">
                        <div className="w-16 h-16 xs:w-24 xs:h-24 bg-slate-950 rounded-2xl xs:rounded-[2.5rem] flex items-center justify-center text-white italic font-black text-xl xs:text-3xl shadow-2xl shrink-0">
                             {user?.name?.charAt(0) || 'M'}
                        </div>
                         <div className="space-y-1 xs:space-y-2 min-w-0 flex-1 text-center xs:text-left">
                              <h3 className="text-base xs:text-3xl font-black text-slate-950 italic tracking-tighter uppercase truncate">{user?.name || 'Partner Node'}</h3>
                              <div className="flex items-center justify-center xs:justify-start gap-1.5 xs:gap-2.5 px-2 xs:px-4 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 w-fit mx-auto xs:mx-0">
                                  <Star size={10} className="fill-emerald-500" />
                                  <span className="text-[6px] xs:text-[10px] font-black uppercase tracking-widest italic leading-none">4.9 Performance</span>
                              </div>
                         </div>
                    </div>

                    <div className="space-y-4 xs:space-y-6 relative z-10 mt-8">
                        {[
                            { icon: Mail, label: 'Digital Handle', value: user?.email || 'N/A' },
                            { icon: Phone, label: 'Comms Link', value: user?.phone || 'Not Shared' },
                            { 
                                icon: MapPin, 
                                label: 'Sector Assignment', 
                                value: garage?.address || 'Detecting...',
                                action: () => setIsEditModalOpen(true)
                            },
                        ].map((item) => (
                            <div 
                                key={item.label} 
                                onClick={item.action}
                                className={`group flex items-center justify-between p-4 xs:p-6 bg-slate-50/50 rounded-2xl xs:rounded-3xl border border-slate-100/50 transition duration-500 hover:bg-slate-100 active:scale-[0.98] ${item.action ? 'cursor-pointer' : ''}`}
                            >
                                <div className="flex items-center gap-4 xs:gap-6">
                                    <div className="w-10 h-10 xs:w-14 xs:h-14 bg-white rounded-xl xs:rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">
                                        <item.icon size={20} />
                                    </div>
                                    <div className="text-left w-full max-w-[180px] xs:max-w-xs">
                                        <p className="text-[7px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-xs xs:text-base font-black text-slate-950 tracking-tight italic uppercase truncate">{item.value}</p>
                                    </div>
                                </div>
                                {item.action ? <Edit2 size={16} className="text-blue-500" /> : <ChevronRight size={16} className="text-slate-300" />}
                            </div>
                        ))}
                    </div>

                    {/* Operational Skillset Portfolio */}
                    <div className="mt-8 xs:mt-12 space-y-4 xs:space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h4 className="text-[8px] xs:text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Operational Portfolio</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 xs:gap-3 px-2">
                            {editData.services.length > 0 ? (
                                editData.services.map((s: string, idx: number) => (
                                    <div key={`skill-${s}-${idx}`} className="px-3 py-1.5 xs:px-5 xs:py-2.5 bg-blue-50 border border-blue-100 rounded-xl xs:rounded-2xl flex items-center gap-2 xs:gap-3 shadow-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span className="text-[7px] xs:text-[9px] font-black text-slate-950 uppercase tracking-widest whitespace-nowrap italic">{s}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-[8px] xs:text-[11px] font-black text-slate-400 italic px-2">No operational skills verified for this node.</div>
                            )}
                        </div>
                    </div>
                </div>

                 {/* Performance Analytics Sidebar */}
                <div className="space-y-6 xs:space-y-8">
                      <div className="bg-slate-950 p-6 xs:p-12 rounded-[2rem] xs:rounded-[4rem] text-white overflow-hidden relative shadow-2xl group">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent opacity-50" />
                         <div className="relative z-10 space-y-4 xs:space-y-8">
                             <Award size={36} className="text-blue-500 animate-[bounce_3s_ease-in-out_infinite]" />
                             <div className="space-y-1">
                                 <h4 className="text-base xs:text-2xl font-black italic tracking-tighter uppercase">Sector Milestone</h4>
                                 <p className="text-slate-500 text-[9px] xs:text-sm font-medium leading-relaxed italic pr-2 xs:pr-12">"Peak partner node capacity detected. Priority routing active."</p>
                             </div>
                             <div className="flex flex-row items-center gap-4 xs:gap-8 pt-4 border-t border-white/5">
                                 <div className="space-y-0.5">
                                     <p className="text-[7px] xs:text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Node Ranking</p>
                                     <p className="text-base xs:text-2xl font-black text-white italic tracking-tighter uppercase">Top 1%</p>
                                 </div>
                                 <div className="space-y-0.5">
                                     <p className="text-[7px] xs:text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Global Sector</p>
                                     <p className="text-base xs:text-2xl font-black text-white italic tracking-tighter uppercase">Gujarat-01</p>
                                 </div>
                             </div>
                         </div>
                      </div>

                     <div className="bg-white border border-slate-100 p-6 xs:p-10 rounded-[1.5rem] xs:rounded-[3rem] shadow-sm flex items-center gap-5 xs:gap-8 hover:scale-[1.02] transition duration-700 cursor-pointer group">
                        <div className="w-12 h-12 xs:w-16 xs:h-16 bg-blue-50 rounded-xl xs:rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-sm shadow-blue-100 shrink-0">
                             <ShieldCheck size={28} />
                        </div>
                        <div className="text-left">
                             <p className="text-[7px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Integrity</p>
                             <h4 className="text-sm xs:text-xl font-black text-slate-950 italic tracking-tighter uppercase">Master Hub Access</h4>
                        </div>
                     </div>

                     <button 
                        onClick={handleLogout}
                        className="w-full h-14 xs:h-20 bg-rose-600 hover:bg-rose-500 text-white rounded-[1.5rem] xs:rounded-[2.5rem] font-black uppercase tracking-[0.2em] xs:tracking-[0.4em] text-[8px] xs:text-[10px] transition-all flex items-center justify-center gap-3 xs:gap-4 shadow-xl shadow-rose-600/10 active:scale-95"
                    >
                        Decommission Session
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            {/* Operational Edit Modal Overlay */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[200] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 xs:p-8 animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white rounded-[2.5rem] xs:rounded-[3.5rem] p-8 xs:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-100 animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8 xs:mb-10">
                            <div className="space-y-1">
                                <h3 className="text-2xl xs:text-3xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">Modify Node</h3>
                                <p className="text-[8px] xs:text-[10px] font-black text-slate-400 uppercase tracking-widest">Adjust operational presence</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-950 transition">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6 xs:space-y-8 overflow-y-auto custom-scrollbar pr-2 pb-6 flex-1">
                            <div className="space-y-2 xs:space-y-4">
                                <label className="text-[8px] xs:text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Garage Identity</label>
                                <input 
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                    className="w-full h-14 xs:h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl xs:rounded-[2rem] text-sm font-black text-slate-950 focus:outline-none focus:border-blue-500 transition-all font-mono italic"
                                    placeholder="Garage Name"
                                />
                            </div>

                            <div className="space-y-2 xs:space-y-4 relative">
                                <label className="text-[8px] xs:text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Physical Sector Address</label>
                                <div className="relative">
                                    <textarea 
                                        value={editData.address}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setEditData({...editData, address: val});
                                            searchAddress(val);
                                        }}
                                        onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                                        className="w-full h-24 xs:h-32 p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl xs:rounded-[2rem] text-xs font-black text-slate-950 focus:outline-none focus:border-blue-500 transition-all font-mono italic resize-none"
                                        placeholder="Enter full physical address (Gali, Area, etc)..."
                                    />
                                    {isSearchingAddress && (
                                        <div className="absolute top-4 right-4 animate-spin text-blue-500">
                                            <Loader2 size={16} />
                                        </div>
                                    )}
                                </div>

                                {showSuggestions && addressSuggestions.length > 0 && (
                                    <div className="absolute z-[300] top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="p-2 bg-slate-50 border-b border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest px-4">Sector Matches Found</div>
                                        {addressSuggestions.map((s, idx) => (
                                            <button
                                                key={`addr-${idx}`}
                                                type="button"
                                                onClick={() => {
                                                    setEditData({
                                                        ...editData,
                                                        address: s.display_name,
                                                        location: {
                                                            type: 'Point',
                                                            coordinates: [parseFloat(s.lon), parseFloat(s.lat)]
                                                        }
                                                    });
                                                    setShowSuggestions(false);
                                                }}
                                                className="w-full text-left p-4 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-none flex items-start gap-3"
                                            >
                                                <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />
                                                <p className="text-[10px] font-black text-slate-900 leading-tight italic">{s.display_name}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest italic px-2">Selecting a suggestion updates your GPS anchor automatically.</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[8px] xs:text-[10px] font-black text-slate-500 uppercase tracking-widest italic block">Skill Set & Service Portfolio</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SERVICE_OPTIONS.map(service => {
                                        const selected = editData.services.includes(service);
                                        return (
                                            <button 
                                                key={service} 
                                                onClick={() => toggleService(service)}
                                                className={`h-10 xs:h-12 rounded-xl border-2 px-3 text-[7px] xs:text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-between gap-2 ${selected ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-blue-300'}`}
                                            >
                                                <span className="truncate">{service}</span>
                                                {selected && <CheckCircle2 size={12} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                <button 
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="w-full h-14 xs:h-18 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl xs:rounded-[2.5rem] font-black uppercase tracking-widest text-[9px] xs:text-[11px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? 'Transmitting...' : 'Commit Protocol Changes'}
                                    <ShieldCheck size={18} />
                                </button>
                                
                                <button 
                                    onClick={handleDelete}
                                    className="w-full h-12 text-[7px] xs:text-[9px] font-black text-rose-400 hover:text-rose-600 uppercase tracking-[0.3em] transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={14} />
                                    Permanent Decommission Node
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MechanicProfile;
