import { useReducer, useState } from "react";

import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type { BulkStatusApplicant } from "@/components/dashboard/review-dashboard/BulkStatusConfirmationDialogue";

import {
  BULK_ACTIONS,
  BULK_ACTION_SUBMIT_ERROR,
  type BulkAction,
} from "../bulkStatusActions";

type DialogueState =
  | { status: "closed" }
  | {
      status: "confirming";
      action: BulkAction;
      applicants: BulkStatusApplicant[];
      error?: string;
    }
  | { status: "submitting"; action: BulkAction; applicants: BulkStatusApplicant[] };

type DialogueEvent =
  | { type: "open"; action: BulkAction; applicants: BulkStatusApplicant[] }
  | { type: "cancel" }
  | { type: "submit" }
  | { type: "success" }
  | { type: "error"; message: string };

const dialogueReducer = (
  state: DialogueState,
  event: DialogueEvent,
): DialogueState => {
  switch (event.type) {
    case "open":
      return {
        status: "confirming",
        action: event.action,
        applicants: event.applicants,
      };
    case "submit":
      return state.status === "confirming"
        ? {
            status: "submitting",
            action: state.action,
            applicants: state.applicants,
          }
        : state;
    case "error":
      return state.status === "submitting"
        ? {
            status: "confirming",
            action: state.action,
            applicants: state.applicants,
            error: event.message,
          }
        : state;
    case "cancel":
      return state.status === "submitting" ? state : { status: "closed" };
    case "success":
      return { status: "closed" };
    default:
      return state;
  }
};

type ToastState = { open: boolean; title: string; description: string };

const CLOSED_TOAST: ToastState = { open: false, title: "", description: "" };

export type BulkStatusDialogueProps = {
  open: true;
  title: string;
  description: string;
  applicants: BulkStatusApplicant[];
  confirmLabel: string;
  isSubmitting: boolean;
  errorText?: string;
  onClose: () => void;
  onConfirm: () => void;
};

type UseBulkStatusActionOptions = {
  onSuccess: () => void;
};

type UseBulkStatusActionResult = {
  dialogue: BulkStatusDialogueProps | null;
  openBulkAction: (action: BulkAction, applicants: BulkStatusApplicant[]) => void;
  toast: ToastState;
  dismissToast: () => void;
};

const useBulkStatusAction = ({
  onSuccess,
}: UseBulkStatusActionOptions): UseBulkStatusActionResult => {
  const [state, dispatch] = useReducer(dialogueReducer, { status: "closed" });
  const [toast, setToast] = useState<ToastState>(CLOSED_TOAST);

  const openBulkAction = (
    action: BulkAction,
    applicants: BulkStatusApplicant[],
  ) => {
    if (applicants.length === 0) return;
    dispatch({ type: "open", action, applicants });
  };

  const confirm = async () => {
    if (state.status !== "confirming") return;
    const { action, applicants } = state;
    const config = BULK_ACTIONS[action];

    dispatch({ type: "submit" });
    try {
      await ReviewDashboardAPIClient.bulkUpdateApplicantRecordsStatus(
        applicants.map((applicant) => applicant.id),
        config.status,
      );
      dispatch({ type: "success" });
      onSuccess();
      setToast({ open: true, ...config.toast(applicants.length) });
    } catch {
      dispatch({ type: "error", message: BULK_ACTION_SUBMIT_ERROR });
    }
  };

  const dialogue: BulkStatusDialogueProps | null =
    state.status === "closed"
      ? null
      : {
          open: true,
          title: BULK_ACTIONS[state.action].title,
          description: BULK_ACTIONS[state.action].description,
          confirmLabel: BULK_ACTIONS[state.action].confirmLabel,
          applicants: state.applicants,
          isSubmitting: state.status === "submitting",
          errorText: state.status === "confirming" ? state.error : undefined,
          onClose: () => dispatch({ type: "cancel" }),
          onConfirm: confirm,
        };

  return {
    dialogue,
    openBulkAction,
    toast,
    dismissToast: () => setToast((current) => ({ ...current, open: false })),
  };
};

export default useBulkStatusAction;
