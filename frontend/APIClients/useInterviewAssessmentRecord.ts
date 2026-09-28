import { skipToken, useQuery } from "@apollo/client/react";
import {
  InterviewedApplicantRecordByApplicantRecordIdDocument,
  type InterviewedApplicantRecordByApplicantRecordIdQuery,
  type InterviewedApplicantRecordByApplicantRecordIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewAssessmentRecord(
  applicantRecordId?: string
) {
  const { data, loading, error } = useQuery<
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
    return { record: undefined, isLoading: false, hasError: false };
  }

  const record = data?.interviewedApplicantRecordByApplicantRecordId;
  const hasError = !!error || (!loading && !record);
  return {
    record: !loading && !hasError ? record : undefined,
    isLoading: loading,
    hasError,
  };
}
