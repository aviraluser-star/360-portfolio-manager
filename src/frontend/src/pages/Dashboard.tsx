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
import { useBrokers } from "@/hooks/useBrokers";
import { useHoldings } from "@/hooks/usePortfolio";
import { useRecommendations } from "@/hooks/useRecommendations";
import { formatINR, formatINRCompact, formatPct } from "@/lib/formatters";
import { Action } from "@/types/portfolio";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── Mock chart data: 12 months cumulative returns ────────────────────────────
const CHART_DATA = [
  { month: "May", portfolio: 0, nifty: 0 },
  { month: "Jun", portfolio: 2.1, nifty: 1.4 },
  { month: "Jul", portfolio: 4.8, nifty: 3.2 },
  { month: "Aug", portfolio: 3.2, nifty: 2.1 },
  { month: "Sep", portfolio: 6.5, nifty: 4.0 },
  { month: "Oct", portfolio: 9.3, nifty: 5.8 },
  { month: "Nov", portfolio: 11.7, nifty: 7.2 },
  { month: "Dec", portfolio: 8.4, nifty: 6.1 },
  { month: "Jan", portfolio: 12.9, nifty: 8.5 },
  { month: "Feb", portfolio: 15.6, nifty: 10.1 },
  { month: "Mar", portfolio: 17.2, nifty: 11.3 },
  { month: "Apr", portfolio: 18.93, nifty: 12.4 },
];

