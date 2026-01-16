
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, Package, PieChart, FileText, User, Warehouse, 
  CheckCircle2, AlertCircle, MapPin, Briefcase, UserCheck, Clock, Timer, AlertTriangle
} from 'lucide-react';
import { transactions } from '../mockData';
import { formatINR, formatDate, calculateDaysElapsed } from '../utils';
import { Contract, Equipment } from '../types';

interface ContractDetailProps {
  contracts: Contract[];
  inventory: Equipment[];
  onEndContract?: (id: string) => void;
}

const ContractDetail: React.FC<ContractDetailProps> = ({ contracts, inventory, onEndContract }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'quotation' | 'equipment' | 'summary'>('quotation');

  const contract = contracts.find(c => c.id === id);
  if (!contract) return <div className="p-10 text-slate-400 italic font-black uppercase tracking-widest text-center">Agreement record not found.</div>;

  const contractEquipment = inventory.filter(e => e.contractId === id);
  const latestQuotation = [...contract.quotations].sort((a,b) => b.version - a.version)[0];
  
  const elapsedDays = calculateDaysElapsed(contract.startDate);
  const tenureLimit = contract.duration || 45;
  const isOverdue = elapsedDays > tenureLimit;
  const progressPercent = Math.min((elapsedDays / tenureLimit) * 100, 100);

  const handleDirectFinalize = () => {
    if (confirm("Move this quotation to operational status? This will officially finalize the agreement.")) {
      contract.status = 'Ongoing';
      latestQuotation.status = 'Approved';
      navigate('/admin/contracts');
    }
  };

  const handleEndContract = () => {
    if (window.confirm("Are you sure you want to end this contract? All deployed assets will be returned to the main warehouse inventory.")) {
      onEndContract?.(contract.id);
      navigate('/admin/contracts');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <button onClick={() => navigate('/admin/contracts')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-[10px] uppercase transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Agreement Register
      </button>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          {contract.partyType === 'Customer' ? <User className="w-32 h-32" /> : <Warehouse className="w-32 h-32" />}
        </div>
        
        {isOverdue && contract.status === 'Ongoing' && (
          <div className="bg-rose-50 border-b border-rose-100 p-4 -mt-10 -mx-10 mb-10 flex items-center justify-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4" /> Contract Tenure Exceeded - Overdue Alert
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border tracking-widest ${
                contract.partyType === 'Customer' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
              }`}>{contract.partyType} AGREEMENT</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                contract.status === 'Ongoing' 
                  ? (isOverdue ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700') 
                  : 'bg-amber-50 text-amber-600'
              }`}>
                {isOverdue && contract.status === 'Ongoing' ? 'Overdue' : contract.status}
              </span>
            </div>
            <h1 className="text-4xl font-black text-blue-950 uppercase tracking-tighter leading-none">{contract.partyName}</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-[11px] text-slate-500 font-bold uppercase tracking-wider pt-4">
              <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> ID: <span className="text-blue-950">{contract.id}</span></span>
              <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Bill To: <span className="text-blue-950">{contract.billTo || 'Standard Billing'}</span></span>
              <span className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Project: <span className="text-blue-950">{contract.projectName || 'General Ops'}</span></span>
              {contract.assignedCustomer && <span className="flex items-center gap-2"><UserCheck className="w-3.5 h-3.5" /> For Client: <span className="text-emerald-600">{contract.assignedCustomer}</span></span>}
              {contract.assignedProject && <span className="flex items-center gap-2"><Package className="w-3.5 h-3.5" /> For Project: <span className="text-emerald-600">{contract.assignedProject}</span></span>}
              <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Start Date: <span className="text-blue-950">{formatDate(contract.startDate)}</span></span>
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-right min-w-[280px]">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Current Value</span>
            <div className="text-4xl font-black text-blue-950 font-mono tracking-tighter">{formatINR(contract.totalAmount)}</div>
            
            <div className="mt-6 flex flex-col gap-3">
              {contract.status === 'Quotation Pending' && (
                <button onClick={handleDirectFinalize} className="w-full bg-blue-950 text-emerald-400 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg hover:scale-105 active:scale-95 transition-all">Finalize Agreement</button>
              )}
              {contract.status === 'Ongoing' && (
                <button onClick={handleEndContract} className="w-full bg-white border border-rose-200 text-rose-600 py-3 rounded-xl font-black text-[10px] uppercase shadow-sm hover:bg-rose-50 transition-all">End Contract</button>
              )}
            </div>
          </div>
        </div>

        {/* Tenure Tracking Bar */}
        {contract.status === 'Ongoing' && (
          <div className="mt-12 space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-950 uppercase tracking-widest">
                <Timer className="w-4 h-4" /> Timeline Progress
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest">
                <span className={isOverdue ? 'text-rose-600' : 'text-emerald-600'}>{elapsedDays} Days Elapsed</span>
                <span className="text-slate-300 mx-2">/</span>
                <span className="text-slate-400">Target: {tenureLimit} Days</span>
              </div>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${isOverdue ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Commenced</span>
              <span>Deadline</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-10 border-b border-slate-200">
        {[
          { id: 'quotation', label: 'Quotation Audit', icon: FileText },
          { id: 'equipment', label: 'Asset Roster', icon: Package },
          { id: 'summary', label: 'Fiscal Summary', icon: PieChart },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2.5 py-5 px-2 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.id ? 'border-blue-950 text-blue-950' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'quotation' && (latestQuotation ? (
        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
           <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h3 className="font-black text-blue-950 uppercase text-[11px] tracking-[0.2em]">Negotiation AuditTrail v{latestQuotation.version}.{latestQuotation.editCount}</h3>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submitted: {formatDate(latestQuotation.submittedAt || '')}</span>
           </div>
           <div className="p-8">
             <table className="w-full text-left">
                <thead><tr><th className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th><th className="py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Settlement</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                   {latestQuotation.items.map(qi => {
                     const eq = inventory.find(i => i.id === qi.equipmentId);
                     return (
                       <tr key={qi.equipmentId} className="group">
                         <td className="py-4"><div className="text-sm font-black text-blue-950 uppercase">{eq?.name}</div><div className="text-[9px] font-bold text-slate-400 uppercase">{eq?.code}</div></td>
                         <td className="py-4 text-right font-black text-blue-950 font-mono">{formatINR(qi.price)}</td>
                       </tr>
                     );
                   })}
                </tbody>
             </table>
           </div>
        </div>
      ) : <div className="p-10 bg-white rounded-2xl text-center italic text-slate-400 uppercase font-black text-xs">No quotation history found.</div>)}

      {activeTab === 'equipment' && (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
          <table className="w-full text-left"><thead className="bg-slate-50"><tr><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Code</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Description</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Negotiated Rate</th></tr></thead><tbody className="divide-y divide-slate-50">{contractEquipment.map(eq => (
            <tr key={eq.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/admin/inventory/${eq.id}`)}><td className="px-8 py-6 font-mono text-xs font-black text-blue-950">{eq.code}</td><td className="px-8 py-6 text-sm font-black text-blue-950 uppercase">{eq.name}</td><td className="px-8 py-6 text-right font-black text-blue-950 font-mono">{formatINR(eq.price)}</td></tr>
          ))}</tbody></table>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
            <h3 className="font-black text-blue-950 uppercase tracking-widest text-[11px] flex items-center gap-3">Agreement Summary</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100"><span className="block text-[10px] font-black text-slate-400 uppercase mb-2">Units Deployed</span><span className="text-4xl font-black text-blue-950 font-mono">{contractEquipment.length}</span></div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100"><span className="block text-[10px] font-black text-slate-400 uppercase mb-2">Cycle Tenure</span><span className="text-4xl font-black text-blue-950 font-mono">{contract.duration} <span className="text-xs">D</span></span></div>
            </div>
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <span className="text-[10px] font-black text-blue-900 uppercase block mb-1">Manager Note</span>
              <p className="text-[11px] text-blue-800 font-medium">Standard tenure is 45 days. Extensions up to 60 days require managerial approval for billing cycle adjustment.</p>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
            <h3 className="font-black text-blue-950 uppercase tracking-widest text-[11px] flex items-center gap-3">Fiscal Projections</h3>
            <div className="space-y-6">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest"><span className="text-slate-400">Negotiated Rate Sum</span><span className="text-blue-950 font-mono">{formatINR(contract.totalAmount)}</span></div>
              <div className="flex justify-between text-xs font-black uppercase tracking-widest"><span className="text-slate-400">Projected Tax (18%)</span><span className="text-blue-950 font-mono">{formatINR(contract.totalAmount * 0.18)}</span></div>
              <div className="h-px bg-slate-100" />
              <div className="flex justify-between items-center"><span className="font-black text-blue-950 uppercase text-[11px] tracking-[0.2em]">Net Value</span><span className="text-3xl font-black text-emerald-600 font-mono tracking-tighter">{formatINR(contract.totalAmount * 1.18)}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractDetail;
