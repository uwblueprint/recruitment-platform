import {
  APPLICATION_STATUS_OPTIONS,
  DashboardStatusChip,
} from "@/components/dashboard/table";
import { ApplicationStatus } from "@/graphql/typeUtils";
import { useState } from "react";

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
