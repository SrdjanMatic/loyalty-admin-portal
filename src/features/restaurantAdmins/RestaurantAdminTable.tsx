import React, { useState } from "react";
import { CreateRestaurantAdminForm } from "./CreateRestaurantAdminForm";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  useGetRestaurantAdminsQuery,
  type RestaurantAdmin,
} from "../../reducer/restaurantAdminApi";

const RestaurantAdminTable: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useGetRestaurantAdminsQuery();

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
          onClick={() => setShowForm((v) => !v)}
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
        <CreateRestaurantAdminForm onClose={() => setShowForm(false)} />
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
        />
      </div>
    </div>
  );
};

export default RestaurantAdminTable;
