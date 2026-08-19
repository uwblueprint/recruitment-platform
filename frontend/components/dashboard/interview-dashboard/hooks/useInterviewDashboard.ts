import { useEffect, useState } from "react";
import InterviewDashboardAPIClient from "@/APIClients/InterviewDashboardAPIClient";
import type { InterviewDashboardResult } from "@/graphql/typeUtils";

type UseInterviewDashboardResult = {
  rows: InterviewDashboardResult[];
  isLoading: boolean;
  hasError: boolean;
};

const useInterviewDashboard = (
  pageNumber: number,
  resultsPerPage: number,
): UseInterviewDashboardResult => {
  const [state, setState] = useState<UseInterviewDashboardResult>({
    rows: [],
    isLoading: false,
    hasError: false,
  });

  useEffect(() => {
    let isCurrentRequest = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      hasError: false,
    }));

    InterviewDashboardAPIClient.getInterviewDashboard(
      pageNumber,
      resultsPerPage,
    )
      .then((rows) => {
        if (isCurrentRequest) {
          setState({ rows, isLoading: false, hasError: false });
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error("useInterviewDashboard error:", e);
        if (isCurrentRequest) {
          setState({ rows: [], isLoading: false, hasError: true });
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [pageNumber, resultsPerPage]);

  return state;
};

export default useInterviewDashboard;
