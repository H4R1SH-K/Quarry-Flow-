'use client';

import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { Sales, Expense } from "@/lib/types";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  dieselCost: {
    label: "Diesel Cost",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface CostRevenueChartProps {
  sales: Sales[];
  expenses: Expense[];
}

const CostRevenueChartComponent = React.memo(function CostRevenueChartComponent({ sales, expenses }: CostRevenueChartProps) {

  const getChartData = () => {
    const dataByMonth: { [key: string]: { revenue: number, dieselCost: number }} = {};

    sales.forEach(sale => {
      const month = new Date(sale.date).toLocaleString('default', { month: 'long' });
      if (!dataByMonth[month]) {
        dataByMonth[month] = { revenue: 0, dieselCost: 0 };
      }
      dataByMonth[month].revenue += sale.price;
    });

    expenses.forEach(expense => {
      if (expense.category.toLowerCase() === 'fuel') { // Changed to fuel to be more generic
        const month = new Date(expense.date).toLocaleString('default', { month: 'long' });
        if (dataByMonth[month]) {
          dataByMonth[month].dieselCost += expense.amount;
        } else {
          dataByMonth[month] = { revenue: 0, dieselCost: expense.amount };
        }
      }
    });

    return Object.keys(dataByMonth).map(month => ({
      month,
      ...dataByMonth[month]
    })).sort((a, b) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months.indexOf(a.month) - months.indexOf(b.month);
    });
  }

  const chartData = getChartData();


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Cost vs. Revenue</CardTitle>
        <CardDescription>A comparison of fuel costs and total revenue.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis
              tickFormatter={(value) => `₹${Number(value) / 1000}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            <Bar dataKey="dieselCost" fill="var(--color-dieselCost)" radius={4} />
          </BarChart>
        </ChartContainer>
         ) : (
          <div className="flex flex-col justify-center items-center h-[300px] text-center">
            <p className="text-sm text-muted-foreground">No data to display for cost vs. revenue.</p>
            <p className="text-xs text-muted-foreground">Add sales and fuel expenses to see the chart.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
});

export const CostRevenueChart = (props: CostRevenueChartProps) => <CostRevenueChartComponent {...props} />;
