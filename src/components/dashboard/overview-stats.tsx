'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Users, TrendingUp } from "lucide-react";
import { useDataStore } from "@/lib/data-store";

export function OverviewStats() {
    const { sales, expenses, customers } = useDataStore();

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.price, 0);
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const totalCustomers = customers.length;

    const formatCurrency = (amount: number) => {
        return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;
    }

    const stats = [
        {
            title: "Total Revenue",
            value: formatCurrency(totalRevenue),
            description: "Calculated from all sales",
            icon: IndianRupee
        },
        {
            title: "Total Expenses",
            value: formatCurrency(totalExpenses),
            description: "Calculated from all expenses",
            icon: IndianRupee
        },
        {
            title: "Net Profit",
            value: formatCurrency(netProfit),
            description: "Revenue minus expenses",
            icon: TrendingUp
        },
        {
            title: "Total Customers",
            value: `${totalCustomers}`,
            description: "Total number of customers",
            icon: Users
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
