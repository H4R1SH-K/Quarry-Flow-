
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, LayoutDashboard, LineChart, Settings, ShoppingCart, Truck, Users, DollarSign, Banknote, User, History, FileText, LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from '../ui/avatar';


const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Sales", icon: ShoppingCart, href: "/sales" },
    { name: "Invoicing", icon: FileText, href: "/invoicing"},
    { name: "Customers", icon: Users, href: "/customers" },
    { name: "Expenses", icon: DollarSign, href: "/expenses" },
    { name: "Vehicles", icon: Truck, href: "/vehicles" },
    { name: "Collections", icon: Banknote, href: "/collections" },
    { name: "Reminders", icon: Bell, href: "/reminders" },
    { name: "Reports", icon: LineChart, href: "/reports" },
    { name: "Audit Log", icon: History, href: "/audit-log"},
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const app = getFirebaseApp();
    if(app) {
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setIsAuthLoading(false);
      });
      return () => unsubscribe();
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const handleSignOut = async () => {
      const auth = getAuth(getFirebaseApp()!);
      try {
          await signOut(auth);
          toast({
              title: 'Signed Out',
              description: 'You have successfully signed out.',
          });
          router.push('/login');
      } catch (error) {
          toast({
              title: 'Sign-Out Failed',
              description: 'Could not sign out. Please try again.',
              variant: 'destructive',
          });
      }
  };
  
  const mainContent = (
      <>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="w-full flex-1">
                {/* Can add a search bar here if needed */}
            </div>
            <Link href="/reminders">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Reminders</span>
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Avatar>
                      <AvatarFallback>
                        {user ? user.email?.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                { user ? (
                  <>
                    <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/profile"><User className="mr-2"/>Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/settings"><Settings className="mr-2"/>Settings</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2"/>Sign Out</DropdownMenuItem>
                  </>
                ) : (
                  <>
                     <DropdownMenuItem asChild><Link href="/login"><LogIn className="mr-2"/>Sign In</Link></DropdownMenuItem>
                     <DropdownMenuItem asChild><Link href="/register">Create Account</Link></DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

        </header>
        {children}
      </>
  );

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

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
                {!isAuthLoading && (
                  user ? menuItems.map((item) => (
                      <SidebarMenuItem key={item.name}>
                          <Link href={item.href} passHref>
                              <SidebarMenuButton tooltip={item.name} isActive={pathname === item.href}>
                                  <item.icon />
                                  <span>{item.name}</span>
                              </SidebarMenuButton>
                          </Link>
                      </SidebarMenuItem>
                  )) : (
                     <>
                      <SidebarMenuItem>
                          <Link href="/login" passHref>
                              <SidebarMenuButton tooltip="Login" isActive={pathname === '/login'}>
                                  <LogIn />
                                  <span>Sign In</span>
                              </SidebarMenuButton>
                          </Link>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                          <Link href="/register" passHref>
                              <SidebarMenuButton tooltip="Register" isActive={pathname === '/register'}>
                                  <User />
                                  <span>Create Account</span>
                              </SidebarMenuButton>
                          </Link>
                      </SidebarMenuItem>
                    </>
                  )
                )}
            </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        {mainContent}
      </SidebarInset>
    </SidebarProvider>
  );
}
