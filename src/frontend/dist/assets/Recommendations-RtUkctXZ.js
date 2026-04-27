import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, r as reactExports, E as ErrorState, T as TrendingUp, B as Button, d as ue } from "./index-BqnJ5REX.js";
import { A as Action, R as RiskRating, C as Card, a as CardHeader, c as CardContent, B as Badge, d as AssetClass } from "./backend-lKmLgprF.js";
import { d as Dialog, e as DialogContent, f as DialogHeader, g as DialogTitle, h as DialogFooter } from "./dialog-BZlq4gmK.js";
import { L as Label, I as Input, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DwLVZTa6.js";
import { a as useAddHolding } from "./usePortfolio-Dl_d3Bef.js";
import { u as useRecommendations } from "./useRecommendations-CJZne3NU.js";
import { b as formatINR, f as formatPct } from "./formatters-hOzKO6p6.js";
import { M as Minus, T as TrendingDown } from "./trending-down-Cv13Lw9A.js";
import "./index-Bo1jGcLI.js";
import "./index-CeSgkJIf.js";
import "./useMutation-Dxa2nhZ8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5", key: "1osxxc" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M3 10h5", key: "r794hk" }],
  ["path", { d: "M17.5 17.5 16 16.3V14", key: "akvzfd" }],
  ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
];
const CalendarClock = createLucideIcon("calendar-clock", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
const ACTION_BADGE = {
  [Action.buy]: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  [Action.hold]: "bg-muted text-muted-foreground border border-border",
  [Action.sell]: "bg-destructive/15 text-destructive border border-destructive/30"
};
const RISK_BADGE = {
  [RiskRating.low]: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  [RiskRating.medium]: "bg-accent/10 text-accent border border-accent/20",
  [RiskRating.high]: "bg-destructive/10 text-destructive border border-destructive/20"
};
const ACTION_LABEL = {
  [Action.buy]: "BUY",
  [Action.hold]: "HOLD",
  [Action.sell]: "SELL"
};
const RISK_LABEL = {
  [RiskRating.low]: "Low Risk",
  [RiskRating.medium]: "Med Risk",
  [RiskRating.high]: "High Risk"
};
function AddHoldingDialog({ rec, onClose }) {
  const addHolding = useAddHolding();
  const [qty, setQty] = reactExports.useState("1");
  const [assetClass, setAssetClass] = reactExports.useState(AssetClass.equity);
  const open = rec !== null;
  function handleSubmit() {
    if (!rec) return;
    const quantity = Number.parseFloat(qty);
    if (Number.isNaN(quantity) || quantity <= 0) {
      ue.error("Enter a valid quantity");
      return;
    }
    const input = {
      ticker: rec.ticker,
      companyName: rec.companyName,
      purchasePrice: rec.currentPrice,
      purchaseDate: BigInt(Date.now()) * 1000000n,
      quantity,
      assetClass
    };
    addHolding.mutate(input, {
      onSuccess: () => {
        ue.success(`${rec.ticker} added to portfolio`);
        onClose();
        setQty("1");
      },
      onError: () => ue.error("Failed to add holding")
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-md bg-card border-border",
      "data-ocid": "add-holding.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-foreground", children: "Add to Portfolio" }) }),
        rec && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-md bg-muted px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm", children: rec.ticker }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: rec.companyName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-semibold text-foreground", children: formatINR(rec.currentPrice) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: `text-xs font-mono font-semibold ${rec.expectedReturn >= 0 ? "text-emerald-400" : "text-destructive"}`,
                  children: [
                    formatPct(rec.expectedReturn),
                    " exp."
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "qty", className: "text-sm", children: "Quantity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "qty",
                type: "number",
                min: "0.01",
                step: "0.01",
                value: qty,
                onChange: (e) => setQty(e.target.value),
                className: "font-mono",
                "data-ocid": "add-holding.qty.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: "Asset Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: assetClass,
                onValueChange: (v) => setAssetClass(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "add-holding.asset-class.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: AssetClass.equity, children: "Equity" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: AssetClass.mutualFund, children: "Mutual Fund" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-muted/50 px-3 py-2 flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Estimated Cost" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground", children: formatINR(rec.currentPrice * (Number.parseFloat(qty) || 0)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "add-holding.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSubmit,
              disabled: addHolding.isPending,
              "data-ocid": "add-holding.submit_button",
              className: "bg-primary text-primary-foreground hover:bg-primary/90",
              children: addHolding.isPending ? "Adding…" : "Add Holding"
            }
          )
        ] })
      ]
    }
  ) });
}
function RecommendationsSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-52" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-72" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-20 rounded-full" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-36" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" })
      ] })
    ] }, i)) })
  ] });
}
function RecommendationsPage() {
  const { data: recs, isLoading, isError } = useRecommendations();
  const [actionFilter, setActionFilter] = reactExports.useState("all");
  const [riskFilter, setRiskFilter] = reactExports.useState("all");
  const [addTarget, setAddTarget] = reactExports.useState(null);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(RecommendationsSkeleton, {});
  if (isError) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, {});
  const allRecs = recs ?? [];
  const buys = allRecs.filter((r) => r.action === Action.buy);
  const holds = allRecs.filter((r) => r.action === Action.hold);
  const sells = allRecs.filter((r) => r.action === Action.sell);
  const filtered = allRecs.filter((r) => {
    const matchAction = actionFilter === "all" || r.action === actionFilter;
    const matchRisk = riskFilter === "all" || r.riskRating === riskFilter;
    return matchAction && matchRisk;
  });
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "recommendations.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground leading-tight", children: "Daily Recommendations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "w-3.5 h-3.5 shrink-0" }),
            today
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full w-fit", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 shrink-0 text-primary" }),
          "Refreshes daily"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-wrap gap-3",
          "data-ocid": "recommendations.summary.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-badge gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3.5 h-3.5 text-emerald-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-bold", children: buys.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Buy signals" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-badge gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3.5 h-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: holds.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Hold" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-badge gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3.5 h-3.5 text-destructive" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-bold", children: sells.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sell" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "metric-badge gap-1.5 ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              allRecs.length,
              " total picks"
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-wrap items-center gap-2 p-3 rounded-lg bg-card border border-border",
          "data-ocid": "recommendations.filter.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mr-1", children: "Filter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5", "aria-label": "Filter by action", children: ["all", Action.buy, Action.hold, Action.sell].map(
              (val) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActionFilter(val),
                  "data-ocid": `recommendations.action-filter.${val}`,
                  className: `text-xs px-3 py-1 rounded-full border transition-smooth font-medium ${actionFilter === val ? val === "all" ? "bg-primary text-primary-foreground border-primary" : val === Action.buy ? "bg-emerald-500/25 text-emerald-400 border-emerald-500/50" : val === Action.sell ? "bg-destructive/25 text-destructive border-destructive/50" : "bg-muted text-foreground border-border" : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"}`,
                  children: val === "all" ? "All Actions" : ACTION_LABEL[val]
                },
                val
              )
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-border mx-1 hidden sm:block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5", "aria-label": "Filter by risk", children: [
              "all",
              RiskRating.low,
              RiskRating.medium,
              RiskRating.high
            ].map((val) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setRiskFilter(val),
                "data-ocid": `recommendations.risk-filter.${val}`,
                className: `text-xs px-3 py-1 rounded-full border transition-smooth font-medium ${riskFilter === val ? val === "all" ? "bg-primary text-primary-foreground border-primary" : val === RiskRating.low ? "bg-emerald-500/25 text-emerald-400 border-emerald-500/50" : val === RiskRating.high ? "bg-destructive/25 text-destructive border-destructive/50" : "bg-accent/25 text-accent border-accent/50" : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"}`,
                children: val === "all" ? "All Risk" : RISK_LABEL[val]
              },
              val
            )) }),
            (actionFilter !== "all" || riskFilter !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
              filtered.length,
              " result",
              filtered.length !== 1 ? "s" : ""
            ] })
          ]
        }
      ),
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-16 text-center rounded-lg border border-dashed border-border",
          "data-ocid": "recommendations.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-10 h-10 text-muted-foreground/40 mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No recommendations match this filter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "mt-3 text-xs",
                onClick: () => {
                  setActionFilter("all");
                  setRiskFilter("all");
                },
                children: "Clear filters"
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        RecommendationCard,
        {
          rec: r,
          index: i + 1,
          onAddToPortfolio: () => setAddTarget(r)
        },
        r.ticker
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddHoldingDialog, { rec: addTarget, onClose: () => setAddTarget(null) })
  ] });
}
function RecommendationCard({
  rec,
  index,
  onAddToPortfolio
}) {
  const returnPositive = rec.expectedReturn >= 0;
  const returnColor = returnPositive ? "text-emerald-400" : "text-destructive";
  const ReturnIcon = returnPositive ? TrendingUp : TrendingDown;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      "data-ocid": `recommendations.item.${index}`,
      className: "flex flex-col border-border bg-card transition-smooth hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-foreground tracking-wide", children: rec.ticker }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: rec.companyName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: `text-xs font-bold shrink-0 ${ACTION_BADGE[rec.action]}`,
              children: ACTION_LABEL[rec.action]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex-1 flex flex-col gap-3 px-4 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-muted/50 px-2.5 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-0.5", children: "Current" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-semibold text-foreground", children: formatINR(rec.currentPrice) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-primary/5 border border-primary/10 px-2.5 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-0.5", children: "Target" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-semibold text-primary", children: formatINR(rec.targetPrice) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ReturnIcon, { className: `w-3.5 h-3.5 ${returnColor}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-mono font-bold text-sm ${returnColor}`, children: formatPct(rec.expectedReturn) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "expected" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: `text-[10px] font-semibold ${RISK_BADGE[rec.riskRating]}`,
                children: RISK_LABEL[rec.riskRating]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full mt-auto border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-smooth text-xs gap-1.5",
              onClick: onAddToPortfolio,
              "data-ocid": `recommendations.add-to-portfolio.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-3.5 h-3.5" }),
                "Add to Portfolio"
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  RecommendationsPage
};
