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
import { employeeTableColumns } from "./EmployeeTableColumns.tsx";

const EmployeesTable: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const numericCompanyId = Number(companyId);

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
    return <div style={{ margin: 32 }}>Loading employees...</div>;
  }
  if (error) {
    return (
      <div style={{ margin: 32, color: "red" }}>
        Failed to load employees. Please try again later.
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
        <h2>Employees</h2>
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
          Add Employee
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
          columns={employeeTableColumns}
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
          renderRowActionMenuItems={({ row, closeMenu }) => [
            <MenuItem
              key="update"
              onClick={() => handleUpdate(row.original, closeMenu)}
            >
              Update
            </MenuItem>,
            <MenuItem
              key="delete"
              onClick={() => handleDelete(row.original, closeMenu)}
              disabled={isDeleting}
              sx={{ color: "#f44336" }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </MenuItem>,
          ]}
        />
      </div>
      <ConfirmationModal
        isOpen={confirmOpen}
        message={`Are you sure you want to delete employee "${selectedEmployee?.firstName} ${selectedEmployee?.lastName}"?`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedEmployee(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default EmployeesTable;
