import { useState } from "react";
import { useCryptoData } from "@/hooks/useCryptoData";
import { Download, Calendar, Database, FileText, Code, FolderTree } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const YEARS = [2024, 2023, 2022, 2021, 2020];

const DOWNLOADABLE_FILES = [
  { name: "Historical Price Data", type: "ZIP", size: "128 MB", icon: Database, desc: "Daily OHLCV data for selected coin/year" },
  { name: "Backend Edge Functions", type: "ZIP", size: "850 KB", icon: Code, desc: "Serverless functions source code" },
  { name: "API Documentation", type: "PDF", size: "2.1 MB", icon: FileText, desc: "REST API reference & integration guide" },
  { name: "Risk Model Documentation", type: "PDF", size: "1.4 MB", icon: FileText, desc: "Weighted risk scoring methodology" },
];

const FILE_STRUCTURE = [
  { name: "price_data/", desc: "Daily price records" },
  { name: "sentiment_scores/", desc: "Hourly sentiment analysis" },
  { name: "news_articles/", desc: "Scraped news with tags" },
  { name: "risk_snapshots/", desc: "Daily risk score history" },
  { name: "README.md", desc: "Data dictionary & schema" },
];

export default function ArchivePage() {
  const { data: cryptos, isLoading } = useCryptoData(20);
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (fileName?: string) => {
    const key = fileName || "main";
    setDownloading(key);
    setTimeout(() => {
      const coin = cryptos?.find((c) => c.id === selectedCoin);
      const data = {
        coin: coin?.name ?? selectedCoin,
        year: selectedYear,
        file: fileName || "Historical Data Archive",
        priceHistory: "Simulated historical price data",
        sentimentData: "Simulated sentiment analysis data",
        newsData: "Simulated news impact data",
        generatedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName ? fileName.toLowerCase().replace(/\s+/g, "_") : selectedCoin}_${selectedYear}_archive.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(null);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="opacity-0 animate-fade-up">
        <h1 className="text-xl font-bold">Data Archive</h1>
        <p className="text-xs text-muted-foreground">Download historical data, source code, and documentation</p>
      </div>

      {/* Main export controls */}
      <div className="glass-card rounded-xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center gap-2 mb-6">
          <Database className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Historical Data Export</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Select Cryptocurrency</label>
            <select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)}
              className="w-full h-10 rounded-lg bg-secondary/50 border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
              {cryptos?.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Select Year
            </label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full h-10 rounded-lg bg-secondary/50 border border-border px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Archive contents */}
        <div className="glass-card rounded-lg p-4 mb-6">
          <p className="text-xs text-muted-foreground mb-2">Archive contents:</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-lg font-bold tabular-nums">365</p>
              <p className="text-[10px] text-muted-foreground">Price Records</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-lg font-bold tabular-nums">8,760</p>
              <p className="text-[10px] text-muted-foreground">Sentiment Data</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-lg font-bold tabular-nums">~2.4K</p>
              <p className="text-[10px] text-muted-foreground">News Articles</p>
            </div>
          </div>
        </div>

        {/* File structure preview */}
        <div className="glass-card rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FolderTree className="h-3.5 w-3.5 text-primary" />
            <p className="text-xs font-medium">File Structure Preview</p>
          </div>
          <div className="font-mono text-xs space-y-1">
            {FILE_STRUCTURE.map(f => (
              <div key={f.name} className="flex items-center gap-2 py-0.5 px-2">
                <span className="text-primary/70">├─</span>
                <span className="text-foreground">{f.name}</span>
                <span className="text-muted-foreground/60 ml-auto text-[10px]">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => handleDownload()} disabled={downloading === "main"}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors active:scale-[0.98] disabled:opacity-50">
          <Download className="h-4 w-4" />
          {downloading === "main" ? "Preparing archive..." : "Download Historical Data"}
        </button>
      </div>

      {/* Additional downloadable files */}
      <div className="glass-card rounded-xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <h3 className="text-sm font-semibold mb-4">Additional Downloads</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOWNLOADABLE_FILES.map(f => (
            <button
              key={f.name}
              onClick={() => handleDownload(f.name)}
              disabled={downloading === f.name}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors text-left disabled:opacity-50"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{f.name}</p>
                <p className="text-[10px] text-muted-foreground">{f.type} · {f.size}</p>
                <p className="text-[10px] text-muted-foreground/60 truncate">{f.desc}</p>
              </div>
              <Download className={`h-3.5 w-3.5 text-muted-foreground shrink-0 ${downloading === f.name ? "animate-pulse" : ""}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Data retention policy */}
      <div className="glass-card rounded-xl p-6 opacity-0 animate-fade-up" style={{ animationDelay: "240ms" }}>
        <h3 className="text-sm font-semibold mb-3">Data Retention Policy</h3>
        <div className="space-y-3">
          {[
            { period: "Last 24 Hours", resolution: "1-minute intervals", storage: "Live Database" },
            { period: "Last 30 Days", resolution: "Hourly summaries", storage: "Hot Storage" },
            { period: "30+ Days", resolution: "Daily summaries", storage: "Cloud Archive" },
          ].map((p) => (
            <div key={p.period} className="flex items-center justify-between bg-secondary/20 rounded-lg p-3">
              <div>
                <p className="text-xs font-medium">{p.period}</p>
                <p className="text-[10px] text-muted-foreground">{p.resolution}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{p.storage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
