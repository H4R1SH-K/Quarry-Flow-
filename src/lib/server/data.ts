

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
  
  const mockSales: Sales[] = [
    { id: '1', customer: 'Olivia Martin', vehicle: 'TN 01 AB 1234', items: [{id: '1', description: 'Sand', quantity: 10, unit: 'Ton', unitPrice: 2500, total: 25000}], price: 25000, date: '2024-05-20' },
    { id: '2', customer: 'Jackson Lee', vehicle: 'TN 02 CD 5678', items: [{id: '1', description: 'Gravel', quantity: 12, unit: 'Ton', unitPrice: 2500, total: 30000}], price: 30000, date: '2024-05-19' },
    { id: '3', customer: 'Isabella Nguyen', vehicle: 'TN 03 EF 9012', items: [{id: '1', description: 'Sand', quantity: 8, unit: 'Ton', unitPrice: 2500, total: 20000}], price: 20000, date: '2024-05-18' },
    { id: '4', customer: 'William Kim', vehicle: 'TN 04 GH 3456', items: [{id: '1', description: 'Rock', quantity: 15, unit: 'Ton', unitPrice: 2500, total: 37500}], price: 37500, date: '2024-05-17' },
    { id: '5', customer: 'Sofia Davis', vehicle: 'TN 05 IJ 7890', items: [{id: '1', description: 'Sand', quantity: 9, unit: 'Ton', unitPrice: 2500, total: 22500}], price: 22500, date: '2024-05-16' },
  ];

  const mockCustomers: Customer[] = [
      { id: '1', name: 'Olivia Martin', email: 'olivia.martin@email.com', phone: '123-456-7890', company: 'BuildRight', address: '123 Main St', status: 'Active' },
      { id: '2', name: 'Jackson Lee', email: 'jackson.lee@email.com', phone: '123-456-7890', company: 'ConstructCo', address: '456 Oak Ave', status: 'Active' },
      { id: '3', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', phone: '123-456-7890', company: 'InfraWorks', address: '789 Pine Rd', status: 'Active' },
      { id: '4', name: 'William Kim', email: 'william.kim@email.com', phone: '123-456-7890', company: 'MegaBuilders', address: '101 Maple Dr', status: 'Active' },
      { id: '5', name: 'Sofia Davis', email: 'sofia.davis@email.com', phone: '123-456-7890', company: 'CityScapes', address: '212 Birch Ln', status: 'Active' },
  ];

  const mockVehicles: Vehicle[] = [
      { id: '1', make: 'Tata', model: 'Prima', year: 2022, vehicleNumber: 'TN 01 AB 1234', status: 'Active' },
      { id: '2', make: 'Ashok Leyland', model: 'Captain', year: 2021, vehicleNumber: 'TN 02 CD 5678', status: 'Active' },
      { id: '3', make: 'BharatBenz', model: '3128CM', year: 2023, vehicleNumber: 'TN 03 EF 9012', status: 'Maintenance' },
  ];
  
  const mockExpenses: Expense[] = [
      { id: '1', category: 'Diesel', item: 'Fuel for TN 01 AB 1234', amount: 5000, date: '2024-05-20' },
      { id: '2', category: 'Maintenance', item: 'Tire Replacement', amount: 15000, date: '2024-05-18' },
  ];

  const mockReminders: Reminder[] = [];

  return {
    sales: mockSales,
    customers: mockCustomers,
    vehicles: mockVehicles,
    expenses: mockExpenses,
    reminders: mockReminders,
  };
}
