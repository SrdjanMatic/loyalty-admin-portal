import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../../reducer/toastSlice";
import { useEffect, useState } from "react";

function SlideTransition(props: any) {
  return <Slide {...props} direction="up" />;
}

export const ToastSnackbar = () => {
  const errorMessage = useSelector((state: any) => state?.toast?.message);
  const errorType = useSelector((state: any) => state?.toast?.type);
  const dispatch = useDispatch();

  // Cache last shown values
  const [cachedMessage, setCachedMessage] = useState<string | null>(null);
  const [cachedType, setCachedType] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) {
      setCachedMessage(errorMessage);
      setCachedType(errorType);
    }
  }, [errorMessage, errorType]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={!!errorMessage}
      onClose={() => dispatch(clearError())}
      message={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {cachedType === "success" ? (
            <CheckCircleIcon fontSize="small" />
          ) : (
            <ErrorIcon fontSize="small" />
          )}
          {cachedMessage}
        </span>
      }
      autoHideDuration={3000}
      slots={{
        transition: SlideTransition,
      }}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => dispatch(clearError())}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      slotProps={{
        content: {
          sx: {
            backgroundColor: cachedType === "success" ? "#43a047" : "#d32f2f",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
            fontFamily: "'Roboto Mono', 'Menlo', 'Monaco', monospace",
            boxShadow:
              cachedType === "success"
                ? "0 2px 8px rgba(67,160,71,0.2)"
                : "0 2px 8px rgba(211,47,47,0.2)",
            borderRadius: 3,
            letterSpacing: 1,
            elevation: 8,
          },
        },
      }}
    />
  );
};
