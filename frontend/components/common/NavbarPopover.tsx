import { ReactNode } from "react";
import Popover from "@mui/material/Popover";

interface NavbarPopoverProps {
  id: string;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  align?: "left" | "right";
  width?: number;
  children: ReactNode;
}

export const NavbarPopover = ({
  id,
  anchorEl,
  onClose,
  align = "left",
  width = 152,
  children,
}: NavbarPopoverProps) => (
  <Popover
    id={id}
    open={Boolean(anchorEl)}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: align }}
    transformOrigin={{ vertical: "top", horizontal: align }}
    PaperProps={{
      sx: {
        mt: 1.5,
        ml: align === "left" ? -0.5 : 0,
        width,
        borderRadius: "4px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.16)",
      },
    }}
  >
    {children}
  </Popover>
);
