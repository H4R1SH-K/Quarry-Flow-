
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
    vehicleId?: string;
};

export type Reminder = {
  id: string;
  type: "Vehicle Permit" | "Insurance" | "Credit";
  details: string;
  dueDate: string;
  status: "Pending" | "Completed";
  relatedTo?: string; // Can be customerId or vehicleId
  relatedToName?: string;
};

