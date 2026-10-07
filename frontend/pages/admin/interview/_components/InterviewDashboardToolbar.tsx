import {
  FilterChips,
  FilterMenu,
  SearchBar,
  type FilterCategory,
  type SelectedFilters,
} from "@/components/dashboard/filters";

type InterviewDashboardToolbarProps = {
  search: {
    value: string;
    onChange: (value: string) => void;
  };
  filters: {
    categories: FilterCategory[];
    selected: SelectedFilters;
    onChange: (categoryKey: string, values: string[]) => void;
    onRemove: (categoryKey: string, value: string) => void;
  };
};

export const InterviewDashboardToolbar = ({
  search,
  filters,
}: InterviewDashboardToolbarProps) => (
  <div className="flex shrink-0 items-start gap-4">
    <div className="flex shrink-0 items-center gap-3">
      <SearchBar value={search.value} onChange={search.onChange} />
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
  </div>
);
