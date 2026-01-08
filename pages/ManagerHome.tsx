
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowRight, 
  Activity, 
  RefreshCw, 
  ScrollText, 
  History,
  ShieldCheck,
  Zap
} from 'lucide-react';

const ManagerHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] py-6 md:py-12 px-4">
      <div className="text-center mb-10 md:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-emerald-100/50 text-emerald-700 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4 md:mb-6 border border-emerald-200 backdrop-blur-sm">
          <Zap className="w-3 md:w-3.5 h-3 md:h-3.5 text-amber-500 animate-pulse" /> System Live & Secure
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-blue-950 mb-3 tracking-tighter uppercase leading-none break-words">
          Welcome, <span className="text-emerald-600">Sharath</span>
        </h1>
        <p className="text-slate-400 font-bold text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase mt-2 md:mt-4 italic">Operational Command Terminal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full max-w-5xl">
        {/* New Contract Card */}
        <button 
          onClick={() => navigate('/new-contract')}
          className="group relative bg-white border border-slate-200 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-xl hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 text-left overflow-hidden active:scale-[0.97] jump-on-hover"
        >
          <div className="absolute top-0 right-0 p-4 md:p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 group-hover:rotate-12 group-hover:scale-110 hidden sm:block">
            <ScrollText className="w-32 md:w-48 h-32 md:h-48 text-emerald-600" />
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-[1.25rem] md:rounded-[1.75rem] flex items-center justify-center mb-6 md:mb-8 shadow-lg shadow-emerald-500/30 transition-transform duration-500 group-hover:rotate-6 jump-target">
              <PlusCircle className="w-8 md:w-10 h-8 md:h-10 icon-glow-emerald" />
            </div>
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
               <h2 className="text-2xl md:text-4xl font-black text-blue-950 uppercase tracking-tighter">New Contract</h2>
               <div className="p-1.5 md:p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                 <ScrollText className="w-4 md:w-6 h-4 md:h-6" />
               </div>
            </div>
            <p className="text-slate-500 font-bold text-xs md:text-base uppercase tracking-tight leading-relaxed max-w-[280px]">
              New Client Deal. Gear allocation and pricing settlement.
            </p>
            <div className="mt-8 md:mt-12 flex items-center gap-2 md:gap-3 text-emerald-600 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all">
              Launch <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
            </div>
          </div>
        </button>

        {/* Update Order Card */}
        <button 
          onClick={() => navigate('/add-to-contract')}
          className="group relative bg-white border border-slate-200 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 text-left overflow-hidden active:scale-[0.97] jump-on-hover"
        >
          <div className="absolute top-0 right-0 p-4 md:p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 group-hover:-rotate-12 group-hover:scale-110 hidden sm:block">
            <History className="w-32 md:w-48 h-32 md:h-48 text-blue-600" />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-700 text-white rounded-[1.25rem] md:rounded-[1.75rem] flex items-center justify-center mb-6 md:mb-8 shadow-lg shadow-blue-500/30 transition-transform duration-500 group-hover:-rotate-6 jump-target">
              <RefreshCw className="w-8 md:w-10 h-8 md:h-10 icon-glow-blue" />
            </div>
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <h2 className="text-2xl md:text-4xl font-black text-blue-950 uppercase tracking-tighter">Update Order</h2>
              <div className="p-1.5 md:p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                 <History className="w-4 md:w-6 h-4 md:h-6" />
               </div>
            </div>
            <p className="text-slate-500 font-bold text-xs md:text-base uppercase tracking-tight leading-relaxed max-w-[280px]">
              Sub-rental / Vendor inward inventory modification.
            </p>
            <div className="mt-8 md:mt-12 flex items-center gap-2 md:gap-3 text-blue-600 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all">
              Update <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
            </div>
          </div>
        </button>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-12 md:mt-20 flex flex-wrap justify-center gap-6 md:gap-12 animate-in fade-in duration-1000">
        <div className="flex flex-col items-center">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Active</span>
          <span className="text-xl md:text-2xl font-black text-blue-950 font-mono">142</span>
        </div>
        <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sessions</span>
          <span className="text-xl md:text-2xl font-black text-blue-950 font-mono">18</span>
        </div>
        <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Auth Level</span>
          <div className="flex items-center gap-1.5 md:gap-2">
            <ShieldCheck className="w-3.5 md:w-4 h-3.5 md:h-4 text-emerald-600" />
            <span className="text-xl md:text-2xl font-black text-emerald-600">MG-01</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;
