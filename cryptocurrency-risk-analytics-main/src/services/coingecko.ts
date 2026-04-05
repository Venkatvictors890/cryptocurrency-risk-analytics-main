/**
 * CoinGecko API service — fetches real market data.
 * Falls back to mock data if the API is unavailable.
 * Supports 20 fiat currencies and real historical chart data.
 */

import type { CryptoAsset } from "@/types/crypto";
import { calculateRiskMetrics } from "@/lib/risk";
import { generateSentiment } from "@/lib/sentiment";
import { getMockMarketData } from "@/lib/mockData";

const BASE_URL = "https://api.coingecko.com/api/v3";

/** 20 supported fiat currencies */
export const SUPPORTED_CURRENCIES = [
  { code: "usd", symbol: "$", name: "US Dollar" },
  { code: "inr", symbol: "₹", name: "Indian Rupee" },
  { code: "eur", symbol: "€", name: "Euro" },
  { code: "gbp", symbol: "£", name: "British Pound" },
  { code: "jpy", symbol: "¥", name: "Japanese Yen" },
  { code: "aud", symbol: "A$", name: "Australian Dollar" },
  { code: "cad", symbol: "C$", name: "Canadian Dollar" },
  { code: "chf", symbol: "Fr", name: "Swiss Franc" },
  { code: "cny", symbol: "¥", name: "Chinese Yuan" },
  { code: "krw", symbol: "₩", name: "South Korean Won" },
  { code: "sgd", symbol: "S$", name: "Singapore Dollar" },
  { code: "hkd", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "sek", symbol: "kr", name: "Swedish Krona" },
  { code: "nok", symbol: "kr", name: "Norwegian Krone" },
  { code: "dkk", symbol: "kr", name: "Danish Krone" },
  { code: "brl", symbol: "R$", name: "Brazilian Real" },
  { code: "mxn", symbol: "MX$", name: "Mexican Peso" },
  { code: "zar", symbol: "R", name: "South African Rand" },
  { code: "pln", symbol: "zł", name: "Polish Zloty" },
  { code: "thb", symbol: "฿", name: "Thai Baht" },
] as const;

export type FiatCurrency = typeof SUPPORTED_CURRENCIES[number];

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
export async function fetchTopCryptos(count = 50, currency = "usd"): Promise<CryptoAsset[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${count}&page=1&sparkline=true&price_change_percentage=24h`,
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

/**
 * Fetch real historical market chart data for a coin.
 * Returns price, volume arrays with timestamps.
 */
export async function fetchCoinMarketChart(
  coinId: string,
  currency = "usd",
  days: number | string = 7
): Promise<{ prices: [number, number][]; volumes: [number, number][] }> {
  try {
    const res = await fetch(
      `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) throw new Error(`CoinGecko chart ${res.status}`);
    const data = await res.json();
    return {
      prices: data.prices ?? [],
      volumes: data.total_volumes ?? [],
    };
  } catch (err) {
    console.warn("Chart data unavailable:", err);
    return { prices: [], volumes: [] };
  }
}

/**
 * Fetch detailed single coin data.
 */
export async function fetchCoinDetail(coinId: string): Promise<any> {
  try {
    const res = await fetch(
      `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&community_data=true&developer_data=false&sparkline=true`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) throw new Error(`CoinGecko detail ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Coin detail unavailable:", err);
    return null;
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
    currentPrice: coin.current_price ?? 0,
    priceChange24h: coin.price_change_24h ?? 0,
    priceChangePercentage24h: coin.price_change_percentage_24h ?? 0,
    marketCap: coin.market_cap ?? 0,
    totalVolume: coin.total_volume ?? 0,
    high24h: coin.high_24h ?? 0,
    low24h: coin.low_24h ?? 0,
    sparklineIn7d: sparkline,
    ...risk,
    ...sentiment,
  };
}
