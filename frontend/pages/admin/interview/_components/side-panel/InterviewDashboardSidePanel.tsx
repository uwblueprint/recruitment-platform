import {
  DashboardSidePanel,
  type SidePanelNavigation,
} from "@/components/dashboard/side-panel";
import useInterviewDashboardSidePanel from "@/components/dashboard/side-panel/hooks/useInterviewDashboardSidePanel";
import { useId, useState } from "react";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab, { tabClasses } from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import { buttonBaseClasses } from "@mui/material/ButtonBase";
import type {
  InterviewDashboardResult,
  InterviewDashboardSidePanelResult,
} from "@/graphql/typeUtils";
import { InterviewNotesTab } from "@/pages/admin/interview/_components/side-panel/InterviewNotesTab";
import { InterviewScoreColumn } from "./InterviewScoreColumn";

const TABS = ["Overview", "Interview notes"] as const;

const InterviewSidePanelContent = ({
  details,
}: {
  details: InterviewDashboardSidePanelResult;
}) => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Overview");
  const tabsId = useId();
  return (
    <div className="flex flex-col gap-5">
      <InterviewTabs
        value={activeTab}
        onChange={(_, tab: (typeof TABS)[number]) => setActiveTab(tab)}
        aria-label="Interview details"
        selectionFollowsFocus
      >
        {TABS.map((tab, index) => (
          <InterviewTab
            key={tab}
            value={tab}
            label={tab}
            id={`${tabsId}-tab-${index}`}
            aria-controls={`${tabsId}-panel`}
          />
        ))}
      </InterviewTabs>
      <div
        role="tabpanel"
        id={`${tabsId}-panel`}
        aria-labelledby={`${tabsId}-tab-${TABS.indexOf(activeTab)}`}
        tabIndex={0}
      >
        {activeTab === "Overview" ? (
          <InterviewScoreColumn details={details} />
        ) : (
          <div className="h-[700px]">
            <InterviewNotesTab
              interviewedApplicantRecordId={
                details.interviewedApplicantRecordId
              }
            />
          </div>
        )}
      </div>
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
      showDetailsDivider={false}
      open={!!row}
      onClose={onClose}
      row={row ? { ...row, totalScore: row.interviewScore } : undefined}
      details={details ? { ...details, academicYear: details.term } : undefined}
      maxScore={20}
      isLoading={isLoading}
      hasError={hasError}
      navigation={navigation}
      showScoreOnHeader={false}
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

const InterviewTabs = styled(Tabs)({
  minHeight: 44,
  borderBottom: "1px solid #808080",
  [`& .${tabsClasses.indicator}`]: { display: "none" },
});

const InterviewTab = styled(Tab)({
  minHeight: 44,
  minWidth: 0,
  padding: "12px 24px",
  borderRadius: "24px 24px 0 0",
  backgroundColor: "#F7F7F7",
  color: "#999999",
  fontFamily: "inherit",
  fontSize: 14,
  fontWeight: 600,
  lineHeight: "20px",
  textTransform: "none",
  [`&.${tabClasses.selected}`]: {
    backgroundColor: "#EBEBEB",
    color: "#000000",
  },
  [`&.${buttonBaseClasses.focusVisible}`]: {
    outline: "2px solid #0573E8",
    outlineOffset: -3,
  },
});
