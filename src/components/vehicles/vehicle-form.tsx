
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
import { useDataStore } from '@/lib/data-store';
import type { Vehicle } from '@/lib/types';

type VehicleStatus = "Active" | "Maintenance" | "Inactive";

interface VehicleFormProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onFormClose: () => void;
    vehicle: Vehicle | null;
    trigger: React.ReactNode;
}

export function VehicleForm({ isOpen, onOpenChange, onFormClose, vehicle, trigger }: VehicleFormProps) {
  const { addVehicle, updateVehicle } = useDataStore();
  
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [status, setStatus] = useState<VehicleStatus>('Active');

  useEffect(() => {
    if (vehicle) {
      setMake(vehicle.make);
      setModel(vehicle.model);
      setYear(String(vehicle.year));
      setVehicleNumber(vehicle.vehicleNumber);
      setStatus(vehicle.status);
    } else {
        resetForm();
    }
  }, [vehicle, isOpen]);

  const resetForm = () => {
    setMake('');
    setModel('');
    setYear('');
    setVehicleNumber('');
    setStatus('Active');
  };
  
  const handleSave = () => {
    if (vehicle) {
      const updatedVehicle: Vehicle = {
        ...vehicle,
        make,
        model,
        year: Number(year),
        vehicleNumber,
        status,
      };
      updateVehicle(updatedVehicle);
    } else {
      const newVehicle: Vehicle = {
        id: String(Date.now()),
        make,
        model,
        year: Number(year),
        vehicleNumber,
        status,
      };
      addVehicle(newVehicle);
    }
    onFormClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
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
              <DialogClose asChild><Button variant="outline" onClick={onFormClose}>Cancel</Button></DialogClose>
              <Button type="submit" onClick={handleSave}>Save Vehicle</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
