
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { getDashboardData } from "@/lib/server/data";

export async function RecentSales() {
  const { sales, customers } = await getDashboardData();

  const recentSales = sales.slice(-5).reverse();
  const totalSales = sales.length;

  const getCustomerInitials = (name: string) => {
    const customer = customers.find(c => c.name === name);
    if (customer) {
      const nameParts = customer.name.split(' ');
      return nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : nameParts[0].substring(0, 2);
    }
    return name.substring(0,2).toUpperCase();
  }

  const getCustomerEmail = (name: string) => {
    const customer = customers.find(c => c.name === name);
    return customer ? customer.email : "No email available";
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Sales</CardTitle>
        <CardDescription>You made {totalSales} sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        {recentSales.length > 0 ? (
          <div className="space-y-8">
            {recentSales.map((sale, index) => {
              const placeholder = placeholderImages[index % placeholderImages.length];
              return (
                <div className="flex items-center" key={sale.id}>
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={placeholder.imageUrl}
                      alt="Avatar"
                      data-ai-hint={placeholder.imageHint}
                    />
                    <AvatarFallback>{getCustomerInitials(sale.customer)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.customer}</p>
                    <p className="text-sm text-muted-foreground">{getCustomerEmail(sale.customer)}</p>
                  </div>
                  <div className="ml-auto font-medium">+{`₹${sale.price.toLocaleString('en-IN')}`}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-48">
            <p className="text-sm text-muted-foreground">No recent sales.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
