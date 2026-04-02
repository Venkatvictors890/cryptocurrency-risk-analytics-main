import { useQuery } from "@tanstack/react-query";
import { fetchTopCryptos } from "@/services/coingecko";

/**
 * Hook to fetch and auto-refresh crypto data.
 * Refreshes every 60 seconds to stay within CoinGecko free tier limits.
 * Supports multiple fiat currencies.
 */
export function useCryptoData(count = 50, currency = "usd") {
  return useQuery({
    queryKey: ["cryptos", count, currency],
    queryFn: () => fetchTopCryptos(count, currency),
    refetchInterval: 60 * 1000, // 60 seconds
    staleTime: 30 * 1000,
    retry: 2,
  });
}
