import { Sales, Customer, Vehicle, Expense } from '@/lib/types';
import { create } from 'zustand';

interface DataState {
  sales: Sales[];
  customers: Customer[];
  vehicles: Vehicle[];
  expenses: Expense[];
  addSale: (sale: Sales) => void;
  addCustomer: (customer: Customer) => void;
  addVehicle: (vehicle: Vehicle) => void;
  addExpense: (expense: Expense) => void;
}

export const useDataStore = create<DataState>((set) => ({
  sales: [],
  customers: [],
  vehicles: [],
  expenses: [],
  addSale: (sale) => set((state) => ({ sales: [...state.sales, sale] })),
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
  addVehicle: (vehicle) => set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
  addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
}));
