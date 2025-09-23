
'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { History, User, Calendar, Edit, Trash2, PlusCircle, Search, Loader2 } from 'lucide-react';
import type { AuditLog } from '@/lib/types';
import { Input } from '../ui/input';
// This component is not yet using firebase-service, so no changes needed for fetching.
// However, the data store will be modified, so we will use state for now.
// In the future, this would also fetch from `getAuditLogs`.
import { useDataStore } from '@/lib/data-store';


export function AuditLogTable() {
  // const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  // const [isPending, startTransition] = useTransition();
  const { auditLogs } = useDataStore(); // Continue using store for now as it's not a large dataset
  const [searchTerm, setSearchTerm] = useState('');

  // Example for future implementation with Firebase
  // useEffect(() => {
  //   startTransition(async () => {
  //     // const logs = await getAuditLogs();
  //     // setAuditLogs(logs);
  //   });
  // }, []);

  const getActionIcon = (action: AuditLog['action']) => {
    switch (action) {
      case 'Created':
        return <PlusCircle className="h-4 w-4 text-green-500" />;
      case 'Updated':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'Deleted':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getActionVariant = (action: AuditLog['action']): 'default' | 'secondary' | 'destructive' | 'outline' => {
      switch (action) {
        case 'Created':
            return 'default';
        case 'Updated':
            return 'secondary';
        case 'Deleted':
            return 'destructive';
        default:
            return 'outline';
      }
  }

  const filteredLogs = auditLogs.filter(log => 
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className='flex items-center gap-2'>
          <History className="h-6 w-6" />
          <h2 className="text-3xl font-bold tracking-tight font-headline">Audit Log</h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>
            A log of all creation, update, and deletion activities in the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:w-[300px]"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant={getActionVariant(log.action)} className="gap-1 pl-1">
                        {getActionIcon(log.action)}
                        <span>{log.action}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{log.details}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{log.entity}</span>
                        <span className="text-xs text-muted-foreground">ID: {log.entityId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {log.userName}
                        </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                         <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-muted-foreground"/>
                           <span title={format(new Date(log.timestamp), 'PPpp')}>
                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                           </span>
                         </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No activity recorded yet.
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
