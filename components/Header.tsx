
import React from 'react';
import { LogOut, User, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-blue-950 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-slate-400 text-sm hidden xs:block">/</span>
        <h2 className="text-slate-800 font-semibold text-base md:text-lg truncate max-w-[150px] md:max-w-none">System Oversight</h2>
      </div>
      
      <div className="flex items-center gap-2 md:gap-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-slate-900 leading-none">Super Admin</span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full mt-1 border border-slate-200 uppercase tracking-tighter">Root Role</span>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-white ring-1 ring-slate-100">
            <User className="w-5 md:w-6 h-5 md:h-6" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
