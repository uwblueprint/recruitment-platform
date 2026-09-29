import { forwardRef } from "react";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import type { LinkProps } from "next/link";

type StyledMenuItemProps = MenuItemProps & {
  href?: LinkProps["href"];
};

export const StyledMenuItem = forwardRef<HTMLLIElement, StyledMenuItemProps>(
  function StyledMenuItem({ selected, className = "", ...props }, ref) {
    return (
      <MenuItem
        ref={ref}
        disableRipple
        {...props}
        selected={selected}
        className={`flex h-10 !min-h-[40px] w-full items-center gap-2 !bg-transparent !px-3 !py-0 text-left !font-source !text-base !font-normal !leading-6 hover:!text-blue-500 hover:!opacity-100 [&.Mui-focusVisible]:!text-blue-500 [&.Mui-focusVisible]:outline [&.Mui-focusVisible]:outline-2 [&.Mui-focusVisible]:outline-inset [&.Mui-focusVisible]:outline-blue-500 ${
          selected ? "!text-blue-500" : "!text-black"
        } ${className}`}
      />
    );
  }
);
