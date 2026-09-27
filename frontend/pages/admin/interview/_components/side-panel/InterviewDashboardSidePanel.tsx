import {
  DashboardSidePanel,
  type SidePanelNavigation,
} from "@/components/dashboard/side-panel";
import useInterviewDashboardSidePanel from "@/components/dashboard/side-panel/hooks/useInterviewDashboardSidePanel";
import { useId, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import type {
  InterviewDashboardResult,
  InterviewDashboardSidePanelResult,
} from "@/graphql/typeUtils";
import { InterviewNotesTab } from "@/components/dashboard/side-panel/InterviewNotesTab";
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
      <Tabs
        value={activeTab}
        onChange={(_, tab: (typeof TABS)[number]) => setActiveTab(tab)}
        aria-label="Interview details"
        selectionFollowsFocus
        sx={{
          minHeight: 44,
          borderBottom: "1px solid #808080",
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTab-root": {
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
            "&.Mui-selected": { backgroundColor: "#EBEBEB", color: "#000000" },
            "&.Mui-focusVisible": {
              outline: "2px solid #0573E8",
              outlineOffset: -3,
            },
          },
        }}
      >
        {TABS.map((tab, index) => (
          <Tab
            key={tab}
            value={tab}
            label={tab}
            id={`${tabsId}-tab-${index}`}
            aria-controls={`${tabsId}-panel`}
          />
        ))}
      </Tabs>
      <div
        role="tabpanel"
        id={`${tabsId}-panel`}
        aria-labelledby={`${tabsId}-tab-${TABS.indexOf(activeTab)}`}
        tabIndex={0}
      >
        {activeTab === "Overview" ? (
          <InterviewScoreColumn details={details} />
        ) : (
          <div className="h-[500px]">
            <InterviewNotesTab interviewNotesId={details.interviewNotesId} />
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
      width={600}
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
