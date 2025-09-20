"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useDataStore } from "@/lib/data-store";

export function SalesChart() {
  const { sales } = useDataStore();

  const getSalesDataForChart = () => {
    const monthlySales: { [key: string]: number } = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };

    sales.forEach(sale => {
      const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
      monthlySales[month] += sale.price;
    });

    return Object.keys(monthlySales).map(month => ({
      name: month,
      total: monthlySales[month]
    }));
  }

  const salesData = getSalesDataForChart();


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Sales Growth</CardTitle>
        <CardDescription>Your sales performance over the last months.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
      {sales.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={salesData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Bar
              dataKey="total"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-[350px]">
            <p className="text-sm text-muted-foreground">No sales data to display.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
