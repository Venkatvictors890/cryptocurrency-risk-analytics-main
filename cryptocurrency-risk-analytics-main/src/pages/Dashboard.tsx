import { useMemo } from "react";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useCurrency } from "@/hooks/useCurrencyStore";
import { SUPPORTED_CURRENCIES } from "@/services/coingecko";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, BarChart, Bar, Cell } from "recharts";
import { formatCompact } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Activity, Globe, MessageSquare, Twitter, Newspaper, Info, Users } from "lucide-react";
import type { CryptoAsset, SentimentLabel } from "@/types/crypto";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SentimentOverview } from "@/components/dashboard/SentimentOverview";
import { cn } from "@/lib/utils";

interface SentimentPost {
  source: string;
  icon: typeof Twitter;
  text: string;
  sentiment: SentimentLabel;
  time: string;
}

const SENTIMENT_POSTS: SentimentPost[] = [
  { source: "Twitter/X", icon: Twitter, text: "Bitcoin ETF inflows hit record $1.2B this week! Institutional adoption is real 🚀", sentiment: "Positive", time: "2h ago" },
  { source: "Reddit", icon: MessageSquare, text: "ETH staking yields incredibly competitive vs. traditional finance right now", sentiment: "Positive", time: "3h ago" },
  { source: "News", icon: Newspaper, text: "SEC delays decision on multiple altcoin ETF applications", sentiment: "Neutral", time: "4h ago" },
  { source: "Twitter/X", icon: Twitter, text: "Major exchange reports suspicious outflow patterns - monitoring closely ⚠️", sentiment: "Negative", time: "5h ago" },
  { source: "Reddit", icon: MessageSquare, text: "Solana DeFi TVL surges 40% in 30 days - ecosystem growing fast", sentiment: "Positive", time: "6h ago" },
  { source: "News", icon: Newspaper, text: "Central banks worldwide exploring CBDC interoperability standards", sentiment: "Neutral", time: "7h ago" },
  { source: "Twitter/X", icon: Twitter, text: "On-chain data shows whale accumulation phase for BTC and ETH 🐋", sentiment: "Positive", time: "8h ago" },
  { source: "Reddit", icon: MessageSquare, text: "DeFi exploit drains $8M from yield farming protocol - users concerned", sentiment: "Negative", time: "9h ago" },
];

