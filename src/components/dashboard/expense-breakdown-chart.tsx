
"use client"

import { useMemo, useState, useEffect, useTransition } from "react";
import { Pie, PieChart, Cell } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { getExpenses } from "@/lib/firebase-service";
import type { Expense } from "@/lib/types";
import { PieChartIcon, Loader2 } from "lucide-react"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function ExpenseBreakdownChart() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const fetchedExpenses = await getExpenses();
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error("Failed to fetch expenses for chart:", error);
      }
    });
  }, []);

  const chartData = useMemo(() => {
    const dataByCategory = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { name: expense.category, value: 0 };
      }
      acc[expense.category].value += expense.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number }>);
    
    return Object.values(dataByCategory);
  }, [expenses]);

  const chartConfig = useMemo(() => {
    const config: any = {};
    chartData.forEach((data, index) => {
      config[data.name] = {
        label: data.name,
        color: COLORS[index % COLORS.length]
      }
    });
    return config;
  }, [chartData]);


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <PieChartIcon className="h-6 w-6"/>
            <CardTitle className="font-headline">Expense Breakdown</CardTitle>
        </div>
        <CardDescription>A breakdown of your expenses by category.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex justify-center items-center h-[250px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                cy={125}
              >
                 {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex justify-center items-center h-[250px]">
            <p className="text-sm text-muted-foreground">No expense data to display.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
