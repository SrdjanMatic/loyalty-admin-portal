import React, { useState, useCallback } from "react";
import { UpsertVipRestaurantForm } from "./UpsertVipRestaurantForm.tsx";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import MenuItem from "@mui/material/MenuItem";
import {
  useGetVipRestaurantsQuery,
  useDeleteVipRestaurantMutation,
  type VipRestaurant,
} from "../../reducer/vipRestaurantsApi.ts";
import { ConfirmationModal } from "../../common/ConfirmationModal";

const VipRestaurantsTable: React.FC = () => {
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useGetVipRestaurantsQuery();

  const [showForm, setShowForm] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<VipRestaurant | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteVipRestaurant, { isLoading: isDeleting }] =
    useDeleteVipRestaurantMutation();

  const handleUpdate = useCallback(
    (restaurant: VipRestaurant, closeMenu: () => void) => {
      setSelectedRestaurant(restaurant);
      setShowForm(true);
      closeMenu();
    },
    []
  );

  const handleDelete = useCallback(
    (restaurant: VipRestaurant, closeMenu: () => void) => {
      setSelectedRestaurant(restaurant);
      setConfirmOpen(true);
      closeMenu();
    },
    []
  );

  const confirmDelete = useCallback(async () => {
    if (!selectedRestaurant) return;
    try {
      await deleteVipRestaurant(selectedRestaurant.id).unwrap();
      setConfirmOpen(false);
      setSelectedRestaurant(null);
    } catch {}
  }, [deleteVipRestaurant, selectedRestaurant]);

  if (isLoading)
    return <div style={{ margin: 32 }}>Loading restaurants...</div>;
  if (isError)
    return (
      <div style={{ margin: 32, color: "red" }}>Error: {String(error)}</div>
    );

  const columns: MRT_ColumnDef<VipRestaurant>[] = [
    {
      accessorKey: "restaurant.name",
      header: "Restaurant",
      Cell: ({ row }) => row.original.restaurant.name ?? "",
    },
    {
      accessorKey: "discount",
      header: "Discount",
      Cell: ({ row }) => {
        const { generalDiscount } = row.original;
        if (generalDiscount !== null && generalDiscount !== undefined) {
          return <span>{generalDiscount}</span>;
        } else {
          const { levelDiscounts: { STANDARD, VIP, PREMIUM } = {} } =
            row.original;
          return (
            <div>
              <div>STANDARD: {STANDARD}%</div>
              <div>VIP: {VIP}%</div>
              <div>PREMIUM: {PREMIUM}%</div>
            </div>
          );
        }
      },
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
        <h2>VIP Restaurants</h2>
        <button
          onClick={() => {
            setSelectedRestaurant(null);
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
          Add VIP Restaurant
        </button>
      </div>
      {showForm && (
        <UpsertVipRestaurantForm
          onClose={() => {
            setShowForm(false);
            setSelectedRestaurant(null);
          }}
          vipRestaurant={selectedRestaurant}
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
              aria-label="Update VIP Restaurant"
            >
              Update
            </MenuItem>,
            <MenuItem
              key="delete"
              onClick={() => handleDelete(row.original, closeMenu)}
              disabled={isDeleting}
              sx={{ color: "#f44336" }}
              aria-label="Delete VIP Restaurant"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </MenuItem>,
          ]}
        />
      </div>
      <ConfirmationModal
        isOpen={confirmOpen}
        message={`Are you sure you want to delete VIP restaurant "${selectedRestaurant?.restaurant.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedRestaurant(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default VipRestaurantsTable;
