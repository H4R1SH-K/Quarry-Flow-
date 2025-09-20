'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';


const ExpenseReport = dynamic(
  () => import('@/components/reports/expense-report').then((mod) => mod.ExpenseReport),
  { 
    ssr: false,
    loading: () => (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Reports</h2>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
             <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }
);

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Reports</h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <ExpenseReport />
      </div>
    </div>
  );
}
