import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { CryptoAsset } from "@/types/crypto";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  cryptos: CryptoAsset[];
  isLoading: boolean;
}

const COLORS = {
  Low: "hsl(152, 69%, 41%)",
  Moderate: "hsl(38, 92%, 50%)",
  High: "hsl(0, 72%, 51%)",
};

export function RiskDistributionChart({ cryptos, isLoading }: Props) {
  if (isLoading) return <Skeleton className="h-72 rounded-xl" />;

  const low = cryptos.filter((c) => c.riskLevel === "Low").length;
  const moderate = cryptos.filter((c) => c.riskLevel === "Moderate").length;
  const high = cryptos.filter((c) => c.riskLevel === "High").length;

  const data = [
    { name: "Low", value: low },
    { name: "Moderate", value: moderate },
    { name: "High", value: high },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-card rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold mb-1">Risk Distribution</h3>
      <p className="text-xs text-muted-foreground mb-4">Across {cryptos.length} assets</p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid hsl(220, 13%, 90%)",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[d.name as keyof typeof COLORS] }}
            />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
