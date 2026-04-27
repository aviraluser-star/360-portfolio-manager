import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, u as useComposedRefs, a as cn, P as PageLoader, E as ErrorState } from "./index-BqnJ5REX.js";
import { M as MetricCard, T as TriangleAlert } from "./MetricCard-Cmi-Uvsq.js";
import { u as useActor, e as useQuery, f as createActor, T as TaxBucket, C as Card, a as CardHeader, b as CardTitle, c as CardContent, B as Badge } from "./backend-lKmLgprF.js";
import { d as useId, P as Primitive, c as composeEventHandlers, b as createContextScope, g as createCollection, h as useDirection, u as useControllableState, i as useCallbackRef } from "./index-Bo1jGcLI.js";
import { P as Presence } from "./index-CeSgkJIf.js";
import { b as formatINR, f as formatPct } from "./formatters-hOzKO6p6.js";
import "./trending-down-Cv13Lw9A.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const MOCK_TAX = {
  stcgTotal: 45820.5,
  stcgTax: 6873.08,
  ltcgTotal: 152930,
  ltcgTax: 15293,
  unrealizedTotal: 89340.75,
  positions: [
    {
      holdingId: 1n,
      ticker: "TCS",
      gainLossAmt: 38500,
      taxLiability: 5775,
      bucket: TaxBucket.ltcg
    },
    {
      holdingId: 2n,
      ticker: "INFY",
      gainLossAmt: 22430,
      taxLiability: 2243,
      bucket: TaxBucket.ltcg
    },
    {
      holdingId: 3n,
      ticker: "HDFCBANK",
      gainLossAmt: 15820.5,
      taxLiability: 2373.08,
      bucket: TaxBucket.stcg
    },
    {
      holdingId: 4n,
      ticker: "RELIANCE",
      gainLossAmt: 3e4,
      taxLiability: 4500,
      bucket: TaxBucket.stcg
    },
    {
      holdingId: 5n,
      ticker: "WIPRO",
      gainLossAmt: 89340.75,
      taxLiability: 0,
      bucket: TaxBucket.unrealized
    }
  ]
};
function useTaxSummary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["tax-summary"],
    queryFn: async () => {
      if (!actor) return MOCK_TAX;
      try {
        return await actor.getTaxSummary();
      } catch {
        return MOCK_TAX;
      }
    },
    enabled: !isFetching
  });
}
function gainColor(amt) {
  return amt >= 0 ? "text-emerald-400" : "text-destructive";
}
function gainSign(amt) {
  return amt >= 0 ? "+" : "";
}
function PositionTable({
  positions,
  showRate,
  rateLabel,
  sectionTotal,
  totalTax,
  ocidPrefix
}) {
  if (positions.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "py-12 text-center text-muted-foreground text-sm",
        "data-ocid": `${ocidPrefix}.empty_state`,
        children: "No positions in this bucket."
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", "data-ocid": `${ocidPrefix}.table`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full data-table text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-xs uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-left font-medium", children: "Ticker" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-right font-medium", children: "Gain / Loss" }),
      showRate && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-right font-medium", children: "Tax Rate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-right font-medium", children: "Tax Liability" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: positions.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        "data-ocid": `${ocidPrefix}.item.${i + 1}`,
        className: "border-b border-border/40 hover:bg-muted/20 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 font-semibold text-primary tracking-wide", children: p.ticker }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              className: `py-3 text-right font-mono font-semibold tabular-nums ${gainColor(p.gainLossAmt)}`,
              children: [
                gainSign(p.gainLossAmt),
                formatINR(p.gainLossAmt, 0)
              ]
            }
          ),
          showRate && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-right text-muted-foreground", children: rateLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-right font-mono tabular-nums text-foreground", children: formatINR(p.taxLiability, 0) })
        ]
      },
      String(p.holdingId)
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tfoot", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t-2 border-border bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: showRate ? 2 : 1,
            className: "pt-3 pb-2 font-semibold text-foreground",
            children: "Section Total"
          }
        ),
        showRate && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "pt-3 pb-2 text-right text-muted-foreground text-xs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "pt-3 pb-2 font-mono font-bold text-right tabular-nums", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: gainColor(sectionTotal), children: [
          gainSign(sectionTotal),
          formatINR(sectionTotal, 0)
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: showRate ? 2 : 1,
            className: "pb-3 text-xs text-muted-foreground font-medium",
            children: "Total Tax"
          }
        ),
        showRate && /* @__PURE__ */ jsxRuntimeExports.jsx("td", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "pb-3 font-mono font-bold text-right tabular-nums text-accent", children: formatINR(totalTax, 0) })
      ] })
    ] })
  ] }) });
}
function TaxPage() {
  const { data: tax, isLoading, isError } = useTaxSummary();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  if (isError) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, {});
  const stcgPositions = (tax == null ? void 0 : tax.positions.filter((p) => p.bucket === TaxBucket.stcg)) ?? [];
  const ltcgPositions = (tax == null ? void 0 : tax.positions.filter((p) => p.bucket === TaxBucket.ltcg)) ?? [];
  const unrealizedPositions = (tax == null ? void 0 : tax.positions.filter((p) => p.bucket === TaxBucket.unrealized)) ?? [];
  const totalRealizedGains = ((tax == null ? void 0 : tax.stcgTotal) ?? 0) + ((tax == null ? void 0 : tax.ltcgTotal) ?? 0);
  const totalTaxLiability = ((tax == null ? void 0 : tax.stcgTax) ?? 0) + ((tax == null ? void 0 : tax.ltcgTax) ?? 0);
  const effectiveTaxRate = totalRealizedGains > 0 ? totalTaxLiability / totalRealizedGains * 100 : 0;
  const ltcgExemption = Math.min((tax == null ? void 0 : tax.ltcgTotal) ?? 0, 1e5);
  const ltcgTaxable = Math.max(((tax == null ? void 0 : tax.ltcgTotal) ?? 0) - ltcgExemption, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "tax.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Tax Analysis" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "FY 2025–26 · STCG, LTCG & Unrealized positions" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "tax.stcg_tax.card",
          label: "Total STCG Tax Liability",
          value: formatINR((tax == null ? void 0 : tax.stcgTax) ?? 0, 0),
          badge: "Rate: 15%",
          highlight: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "tax.ltcg_tax.card",
          label: "Total LTCG Tax Liability",
          value: formatINR((tax == null ? void 0 : tax.ltcgTax) ?? 0, 0),
          badge: "Rate: 10%"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          "data-ocid": "tax.unrealized.card",
          label: "Total Unrealized Gain / Loss",
          value: formatINR((tax == null ? void 0 : tax.unrealizedTotal) ?? 0, 0),
          badge: "Not Taxable Yet",
          trend: (tax == null ? void 0 : tax.unrealizedTotal) ?? 0
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "tax.buckets.card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Position Breakdown" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "stcg", "data-ocid": "tax.buckets.tabs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-4 w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "stcg",
              "data-ocid": "tax.stcg.tab",
              className: "flex items-center gap-1.5",
              children: [
                "Short-Term",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: stcgPositions.length })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "ltcg",
              "data-ocid": "tax.ltcg.tab",
              className: "flex items-center gap-1.5",
              children: [
                "Long-Term",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: ltcgPositions.length })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "unrealized",
              "data-ocid": "tax.unrealized.tab",
              className: "flex items-center gap-1.5",
              children: [
                "Unrealized",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: unrealizedPositions.length })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "stcg", "data-ocid": "tax.stcg.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start gap-2 rounded-md border border-accent/20 bg-accent/5 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-accent shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Short-Term Capital Gains apply to holdings sold within",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "365 days" }),
              ". Taxed at a flat",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-accent", children: "15%" }),
              " with no exemption limit."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PositionTable,
            {
              positions: stcgPositions,
              showRate: true,
              rateLabel: "15%",
              sectionTotal: (tax == null ? void 0 : tax.stcgTotal) ?? 0,
              totalTax: (tax == null ? void 0 : tax.stcgTax) ?? 0,
              ocidPrefix: "tax.stcg"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "ltcg", "data-ocid": "tax.ltcg.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Long-Term Capital Gains apply to holdings held for",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "≥365 days" }),
              ". Taxed at",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: "10%" }),
              " on gains above ₹1,00,000 exemption. Taxable amount:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatINR(ltcgTaxable, 0) }),
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PositionTable,
            {
              positions: ltcgPositions,
              showRate: true,
              rateLabel: "10%",
              sectionTotal: (tax == null ? void 0 : tax.ltcgTotal) ?? 0,
              totalTax: (tax == null ? void 0 : tax.ltcgTax) ?? 0,
              ocidPrefix: "tax.ltcg"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "unrealized", "data-ocid": "tax.unrealized.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start gap-2 rounded-md border border-border bg-muted/30 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-muted-foreground shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Current holdings not yet sold. The",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Potential Tax" }),
              " ",
              "is an estimate assuming you sell today. STCG or LTCG rules apply based on your holding period."
            ] })
          ] }),
          unrealizedPositions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "py-12 text-center text-muted-foreground text-sm",
              "data-ocid": "tax.unrealized.empty_state",
              children: "No unrealized positions found."
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "overflow-x-auto",
              "data-ocid": "tax.unrealized.table",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full data-table text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border text-xs uppercase tracking-wider text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-left font-medium", children: "Ticker" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-right font-medium", children: "Unrealized Gain / Loss" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-right font-medium", children: "Potential Tax (Est.)" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: unrealizedPositions.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    "data-ocid": `tax.unrealized.item.${i + 1}`,
                    className: "border-b border-border/40 hover:bg-muted/20 transition-colors",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 font-semibold text-primary tracking-wide", children: p.ticker }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "td",
                        {
                          className: `py-3 text-right font-mono font-semibold tabular-nums ${gainColor(p.gainLossAmt)}`,
                          children: [
                            gainSign(p.gainLossAmt),
                            formatINR(p.gainLossAmt, 0)
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-right font-mono tabular-nums text-muted-foreground", children: p.taxLiability > 0 ? formatINR(p.taxLiability, 0) : "—" })
                    ]
                  },
                  String(p.holdingId)
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t-2 border-border bg-muted/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "pt-3 pb-3 font-semibold text-foreground", children: "Total Unrealized" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "td",
                    {
                      className: `pt-3 pb-3 text-right font-mono font-bold tabular-nums ${gainColor((tax == null ? void 0 : tax.unrealizedTotal) ?? 0)}`,
                      children: [
                        gainSign((tax == null ? void 0 : tax.unrealizedTotal) ?? 0),
                        formatINR((tax == null ? void 0 : tax.unrealizedTotal) ?? 0, 0)
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "pt-3 pb-3 text-right text-muted-foreground font-mono text-xs", children: "Not realized" })
                ] }) })
              ] })
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "border-accent/30 bg-accent/5",
        "data-ocid": "tax.year_summary.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-accent inline-block" }),
            "FY 2025–26 Tax Year Summary"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium", children: "Total Realized Gains" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: `font-display text-xl font-bold tabular-nums ${gainColor(totalRealizedGains)}`,
                    "data-ocid": "tax.year_summary.realized_gains",
                    children: [
                      gainSign(totalRealizedGains),
                      formatINR(totalRealizedGains, 0)
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium", children: "STCG Tax" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display text-xl font-bold tabular-nums text-accent",
                    "data-ocid": "tax.year_summary.stcg_tax",
                    children: formatINR((tax == null ? void 0 : tax.stcgTax) ?? 0, 0)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium", children: "LTCG Tax" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display text-xl font-bold tabular-nums text-accent",
                    "data-ocid": "tax.year_summary.ltcg_tax",
                    children: formatINR((tax == null ? void 0 : tax.ltcgTax) ?? 0, 0)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium", children: "Total Tax Liability" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display text-xl font-bold tabular-nums text-accent",
                    "data-ocid": "tax.year_summary.total_tax",
                    children: formatINR(totalTaxLiability, 0)
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border/50 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-medium", children: "Estimated Effective Tax Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-display text-2xl font-bold text-foreground tabular-nums",
                  "data-ocid": "tax.year_summary.effective_rate",
                  children: formatPct(effectiveTaxRate, 2)
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3",
        "data-ocid": "tax.disclaimer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Disclaimer:" }),
            " Tax calculations are estimates based on available data. Actual tax liability may differ based on your total income, applicable surcharges, and other deductions. LTCG gains above ₹1,00,000 in a financial year are taxable at 10%. Consult a qualified tax advisor or Chartered Accountant for accurate tax filing."
          ] })
        ]
      }
    )
  ] });
}
export {
  TaxPage
};
