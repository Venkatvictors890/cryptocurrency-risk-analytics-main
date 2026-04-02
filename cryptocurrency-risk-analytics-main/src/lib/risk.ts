/**
 * Risk scoring engine.
 *
 * Combines five weighted factors into a 0–100 risk score:
 *   Volatility        30%
 *   Market Liquidity   25%
 *   Social Sentiment   20%
 *   News Impact        15%
 *   Transaction Behavior 10%
 */

import type { RiskLevel, RiskWeights } from "@/types/crypto";

const WEIGHTS: RiskWeights = {
  volatility: 0.30,
  liquidity: 0.25,
  socialSentiment: 0.20,
  newsImpact: 0.15,
  transactionBehavior: 0.10,
};

interface RiskInput {
  sparkline: number[];
  volume: number;
  marketCap: number;
  priceChangePercent: number;
}

interface RiskOutput {
  riskScore: number;
  riskLevel: RiskLevel;
  volatilityScore: number;
  liquidityScore: number;
  socialSentimentScore: number;
  newsImpactScore: number;
  transactionBehaviorScore: number;
}

/**
 * Calculate volatility from sparkline data using coefficient of variation.
 * Returns 0–100 where 100 = extremely volatile.
 */
function calcVolatility(prices: number[]): number {
  if (prices.length < 2) return 50;

  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  if (mean === 0) return 50;

  const variance = prices.reduce((sum, p) => sum + (p - mean) ** 2, 0) / prices.length;
  const cv = (Math.sqrt(variance) / mean) * 100;

  // Normalize: CV of 0 → score 0, CV of 10+ → score 100
  return Math.min(100, Math.round(cv * 10));
}

/**
 * Liquidity score based on volume-to-market-cap ratio.
 * Higher ratio = more liquid = LOWER risk.
 */
function calcLiquidity(volume: number, marketCap: number): number {
  if (marketCap === 0) return 80;
  const ratio = volume / marketCap;
  // ratio > 0.3 is highly liquid (low risk), < 0.02 is illiquid (high risk)
  const score = 100 - Math.min(100, Math.round(ratio * 333));
  return Math.max(0, score);
}

/**
 * Simulated social sentiment risk score.
 * Uses price change as a proxy — negative movement increases risk.
 */
function calcSocialSentiment(priceChangePercent: number, coinId: string): number {
  // Deterministic seed from coin id
  const seed = coinId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const jitter = ((seed * 7) % 20) - 10; // ±10 variation
  const base = 50 - priceChangePercent * 3; // negative change → higher risk
  return Math.max(0, Math.min(100, Math.round(base + jitter)));
}

/** Simulated news impact score */
function calcNewsImpact(priceChangePercent: number, coinId: string): number {
  const seed = coinId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const jitter = ((seed * 13) % 16) - 8;
  const base = 45 - priceChangePercent * 2;
  return Math.max(0, Math.min(100, Math.round(base + jitter)));
}

/** Simulated transaction behavior score */
function calcTransactionBehavior(volume: number, coinId: string): number {
  const seed = coinId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const jitter = ((seed * 17) % 14) - 7;
  const base = 40 + jitter;
  return Math.max(0, Math.min(100, Math.round(base)));
}

function getRiskLevel(score: number): RiskLevel {
  if (score <= 35) return "Low";
  if (score <= 65) return "Moderate";
  return "High";
}

/** Main risk calculation function */
export function calculateRiskMetrics(input: RiskInput): RiskOutput {
  const volatilityScore = calcVolatility(input.sparkline);
  const liquidityScore = calcLiquidity(input.volume, input.marketCap);
  const socialSentimentScore = calcSocialSentiment(input.priceChangePercent, "default");
  const newsImpactScore = calcNewsImpact(input.priceChangePercent, "default");
  const transactionBehaviorScore = calcTransactionBehavior(input.volume, "default");

  const riskScore = Math.round(
    volatilityScore * WEIGHTS.volatility +
    liquidityScore * WEIGHTS.liquidity +
    socialSentimentScore * WEIGHTS.socialSentiment +
    newsImpactScore * WEIGHTS.newsImpact +
    transactionBehaviorScore * WEIGHTS.transactionBehavior
  );

  return {
    riskScore: Math.max(0, Math.min(100, riskScore)),
    riskLevel: getRiskLevel(riskScore),
    volatilityScore,
    liquidityScore,
    socialSentimentScore,
    newsImpactScore,
    transactionBehaviorScore,
  };
}
