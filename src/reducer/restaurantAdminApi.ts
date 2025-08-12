import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";
import { setSuccess } from "./toastSlice";

export interface RestaurantAdmin {
  keycloakId: string;
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
    updateRestaurantAdmin: builder.mutation<
      RestaurantAdmin,
      { id: string } & Partial<Omit<RestaurantAdmin, "restaurantName">>
    >({
      query: ({ id, ...patch }) => ({
        url: `/restaurants/restaurant-admin/${id}`,
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedAdmin } = await queryFulfilled;
          dispatch(
            restaurantAdminApi.util.updateQueryData(
              "getRestaurantAdmins",
              undefined,
              (draft: RestaurantAdmin[]) => {
                const idx = draft.findIndex((a) => a.keycloakId === id);
                if (idx !== -1) draft[idx] = updatedAdmin;
              }
            )
          );
          dispatch(setSuccess("Restaurant admin updated successfully!"));
        } catch {}
      },
    }),
    deleteRestaurantAdmin: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/restaurants/restaurant-admin/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            restaurantAdminApi.util.updateQueryData(
              "getRestaurantAdmins",
              undefined,
              (draft: RestaurantAdmin[]) => {
                const idx = draft.findIndex((a) => a.keycloakId === id);
                if (idx !== -1) draft.splice(idx, 1);
              }
            )
          );
          dispatch(setSuccess("Restaurant admin deleted successfully!"));
        } catch {}
      },
    }),
    createRestaurantAdmin: builder.mutation<
      RestaurantAdmin,
      Omit<RestaurantAdmin, "restaurantName" | "keycloakId">
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
          dispatch(setSuccess("Restaurant admin created successfully!"));
        } catch {}
      },
    }),
  }),
});

export const {
  useGetRestaurantAdminsQuery,
  useUpdateRestaurantAdminMutation,
  useDeleteRestaurantAdminMutation,
  useCreateRestaurantAdminMutation,
} = restaurantAdminApi;
