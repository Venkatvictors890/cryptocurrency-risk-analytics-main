import { Link } from "react-router-dom";
import { Activity, Shield, TrendingUp, BarChart3, Zap, Globe, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCryptoData } from "@/hooks/useCryptoData";
import { formatPrice } from "@/lib/format";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

function LiveTicker() {
  const { data: cryptos } = useCryptoData(10);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setOffset((o) => o - 1), 30);
    return () => clearInterval(id);
  }, []);

  if (!cryptos?.length) return null;
  const items = [...cryptos, ...cryptos, ...cryptos];

  return (
    <div className="w-full overflow-hidden border-b border-border/40 bg-card/60 backdrop-blur-sm">
      <div
        className="flex gap-8 py-2.5 px-4 whitespace-nowrap"
        style={{ transform: `translateX(${offset}px)`, transition: "none" }}
      >
        {items.map((c, i) => (
          <span key={`${c.id}-${i}`} className="flex items-center gap-2 text-xs shrink-0">
            <span className="font-medium text-foreground">{c.symbol.toUpperCase()}</span>
            <span className="text-muted-foreground">{formatPrice(c.currentPrice)}</span>
            <span className={c.priceChangePercentage24h >= 0 ? "text-risk-low" : "text-destructive"}>
              {c.priceChangePercentage24h >= 0 ? "+" : ""}
              {c.priceChangePercentage24h.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

const features = [
  { icon: Shield, title: "Multi-Factor Risk Analysis", desc: "Combines volatility, liquidity, sentiment, and news impact into a single 0-100 risk score." },
  { icon: BarChart3, title: "Real-Time Market Data", desc: "Live cryptocurrency prices with auto-refresh and interactive charts across multiple timeframes." },
  { icon: Zap, title: "AI-Powered Insights", desc: "Context-aware AI assistant that explains market movements and provides investment analysis." },
  { icon: Globe, title: "Global Sentiment Tracking", desc: "Aggregated sentiment from news, Twitter, Reddit, and YouTube with regional breakdowns." },
];

const steps = [
  { num: "01", title: "Connect", desc: "Platform fetches live market data and news from multiple sources." },
  { num: "02", title: "Analyze", desc: "AI processes volatility, liquidity, social sentiment, and transaction behavior." },
  { num: "03", title: "Score", desc: "Each cryptocurrency receives a comprehensive risk score from 0 to 100." },
  { num: "04", title: "Act", desc: "Get actionable insights — understand risk before you invest." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center animate-glow-pulse">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <span className="text-base font-bold tracking-tight">
            <span className="gradient-text">CryptoRisk</span>
            <span className="text-muted-foreground font-normal ml-1">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/markets">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Explore Markets</Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="gap-1.5">
              Enter Dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      <LiveTicker />

      {/* Hero */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-2/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-chart-5/3 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-xs text-primary mb-6 animate-fade-up">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Intelligent Crypto Analysis Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl leading-[1.1] animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <span className="gradient-text">CryptoRisk</span> AI
        </h1>

        <p className="mt-3 text-lg sm:text-xl text-muted-foreground font-medium animate-fade-up" style={{ animationDelay: "0.15s" }}>
          Intelligent Crypto Analysis Platform
        </p>

        <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Analyze risk, sentiment, and market behavior in real-time. Make smarter investment decisions with AI-powered insights across 50+ cryptocurrencies and 20 fiat currencies.
        </p>

        <div className="flex flex-wrap gap-3 mt-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/dashboard">
            <Button size="lg" className="gap-2 text-sm h-12 px-7 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
              Enter Dashboard <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/markets">
            <Button size="lg" variant="outline" className="text-sm h-12 px-7">
              Explore Markets
            </Button>
          </Link>
        </div>

        <div className="mt-16 w-full max-w-4xl animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <PreviewCards />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 border-t border-border/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">Platform Features</h2>
          <p className="text-muted-foreground text-center mb-12 text-sm">Everything you need to analyze cryptocurrency risk</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="glass-card rounded-xl p-5 group hover:border-primary/20 transition-all duration-300 hover:translate-y-[-2px]">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-border/40 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="text-center group">
                <span className="text-3xl font-bold gradient-text group-hover:glow-text transition-all">{s.num}</span>
                <h3 className="font-semibold mt-3 mb-2 text-sm">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 CryptoRisk AI — Cryptocurrency Risk & Sentiment Intelligence Platform
        </p>
      </footer>
    </div>
  );
}

function PreviewCards() {
  const { data: cryptos } = useCryptoData(4);
  if (!cryptos?.length) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cryptos.map((c) => (
        <div key={c.id} className="glass-card rounded-xl p-4 text-left interactive-card">
          <div className="flex items-center gap-2 mb-3">
            <img src={c.image} alt={c.name} className="h-6 w-6 rounded-full" />
            <span className="text-sm font-medium">{c.symbol.toUpperCase()}</span>
          </div>
          <div className="text-lg font-bold tabular-nums">{formatPrice(c.currentPrice)}</div>
          <div className={`text-xs mt-1 ${c.priceChangePercentage24h >= 0 ? "text-risk-low" : "text-destructive"}`}>
            {c.priceChangePercentage24h >= 0 ? "+" : ""}{c.priceChangePercentage24h.toFixed(2)}%
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${c.riskLevel === "Low" ? "bg-risk-low" : c.riskLevel === "Moderate" ? "bg-risk-moderate" : "bg-risk-high"}`} />
            <span className="text-[10px] text-muted-foreground">Risk: {c.riskScore}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
