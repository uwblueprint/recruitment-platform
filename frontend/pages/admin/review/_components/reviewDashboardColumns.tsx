import { ApplicationStatus } from "@/graphql/typeUtils";
import type { ReviewDashboardResult } from "@/graphql/typeUtils";
import {
  DashboardStatusChip,
  DashboardTableCheckbox,
  defaultFormatLabel,
} from "@/components/dashboard/table";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

const columnHelper = createColumnHelper<ReviewDashboardResult>();

const APPLICATION_STATUS_OPTIONS = [
  ApplicationStatus.Applied,
  ApplicationStatus.InReview,
  ApplicationStatus.Reviewed,
  ApplicationStatus.Selected,
  ApplicationStatus.Interviewed,
  ApplicationStatus.Offered,
  ApplicationStatus.Rejected,
] as const;

const reviewerName = (row: ReviewDashboardResult, index: number) => {
  const reviewer = row.reviewers[index];
  if (!reviewer) {
    return "-";
  }
  return `${reviewer.firstName} ${reviewer.lastName}`;
};

export const getReviewDashboardColumns = (): ColumnDef<
  ReviewDashboardResult,
  unknown
>[] =>
  [
  columnHelper.display({
    id: "select",
    size: 40,
    header: ({ table }) => (
      <DashboardTableCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <DashboardTableCheckbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
        aria-label={`Select ${row.original.firstName} ${row.original.lastName}`}
      />
    ),
  }),
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: "application",
    header: "Application",
    cell: ({ getValue }) => (
      <span className="border-b border-neutral-800 text-neutral-800">
        {getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("position", {
    header: "Role",
  }),
  columnHelper.accessor("choice", {
    header: "Choice",
  }),
  columnHelper.accessor("timesApplied", {
    header: "Times Applied",
  }),
  columnHelper.display({
    id: "reviewer1",
    header: "Reviewer 1",
    cell: ({ row }) => (
      <span className="border-b border-neutral-800">
        {reviewerName(row.original, 0)}
      </span>
    ),
  }),
  columnHelper.display({
    id: "reviewer2",
    header: "Reviewer 2",
    cell: ({ row }) => (
      <span className="border-b border-neutral-800">
        {reviewerName(row.original, 1)}
      </span>
    ),
  }),
  columnHelper.accessor("totalScore", {
    header: "Review Score",
    cell: ({ getValue }) => {
      const score = getValue();
      return (
        <span className="text-green-700">
          {typeof score === "number" ? `${score}/40` : "-"}
        </span>
      );
    },
  }),
  columnHelper.accessor("applicationStatus", {
    header: "Status",
    cell: ({ getValue }) => <ReviewStatusCell status={getValue()} />,
  }),
  columnHelper.display({
    id: "open",
    size: 32,
    header: "",
    cell: () => <span className="text-lg text-neutral-200">›</span>,
  }),
  ] as unknown as ColumnDef<ReviewDashboardResult, unknown>[];

type ReviewStatusCellProps = {
  status: ApplicationStatus;
};

const ReviewStatusCell = ({ status }: ReviewStatusCellProps) => {
  const [selectedStatus, setSelectedStatus] = useState(status);

  return (
    <DashboardStatusChip
      value={selectedStatus}
      options={APPLICATION_STATUS_OPTIONS}
      formatLabel={defaultFormatLabel}
      onChange={setSelectedStatus}
    />
  );
};
