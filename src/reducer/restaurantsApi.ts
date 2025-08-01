import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";

export interface Restaurant {
  id?: number;
  name: string;
  address: string;
  phone: string;
  pib: string;
  restaurantAdmin?: string;
}

export interface RestaurantCouponLevelView {
  premiumCouponLimit: number;
  vipCouponLimit: number;
}

export const restaurantsApi = createApi({
  reducerPath: "restaurantsApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.RESTAURANTS],
  endpoints: (builder) => ({
    getRestaurants: builder.query<Restaurant[], void>({
      query: () => "/restaurants",
    }),
    createRestaurant: builder.mutation<Restaurant, Omit<Restaurant, "id">>({
      query: (restaurant) => ({
        url: "/restaurants",
        method: "POST",
        body: restaurant,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newRestaurant } = await queryFulfilled;
          dispatch(
            restaurantsApi.util.updateQueryData(
              "getRestaurants",
              undefined,
              (draft: Restaurant[]) => {
                draft.unshift(newRestaurant);
              }
            )
          );
        } catch {}
      },
      // Optionally, you can use invalidatesTags if you want to always refetch:
      // invalidatesTags: [{ type: QUERY_TAGS.RESTAURANTS, id: "LIST" }],
    }),
    // Coupon level endpoints can be migrated similarly if needed:
    getCouponLevel: builder.query<RestaurantCouponLevelView, number>({
      query: (restaurantId) => `/restaurants/coupon-limit/${restaurantId}`,
    }),
    updateCouponLimit: builder.mutation<
      RestaurantCouponLevelView,
      { restaurantId: number; data: RestaurantCouponLevelView }
    >({
      query: ({ restaurantId, data }) => ({
        url: `/restaurants/coupon-limit/${restaurantId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: QUERY_TAGS.RESTAURANTS, id: "LIST" }],
    }),
  }),
});

export const {
  useGetRestaurantsQuery,
  useCreateRestaurantMutation,
  useGetCouponLevelQuery,
  useUpdateCouponLimitMutation,
} = restaurantsApi;
