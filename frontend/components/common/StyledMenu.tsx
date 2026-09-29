import Menu, { MenuProps } from "@mui/material/Menu";

export const StyledMenu = ({
  MenuListProps,
  PaperProps,
  ...props
}: MenuProps) => (
  <Menu
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "left" }}
    {...props}
    MenuListProps={{
      ...MenuListProps,
      className: `!py-0 ${MenuListProps?.className ?? ""}`,
    }}
    PaperProps={{
      ...PaperProps,
      className: `!py-1 !shadow-[0px_4px_8px_rgba(0,0,0,0.16)] ${PaperProps?.className ?? ""}`,
    }}
  />
);
