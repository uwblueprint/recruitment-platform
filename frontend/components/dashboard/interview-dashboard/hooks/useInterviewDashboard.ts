import { useEffect, useState } from "react";
import InterviewDashboardAPIClient from "@/APIClients/InterviewDashboardAPIClient";
import type {
  InterviewDashboardResult,
  InterviewDashboardSortBy,
} from "@/graphql/typeUtils";

type UseInterviewDashboardResult = {
  rows: InterviewDashboardResult[];
  isLoading: boolean;
  hasError: boolean;
};

const useInterviewDashboard = (
  pageNumber: number,
  resultsPerPage: number,
  sortBy?: InterviewDashboardSortBy,
  sortAscending?: boolean,
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
      sortBy,
      sortAscending,
    )
      .then((rows) => {
        if (isCurrentRequest) {
          setState({ rows, isLoading: false, hasError: false });
        }
      })
      .catch(() => {
        if (isCurrentRequest) {
          setState({ rows: [], isLoading: false, hasError: true });
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [pageNumber, resultsPerPage, sortBy, sortAscending]);

  return state;
};

export default useInterviewDashboard;
