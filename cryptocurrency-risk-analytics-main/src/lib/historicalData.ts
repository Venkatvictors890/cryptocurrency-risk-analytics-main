/**
 * Generate simulated historical data for different time intervals.
 * In production, this would come from stored database snapshots.
 */

export interface HistoricalPoint {
  time: string;
  price: number;
  volume: number;
  sentimentScore: number;
  riskScore: number;
}

type Interval = "1m" | "5m" | "1H" | "1D" | "1W" | "1M";

const INTERVAL_CONFIG: Record<Interval, { points: number; labelFn: (i: number) => string; stepMs: number }> = {
  "1m": { points: 60, labelFn: (i) => `${60 - i}s`, stepMs: 1000 },
  "5m": { points: 60, labelFn: (i) => `${5 * 60 - i * 5}s`, stepMs: 5000 },
  "1H": { points: 60, labelFn: (i) => `${60 - i}m`, stepMs: 60000 },
  "1D": { points: 24, labelFn: (i) => `${24 - i}h`, stepMs: 3600000 },
  "1W": { points: 7, labelFn: (i) => `${7 - i}d`, stepMs: 86400000 },
  "1M": { points: 30, labelFn: (i) => `${30 - i}d`, stepMs: 86400000 },
};

/** Generate deterministic historical data for a given coin and interval */
export function generateHistoricalData(
  coinId: string,
  basePrice: number,
  baseVolume: number,
  interval: Interval
): HistoricalPoint[] {
  const seed = coinId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const config = INTERVAL_CONFIG[interval];
  const points: HistoricalPoint[] = [];
  let price = basePrice;

  for (let i = 0; i < config.points; i++) {
    const noise = ((seed * (i + 1) * 7 + i * 13) % 200 - 100) / 10000;
    price = price * (1 + noise);
    const volNoise = ((seed * (i + 1) * 11) % 60 - 30) / 100;
    const volume = baseVolume * (1 + volNoise);
    const sentNoise = ((seed * (i + 3) * 17) % 100 - 50) / 100;
    const riskNoise = ((seed * (i + 5) * 23) % 40 - 20);

    points.push({
      time: config.labelFn(i),
      price: +price.toFixed(price > 1 ? 2 : 6),
      volume: Math.round(volume),
      sentimentScore: +(Math.max(-1, Math.min(1, sentNoise)).toFixed(2)),
      riskScore: Math.max(0, Math.min(100, 50 + riskNoise)),
    });
  }

  return points;
}
