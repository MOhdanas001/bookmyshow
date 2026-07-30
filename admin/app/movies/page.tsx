"use client";

import { useState } from "react";
import { Plus, Star } from "lucide-react";
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { getMovieColumns } from "@/components/tables/columns-movies";
import { MovieForm } from "@/components/forms/movie-form";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useMovies, useCreateMovie, useUpdateMovie, useDeleteMovie } from "@/hooks/use-movies";
import type { Movie, MovieInput } from "@/types";

export default function MoviesPage() {
  const { data: movies, isLoading } = useMovies();
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();
  const deleteMovie = useDeleteMovie();

  const [formOpen, setFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [viewingMovie, setViewingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  const columns = getMovieColumns({
    onView: setViewingMovie,
    onEdit: (movie) => {
      setEditingMovie(movie);
      setFormOpen(true);
    },
    onDelete: setDeletingMovie,
  });

  function handleSubmit(values: MovieInput) {
    if (editingMovie) {
      updateMovie.mutate(
        { id: editingMovie.id, input: values },
        { onSuccess: () => closeForm() }
      );
    } else {
      createMovie.mutate(values, { onSuccess: () => closeForm() });
    }
  }

  function closeForm() {
    setFormOpen(false);
    setEditingMovie(null);
  }

  return (
    <div>
      <PageHeader title="Movies" description="Manage all movies listed on BookMyShow.">
        <Button
          onClick={() => {
            setEditingMovie(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Movie
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={movies ?? []}
        isLoading={isLoading}
        searchKey="title"
        searchPlaceholder="Search movies by title..."
        emptyTitle="No movies yet"
        emptyDescription="Add your first movie to get started."
      />

      {/* Add / Edit Movie Drawer */}
      <Sheet open={formOpen} onOpenChange={(open) => (open ? setFormOpen(true) : closeForm())}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingMovie ? "Edit Movie" : "Add New Movie"}</SheetTitle>
            <SheetDescription>
              {editingMovie ? "Update the movie details below." : "Fill in the details to add a new movie."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <MovieForm
              defaultValues={editingMovie ?? undefined}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              isSubmitting={createMovie.isPending || updateMovie.isPending}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* View Movie Dialog */}
      <Dialog open={!!viewingMovie} onOpenChange={(open) => !open && setViewingMovie(null)}>
        <DialogContent className="sm:max-w-lg">
          {viewingMovie && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingMovie.title}</DialogTitle>
                <DialogDescription>{viewingMovie.language} · {formatDate(viewingMovie.releaseDate)}</DialogDescription>
              </DialogHeader>
              <div className="flex gap-4">
                <div className="relative h-40 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={viewingMovie.posterUrl} alt={viewingMovie.title} fill className="object-cover" unoptimized />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {viewingMovie.genre.map((g) => (
                      <Badge key={g} variant="secondary">{g}</Badge>
                    ))}
                  </div>
                  <p className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {viewingMovie.rating.toFixed(1)} / 10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(viewingMovie.durationMinutes / 60)}h {viewingMovie.durationMinutes % 60}m
                  </p>
                  <p className="text-sm">{viewingMovie.description}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deletingMovie}
        onOpenChange={(open) => !open && setDeletingMovie(null)}
        title={`Delete "${deletingMovie?.title}"?`}
        description="This will permanently remove the movie and any associated shows."
        isPending={deleteMovie.isPending}
        onConfirm={() =>
          deletingMovie &&
          deleteMovie.mutate(deletingMovie.id, { onSuccess: () => setDeletingMovie(null) })
        }
      />
    </div>
  );
}
