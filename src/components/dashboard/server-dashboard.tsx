import React, { Suspense } from 'react';
import { OverviewStats } from '@/components/dashboard/overview-stats';
import { VehicleSummary } from '@/components/dashboard/vehicle-summary';
import { OverviewStatsSkeleton, DashboardCardSkeleton } from '@/components/dashboard/skeletons';

export function ServerDashboard() {
  return (
    <>
      <Suspense fallback={<OverviewStatsSkeleton />}>
        <OverviewStats />
      </Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>{/* This is a placeholder for client components */}</div>
        <div className="grid gap-4">
          <Suspense fallback={<DashboardCardSkeleton />}>
            <VehicleSummary />
          </Suspense>
        </div>
      </div>
    </>
  );
}
