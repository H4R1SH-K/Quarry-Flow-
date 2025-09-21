
'use client';

import dynamic from 'next/dynamic';
import { RecentSalesSkeleton, RecentExpensesSkeleton } from '@/components/dashboard/skeletons';

const RecentSales = dynamic(() => import('@/components/dashboard/recent-sales').then(mod => mod.RecentSales), {
  loading: () => <RecentSalesSkeleton />,
  ssr: false,
});

const RecentExpenses = dynamic(() => import('@/components/dashboard/recent-expenses').then(mod => mod.RecentExpenses), {
    loading: () => <RecentExpensesSkeleton />,
    ssr: false,
});


export function ClientDashboardComponents() {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    {/* Placeholder for SalesChart if it were client-side, but it's a server component */}
                </div>
                <div className="lg:col-span-3">
                    <RecentSales />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                 <div className="lg:col-span-4">
                    {/* Placeholder for ExpenseBreakdownChart if it were client-side */}
                </div>
                <div className="lg:col-span-3">
                    <RecentExpenses />
                </div>
            </div>
        </>
    )
}
