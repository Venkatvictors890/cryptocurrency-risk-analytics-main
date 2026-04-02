import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCryptoData } from "@/hooks/useCryptoData";
import { RiskDistributionChart } from "@/components/dashboard/RiskDistributionChart";
import { RiskBreakdownChart } from "@/components/dashboard/RiskBreakdownChart";
import { BarChart3, TrendingUp, Shield, Activity } from "lucide-react";

export default function Analytics() {
  const { data: cryptos, isLoading } = useCryptoData(20);

  const avgRisk = cryptos?.length
    ? Math.round(cryptos.reduce((s, c) => s + c.riskScore, 0) / cryptos.length)
    : 0;
  const avgSentiment = cryptos?.length
    ? (cryptos.reduce((s, c) => s + c.sentimentScore, 0) / cryptos.length).toFixed(2)
    : "0";
  const avgVolatility = cryptos?.length
    ? (cryptos.reduce((s, c) => s + c.volatilityScore, 0) / cryptos.length).toFixed(1)
    : "0";

  const stats = [
    { label: "Avg Risk Score", value: avgRisk, icon: Shield, color: "text-risk-moderate" },
    { label: "Avg Sentiment", value: avgSentiment, icon: TrendingUp, color: "text-primary" },
    { label: "Avg Volatility", value: avgVolatility, icon: Activity, color: "text-chart-2" },
    { label: "Assets Tracked", value: cryptos?.length ?? 0, icon: BarChart3, color: "text-chart-3" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Market-wide risk and sentiment metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-card border-border/30">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold tabular-nums">{isLoading ? "—" : s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {cryptos && <RiskDistributionChart cryptos={cryptos} isLoading={isLoading} />}
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Risk Breakdown (Top 5)</CardTitle>
          </CardHeader>
          <CardContent>
            {cryptos && <RiskBreakdownChart cryptos={cryptos.slice(0, 5)} isLoading={isLoading} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
