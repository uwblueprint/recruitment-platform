import { DashboardStatusChip } from "@/components/dashboard/table";
import { ApplicationStatus } from "@/graphql/typeUtils";
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
  {
    value: ApplicationStatus.Rejected,
    label: "Rejected",
    className: "bg-red-200 text-black",
  },
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
