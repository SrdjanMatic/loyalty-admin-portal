import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CreateEmployeeForm } from "./CreateEmployeeForm.tsx";
import {
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
  type Employee,
} from "../../reducer/employeeApi.ts";
import { ConfirmationModal } from "../../common/ConfirmationModal.tsx";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";

const EmployeesTable: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const numericCompanyId = Number(companyId);

  const { data: employees, status } = useGetEmployeesQuery(numericCompanyId, {
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

  if (status === "pending")
    return <div style={{ margin: 32 }}>Loading employees...</div>;

  const columns: MRT_ColumnDef<Employee>[] = [
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
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <button
          onClick={() => {
            setSelectedEmployee(row.original);
            setConfirmOpen(true);
          }}
          disabled={isDeleting}
          style={{
            background: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "4px 12px",
            cursor: "pointer",
            opacity: isDeleting ? 0.6 : 1,
          }}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
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
        <h2>Employees</h2>
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
          Add Employee
        </button>
      </div>
      {showForm && (
        <CreateEmployeeForm
          onClose={() => setShowForm(false)}
          companyId={numericCompanyId}
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
