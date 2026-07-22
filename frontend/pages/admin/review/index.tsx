import { Toast } from "@/components/common/Toast";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { DashboardSidePanel } from "@/components/dashboard/side-panel";
import { DashboardTable } from "@/components/dashboard/table";
import { BulkStatusConfirmationDialogue } from "@/components/dashboard/review-dashboard/BulkStatusConfirmationDialogue";
import { type ReviewDashboardResult } from "@/graphql/typeUtils";
import { OnChangeFn, RowSelectionState, SortingState } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import { COLUMN_ID_TO_SORT_BY, REVIEW_DASHBOARD_COLUMNS } from "./_components/columns";
import { ReviewDashboardToolbar } from "./_components/ReviewDashboardToolbar";
import { type BulkAction } from "./_components/bulkStatusActions";
import useReviewDashboard from "./_components/hooks/useReviewDashboard";
import useBulkStatusAction from "./_components/hooks/useBulkStatusAction";

const DEFAULT_RESULTS_PER_PAGE = 25;

const AdminReviewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const position =
    typeof router.query.position === "string" ? router.query.position : null;

  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(DEFAULT_RESULTS_PER_PAGE);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeRow, setActiveRow] = useState<ReviewDashboardResult | null>(null);

  const activeSort = sorting[0];
  const sortBy = activeSort ? COLUMN_ID_TO_SORT_BY[activeSort.id] : undefined;
  const sortAscending = activeSort ? !activeSort.desc : undefined;

  const { rows, isLoading, error, refetch } = useReviewDashboard(
    pageNumber,
    resultsPerPage,
    sortBy,
    sortAscending,
  );
  const selectedRows = rows.filter((row) => rowSelection[row.applicantRecordId]);

  const clearSelection = () => setRowSelection({});

  const { dialogue, openBulkAction, toast, dismissToast } = useBulkStatusAction({
    onSuccess: () => {
      clearSelection();
      refetch();
    },
  });

  const handleResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
    setPageNumber(1);
    clearSelection();
  };
  const handlePageChange = (value: number) => {
    setPageNumber(value);
    clearSelection();
  };
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    setPageNumber(1);
    clearSelection();
  };

  const handleBulkAction = (action: BulkAction) =>
    openBulkAction(
      action,
      selectedRows.map((row) => ({
        id: row.applicantRecordId,
        name: `${row.firstName} ${row.lastName}`,
        position: row.position,
        totalScore: row.totalScore,
      })),
    );

  return (
    <div className="flex h-screen flex-col bg-white">
      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-6 py-5">
        <ReviewDashboardToolbar
          position={position}
          selectedCount={selectedRows.length}
          disabled={isLoading}
          onReject={() => handleBulkAction("reject")}
          onSelectForInterview={() => handleBulkAction("interview")}
        />
        {error ? (
          <div
            role="alert"
            className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText"
          >
            Failed to load review dashboard
          </div>
        ) : null}
        <DashboardTable
          data={rows}
          columns={REVIEW_DASHBOARD_COLUMNS}
          getRowId={(row) => row.applicantRecordId}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onRowClick={setActiveRow}
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
        open={!!activeRow}
        onClose={() => setActiveRow(null)}
        title={
          activeRow
            ? `${activeRow.firstName} ${activeRow.lastName}`
            : "Applicant details"
        }
      />
      {dialogue ? <BulkStatusConfirmationDialogue {...dialogue} /> : null}
      <Toast {...toast} onClose={dismissToast} />
    </div>
  );
};

AdminReviewPage.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin"]}>{page}</ProtectedRoute>
);

export default AdminReviewPage;
