/**
 * CoinGecko API service — fetches real market data.
 * Falls back to mock data if the API is unavailable.
 */

import type { CryptoAsset } from "@/types/crypto";
import { calculateRiskMetrics } from "@/lib/risk";
import { generateSentiment } from "@/lib/sentiment";
import { getMockMarketData } from "@/lib/mockData";

const BASE_URL = "https://api.coingecko.com/api/v3";

interface CoinGeckoMarketItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  sparkline_in_7d?: { price: number[] };
}

/**
 * Fetch top cryptocurrencies by market cap.
 * Includes 7-day sparkline for volatility calculation.
 */
export async function fetchTopCryptos(count = 20): Promise<CryptoAsset[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=true&price_change_percentage=24h`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

    const data: CoinGeckoMarketItem[] = await res.json();
    return data.map(mapToAsset);
  } catch (err) {
    console.warn("CoinGecko unavailable, using mock data:", err);
    return getMockMarketData(count);
  }
}

/** Map raw API response to our domain model, enriching with risk/sentiment */
function mapToAsset(coin: CoinGeckoMarketItem): CryptoAsset {
  const sparkline = coin.sparkline_in_7d?.price ?? [];

  // Calculate risk sub-scores
  const risk = calculateRiskMetrics({
    sparkline,
    volume: coin.total_volume,
    marketCap: coin.market_cap,
    priceChangePercent: coin.price_change_percentage_24h,
  });

  // Simulated sentiment
  const sentiment = generateSentiment(coin.id, coin.price_change_percentage_24h);

  return {
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: coin.image,
    currentPrice: coin.current_price,
    priceChange24h: coin.price_change_24h,
    priceChangePercentage24h: coin.price_change_percentage_24h,
    marketCap: coin.market_cap,
    totalVolume: coin.total_volume,
    high24h: coin.high_24h,
    low24h: coin.low_24h,
    sparklineIn7d: sparkline,
    ...risk,
    ...sentiment,
  };
}
