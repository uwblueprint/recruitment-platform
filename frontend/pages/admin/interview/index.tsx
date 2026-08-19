import {
  DashboardSidePanel,
  InterviewSidePanelContent,
} from "@/components/dashboard/side-panel";
import { DashboardTable } from "@/components/dashboard/table";
import { ProtectedRoute } from "@/components/contexts/ProtectedRoute";
import { INTERVIEW_DASHBOARD_COLUMNS } from "@/components/dashboard/interview-dashboard/columns";
import useInterviewDashboard from "@/components/dashboard/interview-dashboard/hooks/useInterviewDashboard";
import type { InterviewDashboardResult } from "@/graphql/typeUtils";
import { RowSelectionState } from "@tanstack/react-table";
import { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../../_app";

const DEFAULT_RESULTS_PER_PAGE = 25;

const InterviewDashboardPage: NextPageWithLayout = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(
    DEFAULT_RESULTS_PER_PAGE,
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { rows, isLoading, hasError } = useInterviewDashboard(
    pageNumber,
    resultsPerPage,
  );

  const activeRow: InterviewDashboardResult | null =
    activeIndex !== null ? rows[activeIndex] ?? null : null;

  const handleResultsPerPageChange = (nextResultsPerPage: number) => {
    setResultsPerPage(nextResultsPerPage);
    setPageNumber(1);
    setRowSelection({});
    setActiveIndex(null);
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
          onRowClick={(row) =>
            setActiveIndex(rows.findIndex((r) => r.applicantRecordId === row.applicantRecordId))
          }
          isLoading={isLoading}
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

      <DashboardSidePanel
        open={activeRow !== null}
        onClose={() => setActiveIndex(null)}
        pagination={
          activeIndex !== null
            ? {
                currentIndex: activeIndex,
                totalCount: rows.length,
                onPrevious: () => setActiveIndex((i) => Math.max((i ?? 0) - 1, 0)),
                onNext: () =>
                  setActiveIndex((i) => Math.min((i ?? 0) + 1, rows.length - 1)),
              }
            : undefined
        }
      >
        {activeRow ? (
          <InterviewSidePanelContent
            applicantRecordId={activeRow.applicantRecordId}
          />
        ) : null}
      </DashboardSidePanel>
    </div>
  );
};

InterviewDashboardPage.getLayout = (page: ReactElement) => (
  <ProtectedRoute allowedRoles={["Admin"]}>{page}</ProtectedRoute>
);

export default InterviewDashboardPage;
