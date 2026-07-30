"use client";

import Image from "next/image";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Eye, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import type { Movie, MovieStatus } from "@/types";

const statusVariant: Record<MovieStatus, "success" | "info" | "secondary"> = {
  "now-showing": "success",
  upcoming: "info",
  archived: "secondary",
};

const statusLabel: Record<MovieStatus, string> = {
  "now-showing": "Now Showing",
  upcoming: "Upcoming",
  archived: "Archived",
};

interface MovieColumnActions {
  onView: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export function getMovieColumns({ onView, onEdit, onDelete }: MovieColumnActions): ColumnDef<Movie>[] {
  return [
    {
      accessorKey: "posterUrl",
      header: "Poster",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="relative h-14 w-10 overflow-hidden rounded-md bg-muted">
          <Image
            src={row.original.posterUrl}
            alt={row.original.title}
            fill
            className="object-cover"
            sizes="40px"
            unoptimized
          />
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">{row.original.genre.join(", ")}</p>
        </div>
      ),
    },
    {
      accessorKey: "language",
      header: "Language",
    },
    {
      accessorKey: "durationMinutes",
      header: "Duration",
      cell: ({ row }) => `${Math.floor(row.original.durationMinutes / 60)}h ${row.original.durationMinutes % 60}m`,
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <span className="flex items-center gap-1 font-medium">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {row.original.rating.toFixed(1)}
        </span>
      ),
    },
    {
      accessorKey: "releaseDate",
      header: "Release Date",
      cell: ({ row }) => formatDate(row.original.releaseDate),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={statusVariant[row.original.status]}>{statusLabel[row.original.status]}</Badge>,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(row.original)}>
              <Eye className="h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(row.original)}>
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
