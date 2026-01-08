
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  User, 
  Warehouse, 
  Package, 
  Search, 
  Layers, 
  X, 
  Info, 
  CheckCircle2, 
  ListFilter, 
  Trash2,
  PlusCircle,
  FileText
} from 'lucide-react';
import { formatINR } from '../utils';
import { Equipment, EquipmentCategory, PartyType, Direction, SelectedItem, Contract } from '../types';

type Step = 'TYPE' | 'DETAILS' | 'EQUIPMENT' | 'FINALIZE' | 'SUCCESS';

interface NewContractFlowProps {
  inventory: Equipment[];
  onSuccess: (contract: Contract, updatedInventory: Equipment[]) => void;
}

const PRODUCTION_OPTIONS = [
  "R K Films",
  "Rain forest( Dop Balreddy)",
  "HAMPI PICTURES",
  "HOMBALLE FILMS- KANTARA 2"
];

const VENDOR_OPTIONS = [
  "ACS",
  "omkar (satish)",
  "RAVI PRASAD UNIT",
  "BIG PICTURE"
];

const PROJECT_OPTIONS = [
  "Project K",
  "Pushpa 2",
  "Game Changer",
  "Thandel",
  "Kantara 2"
];

const GEAR_TEMPLATES: Record<string, string[]> = {
  "R K Films": ["Alexa LF", "Cooke 7i Prime Set", "Teradek Bolt 3000"],
  "Rain forest( Dop Balreddy)": ["Alexa Mini", "Angenieux Optimo", "Wireless Follow Focus"],
  "HAMPI PICTURES": ["RED V-Raptor", "Arri Signature Prime", "Teradek Bolt 3000"],
  "HOMBALLE FILMS- KANTARA 2": ["Alexa LF", "Alexa Mini", "Cooke 7i Prime Set", "Arri Signature Prime", "Angenieux Optimo", "Teradek Bolt 3000", "Wireless Follow Focus"]
};

