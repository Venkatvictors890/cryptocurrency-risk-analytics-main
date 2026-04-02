import { useCryptoData } from "@/hooks/useCryptoData";
import { useCurrency } from "@/hooks/useCurrencyStore";
import { SentimentOverview } from "@/components/dashboard/SentimentOverview";
import { SentimentTrendChart } from "@/components/coin/SentimentTrendChart";
import { SentimentFeed } from "@/components/coin/SentimentFeed";
import { MessageSquare, Globe, Zap, Users } from "lucide-react";

export default function SocialSentiment() {
  const { currency } = useCurrency();
  const { data: cryptos, isLoading } = useCryptoData(50, currency.code);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="opacity-0 animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Social Sentiment Hub</h1>
        <p className="text-muted-foreground text-sm flex items-center gap-2">
          <Users className="h-4 w-4 text-rose-500" />
          Aggregate public opinion across 9+ platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Sentiment Hub */}
          <div className="opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
            {cryptos && <SentimentOverview cryptos={cryptos} isLoading={isLoading} />}
          </div>

          {/* Aggregate Trend */}
          <div className="glass-card rounded-2xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <Zap className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <h3 className="font-bold">Global Pulse Trend</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Aggregate Market Emotion</p>
              </div>
            </div>
            {cryptos && <SentimentTrendChart coin={cryptos[0]} interval="1D" />}
          </div>
        </div>

        <div className="space-y-6">
          {/* Live Feed */}
          <div className="opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
             <div className="flex items-center gap-3 mb-4 px-1">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Globe className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-bold text-sm">Real-time Social Signals</h3>
            </div>
            {cryptos && <SentimentFeed coin={cryptos[0]} />}
          </div>

          {/* Info Card */}
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-rose-500/5 to-transparent border-rose-500/10 opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-3 flex items-center gap-2">
              <MessageSquare className="h-3 w-3" /> Sentiment Logic
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Our refined <strong className="text-foreground">Progressive Trends</strong> model identifies bullish accumulation by filtering out bot activity and weighting high-reputation social accounts. 
              <br /><br />
              The <strong className="text-foreground">Risk Dynamics</strong> engine flags potential sell-offs by tracking FUD intensity across decentralized communities and news cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
