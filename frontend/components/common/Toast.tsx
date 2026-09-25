import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import Close from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";

type ToastProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  autoHideDuration?: number;
};

export const Toast = ({
  open,
  title,
  description,
  onClose,
  autoHideDuration = 6000,
}: ToastProps) => (
  <Snackbar
    open={open}
    autoHideDuration={autoHideDuration}
    onClose={(_, reason) => reason !== "clickaway" && onClose()}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  >
    <div
      role="status"
      className="flex min-w-[380px] items-start gap-3 rounded-lg border border-green-500 bg-green-50 px-4 py-3 text-neutral-800 shadow-md"
    >
      <CheckCircleOutline className="mt-0.5 text-green-500" />
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
