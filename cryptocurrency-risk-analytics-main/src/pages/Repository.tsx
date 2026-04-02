import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, FileText, Download, ExternalLink, Database, HardDrive, FileCode, Eye } from "lucide-react";
import { useState } from "react";

const structure = [
  { name: "frontend/", type: "dir", desc: "React + TypeScript application", children: [
    { name: "  src/components/", desc: "Reusable UI components" },
    { name: "  src/pages/", desc: "Route page components" },
    { name: "  src/services/", desc: "API integration layer" },
    { name: "  src/lib/", desc: "Utility functions & algorithms" },
    { name: "  src/hooks/", desc: "Custom React hooks" },
    { name: "  src/types/", desc: "TypeScript type definitions" },
  ]},
  { name: "backend/", type: "dir", desc: "Edge functions & API", children: [
    { name: "  supabase/functions/", desc: "Serverless edge functions" },
  ]},
  { name: "database/", type: "dir", desc: "Migration scripts & schemas", children: [
    { name: "  migrations/", desc: "SQL migration files" },
  ]},
  { name: "archive-data/", type: "dir", desc: "Historical data exports", children: [] },
  { name: "assets/", type: "dir", desc: "Images, icons, static files", children: [] },
];

const downloads = [
  { name: "Full Source Code", ext: "ZIP", size: "4.2 MB", icon: FileCode, desc: "Complete project source with all components" },
  { name: "Historical Price Data", ext: "ZIP", size: "128 MB", icon: Database, desc: "7-day sparkline data for top 20 coins" },
  { name: "Project Documentation", ext: "PDF", size: "2.1 MB", icon: FileText, desc: "Architecture docs, API reference, setup guide" },
  { name: "Sample Dataset", ext: "CSV", size: "45 MB", icon: HardDrive, desc: "Crypto market data with risk & sentiment scores" },
];

export default function Repository() {
  const [expandedDir, setExpandedDir] = useState<string | null>(null);
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

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="opacity-0 animate-fade-up">
        <h1 className="text-xl font-bold">Repository</h1>
        <p className="text-xs text-muted-foreground mt-1">Project structure, source code, and downloadable assets</p>
      </div>

      <div className="flex gap-3 opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <Button variant="outline" className="gap-2 text-sm">
          <ExternalLink className="h-4 w-4" /> View on GitHub
        </Button>
        <Button className="gap-2 text-sm" onClick={() => handleDownload("Full Project")}>
          <Download className="h-4 w-4" /> {downloading === "Full Project" ? "Preparing…" : "Download Full Project"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project structure with expandable dirs */}
        <Card className="glass-card border-border/30 opacity-0 animate-fade-up" style={{ animationDelay: "120ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Project Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-xs space-y-0.5">
              {structure.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() => setExpandedDir(expandedDir === item.name ? null : item.name)}
                    className="w-full flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-secondary/40 transition-colors text-left"
                  >
                    <Folder className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-foreground font-medium">{item.name}</span>
                    <span className="text-muted-foreground ml-auto text-[10px]">{item.desc}</span>
                  </button>
                  {expandedDir === item.name && item.children && item.children.length > 0 && (
                    <div className="ml-4 border-l border-border/50 pl-2 space-y-0.5">
                      {item.children.map((child) => (
                        <div key={child.name} className="flex items-center gap-2 py-1 px-2 text-muted-foreground">
                          <FileText className="h-3 w-3 shrink-0" />
                          <span>{child.name}</span>
                          <span className="ml-auto text-[10px]">{child.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Downloads */}
        <Card className="glass-card border-border/30 opacity-0 animate-fade-up" style={{ animationDelay: "180ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              Downloads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {downloads.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <d.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d.ext} · {d.size}</p>
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
      </div>
    </div>
  );
}
