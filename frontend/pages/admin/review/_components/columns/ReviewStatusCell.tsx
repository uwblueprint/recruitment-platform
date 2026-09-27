import {
  APPLICATION_STATUS_OPTIONS,
  DashboardStatusChip,
} from "@/components/dashboard/common";
import { ApplicationStatus } from "@/graphql/typeUtils";

import { RejectApplicantDialogue } from "../dialogues/RejectApplicantDialogue";
import useReviewStatusAction from "../hooks/useReviewStatusAction";

type ReviewStatusCellProps = {
  applicantRecordId: string;
  status: ApplicationStatus;
  onChange: (
    applicantRecordId: string,
    nextStatus: ApplicationStatus,
    previousStatus: ApplicationStatus,
  ) => Promise<ApplicationStatus>;
};

/**
 * Controlled status chip for the dashboard table. The dashboard page owns the
 * status and persists it; the action hook handles rejection confirmation and email.
 */
export const ReviewStatusCell = ({
  applicantRecordId,
  status,
  onChange,
}: ReviewStatusCellProps) => {
  const { selectedStatus, handleChange, isSubmitting, dialogue, errorText } =
    useReviewStatusAction({ applicantRecordId, status, onChange });

  return (
    <div role="presentation" onClick={(event) => event.stopPropagation()}>
      <DashboardStatusChip
        value={selectedStatus}
        options={APPLICATION_STATUS_OPTIONS}
        onChange={isSubmitting ? undefined : handleChange}
      />
      {errorText && <p role="alert" className="text-xs text-red-500">{errorText}</p>}
      {dialogue && <RejectApplicantDialogue {...dialogue} />}
    </div>
  );
};
