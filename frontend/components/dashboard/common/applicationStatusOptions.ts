import { ApplicationStatus } from "@/graphql/typeUtils";

import type { DashboardStatusChipOption } from "./DashboardStatusChip";

/**
 * Shared option set for the application-status chip used across the review
 * dashboard table and side panel. Every {@link ApplicationStatus} value is
 * listed so the chip always has a matching option to render.
 */
export const APPLICATION_STATUS_OPTIONS: readonly DashboardStatusChipOption<ApplicationStatus>[] =
  [
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
      value: ApplicationStatus.Interviewed,
      label: "Interviewed",
      className: "bg-blue-100 text-black",
    },
    {
      value: ApplicationStatus.Selected,
      label: "Selected",
      className: "bg-purple-200 text-black",
    },
    {
      value: ApplicationStatus.Offered,
      label: "Offered",
      className: "bg-orange-200 text-black",
    },
    {
      value: ApplicationStatus.Rejected,
      label: "Rejected",
      className: "bg-red-200 text-black",
    },
  ];
