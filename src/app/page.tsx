
'use client';

import dynamic from 'next/dynamic';
import { OverviewStatsSkeleton } from '@/components/dashboard/skeletons';

const OverviewStats = dynamic(
  () => import('@/components/dashboard/overview-stats').then(mod => mod.OverviewStats),
  { loading: () => <OverviewStatsSkeleton /> }
);
const RecentSales = dynamic(
  () => import('@/components/dashboard/recent-sales').then(mod => mod.RecentSales),
  { loading: () => <RecentSalesSkeleton /> }
);
const SalesChart = dynamic(
  () => import('@/components/dashboard/sales-chart').then(mod => mod.SalesChart),
  { loading: () => <SalesChartSkeleton /> }
);
const SmartReminder = dynamic(
  () => import('@/components/dashboard/smart-reminder').then(mod => mod.SmartReminder),
  { loading: () => <DashboardCardSkeleton /> }
);
const CostRevenueChart = dynamic(
  () => import('@/components/dashboard/cost-revenue-chart').then(mod => mod.CostRevenueChart),
  { loading: () => <DashboardCardSkeleton /> }
);
const ExpenseBreakdownChart = dynamic(
  () => import('@/components/dashboard/expense-breakdown-chart').then(mod => mod.ExpenseBreakdownChart),
  { loading: () => <DashboardCardSkeleton /> }
);
const VehicleSummary = dynamic(
  () => import('@/components/dashboard/vehicle-summary').then(mod => mod.VehicleSummary),
  { loading: () => <DashboardCardSkeleton /> }
);
const RecentExpenses = dynamic(
  () => import('@/components/dashboard/recent-expenses').then(mod => mod.RecentExpenses),
  { loading: () => <RecentExpensesSkeleton /> }
);
const UpcomingCollections = dynamic(
  () => import('@/components/dashboard/upcoming-collections').then(mod => mod.UpcomingCollections),
  { loading: () => <DashboardCardSkeleton /> }
);
import { DashboardCardSkeleton, RecentSalesSkeleton, SalesChartSkeleton, RecentExpensesSkeleton } from '@/components/dashboard/skeletons';


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
