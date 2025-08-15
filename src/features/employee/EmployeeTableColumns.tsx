import type { MRT_ColumnDef } from "material-react-table";
import { Employee } from "../../reducer/employeeApi";
import { useTranslation } from "react-i18next";

export const useEmployeeTableColumns = (): MRT_ColumnDef<Employee>[] => {
  const { t } = useTranslation();

  return [
    {
      accessorKey: "email",
      header: t("Email"),
    },
    {
      accessorKey: "firstName",
      header: t("First name"),
    },
    {
      accessorKey: "lastName",
      header: t("Last name"),
    },
  ];
};
