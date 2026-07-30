import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import type { BookingStatus } from "@/types";
import { toast } from "sonner";

export const bookingKeys = {
  all: ["bookings"] as const,
  detail: (id: string) => ["bookings", id] as const,
};

export function useBookings() {
  return useQuery({ queryKey: bookingKeys.all, queryFn: bookingService.getAll });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      bookingService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.all });
      toast.success("Booking status updated");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to update booking"),
  });
}

export function useDeleteBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.all });
      toast.success("Booking deleted");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to delete booking"),
  });
}
