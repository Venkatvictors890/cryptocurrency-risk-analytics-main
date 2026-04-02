import { Layers, ArrowRight, Database, Globe, Cpu, Monitor, Cloud } from "lucide-react";

const LAYERS = [
  {
    name: "Presentation Layer",
    icon: Monitor,
    tech: "React + Tailwind CSS + Recharts",
    desc: "Interactive dashboard UI with real-time chart visualization and responsive design.",
    color: "text-primary border-primary/20 bg-primary/5",
  },
  {
    name: "Application Layer",
    icon: Globe,
    tech: "REST API Endpoints",
    desc: "API routes serving processed data: /coins, /coin/:id, /coin/:id/history with query params.",
    color: "text-chart-2 border-chart-2/20 bg-chart-2/5",
  },
  {
    name: "Analysis Layer",
    icon: Cpu,
    tech: "Risk Engine + NLP Sentiment",
    desc: "Weighted multi-factor risk scoring (volatility, liquidity, sentiment, news, transactions) and VADER-based NLP classification.",
    color: "text-risk-moderate border-risk-moderate/20 bg-risk-moderate/5",
  },
  {
    name: "Processing Layer",
    icon: Layers,
    tech: "Data Normalization Pipeline",
    desc: "Cleans, normalizes, and transforms raw API data. Handles missing values and outlier detection.",
    color: "text-chart-5 border-chart-5/20 bg-chart-5/5",
  },
  {
    name: "Data Collection Layer",
    icon: Database,
    tech: "CoinGecko API + Mock Fallback",
    desc: "Fetches real-time market data with automatic fallback to deterministic mock data.",
    color: "text-destructive border-destructive/20 bg-destructive/5",
  },
  {
    name: "Cloud Archive",
    icon: Cloud,
    tech: "Multi-resolution Storage",
    desc: "1-min data (24h) → hourly summaries (30d) → daily summaries (long-term) → compressed cloud archive.",
    color: "text-muted-foreground border-border bg-secondary/20",
  },
];

export default function SystemArchitecture() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="opacity-0 animate-fade-up">
        <h1 className="text-xl font-bold">System Architecture</h1>
        <p className="text-xs text-muted-foreground">Modular layered architecture overview</p>
      </div>

      {/* Flow diagram */}
      <div className="glass-card rounded-xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <h2 className="text-sm font-semibold mb-6">Data Flow</h2>
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          {["Frontend", "API", "Processing", "Analysis", "Database", "Archive", "Cloud"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-2 rounded-lg bg-secondary/50 border border-border font-medium">{step}</span>
              {i < 6 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      {/* Layer cards */}
      <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
        {LAYERS.map((layer, i) => (
          <div key={layer.name} className={`glass-card rounded-xl p-5 border-l-2 ${layer.color.split(" ").find(c => c.startsWith("border-"))}`}>
            <div className="flex items-start gap-4">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${layer.color}`}>
                <layer.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold">{layer.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">{layer.tech}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{layer.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
