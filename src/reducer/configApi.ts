import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";
import { setSuccess } from "./toastSlice";

export interface Challenge {
  id?: number;
  period: number;
  visitsRequired: number;
}

export interface RestaurantConfig {
  restaurantId?: number;
  fontColor: string;
  backgroundColor: string;
  headerAndButtonColor: string;
  restaurantName?: string;
  restaurantDisplayName: string;
  description: string;
  logo: string | null;
  backgroundImage: string | null;
  challengeList: Challenge[];
  premiumCouponLimit?: number;
  vipCouponLimit?: number;
}

export const configApi = createApi({
  reducerPath: "configApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.RESTAURANTS_CONFIG],
  endpoints: (builder) => ({
    getRestaurantConfig: builder.query<RestaurantConfig, number | undefined>({
      query: (restaurantId) => ({
        url: `/restaurants/config-data/${restaurantId}`,
      }),
    }),
    saveConfig: builder.mutation<RestaurantConfig, RestaurantConfig>({
      query: (config) => ({
        url: "/restaurant-configs",
        method: "POST",
        body: config,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newConfig } = await queryFulfilled;
          dispatch(
            configApi.util.updateQueryData(
              "getRestaurantConfig",
              newConfig.restaurantId,
              () => newConfig
            )
          );
          dispatch(setSuccess("Config saved successfully!"));
        } catch {}
      },
    }),
  }),
});

export const { useGetRestaurantConfigQuery, useSaveConfigMutation } = configApi;
