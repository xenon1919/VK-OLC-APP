
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, LogOut, User, Menu } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  userRole: 'admin' | 'manager' | null;
  onLogout: () => void;
  onMenuToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userRole, onLogout, onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminView = location.pathname.startsWith('/admin');

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="h-16 bg-blue-950 text-white flex items-center justify-between px-4 md:px-8 shadow-xl sticky top-0 z-[60]">
      <div className="flex items-center gap-2 md:gap-6">
        {isAdminView && (
          <button 
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        
        <div className="flex items-center gap-2 md:gap-3">
          <Logo className="w-8 h-8 md:w-10 md:h-10" />
          <span className="font-black text-sm md:text-lg tracking-tighter uppercase whitespace-nowrap">VK-OLC</span>
        </div>
        
        <div className="h-6 w-px bg-blue-900 mx-1 md:mx-2 hidden sm:block" />
        
        <div className="flex gap-2 md:gap-6">
          <Link to="/" className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-center gap-1 md:gap-2 transition-colors ${location.pathname === '/' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
            <Home className="w-3 md:w-3.5 h-3 md:h-3.5" /> <span className="hidden xs:inline">Home</span>
          </Link>
          {userRole === 'admin' && (
            <Link to="/admin/dashboard" className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-center gap-1 md:gap-2 transition-colors ${isAdminView ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
              <LayoutDashboard className="w-3 md:w-3.5 h-3 md:h-3.5" /> <span className="hidden xs:inline">Dashboard</span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="flex items-center gap-2 md:gap-3 pr-2 md:pr-6 border-r border-blue-900">
           <div className="text-right hidden sm:block">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Signed in</div>
              <div className="text-[10px] md:text-xs font-bold text-white uppercase tracking-tight">
                {userRole === 'admin' ? 'Super Admin' : 'Sharath'}
              </div>
           </div>
           <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-900 flex items-center justify-center text-slate-300 border border-blue-800">
              <User className="w-3.5 md:w-4 h-3.5 md:h-4" />
           </div>
        </div>
        <button 
          onClick={handleLogoutClick}
          className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 md:gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em]"
        >
          <span className="hidden sm:inline">Logout</span> <LogOut className="w-3 md:w-3.5 h-3 md:h-3.5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
