import CloseIcon from "@mui/icons-material/Close";

import type { FilterCategory, SelectedFilters } from "./types";

type FilterChipsProps = {
  categories: FilterCategory[];
  selected: SelectedFilters;
  onRemove: (categoryKey: string, value: string) => void;
};

export const FilterChips = ({
  categories,
  selected,
  onRemove,
}: FilterChipsProps) => {
  const chips = categories.flatMap((category) =>
    (selected[category.key] ?? []).map((value) => {
      const optionLabel =
        category.options.find((option) => option.value === value)?.label ??
        value;
      return {
        categoryKey: category.key,
        value,
        label: category.chipPrefix
          ? `${category.chipPrefix}: ${optionLabel}`
          : optionLabel,
      };
    }),
  );

  if (chips.length === 0) return null;

  return (
    <>
      {chips.map((chip) => (
        <span
          key={`${chip.categoryKey}-${chip.value}`}
          className="flex items-center gap-1.5 rounded-full bg-chip px-3 py-1.5 font-source text-sm text-white"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.categoryKey, chip.value)}
            className="flex items-center text-white hover:opacity-75"
            aria-label={`Remove filter ${chip.label}`}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        </span>
      ))}
    </>
  );
};
