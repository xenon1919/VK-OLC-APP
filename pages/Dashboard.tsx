
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Briefcase, Truck, TrendingUp, Landmark, FileCheck, Clock } from 'lucide-react';
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
  <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
    <div>
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-4 ${colorClass} border`}>
        <Icon className="w-4 md:w-5 h-4 md:h-5" />
      </div>
      <span className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">{title}</span>
      <div className="text-lg md:text-xl font-black text-blue-950 mt-1 font-mono tracking-tighter truncate">{value}</div>
    </div>
    <span className="text-slate-400 text-[9px] md:text-[10px] font-bold mt-4 uppercase tracking-tight truncate">{subtext}</span>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ contracts, inventory }) => {
  const pendingCount = contracts.filter(c => c.status === 'Quotation Pending').length;
  const activeCount = contracts.filter(c => c.status === 'Ongoing').length;
  const inFieldCount = inventory.filter(i => i.status.startsWith('Outward')).length;
  const totalPipeline = contracts.reduce((acc, c) => acc + (c.status !== 'Closed' ? c.totalAmount : 0), 0);

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tighter leading-none">Command Center</h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">Holistic oversight of fleet and financial pipeline.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
        <KpiCard icon={Landmark} title="Gross Pipeline" value={formatINR(totalPipeline)} subtext="MTD Projection" colorClass="bg-emerald-50 text-emerald-600 border-emerald-100" />
        <KpiCard icon={FileCheck} title="Negotiations" value={pendingCount.toString()} subtext="Action Required" colorClass="bg-blue-50 text-blue-600 border-blue-100" />
        <KpiCard icon={TrendingUp} title="Active Deals" value={activeCount.toString()} subtext="Live Sessions" colorClass="bg-amber-50 text-amber-600 border-amber-100" />
        <KpiCard icon={Truck} title="Utilization" value={`${inFieldCount} Units`} subtext="Deployed Assets" colorClass="bg-slate-50 text-slate-600 border-slate-200" />
        <div className="col-span-2 md:col-span-1">
          <KpiCard icon={Clock} title="Audit Health" value="Secure" subtext="All Systems Normal" colorClass="bg-slate-50 text-slate-400 border-slate-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-white p-4 md:p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <h3 className="text-[10px] font-black text-blue-950 uppercase tracking-widest mb-8">Revenue flow Audit (₹)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="revenue" fill="#059669" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="expenses" fill="#e11d48" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 md:p-8 rounded-[2rem] shadow-sm border border-slate-200">
          <h3 className="text-[10px] font-black text-blue-950 uppercase tracking-widest mb-8 text-center">Equipment Demand Cycle</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 4, fill: '#1e3a8a' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
