import {
  DashboardSidePanel,
  type SidePanelNavigation,
} from "@/components/dashboard/side-panel";
import useInterviewDashboardSidePanel from "@/components/dashboard/side-panel/hooks/useInterviewDashboardSidePanel";
import { useState } from "react";
import Tabs from "@/components/common/Tabs";
import type {
  InterviewDashboardResult,
  InterviewDashboardSidePanelResult,
} from "@/graphql/typeUtils";
import { InterviewNotesTab } from "@/components/dashboard/side-panel/InterviewNotesTab";
import { SidePanelScoreColumn } from "@/components/dashboard/side-panel/SidePanelScoreColumn";

const TABS = ["Overview", "Interview notes"] as const;

const InterviewSidePanelContent = ({
  details,
}: {
  details: InterviewDashboardSidePanelResult;
}) => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Overview");
  return (
    <div className="flex flex-col gap-5">
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === "Overview" ? (
        <SidePanelScoreColumn
          label="Interviewers"
          name={
            details.interviewers
              .map(({ firstName, lastName }) => `${firstName} ${lastName}`)
              .join(", ") || "-"
          }
          scores={details.interview}
          commentsLabel="Interviewer Comments"
        />
      ) : (
        <div className="h-[500px]">
          <InterviewNotesTab interviewNotesId={details.interviewNotesId} />
        </div>
      )}
    </div>
  );
};

type InterviewDashboardSidePanelProps = {
  row?: InterviewDashboardResult;
  onClose: () => void;
  navigation?: SidePanelNavigation;
};

export const InterviewDashboardSidePanel = ({
  row,
  onClose,
  navigation,
}: InterviewDashboardSidePanelProps) => {
  const {
    data: details,
    isLoading,
    hasError,
  } = useInterviewDashboardSidePanel(row?.applicantRecordId ?? null);
  return (
    <DashboardSidePanel
      open={!!row}
      onClose={onClose}
      row={row ? { ...row, totalScore: row.interviewScore } : undefined}
      details={details ? { ...details, academicYear: details.term } : undefined}
      maxScore={20}
      isLoading={isLoading}
      hasError={hasError}
      navigation={navigation}
    >
      {details && row ? (
        <InterviewSidePanelContent
          key={row.applicantRecordId}
          details={details}
        />
      ) : null}
    </DashboardSidePanel>
  );
};
