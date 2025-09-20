
import { Sales, Customer, Vehicle, Expense, Reminder, Profile, AuditLog, User } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DataState {
  sales: Sales[];
  customers: Customer[];
  vehicles: Vehicle[];
  expenses: Expense[];
  reminders: Reminder[];
  profile: Profile | null;
  auditLogs: AuditLog[];
  currentUser: User;
  addSale: (sale: Sales) => void;
  updateSale: (sale: Sales) => void;
  deleteSale: (id: string) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  updateProfile: (profile: Profile) => void;
  restoreData: (data: Partial<DataState>) => void;
  importData: (data: Partial<DataState>) => void;
  clearData: () => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp' | 'userId' | 'userName'>) => void;
}

const initialState = {
  sales: [],
  customers: [],
  vehicles: [],
  expenses: [],
  reminders: [],
  profile: null,
  auditLogs: [],
  currentUser: { id: 'system', name: 'System' },
};

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
    (set, get) => ({
      ...initialState,
      addAuditLog: (log) => {
        const { currentUser } = get();
        const newLog: AuditLog = {
          id: String(Date.now()),
          timestamp: new Date().toISOString(),
          userId: currentUser.id,
          userName: currentUser.name,
          ...log,
        };
        set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
      },
      addSale: (sale) => {
        get().addAuditLog({ action: 'Created', entity: 'Sale', entityId: sale.id, details: `Created sale for ${sale.customer} for ₹${sale.price}` });
        set((state) => ({ sales: [...state.sales, sale] }));
      },
      updateSale: (sale) => {
        get().addAuditLog({ action: 'Updated', entity: 'Sale', entityId: sale.id, details: `Updated sale for ${sale.customer}` });
        set((state) => ({ sales: state.sales.map(s => s.id === sale.id ? sale : s) }));
      },
      deleteSale: (id) => {
        const sale = get().sales.find(s => s.id === id);
        if (sale) {
          get().addAuditLog({ action: 'Deleted', entity: 'Sale', entityId: id, details: `Deleted sale for ${sale.customer}` });
        }
        set((state) => ({ sales: state.sales.filter(s => s.id !== id) }));
      },
      addCustomer: (customer) => {
        get().addAuditLog({ action: 'Created', entity: 'Customer', entityId: customer.id, details: `Created customer: ${customer.name}` });
        set((state) => ({ customers: [...state.customers, customer] }));
      },
      updateCustomer: (customer) => {
        get().addAuditLog({ action: 'Updated', entity: 'Customer', entityId: customer.id, details: `Updated customer: ${customer.name}` });
        set((state) => ({ customers: state.customers.map(c => c.id === customer.id ? customer : c) }));
      },
      deleteCustomer: (id) => {
        const customer = get().customers.find(c => c.id === id);
        if (customer) {
          get().addAuditLog({ action: 'Deleted', entity: 'Customer', entityId: id, details: `Deleted customer: ${customer.name}` });
        }
        set((state) => ({ customers: state.customers.filter(c => c.id !== id) }));
      },
      addVehicle: (vehicle) => {
        get().addAuditLog({ action: 'Created', entity: 'Vehicle', entityId: vehicle.id, details: `Added vehicle: ${vehicle.vehicleNumber}` });
        set((state) => ({ vehicles: [...state.vehicles, vehicle] }));
      },
      updateVehicle: (vehicle) => {
        get().addAuditLog({ action: 'Updated', entity: 'Vehicle', entityId: vehicle.id, details: `Updated vehicle: ${vehicle.vehicleNumber}` });
        set((state) => ({ vehicles: state.vehicles.map(v => v.id === vehicle.id ? vehicle : v) }));
      },
      deleteVehicle: (id) => {
        const vehicle = get().vehicles.find(v => v.id === id);
        if(vehicle) {
          get().addAuditLog({ action: 'Deleted', entity: 'Vehicle', entityId: id, details: `Deleted vehicle: ${vehicle.vehicleNumber}` });
        }
        set((state) => ({ vehicles: state.vehicles.filter(v => v.id !== id) }));
      },
      addExpense: (expense) => {
        get().addAuditLog({ action: 'Created', entity: 'Expense', entityId: expense.id, details: `Added expense: ${expense.item} for ₹${expense.amount}` });
        set((state) => ({ expenses: [...state.expenses, expense] }));
      },
      updateExpense: (expense) => {
        get().addAuditLog({ action: 'Updated', entity: 'Expense', entityId: expense.id, details: `Updated expense: ${expense.item}` });
        set((state) => ({ expenses: state.expenses.map(e => e.id === expense.id ? expense : e) }));
      },
      deleteExpense: (id) => {
        const expense = get().expenses.find(e => e.id === id);
        if (expense) {
          get().addAuditLog({ action: 'Deleted', entity: 'Expense', entityId: id, details: `Deleted expense: ${expense.item}` });
        }
        set((state) => ({ expenses: state.expenses.filter(e => e.id !== id) }));
      },
      addReminder: (reminder) => {
        const entity = reminder.type === 'Credit' ? 'Collection' : 'Reminder';
        get().addAuditLog({ action: 'Created', entity, entityId: reminder.id, details: `Created ${entity.toLowerCase()}: ${reminder.details}` });
        set((state) => ({ reminders: [...state.reminders, reminder] }));
      },
      updateReminder: (reminder) => {
        const entity = reminder.type === 'Credit' ? 'Collection' : 'Reminder';
        get().addAuditLog({ action: 'Updated', entity, entityId: reminder.id, details: `Updated ${entity.toLowerCase()}: ${reminder.details}` });
        set((state) => ({ reminders: state.reminders.map(r => r.id === reminder.id ? reminder : r) }));
      },
      deleteReminder: (id) => {
        const reminder = get().reminders.find(r => r.id === id);
        if (reminder) {
          const entity = reminder.type === 'Credit' ? 'Collection' : 'Reminder';
          get().addAuditLog({ action: 'Deleted', entity, entityId: id, details: `Deleted ${entity.toLowerCase()}: ${reminder.details}` });
        }
        set((state) => ({ reminders: state.reminders.filter(r => r.id !== id) }));
      },
      updateProfile: (profile) => {
        get().addAuditLog({ action: 'Updated', entity: 'Profile', entityId: get().currentUser.id, details: `Profile was updated.` });
        set({ profile });
      },
      restoreData: (data) => set(data),
      importData: (data) => set((state) => ({
        sales: data.sales ? mergeById(state.sales, data.sales) : state.sales,
        customers: data.customers ? mergeById(state.customers, data.customers) : state.customers,
        vehicles: data.vehicles ? mergeById(state.vehicles, data.vehicles) : state.vehicles,
        expenses: data.expenses ? mergeById(state.expenses, data.expenses) : state.expenses,
        reminders: data.reminders ? mergeById(state.reminders, data.reminders) : state.reminders,
        profile: data.profile || state.profile,
        auditLogs: data.auditLogs ? mergeById(state.auditLogs, data.auditLogs) : state.auditLogs,
      })),
      clearData: () => set({...initialState}),
    }),
    {
      name: 'quarryflow-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