export default function Dashboard() {
  const { currency, setCurrencyByCode } = useCurrency();
  const { data: cryptos, isLoading, dataUpdatedAt } = useCryptoData(50, currency.code);

  const stats = useMemo(() => {
    if (!cryptos) return null;
    const totalMcap = cryptos.reduce((s, c) => s + c.marketCap, 0);
    const avgRisk = Math.round(cryptos.reduce((s, c) => s + c.riskScore, 0) / cryptos.length);
    const highRisk = cryptos.filter((c) => c.riskLevel === "High").length;
    const positive = cryptos.filter((c) => c.sentimentLabel === "Positive").length;
    const totalVol = cryptos.reduce((s, c) => s + c.totalVolume, 0);
    return { totalMcap, avgRisk, highRisk, positive, totalVol };
  }, [cryptos]);

  const topCoins = useMemo(() => cryptos?.slice(0, 16) ?? [], [cryptos]);

  const { gainers, losers } = useMemo(() => {
    if (!cryptos) return { gainers: [], losers: [] };
    const sorted = [...cryptos].sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h);
    return { gainers: sorted.slice(0, 5), losers: sorted.slice(-5).reverse() };
  }, [cryptos]);

  // Total market chart data (aggregate sparklines)
  const totalMarketData = useMemo(() => {
    if (!cryptos?.length) return [];
    const maxLen = Math.max(...cryptos.slice(0, 10).map((c) => c.sparklineIn7d.length));
    const points: { time: string; value: number }[] = [];
    for (let i = 0; i < Math.min(maxLen, 48); i++) {
      const idx = Math.floor((i / 48) * maxLen);
      let total = 0;
      for (const c of cryptos.slice(0, 10)) {
        total += c.sparklineIn7d[idx] ?? c.currentPrice;
      }
      points.push({ time: `${48 - i}h`, value: Math.round(total) });
    }
    return points;
  }, [cryptos]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-40 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const navigate = (path: string) => window.location.href = path;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero & Real-time Tracking */}
      <DashboardHeader lastUpdated={dataUpdatedAt ? new Date(dataUpdatedAt) : null} />

      {/* Stats with tooltips */}
      <TooltipProvider delayDuration={200}>
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "80ms" }}>
          {stats && [
            { label: "Total Market Cap", value: formatCompact(stats.totalMcap), icon: Activity, accent: "text-emerald-500", tip: "Combined market capitalization of all tracked cryptocurrencies." },
            { label: "24h Volume", value: formatCompact(stats.totalVol), icon: Globe, accent: "text-sky-500", tip: "Total trading volume across all tracked assets in the last 24 hours." },
            { label: "Avg Risk Score", value: `${stats.avgRisk}/100`, icon: Activity, accent: stats.avgRisk > 65 ? "text-risk-high" : stats.avgRisk > 35 ? "text-risk-moderate" : "text-risk-low", tip: "Average risk score across all tracked assets. Lower = safer market." },
            { label: "High Risk Assets", value: `${stats.highRisk}`, icon: TrendingDown, accent: "text-risk-high", tip: "Number of assets with risk score above 65 (High risk level)." },
            { label: "Progressive Trends", value: `${stats.positive}/${cryptos!.length}`, icon: TrendingUp, accent: "text-rose-500", tip: "Assets with overall positive public sentiment from social media and news." },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-5 interactive-card flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`h-4 w-4 ${s.accent}`} />
                  <span className="text-[11px] font-medium text-muted-foreground">{s.label}</span>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-2.5 w-2.5 text-muted-foreground/50 cursor-help hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-xs">
                      {s.tip}
                    </TooltipContent>
                  </UITooltip>
                </div>
                <p className={`text-xl font-bold tabular-nums ${s.accent}`}>{s.value}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-border/10 flex gap-1.5 flex-wrap">
                 <button className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded bg-secondary/50 hover:bg-secondary transition-colors", s.accent)}>
                   DETAILS
                 </button>
              </div>
            </div>
          ))}
        </section>
      </TooltipProvider>

      {/* Total Market Chart */}
      {totalMarketData.length > 0 && (
        <section className="glass-card rounded-xl p-5 opacity-0 animate-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold mb-1">Total Market Overview</h3>
              <p className="text-[11px] text-muted-foreground">Aggregated top 10 assets price movement</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate("/markets")}
                className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 border border-sky-500/20 transition-all flex items-center gap-1.5"
              >
                <TrendingUp className="h-3 w-3" /> Progressive Trends
              </button>
              <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground transition-all">
                🔭 Full View
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={totalMarketData}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(162, 78%, 46%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(162, 78%, 46%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--chart-grid-bold))" strokeWidth={0.8} />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(var(--chart-tick))" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--chart-tick))" }} axisLine={false} tickLine={false} width={60} />
              <Area type="monotone" dataKey="value" stroke="hsl(162, 78%, 46%)" strokeWidth={2} fill="url(#totalGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* Crypto Cards — expanded grid */}
      <section className="opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Top Cryptocurrencies</h2>
          <div className="flex gap-2">
            <button className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all">
              💎 GEMS
            </button>
            <button className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all">
              🚀 GAINERS
            </button>
            <button onClick={() => navigate("/markets")} className="text-xs text-primary hover:text-primary/80 transition-colors ml-2 font-medium">
              View All →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCoins.map((coin) => (
            <CryptoCard key={coin.id} coin={coin} symbol={currency.symbol} onClick={() => navigate(`/coin/${coin.id}`)} />
          ))}
        </div>
      </section>

      {/* Gainers / Losers + Heatmap */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-0 animate-fade-up" style={{ animationDelay: "240ms" }}>
        {/* Top Gainers */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Top Gainers
          </h3>
          <div className="space-y-3">
            {gainers.map((coin) => (
              <div key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)}
                className="flex items-center justify-between cursor-pointer hover:bg-secondary/30 rounded-lg p-2 -mx-2 transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-center gap-2.5">
                  <img src={coin.image} alt="" className="h-6 w-6 rounded-full" loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="text-sm font-medium">{coin.symbol.toUpperCase()}</span>
                </div>
                <span className="text-sm font-mono tabular-nums text-sentiment-positive">
                  +{coin.priceChangePercentage24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" /> Top Losers
          </h3>
          <div className="space-y-3">
            {losers.map((coin) => (
              <div key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)}
                className="flex items-center justify-between cursor-pointer hover:bg-secondary/30 rounded-lg p-2 -mx-2 transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-center gap-2.5">
                  <img src={coin.image} alt="" className="h-6 w-6 rounded-full" loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="text-sm font-medium">{coin.symbol.toUpperCase()}</span>
                </div>
                <span className="text-sm font-mono tabular-nums text-sentiment-negative">
                  {coin.priceChangePercentage24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Heatmap */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-risk-moderate" /> Risk Heatmap
          </h3>
          <div className="grid grid-cols-5 gap-1.5">
            {cryptos?.slice(0, 25).map((coin) => {
              const bg = coin.riskLevel === "Low"
                ? "bg-risk-low/20 border-risk-low/30"
                : coin.riskLevel === "Moderate"
                  ? "bg-risk-moderate/20 border-risk-moderate/30"
                  : "bg-risk-high/20 border-risk-high/30";
              return (
                <div key={coin.id} onClick={() => navigate(`/coin/${coin.id}`)}
                  className={`aspect-square rounded-md border flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${bg}`}
                  title={`${coin.name}: Risk ${coin.riskScore}`}>
                  <span className="text-[8px] font-bold">{coin.symbol.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-sm bg-risk-low/30" /> Low</div>
            <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-sm bg-risk-moderate/30" /> Moderate</div>
            <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-sm bg-risk-high/30" /> High</div>
          </div>
        </div>
      </section>

      {/* Public Sentiment Hub & Expanded Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
         <div className="flex items-center gap-2 mb-1 absolute top-5 right-10 z-10 hidden md:flex">
            <button 
              onClick={() => navigate("/social-sentiment")}
              className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5"
            >
              <Users className="h-3 w-3" /> Progressive Trends Hub
            </button>
            <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground transition-all">
              📊 VADER PRO
            </button>
          </div>
        {cryptos && <SentimentOverview cryptos={cryptos} isLoading={isLoading} />}
      </div>
    </div>
  );
}

/* ═══════════ CRYPTO CARD ═══════════ */
import { LineChart, Line } from "recharts";
import { formatPrice, formatPercent } from "@/lib/format";
import { useNavigate } from "react-router-dom";

function CryptoCard({ coin, symbol, onClick }: { coin: CryptoAsset; symbol: string; onClick: () => void }) {
  const isUp = coin.priceChangePercentage24h >= 0;
  const sparkData = coin.sparklineIn7d.filter((_, i) => i % 6 === 0).map((price, i) => ({ i, price }));

  return (
    <div onClick={onClick}
      className="glass-card rounded-xl p-4 cursor-pointer interactive-card group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div>
            <p className="text-sm font-semibold">{coin.name}</p>
            <p className="text-[11px] text-muted-foreground uppercase">{coin.symbol}</p>
          </div>
        </div>
        <RiskPill score={coin.riskScore} level={coin.riskLevel} />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-bold font-mono tabular-nums">{symbol}{coin.currentPrice.toLocaleString(undefined, { minimumFractionDigits: coin.currentPrice > 1 ? 2 : 4, maximumFractionDigits: coin.currentPrice > 1 ? 2 : 6 })}</p>
          <p className={`text-xs font-mono tabular-nums ${isUp ? "text-sentiment-positive" : "text-sentiment-negative"}`}>
            {formatPercent(coin.priceChangePercentage24h)}
          </p>
        </div>
        <div className="w-20 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line type="monotone" dataKey="price"
                stroke={isUp ? "hsl(162, 78%, 46%)" : "hsl(0, 72%, 51%)"} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Extra info row */}
      <div className="mt-3 pt-2 border-t border-border/20 flex justify-between text-[10px] text-muted-foreground">
        <span>MCap {formatCompact(coin.marketCap)}</span>
        <span>Vol {formatCompact(coin.totalVolume)}</span>
        <span className={`font-medium ${coin.sentimentLabel === "Positive" ? "text-sentiment-positive" : coin.sentimentLabel === "Negative" ? "text-sentiment-negative" : "text-sentiment-neutral"}`}>
          {coin.sentimentLabel}
        </span>
      </div>
    </div>
  );
}

function RiskPill({ score, level }: { score: number; level: string }) {
  const color = level === "Low" ? "text-risk-low bg-risk-low/10 border-risk-low/20"
    : level === "Moderate" ? "text-risk-moderate bg-risk-moderate/10 border-risk-moderate/20"
      : "text-risk-high bg-risk-high/10 border-risk-high/20";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${color}`}>
      {score}
    </span>
  );
}
