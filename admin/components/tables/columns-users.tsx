"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/utils";
import type { User, UserRole, UserStatus } from "@/types";

const roleVariant: Record<UserRole, "info" | "warning" | "secondary"> = {
  admin: "warning",
  manager: "info",
  customer: "secondary",
};

const statusVariant: Record<UserStatus, "success" | "secondary" | "destructive"> = {
  active: "success",
  inactive: "secondary",
  banned: "destructive",
};

interface UserColumnActions {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function getUserColumns({ onEdit, onDelete }: UserColumnActions): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
            <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant={roleVariant[row.original.role]} className="capitalize">{row.original.role}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={statusVariant[row.original.status]} className="capitalize">{row.original.status}</Badge>,
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
