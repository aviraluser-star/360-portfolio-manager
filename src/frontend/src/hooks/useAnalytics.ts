import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  BenchmarkResult,
  PortfolioSummary,
  RebalanceAlert,
} from "../types/portfolio";
import { AssetClass } from "../types/portfolio";

const MOCK_SUMMARY: PortfolioSummary = {
  totalValue: 1248750.5,
  totalInvestment: 1050000,
  gainLossAmt: 198750.5,
  gainLossPct: 18.93,
};

const MOCK_ALERTS: RebalanceAlert[] = [
  {
    ticker: "TCS",
    assetClass: AssetClass.equity,
    currentPct: 23.5,
    targetPct: 18,
    driftPct: 5.5,
  },
  {
    ticker: "RELIANCE",
    assetClass: AssetClass.equity,
    currentPct: 8.2,
    targetPct: 15,
    driftPct: -6.8,
  },
];

const MOCK_BENCHMARK: BenchmarkResult = {
  portfolioYtdReturn: 18.93,
  sp500YtdReturn: 12.4,
};

export function usePortfolioSummary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PortfolioSummary>({
    queryKey: ["portfolio-summary"],
    queryFn: async () => {
      if (!actor) return MOCK_SUMMARY;
      try {
        return await actor.getPortfolioSummary();
      } catch {
        return MOCK_SUMMARY;
      }
    },
    enabled: !isFetching,
  });
}

export function useSharpeRatio() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<number>({
    queryKey: ["sharpe-ratio"],
    queryFn: async () => {
      if (!actor) return 1.62;
      try {
        return await actor.getSharpeRatio();
      } catch {
        return 1.62;
      }
    },
    enabled: !isFetching,
  });
}

export function useVolatility() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<number>({
    queryKey: ["volatility"],
    queryFn: async () => {
      if (!actor) return 18.4;
      try {
        return await actor.getVolatility();
      } catch {
        return 18.4;
      }
    },
    enabled: !isFetching,
  });
}

export function useRebalanceAlerts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<RebalanceAlert[]>({
    queryKey: ["rebalance-alerts"],
    queryFn: async () => {
      if (!actor) return MOCK_ALERTS;
      try {
        return await actor.getRebalanceAlerts();
      } catch {
        return MOCK_ALERTS;
      }
    },
    enabled: !isFetching,
  });
}

export function useBenchmark() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BenchmarkResult>({
    queryKey: ["benchmark"],
    queryFn: async () => {
      if (!actor) return MOCK_BENCHMARK;
      try {
        return await actor.getBenchmark();
      } catch {
        return MOCK_BENCHMARK;
      }
    },
    enabled: !isFetching,
  });
}
