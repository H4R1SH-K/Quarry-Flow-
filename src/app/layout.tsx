import type {Metadata} from 'next';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster"
import { inter, spaceGrotesk } from './fonts';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'QuarryFlow',
  description: 'Business management for quarry suppliers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased", inter.variable, spaceGrotesk.variable)}>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
      </body>
    </html>
  );
}
