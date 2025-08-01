import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";

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
        } catch {}
      },
    }),
  }),
});

export const { useGetCompaniesQuery, useCreateCompanyMutation } = companyApi;
