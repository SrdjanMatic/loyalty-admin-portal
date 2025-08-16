import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ToastState {
  type: "error" | "success" | null;
  message: string | null;
}

const initialState: ToastState = { type: null, message: null };

const toastSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | null>) {
      state.message = action.payload;
      state.type = "error";
    },
    clearError(state) {
      state.message = null;
      state.type = null;
    },
    setSuccess(state, action: PayloadAction<string | null>) {
      state.message = action.payload;
      state.type = "success";
    },
  },
});

export const { setError, clearError, setSuccess } = toastSlice.actions;
export default toastSlice.reducer;
