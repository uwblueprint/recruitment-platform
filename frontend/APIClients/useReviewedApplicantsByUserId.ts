import { skipToken, useQuery } from "@apollo/client/react";
import {
  ReviewedApplicantsByUserIdDocument,
  type ReviewedApplicantsByUserIdQuery,
  type ReviewedApplicantsByUserIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useReviewedApplicantsByUserId(userId?: string) {
  const { data, loading, error } = useQuery<
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
    return { reviewedApplicants: [], isLoading: false, hasError: false };
  }

  const rows = data?.reviewedApplicantsByUserId;
  const hasError = !!error || (!loading && !rows);
  return {
    reviewedApplicants: !loading && !hasError ? rows ?? [] : [],
    isLoading: loading,
    hasError,
  };
}
