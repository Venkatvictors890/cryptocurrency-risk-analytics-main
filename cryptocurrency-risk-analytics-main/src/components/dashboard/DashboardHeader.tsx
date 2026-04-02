import { RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Props {
  lastUpdated: Date | null;
}

export function DashboardHeader({ lastUpdated }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold leading-tight">Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Multi-factor risk and sentiment analysis
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card px-3 py-2 rounded-lg border border-border">
        <RefreshCw className="h-3.5 w-3.5 animate-pulse-gentle" />
        {lastUpdated ? (
          <span>Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
        ) : (
          <span>Loading…</span>
        )}
      </div>
    </div>
  );
}
