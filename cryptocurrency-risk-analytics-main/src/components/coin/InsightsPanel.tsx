import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CryptoAsset } from "@/types/crypto";
import { generateInsights, type Insight } from "@/lib/insights";

interface Props {
  coin: CryptoAsset;
}

const typeConfig: Record<Insight["type"], { icon: typeof Brain; color: string; bg: string }> = {
  positive: { icon: TrendingUp, color: "text-sentiment-positive", bg: "bg-sentiment-positive/10" },
  neutral: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted" },
  negative: { icon: TrendingDown, color: "text-sentiment-negative", bg: "bg-sentiment-negative/10" },
};

export function InsightsPanel({ coin }: Props) {
  const insights = generateInsights(coin);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <Brain className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">AI Insights</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Rule-based analysis for {coin.name}
      </p>

      <div className="space-y-3">
        {insights.map((insight) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;

          return (
            <div
              key={insight.id}
              className={`flex items-start gap-3 p-3 rounded-lg ${config.bg} border border-border/50`}
            >
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${config.color}`} />
              <p className="text-xs leading-relaxed">{insight.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
