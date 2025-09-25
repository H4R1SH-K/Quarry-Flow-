
import type { Profile, Sales, Customer, Vehicle, Expense, Reminder, AuditLog } from '@/lib/types';
import { initialState } from '@/lib/sample-data';

// This file is no longer used as data fetching is now client-side.
// We keep it to prevent build errors from pages that might still import it,
// but it returns empty sample data.

type DashboardData = {
  sales: Sales[];
  customers: Customer[];
  vehicles: Vehicle[];
  expenses: Expense[];
  reminders: Reminder[];
  profile: Profile | null;
  error?: string | null;
  auditLogs: AuditLog[];
};


export async function getDashboardData(): Promise<DashboardData> {
  // Return empty initial state as all data is now handled on the client.
  return {...initialState, profile: initialState.profile, error: null, auditLogs: []};
}
