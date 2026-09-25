import {
  APPLICATION_STATUS_OPTIONS,
  DashboardStatusChip,
} from "@/components/dashboard/common";
import { ApplicationStatus } from "@/graphql/typeUtils";
import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import { useState } from "react";

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
    setSelectedStatus(newStatus);
    try {
      const confirmedStatus = await ReviewDashboardAPIClient.updateApplicantRecordStatus(
        applicantRecordId,
        newStatus,
      );
      setSelectedStatus(confirmedStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
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
