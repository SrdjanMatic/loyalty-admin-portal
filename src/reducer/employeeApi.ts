import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";

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
      query: (companyId) => `/employees/${companyId}`,
      providesTags: (result, error, companyId) => [
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
      invalidatesTags: (result, error, { companyId }) => [
        { type: QUERY_TAGS.EMPLOYEES, id: companyId },
      ],
    }),
    deleteEmployee: builder.mutation<
      { success: boolean },
      { id: number; companyId: number }
    >({
      query: ({ id }) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { companyId }) => [
        { type: QUERY_TAGS.EMPLOYEES, id: companyId },
      ],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesApi;
