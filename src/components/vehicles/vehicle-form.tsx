
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
import type { Vehicle } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { saveVehicle } from '@/lib/firebase-service';
import { PlusCircle, Pencil } from 'lucide-react';

type VehicleStatus = "Active" | "Maintenance" | "Inactive";

interface VehicleFormProps {
    vehicleToEdit?: Vehicle;
    onSave?: () => void;
}

export function VehicleForm({ vehicleToEdit, onSave }: VehicleFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [status, setStatus] = useState<VehicleStatus>('Active');

  useEffect(() => {
    if (isOpen && vehicleToEdit) {
      setMake(vehicleToEdit.make);
      setModel(vehicleToEdit.model);
      setYear(String(vehicleToEdit.year));
      setVehicleNumber(vehicleToEdit.vehicleNumber);
      setStatus(vehicleToEdit.status);
    } else if (!isOpen) {
        resetForm();
    }
  }, [vehicleToEdit, isOpen]);

  const resetForm = () => {
    setMake('');
    setModel('');
    setYear('');
    setVehicleNumber('');
    setStatus('Active');
  };
  
  const handleSave = async () => {
    const id = vehicleToEdit ? vehicleToEdit.id : String(Date.now());
    const vehicleData: Vehicle = {
      id,
      make,
      model,
      year: Number(year),
      vehicleNumber,
      status,
    };
    
    try {
      await saveVehicle(vehicleData);
      toast({
        title: vehicleToEdit ? 'Vehicle Updated' : 'Vehicle Added',
        description: `Vehicle "${vehicleNumber}" has been saved.`,
      });
      onSave?.();
      setIsOpen(false);
    } catch (error) {
       console.error("Failed to save vehicle:", error);
       toast({
         title: 'Error',
         description: 'Could not save the vehicle.',
         variant: 'destructive',
       });
    }
  };
  
  const triggerButton = vehicleToEdit ? (
    <Button variant="ghost" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  ) : (
    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle</Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>{vehicleToEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="make" className="text-right">
                  Make
                </Label>
                <Input id="make" value={make} onChange={(e) => setMake(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right">
                  Model
                </Label>
                <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">
                  Year
                </Label>
                <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicleNumber" className="text-right">
                  Vehicle Number
                </Label>
                <Input id="vehicleNumber" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={status} onValueChange={(value: VehicleStatus) => setStatus(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" onClick={handleSave}>Save Vehicle</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
