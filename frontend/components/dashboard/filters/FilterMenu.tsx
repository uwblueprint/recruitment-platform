import { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Checkbox, Popover } from "@mui/material";

import type { FilterCategory, SelectedFilters } from "./types";

type FilterMenuProps = {
  categories: FilterCategory[];
  selected: SelectedFilters;
  onChange: (categoryKey: string, values: string[]) => void;
};

export const FilterMenu = ({
  categories,
  selected,
  onChange,
}: FilterMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  // Categories are independently collapsible, so more than one can be open.
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const hasSelection = Object.values(selected).some(
    (values) => values.length > 0,
  );

  const toggleExpanded = (categoryKey: string) => {
    setExpandedKeys((previous) =>
      previous.includes(categoryKey)
        ? previous.filter((key) => key !== categoryKey)
        : [...previous, categoryKey],
    );
  };

  const toggleOption = (categoryKey: string, value: string) => {
    const current = selected[categoryKey] ?? [];
    onChange(
      categoryKey,
      current.includes(value)
        ? current.filter((selectedValue) => selectedValue !== value)
        : [...current, value],
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-haspopup="true"
        aria-expanded={!!anchorEl}
        className={`flex h-9 items-center gap-2 rounded px-3 font-source text-sm ${
          hasSelection
            ? "bg-blue text-white hover:bg-blue-600"
            : "border border-neutral-200 text-neutral-800 hover:bg-neutral-50"
        }`}
      >
        Filters
        <FilterListIcon sx={{ fontSize: 18 }} />
      </button>

      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { className: "mt-1 w-56 rounded" } }}
      >
        <div className="py-2">
          <p className="px-4 pb-2 font-source text-sm font-semibold text-neutral-800">
            Filters
          </p>

          {categories.map((category) => {
            const selectedValues = selected[category.key] ?? [];

            if (category.variant === "toggle") {
              const [option] = category.options;
              if (!option) return null;
              return (
                <label
                  key={category.key}
                  className="flex cursor-pointer items-center justify-between border-t border-neutral-100 px-4 py-1 font-source text-sm text-neutral-800"
                >
                  {category.label}
                  <Checkbox
                    size="small"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => toggleOption(category.key, option.value)}
                  />
                </label>
              );
            }

            const isExpanded = expandedKeys.includes(category.key);

            return (
              <div
                key={category.key}
                className="border-t border-neutral-100 first:border-t-0"
              >
                <button
                  type="button"
                  onClick={() => toggleExpanded(category.key)}
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between px-4 py-2 font-source text-sm text-neutral-800 hover:bg-neutral-50"
                >
                  {category.label}
                  {isExpanded ? (
                    <ExpandLessIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 18 }} />
                  )}
                </button>

                {isExpanded ? (
                  <div className="pb-1">
                    {category.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-2 px-4 py-1 pl-6 font-source text-sm text-neutral-800 hover:bg-neutral-50"
                      >
                        <Checkbox
                          size="small"
                          sx={{ padding: 0 }}
                          checked={selectedValues.includes(option.value)}
                          onChange={() =>
                            toggleOption(category.key, option.value)
                          }
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Popover>
    </>
  );
};
