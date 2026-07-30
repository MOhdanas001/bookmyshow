"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Show } from "@/types";

interface ShowColumnActions {
  onView: (show: Show) => void;
  onEdit: (show: Show) => void;
  onDelete: (show: Show) => void;
}

export function getShowColumns({ onView, onEdit, onDelete }: ShowColumnActions): ColumnDef<Show>[] {
  return [
    {
      accessorKey: "movieTitle",
      header: "Movie",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.movieTitle}</p>
          <p className="text-xs text-muted-foreground">{row.original.screen}</p>
        </div>
      ),
    },
    { accessorKey: "theatreName", header: "Theatre" },
    { accessorKey: "date", header: "Date", cell: ({ row }) => formatDate(row.original.date) },
    { accessorKey: "time", header: "Time" },
    {
      accessorKey: "ticketPrice",
      header: "Ticket Price",
      cell: ({ row }) => formatCurrency(row.original.ticketPrice),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(row.original)}><Eye className="h-4 w-4" /> View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}><Pencil className="h-4 w-4" /> Edit</DropdownMenuItem>
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
