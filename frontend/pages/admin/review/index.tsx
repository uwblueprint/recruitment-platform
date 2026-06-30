import { DashboardSidePanel } from "@/components/dashboard/side-panel";
import { DashboardTable } from "@/components/dashboard/table";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import type { ReviewDashboardResult } from "@/graphql/typeUtils";
import { RowSelectionState, SortingState } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../../_app";

import { REVIEW_DASHBOARD_COLUMNS } from "./_components/columns";
import useReviewDashboard from "./_components/hooks/useReviewDashboard";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { rows, isLoading, error } = useReviewDashboard(
    pageNumber,
    resultsPerPage,
  );

  // `rows` is already in display order because the table sorts server-side
  // (manualSorting), so navigating by index walks the current display order.
  const activeRow: ReviewDashboardResult | null =
    activeIndex !== null ? (rows[activeIndex] ?? null) : null;

  const { details, isLoading: isDetailsLoading } = useReviewDashboardSidePanel(
    activeRow?.applicantRecordId ?? null,
  );

  const handleResultsPerPageChange = (nextResultsPerPage: number) => {
    setResultsPerPage(nextResultsPerPage);
    setPageNumber(1);
    setRowSelection({});
    setActiveIndex(null);
  };

  const handlePageChange = (nextPageNumber: number) => {
    setPageNumber(nextPageNumber);
    setActiveIndex(null);
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
          onRowClick={(row) =>
            setActiveIndex(
              rows.findIndex(
                (candidate) =>
                  candidate.applicantRecordId === row.applicantRecordId,
              ),
            )
          }
          isLoading={isLoading}
          sorting={sorting}
          onSortingChange={setSorting}
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
        open={activeRow !== null}
        onClose={() => setActiveIndex(null)}
        row={activeRow}
        details={details}
        isLoading={isDetailsLoading}
        navigation={
          activeIndex !== null
            ? {
                current: activeIndex + 1,
                total: rows.length,
                canPrev: activeIndex > 0,
                canNext: activeIndex < rows.length - 1,
                onPrev: () => setActiveIndex((index) => (index ?? 0) - 1),
                onNext: () => setActiveIndex((index) => (index ?? 0) + 1),
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
