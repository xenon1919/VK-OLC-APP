
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Package, X, CheckCircle2, FileText, PlusCircle, ChevronRight, 
  User, Warehouse, Calendar, Clock, ArrowUpRight, ArrowDownLeft,
  Search as SearchIcon, Archive, Info
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
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [contractSearch, setContractSearch] = useState('');
  const [newItems, setNewItems] = useState<SelectedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>('Cameras');
  const [customTotal, setCustomTotal] = useState<number>(0);

  const filteredContracts = contracts.filter(c => 
    (showArchived ? c.status === 'Closed' : c.status === 'Ongoing' || c.status === 'Quotation Pending') && (
      c.id.toLowerCase().includes(contractSearch.toLowerCase()) ||
      c.partyName.toLowerCase().includes(contractSearch.toLowerCase())
    )
  );

  const existingItems = useMemo(() => {
    if (!selectedContract) return [];
    const latestQuo = [...selectedContract.quotations].sort((a,b) => b.version - a.version)[0];
    return latestQuo.items.map(qi => {
      const eq = inventory.find(i => i.id === qi.equipmentId)!;
      return { ...eq, negotiatedPrice: qi.price };
    });
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
    <div className="max-w-7xl mx-auto py-8 px-4">
      {step === 'SELECT_CONTRACT' && (
        <div className="animate-in fade-in duration-500">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-black text-[#1e293b] uppercase tracking-tighter mb-2">Update Orders</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Modify Active Ledger & Append Transactions</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Top Toolbar matching requested layout */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
              <div className="flex-1 relative w-full">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="SEARCH RECORDS..." 
                  className="w-full bg-white border border-slate-200 rounded-[1.5rem] pl-16 pr-8 py-5 font-bold text-blue-950 outline-none shadow-sm focus:ring-4 focus:ring-blue-900/5 transition-all text-xs tracking-widest uppercase" 
                  value={contractSearch} 
                  onChange={e => setContractSearch(e.target.value)} 
                />
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setShowArchived(!showArchived)}
                  className={`px-6 py-4 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all border shadow-sm flex-1 md:flex-none justify-center ${
                    showArchived ? 'bg-blue-950 text-emerald-400 border-blue-900' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Archive className="w-4 h-4" /> {showArchived ? 'View Active' : 'View Archived'}
                </button>
                
                <div className="bg-[#eff6ff] text-[#2563eb] px-6 py-4 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-sm border border-[#dbeafe]">
                  <Clock className="w-4 h-4" /> {filteredContracts.length} {showArchived ? 'Archived' : 'Active'} Found
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden mb-12">
              <div className="grid grid-cols-12 gap-4 px-10 py-6 bg-[#1e293b] text-white">
                <div className="col-span-1 text-[10px] font-black uppercase tracking-[0.2em]">Ref</div>
                <div className="col-span-5 text-[10px] font-black uppercase tracking-[0.2em]">Business Entity</div>
                <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em]">Start Date</div>
                <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-center">Status</div>
                <div className="col-span-2 text-[10px] font-black uppercase tracking-[0.2em] text-right">Ledger</div>
              </div>

              <div className="divide-y divide-slate-50">
                {filteredContracts.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => !showArchived && setSelectedContract(c)} 
                    className={`grid grid-cols-12 gap-4 items-center px-10 py-8 hover:bg-slate-50 transition-all ${
                      selectedContract?.id === c.id ? 'bg-blue-50/50' : ''
                    } ${showArchived ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                  >
                    <div className="col-span-1">
                      <span className="text-xs font-black text-blue-950 font-mono tracking-tighter">{c.id}</span>
                    </div>
                    <div className="col-span-5">
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                          c.direction === 'OUT' 
                            ? 'bg-[#fffbeb] border-[#fef3c7] text-[#d97706]' 
                            : 'bg-[#ecfdf5] border-[#d1fae5] text-[#059669]'
                        }`}>
                          {c.partyType === 'Customer' ? <User className="w-3 h-3" /> : <Warehouse className="w-3 h-3" />}
                          {c.partyType}
                          {c.direction === 'OUT' ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownLeft className="w-3 h-3 ml-1" />}
                        </div>
                      </div>
                      <div className="text-lg font-black text-[#1e293b] uppercase tracking-tight">{c.partyName}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[11px] font-bold font-mono uppercase">{formatDate(c.startDate)}</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${
                        c.status === 'Closed' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${c.status === 'Closed' ? 'bg-slate-400' : 'bg-[#2563eb]'}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{c.status === 'Closed' ? 'CLOSED' : 'ACTIVE'}</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-6">
                      <span className="font-black text-[#1e293b] font-mono text-base">{formatINR(c.totalAmount)}</span>
                      {!showArchived && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedContract?.id === c.id ? 'bg-blue-950 text-white' : 'bg-slate-50 text-slate-300'}`}>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredContracts.length === 0 && (
                  <div className="p-24 text-center">
                    <Package className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">No agreements found in this view</p>
                  </div>
                )}
              </div>
            </div>

            {/* Main Action Button */}
            <div className="flex flex-col items-center">
              <button 
                disabled={!selectedContract || showArchived} 
                onClick={() => setStep('ADD_EQUIPMENT')} 
                className="bg-[#e2e8f0] text-slate-400 px-32 py-6 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] shadow-sm disabled:opacity-50 transition-all hover:bg-blue-950 hover:text-emerald-400 active:scale-95 disabled:hover:bg-[#e2e8f0] disabled:hover:text-slate-400"
              >
                Update Selected Order
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'ADD_EQUIPMENT' && (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 border-b border-slate-50 mb-8">
                    {['Cameras', 'Lenses', 'Zooms', 'Accessories', 'Lights'].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat as any)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-blue-950 border-blue-950 text-emerald-400 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-200'}`}>{cat}</button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 custom-scroll">
                    {filteredInventory.map(item => (
                        <div key={item.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between items-center group hover:border-blue-950 cursor-pointer shadow-sm active:scale-95 transition-all" onClick={() => addItem(item)}>
                            <div><div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.code}</div><div className="text-sm font-black text-blue-950 uppercase tracking-tight">{item.name}</div><div className="text-[10px] font-black text-emerald-600 font-mono mt-1">{formatINR(item.price)}</div></div>
                            <PlusCircle className="w-5 h-5 text-slate-200 group-hover:text-blue-950" />
                        </div>
                    ))}
                </div>
            </div>
          </div>
          <div className="bg-blue-950 text-white p-10 rounded-[2.5rem] shadow-2xl flex flex-col h-full min-h-[600px]">
                <div className="mb-10">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Live Agreement</div>
                  <div className="text-2xl font-black uppercase tracking-tighter">{selectedContract?.partyName}</div>
                </div>
                <div className="flex-1 space-y-8 overflow-y-auto custom-scroll pr-2">
                    <div className="space-y-3">
                        <div className="text-[9px] font-black uppercase text-slate-600 tracking-[0.2em] flex items-center gap-2">Already Deployed (at negotiated rates)</div>
                        {existingItems.map((item, idx) => (
                            <div key={idx} className="bg-white/5 p-4 rounded-xl flex justify-between items-center opacity-60">
                                <div className="text-[10px] font-bold uppercase">{item.name}</div>
                                <div className="text-[10px] font-black text-emerald-400 font-mono">{formatINR(item.negotiatedPrice || 0)}</div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="text-[9px] font-black uppercase text-emerald-400 tracking-[0.2em] flex items-center gap-2">New Operational Additions</div>
                        {newItems.map(item => (
                            <div key={item.id} className="bg-white/10 border border-white/10 p-4 rounded-xl flex justify-between items-center group/sel animate-in slide-in-from-right-2"><div className="text-[10px] font-black uppercase">{item.name}</div><button onClick={() => setNewItems(newItems.filter(i => i.id !== item.id))}><X className="w-4 h-4 text-slate-400 hover:text-rose-400" /></button></div>
                        ))}
                    </div>
                </div>
                <button disabled={newItems.length === 0} onClick={() => { setCustomTotal(newItemsTotal); setStep('FINALIZE'); }} className="w-full bg-emerald-500 text-blue-950 py-5 rounded-2xl font-black text-xs uppercase shadow-xl mt-8 transition-all hover:bg-emerald-400">Apply Scale Update</button>
          </div>
        </div>
      )}

      {step === 'FINALIZE' && (
        <div className="animate-in fade-in zoom-in-95 duration-300 max-w-2xl mx-auto space-y-10 bg-white p-16 rounded-[3rem] border border-slate-200 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-950" />
                <h3 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">Fleet Scale Update</h3>
                <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Added Gear Value</label>
                       <div className="text-3xl font-black text-slate-300 font-mono">{formatINR(newItemsTotal)}</div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-blue-950 uppercase tracking-widest">Additional Daily Settlement</label>
                       <div className="relative group"><span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">₹</span><input type="number" className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-blue-950 rounded-2xl font-black text-2xl text-blue-950 font-mono outline-none shadow-sm focus:ring-8 focus:ring-blue-950/5 transition-all" value={customTotal} onChange={e => handleTotalChange(Number(e.target.value))} /></div>
                    </div>
                </div>
                <div className="p-6 bg-blue-50 rounded-[1.5rem] flex items-start gap-4 shadow-sm border border-blue-100">
                  <FileText className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">Updating <span className="text-blue-950 font-black">{selectedContract?.id}</span>. Ledger total will increase to <span className="text-blue-950 font-black">{formatINR((selectedContract?.totalAmount || 0) + customTotal)}</span> per cycle.</div>
                </div>
                <div className="flex gap-6 pt-8"><button onClick={() => setStep('ADD_EQUIPMENT')} className="flex-1 py-5 rounded-2xl border-2 border-slate-200 font-black text-xs uppercase tracking-widest">Back</button><button onClick={handleFinalize} className="flex-[2] bg-blue-950 text-emerald-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all">Operationalize Gear</button></div>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="animate-in zoom-in-95 duration-500 max-w-lg mx-auto text-center py-24 bg-white rounded-[4rem] shadow-2xl border border-slate-100 relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
            <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner"><CheckCircle2 className="w-14 h-14" /></div>
            <h2 className="text-5xl font-black text-blue-950 uppercase tracking-tighter mb-4">Order Scaled</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-12 px-10 leading-relaxed">Financial ledger increased and assets marked for outward deployment.</p>
            <button onClick={() => navigate('/')} className="bg-blue-950 text-emerald-400 px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">Return Home</button>
        </div>
      )}
    </div>
  );
};

export default AddToContractFlow;
