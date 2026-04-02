import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import type { CryptoAsset } from "@/types/crypto";
import { generateHistoricalData } from "@/lib/historicalData";
import { formatPrice } from "@/lib/format";

interface Props {
  coin: CryptoAsset;
  interval: string;
  currency?: string;
  exchangeRate?: number;
  chartData?: [number, number][]; // Real CoinGecko chart data [timestamp, price]
}

/** Custom tooltip showing previous value, current value, and % change */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const current = payload[0]?.value as number;
  const dataIndex = payload[0]?.payload?._index as number;
  const allData = payload[0]?.payload?._allData as any[];
  const previous = dataIndex > 0 ? allData[dataIndex - 1].price : current;
  const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
  const isUp = change >= 0;

  return (
    <div
      className="rounded-xl px-4 py-3 text-xs shadow-xl border backdrop-blur-xl"
      style={{
        background: "hsl(var(--tooltip-bg) / 0.97)",
        borderColor: isUp ? "hsl(var(--risk-low) / 0.4)" : "hsl(var(--risk-high) / 0.4)",
        color: "hsl(var(--tooltip-text))",
        boxShadow: `0 8px 32px -8px ${isUp ? "hsl(var(--risk-low) / 0.15)" : "hsl(var(--risk-high) / 0.15)"}`,
        animation: "fade-in 0.15s ease-out",
      }}
    >
      <p className="text-[10px] mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
        {label}
      </p>
      <div className="space-y-1.5">
        <div className="flex justify-between gap-6">
          <span style={{ color: "hsl(var(--muted-foreground))" }}>Previous</span>
          <span className="font-mono font-semibold">{formatPrice(previous)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span style={{ color: "hsl(var(--muted-foreground))" }}>Current</span>
          <span className="font-mono font-semibold">{formatPrice(current)}</span>
        </div>
        <div
          className="pt-1.5 border-t flex justify-between gap-6 font-semibold"
          style={{
            borderColor: "hsl(var(--border) / 0.5)",
            color: isUp ? "hsl(var(--risk-low))" : "hsl(var(--risk-high))",
          }}
        >
          <span>{isUp ? "↑ Increase" : "↓ Decrease"}</span>
          <span className="font-mono">
            {isUp ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

/** Circular marker dot rendered at intervals */
function IntervalDot(props: any) {
  const { cx, cy, index, payload } = props;
  if (!payload || index % Math.max(1, Math.floor(props.totalPoints / 10)) !== 0) return null;
  const isUp = payload._trend >= 0;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={isUp ? "hsl(162, 78%, 46%)" : "hsl(0, 72%, 51%)"}
      stroke="hsl(var(--background))"
      strokeWidth={2.5}
      style={{ filter: `drop-shadow(0 0 3px ${isUp ? "hsl(162, 78%, 46%, 0.4)" : "hsl(0, 72%, 51%, 0.4)"})` }}
    />
  );
}

export function PriceChart({ coin, interval, currency = "USD", exchangeRate = 1, chartData }: Props) {
  const data = useMemo(() => {
    // Use real CoinGecko data if available
    if (chartData && chartData.length > 1) {
      // Downsample if too many points
      const maxPoints = 100;
      const step = Math.max(1, Math.floor(chartData.length / maxPoints));
      const sampled = chartData.filter((_, i) => i % step === 0);
      const result = sampled.map(([ts, price], i) => {
        const d = new Date(ts);
        const timeStr =
          interval === "1m" || interval === "5m"
            ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : interval === "1H"
              ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : d.toLocaleDateString([], { month: "short", day: "numeric" });
        return {
          time: timeStr,
          price: +(price * exchangeRate).toFixed(price * exchangeRate > 1 ? 2 : 6),
          _index: i,
          _allData: [] as any[],
          _trend: i > 0 ? price - sampled[i - 1][1] : 0,
        };
      });
      // Set _allData reference
      result.forEach((d) => { d._allData = result; });
      return result;
    }

    // Fallback: simulated data
    const rawData = generateHistoricalData(coin.id, coin.currentPrice * exchangeRate, coin.totalVolume, interval as any);
    const result = rawData.map((d, i) => ({
      ...d,
      _index: i,
      _allData: rawData,
      _trend: i > 0 ? d.price - rawData[i - 1].price : 0,
    }));
    return result;
  }, [coin.id, coin.currentPrice, coin.totalVolume, interval, exchangeRate, chartData]);

  // Build a gradient that switches between green and red based on direction
  const gradientStops = useMemo(() => {
    if (data.length < 2) return [];
    const stops: { offset: string; color: string }[] = [];
    for (let i = 0; i < data.length; i++) {
      const pct = (i / (data.length - 1)) * 100;
      const isUp = data[i]._trend >= 0;
      stops.push({ offset: `${pct}%`, color: isUp ? "hsl(162, 78%, 46%)" : "hsl(0, 72%, 51%)" });
    }
    return stops;
  }, [data]);

  const gradientId = `priceGrad-${coin.id}`;
  const strokeGradientId = `strokeGrad-${coin.id}`;

  // Overall trend for fill gradient
  const firstPrice = data[0]?.price ?? 0;
  const lastPrice = data[data.length - 1]?.price ?? 0;
  const isUpTrend = lastPrice >= firstPrice;
  const trendColor = isUpTrend ? "hsl(162, 78%, 46%)" : "hsl(0, 72%, 51%)";

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-0.5">Price Chart</h3>
          <p className="text-[11px] text-muted-foreground">
            {coin.symbol.toUpperCase()}/{currency} — {interval}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-risk-low animate-pulse" />
          <span className="text-[10px] text-muted-foreground">Live</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <AreaChart data={data}>
          <defs>
            {/* Stroke gradient: green for up, red for down segments */}
            <linearGradient id={strokeGradientId} x1="0" y1="0" x2="1" y2="0">
              {gradientStops.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>
            {/* Fill gradient */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={trendColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="hsl(var(--chart-grid-bold))"
            strokeWidth={1}
            strokeDasharray=""
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "hsl(var(--chart-tick))" }}
            axisLine={{ stroke: "hsl(var(--chart-grid-bold))" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(var(--chart-tick))" }}
            axisLine={{ stroke: "hsl(var(--chart-grid-bold))" }}
            tickLine={false}
            tickFormatter={(v) => formatPrice(v)}
            width={75}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "hsl(var(--muted-foreground) / 0.2)", strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={`url(#${strokeGradientId})`}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={(props: any) => <IntervalDot {...props} totalPoints={data.length} />}
            activeDot={{
              r: 6,
              fill: trendColor,
              stroke: "hsl(var(--background))",
              strokeWidth: 3,
              style: { filter: `drop-shadow(0 0 6px ${trendColor})` },
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
