import { useEffect, useState } from "react";
import InterviewDashboardAPIClient from "@/APIClients/InterviewDashboardAPIClient";
import { Button } from "@/components/common/Button";
import { ApplicationStatus, SkillCategory } from "@/graphql/typeUtils";
import { InterviewNotesTab } from "./InterviewNotesTab";
import useInterviewDashboardSidePanel from "./hooks/useInterviewDashboardSidePanel";

const SIDE_PANEL_TABS = ["Overview", "Interview notes"] as const;
type SidePanelTab = (typeof SIDE_PANEL_TABS)[number];

const SKILL_CATEGORY_LABEL: Record<SkillCategory, string> = {
  [SkillCategory.Junior]: "Junior",
  [SkillCategory.Intermediate]: "Intermediate",
  [SkillCategory.Senior]: "Senior",
};

const APPLICATION_STATUS_BADGE: Partial<
  Record<ApplicationStatus, { label: string; className: string }>
> = {
  [ApplicationStatus.Interviewed]: {
    label: "Interviewed",
    className: "bg-status-interviewed text-black",
  },
  [ApplicationStatus.Selected]: {
    label: "Selected",
    className: "bg-purple-200 text-black",
  },
};

const ExternalLinkIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M7.5625 4.3125H2.875C2.37772 4.3125 1.90081 4.51004 1.54917 4.86167C1.19754 5.21331 1 5.69022 1 6.1875V14.625C1 15.1223 1.19754 15.5992 1.54917 15.9508C1.90081 16.3025 2.37772 16.5 2.875 16.5H11.3125C11.8098 16.5 12.2867 16.3025 12.6383 15.9508C12.99 15.5992 13.1875 15.1223 13.1875 14.625V9.9375M6.625 10.875L16 1.5M16 1.5H11.3125M16 1.5V6.1875"
      stroke="#0573E8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="14"
    height="16"
    viewBox="0 0 14 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M7 1L13 3.4V7.6C13 11.3 10.4 14.5 7 15.4C3.6 14.5 1 11.3 1 7.6V3.4L7 1Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M5 8L7 10L11 6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ScoreRow = ({ label, value }: { label: string; value: number | null }) => (
  <div className="flex items-center justify-between py-2.5">
    <span className="font-poppins text-sm font-semibold text-blue">
      {label}
    </span>
    <span className="font-source text-sm text-neutral-800">{value ?? "-"}</span>
  </div>
);

type InterviewSidePanelContentProps = {
  applicantRecordId: string;
};

export const InterviewSidePanelContent = ({
  applicantRecordId,
}: InterviewSidePanelContentProps) => {
  const [activeTab, setActiveTab] = useState<SidePanelTab>("Overview");
  const { data, isLoading, hasError } = useInterviewDashboardSidePanel(
    applicantRecordId,
  );
  const [isFlagged, setIsFlagged] = useState(false);
  const [isSavingFlag, setIsSavingFlag] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFlagged(data?.isApplicantFlagged ?? false);
    setActiveTab("Overview");
  }, [applicantRecordId, data?.isApplicantFlagged]);

  const handleToggleBookmark = async () => {
    const nextValue = !isFlagged;
    setIsFlagged(nextValue);
    setIsSavingFlag(true);
    try {
      await InterviewDashboardAPIClient.updateApplicantRecordIsApplicantFlagged(
        applicantRecordId,
        nextValue,
      );
    } catch {
      setIsFlagged(!nextValue);
    } finally {
      setIsSavingFlag(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-500">
        Loading applicant details…
      </div>
    );
  }

  if (hasError || !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-alert-errorText">
        Failed to load applicant details.
      </div>
    );
  }

  const statusBadge = APPLICATION_STATUS_BADGE[data.applicationStatus];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ExternalLinkIcon />
          <h3 className="font-poppins text-lg font-semibold text-neutral-800">
            {data.firstName} {data.lastName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {data.skillCategory ? (
            <span className="rounded-full bg-sky-100 px-4 py-1 text-xs font-medium text-black">
              {SKILL_CATEGORY_LABEL[data.skillCategory]}
            </span>
          ) : null}
          {statusBadge ? (
            <span
              className={`rounded-full px-4 py-1 text-xs font-medium ${statusBadge.className}`}
            >
              {statusBadge.label}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 font-source text-sm text-neutral-800">
        <span>
          <span className="font-semibold">Term:</span> {data.term}
        </span>
        <span>
          <span className="font-semibold">Program:</span> {data.program}
        </span>
        <span>
          <span className="font-semibold">Role:</span> {data.position}
        </span>
        <a
          href={data.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-blue underline"
        >
          View Resume
        </a>
      </div>

      <div className="mt-5 flex items-center justify-between border-b border-neutral-200">
        <div className="flex gap-8">
          {SIDE_PANEL_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-poppins text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue text-blue"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleToggleBookmark}
          disabled={isSavingFlag}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-yellow-500 disabled:opacity-50"
        >
          <span className={isFlagged ? "text-yellow-500" : "text-neutral-400"}>
            <ShieldIcon />
          </span>
          Bookmark Applicant
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-5">
        {activeTab === "Overview" ? (
          <div className="flex flex-col">
            <h4 className="font-poppins text-sm font-semibold text-blue">
              Interviewers
            </h4>
            <p className="mt-1 font-source text-sm text-neutral-800">
              {data.interviewers.length > 0
                ? data.interviewers
                    .map((interviewer) => `${interviewer.firstName} ${interviewer.lastName}`)
                    .join(", ")
                : "-"}
            </p>

            <div className="mt-6 divide-y divide-neutral-100">
              <ScoreRow label="Skill" value={data.interview?.skill ?? null} />
              <ScoreRow label="D2L" value={data.interview?.desireToLearn ?? null} />
              <ScoreRow label="PFSG" value={data.interview?.passionFSG ?? null} />
              <ScoreRow
                label="Team Player"
                value={data.interview?.teamPlayer ?? null}
              />
            </div>

            <div className="mt-2 flex justify-end border-t border-neutral-800 pt-3">
              <span className="font-poppins text-sm font-semibold text-blue">
                Total score&nbsp;
                {data.interviewScore ?? "-"}/20
              </span>
            </div>

            <h4 className="mt-6 font-poppins text-sm font-semibold text-blue">
              Comments
            </h4>
            <p className="mt-1 font-source text-sm text-neutral-800">
              {data.interview?.comments || "No comments left."}
            </p>
          </div>
        ) : (
          <InterviewNotesTab interviewNotesId={data.interviewNotesId} />
        )}
      </div>

      {activeTab === "Overview" ? (
        <div className="flex shrink-0 justify-end border-t border-neutral-200 pt-4">
          <Button variant="primary" size="sm" disabled className="!m-0 gap-2">
            <span className="flex items-center gap-2">
              <CheckCircleIcon />
              Shortlist Applicant
            </span>
          </Button>
        </div>
      ) : null}
    </div>
  );
};
