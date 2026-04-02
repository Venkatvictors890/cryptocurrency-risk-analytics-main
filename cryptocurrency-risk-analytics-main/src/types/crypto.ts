/** Core cryptocurrency data with risk and sentiment analysis */
export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  totalVolume: number;
  high24h: number;
  low24h: number;
  sparklineIn7d: number[];
  riskScore: number;
  riskLevel: RiskLevel;
  sentimentScore: number;
  sentimentLabel: SentimentLabel;
  volatilityScore: number;
  liquidityScore: number;
  socialSentimentScore: number;
  newsImpactScore: number;
  transactionBehaviorScore: number;
}

export type RiskLevel = "Low" | "Moderate" | "High";
export type SentimentLabel = "Positive" | "Neutral" | "Negative";

/** Historical data point for charts */
export interface HistoricalDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  riskScore: number;
  sentimentScore: number;
}

/** Weights for risk score calculation */
export interface RiskWeights {
  volatility: number;
  liquidity: number;
  socialSentiment: number;
  newsImpact: number;
  transactionBehavior: number;
}

/** News/social mock item */
export interface SentimentItem {
  id: string;
  source: "twitter" | "reddit" | "news";
  text: string;
  sentiment: SentimentLabel;
  score: number;
  timestamp: Date;
  coinId: string;
}
