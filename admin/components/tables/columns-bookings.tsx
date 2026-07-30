"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

const statusVariant: Record<BookingStatus, "success" | "warning" | "destructive" | "secondary"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "destructive",
  refunded: "secondary",
};

interface BookingColumnActions {
  onView: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}

export function getBookingColumns({ onView, onDelete }: BookingColumnActions): ColumnDef<Booking>[] {
  return [
    { accessorKey: "bookingCode", header: "Booking ID", cell: ({ row }) => <span className="font-mono text-xs font-medium">{row.original.bookingCode}</span> },
    { accessorKey: "movieTitle", header: "Movie" },
    { accessorKey: "theatreName", header: "Theatre" },
    { accessorKey: "userName", header: "User" },
    { accessorKey: "seats", header: "Seats", cell: ({ row }) => row.original.seats.join(", ") },
    { accessorKey: "amount", header: "Amount", cell: ({ row }) => formatCurrency(row.original.amount) },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status]} className="capitalize">
          {row.original.status}
        </Badge>
      ),
    },
    { accessorKey: "bookingDate", header: "Booking Date", cell: ({ row }) => formatDate(row.original.bookingDate) },
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
