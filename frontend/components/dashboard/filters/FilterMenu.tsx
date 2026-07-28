import { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Checkbox, FormControlLabel, FormGroup, Menu, MenuItem } from "@mui/material";

import type { FilterCategory, SelectedFilters } from "./types";

type FilterMenuProps = {
  categories: FilterCategory[];
  selected: SelectedFilters;
  onChange: (categoryKey: string, values: string[]) => void;
};

export const FilterMenu = ({ categories, selected, onChange }: FilterMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);

  const activeCategory = categories.find((category) => category.key === activeCategoryKey) ?? null;

  const closeAll = () => {
    setAnchorEl(null);
    setCategoryAnchorEl(null);
    setActiveCategoryKey(null);
  };

  const toggleOption = (categoryKey: string, value: string) => {
    const current = selected[categoryKey] ?? [];
    const next = current.includes(value)
      ? current.filter((selectedValue) => selectedValue !== value)
      : [...current, value];
    onChange(categoryKey, next);
  };

  const totalSelected = Object.values(selected).reduce(
    (sum, values) => sum + values.length,
    0,
  );

  return (
    <>
      <button
        type="button"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className="flex h-9 items-center gap-2 rounded border border-neutral-200 px-3 font-source text-sm text-neutral-800 hover:bg-neutral-50"
      >
        <FilterListIcon sx={{ fontSize: 18 }} />
        Filters
        {totalSelected > 0 ? (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue px-1 font-source text-xs text-white">
            {totalSelected}
          </span>
        ) : null}
      </button>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeAll}>
        {categories.map((category) => {
          const count = (selected[category.key] ?? []).length;
          return (
            <MenuItem
              key={category.key}
              onClick={(event) => {
                setCategoryAnchorEl(event.currentTarget);
                setActiveCategoryKey(category.key);
              }}
              className="flex min-w-[200px] items-center justify-between gap-6 font-source text-sm"
            >
              <span>{category.label}</span>
              <span className="flex items-center gap-1 text-neutral-500">
                {count > 0 ? `${count} selected` : ""}
                <ChevronRightIcon sx={{ fontSize: 16 }} />
              </span>
            </MenuItem>
          );
        })}
      </Menu>

      <Menu
        anchorEl={categoryAnchorEl}
        open={!!categoryAnchorEl}
        onClose={() => {
          setCategoryAnchorEl(null);
          setActiveCategoryKey(null);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {activeCategory ? (
          <FormGroup className="px-3 py-1">
            {activeCategory.options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    size="small"
                    checked={(selected[activeCategory.key] ?? []).includes(option.value)}
                    onChange={() => toggleOption(activeCategory.key, option.value)}
                  />
                }
                label={<span className="font-source text-sm">{option.label}</span>}
              />
            ))}
          </FormGroup>
        ) : null}
      </Menu>
    </>
  );
};
