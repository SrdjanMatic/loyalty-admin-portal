import type { MRT_ColumnDef } from "material-react-table";
import { Employee } from "../../reducer/employeeApi";

export const employeeTableColumns: MRT_ColumnDef<Employee>[] = [
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
];
