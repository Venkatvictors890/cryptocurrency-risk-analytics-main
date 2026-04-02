import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { CryptoAsset } from "@/types/crypto";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  cryptos: CryptoAsset[];
  isLoading: boolean;
}

export function RiskBreakdownChart({ cryptos, isLoading }: Props) {
  if (isLoading) return <Skeleton className="h-72 rounded-xl" />;

  // Average each risk factor across all assets
  const avg = (fn: (c: CryptoAsset) => number) =>
    Math.round(cryptos.reduce((s, c) => s + fn(c), 0) / (cryptos.length || 1));

  const data = [
    { factor: "Volatility", score: avg((c) => c.volatilityScore) },
    { factor: "Liquidity", score: avg((c) => c.liquidityScore) },
    { factor: "Social", score: avg((c) => c.socialSentimentScore) },
    { factor: "News", score: avg((c) => c.newsImpactScore) },
    { factor: "Txn Behavior", score: avg((c) => c.transactionBehaviorScore) },
  ];

  return (
    <div className="bg-card rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold mb-1">Risk Factor Breakdown</h3>
      <p className="text-xs text-muted-foreground mb-4">Weighted average across assets</p>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="hsl(220, 13%, 90%)" />
          <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10, fill: "hsl(220, 10%, 46%)" }} />
          <Radar
            dataKey="score"
            stroke="hsl(199, 89%, 48%)"
            fill="hsl(199, 89%, 48%)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid hsl(220, 13%, 90%)",
              fontSize: "12px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
