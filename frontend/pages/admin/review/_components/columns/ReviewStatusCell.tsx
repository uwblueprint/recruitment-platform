import { DashboardStatusChip } from "@/components/dashboard/table";
import { ApplicationStatus } from "@/graphql/typeUtils";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import { useState } from "react";

const APPLICATION_STATUS_OPTIONS = [
  {
    value: ApplicationStatus.Applied,
    label: "Applied",
    className: "bg-neutral-200 text-black",
  },
  {
    value: ApplicationStatus.InReview,
    label: "In Review",
    className: "bg-yellow-200 text-black",
  },
  {
    value: ApplicationStatus.Reviewed,
    label: "Reviewed",
    className: "bg-green-200 text-black",
  },
  {
    value: ApplicationStatus.Selected,
    label: "Selected",
    className: "bg-purple-200 text-black",
  },
] as const;

type ReviewStatusCellProps = {
  applicantRecordId: string;
  status: ApplicationStatus;
};

export const ReviewStatusCell = ({
  applicantRecordId,
  status,
}: ReviewStatusCellProps) => {
  const [selectedStatus, setSelectedStatus] = useState(status);

  const handleChange = async (newStatus: ApplicationStatus) => {
    const previous = selectedStatus;
    setSelectedStatus(newStatus);
    try {
      await ReviewDashboardAPIClient.updateApplicantRecordStatus(
        applicantRecordId,
        newStatus,
      );
      console.log("Status updated:", applicantRecordId, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      setSelectedStatus(previous);
    }
  };

  return (
    <DashboardStatusChip
      value={selectedStatus}
      options={APPLICATION_STATUS_OPTIONS}
      onChange={handleChange}
    />
  );
};
