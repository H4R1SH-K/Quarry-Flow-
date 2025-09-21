
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
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useDataStore } from '@/lib/data-store';
import type { Sales } from '@/lib/types';
import { format, isValid } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type PaymentMethod = 'GPay' | 'Cash' | 'Card' | 'Internet Banking';

export function SalesTable() {
    const { sales, addSale, updateSale, deleteSale } = useDataStore();
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

    return (
       <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Sales</h2>
                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Sale
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
                                        No sales found.
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
