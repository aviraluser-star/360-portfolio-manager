import { j as jsxRuntimeExports, P as PageLoader, E as ErrorState, a as cn, T as TrendingUp } from "./index-BqnJ5REX.js";
import { M as MetricCard, T as TriangleAlert } from "./MetricCard-Cmi-Uvsq.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, B as Badge } from "./backend-lKmLgprF.js";
import { u as usePortfolioSummary, a as useSharpeRatio, b as useVolatility, c as useRebalanceAlerts, d as useBenchmark, C as ChartColumn, R as ResponsiveContainer, L as LineChart, e as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, g as Line } from "./LineChart-VLh_r1XO.js";
import "./trending-down-Cv13Lw9A.js";
const VOLATILITY_HISTORY = [
  { month: "Nov", vol: 21.2 },
  { month: "Dec", vol: 24.8 },
  { month: "Jan", vol: 22.1 },
  { month: "Feb", vol: 19.6 },
  { month: "Mar", vol: 20.3 },
  { month: "Apr", vol: 18.4 }
];
function RiskGauge({ volatility }) {
  const level = volatility < 15 ? "Low" : volatility < 25 ? "Moderate" : "High";
  const levelIndex = volatility < 15 ? 0 : volatility < 25 ? 1 : 2;
  const clampedVol = Math.min(Math.max(volatility, 0), 40);
  const angleDeg = clampedVol / 40 * 180;
  const angleRad = (angleDeg - 90) * Math.PI / 180;
  const cx = 100;
  const cy = 90;
  const r = 70;
  const tipX = cx + r * Math.cos(angleRad);
  const tipY = cy + r * Math.sin(angleRad);
  const gaugeColors = {
    low: "oklch(0.765 0.177 162.48)",
    moderate: "oklch(0.828 0.189 84.43)",
    high: "oklch(0.704 0.191 22.18)"
  };
  const levelColorMap = [
    gaugeColors.low,
    gaugeColors.moderate,
    gaugeColors.high
  ];
  const levelColor = levelColorMap[levelIndex];
  const levelLabels = ["Low Risk", "Moderate Risk", "High Risk"];
  function arcPath(startDeg, endDeg) {
    const toRad = (d) => (d - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "0 0 200 110",
        className: "w-52 h-28",
        role: "img",
        "aria-label": `Risk gauge: ${level} risk`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: `Portfolio risk level: ${level}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: arcPath(0, 180),
              fill: "none",
              stroke: "hsl(var(--border))",
              strokeWidth: "14",
              strokeLinecap: "round"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: arcPath(0, 60),
              fill: "none",
              stroke: gaugeColors.low,
              strokeWidth: "14",
              opacity: "0.85"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: arcPath(60, 120),
              fill: "none",
              stroke: gaugeColors.moderate,
              strokeWidth: "14",
              opacity: "0.85"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: arcPath(120, 180),
              fill: "none",
              stroke: gaugeColors.high,
              strokeWidth: "14",
              opacity: "0.85"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "line",
            {
              x1: cx,
              y1: cy,
              x2: tipX,
              y2: tipY,
              stroke: levelColor,
              strokeWidth: "3",
              strokeLinecap: "round"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx, cy, r: "5", fill: levelColor }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "text",
            {
              x: cx,
              y: cy - 10,
              textAnchor: "middle",
              fontSize: "13",
              fontWeight: "700",
              fill: "currentColor",
              className: "fill-foreground font-mono",
              children: [
                volatility.toFixed(1),
                "%"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "inline-block w-2.5 h-2.5 rounded-full",
          style: { backgroundColor: levelColor }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", style: { color: levelColor }, children: levelLabels[levelIndex] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-emerald-400" }),
        "Low (<15%)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-amber-400" }),
        "Moderate"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-red-400" }),
        "High (>25%)"
      ] })
    ] })
  ] });
}
function BenchmarkBar({ label, value, max, color }) {
  const pct = Math.min(Math.abs(value) / Math.max(max, 1), 1) * 100;
  const isPositive = value >= 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: cn(
            "font-mono font-bold tabular-nums",
            isPositive ? "text-emerald-400" : "text-destructive"
          ),
          children: [
            isPositive ? "+" : "",
            value.toFixed(2),
            "%"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full rounded-full transition-all duration-700",
        style: { width: `${pct}%`, backgroundColor: color }
      }
    ) })
  ] });
}
function VolTooltip({
  active,
  payload,
  label
}) {
  if (!active || !(payload == null ? void 0 : payload.length)) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-popover px-3 py-2 shadow-md text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-0.5", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono font-bold text-primary", children: [
      payload[0].value.toFixed(1),
      "% vol"
    ] })
  ] });
}
function RiskPage() {
  const { data: summary, isLoading, isError } = usePortfolioSummary();
  const { data: sharpe } = useSharpeRatio();
  const { data: volatility } = useVolatility();
  const { data: alerts } = useRebalanceAlerts();
  const { data: benchmark } = useBenchmark();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  if (isError) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, {});
  const sharpeVal = sharpe ?? 0;
  const volVal = volatility ?? 18.4;
  const { sharpeLabel, sharpeBadgeClass } = sharpeVal >= 1 ? {
    sharpeLabel: "Good",
    sharpeBadgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
  } : sharpeVal >= 0 ? {
    sharpeLabel: "Fair",
    sharpeBadgeClass: "bg-accent/15 text-accent border-accent/30"
  } : {
    sharpeLabel: "Poor",
    sharpeBadgeClass: "bg-destructive/15 text-destructive border-destructive/30"
  };
  const alertCount = (alerts == null ? void 0 : alerts.filter((a) => Math.abs(a.driftPct) > 5).length) ?? 0;
  const benchMax = Math.max(
    Math.abs((benchmark == null ? void 0 : benchmark.portfolioYtdReturn) ?? 0),
    Math.abs((benchmark == null ? void 0 : benchmark.sp500YtdReturn) ?? 0),
    1
  ) * 1.15;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "risk.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Risk Metrics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Portfolio risk analysis, rebalancing alerts & benchmark comparison" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "risk.sharpe.card",
          label: "Sharpe Ratio",
          value: sharpeVal.toFixed(2),
          badge: sharpeLabel,
          highlight: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "risk.volatility.card",
          label: "Annual Volatility",
          value: `${volVal.toFixed(1)}%`,
          badge: "Annualized"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "risk.beta.card",
          label: "Portfolio Beta",
          value: "0.85",
          badge: "vs NIFTY 50"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "risk.sharpe_detail.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
          "Sharpe Ratio Analysis"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "font-display text-5xl font-bold tabular-nums",
                  sharpeVal >= 1 ? "text-emerald-400" : sharpeVal >= 0 ? "text-accent" : "text-destructive"
                ),
                children: sharpeVal.toFixed(2)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border",
                    sharpeBadgeClass
                  ),
                  "data-ocid": "risk.sharpe.interpretation_badge",
                  children: sharpeLabel
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Risk-adjusted return per unit of volatility" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 pt-3 border-t border-border text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "text-center p-2.5 rounded-md transition-smooth",
                  sharpeVal < 0 ? "bg-destructive/15 ring-1 ring-destructive/40" : "bg-destructive/8"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-destructive", children: "< 0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Poor" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "text-center p-2.5 rounded-md transition-smooth",
                  sharpeVal >= 0 && sharpeVal < 1 ? "bg-accent/15 ring-1 ring-accent/40" : "bg-accent/8"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-accent", children: "0 – 1" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Fair" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "text-center p-2.5 rounded-md transition-smooth",
                  sharpeVal >= 1 ? "bg-emerald-500/15 ring-1 ring-emerald-500/40" : "bg-emerald-500/8"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-emerald-400", children: "> 1" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Good" })
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "risk.gauge.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Portfolio Risk Level" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex justify-center pt-2 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskGauge, { volatility: volVal }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "risk.volatility_chart.card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "6-Month Rolling Volatility" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        LineChart,
        {
          data: VOLATILITY_HISTORY,
          margin: { top: 8, right: 16, left: -8, bottom: 0 },
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
                tick: { fontSize: 12, fill: "oklch(var(--muted-foreground))" },
                axisLine: false,
                tickLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                domain: ["auto", "auto"],
                tick: { fontSize: 12, fill: "oklch(var(--muted-foreground))" },
                tickFormatter: (v) => `${v}%`,
                axisLine: false,
                tickLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(VolTooltip, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Line,
              {
                type: "monotone",
                dataKey: "vol",
                stroke: "oklch(var(--primary))",
                strokeWidth: 2.5,
                dot: { r: 4, fill: "oklch(var(--primary))", strokeWidth: 0 },
                activeDot: { r: 6 }
              }
            )
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "risk.benchmark.card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
        "YTD Benchmark Comparison"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BenchmarkBar,
          {
            label: "Your Portfolio",
            value: (benchmark == null ? void 0 : benchmark.portfolioYtdReturn) ?? 0,
            max: benchMax,
            color: "oklch(var(--primary))"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BenchmarkBar,
          {
            label: "NIFTY 50 Index",
            value: (benchmark == null ? void 0 : benchmark.sp500YtdReturn) ?? 0,
            max: benchMax,
            color: "oklch(var(--muted-foreground))"
          }
        ),
        ((benchmark == null ? void 0 : benchmark.portfolioYtdReturn) ?? 0) > ((benchmark == null ? void 0 : benchmark.sp500YtdReturn) ?? 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-400 font-medium", children: [
          "✓ Outperforming NIFTY 50 by",
          " ",
          (((benchmark == null ? void 0 : benchmark.portfolioYtdReturn) ?? 0) - ((benchmark == null ? void 0 : benchmark.sp500YtdReturn) ?? 0)).toFixed(2),
          "% YTD"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "risk.rebalance.card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-accent" }),
        "Rebalancing Alerts",
        alertCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            className: "bg-accent/15 text-accent border border-accent/30 ml-1 text-xs font-bold",
            "data-ocid": "risk.alert_count.badge",
            children: [
              alertCount,
              " need",
              alertCount === 1 ? "s" : "",
              " action"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !alerts || alerts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-sm text-muted-foreground py-6 text-center",
          "data-ocid": "risk.rebalance.empty_state",
          children: "All positions are within target allocation bands. No rebalancing needed."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full data-table text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-xs text-muted-foreground uppercase tracking-wide", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2.5 text-left font-medium", children: "Ticker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2.5 text-left font-medium", children: "Asset Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2.5 text-right font-medium", children: "Current %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2.5 text-right font-medium", children: "Target %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2.5 text-right font-medium", children: "Drift" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2.5 text-center font-medium", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: alerts.map((a, i) => {
          const isDrifted = Math.abs(a.driftPct) > 5;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `risk.alert.item.${i + 1}`,
              className: cn(
                "border-b border-border/50 transition-colors",
                isDrifted ? "bg-accent/8 hover:bg-accent/12" : "hover:bg-muted/40"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 font-semibold text-primary", children: a.ticker }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: a.assetClass }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 text-right font-mono", children: [
                  a.currentPct.toFixed(1),
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 text-right font-mono text-muted-foreground", children: [
                  a.targetPct.toFixed(1),
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "td",
                  {
                    className: cn(
                      "py-3 text-right font-mono font-bold",
                      isDrifted ? "text-accent" : "text-emerald-400"
                    ),
                    children: [
                      a.driftPct > 0 ? "+" : "",
                      a.driftPct.toFixed(1),
                      "%"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-center", children: isDrifted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                  "Rebalance"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30", children: "On Track" }) })
              ]
            },
            a.ticker
          );
        }) })
      ] }) }) })
    ] }),
    summary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "risk.total_investment.card",
          label: "Total Invested",
          value: `₹${(summary.totalInvestment / 1e5).toFixed(2)}L`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "risk.current_value.card",
          label: "Current Value",
          value: `₹${(summary.totalValue / 1e5).toFixed(2)}L`,
          trend: summary.gainLossPct
        }
      )
    ] })
  ] });
}
export {
  RiskPage
};
