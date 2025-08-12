import React, { useState, useCallback } from "react";
import { UpsertRestaurantAdminForm } from "./UpsertRestaurantAdminForm";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import MenuItem from "@mui/material/MenuItem";
import {
  useGetRestaurantAdminsQuery,
  useDeleteRestaurantAdminMutation,
  type RestaurantAdmin,
} from "../../reducer/restaurantAdminApi";
import { ConfirmationModal } from "../../common/ConfirmationModal";

const RestaurantAdminTable: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<RestaurantAdmin | null>(
    null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useGetRestaurantAdminsQuery();

  const [deleteRestaurantAdmin, { isLoading: isDeleting }] =
    useDeleteRestaurantAdminMutation?.() ?? [() => {}, {}];

  const handleUpdate = useCallback(
    (admin: RestaurantAdmin, closeMenu: () => void) => {
      setSelectedAdmin(admin);
      setShowForm(true);
      closeMenu();
    },
    []
  );

  const handleDelete = useCallback(
    (admin: RestaurantAdmin, closeMenu: () => void) => {
      setSelectedAdmin(admin);
      setConfirmOpen(true);
      closeMenu();
    },
    []
  );

  const confirmDelete = useCallback(async () => {
    if (!selectedAdmin) return;
    try {
      await deleteRestaurantAdmin(selectedAdmin.keycloakId).unwrap();
      setConfirmOpen(false);
      setSelectedAdmin(null);
    } catch {}
  }, [deleteRestaurantAdmin, selectedAdmin]);

  if (isLoading) return <div style={{ margin: 32 }}>Loading admins...</div>;
  if (isError)
    return (
      <div style={{ margin: 32, color: "red" }}>Error: {String(error)}</div>
    );

  const columns: MRT_ColumnDef<RestaurantAdmin>[] = [
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "firstName",
      header: "First name",
    },
    {
      accessorKey: "lastName",
      header: "Last name",
    },
    {
      accessorKey: "restaurantName",
      header: "Restaurant",
    },
  ];

  return (
    <div style={{ margin: 32 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Restaurant Admin</h2>
        <button
          onClick={() => {
            setSelectedAdmin(null);
            setShowForm((v) => !v);
          }}
          style={{
            padding: "8px 16px",
            background: "#23272f",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          Add Admin
        </button>
      </div>
      {showForm && (
        <UpsertRestaurantAdminForm
          onClose={() => {
            setShowForm(false);
            setSelectedAdmin(null);
          }}
          admin={selectedAdmin}
        />
      )}
      <div style={{ marginTop: 24 }}>
        <MaterialReactTable
          columns={columns}
          data={items}
          enableColumnActions={false}
          enableColumnFilters={true}
          enableSorting={true}
          enablePagination={true}
          muiTablePaperProps={{
            elevation: 0,
            sx: { borderRadius: 2 },
          }}
          enableRowActions
          positionActionsColumn="last"
          renderRowActionMenuItems={({ row, closeMenu }) => [
            <MenuItem
              key="update"
              onClick={() => handleUpdate(row.original, closeMenu)}
              aria-label="Update Admin"
            >
              Update
            </MenuItem>,
            <MenuItem
              key="delete"
              onClick={() => handleDelete(row.original, closeMenu)}
              disabled={!!row.original.restaurantName}
              sx={{ color: "#f44336" }}
              aria-label="Delete Admin"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </MenuItem>,
          ]}
        />
      </div>
      <ConfirmationModal
        isOpen={confirmOpen}
        message={`Are you sure you want to delete admin "${selectedAdmin?.username}"?`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedAdmin(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default RestaurantAdminTable;
