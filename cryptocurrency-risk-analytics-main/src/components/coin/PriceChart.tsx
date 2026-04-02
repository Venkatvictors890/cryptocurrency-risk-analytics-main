import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useTheme } from "@/hooks/useTheme";

export function PriceChart({ data }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="glass-card p-5 rounded-xl transition-all duration-200 hover:shadow-lg">
      <h3 className="text-sm font-semibold mb-4">Price Chart</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            stroke={isDark ? "#2a2a2a" : "#e5e7eb"}
            strokeDasharray="5 5"
          />

          <XAxis dataKey="time" stroke={isDark ? "#aaa" : "#555"} />
          <YAxis stroke={isDark ? "#aaa" : "#555"} />

          <Tooltip
            cursor={{ stroke: "transparent" }}
            contentStyle={{
              background: isDark
                ? "rgba(20,20,20,0.85)"
                : "rgba(255,255,255,0.9)",
              borderRadius: "10px",
              backdropFilter: "blur(10px)",
            }}
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}