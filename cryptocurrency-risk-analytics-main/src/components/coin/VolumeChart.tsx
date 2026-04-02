import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import type { CryptoAsset } from "@/types/crypto";
import { generateHistoricalData } from "@/lib/historicalData";
import { formatCompact } from "@/lib/format";

interface Props {
  coin: CryptoAsset;
  interval: string;
}

export function VolumeChart({ coin, interval }: Props) {
  const data = generateHistoricalData(coin.id, coin.currentPrice, coin.totalVolume, interval as any);

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold mb-1">Volume Chart</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Trading volume — {interval} interval
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid stroke="hsl(225, 12%, 20%)" strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "hsl(220, 10%, 52%)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(220, 10%, 52%)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCompact(v)}
            width={60}
          />
          <Tooltip cursor = {{fill : "transparent"}}
            contentStyle={{
              backgroundColor: "hsl(225, 15%, 13%)",
              border: "1px solid hsl(225, 12%, 20%)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "hsl(220, 15%, 90%)",
            }}
            formatter={(value: number) => [formatCompact(value), "Volume"]}
          />
          <Bar dataKey="volume" fill="hsl(152, 69%, 41%)" radius={[3, 3, 0, 0]} opacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
