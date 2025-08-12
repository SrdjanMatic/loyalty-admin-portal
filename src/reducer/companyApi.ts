import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";
import { setSuccess } from "./toastSlice";

export interface Company {
  id: number;
  name: string;
}

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.COMPANIES],
  endpoints: (builder) => ({
    getCompanies: builder.query<Company[], void>({
      query: () => "/companies",
    }),
    createCompany: builder.mutation<Company, Omit<Company, "id">>({
      query: (company) => ({
        url: "/companies",
        method: "POST",
        body: company,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newCompany } = await queryFulfilled;
          dispatch(
            companyApi.util.updateQueryData(
              "getCompanies",
              undefined,
              (draft) => {
                draft.unshift(newCompany);
              }
            )
          );
          dispatch(setSuccess("Company created successfully!"));
        } catch {}
      },
    }),
    updateCompany: builder.mutation<Company, { id: number; name: string }>({
      query: ({ id, ...patch }) => ({
        url: `/companies/${id}`,
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedCompany } = await queryFulfilled;
          dispatch(
            companyApi.util.updateQueryData(
              "getCompanies",
              undefined,
              (draft: Company[]) => {
                const idx = draft.findIndex((c) => c.id === id);
                if (idx !== -1) draft[idx] = updatedCompany;
              }
            )
          );
          dispatch(setSuccess("Company updated successfully!"));
        } catch {}
      },
    }),
    deleteCompany: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/companies/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            companyApi.util.updateQueryData(
              "getCompanies",
              undefined,
              (draft: Company[]) => {
                const idx = draft.findIndex((c) => c.id === id);
                if (idx !== -1) draft.splice(idx, 1);
              }
            )
          );
          dispatch(setSuccess("Company deleted successfully!"));
        } catch {}
      },
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
