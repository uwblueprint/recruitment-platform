import ErrorOutline from "@mui/icons-material/ErrorOutline";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import Close from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";

type ToastProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  autoHideDuration?: number;
  severity?: "success" | "error";
};

export const Toast = ({
  open,
  title,
  description,
  onClose,
  autoHideDuration = 6000,
  severity = "success",
}: ToastProps) => (
  <Snackbar
    open={open}
    autoHideDuration={autoHideDuration}
    onClose={(_, reason) => reason !== "clickaway" && onClose()}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  >
    <div
      role={severity === "error" ? "alert" : "status"}
      className={`flex min-w-[380px] items-start gap-3 rounded-lg border px-4 py-3 text-neutral-800 shadow-md ${
        severity === "error"
          ? "border-red-500 bg-red-50"
          : "border-green-500 bg-green-50"
      }`}
    >
      {severity === "error" ? (
        <ErrorOutline className="mt-0.5 text-red-500" />
      ) : (
        <CheckCircleOutline className="mt-0.5 text-green-500" />
      )}
      <div className="min-w-0 flex-1">
        <p className="font-poppins text-base font-medium">{title}</p>
        <p className="font-source text-sm">{description}</p>
      </div>
      <button type="button" aria-label="Close notification" onClick={onClose}>
        <Close className="text-neutral-500" fontSize="small" />
      </button>
    </div>
  </Snackbar>
);
