import { useReducer, useState } from "react";

import ReviewDashboardAPIClient from "@/APIClients/ReviewDashboardAPIClient";
import type { BulkStatusApplicant, BulkStatusConfirmationDialogueProps } from "@/components/dashboard/review-dashboard/BulkStatusConfirmationDialogue";

import {
  BULK_ACTIONS,
  BULK_ACTION_SUBMIT_ERROR,
  type BulkAction,
} from "../bulkStatusActions";

enum DialogueStatus {
  Closed = "closed",
  Confirming = "confirming",
  Submitting = "submitting",
}

enum DialogueEventType {
  Open = "open",
  Cancel = "cancel",
  Submit = "submit",
  Success = "success",
  Error = "error",
}

type DialogueState =
  | { status: DialogueStatus.Closed }
  | {
      status: DialogueStatus.Confirming;
      action: BulkAction;
      applicants: BulkStatusApplicant[];
      error?: string;
    }
  | {
      status: DialogueStatus.Submitting;
      action: BulkAction;
      applicants: BulkStatusApplicant[];
    };

type DialogueEvent =
  | {
      type: DialogueEventType.Open;
      action: BulkAction;
      applicants: BulkStatusApplicant[];
    }
  | { type: DialogueEventType.Cancel }
  | { type: DialogueEventType.Submit }
  | { type: DialogueEventType.Success }
  | { type: DialogueEventType.Error; message: string };

const dialogueReducer = (
  state: DialogueState,
  event: DialogueEvent
): DialogueState => {
  switch (event.type) {
    case DialogueEventType.Open:
      return {
        status: DialogueStatus.Confirming,
        action: event.action,
        applicants: event.applicants,
      };
    case DialogueEventType.Submit:
      return state.status === DialogueStatus.Confirming
        ? {
            status: DialogueStatus.Submitting,
            action: state.action,
            applicants: state.applicants,
          }
        : state;
    case DialogueEventType.Error:
      return state.status === DialogueStatus.Submitting
        ? {
            status: DialogueStatus.Confirming,
            action: state.action,
            applicants: state.applicants,
            error: event.message,
          }
        : state;
    case DialogueEventType.Cancel:
      return state.status === DialogueStatus.Submitting
        ? state
        : { status: DialogueStatus.Closed };
    case DialogueEventType.Success:
      return { status: DialogueStatus.Closed };
    default:
      return state;
  }
};

type ToastState = { open: boolean; title: string; description: string };

const CLOSED_TOAST: ToastState = { open: false, title: "", description: "" };

export type BulkStatusDialogueProps = BulkStatusConfirmationDialogueProps & {
  open: true;
};

type UseBulkStatusActionOptions = {
  onSuccess: () => void;
};

type UseBulkStatusActionResult = {
  dialogue: BulkStatusDialogueProps | null;
  openBulkAction: (
    action: BulkAction,
    applicants: BulkStatusApplicant[]
  ) => void;
  toast: ToastState;
  dismissToast: () => void;
};

const useBulkStatusAction = ({
  onSuccess,
}: UseBulkStatusActionOptions): UseBulkStatusActionResult => {
  const [state, dispatch] = useReducer(dialogueReducer, {
    status: DialogueStatus.Closed,
  });
  const [toast, setToast] = useState<ToastState>(CLOSED_TOAST);

  const openBulkAction = (
    action: BulkAction,
    applicants: BulkStatusApplicant[]
  ) => {
    if (applicants.length === 0) return;
    dispatch({ type: DialogueEventType.Open, action, applicants });
  };

  const confirm = async () => {
    if (state.status !== DialogueStatus.Confirming) return;
    const { action, applicants } = state;
    const config = BULK_ACTIONS[action];

    dispatch({ type: DialogueEventType.Submit });
    try {
      await ReviewDashboardAPIClient.bulkUpdateApplicantRecordsStatus(
        applicants.map((applicant) => applicant.id),
        config.status
      );
      dispatch({ type: DialogueEventType.Success });
      onSuccess();
      setToast({ open: true, ...config.toast(applicants.length) });
    } catch {
      dispatch({
        type: DialogueEventType.Error,
        message: BULK_ACTION_SUBMIT_ERROR,
      });
    }
  };

  const dialogue: BulkStatusDialogueProps | null =
    state.status === DialogueStatus.Closed
      ? null
      : {
          open: true,
          header: BULK_ACTIONS[state.action].title,
          text: BULK_ACTIONS[state.action].description,
          confirmLabel: BULK_ACTIONS[state.action].confirmLabel,
          applicants: state.applicants,
          isSubmitting: state.status === DialogueStatus.Submitting,
          errorText:
            state.status === DialogueStatus.Confirming
              ? state.error
              : undefined,
          onClose: () => dispatch({ type: DialogueEventType.Cancel }),
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
