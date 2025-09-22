
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
import { Badge } from "@/components/ui/badge";
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
import { PlusCircle, Pencil, Truck, Wrench, Ban, ListFilter, Trash2, Search } from "lucide-react";
import type { Vehicle } from '@/lib/types';
import { useDataStore } from '@/lib/data-store';
import { VehicleForm } from './vehicle-form';

type VehicleStatus = "Active" | "Maintenance" | "Inactive";

export function VehicleTable() {
  const { vehicles, deleteVehicle } = useDataStore();
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [filter, setFilter] = useState<VehicleStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };
  
  const handleFormClose = () => {
    setEditingVehicle(null);
    setIsFormOpen(false);
  }

  const handleDelete = (id: string) => {
    deleteVehicle(id);
  }

  const baseVehicles = vehicles.filter(vehicle => {
    if (filter === 'All') return true;
    return vehicle.status === filter;
  });

  const filteredVehicles = baseVehicles.filter(vehicle =>
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Vehicles</h2>
        <VehicleForm 
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            onFormClose={handleFormClose}
            vehicle={editingVehicle}
            trigger={<Button><PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle</Button>}
        />
      </div>

       <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by make, model, number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-[300px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant={filter === 'All' ? 'default' : 'outline'} onClick={() => setFilter('All')}>
                <ListFilter className="mr-2 h-4 w-4" /> All
              </Button>
              <Button variant={filter === 'Active' ? 'default' : 'outline'} onClick={() => setFilter('Active')}>
                <Truck className="mr-2 h-4 w-4" /> Active
              </Button>
              <Button variant={filter === 'Maintenance' ? 'default' : 'outline'} onClick={() => setFilter('Maintenance')}>
                <Wrench className="mr-2 h-4 w-4" /> Maint.
              </Button>
              <Button variant={filter === 'Inactive' ? 'default' : 'outline'} onClick={() => setFilter('Inactive')}>
                <Ban className="mr-2 h-4 w-4" /> Inactive
              </Button>
            </div>
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
