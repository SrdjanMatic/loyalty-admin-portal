import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";
import { setSuccess } from "./toastSlice";

export const COUPON_LEVELS = {
  STANDARD: "STANDARD",
  VIP: "VIP",
  PREMIUM: "PREMIUM",
} as const;

export type CouponLevel = (typeof COUPON_LEVELS)[keyof typeof COUPON_LEVELS];

export interface Coupon {
  id: number;
  name: string;
  description: string;
  points: number;
  level: CouponLevel;
  restaurantId: number;
}

export const couponsApi = createApi({
  reducerPath: "couponsApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.COUPONS],
  endpoints: (builder) => ({
    getCoupons: builder.query<Coupon[], number>({
      query: (restaurantId) => ({
        url: `/coupons`,
        params: { restaurantId },
      }),
    }),
    updateCoupon: builder.mutation<
      Coupon,
      { id: number } & Partial<Omit<Coupon, "id">>
    >({
      query: ({ id, ...patch }) => ({
        url: `/coupons/${id}`,
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedCoupon } = await queryFulfilled;
          dispatch(
            couponsApi.util.updateQueryData(
              "getCoupons",
              updatedCoupon.restaurantId,
              (draft: Coupon[]) => {
                const idx = draft.findIndex((c) => c.id === id);
                if (idx !== -1) draft[idx] = updatedCoupon;
              }
            )
          );
          dispatch(setSuccess("Coupon updated successfully!"));
        } catch {}
      },
    }),
    deleteCoupon: builder.mutation<
      { success: boolean },
      { id: number; restaurantId: number }
    >({
      query: ({ id }) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted({ id, restaurantId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            couponsApi.util.updateQueryData(
              "getCoupons",
              restaurantId,
              (draft: Coupon[]) => {
                const idx = draft.findIndex((c) => c.id === id);
                if (idx !== -1) draft.splice(idx, 1);
              }
            )
          );
          dispatch(setSuccess("Coupon deleted successfully!")); // <-- fixed message
        } catch {}
      },
    }),
    createCoupon: builder.mutation<Coupon, Omit<Coupon, "id">>({
      query: (coupon) => ({
        url: "/coupons",
        method: "POST",
        body: coupon,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newCoupon }: any = await queryFulfilled;

          dispatch(
            couponsApi.util.updateQueryData(
              "getCoupons",
              newCoupon.restaurantId,
              (draft: Coupon[]) => {
                draft.unshift(newCoupon);
              }
            )
          );
          dispatch(setSuccess("Coupon created successfully!"));
        } catch {}
      },
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useCreateCouponMutation,
} = couponsApi;
