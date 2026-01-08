
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
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
  FileText,
  Briefcase,
  ScrollText,
  History,
  FilePlus,
  ArrowRightLeft,
  Plus,
  Check
} from 'lucide-react';
import { formatINR, formatDate } from '../utils';
import { Equipment, EquipmentCategory, PartyType, Direction, SelectedItem, Contract } from '../types';

type Step = 'TYPE' | 'DETAILS' | 'EQUIPMENT' | 'FINALIZE' | 'SUCCESS';

interface NewContractFlowProps {
  inventory: Equipment[];
  onSuccess: (contract: Contract, updatedInventory: Equipment[]) => void;
}

const INITIAL_PRODUCTION_OPTIONS = [
  "R K Films",
  "Rain forest( Dop Balreddy)",
  "HAMPI PICTURES",
  "HOMBALLE FILMS- KANTARA 2"
];

const INITIAL_VENDOR_OPTIONS = [
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

  // New Entity State
  const [productionOptions, setProductionOptions] = useState(INITIAL_PRODUCTION_OPTIONS);
  const [vendorOptions, setVendorOptions] = useState(INITIAL_VENDOR_OPTIONS);
  const [isAddingNewEntity, setIsAddingNewEntity] = useState(false);
  const [newEntityName, setNewEntityName] = useState('');

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

  const handleAddNewEntity = () => {
    if (!newEntityName.trim()) return;
    
    if (partyType === 'Customer') {
      setProductionOptions(prev => [...prev, newEntityName.trim()]);
    } else {
      setVendorOptions(prev => [...prev, newEntityName.trim()]);
    }
    setPartyName(newEntityName.trim());
    setNewEntityName('');
    setIsAddingNewEntity(false);
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

  const stepList = ['TYPE', 'DETAILS', 'EQUIPMENT', 'FINALIZE'];

  return (
    <div className="max-w-6xl mx-auto py-4 md:py-8">
      {step !== 'SUCCESS' && (
        <div className="flex justify-between mb-8 md:mb-16 max-w-4xl mx-auto px-4" role="progressbar">
          {stepList.map((s, idx) => (
            <div key={s} className="flex flex-col items-center flex-1 relative">
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center border-2 z-10 transition-all shadow-sm ${
                stepList.indexOf(step) >= idx ? 'bg-blue-950 border-blue-950 text-emerald-400 shadow-xl' : 'bg-white border-slate-200 text-slate-300'
              }`}>
                <span className="text-xs md:text-base">{idx + 1}</span>
              </div>
              <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest mt-2 md:mt-4 hidden xs:block ${
                stepList.indexOf(step) >= idx ? 'text-blue-950' : 'text-slate-300'
              }`}>{s}</span>
              {idx < 3 && <div className={`absolute top-4 md:top-6 left-[50%] w-full h-0.5 bg-slate-200 -z-0 ${stepList.indexOf(step) > idx ? 'bg-blue-950' : ''}`} />}
            </div>
          ))}
        </div>
      )}

      {step === 'TYPE' && (
        <div className="animate-in fade-in zoom-in-95 duration-300 text-center px-4">
            <h2 className="text-3xl md:text-5xl font-black text-blue-950 uppercase tracking-tighter mb-8 md:mb-12">Agreement Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-4xl mx-auto">
              <button 
                  onClick={() => { setPartyType('Customer'); setDirection('OUT'); }}
                  className={`p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-2 transition-all text-left flex flex-col items-start gap-4 md:gap-5 shadow-lg group active:scale-95 jump-on-hover ${partyType === 'Customer' ? 'border-emerald-500 bg-emerald-50/10 ring-4 md:ring-8 ring-emerald-500/5' : 'border-slate-200 bg-white hover:border-emerald-300'}`}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 jump-target ${partyType === 'Customer' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 text-slate-400'}`}>
                  <Briefcase className={`w-6 h-6 md:w-8 md:h-8 ${partyType === 'Customer' ? 'icon-glow-emerald' : ''}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl md:text-3xl font-black text-blue-950 uppercase tracking-tighter">Client</span>
                    <div className="p-1 md:p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                      <FilePlus className="w-4 md:w-5 h-4 md:h-5" />
                    </div>
                  </div>
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">Create new Client Contract</p>
                </div>
              </button>

              <button 
                  onClick={() => { setPartyType('Vendor'); }}
                  className={`p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-2 transition-all text-left flex flex-col items-start gap-4 md:gap-5 shadow-lg group active:scale-95 jump-on-hover ${partyType === 'Vendor' ? 'border-blue-500 bg-blue-50/10 ring-4 md:ring-8 ring-blue-500/5' : 'border-slate-200 bg-white hover:border-blue-300'}`}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 jump-target ${partyType === 'Vendor' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400'}`}>
                  <Warehouse className={`w-6 h-6 md:w-8 md:h-8 ${partyType === 'Vendor' ? 'icon-glow-blue' : ''}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl md:text-3xl font-black text-blue-950 uppercase tracking-tighter">Vendor</span>
                    <div className="p-1 md:p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                      <ArrowRightLeft className="w-4 md:w-5 h-4 md:h-5" />
                    </div>
                  </div>
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">Sub-rental or Outward Inventory</p>
                </div>
                {partyType === 'Vendor' && (
                  <div className="flex gap-2 md:gap-4 mt-4 md:mt-6 w-full animate-in slide-in-from-top-4">
                    <button onClick={(e) => { e.stopPropagation(); setDirection('IN'); }} className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${direction === 'IN' ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}>Inward</button>
                    <button onClick={(e) => { e.stopPropagation(); setDirection('OUT'); }} className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${direction === 'OUT' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}>Outward</button>
                  </div>
                )}
              </button>
            </div>
            <button disabled={!partyType || !direction} onClick={() => setStep('DETAILS')} className="mt-12 md:mt-20 bg-blue-950 text-emerald-400 w-full md:w-auto px-12 md:px-20 py-5 md:py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-2xl shadow-blue-950/20 disabled:opacity-30 hover:scale-105 active:scale-95 transition-all">Proceed to details</button>
        </div>
      )}

      {step === 'DETAILS' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl mx-auto bg-white p-6 md:p-12 rounded-3xl border border-slate-200 shadow-xl mx-4">
          <div className="mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-blue-950 uppercase tracking-tighter">Agreement Meta</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Configure entity assignments & project scope</p>
          </div>
          <div className="space-y-6 md:space-y-8">
            <div className={`grid gap-6 ${partyType === 'Customer' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
               <div className="space-y-3">
                  <div className="flex justify-between items-end mb-1">
                    <label htmlFor="party-name" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{partyType === 'Customer' ? 'Client' : 'Vendor'} Name</label>
                    {!isAddingNewEntity && (
                      <button 
                        onClick={() => setIsAddingNewEntity(true)}
                        className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
                      >
                        + Add New
                      </button>
                    )}
                  </div>
                  
                  {!isAddingNewEntity ? (
                    <div className="relative">
                      <select 
                        id="party-name"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 md:px-5 py-3 md:py-4 font-bold text-blue-950 outline-none appearance-none focus:ring-4 focus:ring-blue-950/5 transition-all text-sm" 
                        value={partyName} 
                        onChange={e => setPartyName(e.target.value)}
                      >
                        <option value="">-- SELECT {partyType === 'Customer' ? 'CLIENT' : 'VENDOR'} --</option>
                        {(partyType === 'Customer' ? productionOptions : vendorOptions).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 animate-in slide-in-from-top-2">
                      <input 
                        autoFocus
                        type="text"
                        className="flex-1 bg-white border-2 border-emerald-500 rounded-xl px-4 md:px-5 py-3 md:py-4 font-bold text-blue-950 outline-none text-sm placeholder:text-slate-300"
                        placeholder={`NEW ${partyType === 'Customer' ? 'CLIENT' : 'VENDOR'} NAME`}
                        value={newEntityName}
                        onChange={e => setNewEntityName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddNewEntity()}
                      />
                      <button 
                        onClick={handleAddNewEntity}
                        className="p-3 md:p-4 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => { setIsAddingNewEntity(false); setNewEntityName(''); }}
                        className="p-3 md:p-4 bg-slate-100 text-slate-400 rounded-xl"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                {partyType === 'Customer' && (
                  <div>
                    <label htmlFor="project-name" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 md:mb-3">Project Name</label>
                    <input id="project-name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 md:px-5 py-3 md:py-4 font-bold text-blue-950 outline-none uppercase placeholder:text-slate-300 text-sm" placeholder="ENTER PROJECT NAME" value={projectName} onChange={e => setProjectName(e.target.value)} />
                  </div>
                )}
            </div>

            {partyType === 'Vendor' && (
              <div className="p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="assigned-customer" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        Assigned Client
                      </label>
                      {direction === 'IN' ? (
                        <select 
                            id="assigned-customer"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 md:py-4 font-bold text-blue-950 outline-none appearance-none text-sm" 
                            value={assignedCustomer} 
                            onChange={e => setAssignedCustomer(e.target.value)}
                          >
                            <option value="">-- SELECT CLIENT --</option>
                            {productionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                      ) : (
                        <input id="assigned-customer" type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 md:py-4 font-bold text-blue-950 outline-none uppercase text-sm" placeholder="ENTER ASSIGNED CLIENT" value={assignedCustomer} onChange={e => setAssignedCustomer(e.target.value)} />
                      )}
                    </div>
                    <div>
                      <label htmlFor="assigned-project" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        Assigned Project
                      </label>
                      {direction === 'IN' ? (
                        <select 
                            id="assigned-project"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 md:py-4 font-bold text-blue-950 outline-none appearance-none text-sm" 
                            value={assignedProject} 
                            onChange={e => setAssignedProject(e.target.value)}
                          >
                            <option value="">-- SELECT PROJECT --</option>
                            {PROJECT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                      ) : (
                        <input id="assigned-project" type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 md:py-4 font-bold text-blue-950 outline-none uppercase text-sm" placeholder="ENTER ASSIGNED PROJECT" value={assignedProject} onChange={e => setAssignedProject(e.target.value)} />
                      )}
                    </div>
                  </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
               <label htmlFor="bill-to" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Bill To</label>
               <input id="bill-to" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 md:px-5 py-3 md:py-4 font-bold text-blue-950 outline-none uppercase text-sm" placeholder="ENTER BILLING ENTITY" value={billTo} onChange={e => setBillTo(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8 pt-4 border-t border-slate-50">
              <div>
                <label htmlFor="start-date" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 md:mb-3">Start Date</label>
                <input id="start-date" type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-blue-950 outline-none text-xs md:text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div>
                <label htmlFor="duration" className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 md:mb-3">Duration</label>
                <input id="duration" type="number" min="1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-blue-950 outline-none text-xs md:text-sm" value={duration} onChange={e => setDuration(Number(e.target.value))} />
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-4">
            <button onClick={() => setStep('TYPE')} className="order-2 sm:order-1 flex-1 py-4 rounded-xl border border-slate-200 font-black text-[10px] uppercase">Back</button>
            <button 
              disabled={!partyName || (partyType === 'Vendor' && direction === 'IN' && (!assignedCustomer || !assignedProject)) || (partyType === 'Customer' && !projectName)} 
              onClick={() => setStep('EQUIPMENT')} 
              className="order-1 sm:order-2 flex-[2] bg-blue-950 text-emerald-400 py-4 rounded-xl font-black text-[10px] uppercase shadow-lg disabled:opacity-20 transition-all"
            >
              Continue to Equipment
            </button>
          </div>
        </div>
      )}

      {step === 'EQUIPMENT' && (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 px-4">
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            <div className="bg-white p-4 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                   <h3 className="text-xl md:text-2xl font-black text-blue-950 uppercase tracking-tighter">Asset Master</h3>
                   <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
                      <button onClick={() => setShowTemplates(!showTemplates)} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-50 text-blue-900 border border-blue-100 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all"><ListFilter className="w-3.5 md:w-4 h-3.5 md:h-4" /> Templates</button>
                      <div className="relative flex-1 md:w-64">
                          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 md:w-4 h-3.5 md:h-4 text-slate-300" />
                          <input type="text" placeholder="Search gear..." className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 md:pl-11 pr-4 py-2 md:py-3 text-[11px] font-bold outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                      </div>
                   </div>
                </div>

                {showTemplates && (
                  <div className="bg-blue-950 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4 text-[10px] font-black text-emerald-400 uppercase">Select Prefill Package</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.keys(GEAR_TEMPLATES).map(temp => (
                        <button key={temp} onClick={() => applyTemplate(temp)} className="text-left bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl hover:bg-white/10 transition-all">
                          <div className="text-[10px] md:text-[11px] font-black text-white uppercase truncate">{temp}</div>
                          <div className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase mt-1">Recommended Package</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-1.5 md:gap-2 overflow-x-auto no-scrollbar pb-4 border-b border-slate-50 mb-6 md:mb-8" role="tablist">
                    {['Cameras', 'Lenses', 'Zooms', 'Accessories', 'Lights'].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat as any)} className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-blue-950 border-blue-950 text-emerald-400 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>{cat}</button>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 h-[400px] md:h-[500px] overflow-y-auto pr-2 custom-scroll">
                    {filteredInventory.map(item => (
                        <div key={item.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex justify-between items-center group hover:border-blue-950 cursor-pointer shadow-sm active:scale-95 transition-all" onClick={() => addItem(item)}>
                            <div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.code}</div>
                                <div className="text-sm font-black text-blue-950 uppercase truncate max-w-[140px] md:max-w-none">{item.name}</div>
                                <div className="text-[11px] font-black text-emerald-600 font-mono mt-2">{formatINR(item.price)}</div>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-950 group-hover:text-emerald-400 flex items-center justify-center transition-all shadow-inner"><PlusCircle className="w-5 h-5" /></div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          <div className="lg:col-span-4 h-full">
            <div className="bg-blue-950 text-white p-6 md:p-8 rounded-[2rem] shadow-2xl flex flex-col h-[500px] md:h-[750px] sticky top-4 md:top-24">
                <div className="flex items-center justify-between mb-8 md:mb-10">
                    <div className="flex items-center gap-3 md:gap-4"><Package className="w-4 md:w-5 h-4 md:h-5 text-emerald-400" /><h3 className="text-xs md:text-sm font-black uppercase tracking-widest">Bucket</h3></div>
                    <button onClick={() => setSelectedItems([])} className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase hover:text-rose-400 transition-colors"><Trash2 className="w-3.5 h-3.5 inline mr-1" /> Clear</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 mb-6 md:mb-8 pr-1 custom-scroll">
                    {selectedItems.map(item => (
                        <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                            <div className="text-[10px] md:text-xs font-black uppercase tracking-tight truncate max-w-[150px]">{item.name}</div>
                            <button onClick={() => removeItem(item.id)} className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                    ))}
                    {selectedItems.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-20"><Layers className="w-12 h-12 mb-3" /><span className="text-[9px] md:text-[10px] font-black uppercase">Bucket Empty</span></div>}
                </div>
                <div className="border-t border-white/10 pt-6 md:pt-8 mt-auto">
                    <div className="flex justify-between items-end mb-4 md:mb-6">
                        <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Estimate</span>
                        <span className="text-2xl md:text-3xl font-black text-white font-mono leading-none tracking-tighter">{formatINR(originalTotal)}</span>
                    </div>
                    <button disabled={selectedItems.length === 0} onClick={() => { setCustomTotal(originalTotal); setStep('FINALIZE'); }} className="w-full bg-emerald-500 text-blue-950 py-4 md:py-5 rounded-2xl font-black text-xs uppercase shadow-xl disabled:opacity-20 transition-all hover:bg-emerald-400">Review Deal</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {step === 'FINALIZE' && (
        <div className="animate-in fade-in zoom-in-95 duration-300 max-w-2xl mx-auto space-y-6 md:space-y-8 bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-2xl mx-4">
                <h3 className="text-3xl md:text-4xl font-black text-blue-950 uppercase tracking-tighter mb-6 md:mb-10">Settlement</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 items-end">
                    <div className="space-y-3 md:space-y-4">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Sum</label>
                       <div className="text-2xl md:text-3xl font-black text-slate-300 font-mono tracking-tighter">{formatINR(originalTotal)}</div>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                       <label htmlFor="final-total" className="block text-[10px] font-black text-blue-950 uppercase tracking-widest">Final Negotiation</label>
                       <div className="relative group">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">₹</span>
                           <input id="final-total" type="number" className="w-full pl-10 pr-4 py-4 md:py-5 bg-slate-50 border-2 border-blue-950 rounded-2xl font-black text-xl md:text-2xl text-blue-950 font-mono outline-none shadow-sm" value={customTotal} onChange={e => handleTotalChange(Number(e.target.value))} />
                       </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Breakdown</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden max-h-[200px] overflow-y-auto custom-scroll divide-y divide-slate-100">
                      {selectedItems.map(item => (
                        <div key={item.id} className="px-5 py-3 flex justify-between items-center bg-white/50">
                          <span className="text-[10px] font-black text-blue-950 uppercase truncate max-w-[140px]">{item.name}</span>
                          <span className="text-xs font-black text-slate-900 font-mono">{formatINR(item.editablePrice)}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="p-5 bg-blue-950 text-emerald-400 rounded-2xl flex items-start gap-4">
                  <Info className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="text-[10px] font-bold leading-relaxed uppercase">
                    Agreement finalized for <span className="text-white font-black">{partyName}</span>. 
                    Deployment starting <span className="text-white font-black">{formatDate(startDate)}</span>.
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                   <button onClick={() => setStep('EQUIPMENT')} className="order-2 sm:order-1 flex-1 py-4 md:py-5 rounded-2xl border-2 border-slate-200 font-black text-[10px] uppercase">Back</button>
                   <button onClick={handleFinalize} className="order-1 sm:order-2 flex-[2] bg-blue-950 text-emerald-400 py-4 md:py-5 rounded-2xl font-black text-[10px] uppercase shadow-2xl">Finalize Ledger</button>
                </div>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="animate-in zoom-in-95 duration-500 max-w-lg mx-auto text-center py-16 md:py-24 bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-slate-100 mx-4">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-inner"><CheckCircle2 className="w-10 md:w-14 h-10 md:h-14" /></div>
            <h2 className="text-4xl md:text-5xl font-black text-blue-950 uppercase tracking-tighter mb-4 md:mb-6">Success</h2>
            <p className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-widest px-8 md:px-12 mb-12 md:mb-16 leading-relaxed">Agreement locked. Deployment logs updated for {partyName}.</p>
            <div className="space-y-3 md:space-y-4 px-8 md:px-12">
                <button onClick={() => navigate('/')} className="w-full bg-blue-950 text-emerald-400 py-5 md:py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl">Back to Ops</button>
                <button onClick={() => window.location.reload()} className="w-full bg-white text-slate-400 py-5 md:py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-slate-100">Start New Deal</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default NewContractFlow;
