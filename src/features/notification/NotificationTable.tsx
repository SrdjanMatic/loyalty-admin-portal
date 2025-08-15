import React, { useState } from "react";
import { CreateNotificationForm } from "./CreateNotificationForm";
import { useParams } from "react-router-dom";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  useGetNotificationsQuery,
  type Notification,
} from "../../reducer/notificationApi";
import { useTranslation } from "react-i18next";
import { useTableLocalization } from "../hooks/useTableLocalization";

const NotificationTable: React.FC = () => {
  const { t } = useTranslation();
  const localization = useTableLocalization();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
  } = useGetNotificationsQuery(Number(restaurantId));
  const [showForm, setShowForm] = useState(false);

  if (isLoading)
    return <div style={{ margin: 32 }}>{t("Loading notifications...")}</div>;
  if (isError)
    return (
      <div style={{ margin: 32, color: "red" }}>
        {t("Error")}: {String(error)}
      </div>
    );

  const columns: MRT_ColumnDef<Notification>[] = [
    {
      accessorKey: "title",
      header: t("Title"),
    },
    {
      accessorKey: "foodType",
      header: t("Food Types"),
    },
    {
      accessorKey: "partOfDay",
      header: t("Parts of Day"),
    },
    {
      accessorKey: "validFrom",
      header: t("Valid From"),
    },
    {
      accessorKey: "validUntil",
      header: t("Valid Until"),
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
        <h2>{t("Notification")}</h2>
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
          {t("Add notification")}
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
          localization={localization}
        />
      </div>
    </div>
  );
};

export default NotificationTable;
