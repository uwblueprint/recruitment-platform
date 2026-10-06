import { Button } from "@/components/common/Button";
import {
  FilterChips,
  FilterMenu,
  SearchBar,
  type FilterCategory,
  type SelectedFilters,
} from "@/components/dashboard/filters";
import PersonAddAltOutlined from "@mui/icons-material/PersonAddAltOutlined";

type MembersDashboardToolbarProps = {
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
  onAddMember?: () => void;
};

export const MembersDashboardToolbar = ({
  search,
  filters,
  onAddMember,
}: MembersDashboardToolbarProps) => (
  <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
    <div className="flex shrink-0 items-center gap-3">
      <SearchBar
        value={search.value}
        onChange={search.onChange}
        placeholder="Search members"
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
    <div className="ml-auto flex shrink-0 items-center gap-3">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={onAddMember}
        className="flex items-center gap-2 !px-5"
      >
        <PersonAddAltOutlined fontSize="small" />
        Add new member
      </Button>
    </div>
  </div>
);
