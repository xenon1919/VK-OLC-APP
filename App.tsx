
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Contracts from './pages/Contracts';
import ContractDetail from './pages/ContractDetail';
import Transactions from './pages/Transactions';
import Inventory from './pages/Inventory';
import InventoryDetail from './pages/InventoryDetail';
import Reports from './pages/Reports';
import ManagerHome from './pages/ManagerHome';
import NewContractFlow from './pages/NewContractFlow';
import UpdateQuotationFlow from './pages/UpdateQuotationFlow';
import AddToContractFlow from './pages/AddToContractFlow';
import Login from './pages/Login';
import { contracts as initialContracts, inventory as initialInventory } from './mockData';
import { Contract, Equipment, Quotation } from './types';

type UserRole = 'admin' | 'manager' | null;

const AdminLayout: React.FC<{ children: React.ReactNode; userRole: UserRole; onLogout: () => void }> = ({ children, userRole, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [window.location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar userRole={userRole} onLogout={onLogout} onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        )}
        <div className="flex-1 flex flex-col lg:ml-64 w-full overflow-hidden pt-1">
          <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

const ManagerLayout: React.FC<{ children: React.ReactNode; userRole: UserRole; onLogout: () => void }> = ({ children, userRole, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar userRole={userRole} onLogout={onLogout} />
      <main className="flex-1 container mx-auto p-4 md:p-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [inventory, setInventory] = useState<Equipment[]>(initialInventory);

  useEffect(() => {
    const savedRole = localStorage.getItem('vk_role') as UserRole;
    if (savedRole) setUserRole(savedRole);
    setIsInitialized(true);
  }, []);

  const handleLogin = (role: 'admin' | 'manager') => {
    setUserRole(role);
    localStorage.setItem('vk_role', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('vk_role');
  };

  const updateInventory = (updatedItems: Equipment[]) => {
    setInventory(prev => prev.map(item => {
      const updated = updatedItems.find(u => u.id === item.id);
      return updated ? updated : item;
    }));
  };

  const addContract = (contract: Contract) => {
    setContracts(prev => [contract, ...prev]);
  };

  const updateQuotation = (contractId: string, updatedQuotation: Quotation, finalized?: boolean) => {
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        return { 
          ...c, 
          quotations: [updatedQuotation], 
          totalAmount: updatedQuotation.totalAmount,
          status: finalized ? 'Ongoing' : c.status
        };
      }
      return c;
    }));

    if (finalized) {
      setInventory(prev => prev.map(item => {
        const quoItem = updatedQuotation.items.find(qi => qi.equipmentId === item.id);
        if (quoItem) {
          const targetContract = contracts.find(con => con.id === contractId);
          return {
            ...item,
            status: targetContract?.partyType === 'Customer' ? 'Outward (Customer)' as any : 'Outward (Vendor)' as any,
            contractId: contractId,
            currentHolder: targetContract?.partyName || 'Unit',
            lastMovementDate: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      }));
    }
  };

  const updateContractAmount = (contractId: string, additionalAmount: number) => {
    setContracts(prev => prev.map(c => 
      c.id === contractId ? { ...c, totalAmount: c.totalAmount + additionalAmount } : c
    ));
  };

  const closeContract = (contractId: string) => {
    setContracts(prev => prev.map(c => 
      c.id === contractId ? { ...c, status: 'Closed' as const } : c
    ));
    setInventory(prev => prev.map(item => 
      item.contractId === contractId ? { 
        ...item, 
        status: 'Available' as const, 
        contractId: 'N/A', 
        currentHolder: 'Main Warehouse' 
      } : item
    ));
  };

  if (!isInitialized) return null;

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={userRole ? <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/'} /> : <Login onLogin={handleLogin} />} />
        <Route path="/" element={userRole ? <ManagerLayout userRole={userRole} onLogout={handleLogout}><ManagerHome /></ManagerLayout> : <Navigate to="/login" />} />
        
        <Route path="/new-contract" element={
          userRole ? (
            <ManagerLayout userRole={userRole} onLogout={handleLogout}>
              <NewContractFlow 
                inventory={inventory} 
                onSuccess={(contract, updatedItems) => {
                  addContract(contract);
                  if (updatedItems.length) updateInventory(updatedItems);
                }} 
              />
            </ManagerLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/update-quotation" element={
          userRole ? (
            <ManagerLayout userRole={userRole} onLogout={handleLogout}>
              <UpdateQuotationFlow 
                contracts={contracts} 
                inventory={inventory} 
                onUpdate={updateQuotation}
              />
            </ManagerLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/add-to-contract" element={
          userRole ? (
            <ManagerLayout userRole={userRole} onLogout={handleLogout}>
              <AddToContractFlow 
                contracts={contracts} 
                inventory={inventory} 
                onSuccess={(contractId, updatedItems, additionalAmount) => {
                  updateInventory(updatedItems);
                  updateContractAmount(contractId, additionalAmount);
                }} 
              />
            </ManagerLayout>
          ) : <Navigate to="/login" />
        } />

        <Route path="/admin/*" element={
          userRole === 'admin' ? (
            <AdminLayout userRole={userRole} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                <Route path="dashboard" element={<Dashboard contracts={contracts} inventory={inventory} />} />
                <Route path="contracts" element={<Contracts contracts={contracts} />} />
                <Route path="contracts/:id" element={<ContractDetail contracts={contracts} inventory={inventory} onEndContract={closeContract} />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="inventory" element={<Inventory inventory={inventory} setInventory={setInventory} />} />
                <Route path="inventory/:id" element={<InventoryDetail inventory={inventory} />} />
                <Route path="reports" element={<Reports />} />
              </Routes>
            </AdminLayout>
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;
