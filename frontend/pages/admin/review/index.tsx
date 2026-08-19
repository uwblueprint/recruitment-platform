import { DashboardSidePanel } from "@/components/dashboard/side-panel";
import { DashboardTable } from "@/components/dashboard/table";
import {
  FilterChips,
  FilterMenu,
  SearchBar,
  type SelectedFilters,
} from "@/components/dashboard/filters";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { DashboardView } from "@/graphql/typeUtils";
import type { ReviewDashboardFilters } from "@/graphql/typeUtils";
import {
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { ReactElement, useMemo, useState } from "react";
import { NextPageWithLayout } from "../../_app";

import {
  COLUMN_ID_TO_SORT_BY,
  REVIEW_DASHBOARD_COLUMNS,
} from "./_components/columns";
import { DashboardTabs } from "./_components/DashboardTabs";
import useReviewDashboard from "./_components/hooks/useReviewDashboard";
import useReviewDashboardApplicantRecordIds from "./_components/hooks/useReviewDashboardApplicantRecordIds";
import useReviewDashboardFilterOptions from "./_components/hooks/useReviewDashboardFilterOptions";
import useReviewDashboardSidePanel from "./_components/hooks/useReviewDashboardSidePanel";
import useTabCounts from "./_components/hooks/useTabCounts";

const DEFAULT_RESULTS_PER_PAGE = 25;

const AdminReviewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const position =
    typeof router.query.position === "string" ? router.query.position : null;

  const [activeView, setActiveView] = useState<DashboardView>(DashboardView.All);
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(DEFAULT_RESULTS_PER_PAGE);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [search, setSearch] = useState("");

  const activeSort = sorting[0];
  const sortBy = activeSort ? COLUMN_ID_TO_SORT_BY[activeSort.id] : undefined;
  const sortAscending = activeSort && !activeSort.desc;

  const { filterOptions } = useReviewDashboardFilterOptions();

  // build filter categories from backend options
  const filterCategories = useMemo(() => {
    if (!filterOptions) return [];
    return [
      { key: "position", label: "Role", options: filterOptions.positions },
      {
        key: "applicationStatus",
        label: "Application Status",
        options: filterOptions.applicationStatuses,
      },
      {
        key: "skillCategory",
        label: "Skill Category",
        options: filterOptions.skillCategories,
      },
      {
        key: "scoreRange",
        label: "Score",
        options: filterOptions.scoreRanges,
        chipPrefix: "Score",
      },
      { key: "year", label: "Year", options: filterOptions.years },
      {
        key: "bookmarked",
        label: "Bookmarked",
        options: filterOptions.bookmarked,
        variant: "toggle" as const,
      },
    ];
  }, [filterOptions]);

  // convert SelectedFilters to ReviewDashboardFilters for the backend
  const backendFilters = useMemo(
    (): ReviewDashboardFilters => ({
      positions: selectedFilters.position?.length
        ? selectedFilters.position
        : undefined,
      applicationStatuses: selectedFilters.applicationStatus?.length
        ? (selectedFilters.applicationStatus as ReviewDashboardFilters["applicationStatuses"])
        : undefined,
      skillCategories: selectedFilters.skillCategory?.length
        ? (selectedFilters.skillCategory as ReviewDashboardFilters["skillCategories"])
        : undefined,
      scoreRanges: selectedFilters.scoreRange?.length
        ? selectedFilters.scoreRange
        : undefined,
      years: selectedFilters.year?.length ? selectedFilters.year : undefined,
      bookmarked: selectedFilters.bookmarked?.includes("true")
        ? true
        : undefined,
    }),
    [selectedFilters],
  );

  const { rows, isLoading, error } = useReviewDashboard(
    pageNumber,
    resultsPerPage,
    sortBy,
    sortAscending,
    backendFilters,
    activeView,
  );

  const applicantRecordIds = useReviewDashboardApplicantRecordIds(
    sortBy,
    sortAscending,
    backendFilters,
  );
  const activeRow = rows.find((row) => row.applicantRecordId === activeId);
  const { details, isLoading: isDetailsLoading } =
    useReviewDashboardSidePanel(activeId);
  const activeNavigationIndex =
    activeId !== undefined ? applicantRecordIds.indexOf(activeId) : -1;

  const tabCounts = useTabCounts(rows, isLoading, activeView);

  // Jumps the side panel to the applicant at `index` and keeps the table on
  // the page that applicant lives on.
  const goToApplicant = (index: number) => {
    const applicantRecordId = applicantRecordIds[index];
    if (!applicantRecordId) return;
    setActiveId(applicantRecordId);
    setPageNumber(Math.floor(index / resultsPerPage) + 1);
  };

  const handleViewChange = (view: DashboardView) => {
    setActiveView(view);
    setPageNumber(1);
    setRowSelection({});
    setActiveId(undefined);
  };

  const handleResultsPerPageChange = (nextResultsPerPage: number) => {
    setResultsPerPage(nextResultsPerPage);
    setPageNumber(1);
    setRowSelection({});
    setActiveId(undefined);
  };

  const handlePageChange = (nextPageNumber: number) => {
    setPageNumber(nextPageNumber);
    setActiveId(undefined);
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    setPageNumber(1);
    setRowSelection({});
  };

  const handleFilterCategoryChange = (
    categoryKey: string,
    values: string[],
  ) => {
    setSelectedFilters((prev) => ({ ...prev, [categoryKey]: values }));
    setPageNumber(1);
    setRowSelection({});
  };

  const handleRemoveFilter = (categoryKey: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] ?? []).filter((v) => v !== value),
    }));
    setPageNumber(1);
    setRowSelection({});
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPageNumber(1);
    setRowSelection({});
  };

  const visibleRows = useMemo(() => {
    const trimmedSearch = search.trim().toLowerCase();
    return trimmedSearch
      ? rows.filter((row) =>
          `${row.firstName} ${row.lastName}`
            .toLowerCase()
            .includes(trimmedSearch),
        )
      : rows;
  }, [rows, search]);
  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="flex h-screen flex-col bg-white">
      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-6 py-5">
        <div className="shrink-0">
          {position ? (
            <h1 className="font-poppins text-[28px] font-semibold leading-[140%] text-blue">
              {position} Applications
            </h1>
          ) : null}
        </div>

        <DashboardTabs
          activeView={activeView}
          onViewChange={handleViewChange}
          counts={tabCounts}
          selectedCount={selectedCount}
          onClearAll={() => setRowSelection({})}
        />

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <SearchBar value={search} onChange={handleSearchChange} />
          <FilterMenu
            categories={filterCategories}
            selected={selectedFilters}
            onChange={handleFilterCategoryChange}
          />
          <FilterChips
            categories={filterCategories}
            selected={selectedFilters}
            onRemove={handleRemoveFilter}
          />
        </div>

        {error ? (
          <div className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText">
            Failed to load review dashboard
          </div>
        ) : null}

        <DashboardTable
          data={visibleRows}
          columns={REVIEW_DASHBOARD_COLUMNS}
          getRowId={(row) => row.applicantRecordId}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onRowClick={(row) => setActiveId(row.applicantRecordId)}
          isLoading={isLoading}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          pagination={{
            pageNumber,
            resultsPerPage,
            canGoNext: rows.length === resultsPerPage,
            onPageChange: handlePageChange,
            onResultsPerPageChange: handleResultsPerPageChange,
          }}
        />
      </main>

      <DashboardSidePanel
        open={activeId !== undefined}
        onClose={() => setActiveId(undefined)}
        row={activeRow}
        details={details}
        isLoading={isDetailsLoading}
        navigation={
          activeNavigationIndex >= 0
            ? {
                current: activeNavigationIndex + 1,
                total: applicantRecordIds.length,
                canPrev: activeNavigationIndex > 0,
                canNext: activeNavigationIndex < applicantRecordIds.length - 1,
                onPrev: () => goToApplicant(activeNavigationIndex - 1),
                onNext: () => goToApplicant(activeNavigationIndex + 1),
              }
            : undefined
        }
      />
    </div>
  );
};

AdminReviewPage.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin"]}>{page}</ProtectedRoute>
);

export default AdminReviewPage;
