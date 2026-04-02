/**
 * Mock market data — used as fallback when CoinGecko API is unavailable.
 */

import type { CryptoAsset } from "@/types/crypto";
import { calculateRiskMetrics } from "./risk";
import { generateSentiment } from "./sentiment";

interface MockCoin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume: number;
  change24h: number;
}

const MOCK_COINS: MockCoin[] = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin", price: 67234, marketCap: 1320000000000, volume: 28500000000, change24h: 2.4 },
  { id: "ethereum", symbol: "eth", name: "Ethereum", price: 3456, marketCap: 415000000000, volume: 15200000000, change24h: -1.2 },
  { id: "tether", symbol: "usdt", name: "Tether", price: 1.0, marketCap: 110000000000, volume: 52000000000, change24h: 0.01 },
  { id: "binancecoin", symbol: "bnb", name: "BNB", price: 584, marketCap: 87600000000, volume: 1800000000, change24h: 0.8 },
  { id: "solana", symbol: "sol", name: "Solana", price: 148, marketCap: 65000000000, volume: 3200000000, change24h: 5.3 },
  { id: "ripple", symbol: "xrp", name: "XRP", price: 0.52, marketCap: 28500000000, volume: 1200000000, change24h: -0.3 },
  { id: "usd-coin", symbol: "usdc", name: "USD Coin", price: 1.0, marketCap: 33000000000, volume: 8500000000, change24h: 0.0 },
  { id: "cardano", symbol: "ada", name: "Cardano", price: 0.45, marketCap: 16000000000, volume: 420000000, change24h: -2.1 },
  { id: "dogecoin", symbol: "doge", name: "Dogecoin", price: 0.156, marketCap: 22400000000, volume: 1600000000, change24h: 8.7 },
  { id: "avalanche-2", symbol: "avax", name: "Avalanche", price: 35.8, marketCap: 13200000000, volume: 580000000, change24h: -3.5 },
  { id: "polkadot", symbol: "dot", name: "Polkadot", price: 7.12, marketCap: 9800000000, volume: 310000000, change24h: 1.1 },
  { id: "chainlink", symbol: "link", name: "Chainlink", price: 14.56, marketCap: 8500000000, volume: 620000000, change24h: 3.8 },
  { id: "tron", symbol: "trx", name: "TRON", price: 0.118, marketCap: 10300000000, volume: 380000000, change24h: -0.5 },
  { id: "matic-network", symbol: "matic", name: "Polygon", price: 0.72, marketCap: 6700000000, volume: 410000000, change24h: -1.8 },
  { id: "litecoin", symbol: "ltc", name: "Litecoin", price: 84.3, marketCap: 6300000000, volume: 520000000, change24h: 0.9 },
  { id: "uniswap", symbol: "uni", name: "Uniswap", price: 7.85, marketCap: 4700000000, volume: 180000000, change24h: 4.2 },
  { id: "stellar", symbol: "xlm", name: "Stellar", price: 0.112, marketCap: 3200000000, volume: 95000000, change24h: -0.7 },
  { id: "cosmos", symbol: "atom", name: "Cosmos", price: 9.34, marketCap: 3600000000, volume: 170000000, change24h: 2.6 },
  { id: "monero", symbol: "xmr", name: "Monero", price: 167, marketCap: 3100000000, volume: 92000000, change24h: 1.4 },
  { id: "filecoin", symbol: "fil", name: "Filecoin", price: 5.78, marketCap: 2800000000, volume: 210000000, change24h: -4.1 },
];

/** Generate a simple sparkline from price and volatility */
function fakeSparkline(price: number, seed: number): number[] {
  const points: number[] = [];
  let p = price;
  for (let i = 0; i < 168; i++) {
    const noise = ((seed * (i + 1) * 7) % 100 - 50) / 5000;
    p = p * (1 + noise);
    points.push(p);
  }
  return points;
}

export function getMockMarketData(count: number): CryptoAsset[] {
  return MOCK_COINS.slice(0, count).map((coin) => {
    const seed = coin.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const sparkline = fakeSparkline(coin.price, seed);

    const risk = calculateRiskMetrics({
      sparkline,
      volume: coin.volume,
      marketCap: coin.marketCap,
      priceChangePercent: coin.change24h,
    });

    const sentiment = generateSentiment(coin.id, coin.change24h);

    return {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: `https://assets.coingecko.com/coins/images/1/small/${coin.id}.png`,
      currentPrice: coin.price,
      priceChange24h: coin.price * coin.change24h / 100,
      priceChangePercentage24h: coin.change24h,
      marketCap: coin.marketCap,
      totalVolume: coin.volume,
      high24h: coin.price * 1.03,
      low24h: coin.price * 0.97,
      sparklineIn7d: sparkline,
      ...risk,
      ...sentiment,
    };
  });
}
