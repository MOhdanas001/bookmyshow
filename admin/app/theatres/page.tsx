"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { getTheatreColumns } from "@/components/tables/columns-theatres";
import { TheatreForm } from "@/components/forms/theatre-form";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  useTheatres,
  useCreateTheatre,
  useUpdateTheatre,
  useDeleteTheatre,
} from "@/hooks/use-theatres";
import type { Theatre, TheatreInput } from "@/types";

export default function TheatresPage() {
  const { data: theatres, isLoading } = useTheatres();
  const createTheatre = useCreateTheatre();
  const updateTheatre = useUpdateTheatre();
  const deleteTheatre = useDeleteTheatre();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState<Theatre | null>(null);
  const [viewingTheatre, setViewingTheatre] = useState<Theatre | null>(null);
  const [deletingTheatre, setDeletingTheatre] = useState<Theatre | null>(null);

  const columns = getTheatreColumns({
    onView: setViewingTheatre,
    onEdit: (t) => {
      setEditingTheatre(t);
      setFormOpen(true);
    },
    onDelete: setDeletingTheatre,
  });

  function handleSubmit(values: TheatreInput) {
    if (editingTheatre) {
      updateTheatre.mutate({ id: editingTheatre.id, input: values }, { onSuccess: closeForm });
    } else {
      createTheatre.mutate(values, { onSuccess: closeForm });
    }
  }

  function closeForm() {
    setFormOpen(false);
    setEditingTheatre(null);
  }

  return (
    <div>
      <PageHeader title="Theatres" description="Manage cinema locations and their capacity.">
        <Button onClick={() => { setEditingTheatre(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Theatre
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={theatres ?? []}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search theatres by name..."
        emptyTitle="No theatres yet"
        emptyDescription="Add your first theatre to get started."
      />

      <Dialog open={formOpen} onOpenChange={(open) => (open ? setFormOpen(true) : closeForm())}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTheatre ? "Edit Theatre" : "Add New Theatre"}</DialogTitle>
            <DialogDescription>
              {editingTheatre ? "Update the theatre details below." : "Fill in the details to add a new theatre."}
            </DialogDescription>
          </DialogHeader>
          <TheatreForm
            defaultValues={editingTheatre ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isSubmitting={createTheatre.isPending || updateTheatre.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingTheatre} onOpenChange={(open) => !open && setViewingTheatre(null)}>
        <DialogContent className="sm:max-w-md">
          {viewingTheatre && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingTheatre.name}</DialogTitle>
                <DialogDescription>{viewingTheatre.city}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">{viewingTheatre.address}</p>
                <p>{viewingTheatre.totalSeats} seats · {viewingTheatre.screens} screens</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewingTheatre.amenities.map((a) => (
                    <Badge key={a} variant="secondary">{a}</Badge>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewingTheatre(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deletingTheatre}
        onOpenChange={(open) => !open && setDeletingTheatre(null)}
        title={`Delete "${deletingTheatre?.name}"?`}
        description="This will permanently remove the theatre and any associated shows."
        isPending={deleteTheatre.isPending}
        onConfirm={() =>
          deletingTheatre &&
          deleteTheatre.mutate(deletingTheatre.id, { onSuccess: () => setDeletingTheatre(null) })
        }
      />
    </div>
  );
}
