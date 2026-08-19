import { ReviewDashboardSortBy } from "@/graphql/typeUtils";
import type {
  ApplicationStatus,
  ReviewDashboardResult,
} from "@/graphql/typeUtils";
import type { ColumnDef } from "@tanstack/react-table";

import { ApplicationCell } from "./ApplicationCell";
import { ReviewerCell } from "./ReviewerCell";
import { ReviewScoreCell } from "./ReviewScoreCell";
import { ReviewStatusCell } from "./ReviewStatusCell";
import { SelectAllHeader, SelectRowCell } from "./SelectionCell";

export const COLUMN_ID_TO_SORT_BY: Record<string, ReviewDashboardSortBy> = {
  application: ReviewDashboardSortBy.LastName,
  choice: ReviewDashboardSortBy.Choice,
  timesApplied: ReviewDashboardSortBy.TimesApplied,
  reviewer1: ReviewDashboardSortBy.Reviewer_1,
  reviewer2: ReviewDashboardSortBy.Reviewer_2,
  totalScore: ReviewDashboardSortBy.TotalScore,
  applicationStatus: ReviewDashboardSortBy.ApplicationStatus,
};

const applicantName = (firstName: string, lastName: string) =>
  `${firstName} ${lastName}`;

const reviewerName = (row: ReviewDashboardResult, index: number) => {
  const reviewer = row.reviewers[index];
  return reviewer ? applicantName(reviewer.firstName, reviewer.lastName) : "-";
};

type ReviewDashboardColumnOptions = {
  /**
   * Persists a status chip selection; owned by the dashboard page.
   * `previousStatus` is the value the chip was rendering, so the page can roll
   * back when the update fails.
   */
  onStatusChange: (
    applicantRecordId: string,
    nextStatus: ApplicationStatus,
    previousStatus: ApplicationStatus,
  ) => void;
};

/**
 * Builds the review dashboard column definitions. This is a factory rather
 * than a constant so the status column can close over the page's status
 * handler.
 */
export const createReviewDashboardColumns = ({
  onStatusChange,
}: ReviewDashboardColumnOptions): ColumnDef<
  ReviewDashboardResult,
  unknown
>[] => [
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
    // Not sortable: the backend ReviewDashboardSortBy enum has no position value.
    enableSorting: false,
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
        onChange={onStatusChange}
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
