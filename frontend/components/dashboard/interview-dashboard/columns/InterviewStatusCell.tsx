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
] as const;

type InterviewStatusCellProps = {
  status: ApplicationStatus;
};

export const InterviewStatusCell = ({ status }: InterviewStatusCellProps) => {
  const [selectedStatus, setSelectedStatus] = useState(status);

  return (
    <DashboardStatusChip
      value={selectedStatus}
      options={APPLICATION_STATUS_OPTIONS}
      onChange={setSelectedStatus}
    />
  );
};
