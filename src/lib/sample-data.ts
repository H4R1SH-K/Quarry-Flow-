
import type { Sales, Customer, Vehicle, Expense, Reminder } from '@/lib/types';

const customers: Customer[] = [
  { id: '1', name: 'BuildRight Pvt Ltd', email: 'contact@buildright.com', phone: '9876543210', company: 'BuildRight Pvt Ltd', address: '123 Construction Way, Bangalore', status: 'Active' },
  { id: '2', name: 'Civil Works Co', email: 'admin@civilworks.com', phone: '8765432109', company: 'Civil Works Co', address: '456 Engineering Rd, Hyderabad', status: 'Active' },
  { id: '3', name: 'Mega Infra Ltd', email: 'infra@mega.com', phone: '7654321098', company: 'Mega Infra Ltd', address: '789 Infrastructure Blvd, Chennai', status: 'Active' },
  { id: '4', name: 'New Customer Inc', email: 'new@customer.com', phone: '6543210987', company: 'New Customer Inc', address: '101 Startup Lane, Pune', status: 'Inactive' },
];

const vehicles: Vehicle[] = [
  { id: '1', make: 'Tata', model: 'Tipper', year: 2022, vehicleNumber: 'TS 09 XY 5678', status: 'Active' },
  { id: '2', make: 'Ashok Leyland', model: 'Captain', year: 2021, vehicleNumber: 'KA 01 CD 4321', status: 'Active' },
  { id: '3', make: 'BharatBenz', model: '3128CM', year: 2023, vehicleNumber: 'AP 05 AB 1234', status: 'Maintenance' },
];

const sales: Sales[] = [
  { 
    id: '1714881600000', 
    customer: 'New Customer Inc', 
    vehicle: 'TS 09 XY 5678', 
    date: '2024-05-05', 
    paymentMethod: 'GPay',
    items: [
      { id: '1', description: 'River Sand', quantity: 20, unit: 'Ton', unitPrice: 2100, total: 42000 },
      { id: '2', description: 'Service Charge', quantity: 1, unit: 'Trip', unitPrice: 1024, total: 1024 }
    ],
    price: 43024
  },
  { 
    id: '1720843200000', 
    customer: 'BuildRight Pvt Ltd', 
    vehicle: 'TS 09 XY 5678', 
    date: '2024-07-13',
    paymentMethod: 'Cash',
    items: [
      { id: '1', description: 'Crushed Stone (20mm)', quantity: 15, unit: 'Ton', unitPrice: 2000, total: 30000 },
      { id: '2', description: 'Transportation', quantity: 1, unit: 'Trip', unitPrice: 1619, total: 1619 }
    ],
    price: 31619
  },
  { 
    id: '1718251200000', 
    customer: 'Civil Works Co', 
    vehicle: 'AP 05 AB 1234', 
    date: '2024-06-13',
    paymentMethod: 'Card',
    items: [
      { id: '1', description: 'Manufactured Sand', quantity: 1, unit: 'Load', unitPrice: 31078, total: 31078 }
    ],
    price: 31078
  },
  { 
    id: '1713758400000', 
    customer: 'Civil Works Co', 
    vehicle: 'KA 01 CD 4321', 
    date: '2024-04-22',
    paymentMethod: 'Internet Banking',
    items: [
       { id: '1', description: 'Gravel (10mm)', quantity: 25, unit: 'Ton', unitPrice: 2099.72, total: 52493 }
    ],
    price: 52493
  }
];

const expenses: Expense[] = [
  { id: '1', category: 'Fuel', item: 'Diesel for TS 09 XY 5678', amount: 15000, date: '2024-07-01', vehicle: 'TS 09 XY 5678' },
  { id: '2', category: 'Maintenance', item: 'Tyre Replacement for KA 01 CD 4321', amount: 25000, date: '2024-07-05', vehicle: 'KA 01 CD 4321' },
  { id: '3', category: 'Salary', item: 'Driver Salary - June', amount: 40000, date: '2024-07-08' },
  { id: '4', category: 'Quarry Royalty', item: 'Royalty payment for June', amount: 50000, date: '2024-07-10' },
  { id: '5', category: 'Miscellaneous', item: 'Office Supplies', amount: 5000, date: '2024-07-12' },
];

const reminders: Reminder[] = [
  { id: '1', type: 'Insurance', details: 'Renew insurance for TS 09 XY 5678', dueDate: '2024-08-15', status: 'Pending', relatedTo: '1', relatedToName: 'TS 09 XY 5678' },
  { id: '2', type: 'Vehicle Permit', details: 'Renew FC for KA 01 CD 4321', dueDate: '2024-09-01', status: 'Pending', relatedTo: '2', relatedToName: 'KA 01 CD 4321' },
  { id: '3', type: 'Credit', details: 'Payment from BuildRight for Invoice #1720843200000', dueDate: '2024-07-28', status: 'Pending', relatedTo: '1', relatedToName: 'BuildRight Pvt Ltd', amount: 31619 },
  { id: '4', type: 'Credit', details: 'Follow up on pending payment from Civil Works Co', dueDate: '2024-08-05', status: 'Pending', relatedTo: '2', relatedToName: 'Civil Works Co', amount: 52493 },
  { id: '5', type: 'Insurance', details: 'Insurance renewal for AP 05 AB 1234', dueDate: '2024-06-01', status: 'Completed', relatedTo: '3', relatedToName: 'AP 05 AB 1234' },
];

export const initialState = {
    sales,
    customers,
    vehicles,
    expenses,
    reminders
}
