import { configureStore } from "@reduxjs/toolkit";
import { employeesApi } from "../reducer/employeeApi.ts";
import toastSlice from "../reducer/toastSlice.ts";
import { dashboardApi } from "../reducer/dashboardApi.ts";
import { companyApi } from "../reducer/companyApi.ts";
import { vipRestaurantsApi } from "../reducer/vipRestaurantsApi.ts";
import { restaurantAdminApi } from "../reducer/restaurantAdminApi.ts";
import { couponsApi } from "../reducer/couponsApi.ts";
import { notificationApi } from "../reducer/notificationApi.ts";
import { restaurantsApi } from "../reducer/restaurantsApi.ts";
import { rtkErrorMiddleware } from "../reducer/rtkErrorMiddleware.ts";
import { configApi } from "../reducer/configApi.ts";

export const store = configureStore({
  reducer: {
    [couponsApi.reducerPath]: couponsApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [employeesApi.reducerPath]: employeesApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [vipRestaurantsApi.reducerPath]: vipRestaurantsApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [restaurantAdminApi.reducerPath]: restaurantAdminApi.reducer,
    [configApi.reducerPath]: configApi.reducer,
    toast: toastSlice,
    [restaurantsApi.reducerPath]: restaurantsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      employeesApi.middleware,
      dashboardApi.middleware,
      companyApi.middleware,
      vipRestaurantsApi.middleware,
      restaurantAdminApi.middleware,
      couponsApi.middleware,
      notificationApi.middleware,
      restaurantsApi.middleware,
      configApi.middleware,
      rtkErrorMiddleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
