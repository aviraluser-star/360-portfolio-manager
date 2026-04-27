import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  badge?: string;
  trend?: number; // positive = up, negative = down, 0 = flat
  trendLabel?: string;
  highlight?: boolean;
  className?: string;
  "data-ocid"?: string;
}

export function MetricCard({
  label,
  value,
  badge,
  trend,
  trendLabel,
  highlight = false,
  className,
  "data-ocid": dataOcid,
}: MetricCardProps) {
  const trendColor =
    trend === undefined
      ? ""
      : trend > 0
        ? "text-emerald-400"
        : trend < 0
          ? "text-destructive"
          : "text-muted-foreground";

  const TrendIcon =
    trend === undefined
      ? null
      : trend > 0
        ? TrendingUp
        : trend < 0
          ? TrendingDown
          : Minus;

  return (
    <Card
      data-ocid={dataOcid}
      className={cn(
        "transition-smooth hover:shadow-md",
        highlight && "border-primary/40 bg-primary/5",
        className,
      )}
    >
      <CardContent className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
          {label}
        </p>
        <p className="font-display text-2xl font-bold text-foreground tabular-nums">
          {value}
        </p>
        {(badge !== undefined || trend !== undefined) && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
            {TrendIcon && trend !== undefined && (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-semibold",
                  trendColor,
                )}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {trendLabel ?? `${trend > 0 ? "+" : ""}${trend.toFixed(2)}%`}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
