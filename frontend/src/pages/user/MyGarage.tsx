import React, { useState, useEffect } from 'react';
import { getVehicles, addVehicle } from '../../services/vehicleService';
import { Car, Bike, Truck, Plus, FileText, Upload, Trash2, ShieldCheck } from 'lucide-react';

interface Vehicle {
  _id: string;
  type: 'CAR' | 'BIKE' | 'TRUCK';
  make: string;
  model: string;
  documents: { name: string; url: string }[];
}

const MyGarage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [type, setType] = useState<'CAR' | 'BIKE' | 'TRUCK'>('CAR');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await getVehicles();
      setVehicles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch Vehicles Error:', error);
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type', type);
    formData.append('make', make);
    formData.append('model', model);
    files.forEach(file => formData.append('documents', file));

    try {
      await addVehicle(formData);
      setIsAdding(false);
      setMake('');
      setModel('');
      setFiles([]);
      fetchVehicles();
    } catch (error) {
      console.error('Add Vehicle Error:', error);
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'CAR': return <Car className="w-8 h-8 text-blue-400" />;
      case 'BIKE': return <Bike className="w-8 h-8 text-amber-400" />;
      case 'TRUCK': return <Truck className="w-8 h-8 text-emerald-400" />;
      default: return <Car className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Vehicle Vault</h1>
            <p className="text-slate-400 mt-2 tracking-widest uppercase text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" /> Secure Document Storage
            </p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold transition-all active:scale-95 shadow-xl shadow-blue-900/40 uppercase tracking-widest text-xs"
          >
            <Plus className="w-5 h-5" /> {isAdding ? 'Cancel Mission' : 'Deploy New Vehicle'}
          </button>
        </div>

        {/* Add Vehicle Form */}
        {isAdding && (
          <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 p-8 rounded-[3rem] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 block">Sector / Category</label>
                  <div className="flex gap-4">
                    {['CAR', 'BIKE', 'TRUCK'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t as any)}
                        className={`flex-1 py-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                          type === t ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {t === 'CAR' ? <Car className="w-6 h-6" /> : t === 'BIKE' ? <Bike className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
                        <span className="text-[10px] font-bold tracking-widest">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 block">Manufacturer</label>
                    <input 
                      type="text" value={make} onChange={(e) => setMake(e.target.value)}
                      placeholder="e.g. TESLA" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2 block">Model Designation</label>
                    <input 
                      type="text" value={model} onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. MODEL S" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 block">Document Intel (RC, Insurance, PUC)</label>
                  <div className="relative group">
                    <input 
                      type="file" multiple onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 transition-all group-hover:border-blue-500/50 group-hover:bg-blue-500/5">
                      <Upload className="w-10 h-10 text-slate-700 group-hover:text-blue-500 transition-colors" />
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Upload Clearance Docs</p>
                      {files.length > 0 && <p className="text-emerald-500 text-[10px] font-mono">{files.length} payloads loaded</p>}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-100 text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl shadow-white/5 active:scale-95"
                >
                  Authorize Entry
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vehicle List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             [1,2,3].map(i => <div key={i} className="h-64 bg-slate-900 border border-slate-800 rounded-[3rem] animate-pulse"></div>)
          ) : vehicles.length === 0 ? (
            <div className="col-span-full py-24 text-center space-y-4">
               <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto border border-slate-800 opacity-20">
                 <Car className="w-10 h-10" />
               </div>
               <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">No assets registered in the vault</p>
            </div>
          ) : (
            vehicles.map((v) => (
              <div key={v._id} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[3rem] hover:border-blue-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  {getVehicleIcon(v.type)}
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                     {getVehicleIcon(v.type)}
                   </div>
                   <div>
                     <h3 className="text-white font-black italic uppercase tracking-tighter text-xl">{v.make}</h3>
                     <p className="text-blue-500 font-mono text-[10px] uppercase font-bold">{v.model}</p>
                   </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Encrypted Documents</p>
                  {v.documents.map((doc, i) => (
                    <a 
                      key={i} 
                      href={doc.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all text-xs text-slate-400 hover:text-white"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-600" />
                        <span className="truncate max-w-[140px]">{doc.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-700">EXT://DOC</span>
                    </a>
                  ))}
                  {v.documents.length === 0 && <p className="text-[10px] text-slate-800 italic">No files attached</p>}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  </div>
                  <button className="text-slate-700 hover:text-red-500 transition-colors p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGarage;
