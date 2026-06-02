import { DashboardSidePanel } from "@/components/dashboard/side-panel";
import { DashboardTable } from "@/components/dashboard/table";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import {
  ReviewDashboardDocument,
  type ReviewDashboardQuery,
  type ReviewDashboardQueryVariables,
  type ReviewDashboardResult,
} from "@/graphql/typeUtils";
import { useQuery } from "@apollo/client/react";
import { RowSelectionState } from "@tanstack/react-table";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../../_app";

import { REVIEW_DASHBOARD_COLUMNS } from "@/components/dashboard/review/columns";

const DEFAULT_RESULTS_PER_PAGE = 25;

const AdminReviewPage: NextPageWithLayout = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(
    DEFAULT_RESULTS_PER_PAGE,
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeRow, setActiveRow] = useState<ReviewDashboardResult | null>(
    null,
  );

  const { data, loading, error } = useQuery<
    ReviewDashboardQuery,
    ReviewDashboardQueryVariables
  >(ReviewDashboardDocument, {
    variables: { pageNumber, resultsPerPage },
    fetchPolicy: "network-only",
  });

  const rows = data?.reviewDashboard ?? [];

  const handleResultsPerPageChange = (nextResultsPerPage: number) => {
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

        {error ? (
          <div className="rounded border border-alert-errorBorder bg-red-50 px-4 py-3 text-sm text-alert-errorText">
            {error.message}
          </div>
        ) : null}

        <DashboardTable
          data={rows}
          columns={REVIEW_DASHBOARD_COLUMNS}
          getRowId={(row) => row.applicantRecordId}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onRowClick={(row) => setActiveRow(row)}
          isLoading={loading}
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
  <ProtectedRoute allowedRoles={["Admin", "User"]}>{page}</ProtectedRoute>
);

export default AdminReviewPage;
