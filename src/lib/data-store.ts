import { Sales, Customer, Vehicle, Expense, Reminder } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DataState {
  sales: Sales[];
  customers: Customer[];
  vehicles: Vehicle[];
  expenses: Expense[];
  reminders: Reminder[];
  addSale: (sale: Sales) => void;
  updateSale: (sale: Sales) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminder: Reminder) => void;
  restoreData: (data: Partial<DataState>) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      sales: [],
      customers: [],
      vehicles: [],
      expenses: [],
      reminders: [],
      addSale: (sale) => set((state) => ({ sales: [...state.sales, sale] })),
      updateSale: (sale) => set((state) => ({ sales: state.sales.map(s => s.id === sale.id ? sale : s) })),
      addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
      updateCustomer: (customer) => set((state) => ({ customers: state.customers.map(c => c.id === customer.id ? customer : c) })),
      addVehicle: (vehicle) => set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
      updateVehicle: (vehicle) => set((state) => ({ vehicles: state.vehicles.map(v => v.id === vehicle.id ? vehicle : v) })),
      addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
      updateExpense: (expense) => set((state) => ({ expenses: state.expenses.map(e => e.id === expense.id ? expense : e) })),
      addReminder: (reminder) => set((state) => ({ reminders: [...state.reminders, reminder] })),
      updateReminder: (reminder) => set((state) => ({ reminders: state.reminders.map(r => r.id === reminder.id ? reminder : r) })),
      restoreData: (data) => set(data),
    }),
    {
      name: 'quarryflow-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
