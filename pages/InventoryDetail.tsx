import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, History, Info, AlertCircle } from 'lucide-react';
import { getMovementHistory } from '../mockData';
import { formatINR, formatDate } from '../utils';
import { Equipment } from '../types';

interface InventoryDetailProps {
  inventory: Equipment[];
}

const InventoryDetail: React.FC<InventoryDetailProps> = ({ inventory }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const item = inventory.find(i => i.id === id);
  if (!item) return <div className="p-10 text-slate-400">Asset not found.</div>;

  const movements = getMovementHistory(item.code);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/admin/inventory')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs uppercase transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Master Inventory
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-10 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                <Package className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{item.code}</span>
                </div>
                <h1 className="text-4xl font-black mt-2 leading-tight">{item.name}</h1>
              </div>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 min-w-[200px] text-right">
              <div className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Base Rental Rate</div>
              <div className="text-3xl font-black text-white font-mono">{formatINR(item.price)} <span className="text-xs text-slate-500">/ Day</span></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="p-8 space-y-8 bg-slate-50/30">
            <div>
              <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                <Info className="w-3 h-3" /> Custody Details
              </h4>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Current Holder</span>
                  <span className="text-base font-black text-slate-900 uppercase">{item.currentHolder}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Active Contract</span>
                  <span className="text-base font-black text-emerald-600 uppercase">{item.contractId}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Current Status</span>
                  <span className="text-base font-black text-slate-900 uppercase">{item.status}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 font-black text-[10px] uppercase">
                <AlertCircle className="w-3.5 h-3.5" /> Pricing Controls
              </div>
              <p className="text-[11px] text-amber-800 font-medium italic">
                Admins can update base rates from the Inventory list view. Past contract transactions will remain at historical rates.
              </p>
            </div>
          </div>

          <div className="p-8 lg:col-span-2">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
              <History className="w-3 h-3" /> Asset Audit Trail (Movement History)
            </h4>
            <div className="overflow-hidden border border-slate-100 rounded-xl bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase">Date</th>
                    <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase">Contract Ref</th>
                    <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase text-center">Direction</th>
                    <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase">Entity Name</th>
                    <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase">Authorized By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {movements.map((move, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500 text-xs">{formatDate(move.date)}</td>
                      <td className="px-6 py-4 font-black text-emerald-600 text-xs">{move.contractId}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          move.direction === 'OUT' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>{move.direction === 'IN' ? 'Inward' : 'Outward'}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold uppercase">{move.partyName}</td>
                      <td className="px-6 py-4 text-xs font-black text-slate-400 uppercase">{move.manager}</td>
                    </tr>
                  ))}
                  {movements.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic text-xs">No historical movements recorded for this asset.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetail;