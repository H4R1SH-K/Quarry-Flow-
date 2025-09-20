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

export const customerData: Customer[] = [
    { id: "1", name: "Ravi Kumar", email: "ravi.kumar@example.com", phone: "9876543210", company: "Ravi Construction", status: "Active" },
    { id: "2", name: "Priya Sharma", email: "priya.sharma@example.com", phone: "8765432109", company: "Sharma Builders", status: "Active" },
    { id: "3", name: "Amit Singh", email: "amit.singh@example.com", phone: "7654321098", company: "Singh Infra", status: "Inactive" },
    { id: "4", name: "Sunita Reddy", email: "sunita.reddy@example.com", phone: "6543210987", company: "Reddy & Co.", status: "Active" },
];

export const vehicleData: Vehicle[] = [
    { id: "1", make: "Tata", model: "Prima", year: 2022, vin: "TN01AB1234", status: "Active" },
    { id: "2", make: "Ashok Leyland", model: "Captain", year: 2021, vin: "TN02CD5678", status: "Maintenance" },
    { id: "3", make: "Mahindra", model: "Blazo", year: 2023, vin: "TN03EF9012", status: "Active" },
];

export const expenseData: Expense[] = [
    { id: "1", category: "Fuel", item: "Diesel for Truck TN01AB1234", amount: "₹15,000", date: "2024-07-25" },
    { id: "2", category: "Maintenance", item: "Tyre Replacement", amount: "₹25,000", date: "2024-07-22" },
    { id: "3", category: "Salary", item: "Driver Salary - June", amount: "₹40,000", date: "2024-07-05" },
];
