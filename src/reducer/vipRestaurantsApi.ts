import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";
import { setSuccess } from "./toastSlice";

interface RestaurantView {
  id: number;
  name: string;
}

export interface VipRestaurant {
  id: number;
  restaurant: RestaurantView;
  generalDiscount?: number;
  levelDiscounts?: {
    STANDARD?: number;
    VIP?: number;
    PREMIUM?: number;
  };
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

    updateVipRestaurant: builder.mutation<
      VipRestaurant,
      { id: number } & Partial<Omit<VipRestaurant, "id">>
    >({
      query: ({ id, ...patch }) => ({
        url: `/vip-restaurants/${id}`,
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedVip } = await queryFulfilled;
          dispatch(
            vipRestaurantsApi.util.updateQueryData(
              "getVipRestaurants",
              undefined,
              (draft: VipRestaurant[]) => {
                const idx = draft.findIndex((v) => v.id === id);
                if (idx !== -1) draft[idx] = updatedVip;
              }
            )
          );
          dispatch(setSuccess("VIP Restaurant updated successfully!"));
        } catch {}
      },
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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
          dispatch(setSuccess("VIP Restaurant created successfully!"));
        } catch {}
      },
    }),
    deleteVipRestaurant: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/vip-restaurants/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            vipRestaurantsApi.util.updateQueryData(
              "getVipRestaurants",
              undefined,
              (draft: VipRestaurant[]) => {
                const idx = draft.findIndex((v) => v.id === id);
                if (idx !== -1) draft.splice(idx, 1);
              }
            )
          );
          dispatch(setSuccess("VIP Restaurant deleted successfully!"));
        } catch {}
      },
    }),
  }),
});

export const {
  useGetVipRestaurantsQuery,
  useUpdateVipRestaurantMutation,
  useCreateVipRestaurantMutation,
  useDeleteVipRestaurantMutation,
} = vipRestaurantsApi;
