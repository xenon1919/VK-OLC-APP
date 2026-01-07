
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { FileDown, Printer, Filter } from 'lucide-react';

const pieData = [
  { name: 'Excavators', value: 400 },
  { name: 'Cranes', value: 300 },
  { name: 'Generators', value: 300 },
  { name: 'Lifts', value: 200 },
];

const COLORS = ['#059669', '#2563eb', '#d97706', '#7c3aed'];

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports & BI</h1>
          <p className="text-slate-500">Exportable data summaries for fiscal and operational audits.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Printer className="w-4 h-4" /> Print View
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 shadow-md">
            <FileDown className="w-4 h-4" /> Export All (ZIP)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          'Revenue by Customer',
          'Expense by Vendor',
          'Equipment Utilization',
          'Contract-wise Summary',
          'GST / Tax Summary',
          'Manager Performance'
        ].map((report, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <FileDown className="w-5 h-5" />
              </div>
              <button className="text-xs font-bold text-slate-400 uppercase hover:text-slate-600">Filters</button>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">{report}</h3>
            <p className="text-xs text-slate-500 mb-4">Last generated: 2 hours ago</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="text-[10px] font-black text-slate-400 uppercase">Audit Grade: High</span>
              <button className="text-xs font-bold text-emerald-600 group-hover:underline">Download Report</button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Category-wise Utilization</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-900 mb-8">Monthly Net Savings</h3>
           <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Jul', savings: 12000 },
                { month: 'Aug', savings: 15000 },
                { month: 'Sep', savings: 11000 },
                { month: 'Oct', savings: 19000 },
                { month: 'Nov', savings: 24000 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="savings" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
