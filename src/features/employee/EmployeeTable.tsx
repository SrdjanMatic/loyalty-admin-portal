import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { UpsertEmployeeForm } from "./UpsertEmployeeForm.tsx";
import {
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
  type Employee,
} from "../../reducer/employeeApi.ts";
import { ConfirmationModal } from "../../common/ConfirmationModal.tsx";
import { MaterialReactTable } from "material-react-table";
import MenuItem from "@mui/material/MenuItem";
import { useEmployeeTableColumns } from "./EmployeeTableColumns";
import { useTranslation } from "react-i18next";
import { useTableLocalization } from "../hooks/useTableLocalization.ts";

const EmployeesTable: React.FC = () => {
  const { t } = useTranslation();
  const localization = useTableLocalization();
  const { companyId } = useParams<{ companyId: string }>();
  const numericCompanyId = Number(companyId);

  const columns = useEmployeeTableColumns();

  const {
    data: employees,
    status,
    error,
  } = useGetEmployeesQuery(numericCompanyId, {
    skip: !companyId,
  });
  const [deleteEmployee, { isLoading: isDeleting }] =
    useDeleteEmployeeMutation();
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const confirmDelete = async () => {
    if (!numericCompanyId || !selectedEmployee) return;

    try {
      await deleteEmployee({
        id: selectedEmployee.id,
        companyId: numericCompanyId,
      }).unwrap();
      setConfirmOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const handleUpdate = useCallback(
    (employee: Employee, closeMenu: () => void) => {
      setSelectedEmployee(employee);
      setShowForm(true);
      closeMenu();
    },
    []
  );

  const handleDelete = useCallback(
    (employee: Employee, closeMenu: () => void) => {
      setSelectedEmployee(employee);
      setConfirmOpen(true);
      closeMenu();
    },
    []
  );

  if (status === "pending") {
    return <div style={{ margin: 32 }}>{t("Loading employees...")}</div>;
  }
  if (error) {
    return (
      <div style={{ margin: 32, color: "red" }}>
        {t("Failed to load employees. Please try again later.")}
      </div>
    );
  }

  return (
    <div style={{ margin: 32 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>{t("Employees")}</h2>
        <button
          onClick={() => {
            setSelectedEmployee(null);
            setShowForm(true);
          }}
          style={{
            padding: "8px 16px",
            background: "#23272f",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          {t("Add Employee")}
        </button>
      </div>
      {showForm && (
        <UpsertEmployeeForm
          onClose={() => setShowForm(false)}
          companyId={numericCompanyId}
          employee={selectedEmployee}
        />
      )}
      <div style={{ marginTop: 24 }}>
        <MaterialReactTable
          columns={columns}
          data={employees ?? []}
          enableColumnActions={false}
          enableColumnFilters={true}
          enableSorting={true}
          enablePagination={true}
          muiTablePaperProps={{
            elevation: 0,
            sx: { borderRadius: 2 },
          }}
          enableRowActions={true}
          positionActionsColumn="last"
          localization={localization}
          renderRowActionMenuItems={({ row, closeMenu }) => [
            <MenuItem
              key="update"
              onClick={() => handleUpdate(row.original, closeMenu)}
            >
              {t("Update")}
            </MenuItem>,
            <MenuItem
              key="delete"
              onClick={() => handleDelete(row.original, closeMenu)}
              disabled={isDeleting}
              sx={{ color: "#f44336" }}
            >
              {isDeleting ? t("Deleting...") : t("Delete")}
            </MenuItem>,
          ]}
        />
      </div>
      <ConfirmationModal
        isOpen={confirmOpen}
        message={
          selectedEmployee
            ? t('Are you sure you want to delete employee "{{name}}"?', {
                name: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
              })
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedEmployee(null);
        }}
        confirmText={t("Delete")}
        cancelText={t("Cancel")}
      />
    </div>
  );
};

export default EmployeesTable;
