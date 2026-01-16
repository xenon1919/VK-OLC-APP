
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowRight, 
  RefreshCw, 
  ScrollText, 
  ShieldCheck,
  Zap,
  History,
  Activity
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl">
        {/* New Quotation Card */}
        <button 
          onClick={() => navigate('/new-contract')}
          className="group relative bg-white border border-slate-200 p-8 rounded-[2rem] shadow-xl hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-500 text-left active:scale-[0.97] jump-on-hover"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-[1.25rem] flex items-center justify-center mb-6 shadow-lg jump-target">
              <PlusCircle className="w-8 h-8 icon-glow-emerald" />
            </div>
            <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tighter mb-2">New Quotation</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-tight leading-relaxed">
              Start a fresh deal. Define gear list and first settlement rate.
            </p>
            <div className="mt-8 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">
              Initialize <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Update Quotation Card */}
        <button 
          onClick={() => navigate('/update-quotation')}
          className="group relative bg-white border border-slate-200 p-8 rounded-[2rem] shadow-xl hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500 text-left active:scale-[0.97] jump-on-hover"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-700 text-white rounded-[1.25rem] flex items-center justify-center mb-6 shadow-lg jump-target">
              <RefreshCw className="w-8 h-8 icon-glow-blue" />
            </div>
            <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tighter mb-2">Negotiations</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-tight leading-relaxed">
              Revise pending quotations. Max 3 edits per version.
            </p>
            <div className="mt-8 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">
              Manage Drafts <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* Add to Contract Card (Existing) */}
        <button 
          onClick={() => navigate('/add-to-contract')}
          className="group relative bg-white border border-slate-200 p-8 rounded-[2rem] shadow-xl hover:border-amber-500/50 hover:shadow-2xl transition-all duration-500 text-left active:scale-[0.97] jump-on-hover"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 text-white rounded-[1.25rem] flex items-center justify-center mb-6 shadow-lg jump-target">
              <Activity className="w-8 h-8 icon-glow-amber" />
            </div>
            <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tighter mb-2">Update Orders</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-tight leading-relaxed">
              Append gear to ongoing agreements and operationalize fleet.
            </p>
            <div className="mt-8 flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-[0.2em]">
              Update Live Deals <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>

      <div className="mt-12 md:mt-20 flex flex-wrap justify-center gap-6 md:gap-12 animate-in fade-in duration-1000">
        <div className="flex flex-col items-center">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Active</span>
          <span className="text-xl md:text-2xl font-black text-blue-950 font-mono">142</span>
        </div>
        <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Negotiations</span>
          <span className="text-xl md:text-2xl font-black text-blue-950 font-mono">08</span>
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
