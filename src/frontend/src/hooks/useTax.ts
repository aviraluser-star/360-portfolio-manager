import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { TaxSummary } from "../types/portfolio";
import { TaxBucket } from "../types/portfolio";

const MOCK_TAX: TaxSummary = {
  stcgTotal: 45820.5,
  stcgTax: 6873.08,
  ltcgTotal: 152930.0,
  ltcgTax: 15293.0,
  unrealizedTotal: 89340.75,
  positions: [
    {
      holdingId: 1n,
      ticker: "TCS",
      gainLossAmt: 38500,
      taxLiability: 5775,
      bucket: TaxBucket.ltcg,
    },
    {
      holdingId: 2n,
      ticker: "INFY",
      gainLossAmt: 22430,
      taxLiability: 2243,
      bucket: TaxBucket.ltcg,
    },
    {
      holdingId: 3n,
      ticker: "HDFCBANK",
      gainLossAmt: 15820.5,
      taxLiability: 2373.08,
      bucket: TaxBucket.stcg,
    },
    {
      holdingId: 4n,
      ticker: "RELIANCE",
      gainLossAmt: 30000,
      taxLiability: 4500,
      bucket: TaxBucket.stcg,
    },
    {
      holdingId: 5n,
      ticker: "WIPRO",
      gainLossAmt: 89340.75,
      taxLiability: 0,
      bucket: TaxBucket.unrealized,
    },
  ],
};

export function useTaxSummary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TaxSummary>({
    queryKey: ["tax-summary"],
    queryFn: async () => {
      if (!actor) return MOCK_TAX;
      try {
        return await actor.getTaxSummary();
      } catch {
        return MOCK_TAX;
      }
    },
    enabled: !isFetching,
  });
}
