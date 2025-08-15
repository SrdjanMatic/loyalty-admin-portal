import type { MRT_ColumnDef } from "material-react-table";
import { Link } from "react-router-dom";
import type { Company } from "../../reducer/companyApi";
import { useTranslation } from "react-i18next";

// Helper to get translated headers
export const useCompanyTableColumns = (): MRT_ColumnDef<Company>[] => {
  const { t } = useTranslation();

  return [
    {
      accessorKey: "name",
      header: t("Name"),
    },
    {
      accessorKey: "employees",
      header: t("Employees"),
      Cell: ({ row }) => (
        <Link to={`/employee/${row.original.id}`} title={t("View Employees")}>
          <span
            role="img"
            aria-label="magnifier"
            style={{ fontSize: 20, cursor: "pointer" }}
          >
            🔍
          </span>
        </Link>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];
};
