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
  disabled?: boolean;
  /** Show a border using the selected option’s border color. */
  outlined?: boolean;
  /** Size the chip to its selected label instead of the widest option. */
  fitSelectedContent?: boolean;
};

export const DashboardStatusChip = <TStatus extends string>({
  value,
  options,
  onChange,
  readOnly = false,
  disabled = false,
  outlined = readOnly,
  fitSelectedContent = false,
}: DashboardStatusChipProps<TStatus>) => {
  const selectedOption = options.find((option) => option.value === value);
  const chipClassName = `h-7 ${fitSelectedContent ? "" : "min-w-[112px]"} rounded py-0 text-center font-source text-xs ${outlined ? "border" : "border-0"} ${selectedOption?.className ?? ""}`;

  if (readOnly) {
    return (
      <span
        className={`${chipClassName} inline-flex items-center justify-center ${fitSelectedContent ? "px-4" : ""}`}
      >
        {selectedOption?.label ?? value}
      </span>
    );
  }

  const select = (
    <select
      className={`${chipClassName} pl-4 pr-8 focus:ring-2 focus:ring-blue ${fitSelectedContent ? "absolute inset-0 w-full min-w-0" : ""}`}
      value={value}
      disabled={disabled}
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

  if (fitSelectedContent) {
    return (
      <span className="relative inline-grid w-fit align-middle">
        <span
          aria-hidden="true"
          className={`${chipClassName} invisible whitespace-pre pl-4 pr-8`}
        >
          {selectedOption?.label ?? value}
        </span>
        {select}
      </span>
    );
  }

  return select;
};
