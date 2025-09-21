
import { OverviewStats } from '@/components/dashboard/overview-stats';
import { SmartReminder } from '@/components/dashboard/smart-reminder';
import { VehicleSummary } from '@/components/dashboard/vehicle-summary';
import { ClientDashboardComponents } from '@/components/dashboard/client-dashboard-components';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { CostRevenueChart } from '@/components/dashboard/cost-revenue-chart';
import { getDashboardData } from '@/lib/server/data';


export default async function DashboardPage() {
  const { sales, expenses } = await getDashboardData();
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>
      <OverviewStats />
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SalesChart sales={sales} />
          <CostRevenueChart sales={sales} expenses={expenses} />
        </div>

       <ClientDashboardComponents />

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 grid gap-4">
            {/* <CostRevenueChart /> */}
            {/* <UpcomingCollections /> */}
          </div>
          <div className="lg:col-span-1 grid gap-4">
            <SmartReminder />
            <VehicleSummary />
          </div>
      </div>
    </div>
  );
}
