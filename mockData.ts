
import { Contract, Transaction, Equipment, MovementHistory } from './types';

export const contracts: Contract[] = [
  { 
    id: 'CON-001', 
    partyName: 'Rishi Productions', 
    partyType: 'Customer', 
    direction: 'OUT', 
    startDate: '2023-10-15', 
    status: 'Ongoing', 
    totalAmount: 425000, 
    manager: 'Ravi',
    duration: 45,
    quotations: [{ version: 1, editCount: 1, totalAmount: 425000, items: [], status: 'Approved', submittedAt: '2023-10-15' }]
  },
  { 
    id: 'CON-002', 
    partyName: 'Mumbai Light House', 
    partyType: 'Vendor', 
    direction: 'IN', 
    startDate: '2024-11-01', 
    status: 'Ongoing', 
    totalAmount: 185000, 
    manager: 'Prasad',
    duration: 45,
    quotations: [{ version: 1, editCount: 1, totalAmount: 185000, items: [], status: 'Approved', submittedAt: '2024-11-01' }]
  },
  { 
    id: 'CON-004', 
    partyName: 'Lotus Films', 
    partyType: 'Customer', 
    direction: 'OUT', 
    startDate: '2024-11-10', 
    status: 'Quotation Pending', 
    totalAmount: 880000, 
    manager: 'Shekar',
    duration: 45,
    quotations: [{ version: 1, editCount: 1, totalAmount: 880000, items: [], status: 'Submitted', submittedAt: '2024-11-10' }]
  },
  { 
    id: 'CON-005', 
    partyName: 'Suresh Arts', 
    partyType: 'Customer', 
    direction: 'OUT', 
    startDate: '2023-05-20', 
    status: 'Closed', 
    totalAmount: 320000, 
    manager: 'Ravi',
    duration: 30,
    quotations: [{ version: 1, editCount: 3, totalAmount: 320000, items: [], status: 'Approved', submittedAt: '2023-06-20' }]
  },
  { 
    id: 'CON-006', 
    partyName: 'Venkata Rentals', 
    partyType: 'Vendor', 
    direction: 'IN', 
    startDate: '2023-08-12', 
    status: 'Closed', 
    totalAmount: 95000, 
    manager: 'Prasad',
    duration: 15,
    quotations: [{ version: 1, editCount: 0, totalAmount: 95000, items: [], status: 'Approved', submittedAt: '2023-08-27' }]
  },
];

export const transactions: Transaction[] = [
  { id: 'TRX-1001', contractId: 'CON-001', date: '2023-10-15', partyName: 'Rishi Productions', direction: 'OUT', itemCount: 12, amount: 85000, tax: 15300, netAmount: 100300, manager: 'Ravi', notes: 'Phase 1 Production Gear' },
  { id: 'TRX-1002', contractId: 'CON-002', date: '2024-11-01', partyName: 'Mumbai Light House', direction: 'IN', itemCount: 8, amount: 60000, tax: 10800, netAmount: 70800, manager: 'Prasad', notes: 'Backfill for Wedding Season' },
];

const generateUnits = (baseId: string, name: string, category: any, count: number, price: number, startCode: number): Equipment[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${baseId}-${i + 1}`,
    name,
    code: `${category.substring(0, 3).toUpperCase()}-${name.replace(/\s+/g, '-').toUpperCase()}-${startCode + i}`,
    category,
    price,
    status: i % 5 === 0 ? 'Outward (Customer)' : i % 8 === 0 ? 'Outward (Vendor)' : 'Available',
    currentHolder: i % 5 === 0 ? 'Lotus Films' : i % 8 === 0 ? 'Mumbai Light House' : 'Main Warehouse',
    contractId: i % 5 === 0 ? 'CON-004' : i % 8 === 0 ? 'CON-002' : 'N/A',
    lastMovementDate: '2023-11-15',
  }));
};

export const inventory: Equipment[] = [
  ...generateUnits('CAM-LF', 'Alexa LF', 'Cameras', 12, 50000, 2922),
  ...generateUnits('CAM-MINI', 'Alexa Mini', 'Cameras', 18, 45000, 22999),
  ...generateUnits('CAM-RED', 'RED V-Raptor', 'Cameras', 8, 35000, 1001),
  ...generateUnits('LNS-CK7', 'Cooke 7i Prime Set', 'Lenses', 24, 15000, 7050),
  ...generateUnits('LNS-AR', 'Arri Signature Prime', 'Lenses', 15, 18000, 4000),
  ...generateUnits('ZM-AG', 'Angenieux Optimo', 'Zooms', 6, 25000, 240),
  ...generateUnits('ACC-TR', 'Teradek Bolt 3000', 'Accessories', 32, 5000, 3000),
  ...generateUnits('ACC-WL', 'Wireless Follow Focus', 'Accessories', 20, 4500, 500),
];

export const getMovementHistory = (code: string): MovementHistory[] => [
  { date: '2023-11-10', contractId: 'CON-004', direction: 'OUT', partyName: 'Lotus Films', manager: 'Shekar' },
  { date: '2023-10-01', contractId: 'CON-005', direction: 'IN', partyName: 'Chennai Camera Rentals', manager: 'Prasad' },
  { date: '2023-09-15', contractId: 'CON-001', direction: 'OUT', partyName: 'Rishi Productions', manager: 'Ravi' },
];
