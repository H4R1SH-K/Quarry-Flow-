import type { Sale, RecentSale, CostRevenue } from "./types";

export const salesData: Sale[] = [
  { name: "Jan", total: Math.floor(Math.random() * 400000) + 100000 },
  { name: "Feb", total: Math.floor(Math.random() * 400000) + 100000 },
  { name: "Mar", total: Math.floor(Math.random() * 400000) + 100000 },
  { name: "Apr", total: Math.floor(Math.random() * 400000) + 100000 },
  { name: "May", total: Math.floor(Math.random() * 400000) + 100000 },
  { name: "Jun", total: Math.floor(Math.random() * 400000) + 100000 },
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
