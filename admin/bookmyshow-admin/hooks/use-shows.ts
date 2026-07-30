import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showService } from "@/services/show.service";
import type { ShowInput } from "@/types";
import { toast } from "sonner";

export const showKeys = {
  all: ["shows"] as const,
  detail: (id: string) => ["shows", id] as const,
};

export function useShows() {
  return useQuery({ queryKey: showKeys.all, queryFn: showService.getAll });
}

export function useShow(id: string) {
  return useQuery({
    queryKey: showKeys.detail(id),
    queryFn: () => showService.getById(id),
    enabled: !!id,
  });
}

export function useCreateShow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ShowInput) => showService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: showKeys.all });
      toast.success("Show scheduled successfully");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to create show"),
  });
}

export function useUpdateShow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ShowInput> }) =>
      showService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: showKeys.all });
      toast.success("Show updated successfully");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to update show"),
  });
}

export function useDeleteShow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => showService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: showKeys.all });
      toast.success("Show removed");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to delete show"),
  });
}
