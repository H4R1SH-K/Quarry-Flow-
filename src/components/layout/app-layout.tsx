'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, FileText, LayoutDashboard, LineChart, Settings, ShoppingCart, Truck, Users, DollarSign, IndianRupee, LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Image from "next/image";
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Sales", icon: ShoppingCart, href: "/sales" },
    { name: "Customers", icon: Users, href: "/customers" },
    { name: "Expenses", icon: DollarSign, href: "/expenses" },
    { name: "Vehicles", icon: Truck, href: "/vehicles" },
    { name: "Reminders", icon: Bell, href: "/reminders" },
    { name: "Reports", icon: LineChart, href: "/reports" },
];

const bottomMenuItems = [
    { name: "Settings", icon: Settings, href: "/settings" },
]


export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signInWithGoogle, signOut } = useAuth();
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
             <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-headline group-data-[state=collapsed]:hidden">QuarryFlow</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <Link href={item.href} passHref>
                            <SidebarMenuButton tooltip={item.name} isActive={pathname === item.href}>
                                <item.icon />
                                <span>{item.name}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>

             <SidebarMenu className="mt-auto">
                {bottomMenuItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <Link href={item.href} passHref>
                            <SidebarMenuButton tooltip={item.name} isActive={pathname === item.href}>
                                <item.icon />
                                <span>{item.name}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="w-full flex-1">
                {/* Can add a search bar here if needed */}
            </div>
             {user ? (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Toggle notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.displayName || 'My Account'}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={signInWithGoogle}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            )}
        </header>
        {user ? children : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Welcome to QuarryFlow</h2>
              <p className="text-muted-foreground">Please sign in to manage your business.</p>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
