import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewedApplicantRecordByApplicantRecordIdDocument,
  type InterviewedApplicantRecordByApplicantRecordIdQuery,
  type InterviewedApplicantRecordByApplicantRecordIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewAssessmentRecord(
  applicantRecordId?: string
) {
  const { data, loading, error, refetch } = useQuery<
    InterviewedApplicantRecordByApplicantRecordIdQuery,
    InterviewedApplicantRecordByApplicantRecordIdQueryVariables
  >(
    InterviewedApplicantRecordByApplicantRecordIdDocument,
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

  const record = data?.interviewedApplicantRecordByApplicantRecordId;
  const queryError =
    error ??
    (!loading && !record
      ? new Error("No assessment record returned")
      : undefined);
  return {
    data: !loading && !queryError ? record : undefined,
    loading,
    error: queryError,
    refetch,
  };
}
