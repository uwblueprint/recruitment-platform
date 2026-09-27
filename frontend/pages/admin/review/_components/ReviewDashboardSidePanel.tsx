import {
  DashboardSidePanel,
  type SidePanelNavigation,
} from "@/components/dashboard/side-panel";
import { SidePanelScoreColumn } from "@/components/dashboard/side-panel/SidePanelScoreColumn";
import type {
  ApplicationStatus,
  ReviewDashboardResult,
} from "@/graphql/typeUtils";
import useReviewDashboardSidePanel from "./hooks/useReviewDashboardSidePanel";

type ReviewDashboardSidePanelProps = {
  applicantRecordId?: string;
  row?: ReviewDashboardResult;
  onClose: () => void;
  navigation?: SidePanelNavigation;
  onStatusChange: (
    applicantRecordId: string,
    nextStatus: ApplicationStatus,
    previousStatus: ApplicationStatus
  ) => Promise<ApplicationStatus>;
};

export const ReviewDashboardSidePanel = ({
  applicantRecordId,
  row,
  onClose,
  navigation,
  onStatusChange,
}: ReviewDashboardSidePanelProps) => {
  const { details, isLoading, error } =
    useReviewDashboardSidePanel(applicantRecordId);
  return (
    <DashboardSidePanel
      open={applicantRecordId !== undefined}
      onClose={onClose}
      row={row}
      details={details}
      onStatusChange={onStatusChange}
      isLoading={isLoading}
      hasError={error}
      navigation={navigation}
    >
      {details ? (
        <div className="flex flex-col gap-10 md:flex-row">
          {[0, 1].map((index) => {
            const detail = details.reviewDetails[index];
            return (
              <SidePanelScoreColumn
                key={index}
                label={`Reviewer ${index + 1}`}
                name={
                  detail?.reviewer
                    ? `${detail.reviewer.firstName} ${detail.reviewer.lastName}`
                    : "-"
                }
                scores={detail?.review}
                skillCategory={detail?.review?.skillCategory}
                showSkillCategory
                commentsLabel="Reviewer Comments"
              />
            );
          })}
        </div>
      ) : null}
    </DashboardSidePanel>
  );
};
