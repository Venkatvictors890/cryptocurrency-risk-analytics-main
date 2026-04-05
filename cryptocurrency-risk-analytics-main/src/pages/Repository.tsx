import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Folder, FileText, Download, ExternalLink, Database, HardDrive,
  FileCode, Eye, ChevronRight, ChevronDown, GitBranch, Star, GitFork,
  Code2, Server, Layers, Cpu, Braces, Shield, BarChart3, MessageSquare,
  Bot, Clock, Zap,
} from "lucide-react";
import { useState } from "react";

const GITHUB_URL = "https://github.com/Venkatvictors890/cryptocurrency-risk-analytics-main";

/* ───────── File tree data ───────── */
interface TreeNode {
  name: string;
  desc: string;
  size?: string;
  type?: "dir" | "file";
  icon?: typeof FileText;
  children?: TreeNode[];
}

const projectTree: TreeNode[] = [
  {
    name: "src/", type: "dir", desc: "Application source code", children: [
      {
        name: "components/", type: "dir", desc: "Reusable UI components", children: [
          {
            name: "coin/", type: "dir", desc: "Coin detail components", children: [
              { name: "InsightsPanel.tsx", desc: "AI-generated insights display", size: "1.6 KB", icon: Zap },
              { name: "PriceChart.tsx", desc: "Interactive price chart with intervals", size: "8.4 KB", icon: BarChart3 },
              { name: "RiskBreakdownPanel.tsx", desc: "Detailed risk factor visualization", size: "4.9 KB", icon: Shield },
              { name: "SentimentFeed.tsx", desc: "Live sentiment feed from social sources", size: "2.1 KB", icon: MessageSquare },
              { name: "SentimentTrendChart.tsx", desc: "Sentiment trend over time", size: "5.0 KB", icon: BarChart3 },
              { name: "VolumeChart.tsx", desc: "24h volume analysis chart", size: "3.4 KB", icon: BarChart3 },
            ],
          },
          {
            name: "dashboard/", type: "dir", desc: "Dashboard section components", children: [
              { name: "CryptoTable.tsx", desc: "Sortable cryptocurrency data table", size: "5.0 KB", icon: Layers },
              { name: "DashboardHeader.tsx", desc: "Header with live sync status", size: "2.9 KB", icon: Layers },
              { name: "RiskBadge.tsx", desc: "Color-coded risk level badge", size: "0.7 KB", icon: Shield },
              { name: "RiskBreakdownChart.tsx", desc: "Radar chart for risk factors", size: "1.9 KB", icon: BarChart3 },
              { name: "RiskDistributionChart.tsx", desc: "Pie chart of risk distribution", size: "2.3 KB", icon: BarChart3 },
              { name: "SentimentBadge.tsx", desc: "Sentiment indicator badge", size: "0.8 KB", icon: MessageSquare },
              { name: "SentimentOverview.tsx", desc: "Full sentiment analysis dashboard", size: "12.9 KB", icon: MessageSquare },
              { name: "SparklineSection.tsx", desc: "Mini sparkline chart section", size: "2.7 KB", icon: BarChart3 },
              { name: "StatsRow.tsx", desc: "Market statistics row", size: "2.2 KB", icon: Layers },
            ],
          },
          {
            name: "layout/", type: "dir", desc: "App layout structure", children: [
              { name: "AppLayout.tsx", desc: "Main layout with sidebar & navbar", size: "1.5 KB", icon: Layers },
              { name: "TopNavbar.tsx", desc: "Top navigation bar with search", size: "3.6 KB", icon: Layers },
            ],
          },
          { name: "AppSidebar.tsx", desc: "Navigation sidebar component", size: "4.2 KB", icon: Layers },
          { name: "ExitConfirmationDialog.tsx", desc: "Two-step exit confirmation flow", size: "4.6 KB", icon: Layers },
          { name: "NavLink.tsx", desc: "Active-aware navigation link", size: "0.8 KB", icon: Layers },
          { name: "ThemeToggle.tsx", desc: "Dark/Light mode toggle", size: "0.7 KB", icon: Layers },
        ],
      },
      {
        name: "services/", type: "dir", desc: "API integration layer", icon: Server, children: [
          { name: "coingecko.ts", desc: "CoinGecko REST API client — market data, charts, coin details", size: "5.0 KB", icon: Server },
        ],
      },
      {
        name: "lib/", type: "dir", desc: "Core algorithms & utilities", icon: Cpu, children: [
          { name: "risk.ts", desc: "Risk scoring engine — 5-factor weighted model (volatility, liquidity, sentiment, news, txn)", size: "4.1 KB", icon: Shield },
          { name: "sentiment.ts", desc: "Sentiment analysis engine — NLP simulation with VADER-style scoring", size: "3.4 KB", icon: MessageSquare },
          { name: "chatEngine.ts", desc: "AI chat engine — rule-based knowledge assistant with 15+ topic handlers", size: "18.1 KB", icon: Bot },
          { name: "insights.ts", desc: "Insight generator — rule-based AI market commentary per coin", size: "3.4 KB", icon: Zap },
          { name: "historicalData.ts", desc: "Historical data simulator — generates time-series for 6 intervals", size: "2.0 KB", icon: Clock },
          { name: "mockData.ts", desc: "Mock market data — fallback when CoinGecko API is unavailable", size: "4.3 KB", icon: Database },
          { name: "format.ts", desc: "Number formatters — compact ($1.32T), price, percent, time-ago", size: "1.1 KB", icon: Braces },
          { name: "utils.ts", desc: "General utility helpers (cn class merger)", size: "0.2 KB", icon: Braces },
        ],
      },
      {
        name: "hooks/", type: "dir", desc: "Custom React hooks", icon: Code2, children: [
          { name: "useCryptoData.ts", desc: "Fetches & auto-refreshes crypto market data (60s interval)", size: "0.5 KB", icon: Code2 },
          { name: "useCoinDetail.ts", desc: "Fetches single coin detail with caching", size: "0.6 KB", icon: Code2 },
          { name: "useCurrencyStore.tsx", desc: "Global currency context (20 fiat currencies supported)", size: "1.5 KB", icon: Code2 },
          { name: "useTheme.ts", desc: "Dark/light theme management with localStorage persistence", size: "1.9 KB", icon: Code2 },
          { name: "use-mobile.tsx", desc: "Responsive breakpoint detection hook", size: "0.6 KB", icon: Code2 },
          { name: "use-toast.ts", desc: "Toast notification system hook", size: "3.9 KB", icon: Code2 },
        ],
      },
      {
        name: "types/", type: "dir", desc: "TypeScript type definitions", icon: Braces, children: [
          { name: "crypto.ts", desc: "Core domain types — CryptoAsset, RiskLevel, SentimentLabel, RiskWeights", size: "1.3 KB", icon: Braces },
        ],
      },
      {
        name: "pages/", type: "dir", desc: "Route page components", children: [
          { name: "Dashboard.tsx", desc: "Main dashboard with stats, charts, heatmap, sentiment", size: "18.9 KB", icon: Layers },
          { name: "Markets.tsx", desc: "Markets browser — filter, sort, search 50 coins", size: "7.2 KB", icon: Layers },
          { name: "CoinDetail.tsx", desc: "Coin deep-dive — charts, risk breakdown, insights", size: "9.7 KB", icon: Layers },
          { name: "Compare.tsx", desc: "Side-by-side coin comparison tool", size: "12.3 KB", icon: Layers },
          { name: "Analytics.tsx", desc: "Market-wide risk & sentiment analytics", size: "3.0 KB", icon: Layers },
          { name: "News.tsx", desc: "Crypto news feed with regional sentiment", size: "12.0 KB", icon: Layers },
          { name: "Trade.tsx", desc: "Paper trading simulator", size: "6.7 KB", icon: Layers },
          { name: "AiAssistant.tsx", desc: "AI chat assistant interface", size: "7.5 KB", icon: Layers },
          { name: "Archive.tsx", desc: "Historical data download portal", size: "9.2 KB", icon: Layers },
          { name: "SocialSentiment.tsx", desc: "Social sentiment analysis dashboard", size: "3.6 KB", icon: Layers },
          { name: "Landing.tsx", desc: "Landing/splash page", size: "9.7 KB", icon: Layers },
          { name: "Recommendations.tsx", desc: "AI-powered investment recommendations", size: "4.7 KB", icon: Layers },
          { name: "SystemArchitecture.tsx", desc: "System architecture documentation", size: "3.9 KB", icon: Layers },
          { name: "Repository.tsx", desc: "This page — codebase browser & downloads", size: "7.1 KB", icon: Layers },
        ],
      },
      { name: "App.tsx", desc: "Root application with routing & providers", size: "3.1 KB", icon: FileCode },
      { name: "main.tsx", desc: "Application entry point", size: "0.2 KB", icon: FileCode },
      { name: "index.css", desc: "Global styles — theme, animations, glassmorphism", size: "9.4 KB", icon: FileCode },
    ],
  },
  {
    name: "supabase/", type: "dir", desc: "Backend — Edge functions & config", icon: Server, children: [
      {
        name: "functions/", type: "dir", desc: "Serverless edge functions", children: [
          {
            name: "chat/", type: "dir", desc: "AI chat endpoint", children: [
              { name: "index.ts", desc: "Deno edge function — proxies AI chat via Gemini Flash model", size: "2.9 KB", icon: Server },
            ],
          },
        ],
      },
      { name: "config.toml", desc: "Supabase project configuration", size: "35 B", icon: FileText },
    ],
  },
  {
    name: "config/", type: "dir", desc: "Build & tool configuration", children: [
      { name: "vite.config.ts", desc: "Vite build config — dev server, aliases, HMR", size: "0.4 KB", icon: FileCode },
      { name: "tailwind.config.ts", desc: "Tailwind CSS — custom theme, colors, animations", size: "4.1 KB", icon: FileCode },
      { name: "tsconfig.json", desc: "TypeScript compiler configuration", size: "0.4 KB", icon: FileCode },
      { name: "postcss.config.js", desc: "PostCSS pipeline for Tailwind", size: "0.1 KB", icon: FileCode },
      { name: "eslint.config.js", desc: "ESLint code quality rules", size: "0.8 KB", icon: FileCode },
      { name: "vitest.config.ts", desc: "Vitest testing configuration", size: "0.4 KB", icon: FileCode },
      { name: "playwright.config.ts", desc: "Playwright E2E testing config", size: "0.3 KB", icon: FileCode },
    ],
  },
  {
    name: "test/", type: "dir", desc: "Test suite", children: [
      { name: "setup.ts", desc: "Test environment setup", size: "0.4 KB", icon: FileCode },
      { name: "example.test.ts", desc: "Sample unit test", size: "0.1 KB", icon: FileCode },
    ],
  },
];

