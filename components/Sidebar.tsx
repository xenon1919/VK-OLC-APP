
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ArrowLeftRight, 
  Package, 
  BarChart3, 
  X,
  Home
} from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/contracts', label: 'Contracts', icon: FileText },
  { path: '/admin/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/admin/inventory', label: 'Inventory', icon: Package },
  { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside className={`fixed top-16 bottom-0 w-64 bg-blue-950 text-slate-300 border-r border-blue-900 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-6 flex flex-col items-center gap-4 border-b border-blue-900 bg-blue-900/20 relative">
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-slate-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <Logo className="w-16 h-16" />
        <h2 className="text-sm font-black text-white uppercase tracking-tighter text-center">Admin Controls</h2>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scroll">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                isActive 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'hover:bg-blue-900 hover:text-white text-slate-400'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        <div className="pt-4 mt-4 border-t border-blue-900">
           <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-blue-900 hover:text-emerald-400"
          >
            <Home className="w-4 h-4" />
            <span>Return to Ops Home</span>
          </NavLink>
        </div>
      </nav>
      
      <div className="p-4 border-t border-blue-900 text-[10px] text-slate-600 text-center uppercase tracking-[0.2em] font-black">
        VK-OLC App
      </div>
    </aside>
  );
};

export default Sidebar;
