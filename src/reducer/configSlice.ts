// reducer/restaurantConfigSlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../keycloak/interceptors.ts";

export interface Challenge {
  id?: number;
  period: number;
  visitsRequired: number;
}

export interface RestaurantConfig {
  restaurantId?: number;
  fontColor: string;
  backgroundColor: string;
  headerAndButtonColor: string;
  restaurantName: string;
  restaurantDisplayName: string;
  description: string;
  logo: string | null;
  backgroundImage: string | null;
  challengeList: Challenge[];
  premiumCouponLimit?: number;
  vipCouponLimit?: number;
}

interface RestaurantConfigState {
  items: RestaurantConfig | undefined;
  configData: RestaurantConfig | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RestaurantConfigState = {
  items: undefined,
  configData: null,
  status: "idle",
  error: null,
};

export const saveConfig = createAsyncThunk<RestaurantConfig, RestaurantConfig>(
  "restaurantConfig/saveConfig",
  async (dto) => {
    const response = await api.post<RestaurantConfig>(
      "/restaurant-configs",
      dto
    );
    return response.data;
  }
);

export const getRestaurantConfigData = createAsyncThunk<
  RestaurantConfig,
  number | undefined
>(
  "restaurants/getRestaurantConfigData",
  async (restaurantId: number | undefined) => {
    const response = api.get<RestaurantConfig>(
      `/restaurants/config-data/${restaurantId}`
    );
    return response.then((res) => res.data);
  }
);

const restaurantConfigSlice = createSlice({
  name: "restaurantConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveConfig.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveConfig.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(saveConfig.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(getRestaurantConfigData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getRestaurantConfigData.fulfilled,
        (state, action: PayloadAction<RestaurantConfig>) => {
          state.status = "succeeded";
          state.configData = action.payload;
        }
      )
      .addCase(getRestaurantConfigData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export default restaurantConfigSlice.reducer;
