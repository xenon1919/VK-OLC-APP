
import React from 'react';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-slate-400 text-sm">/</span>
        <h2 className="text-slate-800 font-semibold text-lg">System Oversight</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-900 leading-none">Super Administrator</span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full mt-1 border border-slate-200 uppercase">Admin Role</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-white ring-1 ring-slate-100">
            <User className="w-6 h-6" />
          </div>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <button className="text-slate-400 hover:text-rose-600 transition-colors" title="Logout">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
