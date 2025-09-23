
import { Sales, Customer, Vehicle, Expense, Reminder, Profile, AuditLog, User } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { initialState as sampleData } from '@/lib/sample-data';

export interface DataState {
  sales: Sales[];
  customers: Customer[];
  vehicles: Vehicle[];
  expenses: Expense[];
  reminders: Reminder[];
  profile: Profile | null;
  auditLogs: AuditLog[];
  currentUser: User;
  // Note: add/update/delete functions for large collections are being removed
  // as data is now fetched directly from Firebase in each component.
  // This reduces client-side memory usage and improves performance.
  updateProfile: (profile: Profile) => void;
  restoreData: (data: Partial<DataState>) => void;
  importData: (data: Partial<DataState>) => void;
  clearData: () => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp' | 'userId' | 'userName'>) => void;
}

const initialState = {
  ...sampleData,
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
      clearData: () => set({...initialState, sales: [], customers: [], vehicles: [], expenses: [], reminders: [], auditLogs: [] }),
    }),
    {
      name: 'quarryflow-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist a subset of the data. Large collections are fetched from Firebase.
      partialize: (state) => ({
        profile: state.profile,
        auditLogs: state.auditLogs,
        currentUser: state.currentUser,
      }),
    }
  )
);
