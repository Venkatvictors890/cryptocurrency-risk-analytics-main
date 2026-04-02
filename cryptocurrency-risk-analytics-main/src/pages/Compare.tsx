import { useState, useMemo } from "react";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useCurrency } from "@/hooks/useCurrencyStore";
import { useCoinChart } from "@/hooks/useCoinDetail";
import { formatPrice, formatPercent, formatCompact } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { GitCompare, Info, Hash } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  AreaChart, Area,
} from "recharts";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** Theme-adaptive custom tooltip for charts */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const explanation = COMPARE_EXPLANATIONS[label];
  
  return (
    <div
      className="rounded-xl px-3 py-2.5 text-xs border backdrop-blur-xl min-w-[180px]"
      style={{
        background: "hsl(var(--tooltip-bg) / 0.97)",
        borderColor: "hsl(var(--tooltip-border))",
        color: "hsl(var(--tooltip-text))",
        boxShadow: "0 8px 32px -8px hsl(var(--foreground) / 0.15)",
        animation: "fade-in 0.15s ease-out",
      }}
    >
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/40">
        <p className="font-bold" style={{ color: "hsl(var(--tooltip-text))" }}>{label}</p>
        <Hash className="h-3 w-3 text-muted-foreground/40" />
      </div>
      
      <div className="space-y-1.5 mb-3">
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-muted-foreground">{p.name}:</span>
            </div>
            <span className="font-mono font-bold">{typeof p.value === "number" ? p.value.toFixed(1) : p.value}</span>
          </div>
        ))}
      </div>

      {explanation && (
        <div className="pt-2 border-t border-border/40">
          <p className="text-[10px] leading-relaxed text-muted-foreground italic">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}

const COMPARE_EXPLANATIONS: Record<string, string> = {
  Volatility: "How much the price fluctuates. Higher = more risk.",
  Liquidity: "How easily it can be traded. Higher score = harder to trade (more risk).",
  Social: "Public mood from social media. Higher = more negative sentiment risk.",
  News: "Recent news impact. Higher = more negative news impact.",
  Transaction: "On-chain activity patterns. Higher = unusual activity detected.",
};

export default function Compare() {
  const { currency } = useCurrency();
  const { data: cryptos, isLoading } = useCryptoData(50, currency.code);
  const [coinA, setCoinA] = useState("bitcoin");
  const [coinB, setCoinB] = useState("ethereum");

  const a = cryptos?.find((c) => c.id === coinA);
  const b = cryptos?.find((c) => c.id === coinB);

  // Fetch real chart data for both coins
  const { data: chartA } = useCoinChart(coinA, currency.code, 7);
  const { data: chartB } = useCoinChart(coinB, currency.code, 7);

  // Build combined price comparison data
  const priceCompareData = useMemo(() => {
    if (!chartA?.prices?.length || !chartB?.prices?.length) return [];
    const maxLen = Math.min(chartA.prices.length, chartB.prices.length, 50);
    const stepA = Math.max(1, Math.floor(chartA.prices.length / maxLen));
    const stepB = Math.max(1, Math.floor(chartB.prices.length / maxLen));
    const data: any[] = [];
    for (let i = 0; i < maxLen; i++) {
      const idxA = Math.min(i * stepA, chartA.prices.length - 1);
      const idxB = Math.min(i * stepB, chartB.prices.length - 1);
      const d = new Date(chartA.prices[idxA][0]);
      data.push({
        time: d.toLocaleDateString([], { month: "short", day: "numeric" }),
        [a?.symbol.toUpperCase() ?? "A"]: +(chartA.prices[idxA][1]).toFixed(2),
        [b?.symbol.toUpperCase() ?? "B"]: +(chartB.prices[idxB][1]).toFixed(2),
      });
    }
    return data;
  }, [chartA, chartB, a, b]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const riskData = a && b ? [
    { factor: "Volatility", A: a.volatilityScore, B: b.volatilityScore },
    { factor: "Liquidity", A: a.liquidityScore, B: b.liquidityScore },
    { factor: "Social", A: a.socialSentimentScore, B: b.socialSentimentScore },
    { factor: "News", A: a.newsImpactScore, B: b.newsImpactScore },
    { factor: "Transaction", A: a.transactionBehaviorScore, B: b.transactionBehaviorScore },
  ] : [];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="opacity-0 animate-fade-up">
        <h1 className="text-xl font-bold">Compare</h1>
        <p className="text-xs text-muted-foreground">Side-by-side cryptocurrency analysis</p>
      </div>

      {/* Selectors */}
      <div className="flex items-center gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <select value={coinA} onChange={(e) => setCoinA(e.target.value)}
          className="flex-1 h-10 rounded-lg bg-secondary/50 border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          {cryptos?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <GitCompare className="h-5 w-5 text-primary shrink-0" />
        <select value={coinB} onChange={(e) => setCoinB(e.target.value)}
          className="flex-1 h-10 rounded-lg bg-secondary/50 border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          {cryptos?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {a && b && (
        <>
          {/* Comparison cards */}
          <div className="grid grid-cols-2 gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "120ms" }}>
            {[a, b].map((coin) => (
              <div key={coin.id} className="glass-card rounded-xl p-5 interactive-card">
                <div className="flex items-center gap-3 mb-4">
                  <img src={coin.image} alt={coin.name} className="h-10 w-10 rounded-full" loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div>
                    <p className="text-sm font-semibold">{coin.name}</p>
                    <p className="text-[11px] text-muted-foreground uppercase">{coin.symbol}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Row label="Price" value={`${currency.symbol}${coin.currentPrice.toLocaleString()}`} />
                  <Row label="24h Change" value={formatPercent(coin.priceChangePercentage24h)}
                    color={coin.priceChangePercentage24h >= 0 ? "text-sentiment-positive" : "text-sentiment-negative"} />
                  <Row label="Market Cap" value={formatCompact(coin.marketCap)} />
                  <Row label="Volume" value={formatCompact(coin.totalVolume)} />
                  <Row label="Risk Score" value={`${coin.riskScore}/100`}
                    color={coin.riskLevel === "Low" ? "text-risk-low" : coin.riskLevel === "Moderate" ? "text-risk-moderate" : "text-risk-high"} />
                  <Row label="Risk Level" value={coin.riskLevel} />
                  <Row label="Sentiment" value={coin.sentimentLabel}
                    color={coin.sentimentLabel === "Positive" ? "text-sentiment-positive" : coin.sentimentLabel === "Negative" ? "text-sentiment-negative" : "text-sentiment-neutral"} />
                </div>
              </div>
            ))}
          </div>

          {/* Price comparison chart with real data */}
          {priceCompareData.length > 0 && (
            <div className="glass-card rounded-xl p-5 opacity-0 animate-fade-up" style={{ animationDelay: "150ms" }}>
              <h3 className="text-sm font-semibold mb-4">7-Day Price Comparison</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={priceCompareData}>
                  <defs>
                    <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(162, 78%, 46%)" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="hsl(162, 78%, 46%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--chart-grid-bold))" strokeWidth={0.8} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--chart-tick))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--chart-tick))" }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip content={<ChartTooltip />} cursor={false} />
                  <Area type="monotone" dataKey={a.symbol.toUpperCase()} name={a.symbol.toUpperCase()} stroke="hsl(162, 78%, 46%)" strokeWidth={2} fill="url(#gradA)" dot={false} />
                  <Area type="monotone" dataKey={b.symbol.toUpperCase()} name={b.symbol.toUpperCase()} stroke="hsl(199, 89%, 48%)" strokeWidth={2} fill="url(#gradB)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Risk factors comparison */}
          <TooltipProvider delayDuration={200}>
            <div className="glass-card rounded-xl p-5 opacity-0 animate-fade-up" style={{ animationDelay: "180ms" }}>
              <h3 className="text-sm font-semibold mb-4">Risk Factor Comparison</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskData} barGap={4}>
                  <CartesianGrid stroke="hsl(var(--chart-grid-bold))" strokeWidth={0.8} strokeDasharray="3 3" />
                  <XAxis dataKey="factor" tick={{ fontSize: 10, fill: "hsl(var(--chart-tick))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--chart-tick))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={false} />
                  <Bar dataKey="A" name={a.symbol.toUpperCase()} fill="hsl(162, 78%, 46%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="B" name={b.symbol.toUpperCase()} fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              {/* Factor explanations */}
              <div className="flex flex-wrap gap-3 mt-4">
                {riskData.map((d) => (
                  <UITooltip key={d.factor}>
                    <TooltipTrigger asChild>
                      <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1 cursor-help hover:text-foreground transition-colors">
                        <Info className="h-2.5 w-2.5" /> {d.factor}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-xs">
                      {COMPARE_EXPLANATIONS[d.factor]}
                    </TooltipContent>
                  </UITooltip>
                ))}
              </div>
            </div>
          </TooltipProvider>
        </>
      )}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border/20 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium font-mono tabular-nums ${color ?? ""}`}>{value}</span>
    </div>
  );
}
