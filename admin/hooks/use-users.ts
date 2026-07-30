import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import type { UserInput } from "@/types";
import { toast } from "sonner";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["users", id] as const,
};

export function useUsers() {
  return useQuery({ queryKey: userKeys.all, queryFn: userService.getAll });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UserInput) => userService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User created successfully");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to create user"),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<UserInput> }) =>
      userService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User updated successfully");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to update user"),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User deleted");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to delete user"),
  });
}
