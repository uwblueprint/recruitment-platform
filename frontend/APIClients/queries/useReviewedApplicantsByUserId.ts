import { skipToken, useQuery } from "@apollo/client/react";
import {
  ReviewedApplicantsByUserIdDocument,
  type ReviewedApplicantsByUserIdQuery,
  type ReviewedApplicantsByUserIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useReviewedApplicantsByUserId(userId?: string) {
  const { data, loading, error, refetch } = useQuery<
    ReviewedApplicantsByUserIdQuery,
    ReviewedApplicantsByUserIdQueryVariables
  >(
    ReviewedApplicantsByUserIdDocument,
    userId
      ? {
          variables: { userId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
        }
      : skipToken
  );

  // skipToken retains previous data; never expose it without a current user.
  if (!userId) {
    return { data: undefined, loading: false, error: undefined, refetch };
  }

  const rows = data?.reviewedApplicantsByUserId;
  const queryError =
    error ??
    (!loading && !rows
      ? new Error("No reviewedApplicants data returned")
      : undefined);
  return {
    data: !loading && !queryError ? rows : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
