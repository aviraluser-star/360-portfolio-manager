import { ErrorState, PageLoader } from "@/components/LoadingSpinner";
import { MetricCard } from "@/components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaxSummary } from "@/hooks/useTax";
import { formatINR, formatPct } from "@/lib/formatters";
import { TaxBucket, type TaxPosition } from "@/types/portfolio";
import { AlertTriangle, Info } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

function gainColor(amt: number) {
  return amt >= 0 ? "text-emerald-400" : "text-destructive";
}

function gainSign(amt: number) {
  return amt >= 0 ? "+" : "";
}

// ── sub-components ────────────────────────────────────────────────────────────

interface PositionTableProps {
  positions: TaxPosition[];
  showRate: boolean;
  rateLabel?: string;
  sectionTotal: number;
  totalTax: number;
  ocidPrefix: string;
}

function PositionTable({
  positions,
  showRate,
  rateLabel,
  sectionTotal,
  totalTax,
  ocidPrefix,
}: PositionTableProps) {
  if (positions.length === 0) {
    return (
      <div
        className="py-12 text-center text-muted-foreground text-sm"
        data-ocid={`${ocidPrefix}.empty_state`}
      >
        No positions in this bucket.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-ocid={`${ocidPrefix}.table`}>
      <table className="w-full data-table text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <th className="pb-3 text-left font-medium">Ticker</th>
            <th className="pb-3 text-right font-medium">Gain / Loss</th>
            {showRate && (
              <th className="pb-3 text-right font-medium">Tax Rate</th>
            )}
            <th className="pb-3 text-right font-medium">Tax Liability</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p, i) => (
            <tr
              key={String(p.holdingId)}
              data-ocid={`${ocidPrefix}.item.${i + 1}`}
              className="border-b border-border/40 hover:bg-muted/20 transition-colors"
            >
              <td className="py-3 font-semibold text-primary tracking-wide">
                {p.ticker}
              </td>
              <td
                className={`py-3 text-right font-mono font-semibold tabular-nums ${gainColor(p.gainLossAmt)}`}
              >
                {gainSign(p.gainLossAmt)}
                {formatINR(p.gainLossAmt, 0)}
              </td>
              {showRate && (
                <td className="py-3 text-right text-muted-foreground">
                  {rateLabel}
                </td>
              )}
              <td className="py-3 text-right font-mono tabular-nums text-foreground">
                {formatINR(p.taxLiability, 0)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-muted/20">
            <td
              colSpan={showRate ? 2 : 1}
              className="pt-3 pb-2 font-semibold text-foreground"
            >
              Section Total
            </td>
            {showRate && (
              <td className="pt-3 pb-2 text-right text-muted-foreground text-xs" />
            )}
            <td className="pt-3 pb-2 font-mono font-bold text-right tabular-nums">
              <span className={gainColor(sectionTotal)}>
                {gainSign(sectionTotal)}
                {formatINR(sectionTotal, 0)}
              </span>
            </td>
          </tr>
          <tr className="bg-muted/10">
            <td
              colSpan={showRate ? 2 : 1}
              className="pb-3 text-xs text-muted-foreground font-medium"
            >
              Total Tax
            </td>
            {showRate && <td />}
            <td className="pb-3 font-mono font-bold text-right tabular-nums text-accent">
              {formatINR(totalTax, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export function TaxPage() {
  const { data: tax, isLoading, isError } = useTaxSummary();

  if (isLoading) return <PageLoader />;
  if (isError) return <ErrorState />;

  const stcgPositions =
    tax?.positions.filter((p) => p.bucket === TaxBucket.stcg) ?? [];
  const ltcgPositions =
    tax?.positions.filter((p) => p.bucket === TaxBucket.ltcg) ?? [];
  const unrealizedPositions =
    tax?.positions.filter((p) => p.bucket === TaxBucket.unrealized) ?? [];

  const totalRealizedGains = (tax?.stcgTotal ?? 0) + (tax?.ltcgTotal ?? 0);
  const totalTaxLiability = (tax?.stcgTax ?? 0) + (tax?.ltcgTax ?? 0);
  const effectiveTaxRate =
    totalRealizedGains > 0 ? (totalTaxLiability / totalRealizedGains) * 100 : 0;

  // LTCG exemption note — first ₹1L is exempt
  const ltcgExemption = Math.min(tax?.ltcgTotal ?? 0, 100000);
  const ltcgTaxable = Math.max((tax?.ltcgTotal ?? 0) - ltcgExemption, 0);

  return (
    <div className="space-y-6" data-ocid="tax.page">
      {/* Page header */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Tax Analysis
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          FY 2025–26 · STCG, LTCG & Unrealized positions
        </p>
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          data-ocid="tax.stcg_tax.card"
          label="Total STCG Tax Liability"
          value={formatINR(tax?.stcgTax ?? 0, 0)}
          badge="Rate: 15%"
          highlight
        />
        <MetricCard
          data-ocid="tax.ltcg_tax.card"
          label="Total LTCG Tax Liability"
          value={formatINR(tax?.ltcgTax ?? 0, 0)}
          badge="Rate: 10%"
        />
        <MetricCard
          data-ocid="tax.unrealized.card"
          label="Total Unrealized Gain / Loss"
          value={formatINR(tax?.unrealizedTotal ?? 0, 0)}
          badge="Not Taxable Yet"
          trend={tax?.unrealizedTotal ?? 0}
        />
      </div>

      {/* Three-bucket tabs */}
      <Card data-ocid="tax.buckets.card">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold text-foreground">
            Position Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="stcg" data-ocid="tax.buckets.tabs">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger
                value="stcg"
                data-ocid="tax.stcg.tab"
                className="flex items-center gap-1.5"
              >
                Short-Term
                <Badge variant="secondary" className="ml-1 text-xs">
                  {stcgPositions.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="ltcg"
                data-ocid="tax.ltcg.tab"
                className="flex items-center gap-1.5"
              >
                Long-Term
                <Badge variant="secondary" className="ml-1 text-xs">
                  {ltcgPositions.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="unrealized"
                data-ocid="tax.unrealized.tab"
                className="flex items-center gap-1.5"
              >
                Unrealized
                <Badge variant="secondary" className="ml-1 text-xs">
                  {unrealizedPositions.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* STCG Tab */}
            <TabsContent value="stcg" data-ocid="tax.stcg.section">
              <div className="mb-3 flex items-start gap-2 rounded-md border border-accent/20 bg-accent/5 p-3">
                <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Short-Term Capital Gains apply to holdings sold within{" "}
                  <span className="font-semibold text-foreground">
                    365 days
                  </span>
                  . Taxed at a flat{" "}
                  <span className="font-semibold text-accent">15%</span> with no
                  exemption limit.
                </p>
              </div>
              <PositionTable
                positions={stcgPositions}
                showRate
                rateLabel="15%"
                sectionTotal={tax?.stcgTotal ?? 0}
                totalTax={tax?.stcgTax ?? 0}
                ocidPrefix="tax.stcg"
              />
            </TabsContent>

            {/* LTCG Tab */}
            <TabsContent value="ltcg" data-ocid="tax.ltcg.section">
              <div className="mb-3 flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 p-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Long-Term Capital Gains apply to holdings held for{" "}
                  <span className="font-semibold text-foreground">
                    ≥365 days
                  </span>
                  . Taxed at{" "}
                  <span className="font-semibold text-primary">10%</span> on
                  gains above ₹1,00,000 exemption. Taxable amount:{" "}
                  <span className="font-semibold text-foreground">
                    {formatINR(ltcgTaxable, 0)}
                  </span>
                  .
                </p>
              </div>
              <PositionTable
                positions={ltcgPositions}
                showRate
                rateLabel="10%"
                sectionTotal={tax?.ltcgTotal ?? 0}
                totalTax={tax?.ltcgTax ?? 0}
                ocidPrefix="tax.ltcg"
              />
            </TabsContent>

            {/* Unrealized Tab */}
            <TabsContent value="unrealized" data-ocid="tax.unrealized.section">
              <div className="mb-3 flex items-start gap-2 rounded-md border border-border bg-muted/30 p-3">
                <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Current holdings not yet sold. The{" "}
                  <span className="font-semibold text-foreground">
                    Potential Tax
                  </span>{" "}
                  is an estimate assuming you sell today. STCG or LTCG rules
                  apply based on your holding period.
                </p>
              </div>
              {unrealizedPositions.length === 0 ? (
                <div
                  className="py-12 text-center text-muted-foreground text-sm"
                  data-ocid="tax.unrealized.empty_state"
                >
                  No unrealized positions found.
                </div>
              ) : (
                <div
                  className="overflow-x-auto"
                  data-ocid="tax.unrealized.table"
                >
                  <table className="w-full data-table text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3 text-left font-medium">Ticker</th>
                        <th className="pb-3 text-right font-medium">
                          Unrealized Gain / Loss
                        </th>
                        <th className="pb-3 text-right font-medium">
                          Potential Tax (Est.)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {unrealizedPositions.map((p, i) => (
                        <tr
                          key={String(p.holdingId)}
                          data-ocid={`tax.unrealized.item.${i + 1}`}
                          className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-3 font-semibold text-primary tracking-wide">
                            {p.ticker}
                          </td>
                          <td
                            className={`py-3 text-right font-mono font-semibold tabular-nums ${gainColor(p.gainLossAmt)}`}
                          >
                            {gainSign(p.gainLossAmt)}
                            {formatINR(p.gainLossAmt, 0)}
                          </td>
                          <td className="py-3 text-right font-mono tabular-nums text-muted-foreground">
                            {p.taxLiability > 0
                              ? formatINR(p.taxLiability, 0)
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border bg-muted/20">
                        <td className="pt-3 pb-3 font-semibold text-foreground">
                          Total Unrealized
                        </td>
                        <td
                          className={`pt-3 pb-3 text-right font-mono font-bold tabular-nums ${gainColor(tax?.unrealizedTotal ?? 0)}`}
                        >
                          {gainSign(tax?.unrealizedTotal ?? 0)}
                          {formatINR(tax?.unrealizedTotal ?? 0, 0)}
                        </td>
                        <td className="pt-3 pb-3 text-right text-muted-foreground font-mono text-xs">
                          Not realized
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tax year summary card */}
      <Card
        className="border-accent/30 bg-accent/5"
        data-ocid="tax.year_summary.card"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent inline-block" />
            FY 2025–26 Tax Year Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">
                Total Realized Gains
              </p>
              <p
                className={`font-display text-xl font-bold tabular-nums ${gainColor(totalRealizedGains)}`}
                data-ocid="tax.year_summary.realized_gains"
              >
                {gainSign(totalRealizedGains)}
                {formatINR(totalRealizedGains, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">
                STCG Tax
              </p>
              <p
                className="font-display text-xl font-bold tabular-nums text-accent"
                data-ocid="tax.year_summary.stcg_tax"
              >
                {formatINR(tax?.stcgTax ?? 0, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">
                LTCG Tax
              </p>
              <p
                className="font-display text-xl font-bold tabular-nums text-accent"
                data-ocid="tax.year_summary.ltcg_tax"
              >
                {formatINR(tax?.ltcgTax ?? 0, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1 font-medium">
                Total Tax Liability
              </p>
              <p
                className="font-display text-xl font-bold tabular-nums text-accent"
                data-ocid="tax.year_summary.total_tax"
              >
                {formatINR(totalTaxLiability, 0)}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Estimated Effective Tax Rate
            </p>
            <p
              className="font-display text-2xl font-bold text-foreground tabular-nums"
              data-ocid="tax.year_summary.effective_rate"
            >
              {formatPct(effectiveTaxRate, 2)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div
        className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3"
        data-ocid="tax.disclaimer"
      >
        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Disclaimer:</span> Tax
          calculations are estimates based on available data. Actual tax
          liability may differ based on your total income, applicable
          surcharges, and other deductions. LTCG gains above ₹1,00,000 in a
          financial year are taxable at 10%. Consult a qualified tax advisor or
          Chartered Accountant for accurate tax filing.
        </p>
      </div>
    </div>
  );
}
