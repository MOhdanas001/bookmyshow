import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/services/movie.service";
import type { MovieInput } from "@/types";
import { toast } from "sonner";

export const movieKeys = {
  all: ["movies"] as const,
  detail: (id: string) => ["movies", id] as const,
};

export function useMovies() {
  return useQuery({ queryKey: movieKeys.all, queryFn: movieService.getAll });
}

export function useMovie(id: string) {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => movieService.getById(id),
    enabled: !!id,
  });
}

export function useCreateMovie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MovieInput) => movieService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: movieKeys.all });
      toast.success("Movie created successfully");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to create movie"),
  });
}

export function useUpdateMovie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<MovieInput> }) =>
      movieService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: movieKeys.all });
      toast.success("Movie updated successfully");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to update movie"),
  });
}

export function useDeleteMovie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => movieService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: movieKeys.all });
      toast.success("Movie deleted");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to delete movie"),
  });
}
