import React, { useState, useCallback } from "react";
import { UpsertRestaurantForm } from "./UpsertRestaurantForm.tsx";
import { Link } from "react-router-dom";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import MenuItem from "@mui/material/MenuItem";
import {
  useGetRestaurantsQuery,
  type Restaurant,
} from "../../reducer/restaurantsApi.ts";

const RestaurantsTable: React.FC = () => {
  const {
    data: restaurants = [],
    isLoading,
    isError,
    error,
  } = useGetRestaurantsQuery();
  const [showForm, setShowForm] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleUpdate = useCallback(
    (restaurant: Restaurant, closeMenu: () => void) => {
      setSelectedRestaurant(restaurant);
      setShowForm(true);
      closeMenu();
    },
    []
  );

  const columns: MRT_ColumnDef<Restaurant>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "pib",
      header: "Pib",
    },
    {
      accessorKey: "coupons",
      header: "Coupons",
      Cell: ({ row }) => (
        <Link to={`/coupons/${row.original.id}`} title="View Coupons">
          <span
            role="img"
            aria-label="magnifier"
            style={{ fontSize: 20, cursor: "pointer" }}
          >
            🔍
          </span>
        </Link>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];

  if (isLoading)
    return <div style={{ margin: 32 }}>Loading restaurants...</div>;
  if (isError)
    return (
      <div style={{ margin: 32, color: "red" }}>Error: {String(error)}</div>
    );

  return (
    <div style={{ margin: 32 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Restaurants</h2>
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
          Add Restaurant
        </button>
      </div>
      {showForm && (
        <UpsertRestaurantForm
          onClose={() => {
            setShowForm(false);
            setSelectedRestaurant(null);
          }}
          restaurant={selectedRestaurant}
        />
      )}
      <div style={{ marginTop: 24 }}>
        <MaterialReactTable
          columns={columns}
          data={restaurants}
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
              aria-label="Update Restaurant"
            >
              Update
            </MenuItem>,
          ]}
        />
      </div>
    </div>
  );
};

export default RestaurantsTable;
