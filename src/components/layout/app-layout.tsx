import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, FileText, LayoutDashboard, LineChart, Settings, ShoppingCart, Truck, Users, DollarSign } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Image from "next/image";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "#" },
    { name: "Sales", icon: ShoppingCart, href: "#" },
    { name: "Customers", icon: Users, href: "#" },
    { name: "Expenses", icon: DollarSign, href: "#" },
    { name: "Vehicles", icon: Truck, href: "#" },
    { name: "Reports", icon: LineChart, href: "#" },
];


export function AppLayout({ children }: { children: React.ReactNode }) {
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
                        <SidebarMenuButton tooltip={item.name} isActive={item.name === "Dashboard"}>
                            <item.icon />
                            <span>{item.name}</span>
                        </SidebarMenuButton>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Image
                    src="https://picsum.photos/seed/1/40/40"
                    width={32}
                    height={32}
                    className="rounded-full"
                    alt="User avatar"
                    data-ai-hint="user avatar"
                  />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
