import { ApplicationStatus } from "@/graphql/typeUtils";

/** The two bulk operations available from the review dashboard. */
export type BulkAction = "reject" | "interview";

const pluralizeCandidates = (count: number) =>
  `${count} ${count === 1 ? "candidate" : "candidates"}`;

/**
 * Static copy + config for each bulk action: the target status, the
 * confirmation-dialogue text, and the success toast. Kept separate from the
 * hook so the workflow logic and the user-facing copy can evolve
 * independently.
 */
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
