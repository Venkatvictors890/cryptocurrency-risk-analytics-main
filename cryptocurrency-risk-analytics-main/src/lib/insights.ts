/**
 * Rule-based insight generation engine.
 * Produces human-readable AI-like insights from market data.
 */

import type { CryptoAsset } from "@/types/crypto";

export interface Insight {
  id: string;
  text: string;
  type: "positive" | "neutral" | "negative";
  priority: number;
}

export function generateInsights(coin: CryptoAsset): Insight[] {
  const insights: Insight[] = [];
  const name = coin.name;

  // Volatility insights
  if (coin.volatilityScore < 20) {
    insights.push({
      id: `${coin.id}-vol-low`,
      text: `${name} shows stable price action with very low volatility — suitable for conservative portfolios.`,
      type: "positive",
      priority: 1,
    });
  } else if (coin.volatilityScore > 70) {
    insights.push({
      id: `${coin.id}-vol-high`,
      text: `⚠️ ${name} experiencing high volatility — price swings may present both opportunity and risk.`,
      type: "negative",
      priority: 1,
    });
  }

  // Sentiment insights
  if (coin.sentimentLabel === "Positive") {
    insights.push({
      id: `${coin.id}-sent-pos`,
      text: `${name} sentiment is improving across social channels — community confidence is growing.`,
      type: "positive",
      priority: 2,
    });
  } else if (coin.sentimentLabel === "Negative") {
    insights.push({
      id: `${coin.id}-sent-neg`,
      text: `${name} facing negative sentiment pressure — monitor for potential further downside.`,
      type: "negative",
      priority: 2,
    });
  }

  // Price action
  if (coin.priceChangePercentage24h > 5) {
    insights.push({
      id: `${coin.id}-price-up`,
      text: `${name} surged ${coin.priceChangePercentage24h.toFixed(1)}% in 24h — momentum is strongly bullish.`,
      type: "positive",
      priority: 3,
    });
  } else if (coin.priceChangePercentage24h < -5) {
    insights.push({
      id: `${coin.id}-price-down`,
      text: `${name} dropped ${Math.abs(coin.priceChangePercentage24h).toFixed(1)}% in 24h — watch for support levels.`,
      type: "negative",
      priority: 3,
    });
  }

  // Liquidity
  if (coin.liquidityScore > 70) {
    insights.push({
      id: `${coin.id}-liq-low`,
      text: `${name} has relatively low trading liquidity — larger orders may cause slippage.`,
      type: "negative",
      priority: 4,
    });
  } else if (coin.liquidityScore < 20) {
    insights.push({
      id: `${coin.id}-liq-high`,
      text: `${name} maintains excellent market liquidity with healthy volume-to-cap ratio.`,
      type: "positive",
      priority: 4,
    });
  }

  // Risk level
  if (coin.riskLevel === "Low") {
    insights.push({
      id: `${coin.id}-risk-low`,
      text: `Overall risk assessment for ${name} is LOW (${coin.riskScore}/100) — fundamentals appear solid.`,
      type: "positive",
      priority: 0,
    });
  } else if (coin.riskLevel === "High") {
    insights.push({
      id: `${coin.id}-risk-high`,
      text: `⚠️ ${name} carries HIGH risk (${coin.riskScore}/100) — multiple risk factors are elevated.`,
      type: "negative",
      priority: 0,
    });
  } else {
    insights.push({
      id: `${coin.id}-risk-mod`,
      text: `${name} has MODERATE risk (${coin.riskScore}/100) — standard caution advised.`,
      type: "neutral",
      priority: 0,
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
}
