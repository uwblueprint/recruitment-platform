import { useQuery } from "@apollo/client/react";
import {
  InterviewDashboardDocument,
  type InterviewDashboardQuery,
  type InterviewDashboardQueryVariables,
  type InterviewDashboardResult,
  type InterviewDashboardSortBy,
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
  const { data, previousData, loading, error } = useQuery<
    InterviewDashboardQuery,
    InterviewDashboardQueryVariables
  >(InterviewDashboardDocument, {
    variables: { pageNumber, resultsPerPage, sortBy, sortAscending },
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });

  const rows = data?.interviewDashboard;
  const hasError = !!error || (!loading && !rows);

  return {
    rows: hasError
      ? []
      : rows ?? (loading ? previousData?.interviewDashboard : undefined) ?? [],
    isLoading: loading,
    hasError,
  };
};

export default useInterviewDashboard;
