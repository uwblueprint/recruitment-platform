import { DashboardSidePanel } from "@/components/dashboard/side-panel";
import { DashboardTable } from "@/components/dashboard/table";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { DashboardView } from "@/graphql/typeUtils";
import {
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";

import {
  COLUMN_ID_TO_SORT_BY,
  REVIEW_DASHBOARD_COLUMNS,
} from "./_components/columns";
import { DashboardTabs } from "./_components/DashboardTabs";
import useReviewDashboard from "./_components/hooks/useReviewDashboard";
import useReviewDashboardApplicantRecordIds from "./_components/hooks/useReviewDashboardApplicantRecordIds";
import useReviewDashboardSidePanel from "./_components/hooks/useReviewDashboardSidePanel";

const DEFAULT_RESULTS_PER_PAGE = 25;

const AdminReviewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const position = typeof router.query.position === "string" ? router.query.position : null;

  const [activeView, setActiveView] = useState<DashboardView>(DashboardView.All);
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(DEFAULT_RESULTS_PER_PAGE);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  // Track the last-known count for each view so tab counts stay stable while switching
  const [tabCounts, setTabCounts] = useState<Record<DashboardView, number>>({
    [DashboardView.All]: 0,
    [DashboardView.Shortlisted]: 0,
    [DashboardView.Conflicts]: 0,
  });

  // The table is single-sort, so only the first SortingState entry is used.
  // Unsortable columns are absent from COLUMN_ID_TO_SORT_BY, so sortBy is
  // undefined and the backend falls back to its default order.
  const activeSort = sorting[0];
  const sortBy = activeSort ? COLUMN_ID_TO_SORT_BY[activeSort.id] : undefined;
  const sortAscending = activeSort && !activeSort.desc;

  const { rows, isLoading, error } = useReviewDashboard(
    pageNumber,
    resultsPerPage,
    sortBy,
    sortAscending,
    activeView,
  );

  // Every applicant record id in display order, so the side panel can walk the
  // whole dashboard instead of only the page currently loaded in `rows`.
  const applicantRecordIds = useReviewDashboardApplicantRecordIds();

  // The active row is only available while the active applicant's page is
  // loaded; navigating to another page leaves it undefined until the page
  // fetch settles.
  const activeRow = rows.find((row) => row.applicantRecordId === activeId);

  const { details, isLoading: isDetailsLoading } = useReviewDashboardSidePanel(
    activeId,
  );

  const activeNavigationIndex =
    activeId !== undefined ? applicantRecordIds.indexOf(activeId) : -1;

  // Update the count for the current view whenever rows change
  useEffect(() => {
    if (!isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTabCounts((prev) => ({ ...prev, [activeView]: rows.length }));
    }
  }, [rows, isLoading, activeView]);

  // Jumps the side panel to the applicant at `index` and keeps the table on
  // the page that applicant lives on.
  const goToApplicant = (index: number) => {
    const applicantRecordId = applicantRecordIds[index];
    if (!applicantRecordId) {
      return;
    }
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

  // Changing the sort can shrink the result set, so return to the first page.
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    setPageNumber(1);
    setRowSelection({});
  };

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

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

        {error ? (
          <div className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText">
            Failed to load review dashboard
          </div>
        ) : null}

        <DashboardTable
          data={rows}
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
