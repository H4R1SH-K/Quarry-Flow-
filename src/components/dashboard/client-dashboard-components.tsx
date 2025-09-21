
'use client';

import { RecentSalesSkeleton, RecentExpensesSkeleton } from '@/components/dashboard/skeletons';
import { ExpenseBreakdownChart } from './expense-breakdown-chart';
import { UpcomingCollections } from './upcoming-collections';
import { RecentSales } from './recent-sales';
import { RecentExpenses } from './recent-expenses';


export function ClientDashboardComponents() {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-1 lg:col-span-4">
                    <UpcomingCollections />
                </div>
                <div className="col-span-1 lg:col-span-3">
                    <RecentSales />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                 <div className="col-span-1 lg:col-span-3">
                    <ExpenseBreakdownChart />
                </div>
                <div className="col-span-1 lg:col-span-4">
                   <RecentExpenses />
                </div>
            </div>
        </>
    )
}
