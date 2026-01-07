
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ChevronRight, User, Warehouse } from 'lucide-react';
import { formatINR, formatDate } from '../utils';
import { Contract } from '../types';

interface ContractsProps {
  contracts: Contract[];
}

const Contracts: React.FC<ContractsProps> = ({ contracts }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [partyTypeFilter, setPartyTypeFilter] = useState('All');

  const filtered = contracts.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.partyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = partyTypeFilter === 'All' || c.partyType === partyTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contract Agreements</h1>
          <p className="text-slate-500 text-sm">Service level agreements and equipment movement tracking.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
          <Download className="w-4 h-4" /> Export Register
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center bg-slate-50/50">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Contract ID or Business Name..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Ref ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Entity Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Value</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((contract) => (
                <tr 
                  key={contract.id} 
                  className="hover:bg-slate-50/50 cursor-pointer group"
                  onClick={() => navigate(`/admin/contracts/${contract.id}`)}
                >
                  <td className="px-6 py-4 text-sm font-black text-slate-900">{contract.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-900 uppercase">{contract.partyName}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-tight">Manager: {contract.manager}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                      {contract.partyType === 'Customer' ? <User className="w-3 h-3 text-blue-500" /> : <Warehouse className="w-3 h-3 text-orange-500" />}
                      {contract.partyType}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900 text-right font-mono">
                    {formatINR(contract.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
