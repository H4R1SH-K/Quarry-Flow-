import { Sales, Customer, Vehicle, Expense, Reminder, Profile } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DataState {
  sales: Sales[];
  customers: Customer[];
  vehicles: Vehicle[];
  expenses: Expense[];
  reminders: Reminder[];
  profile: Profile | null;
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
  deleteReminder: (id: string) => void;
  updateProfile: (profile: Profile) => void;
  restoreData: (data: Partial<DataState>) => void;
  importData: (data: Partial<DataState>) => void;
}

const mergeById = <T extends { id: string }>(existing: T[], incoming: T[]): T[] => {
  const existingIds = new Set(existing.map(item => item.id));
  const newItems = incoming.filter(item => !existingIds.has(item.id));
  
  const updatedItems = existing.map(item => {
    const incomingItem = incoming.find(i => i.id === item.id);
    // Keep existing amount if incoming is null/undefined
    if (incomingItem && 'amount' in incomingItem && (incomingItem as any).amount == null) {
      (incomingItem as any).amount = (item as any).amount;
    }
    return incomingItem ? { ...item, ...incomingItem } : item;
  });

  return [...updatedItems, ...newItems];
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      sales: [],
      customers: [],
      vehicles: [],
      expenses: [],
      reminders: [],
      profile: null,
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
      deleteReminder: (id) => set((state) => ({ reminders: state.reminders.filter(r => r.id !== id) })),
      updateProfile: (profile) => set({ profile }),
      restoreData: (data) => set(data),
      importData: (data) => set((state) => ({
        sales: data.sales ? mergeById(state.sales, data.sales) : state.sales,
        customers: data.customers ? mergeById(state.customers, data.customers) : state.customers,
        vehicles: data.vehicles ? mergeById(state.vehicles, data.vehicles) : state.vehicles,
        expenses: data.expenses ? mergeById(state.expenses, data.expenses) : state.expenses,
        reminders: data.reminders ? mergeById(state.reminders, data.reminders) : state.reminders,
        profile: data.profile || state.profile,
      })),
    }),
    {
      name: 'quarryflow-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
