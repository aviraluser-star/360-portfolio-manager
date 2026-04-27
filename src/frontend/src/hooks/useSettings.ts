import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { PortfolioSettingsView } from "../types/portfolio";
import { AssetClass, RebalancingFrequency } from "../types/portfolio";

const DEFAULT_SETTINGS: PortfolioSettingsView = {
  name: "My Portfolio",
  riskFreeRate: 6.5,
  cashBalance: 50000,
  initialInvestment: 1050000,
  rebalancingFrequency: RebalancingFrequency.monthly,
  targetAllocations: [
    { assetClass: AssetClass.equity, targetPct: 80 },
    { assetClass: AssetClass.mutualFund, targetPct: 20 },
  ],
};

export function useSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PortfolioSettingsView>({
    queryKey: ["settings"],
    queryFn: async () => {
      if (!actor) return DEFAULT_SETTINGS;
      try {
        return await actor.getSettings();
      } catch {
        return DEFAULT_SETTINGS;
      }
    },
    enabled: !isFetching,
  });
}

export function useUpdateSettings() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, PortfolioSettingsView>({
    mutationFn: async (update) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateSettings(update);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
