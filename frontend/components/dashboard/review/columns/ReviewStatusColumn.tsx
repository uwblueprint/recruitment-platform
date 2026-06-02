import { DashboardStatusChip } from "@/components/dashboard/table";
import { ApplicationStatus } from "@/graphql/typeUtils";
import { useState } from "react";

const APPLICATION_STATUS_OPTIONS = [
  { value: ApplicationStatus.Applied, label: "Applied" },
  { value: ApplicationStatus.InReview, label: "In Review" },
  { value: ApplicationStatus.Reviewed, label: "Reviewed" },
  { value: ApplicationStatus.Selected, label: "Selected" },
  { value: ApplicationStatus.Interviewed, label: "Interviewed" },
  { value: ApplicationStatus.Offered, label: "Offered" },
  { value: ApplicationStatus.Rejected, label: "Rejected" },
] as const;

type ReviewStatusCellProps = {
  status: ApplicationStatus;
};

export const ReviewStatusCell = ({ status }: ReviewStatusCellProps) => {
  const [selectedStatus, setSelectedStatus] = useState(status);

  return (
    <DashboardStatusChip
      value={selectedStatus}
      options={APPLICATION_STATUS_OPTIONS}
      onChange={setSelectedStatus}
    />
  );
};
