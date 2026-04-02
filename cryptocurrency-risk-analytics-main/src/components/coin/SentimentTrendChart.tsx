import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import type { CryptoAsset } from "@/types/crypto";
import { generateHistoricalData } from "@/lib/historicalData";

interface Props {
  coin: CryptoAsset;
  interval: string;
}

export function SentimentTrendChart({ coin, interval }: Props) {
  const data = generateHistoricalData(coin.id, coin.currentPrice, coin.totalVolume, interval as any);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold mb-1">Sentiment Trend</h3>
      <p className="text-xs text-muted-foreground mb-4">
        NLP-based sentiment score (-1 to +1)
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(225, 12%, 20%)" strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "hsl(220, 10%, 52%)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[-1, 1]}
            tick={{ fontSize: 10, fill: "hsl(220, 10%, 52%)" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <ReferenceLine y={0} stroke="hsl(225, 12%, 25%)" strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(225, 15%, 13%)",
              border: "1px solid hsl(225, 12%, 20%)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "hsl(220, 15%, 90%)",
            }}
            formatter={(value: number) => [value.toFixed(2), "Sentiment"]}
          />
          <Area
            type="monotone"
            dataKey="sentimentScore"
            stroke="hsl(199, 89%, 48%)"
            fill="url(#sentGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
