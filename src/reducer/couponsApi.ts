import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";

export interface Coupon {
  id?: number;
  name: string;
  description: string;
  points: number;
  level: string; // "STANDARD" | "PREMIUM" | "VIP"
  restaurantId: number;
}

export const couponsApi = createApi({
  reducerPath: "couponsApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.COUPONS],
  endpoints: (builder) => ({
    getCoupons: builder.query<Coupon[], number>({
      query: (restaurantId) => `/coupons/${restaurantId}`,
    }),
    createCoupon: builder.mutation<Coupon, Omit<Coupon, "id">>({
      query: (coupon) => ({
        url: "/coupons",
        method: "POST",
        body: coupon,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newCoupon }: any = await queryFulfilled;

          dispatch(
            couponsApi.util.updateQueryData(
              "getCoupons",
              newCoupon.restaurant.id,
              (draft: Coupon[]) => {
                draft.unshift(newCoupon);
              }
            )
          );
        } catch {}
      },
    }),
  }),
});

export const { useGetCouponsQuery, useCreateCouponMutation } = couponsApi;
