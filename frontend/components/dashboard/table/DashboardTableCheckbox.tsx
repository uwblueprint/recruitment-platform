import MuiCheckbox from "@mui/material/Checkbox";
import type { CheckboxProps } from "@mui/material/Checkbox";

type DashboardTableCheckboxProps = Pick<
  CheckboxProps,
  "checked" | "disabled" | "indeterminate" | "onChange" | "aria-label"
>;

export const DashboardTableCheckbox = (props: DashboardTableCheckboxProps) => (
  <MuiCheckbox
    size="small"
    onClick={(event) => event.stopPropagation()}
    sx={{ padding: 0 }}
    {...props}
  />
);
