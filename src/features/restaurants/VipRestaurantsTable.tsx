import React, { useState } from "react";
import { CreateVipRestaurantForm } from "./CreateVipRestaurants.tsx";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  useGetVipRestaurantsQuery,
  type VipRestaurant,
} from "../../reducer/vipRestaurantsApi.ts";

const VipRestaurantsTable: React.FC = () => {
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useGetVipRestaurantsQuery();

  const [showForm, setShowForm] = useState(false);

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
      Cell: ({ row }) => row.original.restaurant?.name ?? "",
    },
    {
      accessorKey: "discount",
      header: "Discount",
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
          onClick={() => setShowForm((v) => !v)}
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
        <CreateVipRestaurantForm onClose={() => setShowForm(false)} />
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

export default VipRestaurantsTable;
