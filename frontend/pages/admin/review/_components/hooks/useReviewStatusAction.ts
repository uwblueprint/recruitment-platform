import { useRef, useState } from "react";

import useSendRejectionEmails from "@/APIClients/useSendRejectionEmails";
import useUpdateApplicantRecordStatus from "@/APIClients/useUpdateApplicantRecordStatus";
import { ApplicationStatus } from "@/graphql/typeUtils";

type UseReviewStatusActionOptions = {
  applicantRecordId: string;
  status: ApplicationStatus;
  onChange?: (
    applicantRecordId: string,
    nextStatus: ApplicationStatus,
    previousStatus: ApplicationStatus
  ) => Promise<ApplicationStatus>;
};

const useReviewStatusAction = ({
  applicantRecordId,
  status,
  onChange,
}: UseReviewStatusActionOptions) => {
  const { updateApplicantRecordStatus } = useUpdateApplicantRecordStatus();
  const { sendRejectionEmails } = useSendRejectionEmails();
  const [localStatus, setSelectedStatus] = useState(status);
  const selectedStatus = onChange ? status : localStatus;
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string>();
  const submitting = useRef(false);

  const updateStatus = async (newStatus: ApplicationStatus) => {
    if (submitting.current) return;
    submitting.current = true;
    setIsSubmitting(true);
    setErrorText(undefined);
    try {
      const confirmedStatus = onChange
        ? await onChange(applicantRecordId, newStatus, status)
        : await updateApplicantRecordStatus(applicantRecordId, newStatus);
      setSelectedStatus(confirmedStatus);
      if (confirmedStatus === ApplicationStatus.Rejected) {
        try {
          await sendRejectionEmails([applicantRecordId]);
        } catch {
          setErrorText(
            "The applicant was marked as rejected, but email sending could not be confirmed. Contact an administrator before resending."
          );
        }
      }
      setIsConfirming(false);
    } catch {
      setErrorText("The status could not be updated. Please try again.");
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  const handleChange = (newStatus: ApplicationStatus) => {
    if (submitting.current || isConfirming || newStatus === selectedStatus)
      return;
    setErrorText(undefined);
    if (newStatus === ApplicationStatus.Rejected) {
      setIsConfirming(true);
    } else {
      void updateStatus(newStatus);
    }
  };

  return {
    selectedStatus,
    isSubmitting,
    handleChange,
    errorText: isConfirming ? undefined : errorText,
    dialogue: isConfirming
      ? {
          open: true,
          isSubmitting,
          errorText,
          onClose: () => {
            if (submitting.current) return;
            setIsConfirming(false);
            setErrorText(undefined);
          },
          onConfirm: () => {
            void updateStatus(ApplicationStatus.Rejected);
          },
        }
      : null,
  };
};

export default useReviewStatusAction;
