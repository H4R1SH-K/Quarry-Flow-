
import type { Sales, Customer, Vehicle, Expense, Reminder, Profile, AuditLog } from '@/lib/types';

const customers: Customer[] = [];

const vehicles: Vehicle[] = [];

const sales: Sales[] = [];

const expenses: Expense[] = [];

const reminders: Reminder[] = [];

const profile: Profile = {
    name: "",
    email: "",
    phone: "",
    companyName: "",
    address: ""
};

const auditLogs: AuditLog[] = [];

export const initialState = {
    sales,
    customers,
    vehicles,
    expenses,
    reminders,
    profile,
    auditLogs,
}
