import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";
import { setSuccess } from "./toastSlice";

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  pib: string;
  adminKeycloakId?: string;
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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
          dispatch(setSuccess("Restaurant created successfully!"));
        } catch {}
      },
    }),
    updateRestaurant: builder.mutation<
      Restaurant,
      { id: number } & Partial<Omit<Restaurant, "id" | "pib">>
    >({
      query: ({ id, ...patch }) => ({
        url: `/restaurants/${id}`,
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedRestaurant } = await queryFulfilled;
          dispatch(
            restaurantsApi.util.updateQueryData(
              "getRestaurants",
              undefined,
              (draft: Restaurant[]) => {
                const idx = draft.findIndex((r) => r.id === id);
                if (idx !== -1) draft[idx] = updatedRestaurant;
              }
            )
          );
          dispatch(setSuccess("Restaurant updated successfully!"));
        } catch {}
      },
    }),
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
  useUpdateRestaurantMutation,
  useGetCouponLevelQuery,
  useUpdateCouponLimitMutation,
} = restaurantsApi;
