import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";

export interface DashboardStatistic {
  restaurantName: String;
  pib: String;
  address: String;
  phone: String;
  loyaltyUsers: number;
  foodPreferencesMap: Record<string, number>;
  receiptsPerDay: Record<string, number>;
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.DASHBOARD],
  endpoints: (builder) => ({
    getDashboardStatistic: builder.query<DashboardStatistic, number>({
      query: (restaurantId) => `/dashboards/${restaurantId}`,
      providesTags: (_result, _error, restaurantId) => [
        { type: QUERY_TAGS.DASHBOARD, id: restaurantId },
      ],
    }),
  }),
});

export const { useGetDashboardStatisticQuery } = dashboardApi;
