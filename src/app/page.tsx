
import { SalesChart } from '@/components/dashboard/sales-chart';
import { CostRevenueChart } from '@/components/dashboard/cost-revenue-chart';
import { Suspense } from 'react';
import { OverviewStats } from '@/components/dashboard/overview-stats';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import { getDashboardData } from '@/lib/server/data';
import { DashboardCardSkeleton, OverviewStatsSkeleton } from '@/components/dashboard/skeletons';
import dynamic from 'next/dynamic';

const ClientOnlyDashboard = dynamic(
  () => import('@/components/dashboard/client-only-dashboard').then(mod => mod.ClientOnlyDashboard),
  {
    loading: () => (
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-4"><DashboardCardSkeleton /></div>
          <div className="lg:col-span-3"><DashboardCardSkeleton /></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-3"><DashboardCardSkeleton /></div>
          <div className="lg:col-span-4"><DashboardCardSkeleton /></div>
        </div>
      </div>
    ),
  }
);

const SmartReminder = dynamic(() => import('@/components/dashboard/smart-reminder').then(mod => mod.SmartReminder), {
  loading: () => <DashboardCardSkeleton />,
});

const VehicleSummary = dynamic(() => import('@/components/dashboard/vehicle-summary').then(mod => mod.VehicleSummary), {
  loading: () => <DashboardCardSkeleton />,
});


// This is a server component that fetches initial data.
export default async function DashboardPage() {
  const serverData = await getDashboardData();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>
      
      <Suspense fallback={<OverviewStatsSkeleton />}>
        <OverviewStats />
      </Suspense>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SalesChart sales={serverData.sales} />
          <CostRevenueChart sales={serverData.sales} expenses={serverData.expenses} />
       </div>
      <Suspense>
        <ClientOnlyDashboard />
      </Suspense>

       <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-3 grid gap-4">
            <Suspense fallback={<DashboardCardSkeleton />}>
              <SmartReminder />
            </Suspense>
          </div>
          <div className="lg:col-span-4">
             <Suspense fallback={<TableSkeleton />}>
                <VehicleSummary />
             </Suspense>
          </div>
      </div>
    </div>
  );
}
