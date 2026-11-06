import { InterviewConflict, InterviewDashboardSortBy } from "@/graphql/typeUtils";
import type { InterviewDashboardResult } from "@/graphql/typeUtils";
import { ReviewerCell } from "@/pages/admin/review/_components/columns/ReviewerCell";
import type { ColumnDef } from "@tanstack/react-table";

import { ApplicationCell } from "@/components/dashboard/table/cell/ApplicationCell";

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

type DashboardInterviewer = InterviewDashboardResult["interviewers"][number];

const interviewerName = (row: InterviewDashboardResult, index: number) => {
  const interviewer = row.interviewers[index]?.userInfo;
  return interviewer
    ? fullName(interviewer.firstName, interviewer.lastName)
    : null;
};

const applicantDidNotRespond = (row: InterviewDashboardResult) =>
  row.interviewers.some(
    (interviewer) =>
      interviewer.interviewHasConflict === InterviewConflict.ApplicantNoResponse,
  );

const interviewerHasOwnConflictIcon = (
  interviewer: DashboardInterviewer | undefined,
) => {
  const conflict = interviewer?.interviewHasConflict;
  return (
    conflict === InterviewConflict.ApplicantConflict ||
    conflict === InterviewConflict.CannotAttend
  );
};

const wasReportedAsUnresponsivePartner = (
  row: InterviewDashboardResult,
  interviewer: DashboardInterviewer,
) =>
  row.interviewers.some(
    (other) =>
      other.userInfo.id !== interviewer.userInfo.id &&
      other.interviewHasConflict === InterviewConflict.PartnerNoResponse,
  );

type InterviewDashboardColumnOptions = {
  onApplicantClick: (row: InterviewDashboardResult) => void;
  onInterviewerClick: (
    row: InterviewDashboardResult,
    interviewer: DashboardInterviewer,
  ) => void;
};

const InterviewerNameCell = ({
  row,
  index,
  onInterviewerClick,
}: {
  row: InterviewDashboardResult;
  index: number;
  onInterviewerClick: InterviewDashboardColumnOptions["onInterviewerClick"];
}) => {
  const interviewer = row.interviewers[index];
  const name = interviewerName(row, index);

  return (
    <ReviewerCell
      reviewerName={name ?? "-"}
      reviewerHasConflict={
        interviewerHasOwnConflictIcon(interviewer) ||
        (interviewer != null &&
          wasReportedAsUnresponsivePartner(row, interviewer))
      }
      onClick={
        interviewer
          ? () => onInterviewerClick(row, interviewer)
          : undefined
      }
    />
  );
};

export const createInterviewDashboardColumns = ({
  onApplicantClick,
  onInterviewerClick,
}: InterviewDashboardColumnOptions): ColumnDef<
  InterviewDashboardResult,
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
    accessorFn: (row) => fullName(row.firstName, row.lastName),
    header: "Application",
    enableSorting: true,
    cell: ({ row }) => (
      <ApplicationCell
        applicantName={fullName(row.original.firstName, row.original.lastName)}
        isBookmarked={row.original.isApplicantFlagged}
        hasConflict={applicantDidNotRespond(row.original)}
        onClick={
          applicantDidNotRespond(row.original)
            ? () => onApplicantClick(row.original)
            : undefined
        }
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
    id: "applicationStatus",
    accessorFn: (row) => row.applicationStatus,
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => (
      <InterviewStatusCell
        applicantRecordId={row.original.applicantRecordId}
        status={row.original.applicationStatus}
      />
    ),
  },
  {
    id: "interviewer1",
    accessorFn: (row) => interviewerName(row, 0) ?? "-",
    header: "Interviewer 1",
    enableSorting: true,
    cell: ({ row }) => (
      <InterviewerNameCell
        row={row.original}
        index={0}
        onInterviewerClick={onInterviewerClick}
      />
    ),
  },
  {
    id: "interviewer2",
    accessorFn: (row) => interviewerName(row, 1) ?? "-",
    header: "Interviewer 2",
    enableSorting: true,
    cell: ({ row }) => (
      <InterviewerNameCell
        row={row.original}
        index={1}
        onInterviewerClick={onInterviewerClick}
      />
    ),
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
