import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCryptoData } from "@/hooks/useCryptoData";
import { formatPrice, formatPercent, formatCompact } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Shield, Activity, Zap, BarChart3 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { CryptoAsset } from "@/types/crypto";

export default function Dashboard() {
  const { data: cryptos, isLoading, dataUpdatedAt } = useCryptoData(20);
  const navigate = useNavigate();

  const stats = useMemo(() => {
    if (!cryptos) return null;
    const totalMcap = cryptos.reduce((s, c) => s + c.marketCap, 0);
    const avgRisk = Math.round(cryptos.reduce((s, c) => s + c.riskScore, 0) / cryptos.length);
    const highRisk = cryptos.filter((c) => c.riskLevel === "High").length;
    const positive = cryptos.filter((c) => c.sentimentLabel === "Positive").length;
    return { totalMcap, avgRisk, highRisk, positive };
  }, [cryptos]);

  const { gainers, losers } = useMemo(() => {
    if (!cryptos) return { gainers: [], losers: [] };
    const sorted = [...cryptos].sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h);
    return { gainers: sorted.slice(0, 5), losers: sorted.slice(-5).reverse() };
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

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl glass-card p-8 md:p-10 opacity-0 animate-fade-up">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-[120px]" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary">
              Real-time Analytics
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{ lineHeight: "1.15" }}>
            <span className="gradient-text">Cryptocurrency Intelligence</span>
            <br />
            <span className="text-foreground/80 text-xl md:text-2xl font-medium">Platform</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg">
            Analyze risk, sentiment, and market behavior across {cryptos?.length} assets with multi-factor scoring models.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "80ms" }}>
        {stats && [
          { label: "Market Cap", value: formatCompact(stats.totalMcap), icon: Activity, accent: "text-primary" },
          { label: "Avg Risk", value: `${stats.avgRisk}/100`, icon: Shield, accent: stats.avgRisk > 65 ? "text-risk-high" : stats.avgRisk > 35 ? "text-risk-moderate" : "text-risk-low" },
          { label: "High Risk", value: `${stats.highRisk}`, icon: Zap, accent: "text-risk-high" },
          { label: "Positive Sentiment", value: `${stats.positive}/${cryptos!.length}`, icon: TrendingUp, accent: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`h-4 w-4 ${s.accent}`} />
              <span className="text-[11px] font-medium text-muted-foreground">{s.label}</span>
            </div>
            <p className={`text-xl font-bold tabular-nums ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </section>

      {/* Crypto Cards */}
      <section className="opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Top Cryptocurrencies</h2>
          <button onClick={() => navigate("/markets")} className="text-xs text-primary hover:text-primary/80 transition-colors">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cryptos?.slice(0, 8).map((coin) => (
            <CryptoCard key={coin.id} coin={coin} onClick={() => navigate(`/coin/${coin.id}`)} />
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
              <div
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                className="flex items-center justify-between cursor-pointer hover:bg-secondary/30 rounded-lg p-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <img src={coin.image} alt="" className="h-6 w-6 rounded-full" loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="text-sm font-medium">{coin.symbol.toUpperCase()}</span>
                </div>
                <span className="text-sm font-mono tabular-nums text-sentiment-positive">
                  {formatPercent(coin.priceChangePercentage24h)}
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
              <div
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                className="flex items-center justify-between cursor-pointer hover:bg-secondary/30 rounded-lg p-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <img src={coin.image} alt="" className="h-6 w-6 rounded-full" loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="text-sm font-medium">{coin.symbol.toUpperCase()}</span>
                </div>
                <span className="text-sm font-mono tabular-nums text-sentiment-negative">
                  {formatPercent(coin.priceChangePercentage24h)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Heatmap */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-risk-moderate" /> Risk Heatmap
          </h3>
          <div className="grid grid-cols-4 gap-1.5">
            {cryptos?.map((coin) => {
              const bg = coin.riskLevel === "Low"
                ? "bg-risk-low/20 border-risk-low/30"
                : coin.riskLevel === "Moderate"
                  ? "bg-risk-moderate/20 border-risk-moderate/30"
                  : "bg-risk-high/20 border-risk-high/30";
              return (
                <div
                  key={coin.id}
                  onClick={() => navigate(`/coin/${coin.id}`)}
                  className={`aspect-square rounded-md border flex items-center justify-center cursor-pointer hover:scale-105 transition-transform ${bg}`}
                  title={`${coin.name}: Risk ${coin.riskScore}`}
                >
                  <span className="text-[9px] font-bold">{coin.symbol.toUpperCase()}</span>
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

      {/* Sentiment Overview */}
      <section className="glass-card rounded-xl p-5 opacity-0 animate-fade-up" style={{ animationDelay: "320ms" }}>
        <h3 className="text-sm font-semibold mb-4">Market Sentiment Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          {["Positive", "Neutral", "Negative"].map((label) => {
            const count = cryptos?.filter((c) => c.sentimentLabel === label).length ?? 0;
            const total = cryptos?.length ?? 1;
            const pct = Math.round((count / total) * 100);
            const color = label === "Positive" ? "bg-primary" : label === "Negative" ? "bg-destructive" : "bg-muted-foreground";
            return (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold tabular-nums">{pct}%</p>
                <p className="text-xs text-muted-foreground mb-2">{label}</p>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CryptoCard({ coin, onClick }: { coin: CryptoAsset; onClick: () => void }) {
  const isUp = coin.priceChangePercentage24h >= 0;
  const sparkData = coin.sparklineIn7d.filter((_, i) => i % 6 === 0).map((price, i) => ({ i, price }));

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 hover:translate-y-[-2px] active:scale-[0.98] group"
    >
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
          <p className="text-lg font-bold font-mono tabular-nums">{formatPrice(coin.currentPrice)}</p>
          <p className={`text-xs font-mono tabular-nums ${isUp ? "text-sentiment-positive" : "text-sentiment-negative"}`}>
            {formatPercent(coin.priceChangePercentage24h)}
          </p>
        </div>
        <div className="w-20 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={isUp ? "hsl(162, 78%, 46%)" : "hsl(0, 72%, 51%)"}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
