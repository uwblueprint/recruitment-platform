import { InputHTMLAttributes, useEffect, useRef } from "react";

type DashboardTableCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  indeterminate?: boolean;
};

export const DashboardTableCheckbox = ({
  indeterminate = false,
  ...props
}: DashboardTableCheckboxProps) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className="h-3.5 w-3.5 rounded border-neutral-200 text-blue focus:ring-blue"
      onClick={(event) => event.stopPropagation()}
      {...props}
    />
  );
};
