"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/tables/data-table";
import { getBookingColumns } from "@/components/tables/columns-bookings";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useBookings, useDeleteBooking } from "@/hooks/use-bookings";
import type { Booking, BookingStatus } from "@/types";

const statusVariant: Record<BookingStatus, "success" | "warning" | "destructive" | "secondary"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "destructive",
  refunded: "secondary",
};

export default function BookingsPage() {
  const { data: bookings, isLoading } = useBookings();
  const deleteBooking = useDeleteBooking();

  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);

  const columns = getBookingColumns({
    onView: setViewingBooking,
    onDelete: setDeletingBooking,
  });

  return (
    <div>
      <PageHeader title="Bookings" description="View and manage all ticket bookings." />

      <DataTable
        columns={columns}
        data={bookings ?? []}
        isLoading={isLoading}
        searchKey="bookingCode"
        searchPlaceholder="Search by booking ID..."
        emptyTitle="No bookings yet"
        emptyDescription="Bookings will appear here once customers start booking tickets."
      />

      <Dialog open={!!viewingBooking} onOpenChange={(open) => !open && setViewingBooking(null)}>
        <DialogContent className="sm:max-w-md">
          {viewingBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono">{viewingBooking.bookingCode}</DialogTitle>
                <DialogDescription>{formatDate(viewingBooking.bookingDate)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Movie:</span> {viewingBooking.movieTitle}</p>
                <p><span className="text-muted-foreground">Theatre:</span> {viewingBooking.theatreName}</p>
                <p><span className="text-muted-foreground">Customer:</span> {viewingBooking.userName}</p>
                <p><span className="text-muted-foreground">Seats:</span> {viewingBooking.seats.join(", ")}</p>
                <p><span className="text-muted-foreground">Amount:</span> {formatCurrency(viewingBooking.amount)}</p>
                <p className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={statusVariant[viewingBooking.status]} className="capitalize">{viewingBooking.status}</Badge>
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewingBooking(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deletingBooking}
        onOpenChange={(open) => !open && setDeletingBooking(null)}
        title={`Delete booking ${deletingBooking?.bookingCode}?`}
        description="This will permanently remove this booking record."
        isPending={deleteBooking.isPending}
        onConfirm={() =>
          deletingBooking && deleteBooking.mutate(deletingBooking.id, { onSuccess: () => setDeletingBooking(null) })
        }
      />
    </div>
  );
}
