import { ErrorState, PageLoader } from "@/components/LoadingSpinner";
import { MetricCard } from "@/components/MetricCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  useAddHolding,
  useDeleteHolding,
  useHoldings,
  useUpdateHolding,
} from "@/hooks/usePortfolio";
import { NSE_STOCKS } from "@/lib/constants";
import { formatDate, formatINR, formatPct } from "@/lib/formatters";
import { AssetClass } from "@/types/portfolio";
import type { Holding, HoldingInput } from "@/types/portfolio";
import {
  AlertTriangle,
  CheckCircle2,
  Pencil,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Mock current price map (±5–25% from purchase) ──────────────────────────
const MOCK_PRICE_MULTIPLIERS: Record<string, number> = {
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
  ULTRACEMCO: 1.21,
};

function mockCurrentPrice(ticker: string, purchasePrice: number): number {
  const mult =
    MOCK_PRICE_MULTIPLIERS[ticker] ?? 1 + Math.sin(ticker.length) * 0.15;
  return Math.round(purchasePrice * mult * 100) / 100;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type AssetFilter = "all" | "equity" | "mutualFund";

interface CsvRow {
  ticker: string;
  companyName: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  assetClass: AssetClass;
  valid: boolean;
  error?: string;
}

const EMPTY_FORM: HoldingInput = {
  ticker: "",
  companyName: "",
  quantity: 0,
  purchasePrice: 0,
  purchaseDate: BigInt(Date.now()) * 1_000_000n,
  assetClass: AssetClass.equity,
};

// ─── CSV Import Dialog ────────────────────────────────────────────────────────
function CsvImportDialog({
  open,
  onClose,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (rows: CsvRow[]) => void;
  isPending: boolean;
}) {
  const [rows, setRows] = useState<CsvRow[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function parseCSV(text: string): CsvRow[] {
    const lines = text.trim().split("\n").filter(Boolean);
    const dataLines = lines[0]?.toLowerCase().includes("ticker")
      ? lines.slice(1)
      : lines;
    return dataLines.map((line) => {
      const parts = line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
      const [ticker, companyName, qtyStr, priceStr, dateStr, assetClassStr] =
        parts;
      const quantity = Number.parseFloat(qtyStr ?? "");
      const purchasePrice = Number.parseFloat(priceStr ?? "");
      const assetClass =
        assetClassStr?.toLowerCase() === "mutualfund" ||
        assetClassStr?.toLowerCase() === "mutual fund"
          ? AssetClass.mutualFund
          : AssetClass.equity;

      if (
        !ticker ||
        !companyName ||
        Number.isNaN(quantity) ||
        Number.isNaN(purchasePrice) ||
        quantity <= 0 ||
        purchasePrice <= 0
      ) {
        return {
          ticker: ticker ?? "?",
          companyName: companyName ?? "?",
          quantity,
          purchasePrice,
          purchaseDate: dateStr ?? "",
          assetClass,
          valid: false,
          error: "Invalid row",
        };
      }
      return {
        ticker: ticker.toUpperCase(),
        companyName,
        quantity,
        purchasePrice,
        purchaseDate: dateStr ?? new Date().toISOString().split("T")[0],
        assetClass,
        valid: true,
      };
    });
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRows(parseCSV(text));
    };
    reader.readAsText(file);
  }

  const validRows = rows?.filter((r) => r.valid) ?? [];
  const invalidRows = rows?.filter((r) => !r.valid) ?? [];

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setRows(null);
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-2xl"
        data-ocid="holdings.csv_import.dialog"
      >
        <DialogHeader>
          <DialogTitle>Import Holdings from CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            Expected columns:{" "}
            <span className="font-mono text-foreground">
              ticker, company, qty, price, date (YYYY-MM-DD), assetClass
              (equity/mutualFund)
            </span>
          </div>
          {!rows ? (
            <button
              type="button"
              className="w-full flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border py-10 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileRef.current?.click()}
              data-ocid="holdings.csv_import.dropzone"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to select a CSV file
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleFile}
              />
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> {validRows.length} valid
                </span>
                {invalidRows.length > 0 && (
                  <span className="flex items-center gap-1.5 text-destructive">
                    <XCircle className="h-4 w-4" /> {invalidRows.length} invalid
                  </span>
                )}
              </div>
              <div className="max-h-56 overflow-y-auto rounded-md border border-border">
                <table className="w-full data-table text-xs">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Ticker</th>
                      <th className="px-3 py-2 text-left">Company</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-right">Price (₹)</th>
                      <th className="px-3 py-2 text-left">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={`${row.ticker}-${i}`}
                        className={`border-b border-border/40 ${row.valid ? "" : "opacity-50"}`}
                      >
                        <td className="px-3 py-1.5">
                          {row.valid ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-destructive" />
                          )}
                        </td>
                        <td className="px-3 py-1.5 font-semibold text-primary">
                          {row.ticker}
                        </td>
                        <td className="px-3 py-1.5 max-w-[120px] truncate">
                          {row.companyName}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          {row.quantity}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          {formatINR(row.purchasePrice)}
                        </td>
                        <td className="px-3 py-1.5">
                          <Badge variant="secondary" className="text-xs">
                            {row.assetClass}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {invalidRows.length > 0 && (
                <div className="alert-banner text-xs flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  Invalid rows will be skipped during import.
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setRows(null);
              onClose();
            }}
            data-ocid="holdings.csv_import.cancel_button"
          >
            Cancel
          </Button>
          {rows && validRows.length > 0 && (
            <Button
              onClick={() => onConfirm(validRows)}
              disabled={isPending}
              data-ocid="holdings.csv_import.confirm_button"
            >
              {isPending
                ? "Importing..."
                : `Import ${validRows.length} Holdings`}
            </Button>
          )}
          {rows && validRows.length === 0 && (
            <Button
              variant="outline"
              onClick={() => setRows(null)}
              data-ocid="holdings.csv_import.retry_button"
            >
              Try another file
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Holding Form Dialog ──────────────────────────────────────────────────────
function HoldingFormDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  initial,
  mode,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HoldingInput) => void;
  isPending: boolean;
  initial?: HoldingInput;
  mode: "add" | "edit";
}) {
  const [form, setForm] = useState<HoldingInput>(initial ?? EMPTY_FORM);
  const [tickerQuery, setTickerQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = NSE_STOCKS.filter(
    (s) =>
      tickerQuery.length > 0 &&
      (s.ticker.startsWith(tickerQuery.toUpperCase()) ||
        s.companyName.toLowerCase().includes(tickerQuery.toLowerCase())),
  ).slice(0, 6);

  function handleTickerInput(val: string) {
    setTickerQuery(val);
    setForm((f) => ({ ...f, ticker: val.toUpperCase() }));
    setShowSuggestions(true);
  }

  function selectSuggestion(ticker: string, companyName: string) {
    setForm((f) => ({ ...f, ticker, companyName }));
    setTickerQuery(ticker);
    setShowSuggestions(false);
  }

  function handleOpen(v: boolean) {
    if (!v) {
      setForm(initial ?? EMPTY_FORM);
      setTickerQuery(initial?.ticker ?? "");
      setShowSuggestions(false);
      onClose();
    }
  }

  // sync form if initial changes (for edit)
  useState(() => {
    if (initial) {
      setForm(initial);
      setTickerQuery(initial.ticker);
    }
  });

  const dateValue = (() => {
    try {
      return new Date(Number(form.purchaseDate / 1_000_000n))
        .toISOString()
        .split("T")[0];
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  })();

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent data-ocid="holdings.form.dialog">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Holding" : "Edit Holding"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {/* Ticker + autosuggest */}
          <div className="relative space-y-1.5">
            <Label>Ticker Symbol</Label>
            <Input
              placeholder="e.g. TCS"
              value={tickerQuery}
              onChange={(e) => handleTickerInput(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              autoComplete="off"
              data-ocid="holdings.form.ticker.input"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full rounded-md border border-border bg-popover shadow-lg top-full mt-1">
                {suggestions.map((s) => (
                  <button
                    key={s.ticker}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-3 first:rounded-t-md last:rounded-b-md"
                    onMouseDown={() =>
                      selectSuggestion(s.ticker, s.companyName)
                    }
                  >
                    <span className="font-mono font-semibold text-primary w-24 shrink-0">
                      {s.ticker}
                    </span>
                    <span className="text-muted-foreground truncate">
                      {s.companyName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Company Name</Label>
            <Input
              placeholder="Tata Consultancy Services"
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
              data-ocid="holdings.form.company.input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                value={form.quantity || ""}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
                data-ocid="holdings.form.quantity.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Purchase Price (₹)</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.purchasePrice || ""}
                onChange={(e) =>
                  setForm({ ...form, purchasePrice: Number(e.target.value) })
                }
                data-ocid="holdings.form.price.input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Purchase Date</Label>
              <Input
                type="date"
                value={dateValue}
                onChange={(e) => {
                  const ms = new Date(e.target.value).getTime();
                  setForm({ ...form, purchaseDate: BigInt(ms) * 1_000_000n });
                }}
                data-ocid="holdings.form.date.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Asset Class</Label>
              <Select
                value={form.assetClass}
                onValueChange={(v) =>
                  setForm({ ...form, assetClass: v as AssetClass })
                }
              >
                <SelectTrigger data-ocid="holdings.form.asset_class.select">
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
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpen(false)}
            data-ocid="holdings.form.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={
              isPending ||
              !form.ticker ||
              !form.companyName ||
              form.quantity <= 0 ||
              form.purchasePrice <= 0
            }
            data-ocid="holdings.form.submit_button"
          >
            {isPending
              ? mode === "add"
                ? "Adding..."
                : "Saving..."
              : mode === "add"
                ? "Add Holding"
                : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirmDialog({
  holding,
  onConfirm,
  onCancel,
  isPending,
}: {
  holding: Holding | null;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <AlertDialog open={!!holding}>
      <AlertDialogContent data-ocid="holdings.delete.dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {holding?.ticker}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove <strong>{holding?.companyName}</strong>{" "}
            ({holding?.quantity} units) from your portfolio.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            data-ocid="holdings.delete.cancel_button"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-ocid="holdings.delete.confirm_button"
          >
            {isPending ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function HoldingsPage() {
  const { data: holdings, isLoading, isError } = useHoldings();
  const addHolding = useAddHolding();
  const updateHolding = useUpdateHolding();
  const deleteHolding = useDeleteHolding();

  const [addOpen, setAddOpen] = useState(false);
  const [editHolding, setEditHolding] = useState<Holding | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Holding | null>(null);
  const [csvOpen, setCsvOpen] = useState(false);
  const [filter, setFilter] = useState<AssetFilter>("all");
  const [csvPending, setCsvPending] = useState(false);

  const filtered = (holdings ?? []).filter((h) =>
    filter === "all" ? true : h.assetClass === filter,
  );

  const enriched = filtered.map((h) => {
    const currentPrice = mockCurrentPrice(h.ticker, h.purchasePrice);
    const invested = h.purchasePrice * h.quantity;
    const currentValue = currentPrice * h.quantity;
    const gainLossAmt = currentValue - invested;
    const gainLossPct = invested > 0 ? (gainLossAmt / invested) * 100 : 0;
    return {
      ...h,
      currentPrice,
      invested,
      currentValue,
      gainLossAmt,
      gainLossPct,
    };
  });

  const totalInvested = enriched.reduce((s, h) => s + h.invested, 0);
  const totalCurrentValue = enriched.reduce((s, h) => s + h.currentValue, 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalGainLossPct =
    totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  const handleAdd = useCallback(
    async (data: HoldingInput) => {
      try {
        await addHolding.mutateAsync(data);
        toast.success("Holding added successfully");
        setAddOpen(false);
      } catch {
        toast.error("Failed to add holding");
      }
    },
    [addHolding],
  );

  const handleEdit = useCallback(
    async (data: HoldingInput) => {
      if (!editHolding) return;
      try {
        await updateHolding.mutateAsync({ id: editHolding.id, input: data });
        toast.success(`${editHolding.ticker} updated`);
        setEditHolding(null);
      } catch {
        toast.error("Failed to update holding");
      }
    },
    [editHolding, updateHolding],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteHolding.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.ticker} removed`);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to remove holding");
    }
  }, [deleteTarget, deleteHolding]);

  const handleCsvImport = useCallback(
    async (rows: CsvRow[]) => {
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
            purchaseDate:
              BigInt(Number.isNaN(dateMs) ? Date.now() : dateMs) * 1_000_000n,
            assetClass: row.assetClass,
          });
          success++;
        } catch {
          failed++;
        }
      }
      setCsvPending(false);
      setCsvOpen(false);
      if (success > 0)
        toast.success(`Imported ${success} holding${success > 1 ? "s" : ""}`);
      if (failed > 0)
        toast.error(
          `${failed} holding${failed > 1 ? "s" : ""} failed to import`,
        );
    },
    [addHolding],
  );

  if (isLoading) return <PageLoader />;
  if (isError) return <ErrorState />;

  const editInitial: HoldingInput | undefined = editHolding
    ? {
        ticker: editHolding.ticker,
        companyName: editHolding.companyName,
        quantity: editHolding.quantity,
        purchasePrice: editHolding.purchasePrice,
        purchaseDate: editHolding.purchaseDate,
        assetClass: editHolding.assetClass,
      }
    : undefined;

  return (
    <div className="space-y-6" data-ocid="holdings.page">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Holdings
          </h2>
          <p className="text-sm text-muted-foreground">
            {holdings?.length ?? 0} positions tracked
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCsvOpen(true)}
            data-ocid="holdings.csv_import_button"
          >
            <Upload className="h-4 w-4 mr-1.5" /> Import CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            data-ocid="holdings.add_button"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Add Holding
          </Button>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          label="Total Invested"
          value={formatINR(totalInvested, 0)}
        />
        <MetricCard
          label="Current Value"
          value={formatINR(totalCurrentValue, 0)}
          highlight
        />
        <MetricCard
          label="Total Gain/Loss"
          value={formatINR(totalGainLoss, 0)}
          badge={totalGainLoss >= 0 ? "+" : "−"}
        />
        <MetricCard
          label="Return"
          value={formatPct(totalGainLossPct)}
          highlight={totalGainLossPct >= 0}
        />
      </div>

      {/* Filter tabs */}
      <div
        className="flex items-center gap-1.5"
        data-ocid="holdings.filter.tab"
      >
        {(["all", "equity", "mutualFund"] as AssetFilter[]).map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            data-ocid={`holdings.filter.${f}`}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f === "equity" ? "Equity" : "Mutual Fund"}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            {filter === "all"
              ? "All Positions"
              : filter === "equity"
                ? "Equity Positions"
                : "Mutual Fund Positions"}
            <span className="ml-2 font-normal text-muted-foreground">
              ({enriched.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enriched.length === 0 ? (
            <div className="py-14 text-center" data-ocid="holdings.empty_state">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-display text-base font-semibold text-foreground mb-1">
                No holdings yet
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Start building your portfolio by adding your first position.
              </p>
              <Button
                variant="outline"
                onClick={() => setAddOpen(true)}
                data-ocid="holdings.add_first_button"
              >
                Add your first holding
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full data-table">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                    <th className="px-2 pb-2.5 text-left font-medium">
                      Ticker
                    </th>
                    <th className="px-2 pb-2.5 text-left font-medium">
                      Company
                    </th>
                    <th className="px-2 pb-2.5 text-right font-medium">Qty</th>
                    <th className="px-2 pb-2.5 text-right font-medium">
                      Avg Price ₹
                    </th>
                    <th className="px-2 pb-2.5 text-right font-medium">
                      Current ₹
                    </th>
                    <th className="px-2 pb-2.5 text-right font-medium">
                      Gain/Loss ₹
                    </th>
                    <th className="px-2 pb-2.5 text-right font-medium">
                      Gain/Loss %
                    </th>
                    <th className="px-2 pb-2.5 text-left font-medium">Class</th>
                    <th className="px-2 pb-2.5 text-left font-medium hidden sm:table-cell">
                      Date
                    </th>
                    <th className="px-2 pb-2.5 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enriched.map((h, i) => {
                    const isGain = h.gainLossAmt >= 0;
                    return (
                      <tr
                        key={String(h.id)}
                        data-ocid={`holdings.item.${i + 1}`}
                        className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-2 py-3 font-semibold text-primary">
                          {h.ticker}
                        </td>
                        <td className="px-2 py-3 text-foreground/80 max-w-[140px] truncate">
                          {h.companyName}
                        </td>
                        <td className="px-2 py-3 text-right">{h.quantity}</td>
                        <td className="px-2 py-3 text-right">
                          {formatINR(h.purchasePrice)}
                        </td>
                        <td className="px-2 py-3 text-right font-semibold">
                          {formatINR(h.currentPrice)}
                        </td>
                        <td
                          className={`px-2 py-3 text-right font-semibold ${isGain ? "text-emerald-400" : "text-destructive"}`}
                        >
                          <span className="flex items-center justify-end gap-1">
                            {isGain ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {formatINR(Math.abs(h.gainLossAmt), 0)}
                          </span>
                        </td>
                        <td
                          className={`px-2 py-3 text-right font-semibold ${isGain ? "text-emerald-400" : "text-destructive"}`}
                        >
                          <span className="metric-badge">
                            {formatPct(h.gainLossPct)}
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <Badge variant="secondary" className="text-xs">
                            {h.assetClass === AssetClass.equity
                              ? "Equity"
                              : "Mutual Fund"}
                          </Badge>
                        </td>
                        <td className="px-2 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                          {formatDate(h.purchaseDate)}
                        </td>
                        <td className="px-2 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                              onClick={() => setEditHolding(h)}
                              aria-label={`Edit ${h.ticker}`}
                              data-ocid={`holdings.edit_button.${i + 1}`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteTarget(h)}
                              aria-label={`Delete ${h.ticker}`}
                              data-ocid={`holdings.delete_button.${i + 1}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Total row */}
                <tfoot>
                  <tr className="border-t-2 border-border bg-muted/20 font-semibold text-sm">
                    <td className="px-2 py-3" colSpan={2}>
                      Total
                    </td>
                    <td className="px-2 py-3 text-right text-muted-foreground">
                      {enriched.reduce((s, h) => s + h.quantity, 0)}
                    </td>
                    <td className="px-2 py-3 text-right">
                      {formatINR(totalInvested, 0)}
                    </td>
                    <td className="px-2 py-3 text-right">
                      {formatINR(totalCurrentValue, 0)}
                    </td>
                    <td
                      className={`px-2 py-3 text-right ${totalGainLoss >= 0 ? "text-emerald-400" : "text-destructive"}`}
                    >
                      {formatINR(totalGainLoss, 0)}
                    </td>
                    <td
                      className={`px-2 py-3 text-right ${totalGainLoss >= 0 ? "text-emerald-400" : "text-destructive"}`}
                    >
                      <span className="metric-badge">
                        {formatPct(totalGainLossPct)}
                      </span>
                    </td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add dialog */}
      <HoldingFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        isPending={addHolding.isPending}
        mode="add"
      />

      {/* Edit dialog */}
      <HoldingFormDialog
        open={!!editHolding}
        onClose={() => setEditHolding(null)}
        onSubmit={handleEdit}
        isPending={updateHolding.isPending}
        initial={editInitial}
        mode="edit"
        key={editHolding ? String(editHolding.id) : "edit"}
      />

      {/* Delete confirm */}
      <DeleteConfirmDialog
        holding={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={deleteHolding.isPending}
      />

      {/* CSV Import */}
      <CsvImportDialog
        open={csvOpen}
        onClose={() => setCsvOpen(false)}
        onConfirm={handleCsvImport}
        isPending={csvPending}
      />
    </div>
  );
}
