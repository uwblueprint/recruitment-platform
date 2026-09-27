import { useEffect, useState } from "react";
import InterviewAssessmentAPIClient from "@/APIClients/InterviewAssessmentAPIClient";
import type { InterviewNotesResult } from "@/graphql/typeUtils";

type UseInterviewNotesResult = {
  notes: InterviewNotesResult | null;
  isLoading: boolean;
  hasError: boolean;
};

const useInterviewNotes = (
  interviewedApplicantRecordId: string | null
): UseInterviewNotesResult => {
  const [state, setState] = useState<UseInterviewNotesResult>({
    notes: null,
    isLoading: false,
    hasError: false,
  });

  useEffect(() => {
    if (!interviewedApplicantRecordId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ notes: null, isLoading: false, hasError: false });
      return undefined;
    }

    let isCurrentRequest = true;

    setState({ notes: null, isLoading: true, hasError: false });

    InterviewAssessmentAPIClient.getInterviewNotes(interviewedApplicantRecordId)
      .then((notes) => {
        if (isCurrentRequest) {
          setState({ notes, isLoading: false, hasError: false });
        }
      })
      .catch(() => {
        if (isCurrentRequest) {
          setState({ notes: null, isLoading: false, hasError: true });
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [interviewedApplicantRecordId]);

  return state;
};

export default useInterviewNotes;
