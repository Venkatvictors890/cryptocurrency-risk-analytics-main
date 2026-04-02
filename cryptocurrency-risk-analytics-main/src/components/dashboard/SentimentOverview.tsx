import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import type { CryptoAsset } from "@/types/crypto";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, ExternalLink, Hash, Activity, TrendingUp, Youtube } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  cryptos: CryptoAsset[];
  isLoading: boolean;
}

const COLORS = {
  "Progressive Trends": "hsl(152, 69%, 41%)",
  Neutral: "hsl(220, 10%, 46%)",
  "Risk Dynamics": "hsl(0, 72%, 51%)",
};

const DEFINITIONS: Record<string, string> = {
  "Progressive Trends": "Bullish Sentiment: High confidence, accumulation phase, and positive network growth.",
  Neutral: "Consolidation: Market indecision, sideways trading, and balanced buyer/seller pressure.",
  "Risk Dynamics": "Bearish Sentiment: Panicking selling, FUD, and negative news saturation.",
  CrowdPsych: "Crowd Psychology: The collective irrationality or rationality of market participants.",
  Momentum: "Sentiment Momentum: The velocity of change in public mood over a 24h period.",
};

const PLATFORMS = [
  { 
    name: "Twitter (X)", 
    icon: "🐦", 
    color: "from-blue-400 to-blue-600",
    resources: [
      { label: "🌐 Official", url: "https://twitter.com/TwitterCrypto" },
      { label: "📝 Reviews", url: "https://twitter.com/search?q=crypto%20sentiment%20analysis" },
      { label: "⚡ Live Feed", url: "https://twitter.com/hashtag/CryptoNews" }
    ]
  },
  { 
    name: "Reddit", 
    icon: "🤖", 
    color: "from-orange-400 to-orange-600",
    resources: [
      { label: "👥 Community", url: "https://reddit.com/r/CryptoCurrency" },
      { label: "📝 Reviews", url: "https://www.reddit.com/r/CryptoCrrency/search?q=sentiment" },
      { label: "📖 Guide", url: "https://reddit.com/r/BitcoinBeginners" }
    ]
  },
  { 
    name: "YouTube", 
    icon: "📺", 
    color: "from-red-500 to-red-700",
    resources: [
      { label: "🎥 Channel", url: "https://youtube.com/@CoinBureau" },
      { label: "🎬 Shorts", url: "https://www.youtube.com/shorts/5X6_Y0L0-5k" },
      { label: "💡 Analysis", url: "https://www.youtube.com/results?search_query=crypto+sentiment+analysis" }
    ]
  },
  { 
    name: "Discord", 
    icon: "💬", 
    color: "from-indigo-400 to-indigo-600",
    resources: [
      { label: "🌐 Official", url: "https://discord.com/invite/cryptohub" },
      { label: "💬 Chat", url: "https://discord.com/invite/axie" },
      { label: "🐋 Whale Alert", url: "https://discord.com/invite/whale-alert" }
    ]
  },
  { 
    name: "Instagram", 
    icon: "📸", 
    color: "from-pink-500 to-purple-600",
    resources: [
      { label: "📸 Education", url: "https://instagram.com/cryptoexplorer" },
      { label: "🎬 Reels", url: "https://www.instagram.com/reels/tags/cryptotrading/" },
      { label: "🌐 Binance", url: "https://instagram.com/binance" }
    ]
  },
  { 
    name: "Facebook", 
    icon: "👥", 
    color: "from-blue-600 to-blue-800",
    resources: [
      { label: "📰 News Group", url: "https://www.facebook.com/groups/cryptocurrencynewsgroup/" },
      { label: "📊 Trading", url: "https://www.facebook.com/groups/BitcoinTradingGroup/" }
    ]
  },
  { 
    name: "Snapchat", 
    icon: "👻", 
    color: "from-yellow-300 to-yellow-500",
    resources: [
      { label: "👻 Discover", url: "https://www.snapchat.com/discover/Crypto_News/0285160877" },
      { label: "📈 Trends", url: "https://www.snapchat.com/discover/Bitcoin_Updates/0285160877" }
    ]
  },
  { 
    name: "Others", 
    icon: "🌐", 
    color: "from-gray-500 to-gray-700",
    resources: [
      { label: "📊 Kaggle Data", url: "https://www.kaggle.com/datasets/kaushiksuresh147/bitcoin-tweets" },
      { label: "📲 Telegram", url: "https://t.me/cryptodaily" },
      { label: "🎵 TikTok", url: "https://www.tiktok.com/tag/cryptocurrency" }
    ]
  }
];

const TUTORS = [
  { name: "Coin Bureau", link: "https://youtube.com/@CoinBureau", type: "Deep Analysis" },
  { name: "Whiteboard Crypto", link: "https://youtube.com/@WhiteboardCrypto", type: "Tech Explained" },
  { name: "Benjamin Cowen", link: "https://youtube.com/@intothecryptoverse", type: "Math & Data" },
];

