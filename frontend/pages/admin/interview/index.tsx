import { DashboardTable } from "@/components/dashboard/table";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import {
  COLUMN_ID_TO_SORT_BY,
  INTERVIEW_DASHBOARD_COLUMNS,
} from "@/components/dashboard/interview-dashboard/columns";
import useInterviewDashboard from "@/components/dashboard/interview-dashboard/hooks/useInterviewDashboard";
import {
  OnChangeFn,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../../_app";

const DEFAULT_RESULTS_PER_PAGE = 25;

const InterviewDashboardPage: NextPageWithLayout = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(
    DEFAULT_RESULTS_PER_PAGE,
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  // The table is single-sort, so only the first SortingState entry is used.
  // Unsortable columns are absent from COLUMN_ID_TO_SORT_BY, so sortBy is
  // undefined and the backend falls back to its default order.
  const activeSort = sorting[0];
  const sortBy = activeSort ? COLUMN_ID_TO_SORT_BY[activeSort.id] : undefined;
  const sortAscending = activeSort && !activeSort.desc;

  const { rows, isLoading, hasError } = useInterviewDashboard(
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

  // Changing the sort reorders the whole result set, so return to the first page.
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    setPageNumber(1);
    setRowSelection({});
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-6 py-5">
        <h1 className="shrink-0 font-poppins text-[28px] font-semibold leading-[140%] text-blue">
          Interview Dashboard
        </h1>

        {hasError ? (
          <div className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText">
            Failed to load interview dashboard
          </div>
        ) : null}

        <DashboardTable
          data={rows}
          columns={INTERVIEW_DASHBOARD_COLUMNS}
          getRowId={(row) => row.applicantRecordId}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          isLoading={isLoading}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          emptyMessage="No interviewed applicants found."
          pagination={{
            pageNumber,
            resultsPerPage,
            canGoNext: rows.length === resultsPerPage,
            onPageChange: setPageNumber,
            onResultsPerPageChange: handleResultsPerPageChange,
          }}
        />
      </main>
    </div>
  );
};

InterviewDashboardPage.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin"]}>{page}</ProtectedRoute>
);

export default InterviewDashboardPage;
