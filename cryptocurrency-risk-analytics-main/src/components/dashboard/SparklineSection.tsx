import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { CryptoAsset } from "@/types/crypto";
import { formatPrice, formatPercent } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  cryptos: CryptoAsset[];
  isLoading: boolean;
}

export function SparklineSection({ cryptos, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-sm p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Show top 5 by market cap
  const top5 = cryptos.slice(0, 5);

  return (
    <div className="bg-card rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold mb-1">7-Day Price Trends</h3>
      <p className="text-xs text-muted-foreground mb-4">Top 5 cryptocurrencies</p>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {top5.map((coin) => (
          <SparklineCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  );
}

function SparklineCard({ coin }: { coin: CryptoAsset }) {
  const isUp = coin.priceChangePercentage24h >= 0;
  const color = isUp ? "hsl(152, 69%, 41%)" : "hsl(0, 72%, 51%)";

  // Downsample sparkline for performance
  const sparkData = coin.sparklineIn7d
    .filter((_, i) => i % 4 === 0)
    .map((price, i) => ({ i, price }));

  return (
    <div className="rounded-lg border border-border p-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 mb-1">
        <img
          src={coin.image}
          alt={coin.name}
          className="h-5 w-5 rounded-full"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <span className="text-xs font-medium truncate">{coin.symbol.toUpperCase()}</span>
      </div>
      <p className="text-sm font-semibold font-mono tabular-nums">{formatPrice(coin.currentPrice)}</p>
      <p className={`text-[11px] font-mono tabular-nums ${isUp ? "text-sentiment-positive" : "text-sentiment-negative"}`}>
        {formatPercent(coin.priceChangePercentage24h)}
      </p>
      <div className="mt-2 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
