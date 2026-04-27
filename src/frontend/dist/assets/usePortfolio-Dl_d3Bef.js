import { e as useQueryClient } from "./index-BqnJ5REX.js";
import { e as useQuery, u as useActor, f as createActor } from "./backend-lKmLgprF.js";
import { u as useMutation } from "./useMutation-Dxa2nhZ8.js";
function useBackend() {
  return useActor(createActor);
}
function useHoldings() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["holdings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listHoldings();
    },
    enabled: !!actor && !isFetching
  });
}
function useAddHolding() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addHolding(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holdings"] });
      qc.invalidateQueries({ queryKey: ["portfolio-summary"] });
      qc.invalidateQueries({ queryKey: ["tax-summary"] });
      qc.invalidateQueries({ queryKey: ["rebalance-alerts"] });
    }
  });
}
function useUpdateHolding() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateHolding(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holdings"] });
      qc.invalidateQueries({ queryKey: ["portfolio-summary"] });
    }
  });
}
function useDeleteHolding() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteHolding(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["holdings"] });
      qc.invalidateQueries({ queryKey: ["portfolio-summary"] });
      qc.invalidateQueries({ queryKey: ["tax-summary"] });
      qc.invalidateQueries({ queryKey: ["rebalance-alerts"] });
    }
  });
}
export {
  useAddHolding as a,
  useUpdateHolding as b,
  useDeleteHolding as c,
  useHoldings as u
};
