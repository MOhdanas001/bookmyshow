"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/data-table";
import { getUserColumns } from "@/components/tables/columns-users";
import { UserForm } from "@/components/forms/user-form";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/use-users";
import type { User, UserInput } from "@/types";

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const columns = getUserColumns({
    onEdit: (u) => { setEditingUser(u); setFormOpen(true); },
    onDelete: setDeletingUser,
  });

  function handleSubmit(values: UserInput) {
    if (editingUser) {
      updateUser.mutate({ id: editingUser.id, input: values }, { onSuccess: closeForm });
    } else {
      createUser.mutate(values, { onSuccess: closeForm });
    }
  }

  function closeForm() {
    setFormOpen(false);
    setEditingUser(null);
  }

  return (
    <div>
      <PageHeader title="Users" description="Manage customers, managers, and admins.">
        <Button onClick={() => { setEditingUser(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={users ?? []}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search users by name..."
        emptyTitle="No users yet"
        emptyDescription="Add your first user to get started."
      />

      <Dialog open={formOpen} onOpenChange={(open) => (open ? setFormOpen(true) : closeForm())}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update the user's details below." : "Fill in the details to add a new user."}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            defaultValues={editingUser ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isSubmitting={createUser.isPending || updateUser.isPending}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        title={`Delete "${deletingUser?.name}"?`}
        description="This will permanently remove this user's account."
        isPending={deleteUser.isPending}
        onConfirm={() =>
          deletingUser && deleteUser.mutate(deletingUser.id, { onSuccess: () => setDeletingUser(null) })
        }
      />
    </div>
  );
}
