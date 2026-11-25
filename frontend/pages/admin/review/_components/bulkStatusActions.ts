import { ApplicationStatus } from "@/graphql/typeUtils";

export enum BulkAction {
  Reject = "reject",
  Interview = "interview",
  // Interview dashboard actions; both ask for a second "Are you sure?" step.
  InterviewReject = "interviewReject",
  Offer = "offer",
}

export const pluralizeCandidates = (count: number) =>
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
  [BulkAction.InterviewReject]: {
    status: ApplicationStatus.Rejected,
    title: "Select applicants for rejection",
    description:
      "This action will send a rejection email to the applicants listed below. Please confirm your selections.",
    confirmLabel: "Confirm selection",
    emailType: "rejection",
    requiresFinalConfirmation: true,
    toast: (count: number) => ({
      title: `Rejection emails sent to ${pluralizeCandidates(count)}`,
      description: "The selected application statuses have been updated.",
    }),
  },
  [BulkAction.Offer]: {
    status: ApplicationStatus.Offered,
    title: "Select applicants for offer",
    description:
      "This action will send an offer email to the applicants listed below. Please confirm your selections.",
    confirmLabel: "Confirm selection",
    emailType: "offer",
    requiresFinalConfirmation: true,
    toast: (count: number) => ({
      title: `Offer emails sent to ${pluralizeCandidates(count)}`,
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

// Second step shown before actions that send emails which cannot be undone.
export const FINAL_CONFIRMATION = {
  title: "Are you sure?",
  confirmLabel: "Confirm and send",
  cancelLabel: "Go back",
};

export const BULK_ACTION_SUBMIT_ERROR =
  "The statuses could not be updated. Please try again.";
