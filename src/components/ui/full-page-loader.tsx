
import { Loader2 } from "lucide-react";

export function FullPageLoader() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Loading content...</p>
    </div>
  );
}
