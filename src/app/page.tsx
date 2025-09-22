import { SmartReminder } from '@/components/dashboard/smart-reminder';
import { getDashboardData } from '@/lib/server/data';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { CostRevenueChart } from '@/components/dashboard/cost-revenue-chart';
import { ClientOnlyDashboard } from '@/components/dashboard/client-only-dashboard';
import { Suspense } from 'react';
import { OverviewStats } from '@/components/dashboard/overview-stats';
import { VehicleSummary } from '@/components/dashboard/vehicle-summary';
import { OverviewStatsSkeleton } from '@/components/dashboard/skeletons';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export default async function DashboardPage() {
  const { sales, expenses } = await getDashboardData();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>
      
      <Suspense fallback={<OverviewStatsSkeleton />}>
        <OverviewStats />
      </Suspense>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SalesChart sales={sales} />
          <CostRevenueChart sales={sales} expenses={expenses} />
       </div>

       <ClientOnlyDashboard />

       <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-3 grid gap-4">
            <SmartReminder />
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
