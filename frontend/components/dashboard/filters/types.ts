export type FilterOption = {
  value: string;
  label: string;
};

export type FilterCategory = {
  key: string;
  label: string;
  options: FilterOption[];
};

export type SelectedFilters = Record<string, string[]>;
