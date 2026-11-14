import { ApplicationStatus } from "@/graphql/typeUtils";

export enum BulkAction {
  Reject = "reject",
  Interview = "interview",
  Offer = "offer",
}

const pluralizeCandidates = (count: number) =>
  `${count} ${count === 1 ? "candidate" : "candidates"}`;

export const BULK_ACTIONS = {
  [BulkAction.Reject]: {
    status: ApplicationStatus.Rejected,
    title: "Send rejection to candidates",
    description:
      "This action will mark the applicants listed below as rejected and send them rejection emails. Please confirm your selections.",
    confirmLabel: "Confirm rejection",
    emailType: "rejection",
    toast: (count: number) => ({
      title: `${pluralizeCandidates(count)} marked as rejected`,
      description: "The selected application statuses have been updated.",
    }),
  },
  [BulkAction.Offer]: {
    status: ApplicationStatus.Offered,
    title: "Send offer to candidates",
    description:
      "This action will mark the applicants listed below as offered and send them offer emails. Please confirm your selections.",
    confirmLabel: "Confirm offer",
    emailType: "offer",
    toast: (count: number) => ({
      title: `${pluralizeCandidates(count)} marked as offered`,
      description: "The selected application statuses have been updated.",
    }),
  },
  [BulkAction.Interview]: {
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
