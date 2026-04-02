import type { RiskLevel } from "@/types/crypto";
import { Badge } from "@/components/ui/badge";

const config: Record<RiskLevel, { className: string }> = {
  Low: { className: "bg-risk-low/10 text-risk-low border-risk-low/20 hover:bg-risk-low/15" },
  Moderate: { className: "bg-risk-moderate/10 text-risk-moderate border-risk-moderate/20 hover:bg-risk-moderate/15" },
  High: { className: "bg-risk-high/10 text-risk-high border-risk-high/20 hover:bg-risk-high/15" },
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <Badge variant="outline" className={`text-[11px] font-medium ${config[level].className}`}>
      {level}
    </Badge>
  );
}
