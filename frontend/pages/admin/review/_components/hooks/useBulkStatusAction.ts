import { useReducer, useRef, useState } from "react";

import useSendRejectionEmails from "@/APIClients/mutations/useSendRejectionEmails";
import useSendOfferEmails from "@/APIClients/mutations/useSendOfferEmails";
import useBulkUpdateApplicantRecordsStatus from "@/APIClients/mutations/useBulkUpdateApplicantRecordsStatus";
import type {
  BulkStatusApplicant,
  BulkStatusConfirmationDialogueProps,
} from "@/components/dashboard/review-dashboard/BulkStatusConfirmationDialogue";

import {
  BULK_ACTIONS,
  BULK_ACTION_SUBMIT_ERROR,
  BulkAction,
  FINAL_CONFIRMATION,
  pluralizeCandidates,
} from "../bulkStatusActions";

enum DialogueStatus {
  Closed = "closed",
  Confirming = "confirming",
  // "Are you sure?" step for actions that send emails.
  FinalConfirming = "finalConfirming",
  Submitting = "submitting",
}

enum DialogueEventType {
  Open = "open",
  Cancel = "cancel",
  Proceed = "proceed",
  Back = "back",
  Submit = "submit",
  Success = "success",
  Error = "error",
}

type OpenDialogueState = {
  action: BulkAction;
  applicants: BulkStatusApplicant[];
};

type DialogueState =
  | { status: DialogueStatus.Closed }
  | (OpenDialogueState & {
      status: DialogueStatus.Confirming | DialogueStatus.FinalConfirming;
      error?: string;
    })
  | (OpenDialogueState & { status: DialogueStatus.Submitting });

type DialogueEvent =
  | {
      type: DialogueEventType.Open;
      action: BulkAction;
      applicants: BulkStatusApplicant[];
    }
  | { type: DialogueEventType.Cancel }
  | { type: DialogueEventType.Proceed }
  | { type: DialogueEventType.Back }
  | { type: DialogueEventType.Submit }
  | { type: DialogueEventType.Success }
  | { type: DialogueEventType.Error; message: string };

const requiresFinalConfirmation = (action: BulkAction) => {
  const config = BULK_ACTIONS[action];
  return (
    "requiresFinalConfirmation" in config && config.requiresFinalConfirmation
  );
};

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
    case DialogueEventType.Proceed:
      return state.status === DialogueStatus.Confirming
        ? {
            status: DialogueStatus.FinalConfirming,
            action: state.action,
            applicants: state.applicants,
          }
        : state;
    case DialogueEventType.Back:
      return state.status === DialogueStatus.FinalConfirming
        ? {
            status: DialogueStatus.Confirming,
            action: state.action,
            applicants: state.applicants,
          }
        : state;
    case DialogueEventType.Submit:
      return state.status === DialogueStatus.Confirming ||
        state.status === DialogueStatus.FinalConfirming
        ? {
            status: DialogueStatus.Submitting,
            action: state.action,
            applicants: state.applicants,
          }
        : state;
    case DialogueEventType.Error:
      return state.status === DialogueStatus.Submitting
        ? {
            status: requiresFinalConfirmation(state.action)
              ? DialogueStatus.FinalConfirming
              : DialogueStatus.Confirming,
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

type ToastState = {
  open: boolean;
  title: string;
  description: string;
  severity?: "success" | "error";
};

const CLOSED_TOAST: ToastState = { open: false, title: "", description: "" };

const finalConfirmationText = (count: number) =>
  `You will not be able to undo this action once the emails are sent. Please confirm you want to select ${
    count === 1 ? "this applicant" : `these ${count} applicants`
  }.`;

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
  const { bulkUpdateApplicantRecordsStatus } =
    useBulkUpdateApplicantRecordsStatus();
  const { sendRejectionEmails } = useSendRejectionEmails();
  const { sendOfferEmails } = useSendOfferEmails();
  const [state, dispatch] = useReducer(dialogueReducer, {
    status: DialogueStatus.Closed,
  });
  const [toast, setToast] = useState<ToastState>(CLOSED_TOAST);
  const submitting = useRef(false);

  const emailSenders = {
    rejection: sendRejectionEmails,
    offer: sendOfferEmails,
  };

  const openBulkAction = (
    action: BulkAction,
    applicants: BulkStatusApplicant[]
  ) => {
    if (applicants.length === 0) return;
    dispatch({ type: DialogueEventType.Open, action, applicants });
  };

  const submit = async () => {
    if (
      (state.status !== DialogueStatus.Confirming &&
        state.status !== DialogueStatus.FinalConfirming) ||
      submitting.current
    )
      return;
    submitting.current = true;
    const { action, applicants } = state;
    const config = BULK_ACTIONS[action];
    const emailType = "emailType" in config ? config.emailType : undefined;
    const ids = applicants.map((applicant) => applicant.id);

    dispatch({ type: DialogueEventType.Submit });
    try {
      await bulkUpdateApplicantRecordsStatus(ids, config.status);
      let emailFailed = false;
      if (emailType) {
        try {
          await emailSenders[emailType](ids);
        } catch {
          emailFailed = true;
        }
      }
      dispatch({ type: DialogueEventType.Success });
      onSuccess();
      setToast(
        emailFailed
          ? {
              open: true,
              severity: "error",
              title: `Statuses updated for ${pluralizeCandidates(
                applicants.length
              )}`,
              description: `Some or all ${emailType} emails could not be confirmed. Contact an administrator before resending.`,
            }
          : { open: true, ...config.toast(applicants.length) }
      );
    } catch {
      dispatch({
        type: DialogueEventType.Error,
        message: BULK_ACTION_SUBMIT_ERROR,
      });
    } finally {
      submitting.current = false;
    }
  };

  const confirm = () => {
    if (
      state.status === DialogueStatus.Confirming &&
      requiresFinalConfirmation(state.action)
    ) {
      dispatch({ type: DialogueEventType.Proceed });
      return;
    }
    void submit();
  };

  const isSubmitting = state.status === DialogueStatus.Submitting;
  const isFinalStep =
    state.status === DialogueStatus.FinalConfirming ||
    (isSubmitting && requiresFinalConfirmation(state.action));
  const errorText =
    state.status === DialogueStatus.Confirming ||
    state.status === DialogueStatus.FinalConfirming
      ? state.error
      : undefined;

  let dialogue: BulkStatusDialogueProps | null = null;
  if (state.status !== DialogueStatus.Closed && isFinalStep) {
    dialogue = {
      open: true,
      header: FINAL_CONFIRMATION.title,
      text: finalConfirmationText(state.applicants.length),
      confirmLabel: FINAL_CONFIRMATION.confirmLabel,
      cancelLabel: FINAL_CONFIRMATION.cancelLabel,
      isSubmitting,
      errorText,
      onClose: () => dispatch({ type: DialogueEventType.Back }),
      onConfirm: confirm,
    };
  } else if (state.status !== DialogueStatus.Closed) {
    const config = BULK_ACTIONS[state.action];
    dialogue = {
      open: true,
      header: config.title,
      text: config.description,
      confirmLabel: config.confirmLabel,
      applicants: state.applicants,
      isSubmitting,
      errorText,
      onClose: () => dispatch({ type: DialogueEventType.Cancel }),
      onConfirm: confirm,
    };
  }

  return {
    dialogue,
    openBulkAction,
    toast,
    dismissToast: () => setToast((current) => ({ ...current, open: false })),
  };
};

export default useBulkStatusAction;
