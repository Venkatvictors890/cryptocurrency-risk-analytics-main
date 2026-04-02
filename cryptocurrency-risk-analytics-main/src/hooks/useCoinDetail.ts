import { useQuery } from "@tanstack/react-query";
import { fetchCoinMarketChart } from "@/services/coingecko";

/**
 * Hook for fetching real historical chart data for a single coin.
 * Auto-refreshes every 60 seconds.
 */
export function useCoinChart(coinId: string | undefined, currency = "usd", days: number | string = 7) {
  return useQuery({
    queryKey: ["coinChart", coinId, currency, days],
    queryFn: () => fetchCoinMarketChart(coinId!, currency, days),
    enabled: !!coinId,
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
    retry: 2,
  });
}
