import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Holding, HoldingId, HoldingInput } from "../types/portfolio";

function useBackend() {
  return useActor(createActor);
}

export function useHoldings() {
  const { actor, isFetching } = useBackend();
  return useQuery<Holding[]>({
    queryKey: ["holdings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listHoldings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHolding() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<Holding, Error, HoldingInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addHolding(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holdings"] });
      qc.invalidateQueries({ queryKey: ["portfolio-summary"] });
      qc.invalidateQueries({ queryKey: ["tax-summary"] });
      qc.invalidateQueries({ queryKey: ["rebalance-alerts"] });
    },
  });
}

export function useUpdateHolding() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<boolean, Error, { id: HoldingId; input: HoldingInput }>({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateHolding(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holdings"] });
      qc.invalidateQueries({ queryKey: ["portfolio-summary"] });
    },
  });
}

export function useDeleteHolding() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<boolean, Error, HoldingId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteHolding(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holdings"] });
      qc.invalidateQueries({ queryKey: ["portfolio-summary"] });
      qc.invalidateQueries({ queryKey: ["tax-summary"] });
      qc.invalidateQueries({ queryKey: ["rebalance-alerts"] });
    },
  });
}
