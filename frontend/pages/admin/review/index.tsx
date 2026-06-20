import { DashboardSidePanel } from "@/components/dashboard/side-panel";
import { DashboardTable } from "@/components/dashboard/table";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import type { ReviewDashboardResult } from "@/graphql/typeUtils";
import {
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../../_app";

import {
  COLUMN_ID_TO_SORT_BY,
  REVIEW_DASHBOARD_COLUMNS,
} from "./_components/columns";
import useReviewDashboard from "./_components/hooks/useReviewDashboard";

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
  const [activeRow, setActiveRow] = useState<ReviewDashboardResult | null>(
    null,
  );

  // The table is single-sort, so only the first SortingState entry is used.
  // Unsortable columns are absent from COLUMN_ID_TO_SORT_BY, so sortBy is
  // undefined and the backend falls back to its default order.
  const activeSort = sorting[0];
  const sortBy = activeSort ? COLUMN_ID_TO_SORT_BY[activeSort.id] : undefined;
  const sortAscending = activeSort ? !activeSort.desc : undefined;

  const { rows, isLoading, error } = useReviewDashboard(
    pageNumber,
    resultsPerPage,
    sortBy,
    sortAscending,
  );

  const handleResultsPerPageChange = (nextResultsPerPage: number) => {
    setResultsPerPage(nextResultsPerPage);
    setPageNumber(1);
    setRowSelection({});
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

        <DashboardTable
          data={rows}
          columns={REVIEW_DASHBOARD_COLUMNS}
          getRowId={(row) => row.applicantRecordId}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onRowClick={(row) => setActiveRow(row)}
          isLoading={isLoading}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          pagination={{
            pageNumber,
            resultsPerPage,
            canGoNext: rows.length === resultsPerPage,
            onPageChange: setPageNumber,
            onResultsPerPageChange: handleResultsPerPageChange,
          }}
        />
      </main>

      <DashboardSidePanel
        open={!!activeRow}
        onClose={() => setActiveRow(null)}
        title={
          activeRow
            ? `${activeRow.firstName} ${activeRow.lastName}`
            : "Applicant details"
        }
      />
    </div>
  );
};

AdminReviewPage.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin"]}>{page}</ProtectedRoute>
);

export default AdminReviewPage;
