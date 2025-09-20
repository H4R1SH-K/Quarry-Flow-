import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { recentSales } from "@/lib/data";
import { placeholderImages } from "@/lib/placeholder-images.json";

export function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
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
                  <AvatarFallback>{sale.initials}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{sale.name}</p>
                  <p className="text-sm text-muted-foreground">{sale.email}</p>
                </div>
                <div className="ml-auto font-medium">{sale.amount}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
