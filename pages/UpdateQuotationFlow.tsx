
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ScrollText, X, CheckCircle2, ChevronRight, 
  AlertTriangle, Info, Package, RefreshCw, Zap, Edit3
} from 'lucide-react';
import { formatINR, formatDate } from '../utils';
import { Equipment, SelectedItem, Contract, Quotation } from '../types';

interface UpdateQuotationFlowProps {
  contracts: Contract[];
  inventory: Equipment[];
  onUpdate: (contractId: string, updatedQuotation: Quotation, finalized?: boolean) => void;
}

const UpdateQuotationFlow: React.FC<UpdateQuotationFlowProps> = ({ contracts, inventory, onUpdate }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'SELECT' | 'NEGOTIATE' | 'SUCCESS'>('SELECT');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [search, setSearch] = useState('');
  
  const [currentItems, setCurrentItems] = useState<SelectedItem[]>([]);
  const [negotiatedTotal, setNegotiatedTotal] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const pendingContracts = contracts.filter(c => 
    c.status === 'Quotation Pending' && 
    (c.id.toLowerCase().includes(search.toLowerCase()) || c.partyName.toLowerCase().includes(search.toLowerCase()))
  );

  const startNegotiation = (contract: Contract) => {
    const latest = [...contract.quotations].sort((a,b) => b.version - a.version)[0];
    const items = latest.items.map(qi => {
      const eq = inventory.find(i => i.id === qi.equipmentId)!;
      return { ...eq, editablePrice: qi.price };
    });
    setSelectedContract(contract);
    setCurrentItems(items);
    setNegotiatedTotal(latest.totalAmount);
    setStep('NEGOTIATE');
  };

  const handleTargetTotalChange = (val: number) => {
    setNegotiatedTotal(val);
    const originalSum = currentItems.reduce((acc, item) => acc + item.price, 0);
    if (originalSum === 0) return;
    const ratio = val / originalSum;
    setCurrentItems(prev => prev.map(item => ({
      ...item,
      editablePrice: Math.round(item.price * ratio)
    })));
  };

  const handleIndividualPriceChange = (id: string, newPrice: number) => {
    setCurrentItems(prev => prev.map(item => 
      item.id === id ? { ...item, editablePrice: newPrice } : item
    ));
  };

  const itemsSum = useMemo(() => currentItems.reduce((acc, item) => acc + item.editablePrice, 0), [currentItems]);
  const isValid = useMemo(() => Math.abs(itemsSum - negotiatedTotal) < 1 && negotiatedTotal > 0, [itemsSum, negotiatedTotal]);

  const latestQuo = selectedContract ? [...selectedContract.quotations].sort((a,b) => b.version - a.version)[0] : null;
  const remainingEdits = latestQuo ? 3 - latestQuo.editCount : 0;

  const handleRevision = (finalize = false) => {
    if (!selectedContract || !latestQuo) return;
    
    if (latestQuo.editCount >= 3 && !finalize) {
      alert("Maximum of 3 edits reached. You must finalize the ledger now.");
      return;
    }

    const updatedQuotation: Quotation = {
      ...latestQuo,
      editCount: finalize ? latestQuo.editCount : latestQuo.editCount + 1,
      totalAmount: negotiatedTotal,
      status: finalize ? 'Approved' : 'Submitted',
      submittedAt: new Date().toISOString(),
      items: currentItems.map(si => ({ equipmentId: si.id, price: si.editablePrice }))
    };

    setIsFinalizing(finalize);
    onUpdate(selectedContract.id, updatedQuotation, finalize);
    setStep('SUCCESS');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {step === 'SELECT' && (
        <div className="animate-in fade-in duration-500">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">Negotiation Hub</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Manage pending drafts (Max 3 edits before finalization)</p>
          </div>
          
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden mb-8">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter pending deals..." 
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 font-bold text-blue-950 outline-none text-sm transition-all focus:border-blue-950"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scroll">
              {pendingContracts.map(c => {
                const latest = [...c.quotations].sort((a,b) => b.version - a.version)[0];
                return (
                  <div key={c.id} onClick={() => startNegotiation(c)} className="p-8 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-blue-950 rounded-xl flex items-center justify-center text-emerald-400 shadow-lg group-hover:scale-110 transition-transform">
                        <ScrollText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ref: {c.id} • Version {latest.version}.{latest.editCount}</div>
                        <div className="text-xl font-black text-blue-950 uppercase tracking-tight">{c.partyName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Remaining Edits</div>
                        <div className={`text-lg font-black font-mono ${3 - latest.editCount === 0 ? 'text-rose-500' : 'text-blue-950'}`}>{3 - latest.editCount}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Sum</div>
                        <div className="text-xl font-black text-blue-950 font-mono">{formatINR(c.totalAmount)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {pendingContracts.length === 0 && (
                <div className="p-24 text-center">
                  <Package className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">No pending negotiations found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 'NEGOTIATE' && selectedContract && (
        <div className="animate-in fade-in zoom-in-95 max-w-4xl mx-auto bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-16 space-y-12">
          <div className="flex justify-between items-start">
            <h2 className="text-5xl font-black text-blue-950 uppercase tracking-tighter">Settlement</h2>
            <div className={`px-4 py-2 rounded-xl border-2 flex flex-col items-end ${remainingEdits === 0 ? 'border-rose-100 bg-rose-50' : 'border-blue-50 bg-blue-50'}`}>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revision Limit</span>
              <span className={`text-xl font-black font-mono ${remainingEdits === 0 ? 'text-rose-600' : 'text-blue-950'}`}>{remainingEdits} / 3 Left</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start pt-4">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Calculated Sum</span>
              <div className="text-5xl font-black text-slate-300 font-mono tracking-tighter flex items-baseline gap-4">
                <span className="text-3xl">₹</span> {itemsSum.toLocaleString()}
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black text-blue-950 uppercase tracking-[0.2em]">Final Negotiation</span>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">₹</div>
                <input 
                  type="number" 
                  className="w-full bg-white border-2 border-blue-950 rounded-[1.5rem] pl-16 pr-8 py-8 font-black text-4xl text-blue-950 font-mono outline-none shadow-sm transition-all focus:ring-8 focus:ring-blue-950/5"
                  value={negotiatedTotal}
                  onChange={e => handleTargetTotalChange(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Item Breakdown (Editable)</span>
              <Edit3 className="w-4 h-4 text-slate-300" />
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll pr-2">
              {currentItems.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50/50 border border-slate-100 rounded-2xl px-8 py-5 group hover:bg-white hover:border-blue-950/20 transition-all">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-blue-950 uppercase tracking-tight">{item.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ref: {item.code}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-950/40">₹</span>
                       <input 
                         type="number" 
                         className="w-40 bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2 font-black text-blue-950 font-mono text-sm outline-none focus:border-blue-950 transition-all"
                         value={item.editablePrice}
                         onChange={(e) => handleIndividualPriceChange(item.id, Number(e.target.value))}
                       />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1e293b] p-8 rounded-[1.5rem] flex items-center gap-5 shadow-inner">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest leading-relaxed">
              Negotiating for <span className="text-white font-black">{selectedContract.partyName}</span>. Reference <span className="text-white font-black">{selectedContract.id}</span>.
            </p>
          </div>

          {!isValid && (
            <div className="p-6 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-4 border border-rose-100 animate-in shake">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Ledger Mismatch: Sum ({formatINR(itemsSum)}) vs Negotiated ({formatINR(negotiatedTotal)}). Diff: <span className="font-mono">{formatINR(Math.abs(itemsSum - negotiatedTotal))}</span>
              </div>
            </div>
          )}

          <div className="flex gap-6 pt-8">
            <button onClick={() => setStep('SELECT')} className="flex-1 py-6 bg-white border border-slate-200 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] text-blue-950 transition-all hover:bg-slate-50">Back</button>
            <div className="flex-[2] flex gap-4">
               <button 
                disabled={!isValid || remainingEdits === 0}
                onClick={() => handleRevision(false)} 
                className="flex-1 py-6 bg-white border-2 border-blue-950 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] text-blue-950 transition-all hover:bg-slate-50 disabled:opacity-30"
              >
                Save Revision
              </button>
              <button 
                disabled={!isValid}
                onClick={() => handleRevision(true)} 
                className="flex-1 py-6 bg-[#0f172a] rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] text-[#10b981] shadow-2xl shadow-blue-950/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
              >
                Finalize Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="animate-in zoom-in-95 duration-500 max-w-lg mx-auto text-center py-24 bg-white rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
            <div className={`w-28 h-28 ${isFinalizing ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'} rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner`}>
              {isFinalizing ? <Zap className="w-14 h-14" /> : <RefreshCw className="w-14 h-14" />}
            </div>
            <h2 className="text-5xl font-black text-blue-950 uppercase tracking-tighter mb-4">{isFinalizing ? 'Deal Finalized' : 'Revision Logged'}</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-12 px-12 leading-relaxed">
              {isFinalizing ? 'The agreement is now operational. Assets marked for dispatch.' : 'Quotation update registered in the edit trail.'}
            </p>
            <button onClick={() => navigate('/')} className="bg-blue-950 text-emerald-400 px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all">Return to Terminal</button>
        </div>
      )}
    </div>
  );
};

export default UpdateQuotationFlow;
