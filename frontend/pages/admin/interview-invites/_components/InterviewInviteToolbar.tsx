import { Button } from "@/components/common/Button";
import {
  FilterChips,
  FilterMenu,
  SearchBar,
  type FilterCategory,
  type SelectedFilters,
} from "@/components/dashboard/filters";
import MailOutline from "@mui/icons-material/MailOutline";

type InterviewInviteToolbarProps = {
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
    allSelected: boolean;
    selectAllDisabled?: boolean;
    disabled?: boolean;
    onSelectAll: () => void;
    onSendInterviewEmails?: () => void;
  };
};

export const InterviewInviteToolbar = ({
  search,
  filters,
  bulkActions,
}: InterviewInviteToolbarProps) => (
  <div className="flex shrink-0 items-start justify-between gap-4">
    <div className="flex shrink-0 items-center gap-3">
      <SearchBar
        value={search.value}
        onChange={search.onChange}
        placeholder="Search interviewer"
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
    <div className="flex shrink-0 items-center gap-3">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={bulkActions.selectAllDisabled || bulkActions.disabled}
        onClick={bulkActions.onSelectAll}
        className="flex items-center gap-2 !px-5"
      >
        {bulkActions.allSelected ? "Deselect All" : "Select All"}
      </Button>
      <Button
        type="button"
        size="sm"
        disabled={
          bulkActions.selectedCount === 0 ||
          bulkActions.disabled ||
          !bulkActions.onSendInterviewEmails
        }
        onClick={bulkActions.onSendInterviewEmails}
        className="flex items-center gap-2 !px-5"
      >
        <MailOutline fontSize="small" />
        Send interview emails
      </Button>
    </div>
  </div>
);