const NewContractFlow: React.FC<NewContractFlowProps> = ({ inventory, onSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('TYPE');
  
  const [partyType, setPartyType] = useState<PartyType | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [partyName, setPartyName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [billTo, setBillTo] = useState('');
  const [assignedCustomer, setAssignedCustomer] = useState('');
  const [assignedProject, setAssignedProject] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(1);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>('Cameras');
  const [customTotal, setCustomTotal] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const originalTotal = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.price, 0);
  }, [selectedItems]);

  const handleTotalChange = (val: number) => {
    setCustomTotal(val);
    if (selectedItems.length === 0) return;
    const ratio = originalTotal > 0 ? val / originalTotal : 0;
    setSelectedItems(prev => prev.map(item => ({
      ...item,
      editablePrice: Math.round(item.price * ratio)
    })));
  };

  const addItem = (item: Equipment) => {
    if (selectedItems.find(i => i.id === item.id)) return;
    setSelectedItems([...selectedItems, { ...item, editablePrice: item.price }]);
  };

  const applyTemplate = (templateName: string) => {
    const modelNames = GEAR_TEMPLATES[templateName] || [];
    const itemsToSelect: SelectedItem[] = [];
    modelNames.forEach(modelName => {
      const availableUnit = inventory.find(i => 
        i.name === modelName && 
        i.status === 'Available' && 
        !itemsToSelect.find(sel => sel.id === i.id) &&
        !selectedItems.find(ex => ex.id === i.id)
      );
      if (availableUnit) {
        itemsToSelect.push({ ...availableUnit, editablePrice: availableUnit.price });
      }
    });
    setSelectedItems(prev => [...prev, ...itemsToSelect]);
    setShowTemplates(false);
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== id));
  };

  const handleFinalize = () => {
    const contractId = `CON-${Math.floor(Math.random() * 900) + 100}`;
    const newContract: Contract = {
      id: contractId,
      partyName: partyName,
      partyType: partyType!,
      direction: direction!,
      startDate: startDate,
      status: 'Open',
      totalAmount: customTotal,
      manager: 'Sharath',
      duration: duration,
      projectName: partyType === 'Customer' ? projectName : undefined,
      assignedCustomer: partyType === 'Vendor' ? assignedCustomer : undefined,
      assignedProject: partyType === 'Vendor' ? assignedProject : undefined,
      billTo: billTo || undefined
    };

    const updatedInventoryItems = selectedItems.map(item => ({
      ...item,
      status: direction === 'OUT' ? (partyType === 'Customer' ? 'Outward (Customer)' as any : 'Outward (Vendor)' as any) : 'Available' as any,
      contractId: contractId,
      currentHolder: partyName,
      lastMovementDate: new Date().toISOString().split('T')[0]
    }));

    onSuccess(newContract, updatedInventoryItems);
    setStep('SUCCESS');
  };

  const filteredInventory = inventory.filter(i => 
    i.category === activeCategory && 
    (direction === 'OUT' ? i.status === 'Available' : true) &&
    (i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      {step !== 'SUCCESS' && (
        <div className="flex justify-between mb-16 max-w-4xl mx-auto" role="progressbar">
          {['TYPE', 'DETAILS', 'EQUIPMENT', 'FINALIZE'].map((s, idx) => (
            <div key={s} className="flex flex-col items-center flex-1 relative">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 z-10 transition-all shadow-sm ${
                ['TYPE', 'DETAILS', 'EQUIPMENT', 'FINALIZE'].indexOf(step) >= idx ? 'bg-blue-950 border-blue-950 text-emerald-400 shadow-xl' : 'bg-white border-slate-200 text-slate-300'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest mt-4 ${
                ['TYPE', 'DETAILS', 'EQUIPMENT', 'FINALIZE'].indexOf(step) >= idx ? 'text-blue-950' : 'text-slate-300'
              }`}>{s}</span>
              {idx < 3 && <div className={`absolute top-6 left-[50%] w-full h-0.5 bg-slate-200 -z-0 ${['TYPE', 'DETAILS', 'EQUIPMENT', 'FINALIZE'].indexOf(step) > idx ? 'bg-blue-950' : ''}`} />}
            </div>
          ))}
        </div>
      )}

      {step === 'TYPE' && (
        <div className="animate-in fade-in zoom-in-95 duration-300 text-center">
            <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter mb-12">Contract Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <button 
                  onClick={() => { setPartyType('Customer'); setDirection('OUT'); }}
                  aria-label="Select Client Contract"
                  className={`p-10 rounded-3xl border transition-all text-left flex flex-col items-start gap-4 shadow-sm group active:scale-95 ${partyType === 'Customer' ? 'border-blue-950 bg-white ring-4 ring-blue-950/5' : 'border-slate-200 bg-white hover:border-slate-400'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${partyType === 'Customer' ? 'bg-blue-950 text-emerald-400' : 'bg-slate-100 text-slate-400'}`}><User /></div>
                <div className="text-2xl font-black uppercase tracking-tighter">Client</div>
                <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wide">Create new Client Contract</p>
              </button>
              <button 
                  onClick={() => { setPartyType('Vendor'); }}
                  aria-label="Select Vendor Contract"
                  className={`p-10 rounded-3xl border transition-all text-left flex flex-col items-start gap-4 shadow-sm group active:scale-95 ${partyType === 'Vendor' ? 'border-blue-950 bg-white ring-4 ring-blue-950/5' : 'border-slate-200 bg-white hover:border-slate-400'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${partyType === 'Vendor' ? 'bg-blue-950 text-emerald-400' : 'bg-slate-100 text-slate-400'}`}><Warehouse /></div>
                <div className="text-2xl font-black uppercase tracking-tighter">Vendor</div>
                <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wide">Inward or Outward Vendor Contract</p>
                {partyType === 'Vendor' && (
                  <div className="flex gap-3 mt-6 w-full animate-in slide-in-from-top-2">
                    <button onClick={(e) => { e.stopPropagation(); setDirection('IN'); }} className={`flex-1 py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest ${direction === 'IN' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-100'}`}>Inward</button>
                    <button onClick={(e) => { e.stopPropagation(); setDirection('OUT'); }} className={`flex-1 py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest ${direction === 'OUT' ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-100'}`}>Outward</button>
                  </div>
                )}
              </button>
            </div>
            <button disabled={!partyType || !direction} onClick={() => setStep('DETAILS')} className="mt-16 bg-blue-950 text-emerald-400 px-16 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl disabled:opacity-30">Confirm Contract Type</button>
        </div>
      )}

      {step === 'DETAILS' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl mx-auto bg-white p-12 rounded-3xl border border-slate-200 shadow-xl">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Agreement Meta</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Configure entity assignments & project scope</p>
          </div>
          <div className="space-y-8">
            <div className={`grid gap-8 ${partyType === 'Customer' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
               <div>
                  <label htmlFor="party-name" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{partyType === 'Customer' ? 'Client' : 'Vendor'} Legal Name</label>
                  <select 
                    id="party-name"
                    aria-label={`${partyType === 'Customer' ? 'Client' : 'Vendor'} select`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 font-bold text-blue-950 outline-none appearance-none focus:ring-4 focus:ring-blue-950/5 transition-all" 
                    value={partyName} 
                    onChange={e => setPartyName(e.target.value)}
                  >
                    <option value="">-- SELECT {partyType === 'Customer' ? 'CLIENT' : 'VENDOR'} --</option>
                    {(partyType === 'Customer' ? PRODUCTION_OPTIONS : VENDOR_OPTIONS).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                {partyType === 'Customer' && (
                  <div>
                    <label htmlFor="project-name" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Project Name</label>
                    <input id="project-name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 font-bold text-blue-950 outline-none uppercase placeholder:text-slate-300" placeholder="ENTER PROJECT NAME" value={projectName} onChange={e => setProjectName(e.target.value)} />
                  </div>
                )}
            </div>

            {partyType === 'Vendor' && (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="assigned-customer" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        Assigned Client
                      </label>
                      {direction === 'IN' ? (
                        <select 
                            id="assigned-customer"
                            className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 font-bold text-blue-950 outline-none appearance-none" 
                            value={assignedCustomer} 
                            onChange={e => setAssignedCustomer(e.target.value)}
                          >
                            <option value="">-- SELECT CLIENT --</option>
                            {PRODUCTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                      ) : (
                        <input id="assigned-customer" type="text" className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 font-bold text-blue-950 outline-none uppercase placeholder:text-slate-300" placeholder="ENTER ASSIGNED CLIENT" value={assignedCustomer} onChange={e => setAssignedCustomer(e.target.value)} />
                      )}
                    </div>
                    <div>
                      <label htmlFor="assigned-project" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        Assigned Project
                      </label>
                      {direction === 'IN' ? (
                        <select 
                            id="assigned-project"
                            className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 font-bold text-blue-950 outline-none appearance-none" 
                            value={assignedProject} 
                            onChange={e => setAssignedProject(e.target.value)}
                          >
                            <option value="">-- SELECT PROJECT --</option>
                            {PROJECT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                      ) : (
                        <input id="assigned-project" type="text" className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 font-bold text-blue-950 outline-none uppercase placeholder:text-slate-300" placeholder="ENTER ASSIGNED PROJECT" value={assignedProject} onChange={e => setAssignedProject(e.target.value)} />
                      )}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block border-t border-slate-200 pt-4">
                    {direction === 'IN' ? '* Required for sub-rental tracking' : '* Optional billing context'}
                  </span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
               <label htmlFor="bill-to" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Bill To</label>
               <input id="bill-to" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 font-bold text-blue-950 outline-none uppercase placeholder:text-slate-300" placeholder="ENTER BILLING ENTITY DETAILS" value={billTo} onChange={e => setBillTo(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-50">
              <div>
                <label htmlFor="start-date" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Start Date</label>
                <input id="start-date" type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 font-bold text-blue-950 outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div>
                <label htmlFor="duration" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Duration (Days)</label>
                <input id="duration" type="number" min="1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 font-bold text-blue-950 outline-none" value={duration} onChange={e => setDuration(Number(e.target.value))} />
              </div>
            </div>
          </div>
          <div className="mt-12 flex gap-4">
            <button onClick={() => setStep('TYPE')} className="flex-1 py-4 rounded-xl border border-slate-200 font-black text-[10px] uppercase">Back</button>
            <button 
              disabled={!partyName || (partyType === 'Vendor' && direction === 'IN' && (!assignedCustomer || !assignedProject)) || (partyType === 'Customer' && !projectName)} 
              onClick={() => setStep('EQUIPMENT')} 
              className="flex-[2] bg-blue-950 text-emerald-400 py-4 rounded-xl font-black text-[10px] uppercase shadow-lg disabled:opacity-20 transition-all"
            >
              Equipment Selection
            </button>
          </div>
        </div>
      )}

      {step === 'EQUIPMENT' && (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">Asset Master</h3>
                   <div className="flex gap-4">
                      <button onClick={() => setShowTemplates(!showTemplates)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-900 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-100"><ListFilter className="w-4 h-4" /> Template Select</button>
                      <div className="relative w-64">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input type="text" placeholder="Search item..." aria-label="Inventory search" className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-xs font-bold focus:ring-4 focus:ring-blue-950/5 outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                      </div>
                   </div>
                </div>

                {showTemplates && (
                  <div className="bg-blue-950 rounded-2xl p-6 mb-8 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Select Prefill Package</h4>
                      <button onClick={() => setShowTemplates(false)}><X className="w-4 h-4 text-white/50" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.keys(GEAR_TEMPLATES).map(temp => (
                        <button key={temp} onClick={() => applyTemplate(temp)} className="text-left bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all">
                          <div className="text-[11px] font-black text-white uppercase tracking-tight">{temp}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">Bulk Add Recommended Gear</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 border-b border-slate-50 mb-8" role="tablist">
                    {['Cameras', 'Lenses', 'Zooms', 'Accessories', 'Lights'].map(cat => (
                        <button key={cat} role="tab" aria-selected={activeCategory === cat} onClick={() => setActiveCategory(cat as any)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-blue-950 border-blue-950 text-emerald-400 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>{cat}</button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px] overflow-y-auto pr-4 custom-scroll">
                    {filteredInventory.map(item => (
                        <div key={item.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between items-center group hover:border-blue-950 cursor-pointer shadow-sm active:scale-95 transition-all" onClick={() => addItem(item)}>
                            <div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.code}</div>
                                <div className="text-base font-black text-blue-950 uppercase tracking-tight">{item.name}</div>
                                <div className="text-xs font-black text-emerald-600 font-mono mt-3">{formatINR(item.price)}</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-950 group-hover:text-emerald-400 flex items-center justify-center transition-all shadow-inner"><PlusCircle className="w-5 h-5" /></div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-blue-950 text-white p-8 rounded-[2rem] shadow-2xl flex flex-col sticky top-24 h-[750px]">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4"><Package className="w-5 h-5 text-emerald-400" /><h3 className="text-sm font-black uppercase tracking-widest">Selected Bucket</h3></div>
                    <button onClick={() => setSelectedItems([])} className="text-[10px] font-black text-slate-500 uppercase hover:text-rose-400 flex items-center gap-1.5 transition-colors"><Trash2 className="w-3.5 h-3.5" /> Clear All</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 mb-8 pr-2 custom-scroll">
                    {selectedItems.map(item => (
                        <div key={item.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center animate-in slide-in-from-right-2">
                            <div className="text-xs font-black uppercase tracking-tight">{item.name}</div>
                            <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all flex items-center justify-center" aria-label={`Remove ${item.name}`}><X className="w-4 h-4" /></button>
                        </div>
                    ))}
                    {selectedItems.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-20"><Layers className="w-16 h-16 mb-4" /><span className="text-[10px] font-black uppercase">No gear selected</span></div>}
                </div>
                <div className="border-t border-white/10 pt-8 mt-auto">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Estimate Total</span>
                        <span className="text-3xl font-black text-white font-mono leading-none tracking-tighter">{formatINR(originalTotal)}</span>
                    </div>
                    <button disabled={selectedItems.length === 0} onClick={() => { setCustomTotal(originalTotal); setStep('FINALIZE'); }} className="w-full bg-emerald-500 text-blue-950 py-5 rounded-2xl font-black text-xs uppercase shadow-xl disabled:opacity-20 transition-all hover:bg-emerald-400">Review Settlement</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {step === 'FINALIZE' && (
        <div className="animate-in fade-in zoom-in-95 duration-300 max-w-2xl mx-auto space-y-8 bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl">
                <h3 className="text-4xl font-black text-blue-950 uppercase tracking-tighter mb-10">Settlement</h3>
                <div className="grid grid-cols-2 gap-10 items-end">
                    <div className="space-y-4">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventory Sum</label>
                       <div className="text-3xl font-black text-slate-300 font-mono tracking-tighter">{formatINR(originalTotal)}</div>
                    </div>
                    <div className="space-y-4">
                       <label htmlFor="final-total" className="block text-[10px] font-black text-blue-950 uppercase tracking-[0.2em]">Final Negotiation</label>
                       <div className="relative group">
                           <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">₹</span>
                           <input id="final-total" type="number" className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-blue-950 rounded-2xl font-black text-2xl text-blue-950 font-mono outline-none shadow-sm transition-all focus:ring-8 focus:ring-blue-950/5" value={customTotal} onChange={e => handleTotalChange(Number(e.target.value))} />
                       </div>
                    </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Valuation Summary</label>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Auto-Adjusted Rates</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="max-h-[250px] overflow-y-auto custom-scroll divide-y divide-slate-100">
                      {selectedItems.map(item => (
                        <div key={item.id} className="px-6 py-4 flex justify-between items-center group hover:bg-white transition-colors">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-blue-950 uppercase tracking-tight">{item.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.code}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-blue-950 font-mono">{formatINR(item.editablePrice)}</div>
                            <div className="text-[9px] font-bold text-emerald-600 uppercase">Adjusted share</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-950 text-emerald-400 rounded-2xl flex items-start gap-4 shadow-xl">
                  <Info className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="text-[10px] font-bold leading-relaxed uppercase tracking-wide">
                    {partyType === 'Customer' && projectName && <div className="font-black text-white">Project: {projectName}</div>}
                    {partyType === 'Vendor' && assignedProject && <div className="font-black text-white">Assigned Project: {assignedProject}</div>}
                    {partyType === 'Vendor' && assignedCustomer && <div className="mt-1 opacity-80 uppercase">Assigned Client: {assignedCustomer}</div>}
                    {billTo && <div className="mt-2 text-white/70 border-t border-white/10 pt-2 flex items-center gap-2"><FileText className="w-3 h-3" /> Bill To: {billTo}</div>}
                  </div>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Submission Notes</label>
                    <textarea id="notes" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-5 font-bold text-blue-950 text-sm outline-none h-32 no-resize focus:ring-4 focus:ring-blue-950/5 transition-all" placeholder="Enter transaction specific remarks..." value={notes} onChange={e => setNotes(e.target.value)}></textarea>
                </div>
                <div className="mt-16 flex gap-6">
                   <button onClick={() => setStep('EQUIPMENT')} className="flex-1 py-5 rounded-2xl border-2 border-slate-200 font-black text-[10px] uppercase transition-colors hover:bg-slate-50">Back</button>
                   <button onClick={handleFinalize} className="flex-[2] bg-blue-950 text-emerald-400 py-5 rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-black transition-all">Finalize Agreement</button>
                </div>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="animate-in zoom-in-95 duration-500 max-w-lg mx-auto text-center py-24 bg-white rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner"><CheckCircle2 className="w-14 h-14" /></div>
            <h2 className="text-5xl font-black text-blue-950 uppercase tracking-tighter mb-6">Success</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest px-12 mb-16 leading-relaxed">Agreement finalized for {partyName}. assets are deployed and tracking is active.</p>
            <div className="space-y-4 px-12">
                <button onClick={() => navigate('/')} className="w-full bg-blue-950 text-emerald-400 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">Return to Operations</button>
                <button onClick={() => window.location.reload()} className="w-full bg-white text-slate-400 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-slate-100 transition-colors hover:text-blue-950">Start New Workflow</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default NewContractFlow;
