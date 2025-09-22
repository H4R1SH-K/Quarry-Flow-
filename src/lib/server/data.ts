

import type { Sales, Customer, Vehicle, Expense, Reminder } from '@/lib/types';
import { initialState } from '@/lib/sample-data';

// In a real application, this would fetch data from a database or API.
// For this local-first app, we'll return mock data on the server
// as server components cannot access localStorage.
// The client-side components will use the real data from the Zustand store.

export async function getDashboardData(): Promise<{
  sales: Sales[];
  customers: Customer[];
  vehicles: Vehicle[];
  expenses: Expense[];
  reminders: Reminder[];
}> {
  // We return the sample data here for server-side rendering consistency.
  // The client will hydrate with its own state from localStorage.
  return {
    sales: initialState.sales,
    customers: initialState.customers,
    vehicles: initialState.vehicles,
    expenses: initialState.expenses,
    reminders: initialState.reminders,
  };
}
