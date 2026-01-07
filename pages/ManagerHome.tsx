
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileEdit, ArrowRight, Activity, Calendar, Package } from 'lucide-react';

const ManagerHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-200">
          <Activity className="w-3 h-3" /> System Live
        </div>
        <h1 className="text-5xl font-black text-blue-950 mb-3 tracking-tighter uppercase">Welcome, Sharath</h1>
        <p className="text-slate-500 font-medium text-lg tracking-tight uppercase">Operational Command & Daily Rental Workflow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <button 
          onClick={() => navigate('/new-contract')}
          className="group relative bg-white border border-slate-200 p-10 rounded-3xl shadow-sm hover:border-blue-950 hover:shadow-2xl transition-all duration-300 text-left overflow-hidden active:scale-[0.98]"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-950 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter mb-2">New Contract</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wide leading-relaxed">Initiate a fresh agreement. Automatic inventory allocation and pricing.</p>
            <div className="mt-10 flex items-center gap-2 text-blue-950 font-black text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
              Start Agreement <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Calendar className="w-40 h-40 text-blue-950" />
          </div>
        </button>

        <button 
          onClick={() => navigate('/add-to-contract')}
          className="group relative bg-white border border-slate-200 p-10 rounded-3xl shadow-sm hover:border-blue-950 hover:shadow-2xl transition-all duration-300 text-left overflow-hidden active:scale-[0.98]"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-emerald-500 text-blue-950 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <FileEdit className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter mb-2">Update Order</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wide leading-relaxed">Modify an existing contract. Add equipment or change rental periods.</p>
            <div className="mt-10 flex items-center gap-2 text-blue-950 font-black text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
              Modify Active <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Package className="w-40 h-40 text-blue-950" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ManagerHome;
