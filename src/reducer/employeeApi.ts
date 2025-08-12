import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";
import { setSuccess } from "./toastSlice";

export interface Employee {
  id: number;
  firstName: string;
  email: string;
  lastName: string;
  companyId: number;
}

export const employeesApi = createApi({
  reducerPath: "employeesApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.EMPLOYEES],
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], number>({
      query: (companyId) => ({
        url: "/employees",
        params: { companyId },
      }),
      providesTags: (_result, _error, companyId) => [
        { type: QUERY_TAGS.EMPLOYEES, id: companyId },
      ],
    }),

    createEmployee: builder.mutation<
      Employee,
      Omit<Employee, "id"> & { companyId: number }
    >({
      query: (employee) => ({
        url: "/employees",
        method: "POST",
        body: employee,
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newEmployee } = await queryFulfilled;

          dispatch(
            employeesApi.util.updateQueryData(
              "getEmployees",
              newEmployee.companyId,
              (draft) => {
                draft.unshift(newEmployee);
              }
            )
          );
          dispatch(setSuccess("Employee created successfully!"));
        } catch {}
      },
    }),
    updateEmployee: builder.mutation<
      Employee,
      Omit<Employee, "email"> & { companyId: number }
    >({
      query: ({ id, ...patch }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedEmployee } = await queryFulfilled;
          dispatch(
            employeesApi.util.updateQueryData(
              "getEmployees",
              updatedEmployee.companyId,
              (draft: Employee[]) => {
                const idx = draft.findIndex((e) => e.id === updatedEmployee.id);
                if (idx !== -1) draft[idx] = updatedEmployee;
              }
            )
          );
          dispatch(setSuccess("Employee updated successfully!"));
        } catch {}
      },
    }),
    deleteEmployee: builder.mutation<
      { success: boolean },
      { id: number; companyId: number }
    >({
      query: ({ id }) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { companyId }) => [
        { type: QUERY_TAGS.EMPLOYEES, id: companyId },
      ],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesApi;
