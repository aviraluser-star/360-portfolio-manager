import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { StockRecommendation } from "../types/portfolio";
import { Action, RiskRating } from "../types/portfolio";

const MOCK_RECOMMENDATIONS: StockRecommendation[] = [
  {
    ticker: "ICICIBANK",
    companyName: "ICICI Bank",
    currentPrice: 1052.45,
    targetPrice: 1230.0,
    expectedReturn: 16.9,
    action: Action.buy,
    riskRating: RiskRating.low,
  },
  {
    ticker: "ASIANPAINT",
    companyName: "Asian Paints",
    currentPrice: 2847.3,
    targetPrice: 3200.0,
    expectedReturn: 12.4,
    action: Action.buy,
    riskRating: RiskRating.medium,
  },
  {
    ticker: "KOTAKBANK",
    companyName: "Kotak Mahindra Bank",
    currentPrice: 1923.15,
    targetPrice: 2100.0,
    expectedReturn: 9.2,
    action: Action.buy,
    riskRating: RiskRating.low,
  },
  {
    ticker: "HDFCBANK",
    companyName: "HDFC Bank",
    currentPrice: 1680.55,
    targetPrice: 1680.0,
    expectedReturn: 0.0,
    action: Action.hold,
    riskRating: RiskRating.low,
  },
  {
    ticker: "INFY",
    companyName: "Infosys",
    currentPrice: 1523.9,
    targetPrice: 1520.0,
    expectedReturn: -0.3,
    action: Action.hold,
    riskRating: RiskRating.medium,
  },
  {
    ticker: "RELIANCE",
    companyName: "Reliance Industries",
    currentPrice: 2412.7,
    targetPrice: 2200.0,
    expectedReturn: -8.8,
    action: Action.sell,
    riskRating: RiskRating.medium,
  },
];

export function useRecommendations() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StockRecommendation[]>({
    queryKey: ["recommendations"],
    queryFn: async () => {
      if (!actor) return MOCK_RECOMMENDATIONS;
      try {
        return await actor.getDailyRecommendations();
      } catch {
        return MOCK_RECOMMENDATIONS;
      }
    },
    enabled: !isFetching,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
