
import { SalesChart } from '@/components/dashboard/sales-chart';
import { CostRevenueChart } from '@/components/dashboard/cost-revenue-chart';
import { Suspense } from 'react';
import { OverviewStats } from '@/components/dashboard/overview-stats';
import { getDashboardData } from '@/lib/server/data';
import { DashboardCardSkeleton, OverviewStatsSkeleton } from '@/components/dashboard/skeletons';
import dynamic from 'next/dynamic';
import { FullPageLoader } from '@/components/ui/full-page-loader';
import { ClientOnlyDashboard } from '@/components/dashboard/client-only-dashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';


const VehicleSummary = dynamic(() => import('@/components/dashboard/vehicle-summary').then(mod => mod.VehicleSummary), {
  loading: () => <DashboardCardSkeleton />,
});

// This is a server component that fetches initial data.
export default async function DashboardPage() {
  const { sales, expenses, customers, vehicles, reminders, error } = await getDashboardData();
  const serverData = { sales, expenses, customers, vehicles, reminders };

  const FirestoreFixInstruction = () => (
    <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Action Required: Enable Cloud Firestore API</AlertTitle>
        <AlertDescription>
            <p className='text-xs'>Your application can't connect to the database because the Firestore API is not enabled in your Google Cloud project.</p>
            <p className="font-bold my-2 text-xs">Follow these steps:</p>
            <ol className="list-decimal pl-4 mt-2 space-y-1 text-xs">
                <li>
                    Click this link to go to the Google Cloud Console:
                    <a 
                        href="https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=studio-9564969490-82816" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="underline font-semibold"
                    >
                        Enable Firestore API
                    </a>.
                </li>
                <li>Click the **"Enable"** button.</li>
                <li>Wait a few minutes for the changes to apply, then refresh this page.</li>
            </ol>
             <p className="mt-2 text-xs">Once enabled, your app will be able to save and retrieve data from the cloud. The app is currently showing sample data.</p>
        </AlertDescription>
    </Alert>
);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
       {error && error === 'PERMISSION_DENIED' && <FirestoreFixInstruction />}
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
