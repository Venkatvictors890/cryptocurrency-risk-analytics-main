import type { CryptoAsset } from "@/types/crypto";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WEIGHTS = {
  volatility: 0.30,
  liquidity: 0.25,
  social: 0.20,
  news: 0.15,
  transaction: 0.10,
};

const EXPLANATIONS: Record<string, string> = {
  "Volatility Index": "Measures how much the price fluctuates over time. Higher volatility = higher risk.",
  "Market Liquidity": "How easily the asset can be bought/sold without affecting price. Low liquidity = harder to trade.",
  "Social Sentiment": "Overall mood across social media (Twitter, Reddit). Negative sentiment may signal sell-offs.",
  "News Impact": "How recent news (regulations, partnerships) affects the coin's outlook.",
  "Transaction Behavior": "On-chain activity patterns like whale movements and transaction frequency.",
};

interface Props {
  coin: CryptoAsset;
}

function InfoTooltip({ label }: { label: string }) {
  const explanation = EXPLANATIONS[label];
  if (!explanation) return null;
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3 w-3 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px] text-xs leading-relaxed">
          {explanation}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function RiskBreakdownPanel({ coin }: Props) {
  const factors = [
    { label: "Volatility Index", score: coin.volatilityScore, weight: WEIGHTS.volatility },
    { label: "Market Liquidity", score: coin.liquidityScore, weight: WEIGHTS.liquidity },
    { label: "Social Sentiment", score: coin.socialSentimentScore, weight: WEIGHTS.social },
    { label: "News Impact", score: coin.newsImpactScore, weight: WEIGHTS.news },
    { label: "Transaction Behavior", score: coin.transactionBehaviorScore, weight: WEIGHTS.transaction },
  ];

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-sm font-semibold">Risk Analysis Panel</h3>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[240px] text-xs leading-relaxed">
              Composite risk score (0–100) calculated from weighted factors. Lower = safer.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Weighted factor breakdown — Total: {coin.riskScore}/100
      </p>

      <div className="space-y-4">
        {factors.map((f) => {
          const contribution = Math.round(f.score * f.weight);
          const barColor =
            f.score <= 35 ? "bg-risk-low" : f.score <= 65 ? "bg-risk-moderate" : "bg-risk-high";

          return (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium flex items-center gap-1.5">
                  {f.label}
                  <InfoTooltip label={f.label} />
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">
                    Weight: {(f.weight * 100).toFixed(0)}%
                  </span>
                  <span className="font-mono tabular-nums font-medium">
                    {f.score}/100
                  </span>
                  <span className="text-muted-foreground font-mono">
                    → {contribution}
                  </span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${f.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm font-semibold">Composite Risk Score</span>
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-mono font-bold tabular-nums ${
            coin.riskScore <= 35 ? "text-risk-low" : coin.riskScore <= 65 ? "text-risk-moderate" : "text-risk-high"
          }`}>
            {coin.riskScore}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
    </div>
  );
}
