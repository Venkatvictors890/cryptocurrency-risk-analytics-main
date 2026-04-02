import { useNavigate } from "react-router-dom";
import type { CryptoAsset } from "@/types/crypto";
import { formatPrice, formatPercent, formatCompact } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { RiskBadge } from "./RiskBadge";
import { SentimentBadge } from "./SentimentBadge";

interface Props {
  cryptos: CryptoAsset[];
  isLoading: boolean;
}

export function CryptoTable({ cryptos, isLoading }: Props) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-sm p-6 space-y-3">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-base font-semibold">Cryptocurrency Overview</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {cryptos.length} assets — click a row for detailed analysis
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left px-6 py-3 font-medium">#</th>
              <th className="text-left px-3 py-3 font-medium">Name</th>
              <th className="text-right px-3 py-3 font-medium">Price</th>
              <th className="text-right px-3 py-3 font-medium">24h</th>
              <th className="text-right px-3 py-3 font-medium">Market Cap</th>
              <th className="text-right px-3 py-3 font-medium">Volume</th>
              <th className="text-center px-3 py-3 font-medium">Risk Score</th>
              <th className="text-center px-3 py-3 font-medium">Risk Level</th>
              <th className="text-center px-3 py-3 font-medium">Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((coin, idx) => (
              <tr
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                className="border-b border-border/50 hover:bg-muted/40 transition-colors cursor-pointer active:scale-[0.995]"
              >
                <td className="px-6 py-3.5 text-muted-foreground tabular-nums">{idx + 1}</td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="h-7 w-7 rounded-full"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div>
                      <span className="font-medium">{coin.name}</span>
                      <span className="ml-1.5 text-xs text-muted-foreground uppercase">
                        {coin.symbol}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-right font-mono tabular-nums">
                  {formatPrice(coin.currentPrice)}
                </td>
                <td
                  className={`px-3 py-3.5 text-right font-mono tabular-nums ${
                    coin.priceChangePercentage24h >= 0 ? "text-sentiment-positive" : "text-sentiment-negative"
                  }`}
                >
                  {formatPercent(coin.priceChangePercentage24h)}
                </td>
                <td className="px-3 py-3.5 text-right tabular-nums">
                  {formatCompact(coin.marketCap)}
                </td>
                <td className="px-3 py-3.5 text-right tabular-nums">
                  {formatCompact(coin.totalVolume)}
                </td>
                <td className="px-3 py-3.5 text-center">
                  <RiskScoreBar score={coin.riskScore} />
                </td>
                <td className="px-3 py-3.5 text-center">
                  <RiskBadge level={coin.riskLevel} />
                </td>
                <td className="px-3 py-3.5 text-center">
                  <SentimentBadge label={coin.sentimentLabel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RiskScoreBar({ score }: { score: number }) {
  const color =
    score <= 35 ? "bg-risk-low" : score <= 65 ? "bg-risk-moderate" : "bg-risk-high";

  return (
    <div className="flex items-center gap-2 justify-center">
      <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono tabular-nums w-6">{score}</span>
    </div>
  );
}
