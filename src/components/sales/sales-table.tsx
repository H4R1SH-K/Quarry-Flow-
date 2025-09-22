
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
import { PlusCircle, Pencil, Trash2, X, Search } from "lucide-react";
import { useDataStore } from '@/lib/data-store';
import type { Sales, SalesItem } from '@/lib/types';
import { format, isValid } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';

type PaymentMethod = 'GPay' | 'Cash' | 'Card' | 'Internet Banking';
const defaultItem: Omit<SalesItem, 'id'> = { description: '', quantity: 1, unit: 'Ton', unitPrice: 0, total: 0 };


export function SalesTable() {
    const { sales, addSale, updateSale, deleteSale } = useDataStore();
    const [open, setOpen] = useState(false);
    const [editingSale, setEditingSale] = useState<Sales | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [customer, setCustomer] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [date, setDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
    const [items, setItems] = useState<SalesItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const total = items.reduce((acc, item) => acc + item.total, 0);
        setTotalPrice(total);
    }, [items]);

    useEffect(() => {
        if (editingSale) {
            setCustomer(editingSale.customer);
            setVehicle(editingSale.vehicle);
            setDate(editingSale.date);
            setPaymentMethod(editingSale.paymentMethod);
            setItems(editingSale.items?.map(item => ({...item})) || [{...defaultItem, id: '0'}]);
            setTotalPrice(editingSale.price);
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
        setDate('');
        setPaymentMethod(undefined);
        setItems([{...defaultItem, id: '0'}]);
        setTotalPrice(0);
    };

     const handleItemChange = (index: number, field: keyof SalesItem, value: string | number) => {
        const newItems = [...items];
        const item = { ...newItems[index] };
        
        if (field === 'quantity' || field === 'unitPrice') {
            item[field] = Number(value);
        } else {
            (item[field] as string) = value as string;
        }

        item.total = item.quantity * item.unitPrice;
        newItems[index] = item;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, {...defaultItem, id: String(items.length)}]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const handleSaveSale = () => {
        if (editingSale) {
            const updatedSale: Sales = {
                ...editingSale,
                customer,
                vehicle,
                items,
                price: totalPrice,
                date,
                paymentMethod,
            };
            updateSale(updatedSale);
        } else {
            const newSale: Sales = {
                id: String(Date.now()),
                customer,
                vehicle,
                items,
                price: totalPrice,
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
    
    const filteredSales = sales.filter(sale =>
        sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sale.paymentMethod && sale.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
       <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Sales</h2>
                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Sale
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>{editingSale ? 'Edit Sale' : 'Add New Sale'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                           <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="customer">Customer</Label>
                                    <Input id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vehicle">Vehicle</Label>
                                    <Input id="vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paymentMethod">Payment Method</Label>
                                    <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                                        <SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cash">Cash</SelectItem>
                                            <SelectItem value="Card">Card</SelectItem>
                                            <SelectItem value="GPay">GPay</SelectItem>
                                            <SelectItem value="Internet Banking">Internet Banking</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                           </div>

                            <div className="space-y-4">
                                <Label>Sale Items</Label>
                                <div className='space-y-2'>
                                {items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                        <Input placeholder="Item description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="col-span-4" />
                                        <Input type="text" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="col-span-2" />
                                        <Select value={item.unit} onValueChange={(value: 'Ton' | 'KG' | 'Load' | 'Trip') => handleItemChange(index, 'unit', value)}>
                                            <SelectTrigger className="col-span-2"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ton">Ton</SelectItem>
                                                <SelectItem value="KG">KG</SelectItem>
                                                <SelectItem value="Load">Load</SelectItem>
                                                <SelectItem value="Trip">Trip</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input type="text" placeholder="Unit Price" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', e.target.value)} className="col-span-2" />
                                        <p className={cn("col-span-1 text-sm text-right font-medium", item.total > 0 ? "text-foreground" : "text-muted-foreground")}>₹{item.total.toLocaleString()}</p>
                                        <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="col-span-1" disabled={items.length === 1}><X className="h-4 w-4" /></Button>
                                    </div>
                                ))}
                                </div>
                                <Button variant="outline" size="sm" onClick={addItem}><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
                            </div>
                            
                            <div className="flex justify-end items-center pt-4 border-t mt-4">
                                <p className="text-lg font-bold">Total: ₹{totalPrice.toLocaleString()}</p>
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
