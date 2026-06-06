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
    header: "Application",
    cell: ({ row }) => (
      <ApplicationCell
        applicantName={applicantName(row.original.firstName, row.original.lastName)}
      />
    ),
  },
  {
    id: "position",
    header: "Role",
    cell: ({ row }) => row.original.position,
  },
  {
    id: "choice",
    header: "Choice",
    cell: ({ row }) => row.original.choice,
  },
  {
    id: "timesApplied",
    header: "Times Applied",
    cell: ({ row }) => row.original.timesApplied,
  },
  {
    id: "reviewer1",
    header: "Reviewer 1",
    cell: ({ row }) => (
      <ReviewerCell reviewerName={reviewerName(row.original, 0)} />
    ),
  },
  {
    id: "reviewer2",
    header: "Reviewer 2",
    cell: ({ row }) => (
      <ReviewerCell reviewerName={reviewerName(row.original, 1)} />
    ),
  },
  {
    id: "totalScore",
    header: "Review Score",
    cell: ({ row }) =>
      row.original.totalScore === null ? (
        "-"
      ) : (
        <ReviewScoreCell score={row.original.totalScore} />
      ),
  },
  {
    id: "applicationStatus",
    header: "Status",
    cell: ({ row }) => (
      <ReviewStatusCell status={row.original.applicationStatus} />
    ),
  },
  {
    id: "open",
    size: 32,
    header: "",
    cell: () => <span className="text-lg text-neutral-200">›</span>,
  },
];
