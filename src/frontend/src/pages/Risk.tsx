import { ErrorState, PageLoader } from "@/components/LoadingSpinner";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useBenchmark,
  usePortfolioSummary,
  useRebalanceAlerts,
  useSharpeRatio,
  useVolatility,
} from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";
import { AlertTriangle, BarChart3, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── Mock historical volatility data (6 months rolling) ─────────────────────
const VOLATILITY_HISTORY = [
  { month: "Nov", vol: 21.2 },
  { month: "Dec", vol: 24.8 },
  { month: "Jan", vol: 22.1 },
  { month: "Feb", vol: 19.6 },
  { month: "Mar", vol: 20.3 },
  { month: "Apr", vol: 18.4 },
];

// ── Risk Gauge (SVG half-circle) ────────────────────────────────────────────
interface RiskGaugeProps {
  volatility: number;
}

function RiskGauge({ volatility }: RiskGaugeProps) {
  // Volatility buckets: <15 Low, 15-25 Moderate, >25 High
  const level = volatility < 15 ? "Low" : volatility < 25 ? "Moderate" : "High";
  const levelIndex = volatility < 15 ? 0 : volatility < 25 ? 1 : 2;

  // Map volatility (0–40) to arc angle (0–180 degrees)
  const clampedVol = Math.min(Math.max(volatility, 0), 40);
  const angleDeg = (clampedVol / 40) * 180;
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;

  const cx = 100;
  const cy = 90;
  const r = 70;

  // Needle tip
  const tipX = cx + r * Math.cos(angleRad);
  const tipY = cy + r * Math.sin(angleRad);

  const gaugeColors = {
    low: "oklch(0.765 0.177 162.48)",
    moderate: "oklch(0.828 0.189 84.43)",
    high: "oklch(0.704 0.191 22.18)",
  } as const;
  const levelColorMap = [
    gaugeColors.low,
    gaugeColors.moderate,
    gaugeColors.high,
  ] as const;
  const levelColor = levelColorMap[levelIndex];
  const levelLabels = ["Low Risk", "Moderate Risk", "High Risk"];

  // Arc segments: each 60° of 180° total
  function arcPath(startDeg: number, endDeg: number) {
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 200 110"
        className="w-52 h-28"
        role="img"
        aria-label={`Risk gauge: ${level} risk`}
      >
        <title>{`Portfolio risk level: ${level}`}</title>
        {/* Background arc */}
        <path
          d={arcPath(0, 180)}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Low segment */}
        <path
          d={arcPath(0, 60)}
          fill="none"
          stroke={gaugeColors.low}
          strokeWidth="14"
          opacity="0.85"
        />
        {/* Moderate segment */}
        <path
          d={arcPath(60, 120)}
          fill="none"
          stroke={gaugeColors.moderate}
          strokeWidth="14"
          opacity="0.85"
        />
        {/* High segment */}
        <path
          d={arcPath(120, 180)}
          fill="none"
          stroke={gaugeColors.high}
          strokeWidth="14"
          opacity="0.85"
        />
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={tipX}
          y2={tipY}
          stroke={levelColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill={levelColor} />
        {/* Volatility value */}
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="currentColor"
          className="fill-foreground font-mono"
        >
          {volatility.toFixed(1)}%
        </text>
      </svg>
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: levelColor }}
        />
        <span className="font-semibold text-sm" style={{ color: levelColor }}>
          {levelLabels[levelIndex]}
        </span>
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          Low (&lt;15%)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
          Moderate
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
          High (&gt;25%)
        </span>
      </div>
    </div>
  );
}

// ── Benchmark Bar Chart ─────────────────────────────────────────────────────
interface BenchmarkBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

