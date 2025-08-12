import React, { useState, useCallback } from "react";
import { MaterialReactTable } from "material-react-table";
import MenuItem from "@mui/material/MenuItem";
import {
  useGetCompaniesQuery,
  useDeleteCompanyMutation,
  type Company,
} from "../../reducer/companyApi";
import { companyTableColumns } from "./CompanyTableColumns";
import { UpsertCompanyForm } from "./UpsertCompanyForm";
import { ConfirmationModal } from "../../common/ConfirmationModal";

const CompanyTable: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  if (isLoading) return <div style={{ margin: 32 }}>Loading companies...</div>;
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
        <h2>Companies</h2>
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
          aria-label="Add Company"
        >
          Add Company
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
          columns={companyTableColumns}
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
              aria-label="Update Company"
            >
              Update
            </MenuItem>,
            <MenuItem
              key="delete"
              onClick={() => handleDelete(row.original, closeMenu)}
              disabled={isDeleting}
              sx={{ color: "#f44336" }}
              aria-label="Delete Company"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </MenuItem>,
          ]}
        />
      </div>
      <ConfirmationModal
        isOpen={confirmOpen}
        message={`Are you sure you want to delete company "${selectedCompany?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedCompany(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default CompanyTable;
