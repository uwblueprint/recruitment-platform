import { InterviewDashboardSortBy } from "@/graphql/typeUtils";
import type { InterviewDashboardResult } from "@/graphql/typeUtils";
import type { ColumnDef } from "@tanstack/react-table";

import { InterviewStatusCell } from "./InterviewStatusCell";
import { SelectAllHeader, SelectRowCell } from "./SelectionCell";

export const COLUMN_ID_TO_SORT_BY: Record<string, InterviewDashboardSortBy> = {
  application: InterviewDashboardSortBy.LastName,
  position: InterviewDashboardSortBy.Position,
  applicationStatus: InterviewDashboardSortBy.ApplicationStatus,
  interviewer1: InterviewDashboardSortBy.Interviewer_1,
  interviewer2: InterviewDashboardSortBy.Interviewer_2,
  interviewScore: InterviewDashboardSortBy.InterviewScore,
};

const fullName = (firstName: string, lastName: string) =>
  `${firstName} ${lastName}`;

const interviewerName = (row: InterviewDashboardResult, index: number) => {
  const interviewer = row.interviewers[index];
  return interviewer
    ? fullName(interviewer.firstName, interviewer.lastName)
    : null;
};

const InterviewerCell = ({
  row,
  index,
}: {
  row: InterviewDashboardResult;
  index: number;
}) => {
  const name = interviewerName(row, index);

  return name ? (
    <span className="border-b border-neutral-800">{name}</span>
  ) : (
    "-"
  );
};

export const INTERVIEW_DASHBOARD_COLUMNS: ColumnDef<
  InterviewDashboardResult,
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
    accessorFn: (row) => fullName(row.firstName, row.lastName),
    header: "Application",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="border-b border-neutral-800 text-neutral-800">
        {fullName(row.original.firstName, row.original.lastName)}
      </span>
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
    id: "applicationStatus",
    accessorFn: (row) => row.applicationStatus,
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => (
      <InterviewStatusCell status={row.original.applicationStatus} />
    ),
  },
  {
    id: "interviewer1",
    accessorFn: (row) => interviewerName(row, 0) ?? "-",
    header: "Interviewer 1",
    enableSorting: true,
    cell: ({ row }) => <InterviewerCell row={row.original} index={0} />,
  },
  {
    id: "interviewer2",
    accessorFn: (row) => interviewerName(row, 1) ?? "-",
    header: "Interviewer 2",
    enableSorting: true,
    cell: ({ row }) => <InterviewerCell row={row.original} index={1} />,
  },
  {
    id: "interviewScore",
    accessorFn: (row) => row.interviewScore,
    header: "Interview Score",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.interviewScore === null
        ? "-/20"
        : `${row.original.interviewScore}/20`,
  },
  {
    id: "open",
    size: 32,
    header: "",
    cell: () => <span className="text-lg text-neutral-200">›</span>,
  },
];
