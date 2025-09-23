
'use client';

import { DashboardCardSkeleton } from '@/components/dashboard/skeletons';
import { ExpenseBreakdownChart } from './expense-breakdown-chart';
import { UpcomingCollections } from './upcoming-collections';
import { RecentSales } from './recent-sales';
import { RecentExpenses } from './recent-expenses';
import dynamic from 'next/dynamic';

const SmartReminder = dynamic(() => import('@/components/dashboard/smart-reminder'), {
  ssr: false,
  loading: () => <DashboardCardSkeleton />,
});


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
             <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              <div className="lg:col-span-3 grid gap-4">
                 <SmartReminder />
              </div>
          </div>
        </>
    )
}
