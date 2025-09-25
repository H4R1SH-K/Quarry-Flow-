
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Trash2, Search, Loader2, PlusCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { getSales, deleteSaleById } from '@/lib/firebase-service';
import type { Sales } from '@/lib/types';
import { format, isValid } from 'date-fns';
import { SaleForm } from '@/components/invoicing/sale-form';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from '../ui/skeleton';

interface SalesTableProps {
  initialData: Sales[];
}

export function SalesTable({ initialData }: SalesTableProps) {
    const [sales, setSales] = useState<Sales[]>(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
      setSales(initialData);
    }, [initialData]);

    const fetchSales = async () => {
        setIsLoading(true);
        try {
            const salesData = await getSales();
            setSales(salesData);
        } catch (error) {
            console.error("Failed to fetch sales:", error);
            toast({ title: "Error", description: "Could not fetch sales data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSaleById(id);
            fetchSales(); // Refetch
            toast({ title: "Sale Deleted", description: "The sale record has been deleted." });
        } catch (error) {
            console.error("Failed to delete sale:", error);
            toast({ title: "Error", description: "Could not delete the sale record.", variant: "destructive" });
        }
    }
    
    const filteredSales = sales.filter(sale =>
        sale.customer.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        sale.vehicle.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (sale.paymentMethod && sale.paymentMethod.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );

    return (
       <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Sales</h2>
                <SaleForm onSave={fetchSales} trigger={<Button><PlusCircle className="mr-2 h-4 w-4"/> Add Sale</Button>} />
            </div>
            <Card>
                <CardContent className="pt-6">
                    <div className="mb-4">
                        <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search sales..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 sm:w-[300px]"
                        />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead className="text-right">Total Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSales.length > 0 ? (
                                filteredSales.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell className="font-medium">{sale.customer}</TableCell>
                                        <TableCell>{sale.vehicle}</TableCell>
                                        <TableCell>{sale.items?.length || 1} item(s)</TableCell>
                                        <TableCell>
                                          {!isClient || !sale.date || !isValid(new Date(sale.date)) ? <Skeleton className="h-4 w-24" /> : format(new Date(sale.date), 'PPP')}
                                        </TableCell>
                                        <TableCell>{sale.paymentMethod || 'N/A'}</TableCell>
                                        <TableCell className="text-right">Rs. {sale.price.toLocaleString('en-IN')}</TableCell>
                                        <TableCell className="text-right">
                                            <SaleForm saleToEdit={sale} onSave={fetchSales} />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete this sale record.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(sale.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No sales found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
