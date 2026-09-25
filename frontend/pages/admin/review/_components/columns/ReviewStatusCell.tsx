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
};

export const ReviewStatusCell = ({
  applicantRecordId,
  status,
}: ReviewStatusCellProps) => {
  const { selectedStatus, handleChange, isSubmitting, dialogue, errorText } =
    useReviewStatusAction({ applicantRecordId, status });

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
