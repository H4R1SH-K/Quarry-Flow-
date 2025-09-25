
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
import { Trash2, Search, Loader2 } from "lucide-react";
import type { Customer } from '@/lib/types';
import { CustomerForm } from './customer-form';
import { getCustomers, deleteCustomerById } from '@/lib/firebase-service';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';

interface CustomerTableProps {
  initialData: Customer[];
}

export function CustomerTable({ initialData }: CustomerTableProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const fetchedCustomers = await getCustomers();
      setCustomers(fetchedCustomers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast({
        title: "Error",
        description: "Could not fetch customers. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomerById(id);
      fetchCustomers(); // Refetch data
      toast({
        title: "Customer Deleted",
        description: "The customer has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast({
        title: "Error",
        description: "Could not delete the customer.",
        variant: "destructive",
      });
    }
  }

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    customer.address.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Customers</h2>
        <CustomerForm onSave={fetchCustomers} />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:w-[300px]"
              />
            </div>
          </div>
          {isLoading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{customer.email}</span>
                          <span className="text-xs text-muted-foreground">{customer.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{customer.address}</TableCell>
                      <TableCell>{customer.company}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <CustomerForm customerToEdit={customer} onSave={fetchCustomers} />
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
                                This action cannot be undone. This will permanently delete this customer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(customer.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No customers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
