
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IndianRupee, FileDown, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useDataStore } from '@/lib/data-store';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, sub, isValid } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import type { Sales, Expense, Reminder } from '@/lib/types';

export function ExpenseReport() {
  const { expenses, sales, profile, reminders } = useDataStore();
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year' | 'custom'>('all');
  const [date, setDate] = useState<DateRange | undefined>({
    from: sub(new Date(), {days: 30}),
    to: new Date(),
  });

   const getFilteredData = <T extends { date?: string, dueDate?: string }>(data: T[]): T[] => {
    const now = new Date();
    
    if (!data || data.length === 0) {
      return [];
    }

    const dateKey = 'date' in data[0] ? 'date' : 'dueDate';
    
    if (filter === 'today') {
      return data.filter(e => e[dateKey] && new Date(e[dateKey]!).toDateString() === now.toDateString());
    }
    if (filter === 'week') {
      const start = startOfWeek(now);
      const end = endOfWeek(now);
      return data.filter(e => {
        const itemDate = e[dateKey] ? new Date(e[dateKey]!) : null;
        return itemDate && itemDate >= start && itemDate <= end;
      });
    }
    if (filter === 'month') {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      return data.filter(e => {
        const itemDate = e[dateKey] ? new Date(e[dateKey]!) : null;
        return itemDate && itemDate >= start && itemDate <= end;
      });
    }
    if (filter === 'year') {
      const start = startOfYear(now);
      const end = endOfYear(now);
      return data.filter(e => {
        const itemDate = e[dateKey] ? new Date(e[dateKey]!) : null;
        return itemDate && itemDate >= start && itemDate <= end;
      });
    }
    if (filter === 'custom' && date?.from && date?.to) {
        return data.filter(e => {
            const itemDate = e[dateKey] ? new Date(e[dateKey]!) : null;
            return itemDate && itemDate >= date.from! && itemDate <= date.to!;
        });
    }
    return data; // 'all'
  }

  const filteredExpenses = getFilteredData(expenses);
  const filteredSales = getFilteredData(sales);
  
  const pendingReminders = reminders.filter(r => r.status === 'Pending' && (r.type === 'Vehicle Permit' || r.type === 'Insurance'));

  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.price, 0);
  const totalExpenses = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const handleExport = () => {
    const doc = new jsPDF();
    const generationDate = format(new Date(), 'PPP');
    let filterText = "All Time";
    if (filter === 'today') filterText = 'Today';
    if (filter === 'week') filterText = 'This Week';
    if (filter === 'month') filterText = 'This Month';
    if (filter === 'year') filterText = 'This Year';
    if (filter === 'custom' && date?.from && date?.to) {
      filterText = `${format(date.from, 'PP')} to ${format(date.to, 'PP')}`;
    }

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(profile?.companyName || 'QuarryFlow', 15, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Financial Summary', 15, 28);
    doc.setFontSize(10);
    doc.text(`Reporting Period: ${filterText}`, 200, 20, { align: 'right' });
    doc.text(`Prepared By: ${profile?.name || 'Owner'}`, 200, 25, { align: 'right' });
    doc.text(`Date of Report: ${generationDate}`, 200, 30, { align: 'right' });
    doc.setLineWidth(0.5);
    doc.line(15, 35, 200, 35);

    let currentY = 45;

    // Executive Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 15, currentY);
    currentY += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Sales Revenue: Rs. ${totalRevenue.toLocaleString('en-IN')}`, 15, currentY);
    currentY += 6;
    doc.text(`Total Expenses: Rs. ${totalExpenses.toLocaleString('en-IN')}`, 15, currentY);
    currentY += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(`Net Profit/Loss: Rs. ${netProfit.toLocaleString('en-IN')}`, 15, currentY);
    currentY += 12;

    // Sales Details
    if (filteredSales.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Sales Details', 15, currentY);
      (doc as any).autoTable({
        startY: currentY + 2,
        head: [['Date', 'Customer', 'Vehicle', 'Load Size', 'Price']],
        body: filteredSales.map(s => [s.date && isValid(new Date(s.date)) ? format(new Date(s.date), 'PP') : 'N/A', s.customer, s.vehicle, s.loadSize, `Rs. ${s.price.toLocaleString('en-IN')}`]),
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { fontStyle: 'normal' },
        styles: { cellWidth: 'wrap' },
        didDrawPage: (data: any) => { currentY = data.cursor.y; }
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // Expense Details
    if (filteredExpenses.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Expense Details', 15, currentY);
      (doc as any).autoTable({
        startY: currentY + 2,
        head: [['Date', 'Category', 'Item/Description', 'Vehicle', 'Amount']],
        body: filteredExpenses.map(e => [e.date && isValid(new Date(e.date)) ? format(new Date(e.date), 'PP') : 'N/A', e.category, e.item, e.vehicle || 'N/A', `Rs. ${e.amount.toLocaleString('en-IN')}`]),
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { fontStyle: 'normal' },
        styles: { cellWidth: 'wrap' },
        didDrawPage: (data: any) => { currentY = data.cursor.y; }
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }
    
    // Compliance & Reminders
    if (pendingReminders.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Compliance & Reminders', 15, currentY);
      (doc as any).autoTable({
        startY: currentY + 2,
        head: [['Type', 'Details', 'Due Date', 'Related To']],
        body: pendingReminders.map(r => [r.type, r.details, r.dueDate && isValid(new Date(r.dueDate)) ? format(new Date(r.dueDate), 'PP') : 'N/A', r.relatedToName || 'N/A']),
        theme: 'grid',
        headStyles: { fillColor: [230, 126, 34], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { fontStyle: 'normal' },
        styles: { cellWidth: 'wrap' },
        didDrawPage: (data: any) => { currentY = data.cursor.y; }
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // Profit & Loss
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Profit & Loss Statement', 15, currentY);
    currentY += 8;
    doc.setFontSize(11);
    (doc as any).autoTable({
      startY: currentY,
      body: [
        ['Total Sales Revenue', `Rs. ${totalRevenue.toLocaleString('en-IN')}`],
        ['Total Expenses', `Rs. ${totalExpenses.toLocaleString('en-IN')}`],
        [{ content: 'Net Profit / Loss', styles: { fontStyle: 'bold' } }, { content: `Rs. ${netProfit.toLocaleString('en-IN')}`, styles: { fontStyle: 'bold' } }],
      ],
      theme: 'grid',
      styles: { cellPadding: 3, fontStyle: 'normal' },
      columnStyles: { 
        0: { fontStyle: 'bold' }, 
        1: { halign: 'right' } 
      }
    });
    currentY = (doc as any).lastAutoTable.finalY + 15;

    // Auditor notes
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Auditor Notes / Observations', 15, currentY);
    currentY += 8;
    doc.setDrawColor(200);
    doc.setLineWidth(0.2);
    doc.rect(15, currentY, 185, 40); // empty box for notes
    currentY += 50;


    // Footer
    const pageHeight = doc.internal.pageSize.height;
    const pageCount = (doc as any).internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('This is a system-generated report from QuarryFlow.', 15, pageHeight - 15);
        
        doc.text(`Page ${i} of ${pageCount}`, 200, pageHeight - 10, { align: 'right' });
        
        doc.line(140, pageHeight - 20, 200, pageHeight - 20); // Signature line
        doc.text('Signature / Stamp', 155, pageHeight - 15);
    }


    doc.save(`QuarryFlow_Report_${filterText.replace(/ /g, '_')}.pdf`);
  };


  return (
    <Card>
      <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <CardTitle className="font-headline">Financial Report</CardTitle>
          <CardDescription>Generate a detailed financial report for the selected period.</CardDescription>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
           <Button onClick={handleExport} disabled={sales.length === 0 && expenses.length === 0}>
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

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>
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
                Net Profit
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{netProfit.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        </div>

      </CardContent>
    </Card>
  );
}
