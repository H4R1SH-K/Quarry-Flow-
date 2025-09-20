import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SalesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Sales</h2>
      <Card>
        <CardHeader>
          <CardTitle>Sales Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sales details will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
