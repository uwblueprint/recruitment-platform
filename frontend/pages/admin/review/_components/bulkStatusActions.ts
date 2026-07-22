import { ApplicationStatus } from "@/graphql/typeUtils";

export type BulkAction = "reject" | "interview";

const pluralizeCandidates = (count: number) =>
  `${count} ${count === 1 ? "candidate" : "candidates"}`;

export const BULK_ACTIONS = {
  reject: {
    status: ApplicationStatus.Rejected,
    title: "Send rejection to candidates",
    description:
      "This action will mark the applicants listed below as rejected. Please confirm your selections.",
    confirmLabel: "Confirm rejection",
    toast: (count: number) => ({
      title: `${pluralizeCandidates(count)} marked as rejected`,
      description: "The selected application statuses have been updated.",
    }),
  },
  interview: {
    status: ApplicationStatus.Selected,
    title: "Select candidates for interview",
    description:
      "This action will move the applicants listed below into the interview dashboard. Please confirm your selections.",
    confirmLabel: "Confirm selection",
    toast: (count: number) => ({
      title: `${pluralizeCandidates(count)} selected for interviews`,
      description: "View selected candidates in the interview dashboard.",
    }),
  },
} as const;

export const BULK_ACTION_SUBMIT_ERROR =
  "The statuses could not be updated. Please try again.";
