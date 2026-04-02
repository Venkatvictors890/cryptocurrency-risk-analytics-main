import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCryptoData } from "@/hooks/useCryptoData";
import { formatPrice, formatPercent, formatCompact } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { CryptoAsset, RiskLevel } from "@/types/crypto";

export default function Markets() {
  const { data: cryptos, isLoading } = useCryptoData(20);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "All">("All");
  const [sortKey, setSortKey] = useState<"price" | "volume" | "risk" | "name">("price");

  const filtered = useMemo(() => {
    if (!cryptos) return [];
    let list = [...cryptos];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
    }
    if (riskFilter !== "All") list = list.filter((c) => c.riskLevel === riskFilter);
    list.sort((a, b) => {
      switch (sortKey) {
        case "name": return a.name.localeCompare(b.name);
        case "price": return b.currentPrice - a.currentPrice;
        case "volume": return b.totalVolume - a.totalVolume;
        case "risk": return b.riskScore - a.riskScore;
      }
    });
    return list;
  }, [cryptos, search, riskFilter, sortKey]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between opacity-0 animate-fade-up">
        <div>
          <h1 className="text-xl font-bold">Markets</h1>
          <p className="text-xs text-muted-foreground">{filtered.length} assets</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 w-48 bg-secondary/50 border-border/50" />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {(["All", "Low", "Moderate", "High"] as const).map((l) => (
              <button key={l} onClick={() => setRiskFilter(l)}
                className={`px-2.5 py-1.5 text-[11px] rounded-md font-medium transition-colors ${riskFilter === l ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {(["price", "volume", "risk", "name"] as const).map((k) => (
              <button key={k} onClick={() => setSortKey(k)}
                className={`px-2.5 py-1.5 text-[11px] rounded-md font-medium transition-colors ${sortKey === k ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"}`}>
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
        {filtered.map((coin) => (
          <MarketCard key={coin.id} coin={coin} onClick={() => navigate(`/coin/${coin.id}`)} />
        ))}
      </div>
    </div>
  );
}

function MarketCard({ coin, onClick }: { coin: CryptoAsset; onClick: () => void }) {
  const isUp = coin.priceChangePercentage24h >= 0;
  const sparkData = coin.sparklineIn7d.filter((_, i) => i % 6 === 0).map((price, i) => ({ i, price }));
  const riskColor = coin.riskLevel === "Low" ? "text-risk-low" : coin.riskLevel === "Moderate" ? "text-risk-moderate" : "text-risk-high";
  const sentColor = coin.sentimentLabel === "Positive" ? "text-sentiment-positive" : coin.sentimentLabel === "Negative" ? "text-sentiment-negative" : "text-sentiment-neutral";

  return (
    <div onClick={onClick}
      className="glass-card rounded-xl p-5 cursor-pointer transition-all duration-300 hover:translate-y-[-2px] active:scale-[0.98]">
      <div className="flex items-center gap-3 mb-4">
        <img src={coin.image} alt={coin.name} className="h-10 w-10 rounded-full" loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{coin.name}</p>
          <p className="text-[11px] text-muted-foreground uppercase">{coin.symbol}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${coin.riskLevel === "Low" ? "border-risk-low/20 bg-risk-low/10 text-risk-low" : coin.riskLevel === "Moderate" ? "border-risk-moderate/20 bg-risk-moderate/10 text-risk-moderate" : "border-risk-high/20 bg-risk-high/10 text-risk-high"}`}>
          Risk {coin.riskScore}
        </span>
      </div>

      <div className="h-16 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="price" stroke={isUp ? "hsl(162, 78%, 46%)" : "hsl(0, 72%, 51%)"} strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-bold font-mono tabular-nums">{formatPrice(coin.currentPrice)}</p>
          <p className={`text-xs font-mono tabular-nums ${isUp ? "text-sentiment-positive" : "text-sentiment-negative"}`}>
            {formatPercent(coin.priceChangePercentage24h)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">Sentiment</p>
          <p className={`text-xs font-medium ${sentColor}`}>{coin.sentimentLabel}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border/30 flex justify-between text-[10px] text-muted-foreground">
        <span>MCap {formatCompact(coin.marketCap)}</span>
        <span>Vol {formatCompact(coin.totalVolume)}</span>
      </div>
    </div>
  );
}
