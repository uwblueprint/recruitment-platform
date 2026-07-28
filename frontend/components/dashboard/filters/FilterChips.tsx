import type { FilterCategory, SelectedFilters } from "./types";

type FilterChipsProps = {
  categories: FilterCategory[];
  selected: SelectedFilters;
  onRemove: (categoryKey: string, value: string) => void;
};

export const FilterChips = ({ categories, selected, onRemove }: FilterChipsProps) => {
  const chips = categories.flatMap((category) =>
    (selected[category.key] ?? []).map((value) => ({
      categoryKey: category.key,
      value,
      label: `${category.label}: ${
        category.options.find((option) => option.value === value)?.label ?? value
      }`,
    })),
  );

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={`${chip.categoryKey}-${chip.value}`}
          className="flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 font-source text-xs text-blue"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.categoryKey, chip.value)}
            className="font-semibold text-blue hover:text-blue-600"
            aria-label={`Remove filter ${chip.label}`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
};
