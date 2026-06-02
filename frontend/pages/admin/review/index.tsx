import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import { DashboardSidePanel } from "@/components/dashboard/side-panel";
import { DashboardTable } from "@/components/dashboard/table";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import type { ReviewDashboardResult } from "@/graphql/typeUtils";
import { RowSelectionState } from "@tanstack/react-table";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { NextPageWithLayout } from "../../_app";

import { getReviewDashboardColumns } from "./_components/reviewDashboardColumns";

const DEFAULT_RESULTS_PER_PAGE = 25;

const AdminReviewPage: NextPageWithLayout = () => {
  const [rows, setRows] = useState<ReviewDashboardResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(
    DEFAULT_RESULTS_PER_PAGE,
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeRow, setActiveRow] = useState<ReviewDashboardResult | null>(
    null,
  );

  const columns = useMemo(() => getReviewDashboardColumns(), []);

  useEffect(() => {
    let isMounted = true;

    ReviewDashboardAPIClient.getReviewDashboard(pageNumber, resultsPerPage)
      .then((reviewDashboardRows) => {
        if (!isMounted) {
          return;
        }
        setRows(reviewDashboardRows);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }
        const message = error instanceof Error ? error.message : String(error);
        setErrorMessage(message);
        setRows([]);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pageNumber, resultsPerPage]);

  const handlePageChange = (nextPageNumber: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    setPageNumber(nextPageNumber);
  };

  const handleResultsPerPageChange = (nextResultsPerPage: number) => {
    setIsLoading(true);
    setErrorMessage(null);
    setResultsPerPage(nextResultsPerPage);
    setPageNumber(1);
    setRowSelection({});
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden px-6 py-5">
        <div className="shrink-0">
          <h1 className="font-poppins text-[28px] font-semibold leading-[140%] text-blue">
            Design Applications
          </h1>
        </div>

        {errorMessage ? (
          <div className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText">
            {errorMessage}
          </div>
        ) : null}

        <DashboardTable
          data={rows}
          columns={columns}
          getRowId={(row) => row.applicantRecordId}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onRowClick={(row) => setActiveRow(row)}
          isLoading={isLoading}
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
    </div>
  );
};

AdminReviewPage.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin", "User"]}>{page}</ProtectedRoute>
);

export default AdminReviewPage;
