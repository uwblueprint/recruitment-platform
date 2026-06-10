import MuiCheckbox from "@mui/material/Checkbox";
import type { CheckboxProps } from "@mui/material/Checkbox";

type DashboardTableCheckboxProps = Pick<
  CheckboxProps,
  "checked" | "disabled" | "indeterminate" | "onChange" | "aria-label"
>;

export const DashboardTableCheckbox = (props: DashboardTableCheckboxProps) => (
  <MuiCheckbox
    onClick={(event) => event.stopPropagation()}
    sx={{
      padding: 0,
      "& .MuiSvgIcon-root": { fontSize: 16 },
      color: "#C4C4C4",
      "&.Mui-checked": { color: "#0573E8" },
      "&.MuiCheckbox-indeterminate": { color: "#0573E8" },
    }}
    {...props}
  />
);
