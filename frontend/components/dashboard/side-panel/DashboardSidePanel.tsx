import BookmarkBorderOutlined from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlined from "@mui/icons-material/BookmarkOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeft from "@mui/icons-material/KeyboardDoubleArrowLeft";
import OpenInNew from "@mui/icons-material/OpenInNew";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";
import { ReactNode, useState } from "react";

import { ReviewStatusCell } from "@/pages/admin/review/_components/columns/ReviewStatusCell";

import type {
  ApplicationStatus,
  ReviewDashboardResult,
  ReviewDashboardSidePanelResult,
} from "@/graphql/typeUtils";

import {
  APPLICATION_STATUS_OPTIONS,
  DashboardStatusChip,
  SKILL_CATEGORY_OPTIONS,
} from "../common";
import { AdminCommentsSection } from "./admin-comments";

/** Maximum combined review score: 4 criteria × 5 points × 2 reviewers. */
const MAX_TOTAL_SCORE = 40;

const EMPTY_VALUE = "-";

export type SidePanelNavigation = {
  /** 1-based position of the active applicant in the current display order. */
  current: number;
  total: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

type ApplicantRow = Pick<
  ReviewDashboardResult,
  | "applicantRecordId"
  | "firstName"
  | "lastName"
  | "position"
  | "applicationStatus"
  | "totalScore"
  | "isApplicantFlagged"
>;
type ApplicantDetails = Pick<
  ReviewDashboardSidePanelResult,
  "academicYear" | "program" | "position" | "resumeUrl" | "skillCategory"
>;

type DashboardSidePanelProps = {
  open: boolean;
  onClose: () => void;
  row?: ApplicantRow;
  details?: ApplicantDetails;
  children?: ReactNode;
  isLoading?: boolean;
  hasError?: boolean;
  navigation?: SidePanelNavigation;
  maxScore?: number;
  width?: number;
  showDetailsDivider?: boolean;
  showScoreOnHeader?: boolean;
  onStatusChange?: (
    applicantRecordId: string,
    nextStatus: ApplicationStatus,
    previousStatus: ApplicationStatus
  ) => Promise<ApplicationStatus>;
  applicantAction?: ReactNode;
};

/** Props for sections that only render once an active row exists. */
type ActiveApplicantProps = {
  row: ApplicantRow;
  details?: ApplicantDetails;
};

export const DashboardSidePanel = (props: DashboardSidePanelProps) => {
  const {
    open,
    onClose,
    row,
    details,
    children,
    isLoading = false,
    hasError = false,
    navigation,
    onStatusChange,
    maxScore = MAX_TOTAL_SCORE,
    width = 913,
    showDetailsDivider = true,
    showScoreOnHeader = true,
    applicantAction,
  } = props;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width, maxWidth: "100%" } }}
    >
      <aside className="flex h-full flex-col bg-white font-source text-neutral-800">
        <header className="flex shrink-0 items-center justify-between px-8 pb-2 pt-6">
          <button
            aria-label="Close side panel"
            className="flex h-8 w-8 items-center justify-center rounded text-neutral-500 hover:bg-surface-muted"
            onClick={onClose}
            type="button"
          >
            <KeyboardDoubleArrowLeft sx={{ fontSize: 22 }} />
          </button>

          {navigation ? (
            <div className="flex items-center gap-3 text-sm text-neutral-500">
              <button
                aria-label="Previous applicant"
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                onClick={navigation.onPrev}
                disabled={!navigation.canPrev}
                type="button"
              >
                <KeyboardArrowLeft sx={{ fontSize: 20 }} />
              </button>
              <span className="tabular-nums">
                {navigation.current}/{navigation.total}
              </span>
              <button
                aria-label="Next applicant"
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                onClick={navigation.onNext}
                disabled={!navigation.canNext}
                type="button"
              >
                <KeyboardArrowRight sx={{ fontSize: 20 }} />
              </button>
            </div>
          ) : null}
        </header>

        {row ? (
          <div
            key={row.applicantRecordId}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-8 pb-8"
          >
            <SidePanelApplicantBar
              row={row}
              details={details}
              onStatusChange={onStatusChange}
              maxScore={maxScore}
              showScore={showScoreOnHeader}
            />
            <SidePanelInfoRow
              row={row}
              details={details}
              showDivider={showDetailsDivider}
            />

            {isLoading ? (
              <p className="py-8 text-center text-sm text-neutral-500">
                Loading applicant details…
              </p>
            ) : hasError ? (
              <p className="py-8 text-center text-sm text-alert-errorText">
                Failed to load applicant details.
              </p>
            ) : (
              <div className="border-b border-neutral-200 pb-4">{children}</div>
            )}

            <AdminCommentsSection applicantRecordId={row.applicantRecordId} />
          </div>
        ) : null}

        {row && applicantAction ? (
          <footer className="flex shrink-0 justify-end px-8 py-5">
            {applicantAction}
          </footer>
        ) : null}
      </aside>
    </Drawer>
  );
};

