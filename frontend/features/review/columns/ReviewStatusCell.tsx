import { DashboardStatusChip } from "@/components/dashboard/table";
import { ApplicationStatus } from "@/graphql/typeUtils";
import { useState } from "react";
import type { DashboardStatusChipProps } from "@/components/dashboard/table/DashboardStatusChip";

const APPLICATION_STATUS_OPTIONS = [
  { value: ApplicationStatus.Applied, label: "Applied" },
  { value: ApplicationStatus.InReview, label: "In Review" },
  { value: ApplicationStatus.Reviewed, label: "Reviewed" },
  { value: ApplicationStatus.Selected, label: "Selected" },
  { value: ApplicationStatus.Interviewed, label: "Interviewed" },
  { value: ApplicationStatus.Offered, label: "Offered" },
  { value: ApplicationStatus.Rejected, label: "Rejected" },
] as const;

const STATUS_TONE: Record<ApplicationStatus, DashboardStatusChipProps<ApplicationStatus>["tone"]> = {
  [ApplicationStatus.Applied]: "grey",
  [ApplicationStatus.InReview]: "blue",
  [ApplicationStatus.Reviewed]: "purple",
  [ApplicationStatus.Selected]: "green",
  [ApplicationStatus.Interviewed]: "blue",
  [ApplicationStatus.Offered]: "green",
  [ApplicationStatus.Rejected]: "grey",
};

type ReviewStatusCellProps = {
  status: ApplicationStatus;
};

export const ReviewStatusCell = ({ status }: ReviewStatusCellProps) => {
  const [selectedStatus, setSelectedStatus] = useState(status);

  return (
    <DashboardStatusChip
      value={selectedStatus}
      options={APPLICATION_STATUS_OPTIONS}
      tone={STATUS_TONE[selectedStatus]}
      onChange={setSelectedStatus}
    />
  );
};
