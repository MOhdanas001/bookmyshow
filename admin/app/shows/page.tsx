"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { getShowColumns } from "@/components/tables/columns-shows";
import { ShowForm } from "@/components/forms/show-form";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useShows, useCreateShow, useUpdateShow, useDeleteShow } from "@/hooks/use-shows";
import { useMovies } from "@/hooks/use-movies";
import { useTheatres } from "@/hooks/use-theatres";
import type { Show, ShowInput } from "@/types";

export default function ShowsPage() {
  const { data: shows, isLoading } = useShows();
  const { data: movies } = useMovies();
  const { data: theatres } = useTheatres();
  const createShow = useCreateShow();
  const updateShow = useUpdateShow();
  const deleteShow = useDeleteShow();

  const [formOpen, setFormOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [viewingShow, setViewingShow] = useState<Show | null>(null);
  const [deletingShow, setDeletingShow] = useState<Show | null>(null);

  const columns = getShowColumns({
    onView: setViewingShow,
    onEdit: (s) => { setEditingShow(s); setFormOpen(true); },
    onDelete: setDeletingShow,
  });

  function handleSubmit(values: ShowInput) {
    if (editingShow) {
      updateShow.mutate({ id: editingShow.id, input: values }, { onSuccess: closeForm });
    } else {
      createShow.mutate(values, { onSuccess: closeForm });
    }
  }

  function closeForm() {
    setFormOpen(false);
    setEditingShow(null);
  }

  return (
    <div>
      <PageHeader title="Shows" description="Schedule and manage movie showtimes across theatres.">
        <Button onClick={() => { setEditingShow(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Show
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={shows ?? []}
        isLoading={isLoading}
        searchKey="movieTitle"
        searchPlaceholder="Search shows by movie..."
        emptyTitle="No shows scheduled"
        emptyDescription="Schedule your first show to get started."
      />

      <Dialog open={formOpen} onOpenChange={(open) => (open ? setFormOpen(true) : closeForm())}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingShow ? "Edit Show" : "Add New Show"}</DialogTitle>
            <DialogDescription>
              {editingShow ? "Update the show details below." : "Schedule a new show for a movie and theatre."}
            </DialogDescription>
          </DialogHeader>
          <ShowForm
            defaultValues={editingShow ?? undefined}
            movies={movies ?? []}
            theatres={theatres ?? []}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isSubmitting={createShow.isPending || updateShow.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingShow} onOpenChange={(open) => !open && setViewingShow(null)}>
        <DialogContent className="sm:max-w-md">
          {viewingShow && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingShow.movieTitle}</DialogTitle>
                <DialogDescription>{viewingShow.theatreName}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p>{formatDate(viewingShow.date)} at {viewingShow.time}</p>
                <p className="text-muted-foreground">{viewingShow.screen}</p>
                <p>Ticket price: <span className="font-medium">{formatCurrency(viewingShow.ticketPrice)}</span></p>
                <p>{viewingShow.availableSeats} / {viewingShow.totalSeats} seats available</p>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setViewingShow(null)}>Close</Button>
                <Button asChild>
                  <Link href={`/shows/${viewingShow.id}/book`}>Book Seats</Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deletingShow}
        onOpenChange={(open) => !open && setDeletingShow(null)}
        title="Delete this show?"
        description="This will permanently remove the show and cancel any pending bookings."
        isPending={deleteShow.isPending}
        onConfirm={() =>
          deletingShow && deleteShow.mutate(deletingShow.id, { onSuccess: () => setDeletingShow(null) })
        }
      />
    </div>
  );
}
