import { formatDistanceToNow } from "date-fns";

/** Format large numbers: 1.32T, 28.5B, 420M */
export function formatCompact(n: number): string {
  if (n == null || isNaN(n)) return "$0";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

/** Format price with appropriate decimal places */
export function formatPrice(price: number): string {
  if (price == null || isNaN(price)) return "$0.00";
  if (price >= 1000) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

/** Format percentage with sign */
export function formatPercent(pct: number): string {
  if (pct == null || isNaN(pct)) return "0.00%";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

/** Time ago label */
export function timeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}
