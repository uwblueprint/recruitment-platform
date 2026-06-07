import { DashboardStatusChip } from "@/components/dashboard/table";
import { ApplicationStatus } from "@/graphql/typeUtils";
import { useState } from "react";

const APPLICATION_STATUS_OPTIONS = [
  { value: ApplicationStatus.Applied, label: "Applied", className: "bg-neutral-100 text-neutral-700" },
  { value: ApplicationStatus.InReview, label: "In Review", className: "bg-sky text-blue" },
  { value: ApplicationStatus.Reviewed, label: "Reviewed", className: "bg-magenta-100 text-neutral-800" },
  { value: ApplicationStatus.Selected, label: "Selected", className: "bg-green-100 text-green-700" },
  { value: ApplicationStatus.Interviewed, label: "Interviewed", className: "bg-sky text-blue" },
  { value: ApplicationStatus.Offered, label: "Offered", className: "bg-green-100 text-green-700" },
  { value: ApplicationStatus.Rejected, label: "Rejected", className: "bg-neutral-100 text-neutral-700" },
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
