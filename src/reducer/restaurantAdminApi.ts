import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";

export interface RestaurantAdmin {
  keycloakId?: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  restaurantName: string;
}

export const restaurantAdminApi = createApi({
  reducerPath: "restaurantAdminApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.RESTAURANT_ADMINS],
  endpoints: (builder) => ({
    getRestaurantAdmins: builder.query<RestaurantAdmin[], void>({
      query: () => "/restaurants/restaurant-admins",
    }),
    createRestaurantAdmin: builder.mutation<
      RestaurantAdmin,
      Omit<RestaurantAdmin, "restaurantName">
    >({
      query: (admin) => ({
        url: "/restaurants/restaurant-admin",
        method: "POST",
        body: admin,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newAdmin } = await queryFulfilled;
          dispatch(
            restaurantAdminApi.util.updateQueryData(
              "getRestaurantAdmins",
              undefined,
              (draft: RestaurantAdmin[]) => {
                draft.unshift(newAdmin);
              }
            )
          );
        } catch {}
      },
    }),
  }),
});

export const { useGetRestaurantAdminsQuery, useCreateRestaurantAdminMutation } =
  restaurantAdminApi;
