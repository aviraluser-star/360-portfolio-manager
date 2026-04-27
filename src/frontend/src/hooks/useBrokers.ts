import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { BrokerAccount, BrokerId, BrokerInput } from "../types/portfolio";

function useBackend() {
  return useActor(createActor);
}

export function useBrokers() {
  const { actor, isFetching } = useBackend();
  return useQuery<BrokerAccount[]>({
    queryKey: ["brokers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBrokers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBroker() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<BrokerAccount, Error, BrokerInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addBroker(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brokers"] });
    },
  });
}

export function useRemoveBroker() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation<boolean, Error, BrokerId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.removeBroker(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brokers"] });
    },
  });
}
