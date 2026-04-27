import { e as useQueryClient } from "./index-BqnJ5REX.js";
import { e as useQuery, u as useActor, f as createActor } from "./backend-lKmLgprF.js";
import { u as useMutation } from "./useMutation-Dxa2nhZ8.js";
function useBackend() {
  return useActor(createActor);
}
function useBrokers() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["brokers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBrokers();
    },
    enabled: !!actor && !isFetching
  });
}
function useAddBroker() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addBroker(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brokers"] });
    }
  });
}
function useRemoveBroker() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeBroker(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brokers"] });
    }
  });
}
export {
  useAddBroker as a,
  useRemoveBroker as b,
  useBrokers as u
};
