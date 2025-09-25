
'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { Truck, Wrench, Ban, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useDataStore } from '@/lib/data-store';

export function VehicleSummary() {
  const { vehicles } = useDataStore();

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'Active').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'Maintenance').length;
  const inactiveVehicles = vehicles.filter(v => v.status === 'Inactive').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Truck className="h-6 w-6" />
          <CardTitle className="font-headline">Vehicle Summary</CardTitle>
        </div>
        <CardDescription>
          A summary of your vehicle fleet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalVehicles > 0 ? (
          <div className="space-y-4">
            <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Truck className="text-green-500"/>
                        <p>Active Vehicles</p>
                    </div>
                    <p className="font-semibold">{activeVehicles}</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wrench className="text-orange-500"/>
                        <p>In Maintenance</p>
                    </div>
                    <p className="font-semibold">{maintenanceVehicles}</p>
                </div>
                <Separator />
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Ban className="text-red-500"/>
                        <p>Inactive Vehicles</p>
                    </div>
                    <p className="font-semibold">{inactiveVehicles}</p>
                </div>
            </div>
             <Link href="/vehicles" className='text-sm text-primary hover:underline flex items-center pt-2'>
              Manage Vehicles <ArrowRight className='h-4 w-4 ml-1'/>
            </Link>
          </div>
        ) : (
          <div className="text-sm text-center text-muted-foreground py-8">
            No vehicles added yet.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
