import { useCryptoData } from "@/hooks/useCryptoData";
import { Globe, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { generateSentimentFeed } from "@/lib/sentiment";
import { Skeleton } from "@/components/ui/skeleton";

const REGIONS = [
  { name: "United States", flag: "🇺🇸", sentiment: "Positive" as const },
  { name: "European Union", flag: "🇪🇺", sentiment: "Positive" as const },
  { name: "Japan", flag: "🇯🇵", sentiment: "Negative" as const },
  { name: "India", flag: "🇮🇳", sentiment: "Neutral" as const },
  { name: "South Korea", flag: "🇰🇷", sentiment: "Positive" as const },
  { name: "Brazil", flag: "🇧🇷", sentiment: "Neutral" as const },
];

const NEWS = [
  { title: "SEC Approves New Bitcoin ETF Structure", source: "Reuters", sentiment: "Positive" as const, time: "2h ago" },
  { title: "Ethereum Staking Yields Hit Record High", source: "CoinDesk", sentiment: "Positive" as const, time: "4h ago" },
  { title: "China Expands CBDC Trial to More Cities", source: "Bloomberg", sentiment: "Neutral" as const, time: "5h ago" },
  { title: "Major Exchange Reports Security Vulnerability", source: "The Block", sentiment: "Negative" as const, time: "6h ago" },
  { title: "DeFi Protocol Suffers $12M Exploit", source: "Decrypt", sentiment: "Negative" as const, time: "8h ago" },
  { title: "Central Banks Discuss Crypto Regulation", source: "Financial Times", sentiment: "Neutral" as const, time: "10h ago" },
  { title: "Solana Ecosystem Growth Accelerates", source: "CoinTelegraph", sentiment: "Positive" as const, time: "12h ago" },
  { title: "Stablecoin Market Cap Reaches $200B", source: "DeFi Llama", sentiment: "Positive" as const, time: "14h ago" },
];

export default function News() {
  const { isLoading } = useCryptoData(20);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="opacity-0 animate-fade-up">
        <h1 className="text-xl font-bold">News & Sentiment</h1>
        <p className="text-xs text-muted-foreground">Global market sentiment and latest crypto news</p>
      </div>

      {/* Global Sentiment Map */}
      <section className="glass-card rounded-xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" /> Global Sentiment by Region
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {REGIONS.map((r) => {
            const icon = r.sentiment === "Positive" ? <TrendingUp className="h-3.5 w-3.5 text-sentiment-positive" />
              : r.sentiment === "Negative" ? <TrendingDown className="h-3.5 w-3.5 text-sentiment-negative" />
                : <Minus className="h-3.5 w-3.5 text-sentiment-neutral" />;
            const border = r.sentiment === "Positive" ? "border-sentiment-positive/20" : r.sentiment === "Negative" ? "border-sentiment-negative/20" : "border-border";
            return (
              <div key={r.name} className={`rounded-xl border ${border} bg-secondary/20 p-4 text-center`}>
                <span className="text-2xl">{r.flag}</span>
                <p className="text-xs font-medium mt-2">{r.name}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {icon}
                  <span className={`text-[11px] font-medium ${r.sentiment === "Positive" ? "text-sentiment-positive" : r.sentiment === "Negative" ? "text-sentiment-negative" : "text-sentiment-neutral"}`}>
                    {r.sentiment}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* News Articles */}
      <section className="opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <h2 className="text-sm font-semibold mb-4">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NEWS.map((article, i) => {
            const sentColor = article.sentiment === "Positive" ? "text-sentiment-positive bg-sentiment-positive/10 border-sentiment-positive/20"
              : article.sentiment === "Negative" ? "text-sentiment-negative bg-sentiment-negative/10 border-sentiment-negative/20"
                : "text-sentiment-neutral bg-secondary/50 border-border";
            return (
              <div key={i} className="glass-card rounded-xl p-5 hover:translate-y-[-1px] transition-all duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{article.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] text-muted-foreground">{article.source}</span>
                      <span className="text-[10px] text-muted-foreground/50">•</span>
                      <span className="text-[11px] text-muted-foreground">{article.time}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${sentColor}`}>
                    {article.sentiment}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
