'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, LayoutDashboard, LineChart, Settings, ShoppingCart, Truck, Users, DollarSign, UserCircle, Banknote } from "lucide-react";
import { Button } from "../ui/button";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Sales", icon: ShoppingCart, href: "/sales" },
    { name: "Customers", icon: Users, href: "/customers" },
    { name: "Expenses", icon: DollarSign, href: "/expenses" },
    { name: "Vehicles", icon: Truck, href: "/vehicles" },
    { name: "Collections", icon: Banknote, href: "/collections" },
    { name: "Reminders", icon: Bell, href: "/reminders" },
    { name: "Reports", icon: LineChart, href: "/reports" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
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
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="w-full flex-1">
                {/* Can add a search bar here if needed */}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">User Menu</span>
            </Button>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
