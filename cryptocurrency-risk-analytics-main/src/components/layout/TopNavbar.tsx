import { Search, Activity, Wifi, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCurrency } from "@/hooks/useCurrencyStore";
import { SUPPORTED_CURRENCIES } from "@/services/coingecko";

interface TopNavbarProps {
  onExitClick?: () => void;
}

export function TopNavbar({ onExitClick }: TopNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { currency, setCurrencyByCode } = useCurrency();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/markets?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-14 flex items-center border-b border-border/50 px-4 glass sticky top-0 z-30">
      <SidebarTrigger className="mr-4 text-muted-foreground hover:text-foreground transition-colors" />

      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-6">
        <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center glow-sm">
          <Activity className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-bold tracking-tight hidden sm:block">
          <span className="gradient-text">CryptoRisk</span>
          <span className="text-muted-foreground font-normal ml-1">AI</span>
        </span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search coins, markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-secondary/50 border-border/50 text-sm placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-primary/20"
          />
        </div>
      </form>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-3">
        {/* Currency selector */}
        <select
          value={currency.code}
          onChange={(e) => setCurrencyByCode(e.target.value)}
          className="h-8 rounded-lg bg-secondary/50 border border-border px-2 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary hidden sm:block"
        >
          {SUPPORTED_CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.symbol} {c.code.toUpperCase()}</option>
          ))}
        </select>

        <ThemeToggle />

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
          <Wifi className="h-3 w-3 text-primary animate-pulse-gentle" />
          <span className="text-[11px] font-medium text-primary/80">Live</span>
        </div>

        {onExitClick && (
          <button
            onClick={onExitClick}
            className="h-8 w-8 rounded-lg bg-secondary/50 border border-border flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all duration-200 active:scale-95"
            title="Exit to Landing"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}
