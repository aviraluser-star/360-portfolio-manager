import { c as createLucideIcon, j as jsxRuntimeExports, T as TrendingUp, a as cn } from "./index-BqnJ5REX.js";
import { C as Card, c as CardContent, B as Badge } from "./backend-lKmLgprF.js";
import { T as TrendingDown, M as Minus } from "./trending-down-Cv13Lw9A.js";
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
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
function MetricCard({
  label,
  value,
  badge,
  trend,
  trendLabel,
  highlight = false,
  className,
  "data-ocid": dataOcid
}) {
  const trendColor = trend === void 0 ? "" : trend > 0 ? "text-emerald-400" : trend < 0 ? "text-destructive" : "text-muted-foreground";
  const TrendIcon = trend === void 0 ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      "data-ocid": dataOcid,
      className: cn(
        "transition-smooth hover:shadow-md",
        highlight && "border-primary/40 bg-primary/5",
        className
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground tabular-nums", children: value }),
        (badge !== void 0 || trend !== void 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 flex-wrap", children: [
          badge && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: badge }),
          TrendIcon && trend !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: cn(
                "flex items-center gap-1 text-xs font-semibold",
                trendColor
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendIcon, { className: "h-3.5 w-3.5" }),
                trendLabel ?? `${trend > 0 ? "+" : ""}${trend.toFixed(2)}%`
              ]
            }
          )
        ] })
      ] })
    }
  );
}
export {
  MetricCard as M,
  TriangleAlert as T
};
