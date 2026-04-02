import { MessageCircle } from "lucide-react";
import type { CryptoAsset } from "@/types/crypto";
import { generateSentimentFeed } from "@/lib/sentiment";
import { formatDistanceToNow } from "date-fns";

interface Props {
  coin: CryptoAsset;
}

const sourceColors: Record<string, string> = {
  twitter: "bg-primary/20 text-primary",
  reddit: "bg-risk-moderate/20 text-risk-moderate",
  news: "bg-sentiment-positive/20 text-sentiment-positive",
};

export function SentimentFeed({ coin }: Props) {
  const feed = generateSentimentFeed(coin.id, coin.symbol, 6);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <MessageCircle className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Social & News Feed</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Simulated NLP-classified sentiment data
      </p>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {feed.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${sourceColors[item.source] ?? "bg-muted text-muted-foreground"}`}>
                {item.source}
              </span>
              <span className={`text-[10px] font-medium ${
                item.sentiment === "Positive" ? "text-sentiment-positive" :
                item.sentiment === "Negative" ? "text-sentiment-negative" :
                "text-muted-foreground"
              }`}>
                {item.sentiment}
              </span>
              <span className="text-[10px] text-muted-foreground ml-auto">
                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
              </span>
            </div>
            <p className="text-xs leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
