
'use client';

import { useState, useEffect, useTransition } from 'react';
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
import { Trash2, FileText, Search, PlusCircle, Loader2 } from "lucide-react";
import type { Sales, Customer, Profile } from '@/lib/types';
import { format, isValid } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SaleForm } from './sale-form';
import { getSales, getCustomers, getProfile, deleteSaleById } from '@/lib/firebase-service';
import { useToast } from '@/hooks/use-toast';

export function InvoicingTable() {
    const [sales, setSales] = useState<Sales[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const fetchData = () => {
        startTransition(async () => {
            try {
                const [salesData, customersData, profileData] = await Promise.all([
                    getSales(),
                    getCustomers(),
                    getProfile()
                ]);
                setSales(salesData);
                setCustomers(customersData);
                setProfile(profileData);
            } catch (error) {
                console.error("Failed to fetch invoicing data:", error);
                toast({ title: "Error", description: "Could not fetch invoicing data.", variant: "destructive" });
            }
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteSaleById(id);
            fetchData(); // Refetch
            toast({ title: "Sale Deleted", description: "The sale record has been deleted." });
        } catch (error) {
            console.error("Failed to delete sale:", error);
            toast({ title: "Error", description: "Could not delete the sale record.", variant: "destructive" });
        }
    }
    
    const handleGenerateBill = (sale: Sales) => {
        const doc = new jsPDF();
        const saleCustomer = customers.find(c => c.name === sale.customer);

        // Header
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(profile?.companyName || 'QuarryFlow', 14, 22);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(profile?.address || 'Company Address', 14, 30);
        doc.text(profile?.email || 'company@email.com', 14, 35);
        doc.text(profile?.phone || '123-456-7890', 14, 40);

        doc.setFontSize(18);
        doc.text('INVOICE', 200, 22, { align: 'right' });

        // Bill To
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Bill To', 14, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(sale.customer, 14, 68);
        if (saleCustomer) {
            doc.text(saleCustomer.address, 14, 74);
            doc.text(saleCustomer.phone, 14, 80);
        }

        // Invoice Details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Invoice #:', 140, 60);
        doc.text('Date:', 140, 68);
        if (sale.paymentMethod) {
          doc.text('Payment via:', 140, 76);
        }
        doc.setFont('helvetica', 'normal');
        doc.text(sale.id, 165, 60);
        doc.text(format(new Date(sale.date), 'PP'), 165, 68);
        if (sale.paymentMethod) {
            doc.text(sale.paymentMethod, 165, 76);
        }
        
        // Table
        const tableColumn = ["Item Description", "Quantity", "Unit", "Unit Price", "Total"];
        const tableRows = (sale.items || []).map(item => [
            item.description,
            item.quantity,
            item.unit,
            `Rs. ${item.unitPrice.toLocaleString('en-IN')}`,
            `Rs. ${item.total.toLocaleString('en-IN')}`
        ]);

        (doc as any).autoTable({
            startY: 95,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [22, 160, 133] },
        });

        // Total
        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Total Amount:', 140, finalY + 10);
        doc.text(`Rs. ${sale.price.toLocaleString('en-IN')}`, 200, finalY + 10, { align: 'right' });
        
        // Footer Notes
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your business!', 14, finalY + 40);

        doc.save(`Invoice_${sale.id}_${sale.customer}.pdf`);
    };

    const filteredSales = sales.filter(sale =>
        sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.paymentMethod && sale.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
       <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6"/>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Invoicing</h2>
                </div>
                 <SaleForm onSave={fetchData} trigger={<Button><PlusCircle className="mr-2 h-4 w-4"/> Add Sale for Invoice</Button>} />
            </div>
            <Card>
                <CardContent className="pt-6">
                    <div className="mb-4">
                        <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search invoices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 sm:w-[300px]"
                        />
                        </div>
                    </div>
                     {isPending ? (
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
                                        <TableCell>{sale.date && isValid(new Date(sale.date)) ? format(new Date(sale.date), 'PPP') : 'N/A'}</TableCell>
                                        <TableCell>{sale.paymentMethod || 'N/A'}</TableCell>
                                        <TableCell className="text-right">Rs. {sale.price.toLocaleString('en-IN')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleGenerateBill(sale)} title="Generate Bill">
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                            <SaleForm saleToEdit={sale} onSave={fetchData} />
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
                                        No sales found to invoice.
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
