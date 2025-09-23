
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';
import { saveSale } from '@/lib/firebase-service';
import type { Sales, SalesItem } from '@/lib/types';
import { PlusCircle, X, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

type PaymentMethod = 'GPay' | 'Cash' | 'Card' | 'Internet Banking';
const defaultItem: Omit<SalesItem, 'id'> = { description: '', quantity: 1, unit: 'Ton', unitPrice: 0, total: 0 };


interface SaleFormProps {
    saleToEdit?: Sales;
    onSave?: () => void;
    trigger?: React.ReactNode;
}

export function SaleForm({ saleToEdit, onSave, trigger }: SaleFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
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
    if (isOpen && saleToEdit) {
        setCustomer(saleToEdit.customer);
        setVehicle(saleToEdit.vehicle);
        setDate(saleToEdit.date);
        setPaymentMethod(saleToEdit.paymentMethod);
        setItems(saleToEdit.items?.map(item => ({...item})) || [{...defaultItem, id: '0'}]);
    } else if (!isOpen) {
      resetForm();
    }
  }, [saleToEdit, isOpen]);

  const resetForm = () => {
    setCustomer('');
    setVehicle('');
    setDate('');
    setPaymentMethod(undefined);
    setItems([{...defaultItem, id: '0'}]);
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

  const handleSave = async () => {
    const id = saleToEdit ? saleToEdit.id : String(Date.now());
    const saleData: Sales = {
      id,
      customer,
      vehicle,
      items,
      price: totalPrice,
      date,
      paymentMethod,
    };

    try {
      await saveSale(saleData);
      toast({
        title: saleToEdit ? 'Sale Updated' : 'Sale Added',
        description: `The sale for "${customer}" has been saved.`,
      });
      onSave?.();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save sale:", error);
      toast({
        title: 'Error',
        description: 'Could not save the sale.',
        variant: 'destructive',
      });
    }
  };

  const triggerButton = trigger ? trigger : saleToEdit ? (
    <Button variant="ghost" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  ) : (
    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Sale</Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>{saleToEdit ? 'Edit Sale' : 'Add New Sale'}</DialogTitle>
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
                    <Label>Invoice Items</Label>
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
                <Button type="submit" onClick={handleSave}>Save Sale</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