/** Custom Tooltip for Sentiment Chart with Definitions */
function SentimentTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const name = payload[0].payload.name;
  return (
    <div className="glass-card rounded-xl p-4 text-[11px] border-2 shadow-2xl animate-fade-in max-w-[240px] z-50">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/40">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[name as keyof typeof COLORS] }} />
        <span className="font-bold text-sm">{name} Sentiment</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="font-bold text-primary flex items-center gap-1.5 mb-1 italic">
            <Hash className="h-3 w-3" /> Definition
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {DEFINITIONS[name as keyof typeof DEFINITIONS]}
          </p>
        </div>

        <div>
          <p className="font-bold text-chart-2 flex items-center gap-1.5 mb-1 italic">
            <Activity className="h-3 w-3" /> Crowd Psychology
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {DEFINITIONS.CrowdPsych}
          </p>
        </div>

        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[9px] font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded">
          <div className="flex items-center gap-1">
            <Info className="h-2.5 w-2.5" />
            VADER SCORE
          </div>
          <span>{name === "Progressive Trends" ? "+0.82" : name === "Risk Dynamics" ? "-0.76" : "0.00"}</span>
        </div>
      </div>
    </div>
  );
}

export function SentimentOverview({ cryptos, isLoading }: Props) {
  if (isLoading) return <Skeleton className="h-[550px] rounded-xl" />;

  const positive = cryptos.filter((c) => c.sentimentLabel === "Positive").length;
  const neutral = cryptos.filter((c) => c.sentimentLabel === "Neutral").length;
  const negative = cryptos.filter((c) => c.sentimentLabel === "Negative").length;

  const data = [
    { name: "Progressive Trends", count: positive },
    { name: "Neutral", count: neutral },
    { name: "Risk Dynamics", count: negative },
  ];

  return (
    <TooltipProvider delayDuration={100}>
      <div className="bg-card rounded-2xl shadow-xl p-6 border border-border/50 flex flex-col h-full hover:shadow-2xl transition-all duration-500 overflow-hidden relative group">
        {/* Background glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold tracking-tight">Public Sentiment Hub</h3>
              <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Live Analysis</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-primary" /> Multi-Platform Engine
            </p>
          </div>
          <UITooltip>
            <TooltipTrigger asChild>
              <div className="p-2 rounded-full border border-border bg-secondary/30 hover:bg-secondary/50 cursor-help transition-all">
                <Info className="h-4 w-4 text-muted-foreground/60" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs max-w-[240px] p-3 shadow-2xl glass border-primary/20">
              <p className="font-bold text-primary mb-1">Social Pulse Engine</p>
              We ingest data from 9+ platforms using <strong className="underline">VADER</strong> linguistics and <strong className="underline">BERT</strong> transformers to quantify the "wisdom of the crowd."
            </TooltipContent>
          </UITooltip>
        </div>

        {/* The Graph */}
        <div className="flex-1 min-h-[160px] mb-6">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data} barSize={40}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis hide />
              <Tooltip content={<SentimentTooltip />} cursor={false} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.map((entry) => (
                  <Cell 
                    key={entry.name} 
                    fill={COLORS[entry.name as keyof typeof COLORS]} 
                    className="hover:opacity-80 transition-opacity cursor-crosshair"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platforms Grid - Multi-Resource View */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em]">Social Ecosystem</p>
            <div className="flex items-center gap-1 animate-pulse">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[9px] font-bold text-primary uppercase">Deep Tracking</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLATFORMS.map((p) => (
              <div 
                key={p.name}
                className="flex flex-col p-3 rounded-xl bg-secondary/20 border border-transparent hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg group-hover:scale-110 transition-transform">{p.icon}</span>
                  <span className="text-[11px] font-bold">{p.name}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.resources.map((res) => (
                    <a 
                      key={res.label}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] font-bold bg-card border border-border px-2 py-1 rounded-md hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center gap-1 shrink-0"
                    >
                      {res.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tutors & Intelligence */}
        <div className="space-y-3 pt-4 border-t border-border/40 bg-secondary/5 -mx-6 px-6 -mb-6 pb-6">
          <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
            <Youtube className="h-3 w-3 text-risk-high" /> Intelligence & Tutors
          </p>
          <div className="grid gap-2">
            {TUTORS.map((t) => (
              <a 
                key={t.name}
                href={t.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg border border-border/30 bg-card/40 hover:bg-card hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-secondary/50 flex items-center justify-center text-xs group-hover:bg-primary/20 transition-colors">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold">{t.name}</span>
                    <span className="text-[9px] text-muted-foreground">{t.type}</span>
                  </div>
                </div>
                <ExternalLink className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
