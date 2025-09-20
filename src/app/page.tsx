import { OverviewStats } from "@/components/dashboard/overview-stats";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { SmartReminder } from "@/components/dashboard/smart-reminder";
import { CostRevenueChart } from "@/components/dashboard/cost-revenue-chart";
import { ExpenseBreakdownChart } from "@/components/dashboard/expense-breakdown-chart";
import { VehicleSummary } from "@/components/dashboard/vehicle-summary";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { UpcomingCollections } from "@/components/dashboard/upcoming-collections";


export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>
      <OverviewStats />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <SalesChart />
        </div>
        <div className="lg:col-span-3">
          <RecentSales />
        </div>
      </div>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 grid gap-4">
            <CostRevenueChart />
            <UpcomingCollections />
          </div>
          <div className="lg:col-span-1 grid gap-4">
            <SmartReminder />
            <VehicleSummary />
          </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RecentExpenses />
        </div>
        <div className="lg:col-span-3">
           <ExpenseBreakdownChart />
        </div>
      </div>
    </div>
  );
}
