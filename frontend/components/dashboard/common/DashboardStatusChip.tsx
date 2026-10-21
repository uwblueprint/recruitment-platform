export type DashboardStatusChipOption<TStatus extends string> = {
  value: TStatus;
  label: string;
  className: string;
};

export type DashboardStatusChipProps<TStatus extends string> = {
  value: TStatus;
  options: readonly DashboardStatusChipOption<TStatus>[];
  onChange?: (status: TStatus) => void;
  readOnly?: boolean;
  /** Show a border using the selected option’s border color. */
  outlined?: boolean;
};

export const DashboardStatusChip = <TStatus extends string>({
  value,
  options,
  onChange,
  readOnly = false,
  outlined = readOnly,
}: DashboardStatusChipProps<TStatus>) => {
  const selectedOption = options.find((option) => option.value === value);
  const chipClassName = `h-7 min-w-[112px] rounded py-0 text-center font-source text-xs ${outlined ? "border" : "border-0"} ${selectedOption?.className ?? ""}`;

  if (readOnly) {
    return (
      <span
        className={`${chipClassName} inline-flex items-center justify-center`}
      >
        {selectedOption?.label ?? value}
      </span>
    );
  }

  return (
    <select
      className={`${chipClassName} pl-4 pr-8 focus:ring-2 focus:ring-blue`}
      value={value}
      onChange={(event) =>
        onChange?.(
          options.find((option) => option.value === event.target.value)
            ?.value ?? value,
        )
      }
      onClick={(event) => event.stopPropagation()}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
