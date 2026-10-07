import { InterviewDashboardSidePanel } from "./_components/side-panel/InterviewDashboardSidePanel";
import { InterviewDashboardToolbar } from "./_components/InterviewDashboardToolbar";
import { DashboardTable } from "@/components/dashboard/table";
import { DASHBOARD_ENUM, DashboardSwitcher } from "@/components/dashboard/common/DashboardSwitcher";
import {
  COLUMN_ID_TO_SORT_BY,
  INTERVIEW_DASHBOARD_COLUMNS,
} from "@/components/dashboard/interview-dashboard/columns";
import {
  FilterCategoryVariant,
  type SelectedFilters,
} from "@/components/dashboard/filters";
import useInterviewDashboard from "@/APIClients/queries/useInterviewDashboard";
import useReviewDashboardFilterOptions from "@/APIClients/queries/useReviewDashboardFilterOptions";
import {
  ApplicationStatus,
  DashboardView,
  type InterviewDashboardFilters,
  type InterviewDashboardResult,
} from "@/graphql/typeUtils";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import {
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import { getAdminLayout } from "@/components/layouts/AdminLayout";
import { Tab, Tabs } from "@/components/dashboard/common/Tabs";
import useInterviewDashboardCounts from "@/APIClients/queries/useInterviewDashboardCounts";

const DEFAULT_RESULTS_PER_PAGE = 25;
const SEARCH_DEBOUNCE_MS = 500;

// The interview dashboard only lists these statuses, so offering the rest as
// filters would only ever produce an empty table.
const INTERVIEW_APPLICATION_STATUSES: string[] = [
  ApplicationStatus.Interviewed,
  ApplicationStatus.Selected,
];

const InterviewDashboardPage: NextPageWithLayout = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(
    DEFAULT_RESULTS_PER_PAGE
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  // Tracked by id rather than position so a refetch that reorders or replaces
  // the rows can't silently swap which applicant the side panel shows.
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [search, setSearch] = useState("");

  // The query fires on the settled text; the input keeps the raw value.
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

   const [activeView, setActiveView] = useState<DashboardView>(
    DashboardView.All
  );

  const handleViewChange = (view: string) => {
    const dashboardView = Object.values(DashboardView).find((value) => value === view);
    if (!dashboardView) return;
    setActiveView(dashboardView);
    setPageNumber(1);
    setRowSelection({});
    setActiveId(undefined);
  };

  // The table is single-sort, so only the first SortingState entry is used.
  // Unsortable columns are absent from COLUMN_ID_TO_SORT_BY, so sortBy is
  // undefined and the backend falls back to its default order.
  const activeSort = sorting[0];
  const sortBy = activeSort ? COLUMN_ID_TO_SORT_BY[activeSort.id] : undefined;
  const sortAscending = activeSort ? !activeSort.desc : undefined;

  const { data: filterOptions } = useReviewDashboardFilterOptions({});

  // Score ranges are left out: they bucket the combined review score, which
  // doesn't map onto interview scores.
  const filterCategories = useMemo(() => {
    if (!filterOptions) return [];
    return [
      { key: "position", label: "Role", options: filterOptions.positions },
      {
        key: "applicationStatus",
        label: "Application Status",
        options: filterOptions.applicationStatuses.filter((option) =>
          INTERVIEW_APPLICATION_STATUSES.includes(option.value)
        ),
      },
      {
        key: "skillCategory",
        label: "Skill Category",
        options: filterOptions.skillCategories,
      },
      { key: "year", label: "Year", options: filterOptions.years },
      {
        key: "bookmarked",
        label: "Bookmarked",
        options: filterOptions.bookmarked,
        variant: FilterCategoryVariant.Toggle,
      },
    ];
  }, [filterOptions]);

  // convert SelectedFilters to InterviewDashboardFilters for the backend
  const backendFilters = useMemo(
    (): InterviewDashboardFilters => ({
      search: debouncedSearch.trim() ? debouncedSearch : undefined,
      positions: selectedFilters.position?.length
        ? selectedFilters.position
        : undefined,
      applicationStatuses: selectedFilters.applicationStatus?.length
        ? (selectedFilters.applicationStatus as InterviewDashboardFilters["applicationStatuses"])
        : undefined,
      skillCategories: selectedFilters.skillCategory?.length
        ? (selectedFilters.skillCategory as InterviewDashboardFilters["skillCategories"])
        : undefined,
      years: selectedFilters.year?.length ? selectedFilters.year : undefined,
      bookmarked: selectedFilters.bookmarked?.includes("true")
        ? true
        : undefined,
    }),
    [selectedFilters, debouncedSearch]
  );
  const hasActiveFilters = Object.values(backendFilters).some(
    (value) => value !== undefined
  );

  const {
    data,
    previousData,
    loading: isLoading,
    error,
  } = useInterviewDashboard({
    pageNumber,
    resultsPerPage,
    sortBy,
    sortAscending,
    view: activeView,
    filters: backendFilters,
  });
  const rows = error
    ? []
    : data ?? (isLoading ? previousData : undefined) ?? [];
  const hasError = !!error;

  const activeIndex =
    activeId !== undefined
      ? rows.findIndex((row) => row.applicantRecordId === activeId)
      : -1;
  const activeRow: InterviewDashboardResult | undefined = rows[activeIndex];

  const handleResultsPerPageChange = (nextResultsPerPage: number) => {
    setResultsPerPage(nextResultsPerPage);
    setPageNumber(1);
    setRowSelection({});
    setActiveId(undefined);
  };

  // The side panel only walks the current page, so a page change closes it
  // rather than leaving it on an applicant who is about to leave the table.
  const handlePageChange = (nextPageNumber: number) => {
    setPageNumber(nextPageNumber);
    setRowSelection({});
    setActiveId(undefined);
  };

  // Changing the sort reorders the whole result set, so return to the first page.
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    setPageNumber(1);
    setRowSelection({});
    setActiveId(undefined);
  };

  // Filtering and searching change which rows exist, so return to the first
  // page and drop any selection or open side panel tied to the old rows.
  const resetForNewResults = () => {
    setPageNumber(1);
    setRowSelection({});
    setActiveId(undefined);
  };

  const handleFilterCategoryChange = (
    categoryKey: string,
    values: string[]
  ) => {
    setSelectedFilters((prev) => ({ ...prev, [categoryKey]: values }));
    resetForNewResults();
  };

  const handleRemoveFilter = (categoryKey: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] ?? []).filter((v) => v !== value),
    }));
    resetForNewResults();
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetForNewResults();
  };

  const { counts: tabCounts, error: countsError } =
    useInterviewDashboardCounts(backendFilters);

  const INTERVIEW_DASHBOARD_TABS_UNIT = { singular: "Entry", plural: "Entries" };
  const tabs: Tab[] = [
    { view: DashboardView.All, label: "All Applicants", count: tabCounts[DashboardView.All], unit: INTERVIEW_DASHBOARD_TABS_UNIT },
    { view: DashboardView.Shortlisted, label: "Shortlisted", count: tabCounts[DashboardView.Shortlisted], unit: INTERVIEW_DASHBOARD_TABS_UNIT },
    { view: DashboardView.Conflicts, label: "Conflicts", count: tabCounts[DashboardView.Conflicts], unit: INTERVIEW_DASHBOARD_TABS_UNIT },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-6 py-5">
        <DashboardSwitcher currentDashboard={DASHBOARD_ENUM.INTERVIEW} />

        {hasError ? (
          <div className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText">
            Failed to load interview dashboard
          </div>
        ) : null}

        {countsError ? (
          <p role="alert" className="text-sm text-alert-errorText">
            Failed to load dashboard counts.
          </p>
        ) : null}

        <Tabs
          activeView={activeView}
          onViewChange={handleViewChange}
          selectedCount={Object.keys(rowSelection).length}
          onClearAll={() => setRowSelection({})}
          tabs={tabs}
        />

        <InterviewDashboardToolbar
          search={{ value: search, onChange: handleSearchChange }}
          filters={{
            categories: filterCategories,
            selected: selectedFilters,
            onChange: handleFilterCategoryChange,
            onRemove: handleRemoveFilter,
          }}
        />

        <DashboardTable
          data={rows}
          columns={INTERVIEW_DASHBOARD_COLUMNS}
          getRowId={(row) => row.applicantRecordId}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onRowClick={(row) => setActiveId(row.applicantRecordId)}
          isLoading={isLoading}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          emptyMessage={
            hasActiveFilters
              ? "No applicants match your search or filters."
              : "No interviewed applicants found."
          }
          pagination={{
            pageNumber,
            resultsPerPage,
            canGoNext: rows.length === resultsPerPage,
            onPageChange: handlePageChange,
            onResultsPerPageChange: handleResultsPerPageChange,
          }}
        />
      </main>

      <InterviewDashboardSidePanel
        row={activeRow}
        onClose={() => setActiveId(undefined)}
        navigation={
          activeIndex >= 0
            ? {
                current: activeIndex + 1,
                canPrev: activeIndex > 0,
                canNext: activeIndex < rows.length - 1,
                total: rows.length,
                onPrev: () =>
                  setActiveId(rows[activeIndex - 1]?.applicantRecordId),
                onNext: () =>
                  setActiveId(rows[activeIndex + 1]?.applicantRecordId),
              }
            : undefined
        }
      />
    </div>
  );
};

InterviewDashboardPage.getLayout = getAdminLayout;

export default InterviewDashboardPage;
