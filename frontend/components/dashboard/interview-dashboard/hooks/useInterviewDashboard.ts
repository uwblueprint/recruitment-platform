import { useEffect, useState } from "react";
import InterviewDashboardAPIClient from "@/APIClients/InterviewDashboardAPIClient";
import type { InterviewDashboardResult } from "@/graphql/typeUtils";

type UseInterviewDashboardResult = {
  rows: InterviewDashboardResult[];
  isLoading: boolean;
  error: boolean;
};

const useInterviewDashboard = (
  pageNumber: number,
  resultsPerPage: number,
): UseInterviewDashboardResult => {
  const [state, setState] = useState<UseInterviewDashboardResult>({
    rows: [],
    isLoading: false,
    error: false,
  });

  // This mirrors the current dashboard API-client pattern. It can be cleaned up
  // when GraphQL fetching moves to Apollo hooks or a query library consistently.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, isLoading: true, error: false }));

    InterviewDashboardAPIClient.getInterviewDashboard(
      pageNumber,
      resultsPerPage,
    )
      .then((rows) => {
        setState({ rows, isLoading: false, error: false });
      })
      .catch(() => {
        setState({ rows: [], isLoading: false, error: true });
      });
  }, [pageNumber, resultsPerPage]);

  return state;
};

export default useInterviewDashboard;
