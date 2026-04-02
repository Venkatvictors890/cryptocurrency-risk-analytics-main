import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import type { CryptoAsset } from "@/types/crypto";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  cryptos: CryptoAsset[];
  isLoading: boolean;
}

const COLORS = {
  Positive: "hsl(152, 69%, 41%)",
  Neutral: "hsl(220, 10%, 46%)",
  Negative: "hsl(0, 72%, 51%)",
};

export function SentimentOverview({ cryptos, isLoading }: Props) {
  if (isLoading) return <Skeleton className="h-72 rounded-xl" />;

  const positive = cryptos.filter((c) => c.sentimentLabel === "Positive").length;
  const neutral = cryptos.filter((c) => c.sentimentLabel === "Neutral").length;
  const negative = cryptos.filter((c) => c.sentimentLabel === "Negative").length;

  const data = [
    { name: "Positive", count: positive },
    { name: "Neutral", count: neutral },
    { name: "Negative", count: negative },
  ];

  return (
    <div className="bg-card rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold mb-1">Sentiment Analysis</h3>
      <p className="text-xs text-muted-foreground mb-4">NLP-based classification</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={32}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid hsl(220, 13%, 90%)",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
