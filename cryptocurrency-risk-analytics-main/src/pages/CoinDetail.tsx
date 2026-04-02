import { useParams, useNavigate } from "react-router-dom";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useCoinChart } from "@/hooks/useCoinDetail";
import { useCurrency } from "@/hooks/useCurrencyStore";
import { SUPPORTED_CURRENCIES } from "@/services/coingecko";
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Globe, Info, RefreshCw } from "lucide-react";
import { formatPrice, formatPercent, formatCompact } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { PriceChart } from "@/components/coin/PriceChart";
import { VolumeChart } from "@/components/coin/VolumeChart";
import { SentimentTrendChart } from "@/components/coin/SentimentTrendChart";
import { RiskBreakdownPanel } from "@/components/coin/RiskBreakdownPanel";
import { InsightsPanel } from "@/components/coin/InsightsPanel";
import { SentimentFeed } from "@/components/coin/SentimentFeed";
import { useState, useEffect, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Interval = "1m" | "5m" | "1H" | "1D" | "1W" | "1M";

const INTERVAL_TO_DAYS: Record<Interval, number | string> = {
  "1m": 1,
  "5m": 1,
  "1H": 1,
  "1D": 7,
  "1W": 30,
  "1M": 90,
};

const STAT_EXPLANATIONS: Record<string, string> = {
  "Market Cap": "Total value of all coins in circulation (price × supply). Larger market cap = more established.",
  "24h Volume": "Total trading volume in the last 24 hours across all exchanges. High volume = active market.",
  "24h High": "Highest price reached in the last 24 hours.",
  "24h Low": "Lowest price reached in the last 24 hours.",
};

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currency: globalCurrency, setCurrencyByCode } = useCurrency();
  const { data: cryptos, isLoading, dataUpdatedAt } = useCryptoData(50, globalCurrency.code);
  const [interval, setInterval] = useState<Interval>("1D");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Fetch real chart data
  const days = INTERVAL_TO_DAYS[interval];
  const { data: chartData } = useCoinChart(id, globalCurrency.code, days);

  const coin = cryptos?.find((c) => c.id === id);

  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdated(new Date(dataUpdatedAt).toLocaleTimeString());
      setSecondsAgo(0);
    }
  }, [dataUpdatedAt]);

  // Countdown timer
  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-muted-foreground">Cryptocurrency not found.</p>
        </div>
      </div>
    );
  }

  const isUp = coin.priceChangePercentage24h >= 0;
  const intervals: Interval[] = ["1m", "5m", "1H", "1D", "1W", "1M"];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="opacity-0 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors active:scale-95">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10">
              <RefreshCw className="h-3 w-3 text-primary animate-spin" style={{ animationDuration: "3s" }} />
              <span className="text-[10px] text-primary font-medium">
                {secondsAgo < 5 ? "Just updated" : `${secondsAgo}s ago`}
              </span>
            </div>
            {/* Currency selector - 20 currencies */}
            <select
              value={globalCurrency.code}
              onChange={(e) => setCurrencyByCode(e.target.value)}
              className="h-8 rounded-lg bg-secondary/50 border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {SUPPORTED_CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <img src={coin.image} alt={coin.name} className="h-12 w-12 rounded-full ring-2 ring-border"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <h1 className="text-2xl font-bold" style={{ lineHeight: "1.15" }}>
                {coin.name}
                <span className="ml-2 text-sm text-muted-foreground uppercase font-normal">{coin.symbol}</span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-bold font-mono tabular-nums">
                  {globalCurrency.symbol}{coin.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: coin.currentPrice > 1 ? 2 : 6 })}
                </span>
                <span className={`flex items-center gap-1 text-sm font-mono ${isUp ? "text-sentiment-positive" : "text-sentiment-negative"}`}>
                  {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {formatPercent(coin.priceChangePercentage24h)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats with tooltips */}
      <TooltipProvider delayDuration={200}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
          {[
            { label: "Market Cap", value: formatCompact(coin.marketCap), icon: Globe },
            { label: "24h Volume", value: formatCompact(coin.totalVolume), icon: Activity },
            { label: "24h High", value: `${globalCurrency.symbol}${coin.high24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: TrendingUp },
            { label: "24h Low", value: `${globalCurrency.symbol}${coin.low24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: TrendingDown },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-4 interactive-card">
              <div className="flex items-center gap-1.5 mb-1">
                <s.icon className="h-3 w-3 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-2.5 w-2.5 text-muted-foreground/50 cursor-help hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px] text-xs">
                    {STAT_EXPLANATIONS[s.label]}
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm font-bold font-mono tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      </TooltipProvider>

      {/* Interval controls */}
      <div className="flex items-center gap-1.5 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
        {intervals.map((iv) => (
          <button key={iv} onClick={() => setInterval(iv)}
            className={`px-3 py-1.5 text-xs rounded-lg font-mono font-medium transition-all duration-200 active:scale-95 ${interval === iv
              ? "bg-primary text-primary-foreground glow-sm"
              : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"}`}>
            {iv}
          </button>
        ))}
      </div>

      {/* Main chart - with real data */}
      <div className="opacity-0 animate-fade-up" style={{ animationDelay: "140ms" }}>
        <PriceChart
          coin={coin}
          interval={interval}
          currency={globalCurrency.code.toUpperCase()}
          exchangeRate={1}
          chartData={chartData?.prices}
        />
      </div>

      {/* Volume + Sentiment charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
        <VolumeChart coin={coin} interval={interval} />
        <SentimentTrendChart coin={coin} interval={interval} />
      </div>

      {/* Risk + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-0 animate-fade-up" style={{ animationDelay: "260ms" }}>
        <RiskBreakdownPanel coin={coin} />
        <InsightsPanel coin={coin} />
      </div>

      {/* Sentiment Feed */}
      <div className="opacity-0 animate-fade-up" style={{ animationDelay: "320ms" }}>
        <SentimentFeed coin={coin} />
      </div>
    </div>
  );
}
