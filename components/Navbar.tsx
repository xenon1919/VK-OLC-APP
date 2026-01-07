
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, LogOut, User } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  userRole: 'admin' | 'manager' | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userRole, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminView = location.pathname.startsWith('/admin');

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="h-16 bg-blue-950 text-white flex items-center justify-between px-8 shadow-xl sticky top-0 z-[60]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" />
          <span className="font-black text-lg tracking-tighter uppercase">VK-OLC App</span>
        </div>
        <div className="h-6 w-px bg-blue-900 mx-2" />
        <div className="flex gap-6">
          <Link to="/" className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors ${location.pathname === '/' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          {userRole === 'admin' && (
            <Link to="/admin/dashboard" className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors ${isAdminView ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}>
              <LayoutDashboard className="w-3.5 h-3.5" /> Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-6 border-r border-blue-900">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Signed in as</div>
              <div className="text-xs font-bold text-white uppercase tracking-tight">
                {userRole === 'admin' ? 'Super Admin' : 'Sharath (Manager)'}
              </div>
           </div>
           <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-slate-300 border border-blue-800">
              <User className="w-4 h-4" />
           </div>
        </div>
        <button 
          onClick={handleLogoutClick}
          className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]"
        >
          Logout <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
