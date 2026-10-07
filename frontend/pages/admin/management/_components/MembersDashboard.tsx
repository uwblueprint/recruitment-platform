import { useMemo, useState } from "react";
import { DashboardTable } from "@/components/dashboard/table";
import { DashboardSidePanel } from "@/components/dashboard/side-panel";
import type { RowSelectionState } from "@tanstack/react-table";
import type { SelectedFilters } from "@/components/dashboard/filters";
import type { MembersDashboardFilters } from "@/types/membersDashboard";
import { MEMBERS_DASHBOARD_COLUMNS } from "./columns";
import useMembersDashboardFilterOptions from "@/APIClients/queries/useMembersDashboardFilterOptions";
import useDebouncedValue from "../../review/_components/hooks/useDebouncedValue";
import { MembersDashboardToolbar } from "./MembersDashboardToolbar";
import useMembersDashboard from "./hooks/useMembersDashboard";

const DEFAULT_RESULTS_PER_PAGE = 25;
const SEARCH_DEBOUNCE_MS = 500;

export const MembersDashboard = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(
    DEFAULT_RESULTS_PER_PAGE
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const { data: filterOptions, error: filterOptionsError } =
    useMembersDashboardFilterOptions();
  const filterCategories = useMemo(
    () =>
      filterOptions
        ? [
            { key: "role", label: "Role", options: filterOptions.roles },
            { key: "team", label: "Team", options: filterOptions.teams },
            { key: "status", label: "Status", options: filterOptions.statuses },
          ]
        : [],
    [filterOptions]
  );
  const backendFilters = useMemo(
    (): MembersDashboardFilters => ({
      search: debouncedSearch.trim() ? debouncedSearch : undefined,
      roles: selectedFilters.role?.length ? selectedFilters.role : undefined,
      teams: selectedFilters.team?.length ? selectedFilters.team : undefined,
      statuses: selectedFilters.status?.length
        ? selectedFilters.status
        : undefined,
    }),
    [debouncedSearch, selectedFilters]
  );
  const { rows, isLoading, error, refetch } = useMembersDashboard(
    pageNumber,
    resultsPerPage,
    backendFilters
  );

  const handleResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
    setPageNumber(1);
    setRowSelection({});
  };
  const handlePageChange = (value: number) => {
    setPageNumber(value);
    setRowSelection({});
  };
  const handleFilterCategoryChange = (
    categoryKey: string,
    values: string[]
  ) => {
    setSelectedFilters((previous) => ({ ...previous, [categoryKey]: values }));
    setPageNumber(1);
    setRowSelection({});
  };
  const handleRemoveFilter = (categoryKey: string, value: string) => {
    setSelectedFilters((previous) => ({
      ...previous,
      [categoryKey]: (previous[categoryKey] ?? []).filter(
        (item) => item !== value
      ),
    }));
    setPageNumber(1);
    setRowSelection({});
  };
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPageNumber(1);
    setRowSelection({});
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <MembersDashboardToolbar
        search={{ value: search, onChange: handleSearchChange }}
        filters={{
          categories: filterCategories,
          selected: selectedFilters,
          onChange: handleFilterCategoryChange,
          onRemove: handleRemoveFilter,
        }}
      />
      {filterOptionsError ? (
        <p role="alert" className="text-sm text-alert-errorText">
          Failed to load member filters.
        </p>
      ) : null}
      {error ? (
        <div
          role="alert"
          className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText"
        >
          Failed to load members.
          <button type="button" onClick={refetch} className="ml-3 underline">
            Retry
          </button>
        </div>
      ) : null}
      <div className="min-h-0 flex-1">
        <DashboardTable
          data={rows}
          columns={MEMBERS_DASHBOARD_COLUMNS}
          columnWidths={{
            status: 160,
            actions: 112,
          }}
          getRowId={(row) => row.id}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onRowClick={() => setIsSidePanelOpen(true)}
          isLoading={isLoading}
          emptyMessage="No members found."
          pagination={{
            pageNumber,
            resultsPerPage,
            canGoNext: !isLoading && !error && rows.length === resultsPerPage,
            onPageChange: handlePageChange,
            onResultsPerPageChange: handleResultsPerPageChange,
          }}
        />
      </div>
      <DashboardSidePanel
        open={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
      />
    </div>
  );
};
