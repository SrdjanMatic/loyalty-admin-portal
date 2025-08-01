import React, { useState } from "react";

import { CreateNotificationForm } from "./CreateNotificationForm";
import { useParams } from "react-router-dom";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  useGetNotificationsQuery,
  type Notification,
} from "../../reducer/notificationApi";

const NotificationTable: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
  } = useGetNotificationsQuery(Number(restaurantId));
  const [showForm, setShowForm] = useState(false);

  if (isLoading)
    return <div style={{ margin: 32 }}>Loading notifications...</div>;
  if (isError)
    return (
      <div style={{ margin: 32, color: "red" }}>Error: {String(error)}</div>
    );

  const columns: MRT_ColumnDef<Notification>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "foodType",
      header: "Food Types",
    },
    {
      accessorKey: "partOfDay",
      header: "Parts of Day",
    },
    {
      accessorKey: "validFrom",
      header: "Valid From",
    },
    {
      accessorKey: "validUntil",
      header: "Valid Until",
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
        <h2>Notification</h2>
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
          Add notification
        </button>
      </div>
      {showForm && (
        <CreateNotificationForm onClose={() => setShowForm(false)} />
      )}
      <div style={{ marginTop: 24 }}>
        <MaterialReactTable<Notification>
          columns={columns}
          data={notifications}
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

export default NotificationTable;
