"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Eye, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Theatre } from "@/types";

interface TheatreColumnActions {
  onView: (theatre: Theatre) => void;
  onEdit: (theatre: Theatre) => void;
  onDelete: (theatre: Theatre) => void;
}

export function getTheatreColumns({ onView, onEdit, onDelete }: TheatreColumnActions): ColumnDef<Theatre>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <p className="font-medium">{row.original.name}</p>,
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-sm">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {row.original.city}
        </span>
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.address}</span>,
    },
    {
      accessorKey: "totalSeats",
      header: "Total Seats",
      cell: ({ row }) => `${row.original.totalSeats} · ${row.original.screens} screens`,
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
