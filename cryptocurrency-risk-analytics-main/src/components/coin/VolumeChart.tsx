import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import type { CryptoAsset } from "@/types/crypto";
import { generateHistoricalData } from "@/lib/historicalData";
import { formatCompact } from "@/lib/format";

interface Props {
  coin: CryptoAsset;
  interval: string;
}

import { Info, BarChart as BarChartIcon } from "lucide-react";

/** Custom Tooltip for Volume Chart with terminology */
function VolumeTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="glass-card rounded-xl p-3 text-[11px] border shadow-2xl animate-fade-in min-w-[200px]">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <BarChartIcon className="h-3 w-3 text-primary" />
          <span className="font-bold">{label}</span>
        </div>
        <span className="text-muted-foreground font-mono">{formatCompact(value)}</span>
      </div>
      <p className="text-muted-foreground leading-relaxed">
        <strong>Trading Volume:</strong> The total amount of the coin exchanged during this interval. High volume confirms trend strength.
      </p>
      <div className="mt-2 pt-2 border-t border-border/40 flex items-center gap-1.5 text-[9px] font-medium text-primary">
        <Info className="h-2.5 w-2.5" />
        <span>Liquidity Indicator: {value > 1000000000 ? "High" : "Average"}</span>
      </div>
    </div>
  );
}

export function VolumeChart({ coin, interval }: Props) {
  const data = generateHistoricalData(coin.id, coin.currentPrice, coin.totalVolume, interval as any);

  return (
    <div className="glass-card rounded-xl p-5 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-0.5">Volume Chart</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Trading Activity — {interval}
          </p>
        </div>
        <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
          <BarChartIcon className="h-3.5 w-3.5 text-primary" />
        </div>
      </div>
      
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="hsl(var(--chart-grid))" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: "hsl(var(--chart-tick))" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(var(--chart-tick))" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCompact(v)}
              width={45}
            />
            <Tooltip content={<VolumeTooltip />} cursor={false} />
            <Bar 
              dataKey="volume" 
              fill="hsl(var(--primary))" 
              radius={[3, 3, 0, 0]} 
              opacity={0.8}
              className="hover:opacity-100 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
