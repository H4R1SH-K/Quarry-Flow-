import type { Sale, RecentSale, CostRevenue, Customer, Vehicle, Expense } from "./types";

export const salesData: Sale[] = [
  { name: "Jan", total: 325000 },
  { name: "Feb", total: 280000 },
  { name: "Mar", total: 350000 },
  { name: "Apr", total: 420000 },
  { name: "May", total: 390000 },
  { name: "Jun", total: 450000 },
];

export const recentSales: RecentSale[] = [
    { id: "1", name: "Olivia Martin", initials: "OM", email: "olivia.martin@email.com", amount: "+₹1,99,900" },
    { id: "2", name: "Jackson Lee", initials: "JL", email: "jackson.lee@email.com", amount: "+₹3,900" },
    { id: "3", name: "Isabella Nguyen", initials: "IN", email: "isabella.nguyen@email.com", amount: "+₹29,900" },
    { id: "4", name: "William Kim", initials: "WK", email: "will@email.com", amount: "+₹9,900" },
    { id: "5", name: "Sofia Davis", initials: "SD", email: "sofia.davis@email.com", amount: "+₹3,900" },
];

export const costRevenueData: CostRevenue[] = [
  { month: "January", revenue: 186000, dieselCost: 80000 },
  { month: "February", revenue: 305000, dieselCost: 120000 },
  { month: "March", revenue: 237000, dieselCost: 95000 },
  { month: "April", revenue: 473000, dieselCost: 180000 },
  { month: "May", revenue: 398000, dieselCost: 150000 },
  { month: "June", revenue: 480000, dieselCost: 190000 },
];

export const customerData: Customer[] = [];

export const vehicleData: Vehicle[] = [];

export const expenseData: Expense[] = [];
