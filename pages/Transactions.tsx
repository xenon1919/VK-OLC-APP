
import React, { useState } from 'react';
import { Search, Download, Filter, Calendar } from 'lucide-react';
import { transactions } from '../mockData';
import { formatINR, formatDate } from '../utils';

const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.contractId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Central Audit Ledger</h1>
          <p className="text-slate-500 text-sm">Comprehensive record of all system-wide financial movements.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-700/10 hover:bg-emerald-800 transition-all">
          <Download className="w-4 h-4" /> Download GST Ledger
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by TX ID, Ref, or Party..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="date" className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase shadow-sm outline-none focus:ring-1 focus:ring-slate-900" />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="date" className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase shadow-sm outline-none focus:ring-1 focus:ring-slate-900" />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="flex-1 bg-white border border-slate-200 rounded-lg text-xs font-bold px-3 focus:outline-none shadow-sm">
              <option>All Auth Managers</option>
              <option>Ravi</option>
              <option>Prasad</option>
              <option>Shekar</option>
            </select>
            <button className="bg-white p-2 border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">
              <Filter className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Agreement Ref</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Event Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Business Entity</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Movement</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Settlement Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Total Net (Inc. Tax)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-medium">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-black text-slate-900 uppercase">{tx.id}</td>
                  <td className="px-6 py-4 font-black text-emerald-600 uppercase tracking-tight">{tx.contractId}</td>
                  <td className="px-6 py-4 font-mono text-slate-500 uppercase">{formatDate(tx.date)}</td>
                  <td className="px-6 py-4 font-black text-slate-700 uppercase tracking-tight">{tx.partyName}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      tx.direction === 'OUT' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>{tx.direction === 'IN' ? 'Inward' : 'Outward'}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-400 text-right">{formatINR(tx.amount)}</td>
                  <td className="px-6 py-4 font-black text-slate-900 text-right font-mono text-sm tracking-tighter">{formatINR(tx.netAmount)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">No transactions found in the selected period.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
