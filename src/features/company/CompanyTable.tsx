import React, { useState } from "react";

import { CreateCompanyForm } from "./CreateCompanyForm";
import { Link } from "react-router-dom";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useGetCompaniesQuery, type Company } from "../../reducer/companyApi";
import { companyTableColumns } from "./CompanyTableColumns";

const CompanyTable: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useGetCompaniesQuery();

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
          onClick={() => setShowForm((v) => !v)}
          style={{
            padding: "8px 16px",
            background: "#23272f",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          Add Company
        </button>
      </div>
      {showForm && <CreateCompanyForm onClose={() => setShowForm(false)} />}
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
        />
      </div>
    </div>
  );
};

export default CompanyTable;
