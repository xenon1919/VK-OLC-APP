
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Package, 
  X, 
  Info, 
  CheckCircle2, 
  FileText, 
  PlusCircle, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  User,
  Warehouse,
  Calendar,
  Archive,
  Clock
} from 'lucide-react';
import { formatINR, formatDate } from '../utils';
import { Equipment, EquipmentCategory, SelectedItem, Contract } from '../types';

type Step = 'SELECT_CONTRACT' | 'ADD_EQUIPMENT' | 'FINALIZE' | 'SUCCESS';

interface AddToContractFlowProps {
  contracts: Contract[];
  inventory: Equipment[];
  onSuccess: (contractId: string, updatedItems: Equipment[], additionalAmount: number) => void;
}

const AddToContractFlow: React.FC<AddToContractFlowProps> = ({ contracts, inventory, onSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('SELECT_CONTRACT');
  const [showArchived, setShowArchived] = useState(false);
  
  // Selection
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [contractSearch, setContractSearch] = useState('');

  // Equipment Selection
  const [newItems, setNewItems] = useState<SelectedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>('Cameras');

  // Billing
  const [customTotal, setCustomTotal] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const targetStatus = showArchived ? 'Closed' : 'Open';

  const filteredContracts = contracts.filter(c => 
    c.status === targetStatus && (
      c.id.toLowerCase().includes(contractSearch.toLowerCase()) ||
      c.partyName.toLowerCase().includes(contractSearch.toLowerCase())
    )
  );

  const existingItems = useMemo(() => {
    if (!selectedContract) return [];
    return inventory.filter(i => i.contractId === selectedContract.id);
  }, [selectedContract, inventory]);

  const newItemsTotal = useMemo(() => {
    return newItems.reduce((acc, item) => acc + item.price, 0);
  }, [newItems]);

  const handleTotalChange = (val: number) => {
    setCustomTotal(val);
    const ratio = newItemsTotal > 0 ? val / newItemsTotal : 0;
    setNewItems(prev => prev.map(item => ({
      ...item,
      editablePrice: Math.round(item.price * ratio)
    })));
  };

  const addItem = (item: Equipment) => {
    if (newItems.find(i => i.id === item.id) || existingItems.find(i => i.id === item.id)) return;
    setNewItems([...newItems, { ...item, editablePrice: item.price }]);
  };

  const handleFinalize = () => {
    if (!selectedContract) return;
    
    const updatedInventoryItems = newItems.map(item => ({
      ...item,
      status: selectedContract.partyType === 'Customer' ? 'Outward (Customer)' as any : 'Outward (Vendor)' as any,
      contractId: selectedContract.id,
      currentHolder: selectedContract.partyName,
      lastMovementDate: new Date().toISOString().split('T')[0]
    }));

    onSuccess(selectedContract.id, updatedInventoryItems, customTotal);
    setStep('SUCCESS');
  };

  const filteredInventory = inventory.filter(i => 
    i.category === activeCategory && 
    i.status === 'Available' &&
    (i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      {step === 'SELECT_CONTRACT' && (
        <div className="animate-in fade-in duration-300">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">Agreement Operations</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">
              {showArchived ? 'Viewing Archived / Past Agreements' : 'Modify active ledger & append transactions'}
            </p>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden mb-8">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between gap-6 bg-slate-50/50">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={`Search ${showArchived ? 'archived' : 'active'} records...`} 
                  aria-label="Search contracts" 
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-6 py-4 font-bold text-blue-950 outline-none uppercase text-sm focus:border-blue-950 transition-all shadow-sm" 
                  value={contractSearch} 
                  onChange={e => setContractSearch(e.target.value)} 
                />
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                  {filteredContracts.length} {showArchived ? 'Closed' : 'Active'} Found
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 px-10 py-5 bg-blue-950 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-blue-900">
              <div className="col-span-1">Ref</div>
              <div className="col-span-3">Business Entity</div>
              <div className="col-span-2">Start Date</div>
              <div className="col-span-2">Flow Type</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Ledger</div>
              <div className="col-span-1"></div>
            </div>

            <div className="max-h-[550px] overflow-y-auto custom-scroll">
              {filteredContracts.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => !showArchived && setSelectedContract(c)} 
                  className={`grid grid-cols-12 gap-4 items-center px-10 py-6 border-b border-slate-50 last:border-0 transition-all group ${
                    showArchived ? 'opacity-70 grayscale-[0.5]' : 'cursor-pointer active:scale-[0.99] hover:bg-slate-50'
                  } ${
                    selectedContract?.id === c.id 
                      ? 'bg-blue-50/50 ring-2 ring-inset ring-blue-950' 
                      : ''
                  }`}
                  aria-label={`Select contract ${c.id} for ${c.partyName}`}
                >
                  <div className="col-span-1">
                    <span className="text-xs font-black text-blue-950 font-mono tracking-tighter">{c.id}</span>
                  </div>

                  <div className="col-span-3 flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      {c.partyType === 'Customer' ? (
                        <User className="w-3 h-3 text-blue-600" />
                      ) : (
                        <Warehouse className="w-3 h-3 text-amber-600" />
                      )}
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.partyType}</span>
                    </div>
                    <div className="text-sm font-black text-blue-950 uppercase tracking-tight truncate">{c.partyName}</div>
                    {(c.projectName || c.assignedProject) && <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 truncate">{c.projectName || c.assignedProject}</div>}
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold font-mono uppercase">{formatDate(c.startDate)}</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-black text-[9px] uppercase tracking-wider ${
                      c.direction === 'IN' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                        : 'bg-amber-50 border-amber-100 text-amber-600'
                    }`}>
                      {c.direction === 'IN' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {c.direction === 'IN' ? 'Inward' : 'Outward'}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-black text-[9px] uppercase tracking-widest ${
                      c.status === 'Open' 
                        ? 'bg-blue-50 border-blue-100 text-blue-700' 
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'Open' ? 'bg-blue-600 animate-pulse' : 'bg-slate-400'}`} />
                      {c.status === 'Open' ? 'Active / Ongoing' : 'Closed / Archived'}
                    </div>
                  </div>

                  <div className="col-span-1 text-right">
                    <div className="text-sm font-black text-blue-950 font-mono tracking-tighter">{formatINR(c.totalAmount)}</div>
                  </div>

                  <div className="col-span-1 flex justify-end">
                    {!showArchived && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        selectedContract?.id === c.id ? 'bg-blue-950 text-white' : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200'
                      }`}>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredContracts.length === 0 && (
                <div className="p-24 text-center">
                  <Package className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No records found in this view</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            <button 
              disabled={!selectedContract || showArchived} 
              onClick={() => setStep('ADD_EQUIPMENT')} 
              className="bg-blue-950 text-emerald-400 px-24 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl disabled:opacity-10 transition-all hover:scale-105 active:scale-95"
            >
              Update Selected Agreement
            </button>

            <button 
              onClick={() => {
                setShowArchived(!showArchived);
                setSelectedContract(null);
              }}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border-2 ${
                showArchived 
                ? 'bg-blue-600 border-blue-700 text-white shadow-lg' 
                : 'bg-white border-slate-200 text-slate-400 hover:border-blue-950 hover:text-blue-950'
              }`}
            >
              {showArchived ? <Clock className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
              {showArchived ? 'Return to Active Agreements' : 'Show Closed Contracts / Archived'}
            </button>
          </div>
        </div>
      )}

      {step === 'ADD_EQUIPMENT' && (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">Inventory Lookup</h3></div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 border-b border-slate-50 mb-8" role="tablist">
                    {['Cameras', 'Lenses', 'Zooms', 'Accessories', 'Lights'].map(cat => (
                        <button key={cat} role="tab" aria-selected={activeCategory === cat} onClick={() => setActiveCategory(cat as any)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-blue-950 border-blue-950 text-emerald-400 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-200'}`}>{cat}</button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 custom-scroll">
                    {filteredInventory.map(item => (
                        <div key={item.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between items-center group hover:border-blue-950 cursor-pointer shadow-sm active:scale-95 transition-all" onClick={() => addItem(item)}>
                            <div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.code}</div>
                                <div className="text-sm font-black text-blue-950 uppercase tracking-tight">{item.name}</div>
                                <div className="text-[10px] font-black text-emerald-600 font-mono mt-1">{formatINR(item.price)}</div>
                            </div>
                            <button className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-blue-950 group-hover:text-emerald-400 flex items-center justify-center transition-all shadow-inner" aria-label={`Add ${item.name}`}><PlusCircle className="w-5 h-5" /></button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
          <div className="bg-blue-950 text-white p-10 rounded-[2.5rem] shadow-2xl flex flex-col h-full min-h-[600px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Package className="w-32 h-32" />
                </div>
                <div className="mb-10 relative z-10">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Agreement Update</div>
                  <div className="text-2xl font-black uppercase tracking-tighter leading-none">{selectedContract?.partyName}</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">Ref: {selectedContract?.id}</div>
                </div>
                <div className="flex-1 space-y-10 overflow-y-auto custom-scroll pr-2 relative z-10">
                    <div className="space-y-4">
                        <div className="text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" /> Already Linked (Read-Only)
                        </div>
                        {existingItems.map(item => (
                            <div key={item.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center opacity-40 grayscale"><div className="text-[10px] font-bold uppercase tracking-tight">{item.name}</div><div className="text-[9px] font-mono">{item.code}</div></div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        <div className="text-[9px] font-black uppercase text-emerald-400 tracking-[0.2em] flex items-center gap-2">
                          <PlusCircle className="w-3 h-3" /> New Additions
                        </div>
                        {newItems.map(item => (
                            <div key={item.id} className="bg-white/10 border border-white/10 p-4 rounded-xl flex justify-between items-center group/sel animate-in slide-in-from-right-2"><div className="text-[10px] font-black uppercase tracking-tight">{item.name}</div><button onClick={() => setNewItems(newItems.filter(i => i.id !== item.id))} aria-label={`Remove ${item.name}`}><X className="w-4 h-4 text-slate-400 hover:text-rose-400 transition-colors" /></button></div>
                        ))}
                        {newItems.length === 0 && <div className="p-8 text-center bg-white/5 border border-dashed border-white/10 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest">Select gear to update</div>}
                    </div>
                </div>
                <button disabled={newItems.length === 0} onClick={() => { setCustomTotal(newItemsTotal); setStep('FINALIZE'); }} className="w-full bg-emerald-500 text-blue-950 py-5 rounded-2xl font-black text-xs uppercase shadow-xl disabled:opacity-20 mt-8 transition-all hover:bg-emerald-400 relative z-10">Update Agreement</button>
          </div>
        </div>
      )}

      {step === 'FINALIZE' && (
        <div className="animate-in fade-in zoom-in-95 duration-300 max-w-2xl mx-auto space-y-10 bg-white p-16 rounded-[3rem] border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-950" />
                <h3 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">Incremental Billing</h3>
                
                <div className="grid grid-cols-2 gap-12 items-end">
                    <div className="space-y-4">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Added Gear Value</label>
                       <div className="text-3xl font-black text-slate-300 font-mono tracking-tighter">{formatINR(newItemsTotal)}</div>
                    </div>
                    <div className="space-y-4">
                       <label htmlFor="incremental-settlement" className="block text-[10px] font-black text-blue-950 uppercase tracking-widest">Settlement for Additions</label>
                       <div className="relative group"><span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">₹</span><input id="incremental-settlement" type="number" className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-blue-950 rounded-2xl font-black text-2xl text-blue-950 font-mono outline-none shadow-sm focus:ring-8 focus:ring-blue-950/5 transition-all" value={customTotal} onChange={e => handleTotalChange(Number(e.target.value))} /></div>
                    </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Additions Valuation</label>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Incremental share</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
                    <div className="max-h-[200px] overflow-y-auto custom-scroll divide-y divide-slate-100">
                      {newItems.map(item => (
                        <div key={item.id} className="px-6 py-4 flex justify-between items-center bg-white/30 hover:bg-white transition-colors">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-blue-950 uppercase tracking-tight">{item.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.code}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-blue-950 font-mono">{formatINR(item.editablePrice)}</div>
                          </div>
                        </div>
                      ))}
                      {newItems.length === 0 && <div className="p-6 text-center text-slate-400 font-bold text-[10px] uppercase">No new items added</div>}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-[1.5rem] border border-blue-100 flex items-start gap-4 shadow-sm">
                  <FileText className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
                    Agreement <span className="text-blue-950 font-black">{selectedContract?.id}</span> {selectedContract?.projectName && <>for <span className="text-blue-950 font-black">{selectedContract.projectName}</span></>} will be incremented by <span className="text-blue-950 font-black">{formatINR(customTotal)}</span>. Inventory tracking for new items starts immediately.
                  </div>
                </div>

                <div>
                    <label htmlFor="notes" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Internal Revision Notes</label>
                    <textarea id="notes" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-6 font-bold text-blue-950 text-sm outline-none h-32 no-resize focus:ring-4 focus:ring-blue-950/5 transition-all" placeholder="Enter reason for contract modification..." value={notes} onChange={e => setNotes(e.target.value)}></textarea>
                </div>

                <div className="mt-16 flex gap-6">
                   <button onClick={() => setStep('ADD_EQUIPMENT')} className="flex-1 py-5 rounded-2xl border-2 border-slate-200 font-black text-xs uppercase tracking-widest transition-colors hover:bg-slate-50">Back</button>
                   <button onClick={handleFinalize} className="flex-[2] bg-blue-950 text-emerald-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all">Confirm Ledger Update</button>
                </div>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="animate-in zoom-in-95 duration-500 max-w-lg mx-auto text-center py-24 bg-white rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
            <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner"><CheckCircle2 className="w-14 h-14" /></div>
            <h2 className="text-5xl font-black text-blue-950 uppercase tracking-tighter mb-4">Ledger Updated</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-12 px-10 leading-relaxed">Financial ledger increased and assets marked for outward deployment.</p>
            <button onClick={() => navigate('/')} className="bg-blue-950 text-emerald-400 px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">Return to Command Center</button>
        </div>
      )}
    </div>
  );
};

export default AddToContractFlow;
