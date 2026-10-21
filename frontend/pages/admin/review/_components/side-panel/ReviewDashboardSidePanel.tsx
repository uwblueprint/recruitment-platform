import {
  DashboardSidePanel,
  type SidePanelNavigation,
} from "@/components/dashboard/side-panel";
import { ReviewScoreColumn } from "./ReviewScoreColumn";
import type {
  ApplicationStatus,
  ReviewDashboardResult,
} from "@/graphql/typeUtils";
import useReviewDashboardSidePanel from "@/APIClients/queries/useReviewDashboardSidePanel";
import useUpdateApplicantRecordShortlistedForInterview from "@/APIClients/mutations/useUpdateApplicantRecordShortlistedForInterview";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { Button } from "@/components/common/Button";

type ShortlistApplicantButtonProps = {
  isShortlisted: boolean;
  disabled?: boolean;
  onClick: () => void;
};

const ShortlistApplicantButton = ({
  isShortlisted,
  disabled,
  onClick,
}: ShortlistApplicantButtonProps) => {
  return (
    <Button
      size="sm"
      className="flex items-center gap-2"
      disabled={disabled}
      onClick={onClick}
    >
      {isShortlisted ? (
        <>
          <HighlightOffOutlinedIcon sx={{ fontSize: 19 }} />
          Unshortlist Applicant for Interview
        </>
      ) : (
        <>
          <CheckCircleOutline sx={{ fontSize: 19 }} />
          Shortlist Applicant for Interview
        </>
      )}
    </Button>
  );
};

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
  const {
    updateShortlistedForInterview,
    loading: isShortlistUpdating,
  } = useUpdateApplicantRecordShortlistedForInterview();

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
      action={
        details ? (
          <ShortlistApplicantButton
            isShortlisted={details.shortlistedForInterview}
            disabled={isShortlistUpdating}
            onClick={() => {
              if (!applicantRecordId) return;
              updateShortlistedForInterview(
                applicantRecordId,
                !details.shortlistedForInterview
              );
            }}
          />
        ) : null
      }
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
