import type { MRT_ColumnDef } from "material-react-table";
import { Link } from "react-router-dom";
import type { Company } from "../../reducer/companyApi";

export const companyTableColumns: MRT_ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "employees",
    header: "Employees",
    Cell: ({ row }) => (
      <Link to={`/employee/${row.original.id}`} title="View Employees">
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
