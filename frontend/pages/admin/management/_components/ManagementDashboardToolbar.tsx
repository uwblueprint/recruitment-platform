import type { ReactNode } from "react";
import {
  FilterChips,
  FilterMenu,
  SearchBar,
  type FilterCategory,
  type SelectedFilters,
} from "@/components/dashboard/filters";

type ManagementDashboardToolbarProps = {
  search: {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  };
  filters: {
    categories: FilterCategory[];
    selected: SelectedFilters;
    onChange: (categoryKey: string, values: string[]) => void;
    onRemove: (categoryKey: string, value: string) => void;
  };
  action?: ReactNode;
};

export const ManagementDashboardToolbar = ({
  search,
  filters,
  action,
}: ManagementDashboardToolbarProps) => (
  <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
    <div className="flex shrink-0 items-center gap-3">
      <SearchBar
        value={search.value}
        onChange={search.onChange}
        placeholder={search.placeholder}
      />
      <FilterMenu
        categories={filters.categories}
        selected={filters.selected}
        onChange={filters.onChange}
      />
    </div>
    <div className="flex min-w-0 flex-1 flex-wrap items-start gap-3">
      <FilterChips
        categories={filters.categories}
        selected={filters.selected}
        onRemove={filters.onRemove}
      />
    </div>
    {action && (
      <div className="ml-auto flex shrink-0 items-center gap-3">{action}</div>
    )}
  </div>
);
