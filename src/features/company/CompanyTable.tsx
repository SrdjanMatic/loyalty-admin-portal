import React, { useState, useCallback } from "react";
import { MaterialReactTable } from "material-react-table";
import MenuItem from "@mui/material/MenuItem";
import {
  useGetCompaniesQuery,
  useDeleteCompanyMutation,
  type Company,
} from "../../reducer/companyApi";
import { useCompanyTableColumns } from "./CompanyTableColumns";
import { UpsertCompanyForm } from "./UpsertCompanyForm";
import { ConfirmationModal } from "../../common/ConfirmationModal";
import { useTranslation } from "react-i18next";
import { useTableLocalization } from "../hooks/useTableLocalization";

const CompanyTable: React.FC = () => {
  const { t } = useTranslation();
  const localization = useTableLocalization();
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const columns = useCompanyTableColumns();

  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useGetCompaniesQuery();

  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();

  // Memoized handlers
  const handleUpdate = useCallback(
    (company: Company, closeMenu: () => void) => {
      setSelectedCompany(company);
      setShowForm(true);
      closeMenu();
    },
    []
  );

  const handleDelete = useCallback(
    (company: Company, closeMenu: () => void) => {
      setSelectedCompany(company);
      setConfirmOpen(true);
      closeMenu();
    },
    []
  );
  const confirmDelete = useCallback(async () => {
    if (!selectedCompany) return;
    try {
      await deleteCompany(selectedCompany.id).unwrap();
      setConfirmOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      // Error toast handled globally
    }
  }, [deleteCompany, selectedCompany]);

  if (isLoading)
    return <div style={{ margin: 32 }}>{t("Loading companies...")}</div>;
  if (isError)
    return (
      <div style={{ margin: 32, color: "red" }}>
        {t("Error")}: {String(error)}
      </div>
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
        <h2>{t("Companies")}</h2>
        <button
          onClick={() => {
            setSelectedCompany(null);
            setShowForm(true);
          }}
          style={{
            padding: "8px 16px",
            background: "#23272f",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontWeight: 500,
            cursor: "pointer",
          }}
          aria-label={t("Add Company")}
        >
          {t("Add Company")}
        </button>
      </div>
      {showForm && (
        <UpsertCompanyForm
          onClose={() => setShowForm(false)}
          company={selectedCompany}
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
              aria-label={t("Update Company")}
            >
              {t("Update")}
            </MenuItem>,
            <MenuItem
              key="delete"
              onClick={() => handleDelete(row.original, closeMenu)}
              disabled={isDeleting}
              sx={{ color: "#f44336" }}
              aria-label={t("Delete Company")}
            >
              {isDeleting ? t("Deleting...") : t("Delete")}
            </MenuItem>,
          ]}
        />
      </div>
      <ConfirmationModal
        isOpen={confirmOpen}
        message={
          selectedCompany
            ? t('Are you sure you want to delete company "{{name}}"?', {
                name: selectedCompany.name,
              })
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedCompany(null);
        }}
        confirmText={t("Delete")}
        cancelText={t("Cancel")}
      />
    </div>
  );
};

export default CompanyTable;
