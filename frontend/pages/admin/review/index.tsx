import { ReviewDashboardSidePanel } from "./_components/side-panel/ReviewDashboardSidePanel";
import { Toast } from "@/components/common/Toast";
import { DashboardTable } from "@/components/dashboard/table";
import {
  FilterCategoryVariant,
  type SelectedFilters,
} from "@/components/dashboard/filters";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type { ApplicationStatus } from "@/graphql/typeUtils";
import { DashboardView } from "@/graphql/typeUtils";
import type { ReviewDashboardFilters } from "@/graphql/typeUtils";
import {
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { BulkStatusConfirmationDialogue } from "@/components/dashboard/review-dashboard/BulkStatusConfirmationDialogue";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import { getAdminLayout } from "@/components/layouts/AdminLayout";
import {
  COLUMN_ID_TO_SORT_BY,
  createReviewDashboardColumns,
} from "./_components/columns";
import { DashboardTabs } from "./_components/DashboardTabs";
import useDebouncedValue from "./_components/hooks/useDebouncedValue";
import { ReassignReviewerDialogue } from "./_components/dialogues/ReassignReviewerDialogue";
import { ReviewDashboardToolbar } from "./_components/ReviewDashboardToolbar";
import { BulkAction } from "./_components/bulkStatusActions";
import useReviewDashboard from "./_components/hooks/useReviewDashboard";
import useReviewDashboardApplicantRecordIds from "./_components/hooks/useReviewDashboardApplicantRecordIds";
import useReviewDashboardFilterOptions from "./_components/hooks/useReviewDashboardFilterOptions";
import useTabCounts from "./_components/hooks/useTabCounts";
import useBulkStatusAction from "./_components/hooks/useBulkStatusAction";

const DEFAULT_RESULTS_PER_PAGE = 25;
const SEARCH_DEBOUNCE_MS = 500;

type ReviewerReassignmentTarget = {
  applicantRecordId: string;
  position: string;
  reviewerId: string;
  reviewerName: string;
};

const AdminReviewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const position =
    typeof router.query.position === "string" ? router.query.position : null;

  const [activeView, setActiveView] = useState<DashboardView>(
    DashboardView.All
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(
    DEFAULT_RESULTS_PER_PAGE
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [search, setSearch] = useState("");

  const [reviewerReassignmentTarget, setReviewerReassignmentTarget] =
    useState<ReviewerReassignmentTarget | null>(null);

  // The query fires on the settled text; the input keeps the raw value.
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const activeSort = sorting[0];
  const sortBy = activeSort ? COLUMN_ID_TO_SORT_BY[activeSort.id] : undefined;
  const sortAscending = activeSort ? !activeSort.desc : undefined;

  const [statusError, setStatusError] = useState(false);

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
        variant: FilterCategoryVariant.Toggle,
      },
    ];
  }, [filterOptions]);

  // convert SelectedFilters to ReviewDashboardFilters for the backend
  const backendFilters = useMemo(
    (): ReviewDashboardFilters => ({
      search: debouncedSearch.trim() ? debouncedSearch : undefined,
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
    [selectedFilters, debouncedSearch]
  );

  const { rows, isLoading, error, setRowStatus, refetch } = useReviewDashboard(
    pageNumber,
    resultsPerPage,
    sortBy,
    sortAscending,
    backendFilters,
    activeView
  );

  const applicantRecordIds = useReviewDashboardApplicantRecordIds(
    sortBy,
    sortAscending,
    backendFilters
  );
  const activeRow = rows.find((row) => row.applicantRecordId === activeId);
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
    setRowSelection({});
  };

  // Writes the new status straight into `rows` so the table chip and the side
  // panel chip both move at once, then reconciles with what the server echoes
  // back. A failed update rolls the chip back to `previousStatus` rather than
  // leaving the UI showing a status that was never saved. Callers pass the
  // status they were rendering, which keeps this handler stable.
  const handleStatusChange = useCallback(
    async (
      applicantRecordId: string,
      nextStatus: ApplicationStatus,
      previousStatus: ApplicationStatus
    ) => {
      setStatusError(false);
      setRowStatus(applicantRecordId, nextStatus);

      try {
        const confirmedStatus =
          await ReviewDashboardAPIClient.updateApplicantRecordStatus(
            applicantRecordId,
            nextStatus
          );
        setRowStatus(applicantRecordId, confirmedStatus);
        return confirmedStatus;
      } catch (error) {
        setRowStatus(applicantRecordId, previousStatus);
        setStatusError(true);
        throw error;
      }
    },
    [setRowStatus]
  );

  // TanStack Table expects a stable `columns` reference, so build it once from
  // the stable status handler.
  const columns = useMemo(
    () =>
      createReviewDashboardColumns({
        onStatusChange: handleStatusChange,
        onReviewerClick: (row, reviewer) => {
          setReviewerReassignmentTarget({
            applicantRecordId: row.applicantRecordId,
            position: row.position,
            reviewerId: reviewer.id,
            reviewerName: `${reviewer.firstName} ${reviewer.lastName}`,
          });
        },
      }),
    [handleStatusChange]
  );

  const handleViewChange = (view: DashboardView) => {
    setActiveView(view);
    setPageNumber(1);
    setRowSelection({});
    setActiveId(undefined);
  };
  const selectedRows = rows.filter(
    (row) => rowSelection[row.applicantRecordId]
  );

  const clearSelection = () => setRowSelection({});

  const {
    dialogue: bulkActionDialogue,
    openBulkAction,
    toast: bulkActionToast,
    dismissToast: dismissBulkActionToast,
  } = useBulkStatusAction({
    onSuccess: () => {
      clearSelection();
      refetch();
    },
  });

  const handleResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
    setPageNumber(1);
    setRowSelection({});
    setActiveId(undefined);
  };

  const handlePageChange = (nextPageNumber: number) => {
    setPageNumber(nextPageNumber);
    setActiveId(undefined);
    clearSelection();
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    setPageNumber(1);
    clearSelection();
  };

  const handleFilterCategoryChange = (
    categoryKey: string,
    values: string[]
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
    clearSelection();
  };

  const selectedCount = Object.keys(rowSelection).length;

  const handleBulkAction = (action: BulkAction) =>
    openBulkAction(
      action,
      selectedRows.map((row) => ({
        id: row.applicantRecordId,
        name: `${row.firstName} ${row.lastName}`,
        position: row.position,
        totalScore: row.totalScore,
      }))
    );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-6 py-5">
        <DashboardTabs
          activeView={activeView}
          onViewChange={handleViewChange}
          counts={tabCounts}
          selectedCount={selectedCount}
          onClearAll={() => setRowSelection({})}
        />

        <ReviewDashboardToolbar
          position={position}
          search={{ value: search, onChange: handleSearchChange }}
          filters={{
            categories: filterCategories,
            selected: selectedFilters,
            onChange: handleFilterCategoryChange,
            onRemove: handleRemoveFilter,
          }}
          bulkActions={{
            selectedCount: selectedRows.length,
            disabled: isLoading,
            onReject: () => handleBulkAction(BulkAction.Reject),
            onSelectForInterview: () => handleBulkAction(BulkAction.Interview),
          }}
        />
        {error ? (
          <div
            role="alert"
            className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText"
          >
            Failed to load review dashboard
          </div>
        ) : null}

        {statusError ? (
          <div className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText">
            Failed to update applicant status
          </div>
        ) : null}
        <DashboardTable
          data={rows}
          columns={columns}
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
      <ReviewDashboardSidePanel
        applicantRecordId={activeId}
        onClose={() => setActiveId(undefined)}
        row={activeRow}
        onStatusChange={handleStatusChange}
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

      {reviewerReassignmentTarget ? (
        <ReassignReviewerDialogue
          open={!!reviewerReassignmentTarget}
          applicantRecordId={reviewerReassignmentTarget.applicantRecordId}
          position={reviewerReassignmentTarget.position}
          currentReviewerId={reviewerReassignmentTarget.reviewerId}
          currentReviewerName={reviewerReassignmentTarget.reviewerName}
          onClose={() => setReviewerReassignmentTarget(null)}
          onUpdated={() => {
            setReviewerReassignmentTarget(null);
            refetch();
          }}
        />
      ) : null}
      {bulkActionDialogue ? (
        <BulkStatusConfirmationDialogue {...bulkActionDialogue} />
      ) : null}
      <Toast {...bulkActionToast} onClose={dismissBulkActionToast} />
    </div>
  );
};

AdminReviewPage.getLayout = getAdminLayout;

export default AdminReviewPage;
