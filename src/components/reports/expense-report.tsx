'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IndianRupee, FileDown, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useDataStore } from '@/lib/data-store';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, sub } from 'date-fns';
import type { DateRange } from 'react-day-picker';

export function ExpenseReport() {
  const { expenses } = useDataStore();
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year' | 'custom'>('all');
  const [date, setDate] = useState<DateRange | undefined>({
    from: sub(new Date(), {days: 30}),
    to: new Date(),
  });

  const getFilteredExpenses = () => {
    const now = new Date();
    if (filter === 'today') {
      return expenses.filter(e => new Date(e.date).toDateString() === now.toDateString());
    }
    if (filter === 'week') {
      const start = startOfWeek(now);
      const end = endOfWeek(now);
      return expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= start && expenseDate <= end;
      });
    }
    if (filter === 'month') {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      return expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= start && expenseDate <= end;
      });
    }
    if (filter === 'year') {
      const start = startOfYear(now);
      const end = endOfYear(now);
      return expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= start && expenseDate <= end;
      });
    }
    if (filter === 'custom' && date?.from && date?.to) {
        return expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate >= date.from! && expenseDate <= date.to!;
        });
    }
    return expenses; // 'all'
  }

  const filteredExpenses = getFilteredExpenses();

  const totalExpenses = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);

  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    const category = expense.category;
    const amount = expense.amount;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory =
    filteredExpenses.length > 0
      ? Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0]
      : ['N/A', 0];

  const handleExport = () => {
    const doc = new jsPDF();
    const tableData = filteredExpenses.map(e => {
      return [
        e.category, 
        e.item, 
        e.vehicle || 'N/A',
        `₹${e.amount.toLocaleString('en-IN')}`, 
        new Date(e.date).toLocaleDateString('en-IN')
      ]
    });
    const tableHead = [['Category', 'Item/Description', 'Vehicle', 'Amount', 'Date']];
    const generationDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let filterText = "All Time";
    if (filter === 'today') filterText = 'Today';
    if (filter === 'week') filterText = 'This Week';
    if (filter === 'month') filterText = 'This Month';
    if (filter === 'year') filterText = 'This Year';
    if (filter === 'custom' && date?.from && date?.to) {
      filterText = `${format(date.from, 'PPP')} to ${format(date.to, 'PPP')}`;
    }

    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('QuarryFlow', 15, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Expense Report', 15, 26);
    doc.text(`Period: ${filterText}`, 200, 20, { align: 'right' });
    doc.text(`Generated on: ${generationDate}`, 200, 26, { align: 'right' });
    doc.line(15, 30, 200, 30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 15, 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}`, 15, 48);
    doc.text(`Top Expense Category: ${topCategory[0]} (₹${Number(topCategory[1]).toLocaleString('en-IN')})`, 15, 54);

    (doc as any).autoTable({
      head: tableHead,
      body: tableData,
      startY: 65,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      didDrawPage: (data: any) => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          'Generated by QuarryFlow',
          doc.internal.pageSize.width - data.settings.margin.right,
          doc.internal.pageSize.height - 10,
          { align: 'right' }
        );
      },
    });

    doc.save(`QuarryFlow_Expense_Report_${filterText.replace(/ /g, '_')}.pdf`);
  };


  return (
    <Card>
      <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <CardTitle className="font-headline">Expense Report</CardTitle>
          <CardDescription>A summary of your business expenses based on the selected period.</CardDescription>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
           <Button onClick={handleExport} disabled={filteredExpenses.length === 0}>
             <FileDown className="mr-2 h-4 w-4" />
             Export as PDF
           </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All Time</Button>
          <Button variant={filter === 'today' ? 'default' : 'outline'} onClick={() => setFilter('today')}>Today</Button>
          <Button variant={filter === 'week' ? 'default' : 'outline'} onClick={() => setFilter('week')}>This Week</Button>
          <Button variant={filter === 'month' ? 'default' : 'outline'} onClick={() => setFilter('month')}>This Month</Button>
          <Button variant={filter === 'year' ? 'default' : 'outline'} onClick={() => setFilter('year')}>This Year</Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  filter === 'custom' && 'border-primary'
                )}
                onClick={() => setFilter('custom')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Expense Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topCategory[0]}</div>
              <p className="text-xs text-muted-foreground">
                ₹{Number(topCategory[1]).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Expense Breakdown</h3>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map(expense => {
                      return (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.category}
                        </TableCell>
                        <TableCell>{expense.item}</TableCell>
                         <TableCell>{expense.vehicle || 'N/A'}</TableCell>
                        <TableCell>₹{expense.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{new Date(expense.date).toLocaleDateString('en-IN')}</TableCell>
                      </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No expenses found for the selected period.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
