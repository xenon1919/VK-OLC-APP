
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';

interface LoginProps {
  onLogin: (role: 'admin' | 'manager') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin('admin');
      navigate('/admin/dashboard');
    } else if (username === 'manager' && password === 'manager') {
      onLogin('manager');
      navigate('/');
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo className="w-28 h-28" />
          </div>
          <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">VK-OLC App</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Asset & Rental Command Center</p>
        </div>

        <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <ShieldCheck className="w-32 h-32 text-blue-950" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600 text-[11px] font-black uppercase tracking-widest italic animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 font-bold text-blue-950 outline-none focus:ring-4 focus:ring-blue-950/5 transition-all"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="password" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 font-bold text-blue-950 outline-none focus:ring-4 focus:ring-blue-950/5 transition-all"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-950 text-emerald-400 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Authorized Access Only</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
