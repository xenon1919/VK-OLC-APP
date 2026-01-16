
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Warehouse, Package, Search, Layers, X, Info, CheckCircle2, ListFilter, Trash2,
  PlusCircle, Briefcase, Plus, Check, AlertTriangle, Edit2, Calendar, ChevronDown
} from 'lucide-react';
import { formatINR, formatDate } from '../utils';
import { Equipment, EquipmentCategory, PartyType, Direction, SelectedItem, Contract, Quotation } from '../types';

type Step = 'TYPE' | 'DETAILS' | 'EQUIPMENT' | 'NEGOTIATION' | 'SUCCESS';

interface NewContractFlowProps {
  inventory: Equipment[];
  onSuccess: (contract: Contract, updatedInventory: Equipment[]) => void;
}

const INITIAL_PRODUCTION_OPTIONS = ["R K Films", "Rain forest( Dop Balreddy)", "HAMPI PICTURES", "HOMBALLE FILMS- KANTARA 2", "Mythri Movie Makers"];
const INITIAL_VENDOR_OPTIONS = ["ACS", "omkar (satish)", "RAVI PRASAD UNIT", "BIG PICTURE", "Chennai Rentals"];
const PROJECT_OPTIONS = ["Project K", "Spirit", "Pushpa 2", "Kantara A Legend", "Devara"];

const GEAR_TEMPLATES: Record<string, string[]> = {
  "R K FILMS": ["Alexa LF", "Cooke 7i Prime Set", "Teradek Bolt 3000", "Wireless Follow Focus"],
  "RAIN FOREST( DOP BALREDDY)": ["Alexa Mini", "Angenieux Optimo", "Wireless Follow Focus", "Teradek Bolt 3000"],
  "HAMPI PICTURES": ["RED V-Raptor", "Arri Signature Prime", "Teradek Bolt 3000"],
  "HOMBALLE FILMS- KANTARA 2": ["Alexa LF", "Alexa Mini", "Cooke 7i Prime Set", "Arri Signature Prime"]
};