const CASH_BALANCE = 87_500;

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value > 0 ? "+" : ""}
          {p.value.toFixed(2)}%
        </p>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = usePortfolioSummary();
  const { data: sharpe } = useSharpeRatio();
  const { data: volatility } = useVolatility();
  const { data: alerts } = useRebalanceAlerts();
  const { data: benchmark } = useBenchmark();
  const { data: holdings } = useHoldings();
  const { data: brokers } = useBrokers();
  const { data: recommendations } = useRecommendations();

  if (summaryLoading) return <PageLoader />;
  if (summaryError) return <ErrorState />;

  const actionColors: Record<Action, string> = {
    [Action.buy]: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    [Action.hold]: "bg-accent/15 text-accent border-accent/30",
    [Action.sell]: "bg-destructive/15 text-destructive border-destructive/30",
  };

  const holdingsCount = holdings?.length ?? 0;
  const brokersCount = brokers?.length ?? 0;

  return (
    <div className="space-y-6" data-ocid="dashboard.page">
      {/* ── Rebalancing Alert Banner ───────────────────────────────────── */}
      {alerts && alerts.length > 0 && (
        <div
          className="alert-banner flex items-start gap-3"
          data-ocid="dashboard.rebalance_alert"
        >
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-destructive">
              {alerts.length} Rebalancing{" "}
              {alerts.length === 1 ? "Alert" : "Alerts"} Detected
            </p>
            <p className="text-xs text-foreground/70 mt-0.5">
              {alerts
                .map(
                  (a) =>
                    `${a.ticker} drifted ${a.driftPct > 0 ? "+" : ""}${a.driftPct.toFixed(1)}%`,
                )
                .join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* ── Summary Metric Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          data-ocid="dashboard.total_value.card"
          label="Portfolio Value"
          value={formatINRCompact(summary?.totalValue ?? 0)}
          badge="Live"
          trend={summary?.gainLossPct ?? 0}
          trendLabel={formatPct(summary?.gainLossPct ?? 0)}
          highlight
        />
        <MetricCard
          data-ocid="dashboard.gain_loss.card"
          label="Total Gain / Loss"
          value={formatINR(summary?.gainLossAmt ?? 0, 0)}
          trend={summary?.gainLossPct ?? 0}
          trendLabel={formatPct(summary?.gainLossPct ?? 0)}
        />
        <MetricCard
          data-ocid="dashboard.sharpe.card"
          label="Sharpe Ratio"
          value={(sharpe ?? 0).toFixed(2)}
          badge="Risk-Adjusted"
        />
        <MetricCard
          data-ocid="dashboard.volatility.card"
          label="Volatility"
          value={`${(volatility ?? 0).toFixed(1)}%`}
          badge="Ann."
        />
      </div>

      {/* ── Quick Stats Row ────────────────────────────────────────────── */}
      <div
        className="grid grid-cols-3 gap-4"
        data-ocid="dashboard.quick_stats.section"
      >
        <div className="flex items-center gap-3 bg-card rounded-lg border border-border px-4 py-3">
          <div className="p-2 rounded-md bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Holdings</p>
            <p
              className="font-display text-xl font-bold text-foreground"
              data-ocid="dashboard.holdings_count"
            >
              {holdingsCount}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-card rounded-lg border border-border px-4 py-3">
          <div className="p-2 rounded-md bg-accent/10">
            <BarChart3 className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Brokers</p>
            <p
              className="font-display text-xl font-bold text-foreground"
              data-ocid="dashboard.brokers_count"
            >
              {brokersCount}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-card rounded-lg border border-border px-4 py-3">
          <div className="p-2 rounded-md bg-emerald-500/10">
            <Wallet className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cash Balance</p>
            <p
              className="font-display text-xl font-bold text-foreground"
              data-ocid="dashboard.cash_balance"
            >
              {formatINRCompact(CASH_BALANCE)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Cumulative Returns Chart ───────────────────────────────────── */}
      <Card data-ocid="dashboard.returns_chart.card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Cumulative Returns — 12 Months
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Portfolio vs NIFTY 50 Benchmark
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={CHART_DATA}
                margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 11,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v}%`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  formatter={(value: string) => (
                    <span style={{ color: "oklch(var(--muted-foreground))" }}>
                      {value}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  name="Portfolio"
                  stroke="oklch(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "oklch(var(--primary))" }}
                />
                <Line
                  type="monotone"
                  dataKey="nifty"
                  name="NIFTY 50"
                  stroke="oklch(var(--accent))"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={false}
                  activeDot={{ r: 4, fill: "oklch(var(--accent))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ── Benchmark Comparison ──────────────────────────────────────── */}
      {benchmark && (
        <Card data-ocid="dashboard.benchmark.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              Performance vs Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex-1 min-w-[120px]">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Portfolio YTD
                </p>
                <div className="flex items-end gap-1.5">
                  <p
                    className={`font-display text-3xl font-bold tabular-nums ${benchmark.portfolioYtdReturn >= 0 ? "text-emerald-400" : "text-destructive"}`}
                  >
                    {formatPct(benchmark.portfolioYtdReturn)}
                  </p>
                  {benchmark.portfolioYtdReturn >= 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-emerald-400 mb-1" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-destructive mb-1" />
                  )}
                </div>
              </div>

              <div className="w-px h-12 bg-border" />

              <div className="flex-1 min-w-[120px]">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  NIFTY 50 YTD
                </p>
                <div className="flex items-end gap-1.5">
                  <p className="font-display text-3xl font-bold tabular-nums text-muted-foreground">
                    {formatPct(benchmark.sp500YtdReturn)}
                  </p>
                </div>
              </div>

              <div className="w-px h-12 bg-border" />

              <div className="flex items-center gap-2 ml-auto">
                {benchmark.portfolioYtdReturn > benchmark.sp500YtdReturn ? (
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-4 py-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Alpha</p>
                      <p className="text-sm font-bold text-emerald-400">
                        +
                        {(
                          benchmark.portfolioYtdReturn -
                          benchmark.sp500YtdReturn
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/25 rounded-lg px-4 py-2">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Underperformance
                      </p>
                      <p className="text-sm font-bold text-destructive">
                        {(
                          benchmark.portfolioYtdReturn -
                          benchmark.sp500YtdReturn
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Rebalancing Alerts Table ───────────────────────────────────── */}
      {alerts && alerts.length > 0 && (
        <Card data-ocid="dashboard.rebalance_table.card">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <CardTitle className="text-sm font-semibold text-foreground">
                Rebalancing Alerts
              </CardTitle>
              <Badge className="metric-badge ml-auto">
                {alerts.length} alert{alerts.length > 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="data-table">
              <div className="grid grid-cols-4 text-xs text-muted-foreground uppercase tracking-wide pb-2 border-b border-border">
                <span>Ticker</span>
                <span className="text-right">Current %</span>
                <span className="text-right">Target %</span>
                <span className="text-right">Drift</span>
              </div>
              {alerts.map((a, i) => (
                <div
                  key={a.ticker}
                  data-ocid={`dashboard.rebalance.item.${i + 1}`}
                  className="grid grid-cols-4 items-center py-2.5 border-b border-border last:border-0"
                >
                  <span className="font-semibold text-sm text-foreground">
                    {a.ticker}
                  </span>
                  <span className="text-right tabular-nums text-sm text-foreground">
                    {a.currentPct.toFixed(1)}%
                  </span>
                  <span className="text-right tabular-nums text-sm text-muted-foreground">
                    {a.targetPct.toFixed(1)}%
                  </span>
                  <div className="flex justify-end">
                    <Badge
                      className={`text-xs font-semibold border tabular-nums ${
                        a.driftPct > 0
                          ? "bg-accent/15 text-accent border-accent/30"
                          : "bg-primary/15 text-primary border-primary/30"
                      }`}
                    >
                      {a.driftPct > 0 ? "+" : ""}
                      {a.driftPct.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Holdings + Recommendations Row ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Holdings preview */}
        <Card data-ocid="dashboard.holdings.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              Your Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!holdings || holdings.length === 0 ? (
              <p
                className="text-sm text-muted-foreground py-4 text-center"
                data-ocid="dashboard.holdings.empty_state"
              >
                No holdings yet. Add your first position.
              </p>
            ) : (
              <div className="space-y-0.5">
                {holdings.slice(0, 5).map((h, i) => (
                  <div
                    key={String(h.id)}
                    data-ocid={`dashboard.holding.item.${i + 1}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {h.ticker}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {h.companyName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold">
                        {formatINR(h.purchasePrice * h.quantity, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {h.quantity} units
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations preview */}
        <Card data-ocid="dashboard.recommendations.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">
              Daily Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!recommendations || recommendations.length === 0 ? (
              <p
                className="text-sm text-muted-foreground py-4 text-center"
                data-ocid="dashboard.recommendations.empty_state"
              >
                No recommendations today.
              </p>
            ) : (
              <div className="space-y-0.5">
                {recommendations.slice(0, 5).map((r, i) => (
                  <div
                    key={r.ticker}
                    data-ocid={`dashboard.recommendation.item.${i + 1}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {r.ticker}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatINR(r.currentPrice)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs tabular-nums ${r.expectedReturn >= 0 ? "text-emerald-400" : "text-destructive"}`}
                      >
                        {r.expectedReturn > 0 ? "+" : ""}
                        {r.expectedReturn.toFixed(1)}%
                      </span>
                      <Badge
                        className={`text-xs border ${actionColors[r.action]}`}
                      >
                        {r.action.toUpperCase()}
                      </Badge>
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
