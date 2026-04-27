import { c as createLucideIcon, j as jsxRuntimeExports, P as PageLoader, E as ErrorState, T as TrendingUp } from "./index-BqnJ5REX.js";
import { T as TriangleAlert, M as MetricCard } from "./MetricCard-Cmi-Uvsq.js";
import { A as Action, C as Card, a as CardHeader, b as CardTitle, c as CardContent, B as Badge } from "./backend-lKmLgprF.js";
import { u as usePortfolioSummary, a as useSharpeRatio, b as useVolatility, c as useRebalanceAlerts, d as useBenchmark, C as ChartColumn, R as ResponsiveContainer, L as LineChart, e as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, f as Legend, g as Line } from "./LineChart-VLh_r1XO.js";
import { u as useBrokers } from "./useBrokers-ByaKxlr9.js";
import { u as useHoldings } from "./usePortfolio-Dl_d3Bef.js";
import { u as useRecommendations } from "./useRecommendations-CJZne3NU.js";
import { f as formatPct, a as formatINRCompact, b as formatINR } from "./formatters-hOzKO6p6.js";
import { T as TrendingDown } from "./trending-down-Cv13Lw9A.js";
import "./useMutation-Dxa2nhZ8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m7 7 10 10", key: "1fmybs" }],
  ["path", { d: "M17 7v10H7", key: "6fjiku" }]
];
const ArrowDownRight = createLucideIcon("arrow-down-right", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
];
const Wallet = createLucideIcon("wallet", __iconNode);
const CHART_DATA = [
  { month: "May", portfolio: 0, nifty: 0 },
  { month: "Jun", portfolio: 2.1, nifty: 1.4 },
  { month: "Jul", portfolio: 4.8, nifty: 3.2 },
  { month: "Aug", portfolio: 3.2, nifty: 2.1 },
  { month: "Sep", portfolio: 6.5, nifty: 4 },
  { month: "Oct", portfolio: 9.3, nifty: 5.8 },
  { month: "Nov", portfolio: 11.7, nifty: 7.2 },
  { month: "Dec", portfolio: 8.4, nifty: 6.1 },
  { month: "Jan", portfolio: 12.9, nifty: 8.5 },
  { month: "Feb", portfolio: 15.6, nifty: 10.1 },
  { month: "Mar", portfolio: 17.2, nifty: 11.3 },
  { month: "Apr", portfolio: 18.93, nifty: 12.4 }
];
const CASH_BALANCE = 87500;
function ChartTooltip({ active, payload, label }) {
  if (!active || !(payload == null ? void 0 : payload.length)) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-md px-3 py-2 shadow-lg text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: label }),
    payload.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: p.color }, children: [
      p.name,
      ": ",
      p.value > 0 ? "+" : "",
      p.value.toFixed(2),
      "%"
    ] }, p.name))
  ] });
}
function DashboardPage() {
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError
  } = usePortfolioSummary();
  const { data: sharpe } = useSharpeRatio();
  const { data: volatility } = useVolatility();
  const { data: alerts } = useRebalanceAlerts();
  const { data: benchmark } = useBenchmark();
  const { data: holdings } = useHoldings();
  const { data: brokers } = useBrokers();
  const { data: recommendations } = useRecommendations();
  if (summaryLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  if (summaryError) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, {});
  const actionColors = {
    [Action.buy]: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    [Action.hold]: "bg-accent/15 text-accent border-accent/30",
    [Action.sell]: "bg-destructive/15 text-destructive border-destructive/30"
  };
  const holdingsCount = (holdings == null ? void 0 : holdings.length) ?? 0;
  const brokersCount = (brokers == null ? void 0 : brokers.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "dashboard.page", children: [
    alerts && alerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "alert-banner flex items-start gap-3",
        "data-ocid": "dashboard.rebalance_alert",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm text-destructive", children: [
              alerts.length,
              " Rebalancing",
              " ",
              alerts.length === 1 ? "Alert" : "Alerts",
              " Detected"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/70 mt-0.5", children: alerts.map(
              (a) => `${a.ticker} drifted ${a.driftPct > 0 ? "+" : ""}${a.driftPct.toFixed(1)}%`
            ).join(" · ") })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "dashboard.total_value.card",
          label: "Portfolio Value",
          value: formatINRCompact((summary == null ? void 0 : summary.totalValue) ?? 0),
          badge: "Live",
          trend: (summary == null ? void 0 : summary.gainLossPct) ?? 0,
          trendLabel: formatPct((summary == null ? void 0 : summary.gainLossPct) ?? 0),
          highlight: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "dashboard.gain_loss.card",
          label: "Total Gain / Loss",
          value: formatINR((summary == null ? void 0 : summary.gainLossAmt) ?? 0, 0),
          trend: (summary == null ? void 0 : summary.gainLossPct) ?? 0,
          trendLabel: formatPct((summary == null ? void 0 : summary.gainLossPct) ?? 0)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "dashboard.sharpe.card",
          label: "Sharpe Ratio",
          value: (sharpe ?? 0).toFixed(2),
          badge: "Risk-Adjusted"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "dashboard.volatility.card",
          label: "Volatility",
          value: `${(volatility ?? 0).toFixed(1)}%`,
          badge: "Ann."
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-3 gap-4",
        "data-ocid": "dashboard.quick_stats.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-card rounded-lg border border-border px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-md bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Holdings" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-display text-xl font-bold text-foreground",
                  "data-ocid": "dashboard.holdings_count",
                  children: holdingsCount
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-card rounded-lg border border-border px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-md bg-accent/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-accent" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Brokers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-display text-xl font-bold text-foreground",
                  "data-ocid": "dashboard.brokers_count",
                  children: brokersCount
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-card rounded-lg border border-border px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-md bg-emerald-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-emerald-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Cash Balance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-display text-xl font-bold text-foreground",
                  "data-ocid": "dashboard.cash_balance",
                  children: formatINRCompact(CASH_BALANCE)
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "dashboard.returns_chart.card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Cumulative Returns — 12 Months" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Portfolio vs NIFTY 50 Benchmark" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        LineChart,
        {
          data: CHART_DATA,
          margin: { top: 4, right: 8, left: -8, bottom: 0 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CartesianGrid,
              {
                strokeDasharray: "3 3",
                stroke: "oklch(var(--border))",
                opacity: 0.5
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                dataKey: "month",
                tick: {
                  fontSize: 11,
                  fill: "oklch(var(--muted-foreground))"
                },
                axisLine: false,
                tickLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                tick: {
                  fontSize: 11,
                  fill: "oklch(var(--muted-foreground))"
                },
                axisLine: false,
                tickLine: false,
                tickFormatter: (v) => `${v > 0 ? "+" : ""}${v}%`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltip, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Legend,
              {
                wrapperStyle: { fontSize: 11, paddingTop: 8 },
                formatter: (value) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(var(--muted-foreground))" }, children: value })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Line,
              {
                type: "monotone",
                dataKey: "portfolio",
                name: "Portfolio",
                stroke: "oklch(var(--primary))",
                strokeWidth: 2,
                dot: false,
                activeDot: { r: 4, fill: "oklch(var(--primary))" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Line,
              {
                type: "monotone",
                dataKey: "nifty",
                name: "NIFTY 50",
                stroke: "oklch(var(--accent))",
                strokeWidth: 2,
                strokeDasharray: "5 3",
                dot: false,
                activeDot: { r: 4, fill: "oklch(var(--accent))" }
              }
            )
          ]
        }
      ) }) }) })
    ] }),
    benchmark && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "dashboard.benchmark.card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Performance vs Benchmark" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[120px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "Portfolio YTD" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-display text-3xl font-bold tabular-nums ${benchmark.portfolioYtdReturn >= 0 ? "text-emerald-400" : "text-destructive"}`,
                children: formatPct(benchmark.portfolioYtdReturn)
              }
            ),
            benchmark.portfolioYtdReturn >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-5 w-5 text-emerald-400 mb-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-5 w-5 text-destructive mb-1" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-12 bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[120px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide mb-1", children: "NIFTY 50 YTD" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl font-bold tabular-nums text-muted-foreground", children: formatPct(benchmark.sp500YtdReturn) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-12 bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 ml-auto", children: benchmark.portfolioYtdReturn > benchmark.sp500YtdReturn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-emerald-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Alpha" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-emerald-400", children: [
              "+",
              (benchmark.portfolioYtdReturn - benchmark.sp500YtdReturn).toFixed(2),
              "%"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-destructive/10 border border-destructive/25 rounded-lg px-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-4 w-4 text-destructive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Underperformance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-destructive", children: [
              (benchmark.portfolioYtdReturn - benchmark.sp500YtdReturn).toFixed(2),
              "%"
            ] })
          ] })
        ] }) })
      ] }) })
    ] }),
    alerts && alerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "dashboard.rebalance_table.card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Rebalancing Alerts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "metric-badge ml-auto", children: [
          alerts.length,
          " alert",
          alerts.length > 1 ? "s" : ""
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 text-xs text-muted-foreground uppercase tracking-wide pb-2 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ticker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Current %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Target %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Drift" })
        ] }),
        alerts.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `dashboard.rebalance.item.${i + 1}`,
            className: "grid grid-cols-4 items-center py-2.5 border-b border-border last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: a.ticker }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-right tabular-nums text-sm text-foreground", children: [
                a.currentPct.toFixed(1),
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-right tabular-nums text-sm text-muted-foreground", children: [
                a.targetPct.toFixed(1),
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  className: `text-xs font-semibold border tabular-nums ${a.driftPct > 0 ? "bg-accent/15 text-accent border-accent/30" : "bg-primary/15 text-primary border-primary/30"}`,
                  children: [
                    a.driftPct > 0 ? "+" : "",
                    a.driftPct.toFixed(1),
                    "%"
                  ]
                }
              ) })
            ]
          },
          a.ticker
        ))
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "dashboard.holdings.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Your Holdings" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !holdings || holdings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm text-muted-foreground py-4 text-center",
            "data-ocid": "dashboard.holdings.empty_state",
            children: "No holdings yet. Add your first position."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: holdings.slice(0, 5).map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `dashboard.holding.item.${i + 1}`,
            className: "flex items-center justify-between py-2 border-b border-border last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: h.ticker }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate max-w-[160px]", children: h.companyName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-semibold", children: formatINR(h.purchasePrice * h.quantity, 0) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  h.quantity,
                  " units"
                ] })
              ] })
            ]
          },
          String(h.id)
        )) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "dashboard.recommendations.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Daily Recommendations" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !recommendations || recommendations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm text-muted-foreground py-4 text-center",
            "data-ocid": "dashboard.recommendations.empty_state",
            children: "No recommendations today."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: recommendations.slice(0, 5).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `dashboard.recommendation.item.${i + 1}`,
            className: "flex items-center justify-between py-2 border-b border-border last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: r.ticker }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatINR(r.currentPrice) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `font-mono text-xs tabular-nums ${r.expectedReturn >= 0 ? "text-emerald-400" : "text-destructive"}`,
                    children: [
                      r.expectedReturn > 0 ? "+" : "",
                      r.expectedReturn.toFixed(1),
                      "%"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: `text-xs border ${actionColors[r.action]}`,
                    children: r.action.toUpperCase()
                  }
                )
              ] })
            ]
          },
          r.ticker
        )) }) })
      ] })
    ] })
  ] });
}
export {
  DashboardPage
};
