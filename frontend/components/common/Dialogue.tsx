import Dialog from "@mui/material/Dialog";
import { DialogActions } from "@mui/material";
import { ReactNode } from "react";

type DialogueProps = {
  open: boolean;
  onClose: () => void;
  header: string;
  text: string;
  errorText?: string;
  children?: ReactNode;
};

export const Dialogue = ({
  open,
  header,
  text,
  errorText,
  children,
}: DialogueProps) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "none",
          opacity: 1,
        },
      }}
    >
      <div className="flex w-full flex-col items-center justify-center bg-white p-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <h2 className="text-center font-poppins text-[20px] font-medium leading-[1.4] text-blue">
            {header}
          </h2>
          <div className="text-center font-source text-[14px] font-normal leading-[140%]">
            <div className="text-semantic-text-primary">{text}</div>
            {errorText ? (
              <div className="text-semantic-text-danger">{errorText}</div>
            ) : null}
          </div>
        </div>
        <DialogActions className="mt-9 !h-[36px] w-full !p-0">
          {children}
        </DialogActions>
      </div>
    </Dialog>
  );
};
