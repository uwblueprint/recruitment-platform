import {
  DashboardSidePanel,
  type SidePanelNavigation,
} from "@/components/dashboard/side-panel";
import { ReviewScoreColumn } from "./ReviewScoreColumn";
import type {
  ApplicationStatus,
  ReviewDashboardResult,
} from "@/graphql/typeUtils";
import useReviewDashboardSidePanel from "@/APIClients/useReviewDashboardSidePanel";

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
  const {
    data: details,
    loading: isLoading,
    error,
  } = useReviewDashboardSidePanel(applicantRecordId);
  return (
    <DashboardSidePanel
      open={applicantRecordId !== undefined}
      onClose={onClose}
      row={row}
      details={details}
      onStatusChange={onStatusChange}
      isLoading={isLoading}
      hasError={!!error}
      navigation={navigation}
    >
      {details ? (
        <div className="flex flex-col gap-10 md:flex-row">
          {[0, 1].map((index) => (
            <ReviewScoreColumn
              key={index}
              index={index}
              detail={details.reviewDetails[index]}
            />
          ))}
        </div>
      ) : null}
    </DashboardSidePanel>
  );
};
