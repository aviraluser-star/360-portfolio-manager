import { ErrorState } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddHolding } from "@/hooks/usePortfolio";
import { useRecommendations } from "@/hooks/useRecommendations";
import { formatINR, formatPct } from "@/lib/formatters";
import { Action, AssetClass, RiskRating } from "@/types/portfolio";
import type { HoldingInput, StockRecommendation } from "@/types/portfolio";
import {
  CalendarClock,
  Minus,
  PlusCircle,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Style maps ────────────────────────────────────────────────────────────────

const ACTION_BADGE: Record<Action, string> = {
  [Action.buy]:
    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  [Action.hold]: "bg-muted text-muted-foreground border border-border",
  [Action.sell]:
    "bg-destructive/15 text-destructive border border-destructive/30",
};

const RISK_BADGE: Record<RiskRating, string> = {
  [RiskRating.low]:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  [RiskRating.medium]: "bg-accent/10 text-accent border border-accent/20",
  [RiskRating.high]:
    "bg-destructive/10 text-destructive border border-destructive/20",
};

const ACTION_LABEL: Record<Action, string> = {
  [Action.buy]: "BUY",
  [Action.hold]: "HOLD",
  [Action.sell]: "SELL",
};

const RISK_LABEL: Record<RiskRating, string> = {
  [RiskRating.low]: "Low Risk",
  [RiskRating.medium]: "Med Risk",
  [RiskRating.high]: "High Risk",
};

// ── Filter types ─────────────────────────────────────────────────────────────

type ActionFilter = "all" | Action;
type RiskFilter = "all" | RiskRating;

// ── Add Holding Dialog ────────────────────────────────────────────────────────

interface AddHoldingDialogProps {
  rec: StockRecommendation | null;
  onClose: () => void;
}

function AddHoldingDialog({ rec, onClose }: AddHoldingDialogProps) {
  const addHolding = useAddHolding();
  const [qty, setQty] = useState("1");
  const [assetClass, setAssetClass] = useState<AssetClass>(AssetClass.equity);

  const open = rec !== null;

  function handleSubmit() {
    if (!rec) return;
    const quantity = Number.parseFloat(qty);
    if (Number.isNaN(quantity) || quantity <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }
    const input: HoldingInput = {
      ticker: rec.ticker,
      companyName: rec.companyName,
      purchasePrice: rec.currentPrice,
      purchaseDate: BigInt(Date.now()) * 1_000_000n,
      quantity,
      assetClass,
    };
    addHolding.mutate(input, {
      onSuccess: () => {
        toast.success(`${rec.ticker} added to portfolio`);
        onClose();
        setQty("1");
      },
      onError: () => toast.error("Failed to add holding"),
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-md bg-card border-border"
        data-ocid="add-holding.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            Add to Portfolio
          </DialogTitle>
        </DialogHeader>

        {rec && (
          <div className="space-y-4 pt-1">
            {/* Stock info summary */}
            <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
              <div>
                <p className="font-display font-bold text-foreground text-sm">
                  {rec.ticker}
                </p>
                <p className="text-xs text-muted-foreground">
                  {rec.companyName}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-foreground">
                  {formatINR(rec.currentPrice)}
                </p>
                <p
                  className={`text-xs font-mono font-semibold ${
                    rec.expectedReturn >= 0
                      ? "text-emerald-400"
                      : "text-destructive"
                  }`}
                >
                  {formatPct(rec.expectedReturn)} exp.
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <Label htmlFor="qty" className="text-sm">
                Quantity
              </Label>
              <Input
                id="qty"
                type="number"
                min="0.01"
                step="0.01"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="font-mono"
                data-ocid="add-holding.qty.input"
              />
            </div>

            {/* Asset class */}
            <div className="space-y-1.5">
              <Label className="text-sm">Asset Class</Label>
              <Select
                value={assetClass}
                onValueChange={(v) => setAssetClass(v as AssetClass)}
              >
                <SelectTrigger data-ocid="add-holding.asset-class.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AssetClass.equity}>Equity</SelectItem>
                  <SelectItem value={AssetClass.mutualFund}>
                    Mutual Fund
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimated cost */}
            <div className="rounded-md bg-muted/50 px-3 py-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Cost</span>
              <span className="font-mono font-semibold text-foreground">
                {formatINR(rec.currentPrice * (Number.parseFloat(qty) || 0))}
              </span>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="add-holding.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={addHolding.isPending}
            data-ocid="add-holding.submit_button"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {addHolding.isPending ? "Adding…" : "Add Holding"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function RecommendationsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-border">
            <CardHeader className="pb-2 space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3 w-36" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function RecommendationsPage() {
  const { data: recs, isLoading, isError } = useRecommendations();
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [addTarget, setAddTarget] = useState<StockRecommendation | null>(null);

  if (isLoading) return <RecommendationsSkeleton />;
  if (isError) return <ErrorState />;

  const allRecs = recs ?? [];

  const buys = allRecs.filter((r) => r.action === Action.buy);
  const holds = allRecs.filter((r) => r.action === Action.hold);
  const sells = allRecs.filter((r) => r.action === Action.sell);

  const filtered = allRecs.filter((r) => {
    const matchAction = actionFilter === "all" || r.action === actionFilter;
    const matchRisk = riskFilter === "all" || r.riskRating === riskFilter;
    return matchAction && matchRisk;
  });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="space-y-6" data-ocid="recommendations.page">
        {/* ── Header ── */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground leading-tight">
              Daily Recommendations
            </h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <CalendarClock className="w-3.5 h-3.5 shrink-0" />
              {today}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full w-fit">
            <RefreshCw className="w-3 h-3 shrink-0 text-primary" />
            Refreshes daily
          </div>
        </div>

        {/* ── Summary stats ── */}
        <div
          className="flex flex-wrap gap-3"
          data-ocid="recommendations.summary.section"
        >
          <div className="metric-badge gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">{buys.length}</span>
            <span>Buy signals</span>
          </div>
          <div className="metric-badge gap-1.5">
            <Minus className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-bold">{holds.length}</span>
            <span>Hold</span>
          </div>
          <div className="metric-badge gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-destructive" />
            <span className="text-destructive font-bold">{sells.length}</span>
            <span>Sell</span>
          </div>
          <div className="metric-badge gap-1.5 ml-auto">
            <span className="text-muted-foreground">
              {allRecs.length} total picks
            </span>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div
          className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-card border border-border"
          data-ocid="recommendations.filter.section"
        >
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mr-1">
            Filter
          </span>

          {/* Action filter */}
          <div className="flex gap-1.5" aria-label="Filter by action">
            {(["all", Action.buy, Action.hold, Action.sell] as const).map(
              (val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setActionFilter(val)}
                  data-ocid={`recommendations.action-filter.${val}`}
                  className={`text-xs px-3 py-1 rounded-full border transition-smooth font-medium ${
                    actionFilter === val
                      ? val === "all"
                        ? "bg-primary text-primary-foreground border-primary"
                        : val === Action.buy
                          ? "bg-emerald-500/25 text-emerald-400 border-emerald-500/50"
                          : val === Action.sell
                            ? "bg-destructive/25 text-destructive border-destructive/50"
                            : "bg-muted text-foreground border-border"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {val === "all" ? "All Actions" : ACTION_LABEL[val]}
                </button>
              ),
            )}
          </div>

          <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

          {/* Risk filter */}
          <div className="flex gap-1.5" aria-label="Filter by risk">
            {(
              [
                "all",
                RiskRating.low,
                RiskRating.medium,
                RiskRating.high,
              ] as const
            ).map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setRiskFilter(val)}
                data-ocid={`recommendations.risk-filter.${val}`}
                className={`text-xs px-3 py-1 rounded-full border transition-smooth font-medium ${
                  riskFilter === val
                    ? val === "all"
                      ? "bg-primary text-primary-foreground border-primary"
                      : val === RiskRating.low
                        ? "bg-emerald-500/25 text-emerald-400 border-emerald-500/50"
                        : val === RiskRating.high
                          ? "bg-destructive/25 text-destructive border-destructive/50"
                          : "bg-accent/25 text-accent border-accent/50"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {val === "all" ? "All Risk" : RISK_LABEL[val]}
              </button>
            ))}
          </div>

          {/* Result count */}
          {(actionFilter !== "all" || riskFilter !== "all") && (
            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* ── Cards grid ── */}
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-dashed border-border"
            data-ocid="recommendations.empty_state"
          >
            <TrendingUp className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              No recommendations match this filter
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-xs"
              onClick={() => {
                setActionFilter("all");
                setRiskFilter("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r, i) => (
              <RecommendationCard
                key={r.ticker}
                rec={r}
                index={i + 1}
                onAddToPortfolio={() => setAddTarget(r)}
              />
            ))}
          </div>
        )}
      </div>

      <AddHoldingDialog rec={addTarget} onClose={() => setAddTarget(null)} />
    </>
  );
}

// ── Recommendation Card ───────────────────────────────────────────────────────

interface RecommendationCardProps {
  rec: StockRecommendation;
  index: number;
  onAddToPortfolio: () => void;
}

function RecommendationCard({
  rec,
  index,
  onAddToPortfolio,
}: RecommendationCardProps) {
  const returnPositive = rec.expectedReturn >= 0;
  const returnColor = returnPositive ? "text-emerald-400" : "text-destructive";
  const ReturnIcon = returnPositive ? TrendingUp : TrendingDown;

  return (
    <Card
      data-ocid={`recommendations.item.${index}`}
      className="flex flex-col border-border bg-card transition-smooth hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 group"
    >
      {/* ── Card header ── */}
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display font-bold text-base text-foreground tracking-wide">
              {rec.ticker}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {rec.companyName}
            </p>
          </div>
          <Badge
            className={`text-xs font-bold shrink-0 ${ACTION_BADGE[rec.action]}`}
          >
            {ACTION_LABEL[rec.action]}
          </Badge>
        </div>
      </CardHeader>

      {/* ── Card body ── */}
      <CardContent className="flex-1 flex flex-col gap-3 px-4 pb-4">
        {/* Prices */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted/50 px-2.5 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-0.5">
              Current
            </p>
            <p className="font-mono text-sm font-semibold text-foreground">
              {formatINR(rec.currentPrice)}
            </p>
          </div>
          <div className="rounded-md bg-primary/5 border border-primary/10 px-2.5 py-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-0.5">
              Target
            </p>
            <p className="font-mono text-sm font-semibold text-primary">
              {formatINR(rec.targetPrice)}
            </p>
          </div>
        </div>

        {/* Return + Risk */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ReturnIcon className={`w-3.5 h-3.5 ${returnColor}`} />
            <span className={`font-mono font-bold text-sm ${returnColor}`}>
              {formatPct(rec.expectedReturn)}
            </span>
            <span className="text-[10px] text-muted-foreground">expected</span>
          </div>
          <Badge
            className={`text-[10px] font-semibold ${RISK_BADGE[rec.riskRating]}`}
          >
            {RISK_LABEL[rec.riskRating]}
          </Badge>
        </div>

        {/* Add to portfolio CTA */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-auto border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-smooth text-xs gap-1.5"
          onClick={onAddToPortfolio}
          data-ocid={`recommendations.add-to-portfolio.${index}`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add to Portfolio
        </Button>
      </CardContent>
    </Card>
  );
}
