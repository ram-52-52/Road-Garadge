import { 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight,
  Activity,
  Zap,
  Globe
} from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, color, trend, bgGradient }: any) => (
  <div className="group relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-slate-100/60 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2">
    {/* Animated Background Accent */}
    <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full ${bgGradient} opacity-5 group-hover:scale-150 transition-transform duration-700`} />
    
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-8">
        <div className={`p-4 rounded-2xl ${color} text-white shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <div className="flex items-center text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
          <ArrowUpRight size={14} className="mr-1" strokeWidth={3} />
          {trend}
        </div>
      </div>
      
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-2">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">{value}</h3>
      </div>
      
      {/* Decorative Progress Simulation */}
      <div className="mt-8 h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
        <div className={`h-full ${color.replace('text-white', '')} w-2/3 rounded-full opacity-30 group-hover:w-full transition-all duration-1000`} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
             <Zap size={14} className="fill-blue-600" />
             <span className="text-[10px] font-black uppercase tracking-widest">Real-time Insights</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Marketplace Hub</h1>
          <p className="text-slate-500 font-medium italic italic italic">The pulse of GarageNow ecosystem operations.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-400">
                  {i}
                </div>
              ))}
           </div>
           <div className="h-8 w-[1px] bg-slate-100" />
           <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Support</p>
              <p className="text-sm font-black text-slate-900 italic">4 Active Agents</p>
           </div>
        </div>
      </div>

      {/* Primary KPI Ecosystem */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <KPICard 
          title="Total GMV" 
          value="₹ 1.25L" 
          icon={TrendingUp} 
          color="bg-slate-900" 
          bgGradient="bg-slate-900" 
          trend="+12.5%" 
        />
        <KPICard 
          title="Live Requests" 
          value="12" 
          icon={Activity} 
          color="bg-blue-600" 
          bgGradient="bg-blue-600" 
          trend="+8%" 
        />
        <KPICard 
          title="Supply Core" 
          value="45" 
          icon={ShieldCheck} 
          color="bg-emerald-500" 
          bgGradient="bg-emerald-500" 
          trend="+5%" 
        />
        <KPICard 
          title="Market Reach" 
          value="03" 
          icon={Globe} 
          color="bg-violet-600" 
          bgGradient="bg-violet-600" 
          trend="0%" 
        />
      </div>

      {/* Advanced Visualization Placeholder */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 relative h-[480px] bg-slate-900 rounded-[3rem] overflow-hidden group shadow-2xl shadow-indigo-900/20">
           {/* Abstract Chart Simulation */}
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-6">
                 <Globe size={80} className="mx-auto text-blue-500/20 animate-[spin_20s_linear_infinite]" />
                 <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter italic">Ecosystem Mapping</h3>
                    <p className="text-white/30 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">Geo-Spatial Optimization Active</p>
                 </div>
              </div>
           </div>
           
           {/* Floating Legend */}
           <div className="absolute bottom-10 left-10 right-10 flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 h-32 bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:bg-white/10 transition duration-500">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 mb-3 italic font-black text-xs">0{i}</div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full" />
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
             <Activity className="text-blue-600" />
             Operational Feed
          </h3>
          <div className="space-y-8">
            {[
               { t: 'New Garage Registered', s: 'Racer Hub', c: 'bg-blue-100' },
               { t: 'SOS Request Dispatched', s: 'Sector 12', c: 'bg-rose-100' },
               { t: 'Payment Verified', s: '₹140.00', c: 'bg-emerald-100' },
               { t: 'KYC Document Updated', s: 'Apex Motors', c: 'bg-amber-100' },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 items-start group">
                <div className={`w-12 h-12 rounded-2xl ${item.c} flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-500`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-black text-slate-800 tracking-tight">{item.t}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.s}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-12 py-4 bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-100 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">
             View Protocol History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
