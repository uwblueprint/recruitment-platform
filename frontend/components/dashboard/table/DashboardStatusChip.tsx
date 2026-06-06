type DashboardStatusChipOption<TStatus extends string> = {
  value: TStatus;
  label: string;
};

export type DashboardStatusChipProps<TStatus extends string> = {
  value: TStatus;
  options: readonly DashboardStatusChipOption<TStatus>[];
  tone?: "green" | "purple" | "blue" | "grey";
  onChange?: (status: TStatus) => void;
};

const toneClasses: Record<NonNullable<DashboardStatusChipProps<string>["tone"]>, string> = {
  green: "bg-green-100 text-green-700",
  purple: "bg-magenta-100 text-neutral-800",
  blue: "bg-sky text-blue",
  grey: "bg-neutral-100 text-neutral-700",
};

export const DashboardStatusChip = <TStatus extends string>({
  value,
  options,
  tone = "green",
  onChange,
}: DashboardStatusChipProps<TStatus>) => (
  <select
    className={`h-7 min-w-[112px] rounded border-0 py-0 pl-4 pr-8 text-xs focus:ring-2 focus:ring-blue ${toneClasses[tone]}`}
    value={value}
    onChange={(event) =>
      onChange?.(
        options.find((option) => option.value === event.target.value)?.value ??
          value,
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
