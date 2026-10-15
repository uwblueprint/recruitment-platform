import useUpdateApplicantRecordStatus from "@/APIClients/mutations/useUpdateApplicantRecordStatus";
import { DashboardStatusChip } from "@/components/dashboard/common";
import { ApplicationStatus } from "@/graphql/typeUtils";
import { useState } from "react";

const APPLICATION_STATUS_OPTIONS = [
  {
    value: ApplicationStatus.Interviewed,
    label: "Interviewed",
    className: "bg-status-interviewed text-black",
  },
  {
    value: ApplicationStatus.Selected,
    label: "Selected",
    className: "bg-purple-200 text-black",
  },
  {
    value: ApplicationStatus.Offered,
    label: "Offer",
    className: "bg-green-200 text-black",
  },
] as const;

type InterviewStatusCellProps = {
  applicantRecordId: string;
  status: ApplicationStatus;
};

export const InterviewStatusCell = ({
  applicantRecordId,
  status,
}: InterviewStatusCellProps) => {
  const { updateApplicantRecordStatus, loading } =
    useUpdateApplicantRecordStatus();
  const [savedStatus, setSavedStatus] = useState<ApplicationStatus>();
  const [errorText, setErrorText] = useState<string>();
  const selectedStatus = savedStatus ?? status;

  const handleChange = async (nextStatus: ApplicationStatus) => {
    if (nextStatus === selectedStatus) return;

    setErrorText(undefined);
    try {
      const confirmedStatus = await updateApplicantRecordStatus(
        applicantRecordId,
        nextStatus,
      );
      setSavedStatus(confirmedStatus);
    } catch {
      setErrorText("The status could not be updated. Please try again.");
    }
  };

  return (
    <div role="presentation" onClick={(event) => event.stopPropagation()}>
      <DashboardStatusChip
        value={selectedStatus}
        options={APPLICATION_STATUS_OPTIONS}
        onChange={(nextStatus) => void handleChange(nextStatus)}
        disabled={loading}
      />
      {errorText ? (
        <p role="alert" className="text-xs text-red-500">
          {errorText}
        </p>
      ) : null}
    </div>
  );
};
