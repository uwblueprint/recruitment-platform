import { useState } from "react";

import { ApplicationStatus } from "@/graphql/typeUtils";

import {
  APPLICATION_STATUS_OPTIONS,
  DashboardStatusChip,
} from "../table";

type SidePanelStatusSelectProps = {
  status: ApplicationStatus;
};

/**
 * Visual-only status control for the side panel. Selecting a value updates the
 * chip locally; persisting to the backend is handled in a future ticket.
 */
export const SidePanelStatusSelect = ({
  status,
}: SidePanelStatusSelectProps) => {
  const [selectedStatus, setSelectedStatus] = useState(status);

  return (
    <DashboardStatusChip
      value={selectedStatus}
      options={APPLICATION_STATUS_OPTIONS}
      onChange={setSelectedStatus}
    />
  );
};
