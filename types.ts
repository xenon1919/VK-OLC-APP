
export type Direction = 'IN' | 'OUT';
export type PartyType = 'Customer' | 'Vendor';
export type ContractStatus = 'Open' | 'Closed';
export type EquipmentCategory = 'Cameras' | 'Lenses' | 'Zooms' | 'Accessories' | 'Lights';
export type EquipmentStatus = 'Available' | 'Outward (Customer)' | 'Outward (Vendor)' | 'Maintenance' | 'Lost';

export interface Contract {
  id: string;
  partyName: string;
  partyType: PartyType;
  direction: Direction;
  startDate: string;
  status: ContractStatus;
  totalAmount: number;
  manager: string;
  duration?: number;
  projectName?: string;
  assignedCustomer?: string;
  assignedProject?: string;
  billTo?: string;
}

export interface Transaction {
  id: string;
  contractId: string;
  date: string;
  partyName: string;
  direction: Direction;
  itemCount: number;
  amount: number;
  tax: number;
  netAmount: number;
  manager: string;
  notes?: string;
}

export interface Equipment {
  id: string;
  name: string;
  code: string;
  category: EquipmentCategory;
  price: number;
  status: EquipmentStatus;
  currentHolder: string;
  contractId: string;
  lastMovementDate: string;
}

export interface MovementHistory {
  date: string;
  contractId: string;
  direction: Direction;
  partyName: string;
  manager: string;
}

export interface SelectedItem extends Equipment {
  editablePrice: number;
}