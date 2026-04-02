/**
 * Simulated sentiment analysis engine.
 *
 * In production, this would use NLP (VADER / TextBlob) on a Python backend
 * to analyze Twitter, Reddit, and news text. For this frontend-only version,
 * we generate deterministic-but-realistic sentiment scores from market signals.
 */

import type { SentimentLabel, SentimentItem } from "@/types/crypto";

interface SentimentResult {
  sentimentScore: number;       // -1 to 1
  sentimentLabel: SentimentLabel;
}

/** Map a -1..1 score to a label */
function toLabel(score: number): SentimentLabel {
  if (score > 0.15) return "Positive";
  if (score < -0.15) return "Negative";
  return "Neutral";
}

/**
 * Generate a deterministic sentiment from coin id + price change.
 * Simulates what an NLP pipeline would produce.
 */
export function generateSentiment(coinId: string, priceChangePercent: number): SentimentResult {
  const seed = coinId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const noise = ((seed * 31) % 40 - 20) / 100; // ±0.2 noise
  const base = Math.tanh(priceChangePercent / 8);  // smooth mapping
  const sentimentScore = Math.max(-1, Math.min(1, +(base + noise).toFixed(2)));

  return {
    sentimentScore,
    sentimentLabel: toLabel(sentimentScore),
  };
}

/** Sample social/news posts (mock data for the feed) */
const TEMPLATES: Record<string, string[]> = {
  positive: [
    "🚀 $COIN looking incredibly bullish today!",
    "Just loaded up more $COIN — fundamentals are solid",
    "Technical analysis shows $COIN breaking key resistance",
    "$COIN adoption is accelerating, partnerships announced",
    "Whale wallets accumulating $COIN heavily this week",
  ],
  negative: [
    "⚠️ $COIN showing bearish divergence on the 4H chart",
    "Concerned about $COIN liquidity — volume is drying up",
    "Regulatory pressure mounting on $COIN ecosystem",
    "$COIN whale just dumped a large position",
    "Smart money exiting $COIN according to on-chain data",
  ],
  neutral: [
    "$COIN consolidating in a tight range — waiting for breakout",
    "Mixed signals on $COIN — market is undecided",
    "$COIN development team released a minor update",
    "Volume on $COIN is about average today",
    "Analysts divided on $COIN's short-term direction",
  ],
};

const SOURCES: SentimentItem["source"][] = ["twitter", "reddit", "news"];

/** Generate mock social/news feed items for a given coin */
export function generateSentimentFeed(coinId: string, symbol: string, count = 6): SentimentItem[] {
  const seed = coinId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const items: SentimentItem[] = [];

  for (let i = 0; i < count; i++) {
    const categories = Object.keys(TEMPLATES) as (keyof typeof TEMPLATES)[];
    const catIndex = (seed + i * 7) % categories.length;
    const category = categories[catIndex];
    const templates = TEMPLATES[category];
    const templateIndex = (seed + i * 13) % templates.length;
    const text = templates[templateIndex].replace("$COIN", `$${symbol.toUpperCase()}`);
    const score = category === "positive" ? 0.3 + (i % 5) * 0.1 : category === "negative" ? -(0.3 + (i % 5) * 0.1) : 0;

    items.push({
      id: `${coinId}-${i}`,
      source: SOURCES[(seed + i) % SOURCES.length],
      text,
      sentiment: toLabel(score),
      score,
      timestamp: new Date(Date.now() - (i * 45 + (seed % 30)) * 60000),
      coinId,
    });
  }

  return items;
}
