import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";
import type { Restaurant } from "./restaurantsApi";

export interface VipRestaurant {
  id: number;
  restaurant?: Restaurant;
  restaurantId?: number;
  discount: number;
  backgroundImage: string;
}

export const vipRestaurantsApi = createApi({
  reducerPath: "vipRestaurantsApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.VIP_RESTAURANTS],
  endpoints: (builder) => ({
    getVipRestaurants: builder.query<VipRestaurant[], void>({
      query: () => "/vip-restaurants",
    }),
    createVipRestaurant: builder.mutation<
      VipRestaurant,
      Omit<VipRestaurant, "id">
    >({
      query: (newRestaurant) => ({
        url: "/vip-restaurants",
        method: "POST",
        body: newRestaurant,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newVip } = await queryFulfilled;
          dispatch(
            vipRestaurantsApi.util.updateQueryData(
              "getVipRestaurants",
              undefined,
              (draft: VipRestaurant[]) => {
                draft.unshift(newVip);
              }
            )
          );
        } catch {}
      },
    }),
  }),
});

export const { useGetVipRestaurantsQuery, useCreateVipRestaurantMutation } =
  vipRestaurantsApi;
