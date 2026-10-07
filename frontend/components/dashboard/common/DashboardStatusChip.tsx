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
};

export const DashboardStatusChip = <TStatus extends string>({
  value,
  options,
  onChange,
  readOnly = false,
}: DashboardStatusChipProps<TStatus>) => {
  const selectedOption = options.find((option) => option.value === value);
  const selectedClassName = selectedOption?.className ?? "";

  if (readOnly) {
    return (
      <span
        className={`inline-flex h-7 min-w-[112px] items-center justify-center rounded border font-source text-xs ${selectedClassName}`}
      >
        {selectedOption?.label ?? value}
      </span>
    );
  }

  return (
    <select
      className={`h-7 min-w-[112px] rounded border-0 py-0 pl-4 pr-8 text-center text-xs focus:ring-2 focus:ring-blue ${selectedClassName}`}
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
