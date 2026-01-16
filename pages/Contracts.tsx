
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ChevronRight, User, Warehouse, AlertTriangle } from 'lucide-react';
import { formatINR, formatDate, calculateDaysElapsed } from '../utils';
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

  const getStatusBadge = (contract: Contract) => {
    const elapsedDays = calculateDaysElapsed(contract.startDate);
    const tenureLimit = contract.duration || 45;
    const isOverdue = elapsedDays > tenureLimit && contract.status === 'Ongoing';

    if (isOverdue) {
      return (
        <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 font-black text-[9px] uppercase tracking-widest flex items-center gap-1 w-fit">
          <AlertTriangle className="w-3 h-3" /> Overdue
        </span>
      );
    }

    const baseStyles = "px-2.5 py-1 rounded-lg border font-black text-[9px] uppercase tracking-widest w-fit";
    switch (contract.status) {
      case 'Ongoing':
        return <span className={`${baseStyles} bg-emerald-50 border-emerald-100 text-emerald-600`}>Ongoing</span>;
      case 'Quotation Pending':
        return <span className={`${baseStyles} bg-amber-50 border-amber-100 text-amber-600`}>Pending</span>;
      case 'Closed':
        return <span className={`${baseStyles} bg-slate-50 border-slate-100 text-slate-500`}>Closed</span>;
      default:
        return <span className={`${baseStyles} bg-slate-50 border-slate-100 text-slate-400`}>{contract.status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contract Agreements</h1>
          <p className="text-slate-500 text-sm">Service level agreements and equipment movement tracking.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md w-full sm:w-auto justify-center">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center bg-slate-50/50">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Business Name..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <select 
               className="flex-1 md:w-48 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-widest outline-none shadow-sm"
               value={partyTypeFilter}
               onChange={(e) => setPartyTypeFilter(e.target.value)}
             >
               <option value="All">All Types</option>
               <option value="Customer">Clients</option>
               <option value="Vendor">Vendors</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Ref ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Entity Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
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
                    <div className="text-sm font-black text-slate-900 uppercase truncate max-w-[200px]">{contract.partyName}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-tight truncate">Started: {formatDate(contract.startDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                      {contract.partyType === 'Customer' ? <User className="w-3 h-3 text-blue-500" /> : <Warehouse className="w-3 h-3 text-orange-500" />}
                      {contract.partyType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(contract)}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900 text-right font-mono whitespace-nowrap">
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
