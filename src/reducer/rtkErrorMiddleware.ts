import { isRejectedWithValue } from "@reduxjs/toolkit";
import { setError } from "./toastSlice.ts";

export const rtkErrorMiddleware =
  ({ dispatch }: any) =>
  (next: any) =>
  (action: any) => {
    if (isRejectedWithValue(action)) {
      const errorMsg =
        "data" in action.payload
          ? action.payload.data?.error || "Unexpected error"
          : action.payload?.message || "Unexpected error";

      dispatch(setError(errorMsg));
    }
    return next(action);
  };
