import { RefreshCw, Timer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Props {
  lastUpdated: Date | null;
}

export function DashboardHeader({ lastUpdated }: Props) {
  const [seconds, setSeconds] = useState(60);

  // Sync countdown with data refresh (assuming 60s interval)
  useEffect(() => {
    if (!lastUpdated) return;
    setSeconds(60);
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const handleManualRefresh = () => {
    window.location.reload(); // Simplest way to trigger a full refresh in this prototype
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
          Multi-factor risk analysis 
          <span className="h-1 w-1 rounded-full bg-primary/40" />
          Real-time tracking enabled
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Real-time Tracking Bar & Timer */}
        <div className="hidden sm:flex flex-col items-end gap-1.5 min-w-[140px]">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">
            <Timer className="h-2.5 w-2.5" />
            <span>Next Refresh: {seconds}s</span>
          </div>
          <div className="h-1 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary/60 transition-all duration-1000 ease-linear"
              style={{ width: `${(seconds / 60) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end px-3 py-1.5 rounded-lg border border-border bg-card/50">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {lastUpdated ? (
                <span>Sync {formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
              ) : (
                <span>Initializing…</span>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleManualRefresh}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
            title="Manual Refresh"
          >
            <RefreshCw className={cn("h-4 w-4", !lastUpdated && "animate-spin")} />
          </button>
        </div>
      </div>
    </div>
  );
}