const NewContractFlow: React.FC<NewContractFlowProps> = ({ inventory, onSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('TYPE');
  const [partyType, setPartyType] = useState<PartyType | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  
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
  const [isAddingNewEntity, setIsAddingNewEntity] = useState(false);
  const [newEntityName, setNewEntityName] = useState('');

  const [productionOptions, setProductionOptions] = useState(INITIAL_PRODUCTION_OPTIONS);
  const [vendorOptions, setVendorOptions] = useState(INITIAL_VENDOR_OPTIONS);

  const stepsList: Step[] = ['TYPE', 'DETAILS', 'EQUIPMENT', 'NEGOTIATION'];
  const currentStepIdx = stepsList.indexOf(step);

  const originalTotal = useMemo(() => selectedItems.reduce((acc, item) => acc + item.price, 0), [selectedItems]);
  const itemsSum = useMemo(() => selectedItems.reduce((acc, item) => acc + item.editablePrice, 0), [selectedItems]);
  const isValidNegotiation = useMemo(() => Math.abs(itemsSum - customTotal) < 1 && customTotal > 0, [itemsSum, customTotal]);

  const handleTargetTotalChange = (val: number) => {
    setCustomTotal(val);
    if (originalTotal === 0) return;
    const ratio = val / originalTotal;
    setSelectedItems(prev => prev.map(item => ({
      ...item,
      editablePrice: Math.round(item.price * ratio)
    })));
  };

  const handleIndividualPriceChange = (id: string, newPrice: number) => {
    setSelectedItems(prev => prev.map(item => 
      item.id === id ? { ...item, editablePrice: newPrice } : item
    ));
  };

  const addItem = (item: Equipment) => {
    if (selectedItems.find(i => i.id === item.id)) return;
    setSelectedItems([...selectedItems, { ...item, editablePrice: item.price }]);
  };

  const clearBucket = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to clear the entire bucket?")) {
      setSelectedItems([]);
    }
  };

  const handleFinalize = () => {
    const contractId = `QUO-${Math.floor(Math.random() * 900) + 100}`;
    const initialQuotation: Quotation = {
      version: 1, 
      editCount: 0, 
      totalAmount: customTotal, 
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      items: selectedItems.map(si => ({ equipmentId: si.id, price: si.editablePrice }))
    };

    const newContract: Contract = {
      id: contractId, 
      partyName, 
      partyType: partyType!, 
      direction: direction!,
      startDate, 
      status: 'Quotation Pending', 
      totalAmount: customTotal,
      manager: 'Sharath', 
      duration, 
      projectName, 
      billTo, 
      assignedCustomer, 
      assignedProject,
      quotations: [initialQuotation]
    };

    onSuccess(newContract, []); 
    setStep('SUCCESS');
  };

  const filteredInventory = inventory.filter(i => 
    i.category === activeCategory && (direction === 'OUT' ? i.status === 'Available' : true) &&
    (i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {step !== 'SUCCESS' && (
        <div className="relative flex justify-between mb-24 max-w-xl mx-auto px-4">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
          {stepsList.map((s, idx) => (
            <div key={s} className="relative z-10">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                stepsList.indexOf(step) >= idx 
                  ? 'bg-[#1e293b] border-[#1e293b] text-white shadow-xl' 
                  : 'bg-white border-slate-100 text-slate-300 shadow-sm'
              }`}>
                <span className="text-lg font-bold">{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 'TYPE' && (
        <div className="animate-in fade-in zoom-in-95 text-center">
            <h2 className="text-4xl font-black text-blue-950 uppercase tracking-tighter mb-12">New Quotation Build</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <button onClick={() => { setPartyType('Customer'); setDirection('OUT'); }} className={`p-10 rounded-[2.5rem] border-2 transition-all text-left flex flex-col items-start gap-5 shadow-lg group jump-on-hover ${partyType === 'Customer' ? 'border-emerald-500 bg-emerald-50/10' : 'bg-white border-slate-200'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center jump-target ${partyType === 'Customer' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}><Briefcase className="w-8 h-8" /></div>
                <div><span className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Client Flow</span><p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Direct proposal for productions</p></div>
              </button>
              <button onClick={() => setPartyType('Vendor')} className={`p-10 rounded-[2.5rem] border-2 transition-all text-left flex flex-col items-start gap-5 shadow-lg group jump-on-hover ${partyType === 'Vendor' ? 'border-blue-500 bg-blue-50/10' : 'bg-white border-slate-200'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center jump-target ${partyType === 'Vendor' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}><Warehouse className="w-8 h-8" /></div>
                <div><span className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Vendor Flow</span><p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Inward/Outward sub-rentals</p></div>
                {partyType === 'Vendor' && (
                  <div className="flex gap-2 mt-6 w-full"><button onClick={(e) => { e.stopPropagation(); setDirection('IN'); }} className={`flex-1 py-3 rounded-xl border-2 text-[10px] font-black uppercase ${direction === 'IN' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'border-slate-200 text-slate-400'}`}>Inward</button><button onClick={(e) => { e.stopPropagation(); setDirection('OUT'); }} className={`flex-1 py-3 rounded-xl border-2 text-[10px] font-black uppercase ${direction === 'OUT' ? 'bg-blue-500 border-blue-500 text-white shadow-lg' : 'border-slate-200 text-slate-400'}`}>Outward</button></div>
                )}
              </button>
            </div>
            <button disabled={!partyType || !direction} onClick={() => setStep('DETAILS')} className="mt-12 bg-blue-950 text-emerald-400 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl disabled:opacity-20 active:scale-95 transition-all">Proceed to Details</button>
        </div>
      )}

      {step === 'DETAILS' && (
        <div className="animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto bg-white p-16 rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-[#1e293b] uppercase tracking-tighter mb-2">Agreement Meta</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Configure Entity Assignments & Project Scope</p>
          </div>
          
          <div className="space-y-8">
            {/* Primary Entity Name */}
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{partyType === 'Customer' ? 'Client' : 'Vendor'} Name</label>
                {!isAddingNewEntity && <button onClick={() => setIsAddingNewEntity(true)} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">+ Add New</button>}
              </div>
              {!isAddingNewEntity ? (
                <div className="relative">
                  <select className="w-full bg-[#f8fafc] border border-[#f1f5f9] rounded-2xl px-6 py-5 font-black text-[#1e293b] outline-none text-[11px] appearance-none focus:ring-4 focus:ring-blue-950/5 transition-all uppercase tracking-widest" value={partyName} onChange={e => setPartyName(e.target.value)}>
                    <option value="">-- SELECT {partyType === 'Customer' ? 'CLIENT' : 'VENDOR'} --</option>
                    {(partyType === 'Customer' ? productionOptions : vendorOptions).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
              ) : (
                <div className="flex gap-2">
                  <input autoFocus type="text" className="flex-1 bg-white border-2 border-emerald-500 rounded-2xl px-6 py-4 font-black text-[#1e293b] text-[11px] uppercase tracking-widest" placeholder="ENTER ENTITY NAME" value={newEntityName} onChange={e => setNewEntityName(e.target.value)} />
                  <button onClick={() => { if (!newEntityName.trim()) return; if (partyType === 'Customer') setProductionOptions(prev => [...prev, newEntityName]); else setVendorOptions(prev => [...prev, newEntityName]); setPartyName(newEntityName); setNewEntityName(''); setIsAddingNewEntity(false); }} className="p-5 bg-emerald-500 text-white rounded-2xl shadow-lg hover:bg-emerald-600 transition-colors"><Check className="w-5 h-5" /></button>
                </div>
              )}
            </div>

            {/* Layout branching based on flow type */}
            {partyType === 'Vendor' ? (
              <div className="p-6 bg-[#f8fafc] border border-[#f1f5f9] rounded-[2rem] space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Assigned Client</label>
                    <div className="relative">
                      <select className="w-full bg-white border border-[#f1f5f9] rounded-2xl px-5 py-4 font-black text-[#1e293b] outline-none text-[11px] appearance-none focus:ring-4 focus:ring-blue-950/5 transition-all uppercase tracking-widest" value={assignedCustomer} onChange={e => setAssignedCustomer(e.target.value)}>
                        <option value="">-- SELECT CLIENT --</option>
                        {productionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Assigned Project</label>
                    <div className="relative">
                      <select className="w-full bg-white border border-[#f1f5f9] rounded-2xl px-5 py-4 font-black text-[#1e293b] outline-none text-[11px] appearance-none focus:ring-4 focus:ring-blue-950/5 transition-all uppercase tracking-widest" value={assignedProject} onChange={e => setAssignedProject(e.target.value)}>
                        <option value="">-- SELECT PROJECT --</option>
                        {PROJECT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Project Name</label>
                <input type="text" className="w-full bg-[#f8fafc] border border-[#f1f5f9] rounded-2xl px-6 py-5 font-black text-[#1e293b] text-[11px] outline-none focus:ring-4 focus:ring-blue-950/5 transition-all uppercase tracking-widest" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="ENTER PROJECT NAME" />
              </div>
            )}

            {/* Bill To */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Bill To</label>
              <input type="text" className="w-full bg-[#f8fafc] border border-[#f1f5f9] rounded-2xl px-6 py-5 font-black text-[#1e293b] text-[11px] outline-none focus:ring-4 focus:ring-blue-950/5 transition-all uppercase tracking-widest" value={billTo} onChange={e => setBillTo(e.target.value)} placeholder="ENTER BILLING ENTITY" />
            </div>

            {/* Date and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Start Date</label>
                <div className="relative">
                  <input type="date" className="w-full bg-[#f8fafc] border border-[#f1f5f9] rounded-2xl px-6 py-5 font-black text-[#1e293b] text-[11px] outline-none focus:ring-4 focus:ring-blue-950/5 uppercase tracking-widest" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Duration</label>
                <input type="number" className="w-full bg-[#f8fafc] border border-[#f1f5f9] rounded-2xl px-6 py-5 font-black text-[#1e293b] text-[11px] outline-none focus:ring-4 focus:ring-blue-950/5 transition-all uppercase tracking-widest" value={duration} onChange={e => setDuration(Number(e.target.value))} />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex gap-4">
              <button onClick={() => setStep('TYPE')} className="flex-1 py-5 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Back</button>
              <button disabled={!partyName} onClick={() => setStep('EQUIPMENT')} className={`flex-[2] py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all ${partyName ? 'bg-blue-950 text-emerald-400 hover:bg-black' : 'bg-[#e2e8f0] text-slate-400 cursor-not-allowed'}`}>Continue to Equipment</button>
            </div>
          </div>
        </div>
      )}

      {step === 'EQUIPMENT' && (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[700px]">
            <div className="flex flex-col gap-6 mb-8">
               <div className="flex justify-between items-center">
                 <h3 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Asset Master</h3>
                 <div className="flex items-center gap-4">
                   <button onClick={() => setShowTemplates(!showTemplates)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${showTemplates ? 'bg-blue-950 text-emerald-400' : 'bg-blue-50 text-blue-900 hover:bg-blue-100'}`}><ListFilter className="w-4 h-4" /> Templates</button>
                   <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search gear..." className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-950/5 transition-all w-48 md:w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                 </div>
               </div>
               {showTemplates && (
                 <div className="bg-[#1e293b] p-10 rounded-[2rem] border border-blue-900/50 shadow-2xl animate-in fade-in zoom-in-95 duration-300 mb-6">
                   <div className="flex justify-between items-center mb-10"><h4 className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em]">Select Prefill Package</h4><button onClick={() => setShowTemplates(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button></div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {Object.keys(GEAR_TEMPLATES).map(temp => (
                       <button key={temp} onClick={() => { const templateGear = GEAR_TEMPLATES[temp]; const newAdditions: SelectedItem[] = []; templateGear.forEach(gearName => { const match = inventory.find(inv => inv.name === gearName && inv.status === 'Available' && !selectedItems.find(si => si.id === inv.id) && !newAdditions.find(na => na.id === inv.id)); if (match) newAdditions.push({ ...match, editablePrice: match.price }); }); if (newAdditions.length > 0) { setSelectedItems(prev => [...prev, ...newAdditions]); setShowTemplates(false); } else { alert("Selected gear in this template is currently unavailable."); } }} className="flex flex-col items-start p-8 bg-blue-900/20 border border-blue-800/30 rounded-2xl text-left hover:bg-blue-800/40 hover:border-emerald-500/50 transition-all group active:scale-[0.98]">
                         <span className="text-lg font-black text-white uppercase tracking-tighter mb-1 group-hover:text-emerald-400">{temp}</span><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Recommended Package</span>
                       </button>
                     ))}
                   </div>
                 </div>
               )}
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 border-b border-slate-50 mb-8">
              {['Cameras', 'Lenses', 'Zooms', 'Accessories', 'Lights'].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat as any)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-blue-950 border-blue-950 text-emerald-400 shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-blue-950'}`}>{cat}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[420px] overflow-y-auto pr-2 custom-scroll">
              {filteredInventory.map(item => (
                <div key={item.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between items-center group hover:border-blue-950 cursor-pointer shadow-sm active:scale-[0.98] transition-all" onClick={() => addItem(item)}>
                  <div><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{item.code}</span><span className="text-sm font-black text-blue-950 uppercase">{item.name}</span><div className="text-[10px] font-black text-emerald-600 mt-2 font-mono">{formatINR(item.price)}</div></div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-blue-950 group-hover:text-emerald-400 flex items-center justify-center transition-all shadow-inner"><PlusCircle className="w-6 h-6" /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 bg-blue-950 text-white p-8 rounded-[2rem] shadow-2xl flex flex-col h-[700px] sticky top-24 overflow-hidden border border-blue-900/50">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Package className="w-32 h-32" /></div>
            <div className="flex justify-between items-center mb-10 relative z-10"><h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-4 text-emerald-400">Proposed Bucket</h3>{selectedItems.length > 0 && (<button type="button" onClick={clearBucket} className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors text-[9px] font-black uppercase tracking-widest px-4 py-2 bg-rose-500/10 rounded-xl border border-rose-500/20 active:scale-95"><Trash2 className="w-3.5 h-3.5" /> Clear All</button>)}</div>
            <div className="flex-1 overflow-y-auto space-y-4 mb-8 pr-1 custom-scroll relative z-10">
              {selectedItems.map(item => (
                <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center animate-in slide-in-from-right-4">
                  <div className="flex flex-col"><span className="text-xs font-black uppercase tracking-tight truncate max-w-[150px]">{item.name}</span><span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.code}</span></div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedItems(selectedItems.filter(i => i.id !== item.id)); }} className="p-2 hover:bg-rose-500/20 rounded-lg"><X className="w-4 h-4 text-slate-400 hover:text-rose-400" /></button>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-8 mt-auto relative z-10"><div className="flex justify-between items-end mb-6"><div className="flex flex-col"><span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Asset Count</span><span className="text-xl font-black text-emerald-400">{selectedItems.length} Units</span></div><div className="text-right"><span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Initial Offer</span><span className="text-3xl font-black text-white font-mono tracking-tighter block">{formatINR(originalTotal)}</span></div></div><button disabled={selectedItems.length === 0} onClick={() => { setCustomTotal(originalTotal); setStep('NEGOTIATION'); }} className="w-full bg-emerald-500 text-blue-950 py-5 rounded-2xl font-black text-xs uppercase shadow-xl disabled:opacity-20 hover:bg-emerald-400 transition-all active:scale-95 shadow-emerald-500/10">Proceed to Negotiation</button></div>
          </div>
        </div>
      )}

      {step === 'NEGOTIATION' && (
        <div className="animate-in fade-in zoom-in-95 max-w-4xl mx-auto bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-16 space-y-12">
          <h2 className="text-5xl font-black text-blue-950 uppercase tracking-tighter">Settlement</h2>

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
                  value={customTotal}
                  onChange={e => handleTargetTotalChange(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">Item Breakdown</span>
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">Manual edits allowed below</span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scroll pr-2">
              {selectedItems.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50/50 border border-slate-100 rounded-2xl px-8 py-5 group hover:bg-white hover:border-blue-950/20 transition-all">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-blue-950 uppercase tracking-tight">{item.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Base: {formatINR(item.price)}</span>
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
              Agreement Build for <span className="text-white font-black">{partyName || 'the Entity'}</span>. Deployment starting <span className="text-white font-black">{formatDate(startDate)}</span>.
            </p>
          </div>

          {!isValidNegotiation && (
            <div className="p-6 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-4 border border-rose-100 animate-in shake">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Ledger Mismatch: Sum ({formatINR(itemsSum)}) vs Negotiated ({formatINR(customTotal)}). Diff: <span className="font-mono">{formatINR(Math.abs(itemsSum - customTotal))}</span>
              </div>
            </div>
          )}

          <div className="flex gap-6 pt-8">
            <button onClick={() => setStep('EQUIPMENT')} className="flex-1 py-6 bg-white border border-slate-200 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] text-blue-950 transition-all hover:bg-slate-50">Back</button>
            <button disabled={!isValidNegotiation} onClick={handleFinalize} className="flex-[2] py-6 bg-[#0f172a] rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] text-[#10b981] shadow-2xl shadow-blue-950/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-20">Log Quotation Draft</button>
          </div>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="animate-in zoom-in-95 duration-500 max-w-lg mx-auto text-center py-24 bg-white rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
            <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner"><CheckCircle2 className="w-14 h-14" /></div>
            <h2 className="text-5xl font-black text-blue-950 uppercase tracking-tighter mb-4">Draft Logged</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-12 px-10 leading-relaxed">Financial proposal v1.0 logged. You can now revise or finalize this deal in the Negotiation Hub.</p>
            <button onClick={() => navigate('/')} className="bg-blue-950 text-emerald-400 px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all">Return to Terminal</button>
        </div>
      )}
    </div>
  );
};

export default NewContractFlow;
