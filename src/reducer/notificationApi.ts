import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
import { QUERY_TAGS } from "./tagConstants";

export interface Notification {
  id?: string;
  restaurantId: number;
  title: string;
  foodType: string;
  partOfDay: string;
  validFrom: string;
  validUntil: string;
}

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: customBaseQuery,
  tagTypes: [QUERY_TAGS.NOTIFICATIONS],
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], number>({
      query: (restaurantId) => `/notifications/restaurant/${restaurantId}`,
    }),
    createNotification: builder.mutation<
      Notification,
      Omit<Notification, "id">
    >({
      query: (notification) => ({
        url: "/notifications",
        method: "POST",
        body: notification,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newNotification }: any = await queryFulfilled;
          dispatch(
            notificationApi.util.updateQueryData(
              "getNotifications",
              newNotification.restaurant.id,
              (draft: Notification[]) => {
                draft.unshift(newNotification);
              }
            )
          );
        } catch {}
      },
    }),
  }),
});

export const { useGetNotificationsQuery, useCreateNotificationMutation } =
  notificationApi;
