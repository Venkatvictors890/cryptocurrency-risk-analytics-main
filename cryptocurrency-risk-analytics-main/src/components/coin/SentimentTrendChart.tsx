import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import type { CryptoAsset } from "@/types/crypto";
import { generateHistoricalData } from "@/lib/historicalData";

interface Props {
  coin: CryptoAsset;
  interval: string;
}

import { Info, TrendingUp, MessageSquare } from "lucide-react";

/** Terminology definitions for Sentiment Trend */
const TREND_EXPLANATIONS = {
  score: "The numerical measure of market emotion. Positive (>0) means bullish sentiment, Negative (<0) indicates fear or FUD.",
  vader: "VADER (Valence Aware Dictionary and sEntiment Reasoner) is the NLP engine used to quantify emotional intensity in social posts.",
  momentum: "Measures the rate of change in sentiment. High momentum often precedes price breakouts or reversals."
};

/** Custom Tooltip with definitions */
function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;
  const isPositive = score > 0;

  return (
    <div className="glass-card rounded-xl p-3 text-[11px] border shadow-2xl animate-fade-in min-w-[220px]">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-3 w-3 text-primary" />
          <span className="font-bold">{label}</span>
        </div>
        <span className={cn(
          "font-mono font-bold",
          isPositive ? "text-sentiment-positive" : score < 0 ? "text-sentiment-negative" : "text-muted-foreground"
        )}>
          {score.toFixed(2)}
        </span>
      </div>
      
      <div className="space-y-2.5">
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Sentiment Index:</strong> {TREND_EXPLANATIONS.score}
        </p>
        
        <div className="pt-2 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-primary mb-1">
            <Info className="h-2.5 w-2.5" />
            <span className="font-bold uppercase tracking-wider text-[9px]">VADER NLP Log</span>
          </div>
          <p className="text-[10px] text-muted-foreground/80 leading-snug italic">
            {TREND_EXPLANATIONS.vader}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-chart-2">
          <TrendingUp className="h-2.5 w-2.5" />
          <span className="font-bold uppercase tracking-wider text-[9px]">Crowd Momentum</span>
        </div>
      </div>
    </div>
  );
}

// Helper for conditional classes if not imported
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export function SentimentTrendChart({ coin, interval }: Props) {
  const data = generateHistoricalData(coin.id, coin.currentPrice, coin.totalVolume, interval as any);

  return (
    <div className="glass-card rounded-xl p-5 h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-0.5">Sentiment Trend</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Social Pulse Analysis — {interval}
          </p>
        </div>
        <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--chart-grid))" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: "hsl(var(--chart-tick))" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[-1, 1]}
              tick={{ fontSize: 9, fill: "hsl(var(--chart-tick))" }}
              axisLine={false}
              tickLine={false}
              width={25}
            />
            <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" opacity={0.5} />
            <Tooltip content={<TrendTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="sentimentScore"
              stroke="hsl(var(--primary))"
              fill="url(#sentGrad)"
              strokeWidth={2.5}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
