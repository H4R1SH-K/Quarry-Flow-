
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil, Trash2, FileText } from "lucide-react";
import { useDataStore } from '@/lib/data-store';
import type { Sales } from '@/lib/types';
import { format, isValid } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type PaymentMethod = 'GPay' | 'Cash' | 'Card' | 'Internet Banking';

export function InvoicingTable() {
    const { sales, customers, profile, addSale, updateSale, deleteSale } = useDataStore();
    const [open, setOpen] = useState(false);
    const [editingSale, setEditingSale] = useState<Sales | null>(null);

    const [customer, setCustomer] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [loadSize, setLoadSize] = useState('');
    const [unit, setUnit] = useState<'KG' | 'Ton'>('Ton');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(undefined);

    useEffect(() => {
        if (editingSale) {
            const [size, unitValue] = editingSale.loadSize.split(' ');
            setCustomer(editingSale.customer);
            setVehicle(editingSale.vehicle);
            setLoadSize(size || '');
            setUnit((unitValue as 'KG' | 'Ton') || 'Ton');
            setPrice(String(editingSale.price));
            setDate(editingSale.date);
            setPaymentMethod(editingSale.paymentMethod);
            setOpen(true);
        }
    }, [editingSale]);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setEditingSale(null);
            resetForm();
        }
        setOpen(isOpen);
    };

    const resetForm = () => {
        setCustomer('');
        setVehicle('');
        setLoadSize('');
        setUnit('Ton');
        setPrice('');
        setDate('');
        setPaymentMethod(undefined);
    };

    const handleSaveSale = () => {
        const fullLoadSize = `${loadSize} ${unit}`;
        if (editingSale) {
            const updatedSale: Sales = {
                ...editingSale,
                customer,
                vehicle,
                loadSize: fullLoadSize,
                price: Number(price),
                date,
                paymentMethod,
            };
            updateSale(updatedSale);
        } else {
            const newSale: Sales = {
                id: String(Date.now()),
                customer,
                vehicle,
                loadSize: fullLoadSize,
                price: Number(price),
                date,
                paymentMethod,
            };
            addSale(newSale);
        }
        resetForm();
        setEditingSale(null);
        setOpen(false);
    };

    const handleEditClick = (sale: Sales) => {
        setEditingSale(sale);
    };

    const handleDelete = (id: string) => {
        deleteSale(id);
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
        const tableColumn = ["Item Description", "Load Size", "Vehicle", "Unit Price", "Total"];
        const tableRows = [[
            `Sand/Material Supply`,
            sale.loadSize,
            sale.vehicle,
            `Rs. ${sale.price.toLocaleString('en-IN')}`,
            `Rs. ${sale.price.toLocaleString('en-IN')}`
        ]];

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

    return (
       <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-6 w-6"/>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Invoicing</h2>
                </div>
                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Sale for Invoice
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingSale ? 'Edit Sale' : 'Add New Sale'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="customer" className="text-right">Customer</Label>
                                <Input id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="vehicle" className="text-right">Vehicle</Label>
                                <Input id="vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="loadSize" className="text-right">Load Size</Label>
                                <div className="col-span-3 flex items-center gap-2">
                                    <Input id="loadSize" value={loadSize} onChange={(e) => setLoadSize(e.target.value)} className="flex-1" />
                                    <Select value={unit} onValueChange={(value: "KG" | "Ton") => setUnit(value)}>
                                      <SelectTrigger className="w-[80px]">
                                        <SelectValue placeholder="Unit" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="KG">KG</SelectItem>
                                        <SelectItem value="Ton">Ton</SelectItem>
                                      </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price</Label>
                                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">Date</Label>
                                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="paymentMethod" className="text-right">Payment</Label>
                                <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cash">Cash</SelectItem>
                                        <SelectItem value="Card">Card</SelectItem>
                                        <SelectItem value="GPay">GPay</SelectItem>
                                        <SelectItem value="Internet Banking">Internet Banking</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                            <Button type="submit" onClick={handleSaveSale}>Save Sale</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Load Size</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.length > 0 ? (
                                sales.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell className="font-medium">{sale.customer}</TableCell>
                                        <TableCell>{sale.vehicle}</TableCell>
                                        <TableCell>{sale.loadSize}</TableCell>
                                        <TableCell>{sale.date && isValid(new Date(sale.date)) ? format(new Date(sale.date), 'PPP') : 'N/A'}</TableCell>
                                        <TableCell>{sale.paymentMethod || 'N/A'}</TableCell>
                                        <TableCell className="text-right">Rs. {sale.price.toLocaleString('en-IN')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleGenerateBill(sale)} title="Generate Bill">
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(sale)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
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
                </CardContent>
            </Card>
        </div>
    );
}
