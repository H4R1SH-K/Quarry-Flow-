import { Sales, Customer, Vehicle, Expense } from '@/lib/types';
import { create } from 'zustand';

interface DataState {
  sales: Sales[];
  customers: Customer[];
  vehicles: Vehicle[];
  expenses: Expense[];
  addSale: (sale: Sales) => void;
  updateSale: (sale: Sales) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
}

export const useDataStore = create<DataState>((set) => ({
  sales: [],
  customers: [],
  vehicles: [],
  expenses: [],
  addSale: (sale) => set((state) => ({ sales: [...state.sales, sale] })),
  updateSale: (sale) => set((state) => ({ sales: state.sales.map(s => s.id === sale.id ? sale : s) })),
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
  updateCustomer: (customer) => set((state) => ({ customers: state.customers.map(c => c.id === customer.id ? customer : c) })),
  addVehicle: (vehicle) => set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
  updateVehicle: (vehicle) => set((state) => ({ vehicles: state.vehicles.map(v => v.id === vehicle.id ? vehicle : v) })),
  addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
  updateExpense: (expense) => set((state) => ({ expenses: state.expenses.map(e => e.id === expense.id ? expense : e) })),
}));