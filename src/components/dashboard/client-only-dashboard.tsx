
'use client';

import dynamic from 'next/dynamic';
import { DashboardCardSkeleton } from './skeletons';

const ClientDashboardComponents = dynamic(
    () => import('./client-dashboard-components').then(mod => mod.ClientDashboardComponents),
    { 
        ssr: false,
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
  ssr: false,
});


interface ClientOnlyDashboardProps {
  section?: 'main' | 'smart-reminder';
}

export function ClientOnlyDashboard({ section = 'main' }: ClientOnlyDashboardProps) {
  if (section === 'smart-reminder') {
    return <SmartReminder />;
  }
  return <ClientDashboardComponents />
}
