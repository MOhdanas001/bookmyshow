import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { theatreService } from "@/services/theatre.service";
import type { TheatreInput } from "@/types";
import { toast } from "sonner";

export const theatreKeys = {
  all: ["theatres"] as const,
  detail: (id: string) => ["theatres", id] as const,
};

export function useTheatres() {
  return useQuery({ queryKey: theatreKeys.all, queryFn: theatreService.getAll });
}

export function useTheatre(id: string) {
  return useQuery({
    queryKey: theatreKeys.detail(id),
    queryFn: () => theatreService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTheatre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TheatreInput) => theatreService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: theatreKeys.all });
      toast.success("Theatre created successfully");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to create theatre"),
  });
}

export function useUpdateTheatre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TheatreInput> }) =>
      theatreService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: theatreKeys.all });
      toast.success("Theatre updated successfully");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to update theatre"),
  });
}

export function useDeleteTheatre() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => theatreService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: theatreKeys.all });
      toast.success("Theatre deleted");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to delete theatre"),
  });
}
