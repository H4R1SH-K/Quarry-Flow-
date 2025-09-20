import type { Sale, RecentSale, CostRevenue } from "./types";

export const salesData: Sale[] = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
];

export const recentSales: RecentSale[] = [
    { id: "1", name: "Olivia Martin", initials: "OM", email: "olivia.martin@email.com", amount: "+$1,999.00" },
    { id: "2", name: "Jackson Lee", initials: "JL", email: "jackson.lee@email.com", amount: "+$39.00" },
    { id: "3", name: "Isabella Nguyen", initials: "IN", email: "isabella.nguyen@email.com", amount: "+$299.00" },
    { id: "4", name: "William Kim", initials: "WK", email: "will@email.com", amount: "+$99.00" },
    { id: "5", name: "Sofia Davis", initials: "SD", email: "sofia.davis@email.com", amount: "+$39.00" },
];

export const costRevenueData: CostRevenue[] = [
  { month: "January", revenue: 1860, dieselCost: 800 },
  { month: "February", revenue: 3050, dieselCost: 1200 },
  { month: "March", revenue: 2370, dieselCost: 950 },
  { month: "April", revenue: 4730, dieselCost: 1800 },
  { month: "May", revenue: 3980, dieselCost: 1500 },
  { month: "June", revenue: 4800, dieselCost: 1900 },
];