function BenchmarkBar({ label, value, max, color }: BenchmarkBarProps) {
  const pct = Math.min(Math.abs(value) / Math.max(max, 1), 1) * 100;
  const isPositive = value >= 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span
          className={cn(
            "font-mono font-bold tabular-nums",
            isPositive ? "text-emerald-400" : "text-destructive",
          )}
        >
          {isPositive ? "+" : ""}
          {value.toFixed(2)}%
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Custom Recharts Tooltip ─────────────────────────────────────────────────
function VolTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-md text-sm">
      <p className="text-muted-foreground mb-0.5">{label}</p>
      <p className="font-mono font-bold text-primary">
        {payload[0].value.toFixed(1)}% vol
      </p>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export function RiskPage() {
  const { data: summary, isLoading, isError } = usePortfolioSummary();
  const { data: sharpe } = useSharpeRatio();
  const { data: volatility } = useVolatility();
  const { data: alerts } = useRebalanceAlerts();
  const { data: benchmark } = useBenchmark();

  if (isLoading) return <PageLoader />;
  if (isError) return <ErrorState />;

  const sharpeVal = sharpe ?? 0;
  const volVal = volatility ?? 18.4;

  // Sharpe interpretation: >1 Good, 0-1 Fair, <0 Poor
  const { sharpeLabel, sharpeBadgeClass } =
    sharpeVal >= 1
      ? {
          sharpeLabel: "Good",
          sharpeBadgeClass:
            "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        }
      : sharpeVal >= 0
        ? {
            sharpeLabel: "Fair",
            sharpeBadgeClass: "bg-accent/15 text-accent border-accent/30",
          }
        : {
            sharpeLabel: "Poor",
            sharpeBadgeClass:
              "bg-destructive/15 text-destructive border-destructive/30",
          };

  const alertCount =
    alerts?.filter((a) => Math.abs(a.driftPct) > 5).length ?? 0;

  const benchMax =
    Math.max(
      Math.abs(benchmark?.portfolioYtdReturn ?? 0),
      Math.abs(benchmark?.sp500YtdReturn ?? 0),
      1,
    ) * 1.15;

  return (
    <div className="space-y-6" data-ocid="risk.page">
      {/* Page header */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Risk Metrics
        </h2>
        <p className="text-sm text-muted-foreground">
          Portfolio risk analysis, rebalancing alerts &amp; benchmark comparison
        </p>
      </div>

      {/* ── Top metric cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          data-ocid="risk.sharpe.card"
          label="Sharpe Ratio"
          value={sharpeVal.toFixed(2)}
          badge={sharpeLabel}
          highlight
        />
        <MetricCard
          data-ocid="risk.volatility.card"
          label="Annual Volatility"
          value={`${volVal.toFixed(1)}%`}
          badge="Annualized"
        />
        <MetricCard
          data-ocid="risk.beta.card"
          label="Portfolio Beta"
          value="0.85"
          badge="vs NIFTY 50"
        />
      </div>

      {/* ── Sharpe detail + Risk Gauge row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sharpe detail card */}
        <Card data-ocid="risk.sharpe_detail.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Sharpe Ratio Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "font-display text-5xl font-bold tabular-nums",
                  sharpeVal >= 1
                    ? "text-emerald-400"
                    : sharpeVal >= 0
                      ? "text-accent"
                      : "text-destructive",
                )}
              >
                {sharpeVal.toFixed(2)}
              </span>
              <div className="space-y-1">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border",
                    sharpeBadgeClass,
                  )}
                  data-ocid="risk.sharpe.interpretation_badge"
                >
                  {sharpeLabel}
                </span>
                <p className="text-xs text-muted-foreground">
                  Risk-adjusted return per unit of volatility
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-sm">
              <div
                className={cn(
                  "text-center p-2.5 rounded-md transition-smooth",
                  sharpeVal < 0
                    ? "bg-destructive/15 ring-1 ring-destructive/40"
                    : "bg-destructive/8",
                )}
              >
                <p className="font-mono font-bold text-destructive">&lt; 0</p>
                <p className="text-xs text-muted-foreground mt-0.5">Poor</p>
              </div>
              <div
                className={cn(
                  "text-center p-2.5 rounded-md transition-smooth",
                  sharpeVal >= 0 && sharpeVal < 1
                    ? "bg-accent/15 ring-1 ring-accent/40"
                    : "bg-accent/8",
                )}
              >
                <p className="font-mono font-bold text-accent">0 – 1</p>
                <p className="text-xs text-muted-foreground mt-0.5">Fair</p>
              </div>
              <div
                className={cn(
                  "text-center p-2.5 rounded-md transition-smooth",
                  sharpeVal >= 1
                    ? "bg-emerald-500/15 ring-1 ring-emerald-500/40"
                    : "bg-emerald-500/8",
                )}
              >
                <p className="font-mono font-bold text-emerald-400">&gt; 1</p>
                <p className="text-xs text-muted-foreground mt-0.5">Good</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Gauge */}
        <Card data-ocid="risk.gauge.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Portfolio Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pt-2 pb-4">
            <RiskGauge volatility={volVal} />
          </CardContent>
        </Card>
      </div>

      {/* ── Historical Volatility Chart ── */}
      <Card data-ocid="risk.volatility_chart.card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            6-Month Rolling Volatility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={VOLATILITY_HISTORY}
              margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }}
                tickFormatter={(v: number) => `${v}%`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<VolTooltip />} />
              <Line
                type="monotone"
                dataKey="vol"
                stroke="oklch(var(--primary))"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "oklch(var(--primary))", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Benchmark Comparison ── */}
      <Card data-ocid="risk.benchmark.card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            YTD Benchmark Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-2">
          <BenchmarkBar
            label="Your Portfolio"
            value={benchmark?.portfolioYtdReturn ?? 0}
            max={benchMax}
            color="oklch(var(--primary))"
          />
          <BenchmarkBar
            label="NIFTY 50 Index"
            value={benchmark?.sp500YtdReturn ?? 0}
            max={benchMax}
            color="oklch(var(--muted-foreground))"
          />
          {(benchmark?.portfolioYtdReturn ?? 0) >
            (benchmark?.sp500YtdReturn ?? 0) && (
            <p className="text-xs text-emerald-400 font-medium">
              ✓ Outperforming NIFTY 50 by{" "}
              {(
                (benchmark?.portfolioYtdReturn ?? 0) -
                (benchmark?.sp500YtdReturn ?? 0)
              ).toFixed(2)}
              % YTD
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Rebalancing Alerts ── */}
      <Card data-ocid="risk.rebalance.card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-accent" />
            Rebalancing Alerts
            {alertCount > 0 && (
              <Badge
                className="bg-accent/15 text-accent border border-accent/30 ml-1 text-xs font-bold"
                data-ocid="risk.alert_count.badge"
              >
                {alertCount} need{alertCount === 1 ? "s" : ""} action
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!alerts || alerts.length === 0 ? (
            <p
              className="text-sm text-muted-foreground py-6 text-center"
              data-ocid="risk.rebalance.empty_state"
            >
              All positions are within target allocation bands. No rebalancing
              needed.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full data-table text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                    <th className="pb-2.5 text-left font-medium">Ticker</th>
                    <th className="pb-2.5 text-left font-medium">
                      Asset Class
                    </th>
                    <th className="pb-2.5 text-right font-medium">Current %</th>
                    <th className="pb-2.5 text-right font-medium">Target %</th>
                    <th className="pb-2.5 text-right font-medium">Drift</th>
                    <th className="pb-2.5 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((a, i) => {
                    const isDrifted = Math.abs(a.driftPct) > 5;
                    return (
                      <tr
                        key={a.ticker}
                        data-ocid={`risk.alert.item.${i + 1}`}
                        className={cn(
                          "border-b border-border/50 transition-colors",
                          isDrifted
                            ? "bg-accent/8 hover:bg-accent/12"
                            : "hover:bg-muted/40",
                        )}
                      >
                        <td className="py-3 font-semibold text-primary">
                          {a.ticker}
                        </td>
                        <td className="py-3">
                          <Badge variant="secondary" className="text-xs">
                            {a.assetClass}
                          </Badge>
                        </td>
                        <td className="py-3 text-right font-mono">
                          {a.currentPct.toFixed(1)}%
                        </td>
                        <td className="py-3 text-right font-mono text-muted-foreground">
                          {a.targetPct.toFixed(1)}%
                        </td>
                        <td
                          className={cn(
                            "py-3 text-right font-mono font-bold",
                            isDrifted ? "text-accent" : "text-emerald-400",
                          )}
                        >
                          {a.driftPct > 0 ? "+" : ""}
                          {a.driftPct.toFixed(1)}%
                        </td>
                        <td className="py-3 text-center">
                          {isDrifted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30">
                              <AlertTriangle className="h-3 w-3" />
                              Rebalance
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              On Track
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Portfolio value summary ── */}
      {summary && (
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            data-ocid="risk.total_investment.card"
            label="Total Invested"
            value={`₹${(summary.totalInvestment / 1_00_000).toFixed(2)}L`}
          />
          <MetricCard
            data-ocid="risk.current_value.card"
            label="Current Value"
            value={`₹${(summary.totalValue / 1_00_000).toFixed(2)}L`}
            trend={summary.gainLossPct}
          />
        </div>
      )}
    </div>
  );
}
