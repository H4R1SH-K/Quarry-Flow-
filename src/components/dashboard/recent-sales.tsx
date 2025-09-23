
'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDataStore } from "@/lib/data-store";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { getRecentSales, getCustomers } from '@/lib/firebase-service';
import type { Sales, Customer } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function RecentSales() {
  const [sales, setSales] = useState<Sales[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    startTransition(async () => {
      try {
        const [recentSales, customerData] = await Promise.all([
          getRecentSales(5),
          getCustomers()
        ]);
        setSales(recentSales);
        setCustomers(customerData);
      } catch (error) {
        console.error("Failed to fetch recent sales data:", error);
        toast({
          title: "Error",
          description: "Could not fetch recent sales.",
          variant: "destructive",
        });
      }
    });
  }, []);

  const getCustomerInitials = (name: string) => {
    const customer = customers.find(c => c.name === name);
    if (customer) {
      const nameParts = customer.name.split(' ');
      return nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : nameParts[0].substring(0, 2);
    }
    return name.substring(0,2).toUpperCase();
  }

  const getCustomerEmail = (name: string) => {
    const customer = customers.find(c => c.name === name);
    return customer ? customer.email : "No email available";
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline">Recent Invoices</CardTitle>
                <CardDescription>Your last 5 invoices from the cloud.</CardDescription>
            </div>
            <Link href="/invoicing" className='text-sm text-primary hover:underline flex items-center'>
              View All <ArrowRight className='h-4 w-4 ml-1'/>
            </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
           <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        ) : sales.length > 0 ? (
          <div className="space-y-8">
            {sales.map((sale) => (
                <div className="flex items-center" key={sale.id}>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{getCustomerInitials(sale.customer)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.customer}</p>
                    <p className="text-sm text-muted-foreground">{getCustomerEmail(sale.customer)}</p>
                  </div>
                  <div className="ml-auto font-medium">+{`₹${sale.price.toLocaleString('en-IN')}`}</div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-48">
            <p className="text-sm text-muted-foreground">No recent invoices.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
