import React, { useState } from "react";
import { CreateRestaurantForm } from "./CreateRestaurantForm.tsx";
import { Link } from "react-router-dom";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
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
          onClick={() => setShowForm((v) => !v)}
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
      {showForm && <CreateRestaurantForm onClose={() => setShowForm(false)} />}
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
        />
      </div>
    </div>
  );
};

export default RestaurantsTable;
