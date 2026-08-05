import { DialogActions } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { ReactNode } from "react";

type DialogueProps = {
  open: boolean;
  onClose: () => void;
  header: string;
  text: string;
  errorText?: string;
  children?: ReactNode;
  content?: ReactNode;
  width?: string;
  className?: string;
};

export const Dialogue = ({
  open,
  header,
  text,
  errorText,
  children,
  content,
  width = "310px",
  className = "",
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
          width: width,
        },
      }}
    >
      <div
        className={`flex w-full flex-col items-center justify-center bg-white p-6 ${className}`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <h2 className="text-center font-poppins text-[20px] font-medium leading-[1.4] text-blue">
            {header}
          </h2>
          <div className="text-center font-source text-[14px] font-normal leading-[140%]">
            <div className="text-neutral-800"> {text} </div>
            {errorText && <div className="text-red-500">{errorText}</div>}
          </div>
        </div>

        {content ? <div className="mt-2 w-full">{content}</div> : null}

        {children ? (
          <DialogActions className="mt-9 h-[36px] w-full !p-0">
            {children}
          </DialogActions>
        ) : null}
      </div>
    </Dialog>
  );
};
