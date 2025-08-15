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
import { useTranslation } from "react-i18next";
import { useTableLocalization } from "../hooks/useTableLocalization.ts";

const VipRestaurantsTable: React.FC = () => {
  const { t } = useTranslation();
  const localization = useTableLocalization();
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
    return <div style={{ margin: 32 }}>{t("Loading restaurants...")}</div>;
  if (isError)
    return (
      <div style={{ margin: 32, color: "red" }}>
        {t("Error")}: {String(error)}
      </div>
    );

  const columns: MRT_ColumnDef<VipRestaurant>[] = [
    {
      accessorKey: "restaurant.name",
      header: t("Restaurant"),
      Cell: ({ row }) => row.original.restaurant.name ?? "",
    },
    {
      accessorKey: "discount",
      header: t("Discount"),
      Cell: ({ row }) => {
        const { generalDiscount } = row.original;
        if (generalDiscount !== null && generalDiscount !== undefined) {
          return <span>{generalDiscount}</span>;
        } else {
          const { levelDiscounts: { STANDARD, VIP, PREMIUM } = {} } =
            row.original;
          return (
            <div>
              <div>
                {t("STANDARD")}: {STANDARD}%
              </div>
              <div>
                {t("VIP")}: {VIP}%
              </div>
              <div>
                {t("PREMIUM")}: {PREMIUM}%
              </div>
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
        <h2>{t("VIP Restaurants")}</h2>
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
          {t("Add VIP Restaurant")}
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
          localization={localization}
          renderRowActionMenuItems={({ row, closeMenu }) => [
            <MenuItem
              key="update"
              onClick={() => handleUpdate(row.original, closeMenu)}
              aria-label={t("Update VIP Restaurant")}
            >
              {t("Update")}
            </MenuItem>,
            <MenuItem
              key="delete"
              onClick={() => handleDelete(row.original, closeMenu)}
              disabled={isDeleting}
              sx={{ color: "#f44336" }}
              aria-label={t("Delete VIP Restaurant")}
            >
              {isDeleting ? t("Deleting...") : t("Delete")}
            </MenuItem>,
          ]}
        />
      </div>
      <ConfirmationModal
        isOpen={confirmOpen}
        message={
          selectedRestaurant
            ? t('Are you sure you want to delete VIP restaurant "{{name}}"?', {
                name: selectedRestaurant.restaurant.name,
              })
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedRestaurant(null);
        }}
        confirmText={t("Delete")}
        cancelText={t("Cancel")}
      />
    </div>
  );
};

export default VipRestaurantsTable;
