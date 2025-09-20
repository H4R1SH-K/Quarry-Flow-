
'use client';

import { useState } from 'react';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

export default function SalesPage() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [loadSize, setLoadSize] = useState('');
  const [price, setPrice] = useState('');

  const handleAddSale = () => {
    const newSale = {
      id: String(salesData.length + 1),
      customer,
      vehicle,
      loadSize,
      price: `₹${price}`,
      date: new Date().toLocaleDateString('en-IN'),
    };
    setSalesData([...salesData, newSale]);
    setCustomer('');
    setVehicle('');
    setLoadSize('');
    setPrice('');
    setOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
       <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Sales</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Sale
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Sale</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer" className="text-right">
                  Customer
                </Label>
                <Input id="customer" value={customer} onChange={(e) => setCustomer(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicle" className="text-right">
                  Vehicle
                </Label>
                <Input id="vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="load-size" className="text-right">
                  Load Size
                </Label>
                <Input id="load-size" value={loadSize} onChange={(e) => setLoadSize(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={handleAddSale}>Save Sale</Button>
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
                <TableHead>Price</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.length > 0 ? (
                salesData.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.vehicle}</TableCell>
                    <TableCell>{sale.loadSize}</TableCell>
                    <TableCell>{sale.price}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
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
