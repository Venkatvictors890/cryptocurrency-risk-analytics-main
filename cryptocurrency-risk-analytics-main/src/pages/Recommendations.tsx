import { useCryptoData } from "@/hooks/useCryptoData";
import { formatPrice } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, Pause, AlertTriangle, TrendingUp, ShieldCheck, ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import type { CryptoAsset } from "@/types/crypto";

type Recommendation = "Strong Buy" | "Hold" | "Avoid";

function getRecommendation(coin: CryptoAsset): { rec: Recommendation; reason: string } {
  if (coin.riskLevel === "Low" && coin.sentimentLabel === "Positive") {
    return { rec: "Strong Buy", reason: "Low risk combined with positive market sentiment indicates a favorable entry point." };
  }
  if (coin.riskLevel === "High" || (coin.riskLevel === "Moderate" && coin.sentimentLabel === "Negative")) {
    return { rec: "Avoid", reason: "Elevated risk levels and unfavorable sentiment suggest caution. Wait for stabilization." };
  }
  return { rec: "Hold", reason: "Moderate risk with mixed signals. Monitor for clearer directional indicators before acting." };
}

export default function Recommendations() {
  const { data: cryptos, isLoading } = useCryptoData(20);

  const grouped = useMemo(() => {
    if (!cryptos) return { buy: [], hold: [], avoid: [] };
    const buy: (CryptoAsset & { reason: string })[] = [];
    const hold: (CryptoAsset & { reason: string })[] = [];
    const avoid: (CryptoAsset & { reason: string })[] = [];
    cryptos.forEach((c) => {
      const { rec, reason } = getRecommendation(c);
      const item = { ...c, reason };
      if (rec === "Strong Buy") buy.push(item);
      else if (rec === "Hold") hold.push(item);
      else avoid.push(item);
    });
    return { buy, hold, avoid };
  }, [cryptos]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="opacity-0 animate-fade-up">
        <h1 className="text-xl font-bold">Recommendations</h1>
        <p className="text-xs text-muted-foreground">AI-powered investment signals based on risk and sentiment analysis</p>
      </div>

      <RecSection title="Strong Buy" icon={<ThumbsUp className="h-4 w-4 text-primary" />} items={grouped.buy} color="primary" delay="80ms" />
      <RecSection title="Hold" icon={<Pause className="h-4 w-4 text-risk-moderate" />} items={grouped.hold} color="moderate" delay="160ms" />
      <RecSection title="Avoid" icon={<AlertTriangle className="h-4 w-4 text-destructive" />} items={grouped.avoid} color="high" delay="240ms" />
    </div>
  );
}

function RecSection({ title, icon, items, color, delay }: {
  title: string;
  icon: React.ReactNode;
  items: (CryptoAsset & { reason: string })[];
  color: string;
  delay: string;
}) {
  const borderColor = color === "primary" ? "border-l-primary" : color === "moderate" ? "border-l-risk-moderate" : "border-l-destructive";

  return (
    <section className="opacity-0 animate-fade-up" style={{ animationDelay: delay }}>
      <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">{icon} {title} ({items.length})</h2>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground glass-card rounded-xl p-4">No assets in this category currently.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((coin) => (
            <div key={coin.id} className={`glass-card rounded-xl p-5 border-l-2 ${borderColor}`}>
              <div className="flex items-center gap-3 mb-3">
                <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div>
                  <p className="text-sm font-semibold">{coin.name}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(coin.currentPrice)}</p>
                </div>
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${coin.riskLevel === "Low" ? "text-risk-low bg-risk-low/10 border-risk-low/20" : coin.riskLevel === "Moderate" ? "text-risk-moderate bg-risk-moderate/10 border-risk-moderate/20" : "text-risk-high bg-risk-high/10 border-risk-high/20"}`}>
                  Risk {coin.riskScore}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{coin.reason}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
