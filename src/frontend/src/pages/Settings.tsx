import { BrokerSelect } from "@/components/BrokerSelect";
import { ErrorState, PageLoader } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddBroker, useBrokers, useRemoveBroker } from "@/hooks/useBrokers";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import {
  AccountType,
  AssetClass,
  RebalancingFrequency,
} from "@/types/portfolio";
import type {
  PortfolioSettingsView,
  TargetAllocation,
} from "@/types/portfolio";
import {
  AlertCircle,
  Building2,
  ChevronDown,
  ChevronUp,
  Plus,
  Save,
  Settings2,
  Sliders,
  Target,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  [AssetClass.equity]: "Equity",
  [AssetClass.mutualFund]: "Mutual Fund",
};

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <CardHeader className="pb-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
    </CardHeader>
  );
}

function AllocationRow({
  allocation,
  index,
  onChange,
}: {
  allocation: TargetAllocation;
  index: number;
  onChange: (pct: number) => void;
}) {
  return (
    <div
      className="flex items-center gap-4 py-3 border-b border-border last:border-0"
      data-ocid={`settings.allocation.item.${index + 1}`}
    >
      <div className="flex-1">
        <p className="text-sm font-medium">
          {ASSET_CLASS_LABELS[allocation.assetClass] ?? allocation.assetClass}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {allocation.assetClass}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          max={100}
          step={1}
          value={allocation.targetPct}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 text-right font-mono"
          data-ocid={`settings.allocation.input.${index + 1}`}
        />
        <span className="text-sm text-muted-foreground w-4">%</span>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const { data: settings, isLoading, isError } = useSettings();
  const updateSettings = useUpdateSettings();
  const { data: brokers } = useBrokers();
  const addBroker = useAddBroker();
  const removeBroker = useRemoveBroker();

  const [form, setForm] = useState<PortfolioSettingsView | null>(null);
  const [brokerName, setBrokerName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [accountType, setAccountType] = useState<AccountType>(
    AccountType.delivery,
  );
  const [showBrokerForm, setShowBrokerForm] = useState(false);

  useEffect(() => {
    if (settings && !form) setForm(settings);
  }, [settings, form]);

  if (isLoading) return <PageLoader />;
  if (isError || !form) return <ErrorState />;

  const allocationSum = form.targetAllocations.reduce(
    (sum, a) => sum + a.targetPct,
    0,
  );
  const allocationValid = Math.abs(allocationSum - 100) < 0.01;

  function updateAllocation(index: number, pct: number) {
    if (!form) return;
    const updated = form.targetAllocations.map((a, i) =>
      i === index ? { ...a, targetPct: pct } : a,
    );
    setForm({ ...form, targetAllocations: updated });
  }

  async function handleSave() {
    if (!form || !allocationValid) return;
    try {
      await updateSettings.mutateAsync(form);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    }
  }

  async function handleAddBroker() {
    if (!brokerName || !accountId) return;
    try {
      await addBroker.mutateAsync({ brokerName, accountId, accountType });
      toast.success(`${brokerName} account added`);
      setBrokerName("");
      setAccountId("");
      setAccountType(AccountType.delivery);
      setShowBrokerForm(false);
    } catch {
      toast.error("Failed to add broker");
    }
  }

  async function handleRemoveBroker(id: bigint) {
    try {
      await removeBroker.mutateAsync(id);
      toast.success("Broker removed");
    } catch {
      toast.error("Failed to remove broker");
    }
  }

  return (
    <div className="space-y-6 max-w-2xl" data-ocid="settings.page">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Settings
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your portfolio preferences and broker connections
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending || !allocationValid}
          data-ocid="settings.save_button"
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {updateSettings.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Portfolio Settings */}
      <Card data-ocid="settings.portfolio.card">
        <SectionHeader
          icon={Settings2}
          title="Portfolio Settings"
          description="Basic information about your investment portfolio"
        />
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="portfolio-name">Portfolio Name</Label>
            <Input
              id="portfolio-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Long-term Wealth"
              data-ocid="settings.name.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="initial-investment">Initial Investment (₹)</Label>
              <Input
                id="initial-investment"
                type="number"
                min={0}
                value={form.initialInvestment}
                onChange={(e) =>
                  setForm({
                    ...form,
                    initialInvestment: Number(e.target.value),
                  })
                }
                className="font-mono"
                data-ocid="settings.initial_investment.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cash-balance">Cash Balance (₹)</Label>
              <Input
                id="cash-balance"
                type="number"
                min={0}
                value={form.cashBalance}
                onChange={(e) =>
                  setForm({ ...form, cashBalance: Number(e.target.value) })
                }
                className="font-mono"
                data-ocid="settings.cash_balance.input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Settings */}
      <Card data-ocid="settings.risk.card">
        <SectionHeader
          icon={Sliders}
          title="Risk Settings"
          description="Configure risk parameters used for portfolio analytics"
        />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="risk-free-rate">Risk-Free Rate (%)</Label>
              <div className="relative">
                <Input
                  id="risk-free-rate"
                  type="number"
                  step={0.1}
                  min={0}
                  max={20}
                  value={form.riskFreeRate}
                  onChange={(e) =>
                    setForm({ ...form, riskFreeRate: Number(e.target.value) })
                  }
                  className="font-mono pr-8"
                  data-ocid="settings.risk_free_rate.input"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  %
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Used for Sharpe ratio calculation (default: 6.5%)
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rebalancing-freq">Rebalancing Frequency</Label>
              <Select
                value={form.rebalancingFrequency}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    rebalancingFrequency: v as RebalancingFrequency,
                  })
                }
              >
                <SelectTrigger
                  id="rebalancing-freq"
                  data-ocid="settings.rebalancing_frequency.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RebalancingFrequency.daily}>
                    Daily
                  </SelectItem>
                  <SelectItem value={RebalancingFrequency.weekly}>
                    Weekly
                  </SelectItem>
                  <SelectItem value={RebalancingFrequency.monthly}>
                    Monthly
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How often rebalancing alerts trigger
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Allocations */}
      <Card data-ocid="settings.allocations.card">
        <SectionHeader
          icon={Target}
          title="Target Allocations"
          description="Set target percentage for each asset class — must sum to 100%"
        />
        <CardContent>
          <div data-ocid="settings.allocations.table">
            {form.targetAllocations.map((allocation, i) => (
              <AllocationRow
                key={allocation.assetClass}
                allocation={allocation}
                index={i}
                onChange={(pct) => updateAllocation(i, pct)}
              />
            ))}
          </div>

          {/* Summary row */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-border">
            <span className="text-sm font-medium text-muted-foreground">
              Total
            </span>
            <div className="flex items-center gap-2">
              {!allocationValid && (
                <span
                  className="flex items-center gap-1 text-xs text-destructive"
                  data-ocid="settings.allocations.error_state"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  Must sum to 100%
                </span>
              )}
              <span
                className={`font-mono text-sm font-bold ${
                  allocationValid ? "text-primary" : "text-destructive"
                }`}
              >
                {allocationSum.toFixed(0)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Broker Accounts */}
      <Card data-ocid="settings.brokers.card">
        <SectionHeader
          icon={Building2}
          title="Broker Accounts"
          description="Connect your brokerage accounts for a unified portfolio view"
        />
        <CardContent className="space-y-4">
          {/* Existing brokers list */}
          {brokers && brokers.length > 0 ? (
            <div className="space-y-2" data-ocid="settings.brokers.list">
              {brokers.map((b, i) => (
                <div
                  key={String(b.id)}
                  data-ocid={`settings.broker.item.${i + 1}`}
                  className="flex items-center justify-between p-3 rounded-md bg-muted/30 border border-border group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {b.brokerName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-muted-foreground font-mono">
                          {b.accountId}
                        </span>
                        <span className="text-muted-foreground/40 text-xs">
                          ·
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize px-1.5 py-0"
                        >
                          {b.accountType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth shrink-0"
                    onClick={() => handleRemoveBroker(b.id)}
                    aria-label={`Remove ${b.brokerName}`}
                    data-ocid={`settings.broker.delete_button.${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center py-6 text-center"
              data-ocid="settings.brokers.empty_state"
            >
              <Building2 className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                No brokers connected yet.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                Add a broker below to start tracking your accounts.
              </p>
            </div>
          )}

          {/* Add broker toggle */}
          <div className="border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setShowBrokerForm(!showBrokerForm)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              data-ocid="settings.add_broker.open_modal_button"
            >
              {showBrokerForm ? (
                <>
                  <ChevronUp className="h-4 w-4" /> Hide Form
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add Broker Account
                </>
              )}
            </button>

            {showBrokerForm && (
              <div
                className="mt-4 space-y-3 p-4 rounded-md bg-muted/20 border border-border"
                data-ocid="settings.broker_form.panel"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  New Broker Account
                </p>
                <div className="space-y-1.5">
                  <Label>Broker</Label>
                  <BrokerSelect
                    value={brokerName}
                    onChange={setBrokerName}
                    data-ocid="settings.broker_select"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="account-id">Account ID</Label>
                    <Input
                      id="account-id"
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      placeholder="e.g. ZD12345"
                      data-ocid="settings.broker_account_id.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Account Type</Label>
                    <Select
                      value={accountType}
                      onValueChange={(v) => setAccountType(v as AccountType)}
                    >
                      <SelectTrigger data-ocid="settings.broker_account_type.select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AccountType.delivery}>
                          Delivery
                        </SelectItem>
                        <SelectItem value={AccountType.intraday}>
                          Intraday
                        </SelectItem>
                        <SelectItem value={AccountType.both}>Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    onClick={handleAddBroker}
                    disabled={!brokerName || !accountId || addBroker.isPending}
                    data-ocid="settings.add_broker.submit_button"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {addBroker.isPending ? "Adding..." : "Add Broker"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowBrokerForm(false);
                      setBrokerName("");
                      setAccountId("");
                      setAccountType(AccountType.delivery);
                    }}
                    data-ocid="settings.add_broker.cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom save bar */}
      <div className="sticky bottom-4 flex justify-end">
        <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-lg">
          {!allocationValid && (
            <span
              className="flex items-center gap-1.5 text-xs text-destructive"
              data-ocid="settings.validation.error_state"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              Target allocations must sum to 100%
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending || !allocationValid}
            data-ocid="settings.save_bottom.primary_button"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {updateSettings.isPending ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
