export type FilterOption = {
  value: string;
  label: string;
};

export type FilterCategory = {
  key: string;
  label: string;
  options: FilterOption[];
  /**
   * "accordion" (default) expands the options inside the filter panel.
   * "toggle" renders a single checkbox row for one-option categories such as
   * Bookmarked, where a nested list would read as a redundant repeat.
   */
  variant?: "accordion" | "toggle";
  /**
   * Prefixes the chip label, for categories whose values do not stand alone
   * (e.g. Score, where "> 25" alone is ambiguous).
   */
  chipPrefix?: string;
};

export type SelectedFilters = Record<string, string[]>;
