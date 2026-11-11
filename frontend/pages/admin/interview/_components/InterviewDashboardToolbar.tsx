import {
  FilterChips,
  FilterMenu,
  SearchBar,
  type FilterCategory,
  type SelectedFilters,
} from "@/components/dashboard/filters";
import { Button } from "@/components/common/Button";
import MailOutline from "@mui/icons-material/MailOutline";
import MarkEmailReadOutlined from "@mui/icons-material/MarkEmailReadOutlined";

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
  bulkActions: {
    selectedCount: number;
    disabled?: boolean;
    onReject: () => void;
    onOffer: () => void;
  };
};

export const InterviewDashboardToolbar = ({
  search,
  filters,
  bulkActions,
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
        onClick={bulkActions.onOffer}
        className="flex items-center gap-2 !px-5"
      >
        <MarkEmailReadOutlined fontSize="small" />
        Send Offer
      </Button>
    </div>
  </div>
);