const downloads = [
  { name: "Full Source Code", ext: "ZIP", size: "4.2 MB", icon: FileCode, desc: "Complete project source with all components", color: "text-emerald-500" },
  { name: "Historical Price Data", ext: "ZIP", size: "128 MB", icon: Database, desc: "7-day sparkline data for top 20 coins", color: "text-sky-500" },
  { name: "Project Documentation", ext: "PDF", size: "2.1 MB", icon: FileText, desc: "Architecture docs, API reference, setup guide", color: "text-violet-500" },
  { name: "Sample Dataset", ext: "CSV", size: "45 MB", icon: HardDrive, desc: "Crypto market data with risk & sentiment scores", color: "text-amber-500" },
];

/* ───────── Recursive tree renderer ───────── */
function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const isDir = node.type === "dir" || !!node.children;
  const Icon = node.icon || (isDir ? Folder : FileText);

  return (
    <div>
      <button
        onClick={() => isDir && setOpen(!open)}
        className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-lg transition-all duration-200 text-left group ${
          isDir
            ? "hover:bg-secondary/40 cursor-pointer"
            : "hover:bg-primary/5 cursor-default"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isDir ? (
          open ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0 transition-transform" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0 transition-transform" />
          )
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <Icon
          className={`h-3.5 w-3.5 shrink-0 ${
            isDir ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          } transition-colors`}
        />
        <span
          className={`text-xs ${
            isDir ? "font-semibold text-foreground" : "text-foreground/80"
          }`}
        >
          {node.name}
        </span>
        {node.size && (
          <span className="text-[9px] text-muted-foreground/60 ml-1 tabular-nums">
            {node.size}
          </span>
        )}
        <span className="text-[10px] text-muted-foreground/50 ml-auto truncate max-w-[200px] hidden lg:inline">
          {node.desc}
        </span>
      </button>
      {isDir && open && node.children && (
        <div className="border-l border-border/30" style={{ marginLeft: `${depth * 16 + 18}px` }}>
          {node.children.map((child) => (
            <TreeItem key={child.name} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────── Backend highlight cards ───────── */
const backendModules = [
  {
    title: "Risk Scoring Engine",
    file: "src/lib/risk.ts",
    desc: "5-factor weighted risk model: Volatility (30%), Liquidity (25%), Social Sentiment (20%), News Impact (15%), Transaction Behavior (10%). Uses coefficient of variation for volatility and volume-to-MCap ratio for liquidity.",
    icon: Shield,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Sentiment Analysis",
    file: "src/lib/sentiment.ts",
    desc: "NLP-inspired sentiment engine. Maps price signals through tanh activation with deterministic noise. Generates social/news feed items with templated posts from Twitter, Reddit, and news sources.",
    icon: MessageSquare,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    title: "AI Chat Engine",
    file: "src/lib/chatEngine.ts",
    desc: "Rule-based knowledge assistant with 15+ topic handlers. Supports context-aware responses about risk scores, volatility, liquidity, market trends, DeFi, DCA strategies, and platform navigation.",
    icon: Bot,
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/10",
  },
  {
    title: "CoinGecko API Client",
    file: "src/services/coingecko.ts",
    desc: "REST API client for live market data. Fetches top 50 coins, historical charts, and coin details. Supports 20 fiat currencies. Graceful fallback to mock data on API failure.",
    icon: Server,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Insight Generator",
    file: "src/lib/insights.ts",
    desc: "Rule-based AI commentary engine. Produces human-readable insights per coin based on volatility, sentiment, price action, liquidity, and overall risk assessment.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Edge Functions (Supabase)",
    file: "supabase/functions/chat/index.ts",
    desc: "Deno-based serverless function. Proxies AI chat requests to Gemini Flash model with CORS handling, rate-limit management, and streaming SSE responses.",
    icon: Server,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

export default function Repository() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (name: string) => {
    setDownloading(name);
    setTimeout(() => {
      const data = {
        project: "CryptoRisk AI",
        file: name,
        generatedAt: new Date().toISOString(),
        note: "This is a simulated download. In production, actual files would be served.",
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.toLowerCase().replace(/\s+/g, "_")}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(null);
    }, 1200);
  };

  const totalFiles = 80;
  const totalSize = "~230 KB";

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="opacity-0 animate-fade-up">
        <h1 className="text-xl font-bold">Repository</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Full project source code, backend algorithms, and downloadable assets
        </p>
      </div>

      {/* Quick stats + actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <FileCode className="h-3.5 w-3.5" /> {totalFiles} files
          </span>
          <span className="flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5" /> {totalSize} source
          </span>
          <span className="flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5" /> main
          </span>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 text-sm"
            onClick={() => window.open(GITHUB_URL, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="h-4 w-4" /> View on GitHub
          </Button>
          <Button className="gap-2 text-sm" onClick={() => handleDownload("Full Project")}>
            <Download className="h-4 w-4" />{" "}
            {downloading === "Full Project" ? "Preparing…" : "Clone / Download"}
          </Button>
        </div>
      </div>

      {/* Backend Code Highlights */}
      <section className="opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" /> Backend & Core Algorithms
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {backendModules.map((m) => (
            <Card
              key={m.file}
              className="glass-card border-border/30 interactive-card cursor-pointer"
              onClick={() => window.open(`${GITHUB_URL}/blob/main/${m.file}`, "_blank", "noopener,noreferrer")}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-9 w-9 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                    <m.icon className={`h-4 w-4 ${m.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{m.title}</p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">{m.file}</p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                  {m.desc}
                </p>
                <div className="mt-3 pt-2 border-t border-border/20 flex items-center gap-1.5">
                  <ExternalLink className="h-3 w-3 text-primary" />
                  <span className="text-[10px] text-primary font-medium">View on GitHub</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Full project tree */}
        <Card className="glass-card border-border/30 opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Project Structure
              <span className="text-[10px] font-normal text-muted-foreground ml-auto">
                click folders to expand
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-xs max-h-[500px] overflow-y-auto pr-1 space-y-0">
              {projectTree.map((node) => (
                <TreeItem key={node.name} node={node} depth={0} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Downloads */}
        <div className="space-y-6">
          <Card className="glass-card border-border/30 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                Downloads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {downloads.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center`}>
                      <d.icon className={`h-4 w-4 ${d.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{d.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {d.ext} · {d.size}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70">{d.desc}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={downloading === d.name}
                    onClick={() => handleDownload(d.name)}
                  >
                    <Download className={`h-4 w-4 ${downloading === d.name ? "animate-pulse" : ""}`} />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tech stack */}
          <Card className="glass-card border-border/30 opacity-0 animate-fade-up" style={{ animationDelay: "240ms" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Frontend", value: "React 18 + TypeScript" },
                  { label: "Styling", value: "Tailwind CSS + shadcn/ui" },
                  { label: "Charts", value: "Recharts" },
                  { label: "State", value: "React Query + Context" },
                  { label: "Build", value: "Vite + SWC" },
                  { label: "Backend", value: "Supabase Edge Functions" },
                  { label: "API", value: "CoinGecko REST API" },
                  { label: "AI Model", value: "Gemini Flash (via proxy)" },
                  { label: "Testing", value: "Vitest + Playwright" },
                  { label: "Runtime", value: "Deno (edge functions)" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex flex-col p-2.5 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                  >
                    <span className="text-[10px] text-muted-foreground">{t.label}</span>
                    <span className="font-medium">{t.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
