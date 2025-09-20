export type Sale = {
    name: string;
    total: number;
};

export type RecentSale = {
    id: string;
    name: string;
    initials: string;
    email: string;
    amount: string;
};

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
    vin: string;
    status: "Active" | "Maintenance" | "Inactive";
};

export type Expense = {
    id: string;
    category: string;
    item: string;
    amount: string;
    date: string;
};