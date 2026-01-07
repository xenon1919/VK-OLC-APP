
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, Edit3, Save, Layers, Box, AlertCircle } from 'lucide-react';
import { formatINR } from '../utils';
import { Equipment, EquipmentCategory } from '../types';

interface GroupedModel {
  name: string;
  category: EquipmentCategory;
  price: number;
  totalUnits: number;
  availableUnits: number;
  outwardUnits: number;
  items: Equipment[];
}

interface InventoryProps {
  inventory: Equipment[];
  setInventory: React.Dispatch<React.SetStateAction<Equipment[]>>;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, setInventory }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

  const categories: EquipmentCategory[] = ['Cameras', 'Lenses', 'Zooms', 'Accessories'];

  const toggleExpand = (name: string) => {
    const newSet = new Set(expandedModels);
    if (newSet.has(name)) newSet.delete(name);
    else newSet.add(name);
    setExpandedModels(newSet);
  };

  const handlePriceEdit = (group: GroupedModel) => {
    setEditingName(group.name);
    setEditPrice(group.price);
  };

  const savePrice = (name: string) => {
    setInventory(prev => prev.map(item => item.name === name ? { ...item, price: editPrice } : item));
    setEditingName(null);
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const groupedByCategory = useMemo(() => {
    return categories.map(cat => {
      const catItems = filteredInventory.filter(i => i.category === cat);
      const modelMap = new Map<string, GroupedModel>();
      
      catItems.forEach(item => {
        if (!modelMap.has(item.name)) {
          modelMap.set(item.name, {
            name: item.name,
            category: item.category,
            price: item.price,
            totalUnits: 0,
            availableUnits: 0,
            outwardUnits: 0,
            items: []
          });
        }
        const model = modelMap.get(item.name)!;
        model.totalUnits++;
        if (item.status === 'Available') model.availableUnits++;
        if (item.status.startsWith('Outward')) model.outwardUnits++;
        model.items.push(item);
      });

      return {
        categoryName: cat,
        models: Array.from(modelMap.values()),
        totalItems: catItems.length,
        availableItems: catItems.filter(i => i.status === 'Available').length
      };
    });
  }, [filteredInventory]);

  const getStatusMiniBadge = (status: string) => {
    const isOut = status.startsWith('Outward');
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
        status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
        isOut ? 'bg-rose-50 text-rose-700 border-rose-100' :
        'bg-slate-50 text-slate-500 border-slate-100'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Asset Master Data</h1>
          <p className="text-slate-500 font-medium text-sm">Managing unique models and bulk unit clusters.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
          <div className="flex items-center gap-4 bg-blue-950 px-6 py-2.5 rounded-xl">
            <Box className="w-6 h-6 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white font-mono leading-none tracking-tighter">{inventory.length}</span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Total Fleet</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Model Name, Serial, or Category..." 
              className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-950/5 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {groupedByCategory.map(group => group.models.length > 0 && (
            <div key={group.categoryName} className="flex flex-col">
              <div className="bg-slate-50 px-8 py-4 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-slate-400" />
                  <h3 className="text-[11px] font-black text-blue-950 uppercase tracking-[0.2em]">{group.categoryName}</h3>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white">
                    <tr className="border-b border-slate-100">
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest w-1/3">Model</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Daily Rate</th>
                      <th className="px-8 py-5 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {group.models.map(model => (
                      <React.Fragment key={model.name}>
                        <tr className="hover:bg-slate-50/50 group transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <button onClick={() => toggleExpand(model.name)} className={`p-1.5 rounded-lg ${expandedModels.has(model.name) ? 'bg-blue-950 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {expandedModels.has(model.name) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                              <span className="text-base font-black text-blue-950 uppercase tracking-tight">{model.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <div className="flex justify-center gap-2">
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">{model.availableUnits} Available</span>
                                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 uppercase">{model.outwardUnits} Outward</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <span className="text-lg font-black text-blue-950 font-mono tracking-tighter">{formatINR(model.price)}</span>
                          </td>
                          <td className="px-8 py-6"></td>
                        </tr>
                        {expandedModels.has(model.name) && (
                          <tr>
                            <td colSpan={5} className="bg-slate-50/50 px-8 py-6 border-y border-slate-100">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {model.items.map(item => (
                                  <div key={item.id} onClick={() => navigate(`/admin/inventory/${item.id}`)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-950 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between h-24 group/item">
                                    <div className="flex justify-between items-start">
                                      <div className="text-[11px] font-black text-blue-950 uppercase tracking-widest">{item.code}</div>
                                      <ChevronRight className="w-4 h-4 text-slate-200 group-hover/item:text-blue-950 transition-colors" />
                                    </div>
                                    <div className="flex justify-between items-end">
                                      <div className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[120px]">{item.currentHolder}</div>
                                      {getStatusMiniBadge(item.status)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
