import "./index-BqnJ5REX.js";
import { u as useActor, e as useQuery, R as RiskRating, A as Action, f as createActor } from "./backend-lKmLgprF.js";
const MOCK_RECOMMENDATIONS = [
  {
    ticker: "ICICIBANK",
    companyName: "ICICI Bank",
    currentPrice: 1052.45,
    targetPrice: 1230,
    expectedReturn: 16.9,
    action: Action.buy,
    riskRating: RiskRating.low
  },
  {
    ticker: "ASIANPAINT",
    companyName: "Asian Paints",
    currentPrice: 2847.3,
    targetPrice: 3200,
    expectedReturn: 12.4,
    action: Action.buy,
    riskRating: RiskRating.medium
  },
  {
    ticker: "KOTAKBANK",
    companyName: "Kotak Mahindra Bank",
    currentPrice: 1923.15,
    targetPrice: 2100,
    expectedReturn: 9.2,
    action: Action.buy,
    riskRating: RiskRating.low
  },
  {
    ticker: "HDFCBANK",
    companyName: "HDFC Bank",
    currentPrice: 1680.55,
    targetPrice: 1680,
    expectedReturn: 0,
    action: Action.hold,
    riskRating: RiskRating.low
  },
  {
    ticker: "INFY",
    companyName: "Infosys",
    currentPrice: 1523.9,
    targetPrice: 1520,
    expectedReturn: -0.3,
    action: Action.hold,
    riskRating: RiskRating.medium
  },
  {
    ticker: "RELIANCE",
    companyName: "Reliance Industries",
    currentPrice: 2412.7,
    targetPrice: 2200,
    expectedReturn: -8.8,
    action: Action.sell,
    riskRating: RiskRating.medium
  }
];
function useRecommendations() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
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
    staleTime: 1e3 * 60 * 60
    // 1 hour
  });
}
export {
  useRecommendations as u
};
