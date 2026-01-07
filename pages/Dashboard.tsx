
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Briefcase, Truck, TrendingUp, Landmark, ArrowDownCircle } from 'lucide-react';
import { formatINR } from '../utils';
import { Contract, Equipment } from '../types';

interface DashboardProps {
  contracts: Contract[];
  inventory: Equipment[];
}

const data = [
  { name: 'Jul', revenue: 400000, expenses: 240000 },
  { name: 'Aug', revenue: 300000, expenses: 139800 },
  { name: 'Sep', revenue: 200000, expenses: 98000 },
  { name: 'Oct', revenue: 278000, expenses: 390800 },
  { name: 'Nov', revenue: 189000, expenses: 480000 },
  { name: 'Dec', revenue: 239000, expenses: 380000 },
];

const KpiCard = ({ icon: Icon, title, value, subtext, colorClass }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
    <div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colorClass} border`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</span>
      <div className="text-xl font-black text-blue-950 mt-1 font-mono tracking-tighter">{value}</div>
    </div>
    <span className="text-slate-400 text-[10px] font-bold mt-4 uppercase tracking-tight">{subtext}</span>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ contracts, inventory }) => {
  const activeCount = contracts.filter(c => c.status === 'Open').length;
  const inFieldCount = inventory.filter(i => i.status.startsWith('Outward')).length;
  const utilization = Math.round((inFieldCount / inventory.length) * 100);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Command Center</h1>
          <p className="text-slate-500 text-sm font-medium">Monitoring operations and asset utilization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KpiCard icon={Landmark} title="Gross Rev" value={formatINR(1425000)} subtext="MTD Performance" colorClass="bg-emerald-50 text-emerald-600 border-emerald-100" />
        <KpiCard icon={ArrowDownCircle} title="Vendor Outflow" value={formatINR(384200)} subtext="Active Expenses" colorClass="bg-rose-50 text-rose-600 border-rose-100" />
        <KpiCard icon={TrendingUp} title="Op Profit" value={formatINR(1040800)} subtext="Audit Ready" colorClass="bg-blue-50 text-blue-600 border-blue-100" />
        <KpiCard icon={Briefcase} title="Active Agreements" value={activeCount.toString()} subtext="Live Sessions" colorClass="bg-blue-50 text-blue-900 border-blue-100" />
        <KpiCard icon={Truck} title="Utilization" value={`${inFieldCount} / ${inventory.length}`} subtext={`${utilization}% Asset Load`} colorClass="bg-amber-50 text-amber-600 border-amber-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest mb-8">Revenue Flow vs Expense (₹)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px' }} />
                <Bar dataKey="revenue" fill="#059669" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="expenses" fill="#e11d48" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest mb-8 text-center">Equipment Demand Index</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                <Line type="stepAfter" dataKey="revenue" stroke="#1e3a8a" strokeWidth={4} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
