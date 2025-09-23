
import { SalesChart } from '@/components/dashboard/sales-chart';
import { CostRevenueChart } from '@/components/dashboard/cost-revenue-chart';
import { Suspense } from 'react';
import { OverviewStats } from '@/components/dashboard/overview-stats';
import { getDashboardData } from '@/lib/server/data';
import { DashboardCardSkeleton, OverviewStatsSkeleton } from '@/components/dashboard/skeletons';
import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';
import { ClientOnlyDashboard } from '@/components/dashboard/client-only-dashboard';


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
      
      <Suspense fallback={<FullPageLoader />}>
        <ClientOnlyDashboard />
      </Suspense>

       <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-4">
             <Suspense fallback={<DashboardCardSkeleton />}>
                <VehicleSummary />
             </Suspense>
          </div>
       </div>
    </div>
  );
}
