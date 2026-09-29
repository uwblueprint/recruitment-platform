import { useQuery } from "@apollo/client/react";
import {
  ReviewDashboardApplicantRecordIdsDocument,
  type ReviewDashboardApplicantRecordIdsQuery,
  type ReviewDashboardApplicantRecordIdsQueryVariables,
} from "@/graphql/typeUtils";

export default function useReviewDashboardApplicantRecordIds(
  variables: ReviewDashboardApplicantRecordIdsQueryVariables
) {
  const { data, previousData, loading, error, refetch, updateQuery } = useQuery<
    ReviewDashboardApplicantRecordIdsQuery,
    ReviewDashboardApplicantRecordIdsQueryVariables
  >(ReviewDashboardApplicantRecordIdsDocument, {
    variables,
    fetchPolicy: "network-only",
    context: { refreshAuth: true },
  });
  const result = data?.reviewDashboardApplicantRecordIds;
  const queryError =
    error ??
    (!loading && !result
      ? new Error("No reviewDashboardApplicantRecordIds data returned")
      : undefined);
  return {
    data: queryError ? undefined : result,
    previousData: previousData?.reviewDashboardApplicantRecordIds,
    loading,
    error: queryError,
    refetch,
    updateQuery,
  };
}
