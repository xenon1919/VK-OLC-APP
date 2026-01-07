import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Package, PieChart, FileText, User, Warehouse } from 'lucide-react';
import { transactions } from '../mockData';
import { formatINR, formatDate } from '../utils';
import { Contract, Equipment } from '../types';

interface ContractDetailProps {
  contracts: Contract[];
  inventory: Equipment[];
}

const ContractDetail: React.FC<ContractDetailProps> = ({ contracts, inventory }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'transactions' | 'equipment' | 'summary'>('transactions');

  const contract = contracts.find(c => c.id === id);
  if (!contract) return <div className="p-10 text-slate-400 italic">Agreement record not found.</div>;

  const contractTransactions = transactions.filter(t => t.contractId === id);
  const contractEquipment = inventory.filter(e => e.contractId === id);

  const tabs = [
    { id: 'transactions', label: 'Financial Ledger', icon: CreditCard },
    { id: 'equipment', label: 'Equipment List', icon: Package },
    { id: 'summary', label: 'Agreement Summary', icon: PieChart },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate('/admin/contracts')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Agreement Register
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                contract.partyType === 'Customer' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-orange-50 text-orange-700 border border-orange-100'
              }`}>
                {contract.partyType} AGREEMENT
              </span>
              <span className="text-slate-200">|</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                contract.status === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {contract.status}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{contract.partyName}</h1>
            <div className="flex flex-wrap gap-6 text-[11px] text-slate-500 font-bold">
              <span className="uppercase">Ref: <span className="text-slate-900">{contract.id}</span></span>
              <span className="uppercase">Relationship Manager: <span className="text-slate-900">{contract.manager}</span></span>
              <span className="uppercase">Commencement: <span className="text-slate-900">{formatDate(contract.startDate)}</span></span>
              {contract.billTo && <span className="uppercase">Bill To: <span className="text-slate-900">{contract.billTo}</span></span>}
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-right min-w-[240px]">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Total Settlement Value</span>
            <div className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{formatINR(contract.totalAmount)}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-10 border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2.5 py-4 px-2 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">Transaction History</h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase">{contractTransactions.length} Total Events</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">TX Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Entry ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Dir</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Net Settlement</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-medium">
              {contractTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500 uppercase">{formatDate(tx.date)}</td>
                  <td className="px-6 py-4 font-black text-slate-900 uppercase">{tx.id}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                      tx.direction === 'OUT' ? 'text-rose-600 bg-rose-50 border border-rose-100' : 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                    }`}>{tx.direction === 'IN' ? 'Inward' : 'Outward'}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900 font-mono tracking-tight">{formatINR(tx.netAmount)}</td>
                  <td className="px-6 py-4 text-slate-500 uppercase text-[10px] tracking-tight">{tx.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'equipment' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 bg-slate-50 border-b border-slate-100">
            <h3 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">Active Equipment Handover</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Asset Code</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Item Description</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Standard Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-medium">
              {contractEquipment.map(eq => (
                <tr key={eq.id} className="text-sm hover:bg-slate-50/50 cursor-pointer" onClick={() => navigate(`/admin/inventory/${eq.id}`)}>
                  <td className="px-6 py-4 font-black text-slate-900 uppercase">{eq.code}</td>
                  <td className="px-6 py-4 font-bold text-slate-700 uppercase tracking-tight">{eq.name}</td>
                  <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">{eq.category}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900 font-mono">{formatINR(eq.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Operational Metrics
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Items Deployed</span>
                <span className="text-3xl font-black text-slate-900">{contractEquipment.length}</span>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Contract Tenure</span>
                <span className="text-3xl font-black text-slate-900">{contract.duration || 0} Days</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
             <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" /> Fiscal Audit Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                <span className="text-slate-400">Gross Contract Value</span>
                <span className="text-slate-900 font-mono">{formatINR(contract.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                <span className="text-slate-400">GST (IGST 18%)</span>
                <span className="text-slate-900 font-mono">{formatINR(contract.totalAmount * 0.18)}</span>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900 uppercase text-xs tracking-widest">Net Payable Ledger</span>
                <span className="text-2xl font-black text-emerald-600 font-mono tracking-tighter">{formatINR(contract.totalAmount * 1.18)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractDetail;