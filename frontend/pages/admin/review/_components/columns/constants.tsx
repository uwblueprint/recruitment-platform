import type { ReviewDashboardResult } from "@/graphql/typeUtils";
import type { ColumnDef } from "@tanstack/react-table";

import { ApplicationCell } from "./ApplicationCell";
import { ReviewerCell } from "./ReviewerCell";
import { ReviewScoreCell } from "./ReviewScoreCell";
import { ReviewStatusCell } from "./ReviewStatusCell";
import { SelectAllHeader, SelectRowCell } from "./SelectionCell";

const applicantName = (firstName: string, lastName: string) =>
  `${firstName} ${lastName}`;

const reviewerName = (row: ReviewDashboardResult, index: number) => {
  const reviewer = row.reviewers[index];
  return reviewer ? applicantName(reviewer.firstName, reviewer.lastName) : "-";
};

export const REVIEW_DASHBOARD_COLUMNS: ColumnDef<
  ReviewDashboardResult,
  unknown
>[] = [
  {
    id: "select",
    size: 40,
    header: SelectAllHeader,
    cell: SelectRowCell,
  },
  {
    id: "application",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: "Application",
    enableSorting: true,
    cell: ({ row }) => (
      <ApplicationCell
        applicantName={applicantName(row.original.firstName, row.original.lastName)}
      />
    ),
  },
  {
    id: "position",
    accessorFn: (row) => row.position,
    header: "Role",
    enableSorting: true,
    cell: ({ row }) => row.original.position,
  },
  {
    id: "choice",
    size: 80,
    accessorFn: (row) => row.choice,
    header: "Choice",
    enableSorting: true,
    cell: ({ row }) => row.original.choice,
  },
  {
    id: "timesApplied",
    size: 110,
    accessorFn: (row) => row.timesApplied,
    header: "Times Applied",
    enableSorting: true,
    cell: ({ row }) => row.original.timesApplied,
  },
  {
    id: "reviewer1",
    accessorFn: (row) => reviewerName(row, 0),
    header: "Reviewer 1",
    enableSorting: true,
    cell: ({ row }) => (
      <ReviewerCell reviewerName={reviewerName(row.original, 0)} />
    ),
  },
  {
    id: "reviewer2",
    accessorFn: (row) => reviewerName(row, 1),
    header: "Reviewer 2",
    enableSorting: true,
    cell: ({ row }) => (
      <ReviewerCell reviewerName={reviewerName(row.original, 1)} />
    ),
  },
  {
    id: "totalScore",
    accessorFn: (row) => row.totalScore,
    header: "Review Score",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.totalScore === null ? (
        "-"
      ) : (
        <ReviewScoreCell score={row.original.totalScore} />
      ),
  },
  {
    id: "applicationStatus",
    accessorFn: (row) => row.applicationStatus,
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => (
      <ReviewStatusCell
        applicantRecordId={row.original.applicantRecordId}
        status={row.original.applicationStatus}
      />
    ),
  },
  {
    id: "open",
    size: 32,
    header: "",
    cell: () => <span className="text-lg text-neutral-200">›</span>,
  },
];
