import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, u as useComposedRefs, a as cn, b as buttonVariants, d as ue, P as PageLoader, E as ErrorState, B as Button, T as TrendingUp } from "./index-BqnJ5REX.js";
import { M as MetricCard, T as TriangleAlert } from "./MetricCard-Cmi-Uvsq.js";
import { c as composeEventHandlers, a as createSlottable, b as createContextScope } from "./index-Bo1jGcLI.js";
import { R as Root, W as WarningProvider, C as Content, T as Title, D as Description, a as Close, c as createDialogScope, P as Portal, O as Overlay, b as Trigger, d as Dialog, e as DialogContent, f as DialogHeader, g as DialogTitle, h as DialogFooter } from "./dialog-BZlq4gmK.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, B as Badge, d as AssetClass } from "./backend-lKmLgprF.js";
import { L as Label, I as Input, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DwLVZTa6.js";
import { u as useHoldings, a as useAddHolding, b as useUpdateHolding, c as useDeleteHolding } from "./usePortfolio-Dl_d3Bef.js";
import { P as Plus, T as Trash2, N as NSE_STOCKS } from "./constants-DWyTyNWS.js";
import { b as formatINR, f as formatPct, c as formatDate } from "./formatters-hOzKO6p6.js";
import { T as TrendingDown } from "./trending-down-Cv13Lw9A.js";
import "./index-CeSgkJIf.js";
import "./useMutation-Dxa2nhZ8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    var _a;
    const hasDescription = document.getElementById(
      (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay2,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title2,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description2,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
const MOCK_PRICE_MULTIPLIERS = {
  TCS: 1.18,
  INFY: 1.09,
  RELIANCE: 1.22,
  WIPRO: 0.91,
  HDFCBANK: 1.14,
  ICICIBANK: 1.31,
  BHARTIARTL: 1.27,
  ASIANPAINT: 0.88,
  KOTAKBANK: 1.05,
  LT: 1.19,
  SUNPHARMA: 1.33,
  TITAN: 1.16,
  BAJFINANCE: 0.95,
  NESTLEIND: 1.08,
  ULTRACEMCO: 1.21
};
function mockCurrentPrice(ticker, purchasePrice) {
  const mult = MOCK_PRICE_MULTIPLIERS[ticker] ?? 1 + Math.sin(ticker.length) * 0.15;
  return Math.round(purchasePrice * mult * 100) / 100;
}
const EMPTY_FORM = {
  ticker: "",
  companyName: "",
  quantity: 0,
  purchasePrice: 0,
  purchaseDate: BigInt(Date.now()) * 1000000n,
  assetClass: AssetClass.equity
};
function CsvImportDialog({
  open,
  onClose,
  onConfirm,
  isPending
}) {
  const [rows, setRows] = reactExports.useState(null);
  const fileRef = reactExports.useRef(null);
  function parseCSV(text) {
    var _a;
    const lines = text.trim().split("\n").filter(Boolean);
    const dataLines = ((_a = lines[0]) == null ? void 0 : _a.toLowerCase().includes("ticker")) ? lines.slice(1) : lines;
    return dataLines.map((line) => {
      const parts = line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
      const [ticker, companyName, qtyStr, priceStr, dateStr, assetClassStr] = parts;
      const quantity = Number.parseFloat(qtyStr ?? "");
      const purchasePrice = Number.parseFloat(priceStr ?? "");
      const assetClass = (assetClassStr == null ? void 0 : assetClassStr.toLowerCase()) === "mutualfund" || (assetClassStr == null ? void 0 : assetClassStr.toLowerCase()) === "mutual fund" ? AssetClass.mutualFund : AssetClass.equity;
      if (!ticker || !companyName || Number.isNaN(quantity) || Number.isNaN(purchasePrice) || quantity <= 0 || purchasePrice <= 0) {
        return {
          ticker: ticker ?? "?",
          companyName: companyName ?? "?",
          quantity,
          purchasePrice,
          purchaseDate: dateStr ?? "",
          assetClass,
          valid: false,
          error: "Invalid row"
        };
      }
      return {
        ticker: ticker.toUpperCase(),
        companyName,
        quantity,
        purchasePrice,
        purchaseDate: dateStr ?? (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        assetClass,
        valid: true
      };
    });
  }
  function handleFile(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      const text = (_a2 = ev.target) == null ? void 0 : _a2.result;
      setRows(parseCSV(text));
    };
    reader.readAsText(file);
  }
  const validRows = (rows == null ? void 0 : rows.filter((r) => r.valid)) ?? [];
  const invalidRows = (rows == null ? void 0 : rows.filter((r) => !r.valid)) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (v) => {
        if (!v) {
          setRows(null);
          onClose();
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "max-w-2xl",
          "data-ocid": "holdings.csv_import.dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Import Holdings from CSV" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground", children: [
                "Expected columns:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: "ticker, company, qty, price, date (YYYY-MM-DD), assetClass (equity/mutualFund)" })
              ] }),
              !rows ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "w-full flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border py-10 cursor-pointer hover:border-primary/50 transition-colors",
                  onClick: () => {
                    var _a;
                    return (_a = fileRef.current) == null ? void 0 : _a.click();
                  },
                  "data-ocid": "holdings.csv_import.dropzone",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Click to select a CSV file" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: fileRef,
                        type: "file",
                        accept: ".csv,text/csv",
                        className: "hidden",
                        onChange: handleFile
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-emerald-400", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
                    " ",
                    validRows.length,
                    " valid"
                  ] }),
                  invalidRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-destructive", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
                    " ",
                    invalidRows.length,
                    " invalid"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-56 overflow-y-auto rounded-md border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full data-table text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Status" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Ticker" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Company" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Qty" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Price (₹)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Class" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: `border-b border-border/40 ${row.valid ? "" : "opacity-50"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5", children: row.valid ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5 text-destructive" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 font-semibold text-primary", children: row.ticker }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 max-w-[120px] truncate", children: row.companyName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-right", children: row.quantity }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-right", children: formatINR(row.purchasePrice) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: row.assetClass }) })
                      ]
                    },
                    `${row.ticker}-${i}`
                  )) })
                ] }) }),
                invalidRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "alert-banner text-xs flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }),
                  "Invalid rows will be skipped during import."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => {
                    setRows(null);
                    onClose();
                  },
                  "data-ocid": "holdings.csv_import.cancel_button",
                  children: "Cancel"
                }
              ),
              rows && validRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: () => onConfirm(validRows),
                  disabled: isPending,
                  "data-ocid": "holdings.csv_import.confirm_button",
                  children: isPending ? "Importing..." : `Import ${validRows.length} Holdings`
                }
              ),
              rows && validRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => setRows(null),
                  "data-ocid": "holdings.csv_import.retry_button",
                  children: "Try another file"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function HoldingFormDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  initial,
  mode
}) {
  const [form, setForm] = reactExports.useState(initial ?? EMPTY_FORM);
  const [tickerQuery, setTickerQuery] = reactExports.useState("");
  const [showSuggestions, setShowSuggestions] = reactExports.useState(false);
  const suggestions = NSE_STOCKS.filter(
    (s) => tickerQuery.length > 0 && (s.ticker.startsWith(tickerQuery.toUpperCase()) || s.companyName.toLowerCase().includes(tickerQuery.toLowerCase()))
  ).slice(0, 6);
  function handleTickerInput(val) {
    setTickerQuery(val);
    setForm((f) => ({ ...f, ticker: val.toUpperCase() }));
    setShowSuggestions(true);
  }
  function selectSuggestion(ticker, companyName) {
    setForm((f) => ({ ...f, ticker, companyName }));
    setTickerQuery(ticker);
    setShowSuggestions(false);
  }
  function handleOpen(v) {
    if (!v) {
      setForm(initial ?? EMPTY_FORM);
      setTickerQuery((initial == null ? void 0 : initial.ticker) ?? "");
      setShowSuggestions(false);
      onClose();
    }
  }
  reactExports.useState(() => {
    if (initial) {
      setForm(initial);
      setTickerQuery(initial.ticker);
    }
  });
  const dateValue = (() => {
    try {
      return new Date(Number(form.purchaseDate / 1000000n)).toISOString().split("T")[0];
    } catch {
      return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    }
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "holdings.form.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: mode === "add" ? "Add Holding" : "Edit Holding" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Ticker Symbol" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "e.g. TCS",
            value: tickerQuery,
            onChange: (e) => handleTickerInput(e.target.value),
            onFocus: () => setShowSuggestions(true),
            onBlur: () => setTimeout(() => setShowSuggestions(false), 150),
            autoComplete: "off",
            "data-ocid": "holdings.form.ticker.input"
          }
        ),
        showSuggestions && suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 w-full rounded-md border border-border bg-popover shadow-lg top-full mt-1", children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-3 first:rounded-t-md last:rounded-b-md",
            onMouseDown: () => selectSuggestion(s.ticker, s.companyName),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-primary w-24 shrink-0", children: s.ticker }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: s.companyName })
            ]
          },
          s.ticker
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Company Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Tata Consultancy Services",
            value: form.companyName,
            onChange: (e) => setForm({ ...form, companyName: e.target.value }),
            "data-ocid": "holdings.form.company.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 1,
              value: form.quantity || "",
              onChange: (e) => setForm({ ...form, quantity: Number(e.target.value) }),
              "data-ocid": "holdings.form.quantity.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Purchase Price (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0,
              step: 0.01,
              value: form.purchasePrice || "",
              onChange: (e) => setForm({ ...form, purchasePrice: Number(e.target.value) }),
              "data-ocid": "holdings.form.price.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Purchase Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: dateValue,
              onChange: (e) => {
                const ms = new Date(e.target.value).getTime();
                setForm({ ...form, purchaseDate: BigInt(ms) * 1000000n });
              },
              "data-ocid": "holdings.form.date.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Asset Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.assetClass,
              onValueChange: (v) => setForm({ ...form, assetClass: v }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "holdings.form.asset_class.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: AssetClass.equity, children: "Equity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: AssetClass.mutualFund, children: "Mutual Fund" })
                ] })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => handleOpen(false),
          "data-ocid": "holdings.form.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => onSubmit(form),
          disabled: isPending || !form.ticker || !form.companyName || form.quantity <= 0 || form.purchasePrice <= 0,
          "data-ocid": "holdings.form.submit_button",
          children: isPending ? mode === "add" ? "Adding..." : "Saving..." : mode === "add" ? "Add Holding" : "Save Changes"
        }
      )
    ] })
  ] }) });
}
function DeleteConfirmDialog({
  holding,
  onConfirm,
  onCancel,
  isPending
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!holding, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "holdings.delete.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
        "Remove ",
        holding == null ? void 0 : holding.ticker,
        "?"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
        "This will permanently remove ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: holding == null ? void 0 : holding.companyName }),
        " ",
        "(",
        holding == null ? void 0 : holding.quantity,
        " units) from your portfolio."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertDialogCancel,
        {
          onClick: onCancel,
          "data-ocid": "holdings.delete.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertDialogAction,
        {
          onClick: onConfirm,
          disabled: isPending,
          className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          "data-ocid": "holdings.delete.confirm_button",
          children: isPending ? "Removing..." : "Remove"
        }
      )
    ] })
  ] }) });
}
function HoldingsPage() {
  const { data: holdings, isLoading, isError } = useHoldings();
  const addHolding = useAddHolding();
  const updateHolding = useUpdateHolding();
  const deleteHolding = useDeleteHolding();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editHolding, setEditHolding] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [csvOpen, setCsvOpen] = reactExports.useState(false);
  const [filter, setFilter] = reactExports.useState("all");
  const [csvPending, setCsvPending] = reactExports.useState(false);
  const filtered = (holdings ?? []).filter(
    (h) => filter === "all" ? true : h.assetClass === filter
  );
  const enriched = filtered.map((h) => {
    const currentPrice = mockCurrentPrice(h.ticker, h.purchasePrice);
    const invested = h.purchasePrice * h.quantity;
    const currentValue = currentPrice * h.quantity;
    const gainLossAmt = currentValue - invested;
    const gainLossPct = invested > 0 ? gainLossAmt / invested * 100 : 0;
    return {
      ...h,
      currentPrice,
      invested,
      currentValue,
      gainLossAmt,
      gainLossPct
    };
  });
  const totalInvested = enriched.reduce((s, h) => s + h.invested, 0);
  const totalCurrentValue = enriched.reduce((s, h) => s + h.currentValue, 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalGainLossPct = totalInvested > 0 ? totalGainLoss / totalInvested * 100 : 0;
  const handleAdd = reactExports.useCallback(
    async (data) => {
      try {
        await addHolding.mutateAsync(data);
        ue.success("Holding added successfully");
        setAddOpen(false);
      } catch {
        ue.error("Failed to add holding");
      }
    },
    [addHolding]
  );
  const handleEdit = reactExports.useCallback(
    async (data) => {
      if (!editHolding) return;
      try {
        await updateHolding.mutateAsync({ id: editHolding.id, input: data });
        ue.success(`${editHolding.ticker} updated`);
        setEditHolding(null);
      } catch {
        ue.error("Failed to update holding");
      }
    },
    [editHolding, updateHolding]
  );
  const handleDelete = reactExports.useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteHolding.mutateAsync(deleteTarget.id);
      ue.success(`${deleteTarget.ticker} removed`);
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to remove holding");
    }
  }, [deleteTarget, deleteHolding]);
  const handleCsvImport = reactExports.useCallback(
    async (rows) => {
      setCsvPending(true);
      let success = 0;
      let failed = 0;
      for (const row of rows) {
        try {
          const dateMs = new Date(row.purchaseDate).getTime();
          await addHolding.mutateAsync({
            ticker: row.ticker,
            companyName: row.companyName,
            quantity: row.quantity,
            purchasePrice: row.purchasePrice,
            purchaseDate: BigInt(Number.isNaN(dateMs) ? Date.now() : dateMs) * 1000000n,
            assetClass: row.assetClass
          });
          success++;
        } catch {
          failed++;
        }
      }
      setCsvPending(false);
      setCsvOpen(false);
      if (success > 0)
        ue.success(`Imported ${success} holding${success > 1 ? "s" : ""}`);
      if (failed > 0)
        ue.error(
          `${failed} holding${failed > 1 ? "s" : ""} failed to import`
        );
    },
    [addHolding]
  );
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  if (isError) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, {});
  const editInitial = editHolding ? {
    ticker: editHolding.ticker,
    companyName: editHolding.companyName,
    quantity: editHolding.quantity,
    purchasePrice: editHolding.purchasePrice,
    purchaseDate: editHolding.purchaseDate,
    assetClass: editHolding.assetClass
  } : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "holdings.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Holdings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          (holdings == null ? void 0 : holdings.length) ?? 0,
          " positions tracked"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setCsvOpen(true),
            "data-ocid": "holdings.csv_import_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-1.5" }),
              " Import CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setAddOpen(true),
            "data-ocid": "holdings.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
              " Add Holding"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          label: "Total Invested",
          value: formatINR(totalInvested, 0)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          label: "Current Value",
          value: formatINR(totalCurrentValue, 0),
          highlight: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          label: "Total Gain/Loss",
          value: formatINR(totalGainLoss, 0),
          badge: totalGainLoss >= 0 ? "+" : "−"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          label: "Return",
          value: formatPct(totalGainLossPct),
          highlight: totalGainLossPct >= 0
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center gap-1.5",
        "data-ocid": "holdings.filter.tab",
        children: ["all", "equity", "mutualFund"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setFilter(f),
            "data-ocid": `holdings.filter.${f}`,
            className: `px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`,
            children: f === "all" ? "All" : f === "equity" ? "Equity" : "Mutual Fund"
          },
          f
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold", children: [
        filter === "all" ? "All Positions" : filter === "equity" ? "Equity Positions" : "Mutual Fund Positions",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 font-normal text-muted-foreground", children: [
          "(",
          enriched.length,
          ")"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: enriched.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-14 text-center", "data-ocid": "holdings.empty_state", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 h-14 w-14 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-7 w-7 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold text-foreground mb-1", children: "No holdings yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Start building your portfolio by adding your first position." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setAddOpen(true),
            "data-ocid": "holdings.add_first_button",
            children: "Add your first holding"
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto -mx-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full data-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-xs text-muted-foreground uppercase tracking-wide", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 pb-2.5 text-left font-medium", children: "Ticker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 pb-2.5 text-left font-medium", children: "Company" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 pb-2.5 text-right font-medium", children: "Qty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 pb-2.5 text-right font-medium", children: "Avg Price ₹" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 pb-2.5 text-right font-medium", children: "Current ₹" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 pb-2.5 text-right font-medium", children: "Gain/Loss ₹" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 pb-2.5 text-right font-medium", children: "Gain/Loss %" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 pb-2.5 text-left font-medium", children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 pb-2.5 text-left font-medium hidden sm:table-cell", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 pb-2.5 text-right font-medium", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: enriched.map((h, i) => {
          const isGain = h.gainLossAmt >= 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `holdings.item.${i + 1}`,
              className: "border-b border-border/40 hover:bg-muted/20 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 font-semibold text-primary", children: h.ticker }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-foreground/80 max-w-[140px] truncate", children: h.companyName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-right", children: h.quantity }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-right", children: formatINR(h.purchasePrice) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-right font-semibold", children: formatINR(h.currentPrice) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: `px-2 py-3 text-right font-semibold ${isGain ? "text-emerald-400" : "text-destructive"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-end gap-1", children: [
                      isGain ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
                      formatINR(Math.abs(h.gainLossAmt), 0)
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: `px-2 py-3 text-right font-semibold ${isGain ? "text-emerald-400" : "text-destructive"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-badge", children: formatPct(h.gainLossPct) })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: h.assetClass === AssetClass.equity ? "Equity" : "Mutual Fund" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-muted-foreground text-xs hidden sm:table-cell", children: formatDate(h.purchaseDate) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-muted-foreground hover:text-primary",
                      onClick: () => setEditHolding(h),
                      "aria-label": `Edit ${h.ticker}`,
                      "data-ocid": `holdings.edit_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                      onClick: () => setDeleteTarget(h),
                      "aria-label": `Delete ${h.ticker}`,
                      "data-ocid": `holdings.delete_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] }) })
              ]
            },
            String(h.id)
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t-2 border-border bg-muted/20 font-semibold text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3", colSpan: 2, children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-right text-muted-foreground", children: enriched.reduce((s, h) => s + h.quantity, 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-right", children: formatINR(totalInvested, 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-3 text-right", children: formatINR(totalCurrentValue, 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              className: `px-2 py-3 text-right ${totalGainLoss >= 0 ? "text-emerald-400" : "text-destructive"}`,
              children: formatINR(totalGainLoss, 0)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              className: `px-2 py-3 text-right ${totalGainLoss >= 0 ? "text-emerald-400" : "text-destructive"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-badge", children: formatPct(totalGainLossPct) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3 })
        ] }) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HoldingFormDialog,
      {
        open: addOpen,
        onClose: () => setAddOpen(false),
        onSubmit: handleAdd,
        isPending: addHolding.isPending,
        mode: "add"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HoldingFormDialog,
      {
        open: !!editHolding,
        onClose: () => setEditHolding(null),
        onSubmit: handleEdit,
        isPending: updateHolding.isPending,
        initial: editInitial,
        mode: "edit"
      },
      editHolding ? String(editHolding.id) : "edit"
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmDialog,
      {
        holding: deleteTarget,
        onConfirm: handleDelete,
        onCancel: () => setDeleteTarget(null),
        isPending: deleteHolding.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CsvImportDialog,
      {
        open: csvOpen,
        onClose: () => setCsvOpen(false),
        onConfirm: handleCsvImport,
        isPending: csvPending
      }
    )
  ] });
}
export {
  HoldingsPage
};