type SidePanelApplicantBarProps = ActiveApplicantProps & {
  onStatusChange?: DashboardSidePanelProps["onStatusChange"];
  maxScore: number;
  showScore?: boolean;
};

const SidePanelApplicantBar = ({
  row,
  details,
  onStatusChange,
  maxScore,
  showScore = true,
}: SidePanelApplicantBarProps) => {
  const applicantName = `${row.firstName} ${row.lastName}`;
  const { totalScore } = row;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex min-w-0 items-center gap-2">
        <OpenInNew className="text-blue" sx={{ fontSize: 18 }} />
        <h2 className="truncate font-source text-lg font-bold text-blue-900">
          {applicantName}
        </h2>
        {totalScore !== null && showScore ? (
          <span className="whitespace-nowrap font-poppins font-medium text-green-700">
            {totalScore}/{maxScore}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2.5">
        {details?.skillCategory ? (
          // Read-only: no onChange, so selecting an option is a no-op.
          <DashboardStatusChip
            value={details.skillCategory}
            options={SKILL_CATEGORY_OPTIONS}
          />
        ) : null}
        {onStatusChange ? (
          <ReviewStatusCell
            applicantRecordId={row.applicantRecordId}
            status={row.applicationStatus}
            onChange={onStatusChange}
          />
        ) : (
          <DashboardStatusChip
            value={row.applicationStatus}
            options={APPLICATION_STATUS_OPTIONS}
          />
        )}
      </div>
      <BookmarkButton key={row.applicantRecordId} isApplicantFlagged={row.isApplicantFlagged} />
    </div>
  );
};

const SidePanelInfoRow = ({
  row,
  details,
  showDivider,
}: ActiveApplicantProps & { showDivider: boolean }) => {
  // "Term" in the UI is the academic term (e.g. 2A, 2B), not the recruitment
  // cycle stored in `applicant.term`.
  const term = details?.academicYear ?? EMPTY_VALUE;
  const program = details?.program ?? EMPTY_VALUE;
  const role = details?.position ?? row.position;
  const resumeUrl = details?.resumeUrl;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-8 gap-y-2 pb-2 text-sm ${
        showDivider ? "border-b border-neutral-200" : ""
      }`}
    >
      <InfoField label="Term" value={term} />
      <InfoField label="Program" value={program} />
      <InfoField label="Role" value={role} />
      {resumeUrl ? (
        <a
          className="flex items-center gap-1 text-neutral-800 underline hover:text-blue"
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
        >
          <DescriptionOutlined className="text-blue" sx={{ fontSize: 18 }} />
          View Resume
        </a>
      ) : null}
      <Link
        className="flex items-center gap-1 text-neutral-800 underline hover:text-blue"
        href={`/review/${row.applicantRecordId}/view`}
      >
        <OpenInNew className="text-blue" sx={{ fontSize: 16 }} />
        View Application
      </Link>
    </div>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-2">
    <span className="font-semibold text-blue-900">{label}</span>
    <span>{value}</span>
  </div>
);

/**
 * Visual-only bookmark toggle. Persisting the bookmark is handled in a future
 * ticket.
 */
const BookmarkButton = ({ isApplicantFlagged }: { isApplicantFlagged: boolean }) => {
  const [isBookmarked, setIsBookmarked] = useState(isApplicantFlagged);

  return (
    <button
      className="ml-auto flex items-center gap-2 rounded-[20px] px-4 py-2 text-[#936A00] hover:bg-orange-50"
      onClick={() => setIsBookmarked((prev) => !prev)}
      aria-pressed={isBookmarked}
      type="button"
    >
      {isBookmarked ? (
        <BookmarkOutlined sx={{ fontSize: 19 }} />
      ) : (
        <BookmarkBorderOutlined sx={{ fontSize: 19 }} />
      )}
      Bookmark Applicant
    </button>
  );
};
