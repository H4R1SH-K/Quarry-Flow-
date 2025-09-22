'use client';

import { OverviewStats } from '@/components/dashboard/overview-stats';
import { SmartReminder } from '@/components/dashboard/smart-reminder';
import { VehicleSummary } from '@/components/dashboard/vehicle-summary';
import { getDashboardData } from '@/lib/server/data';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { CostRevenueChart } from '@/components/dashboard/cost-revenue-chart';
import dynamic from 'next/dynamic';
import { DashboardCardSkeleton } from '@/components/dashboard/skeletons';
import { useEffect, useState } from 'react';
import type { Sales, Expense } from '@/lib/types';

const ClientOnlyDashboard = dynamic(
  () => import('@/components/dashboard/client-only-dashboard').then(mod => mod.ClientOnlyDashboard),
  { 
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-4"><DashboardCardSkeleton/></div>
          <div className="lg:col-span-3"><DashboardCardSkeleton/></div>
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-3"><DashboardCardSkeleton/></div>
          <div className="lg:col-span-4"><DashboardCardSkeleton/></div>
        </div>
      </div>
    ),
  }
);


export default function DashboardPage() {
  const [serverData, setServerData] = useState<{ sales: Sales[]; expenses: Expense[] }>({ sales: [], expenses: [] });

  useEffect(() => {
    // Fetch server data on the client to avoid hydration mismatch for charts
    // while still having them rendered initially on the server.
    getDashboardData().then(data => {
      setServerData({ sales: data.sales, expenses: data.expenses });
    });
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>
      <OverviewStats />
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SalesChart sales={serverData.sales} />
          <CostRevenueChart sales={serverData.sales} expenses={serverData.expenses} />
        </div>

       <ClientOnlyDashboard />

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="grid gap-4">
            <SmartReminder />
          </div>
          <div className="grid gap-4">
            <VehicleSummary />
          </div>
      </div>
    </div>
  );
}
