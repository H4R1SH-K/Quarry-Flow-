

import type { Sales, Customer, Vehicle, Expense, Reminder } from '@/lib/types';

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
  
  const mockSales: Sales[] = [];

  const mockCustomers: Customer[] = [];

  const mockVehicles: Vehicle[] = [];
  
  const mockExpenses: Expense[] = [];

  const mockReminders: Reminder[] = [];

  return {
    sales: mockSales,
    customers: mockCustomers,
    vehicles: mockVehicles,
    expenses: mockExpenses,
    reminders: mockReminders,
  };
}
