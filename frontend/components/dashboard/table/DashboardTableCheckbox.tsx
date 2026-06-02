import { InputHTMLAttributes } from "react";

type DashboardTableCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  indeterminate?: boolean;
};

export const DashboardTableCheckbox = ({
  indeterminate = false,
  ...props
}: DashboardTableCheckboxProps) => (
  <input
    ref={(element) => {
      if (element) {
        element.indeterminate = indeterminate;
      }
    }}
    type="checkbox"
    className="h-3.5 w-3.5 rounded border-neutral-200 text-blue focus:ring-blue"
    onClick={(event) => event.stopPropagation()}
    {...props}
  />
);
