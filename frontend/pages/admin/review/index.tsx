import { DashboardSidePanel } from "@/components/dashboard/side-panel";
import { DashboardTable } from "@/components/dashboard/table";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type { ApplicationStatus } from "@/graphql/typeUtils";
import {
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { ReactElement, useCallback, useMemo, useState } from "react";
import { NextPageWithLayout } from "../../_app";

import {
  COLUMN_ID_TO_SORT_BY,
  createReviewDashboardColumns,
} from "./_components/columns";
import useReviewDashboard from "./_components/hooks/useReviewDashboard";
import useReviewDashboardApplicantRecordIds from "./_components/hooks/useReviewDashboardApplicantRecordIds";
import useReviewDashboardSidePanel from "./_components/hooks/useReviewDashboardSidePanel";

const DEFAULT_RESULTS_PER_PAGE = 25;

const AdminReviewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const position = typeof router.query.position === "string" ? router.query.position : null;

  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(
    DEFAULT_RESULTS_PER_PAGE,
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  // The table is single-sort, so only the first SortingState entry is used.
  // Unsortable columns are absent from COLUMN_ID_TO_SORT_BY, so sortBy is
  // undefined and the backend falls back to its default order.
  const activeSort = sorting[0];
  const sortBy = activeSort ? COLUMN_ID_TO_SORT_BY[activeSort.id] : undefined;
  const sortAscending = activeSort && !activeSort.desc;

  const [statusError, setStatusError] = useState(false);

  const { rows, isLoading, error, setRowStatus } = useReviewDashboard(
    pageNumber,
    resultsPerPage,
    sortBy,
    sortAscending,
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

  // Writes the new status straight into `rows` so the table chip and the side
  // panel chip both move at once, then reconciles with what the server echoes
  // back. A failed update rolls the chip back to `previousStatus` rather than
  // leaving the UI showing a status that was never saved. Callers pass the
  // status they were rendering, which keeps this handler stable.
  const handleStatusChange = useCallback(
    async (
      applicantRecordId: string,
      nextStatus: ApplicationStatus,
      previousStatus: ApplicationStatus,
    ) => {
      setStatusError(false);
      setRowStatus(applicantRecordId, nextStatus);

      try {
        const confirmedStatus =
          await ReviewDashboardAPIClient.updateApplicantRecordStatus(
            applicantRecordId,
            nextStatus,
          );
        setRowStatus(applicantRecordId, confirmedStatus);
      } catch {
        setRowStatus(applicantRecordId, previousStatus);
        setStatusError(true);
      }
    },
    [setRowStatus],
  );

  // TanStack Table expects a stable `columns` reference, so build it once from
  // the stable status handler.
  const columns = useMemo(
    () => createReviewDashboardColumns({ onStatusChange: handleStatusChange }),
    [handleStatusChange],
  );

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

        {error ? (
          <div className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText">
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
