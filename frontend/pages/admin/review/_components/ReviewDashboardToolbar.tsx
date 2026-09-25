import { Button } from "@/components/common/Button";
import {
  FilterChips,
  FilterMenu,
  SearchBar,
  type FilterCategory,
  type SelectedFilters,
} from "@/components/dashboard/filters";
import MailOutline from "@mui/icons-material/MailOutline";
import PersonAddAltOutlined from "@mui/icons-material/PersonAddAltOutlined";

type ReviewDashboardToolbarProps = {
  position: string | null;
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
  bulkActions: {
    selectedCount: number;
    disabled?: boolean;
    onReject: () => void;
    onSelectForInterview: () => void;
  };
};

export const ReviewDashboardToolbar = ({
  position,
  search,
  filters,
  bulkActions,
}: ReviewDashboardToolbarProps) => (
  <div className="flex shrink-0 items-start justify-between gap-4">
    {position ? (
      <h1 className="font-poppins text-[28px] font-semibold leading-[140%] text-blue">
        {position} Applications
      </h1>
    ) : null}
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
    <div className="flex shrink-0 items-center gap-3">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={bulkActions.selectedCount === 0 || bulkActions.disabled}
        onClick={bulkActions.onReject}
        className="flex items-center gap-2 !px-5"
      >
        <MailOutline fontSize="small" />
        Send Rejection
      </Button>
      <Button
        type="button"
        size="sm"
        disabled={bulkActions.selectedCount === 0 || bulkActions.disabled}
        onClick={bulkActions.onSelectForInterview}
        className="flex items-center gap-2 !px-5"
      >
        <PersonAddAltOutlined fontSize="small" />
        Select for interview
      </Button>
    </div>
  </div>
);
