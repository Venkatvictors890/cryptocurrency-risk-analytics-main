import { TrendingUp, Shield, BarChart3, Coins } from "lucide-react";
import type { CryptoAsset } from "@/types/crypto";
import { formatCompact } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  cryptos: CryptoAsset[];
  isLoading: boolean;
}

export function StatsRow({ cryptos, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  const totalMarketCap = cryptos.reduce((s, c) => s + c.marketCap, 0);
  const avgRisk = Math.round(cryptos.reduce((s, c) => s + c.riskScore, 0) / (cryptos.length || 1));
  const highRiskCount = cryptos.filter((c) => c.riskLevel === "High").length;
  const positiveSentiment = cryptos.filter((c) => c.sentimentLabel === "Positive").length;

  const stats = [
    {
      label: "Total Market Cap",
      value: formatCompact(totalMarketCap),
      icon: Coins,
      accent: "text-primary",
    },
    {
      label: "Avg Risk Score",
      value: `${avgRisk}/100`,
      icon: Shield,
      accent: avgRisk > 65 ? "text-risk-high" : avgRisk > 35 ? "text-risk-moderate" : "text-risk-low",
    },
    {
      label: "High Risk Assets",
      value: `${highRiskCount} / ${cryptos.length}`,
      icon: BarChart3,
      accent: "text-risk-high",
    },
    {
      label: "Positive Sentiment",
      value: `${positiveSentiment} / ${cryptos.length}`,
      icon: TrendingUp,
      accent: "text-sentiment-positive",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-card rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2 mb-2">
            <s.icon className={`h-4 w-4 ${s.accent}`} />
            <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
          </div>
          <p className={`text-2xl font-semibold tabular-nums ${s.accent}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}
