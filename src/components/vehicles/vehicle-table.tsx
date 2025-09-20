
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
import { Badge } from "@/components/ui/badge";
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
import { PlusCircle, Pencil, Truck, Wrench, Ban, ListFilter, Trash2 } from "lucide-react";
import type { Vehicle } from '@/lib/types';
import { useDataStore } from '@/lib/data-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type VehicleStatus = "Active" | "Maintenance" | "Inactive";

export function VehicleTable() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useDataStore();
  const [open, setOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [filter, setFilter] = useState<VehicleStatus | 'All'>('All');
  
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [status, setStatus] = useState<VehicleStatus>('Active');

  useEffect(() => {
    if (editingVehicle) {
      setMake(editingVehicle.make);
      setModel(editingVehicle.model);
      setYear(String(editingVehicle.year));
      setVehicleNumber(editingVehicle.vehicleNumber);
      setStatus(editingVehicle.status);
      setOpen(true);
    }
  }, [editingVehicle]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingVehicle(null);
      resetForm();
    }
    setOpen(isOpen);
  };
  
  const resetForm = () => {
    setMake('');
    setModel('');
    setYear('');
    setVehicleNumber('');
    setStatus('Active');
  };
  
  const handleSaveVehicle = () => {
    if (editingVehicle) {
      const updatedVehicle: Vehicle = {
        ...editingVehicle,
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

    resetForm();
    setEditingVehicle(null);
    setOpen(false);
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleDelete = (id: string) => {
    deleteVehicle(id);
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filter === 'All') return true;
    return vehicle.status === filter;
  });

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Vehicles</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
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
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={handleSaveVehicle}>Save Vehicle</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

       <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Button variant={filter === 'All' ? 'default' : 'outline'} onClick={() => setFilter('All')}>
              <ListFilter className="mr-2 h-4 w-4" /> All ({vehicles.length})
            </Button>
            <Button variant={filter === 'Active' ? 'default' : 'outline'} onClick={() => setFilter('Active')}>
              <Truck className="mr-2 h-4 w-4" /> Active ({vehicles.filter(v => v.status === 'Active').length})
            </Button>
            <Button variant={filter === 'Maintenance' ? 'default' : 'outline'} onClick={() => setFilter('Maintenance')}>
              <Wrench className="mr-2 h-4 w-4" /> Maintenance ({vehicles.filter(v => v.status === 'Maintenance').length})
            </Button>
            <Button variant={filter === 'Inactive' ? 'default' : 'outline'} onClick={() => setFilter('Inactive')}>
              <Ban className="mr-2 h-4 w-4" /> Inactive ({vehicles.filter(v => v.status === 'Inactive').length})
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.vehicleNumber}</TableCell>
                    <TableCell>{vehicle.make}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vehicle.status === "Active"
                            ? "default"
                            : vehicle.status === "Maintenance"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(vehicle)}>
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
                              This action cannot be undone. This will permanently delete this vehicle record.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(vehicle.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No vehicles found for the selected filter.
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
