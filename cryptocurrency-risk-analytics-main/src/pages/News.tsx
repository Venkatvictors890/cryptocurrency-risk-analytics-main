import { useCryptoData } from "@/hooks/useCryptoData";
import { Globe, TrendingUp, TrendingDown, Minus, Twitter, MessageSquare, Newspaper, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { SentimentLabel } from "@/types/crypto";

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

const SOCIAL_POSTS = [
  { platform: "Twitter/X", icon: Twitter, user: "@CryptoAnalyst", text: "Bitcoin's on-chain metrics showing strong accumulation phase. Whales adding to positions consistently over the past 2 weeks. 🐋", sentiment: "Positive" as const, likes: "12.4K", time: "1h ago" },
  { platform: "Reddit", icon: MessageSquare, user: "r/cryptocurrency", text: "ETH gas fees at historic lows — making DeFi accessible again. This could drive the next wave of adoption.", sentiment: "Positive" as const, likes: "3.2K", time: "3h ago" },
  { platform: "Twitter/X", icon: Twitter, user: "@BlockchainNews", text: "⚠️ BREAKING: New regulatory framework proposed by EU could restrict stablecoin usage. Full details pending.", sentiment: "Negative" as const, likes: "8.7K", time: "4h ago" },
  { platform: "Reddit", icon: MessageSquare, user: "r/defi", text: "Yield farming returns declining across major protocols. Is DeFi summer over? Discussion thread inside.", sentiment: "Neutral" as const, likes: "1.5K", time: "5h ago" },
  { platform: "News", icon: Newspaper, user: "CoinDesk", text: "BlackRock's Bitcoin ETF hits $40B AUM milestone, becoming one of the fastest-growing ETFs in history.", sentiment: "Positive" as const, likes: "—", time: "6h ago" },
  { platform: "Twitter/X", icon: Twitter, user: "@WhaleAlert", text: "🚨 500 BTC ($30.5M) transferred from unknown wallet to Coinbase. Possible sell pressure incoming.", sentiment: "Negative" as const, likes: "15.1K", time: "7h ago" },
];

export default function News() {
  const { data: cryptos, isLoading } = useCryptoData(50);

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

  // Calculate overall sentiment stats
  const positiveCount = cryptos?.filter((c) => c.sentimentLabel === "Positive").length ?? 0;
  const negativeCount = cryptos?.filter((c) => c.sentimentLabel === "Negative").length ?? 0;
  const neutralCount = cryptos?.filter((c) => c.sentimentLabel === "Neutral").length ?? 0;
  const total = cryptos?.length ?? 1;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="opacity-0 animate-fade-up">
        <h1 className="text-xl font-bold">News & Sentiment</h1>
        <p className="text-xs text-muted-foreground">Global market sentiment, social media opinion, and latest crypto news</p>
      </div>

      {/* Sentiment Summary Bar */}
      <section className="glass-card rounded-xl p-5 opacity-0 animate-fade-up" style={{ animationDelay: "40ms" }}>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Sentiment Impact on Price</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-sentiment-positive/5 border border-sentiment-positive/10">
            <p className="text-xl font-bold text-sentiment-positive tabular-nums">{Math.round((positiveCount / total) * 100)}%</p>
            <p className="text-[10px] text-muted-foreground mt-1">Positive ({positiveCount} assets)</p>
            <p className="text-[9px] text-sentiment-positive mt-1">↑ Buying pressure increases</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/30 border border-border/30">
            <p className="text-xl font-bold text-sentiment-neutral tabular-nums">{Math.round((neutralCount / total) * 100)}%</p>
            <p className="text-[10px] text-muted-foreground mt-1">Neutral ({neutralCount} assets)</p>
            <p className="text-[9px] text-muted-foreground mt-1">→ Market consolidating</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-sentiment-negative/5 border border-sentiment-negative/10">
            <p className="text-xl font-bold text-sentiment-negative tabular-nums">{Math.round((negativeCount / total) * 100)}%</p>
            <p className="text-[10px] text-muted-foreground mt-1">Negative ({negativeCount} assets)</p>
            <p className="text-[9px] text-sentiment-negative mt-1">↓ Selling pressure increases</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/60 italic">
          NLP-based analysis: Positive sentiment from social media and news tends to correlate with price increases within 24-48 hours. Negative sentiment often precedes price drops.
        </p>
      </section>

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
              <div key={r.name} className={`rounded-xl border ${border} bg-secondary/20 p-4 text-center interactive-card`}>
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

      {/* Market Sentiment & Public Opinion */}
      <section className="glass-card rounded-xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "120ms" }}>
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-chart-2" /> Market Sentiment & Public Opinion
        </h2>
        <div className="space-y-3">
          {SOCIAL_POSTS.map((post, i) => {
            const sentColor = post.sentiment === "Positive" ? "text-sentiment-positive bg-sentiment-positive/10 border-sentiment-positive/20"
              : post.sentiment === "Negative" ? "text-sentiment-negative bg-sentiment-negative/10 border-sentiment-negative/20"
                : "text-sentiment-neutral bg-secondary/50 border-border";
            return (
              <div key={i} className="flex gap-3 p-4 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-all duration-200 hover:translate-y-[-1px]">
                <div className="h-9 w-9 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <post.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">{post.user}</span>
                    <span className="text-[10px] text-muted-foreground">• {post.platform}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{post.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/90">{post.text}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${sentColor}`}>
                      {post.sentiment}
                    </span>
                    {post.likes !== "—" && (
                      <span className="text-[10px] text-muted-foreground/60">❤️ {post.likes}</span>
                    )}
                  </div>
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
              <div key={i} className="glass-card rounded-xl p-5 interactive-card">
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
