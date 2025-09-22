
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
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useDataStore } from '@/lib/data-store';
import type { Customer } from '@/lib/types';


interface CustomerFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onFormClose: () => void;
    customer: Customer | null;
    trigger: React.ReactNode;
}

export function CustomerForm({ isOpen, onOpenChange, onFormClose, customer, trigger }: CustomerFormProps) {
  const { addCustomer, updateCustomer } = useDataStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<"Active" | "Inactive">('Active');

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone);
      setCompany(customer.company);
      setAddress(customer.address);
      setStatus(customer.status);
    } else {
        resetForm();
    }
  }, [customer, isOpen]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setAddress('');
    setStatus('Active');
  };

  const handleSave = () => {
    if (customer) {
      const updatedCustomer: Customer = {
        ...customer,
        name,
        email,
        phone,
        company,
        address,
        status,
      };
      updateCustomer(updatedCustomer);
    } else {
      const newCustomer: Customer = {
        id: String(Date.now()),
        name,
        email,
        phone,
        company,
        address,
        status,
      };
      addCustomer(newCustomer);
    }
    onFormClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Company
                </Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="address" className="text-right pt-2">
                  Address
                </Label>
                <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                 <Select value={status} onValueChange={(value: "Active" | "Inactive") => setStatus(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={onFormClose}>Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={handleSave}>Save Customer</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
