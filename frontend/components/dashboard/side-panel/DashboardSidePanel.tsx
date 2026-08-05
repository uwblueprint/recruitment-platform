import BookmarkBorderOutlined from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlined from "@mui/icons-material/BookmarkOutlined";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeft from "@mui/icons-material/KeyboardDoubleArrowLeft";
import OpenInNew from "@mui/icons-material/OpenInNew";
import Drawer from "@mui/material/Drawer";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import type {
  ReviewDashboardResult,
  ReviewDashboardSidePanelResult,
} from "@/graphql/typeUtils";

import {
  APPLICATION_STATUS_OPTIONS,
  DashboardStatusChip,
  SKILL_CATEGORY_OPTIONS,
} from "../common";
import { SidePanelReviewerColumn } from "./SidePanelReviewerColumn";

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

type DashboardSidePanelProps = {
  open: boolean;
  onClose: () => void;
  /** Row that was clicked; drives the always-available header summary. */
  row?: ReviewDashboardResult;
  /** Expanded details fetched for the active applicant. */
  details?: ReviewDashboardSidePanelResult;
  isLoading?: boolean;
  navigation?: SidePanelNavigation;
};

/** Props for sections that only render once an active row exists. */
type ActiveApplicantProps = {
  row: ReviewDashboardResult;
  details?: ReviewDashboardSidePanelResult;
};

export const DashboardSidePanel = ({
  open,
  onClose,
  row,
  details,
  isLoading = false,
  navigation,
}: DashboardSidePanelProps) => (
  <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    PaperProps={{ className: "w-full max-w-[920px]" }}
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
          <SidePanelApplicantBar row={row} details={details} />
          <SidePanelInfoRow row={row} details={details} />

          {details ? (
            <div className="flex flex-col gap-10 border-b border-neutral-200 pb-4 md:flex-row">
              <SidePanelReviewerColumn
                index={0}
                detail={details.reviewDetails[0]}
              />
              <SidePanelReviewerColumn
                index={1}
                detail={details.reviewDetails[1]}
              />
            </div>
          ) : isLoading ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              Loading…
            </p>
          ) : null}
        </div>
      ) : null}

      <footer className="flex shrink-0 justify-end px-8 py-5">
        <Button size="sm" className="flex items-center gap-2">
          <CheckCircleOutline sx={{ fontSize: 19 }} />
          Shortlist Applicant
        </Button>
      </footer>
    </aside>
  </Drawer>
);

const SidePanelApplicantBar = ({ row, details }: ActiveApplicantProps) => {
  const applicantName = `${row.firstName} ${row.lastName}`;
  const { totalScore } = row;

  // Visual-only status control. Selecting a value updates the chip locally;
  // persisting to the backend is handled in a future ticket. The container is
  // keyed by applicant record id, so this state resets per applicant.
  const [selectedStatus, setSelectedStatus] = useState(row.applicationStatus);

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex min-w-0 items-center gap-2">
        <OpenInNew className="text-blue" sx={{ fontSize: 18 }} />
        <h2 className="truncate font-source text-lg font-bold text-blue-900">
          {applicantName}
        </h2>
        {totalScore !== null ? (
          <span className="whitespace-nowrap font-poppins font-medium text-green-700">
            {totalScore}/{MAX_TOTAL_SCORE}
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
        <DashboardStatusChip
          value={selectedStatus}
          options={APPLICATION_STATUS_OPTIONS}
          onChange={setSelectedStatus}
        />
      </div>

      <BookmarkButton />
    </div>
  );
};

const SidePanelInfoRow = ({ row, details }: ActiveApplicantProps) => {
  // "Term" in the UI is the academic term (e.g. 2A, 2B), not the recruitment
  // cycle stored in `applicant.term`.
  const term = details?.academicYear ?? EMPTY_VALUE;
  const program = details?.program ?? EMPTY_VALUE;
  const role = details?.position ?? row.position;
  const resumeUrl = details?.resumeUrl;

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-neutral-200 pb-2 text-sm">
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
const BookmarkButton = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

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
