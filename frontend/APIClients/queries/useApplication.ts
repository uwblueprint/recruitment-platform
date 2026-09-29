import { skipToken, useQuery } from "@apollo/client/react";
import {
  ApplicationDocument,
  type ApplicationQuery,
  type ApplicationQueryVariables,
} from "@/graphql/typeUtils";

export default function useApplication(applicantRecordId?: string) {
  const { data, loading, error, refetch } = useQuery<
    ApplicationQuery,
    ApplicationQueryVariables
  >(
    ApplicationDocument,
    applicantRecordId
      ? {
          variables: { applicantRecordId },
          fetchPolicy: "network-only",
          context: { refreshAuth: true },
        }
      : skipToken
  );

  // skipToken retains previous data; never expose it without a current ID.
  if (!applicantRecordId) {
    return { data: undefined, loading: false, error: undefined, refetch };
  }

  const result = data?.application;
  const queryError =
    error ??
    (!loading && !result
      ? new Error("No application data returned")
      : undefined);
  return {
    data: !loading && !queryError ? result : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
