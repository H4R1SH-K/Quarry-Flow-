import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Users, CreditCard, TrendingUp } from "lucide-react";

export function OverviewStats() {
    const stats = [
        {
            title: "Total Revenue",
            value: "₹3,754,247",
            description: "+20.1% from last month",
            icon: IndianRupee
        },
        {
            title: "Total Expenses",
            value: "₹1,068,652",
            description: "+15.2% from last month",
            icon: CreditCard
        },
        {
            title: "Net Profit",
            value: "₹2,685,595",
            description: "+22.5% from last month",
            icon: TrendingUp
        },
        {
            title: "Top Customers",
            value: "+573",
            description: "+20 since last week",
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
