import type { SentimentLabel } from "@/types/crypto";
import { Badge } from "@/components/ui/badge";

const config: Record<SentimentLabel, { className: string; emoji: string }> = {
  Positive: { className: "bg-sentiment-positive/10 text-sentiment-positive border-sentiment-positive/20", emoji: "↑" },
  Neutral: { className: "bg-muted text-muted-foreground border-border", emoji: "→" },
  Negative: { className: "bg-sentiment-negative/10 text-sentiment-negative border-sentiment-negative/20", emoji: "↓" },
};

export function SentimentBadge({ label }: { label: SentimentLabel }) {
  const c = config[label];
  return (
    <Badge variant="outline" className={`text-[11px] font-medium ${c.className}`}>
      {c.emoji} {label}
    </Badge>
  );
}
