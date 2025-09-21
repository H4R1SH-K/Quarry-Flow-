

export type Sale = {
    name: string;
    total: number;
};

export type RecentSale = {
    id: string;
    name:string;
    email: string;
    amount: string;
};

export type Sales = {
  id: string;
  customer: string;
  vehicle: string;
  loadSize: string;
  price: number;
  date: string;
  paymentMethod?: 'GPay' | 'Cash' | 'Card' | 'Internet Banking';
}

export type CostRevenue = {
    month: string;
    revenue: number;
    dieselCost: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: "Active" | "Inactive";
};

export type Vehicle = {
    id: string;
    make: string;
    model: string;
    year: number;
    vehicleNumber: string;
    status: "Active" | "Maintenance" | "Inactive";
};

export type Expense = {
    id: string;
    category: string;
    item: string;
    amount: number;
    date: string;
    vehicle?: string;
};

export type Reminder = {
  id: string;
  type: "Vehicle Permit" | "Insurance" | "Credit";
  details: string;
  dueDate: string;
  status: "Pending" | "Completed";
  relatedTo?: string; // Can be customerId or vehicleId
  relatedToName?: string;
  amount?: number;
};

export type Profile = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
};

export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type AuditLog = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: "Created" | "Updated" | "Deleted";
  entity: "Sale" | "Customer" | "Expense" | "Vehicle" | "Reminder" | "Collection" | "Profile";
  entityId: string;
  details: string;
};
