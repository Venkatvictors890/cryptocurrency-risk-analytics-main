import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCryptoData } from "@/hooks/useCryptoData";
import { formatPrice } from "@/lib/format";
import { ArrowUpDown, CheckCircle2 } from "lucide-react";

interface Trade {
  id: number;
  coin: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  time: Date;
}

export default function TradePage() {
  const { data: cryptos } = useCryptoData(10);
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [amount, setAmount] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const coin = cryptos?.find((c) => c.id === selectedCoin);
  const investmentValue = coin ? parseFloat(amount || "0") : 0;
  const coinsReceived = coin && investmentValue > 0 ? investmentValue / coin.currentPrice : 0;

  // Simulated P/L based on 24h change
  const estimatedPL = coin
    ? coinsReceived * coin.currentPrice * (coin.priceChangePercentage24h / 100)
    : 0;

  const executeTrade = () => {
    if (!coin || investmentValue <= 0) return;
    setTrades((prev) => [
      { id: Date.now(), coin: coin.symbol.toUpperCase(), type: tradeType, amount: investmentValue, price: coin.currentPrice, time: new Date() },
      ...prev,
    ]);
    setShowConfirm(true);
    setAmount("");
    setTimeout(() => setShowConfirm(false), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trade Simulator</h1>
        <p className="text-sm text-muted-foreground mt-1">Practice trading without real money</p>
      </div>

      {showConfirm && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary animate-fade-up">
          <CheckCircle2 className="h-4 w-4" />
          Trade executed successfully!
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order panel */}
        <Card className="glass-card border-border/30 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Place Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Select Coin</label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-secondary/50 px-3 text-sm"
              >
                {cryptos?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={tradeType === "buy" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setTradeType("buy")}
              >Buy</Button>
              <Button
                variant={tradeType === "sell" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setTradeType("sell")}
              >Sell</Button>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Amount (USD)</label>
              <Input
                type="number"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-secondary/50"
              />
            </div>

            {coin && investmentValue > 0 && (
              <div className="p-3 rounded-lg bg-secondary/30 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="tabular-nums">{formatPrice(coin.currentPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You {tradeType === "buy" ? "receive" : "sell"}</span>
                  <span className="tabular-nums">{coinsReceived.toFixed(6)} {coin.symbol.toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-t border-border/30 pt-2">
                  <span className="text-muted-foreground">Est. 24h P/L</span>
                  <span className={`tabular-nums font-medium ${estimatedPL >= 0 ? "text-risk-low" : "text-destructive"}`}>
                    {estimatedPL >= 0 ? "+" : ""}{formatPrice(Math.abs(estimatedPL))}
                  </span>
                </div>
              </div>
            )}

            <Button onClick={executeTrade} disabled={investmentValue <= 0} className="w-full gap-2">
              <ArrowUpDown className="h-4 w-4" />
              {tradeType === "buy" ? "Buy" : "Sell"} {coin?.symbol.toUpperCase()}
            </Button>
          </CardContent>
        </Card>

        {/* Trade history */}
        <Card className="glass-card border-border/30 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Trade History</CardTitle>
          </CardHeader>
          <CardContent>
            {trades.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No trades yet. Place your first order!</p>
            ) : (
              <div className="space-y-2">
                {trades.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 text-sm">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.type === "buy" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                        {t.type.toUpperCase()}
                      </span>
                      <span className="font-medium">{t.coin}</span>
                    </div>
                    <div className="text-right">
                      <div className="tabular-nums">{formatPrice(t.amount)}</div>
                      <div className="text-xs text-muted-foreground">@ {formatPrice(t.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
