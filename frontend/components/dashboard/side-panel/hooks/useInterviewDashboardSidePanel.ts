import { useEffect, useState } from "react";
import InterviewDashboardAPIClient from "@/APIClients/InterviewDashboardAPIClient";
import type { InterviewDashboardSidePanelResult } from "@/graphql/typeUtils";

type UseInterviewDashboardSidePanelResult = {
  data: InterviewDashboardSidePanelResult | null;
  isLoading: boolean;
  hasError: boolean;
};

const useInterviewDashboardSidePanel = (
  applicantRecordId: string | null,
): UseInterviewDashboardSidePanelResult => {
  const [state, setState] = useState<UseInterviewDashboardSidePanelResult>({
    data: null,
    isLoading: false,
    hasError: false,
  });

  useEffect(() => {
    if (!applicantRecordId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ data: null, isLoading: false, hasError: false });
      return undefined;
    }

    let isCurrentRequest = true;

    setState({ data: null, isLoading: true, hasError: false });

    InterviewDashboardAPIClient.getInterviewDashboardSidePanel(
      applicantRecordId,
    )
      .then((data) => {
        if (isCurrentRequest) {
          setState({ data, isLoading: false, hasError: false });
        }
      })
      .catch(() => {
        if (isCurrentRequest) {
          setState({ data: null, isLoading: false, hasError: true });
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [applicantRecordId]);

  return state;
};

export default useInterviewDashboardSidePanel;
