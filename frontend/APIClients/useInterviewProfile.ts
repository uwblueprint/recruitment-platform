import { skipToken, useQuery } from "@apollo/client/react";
import {
  ApplicationDocument,
  ReviewedApplicantRecordsByApplicantRecordIdDocument,
  type ApplicationQuery,
  type ApplicationQueryVariables,
  type ReviewedApplicantRecordsByApplicantRecordIdQuery,
  type ReviewedApplicantRecordsByApplicantRecordIdQueryVariables,
} from "@/graphql/typeUtils";

export default function useInterviewProfile(applicantRecordId?: string) {
  const options = applicantRecordId
    ? {
        variables: { applicantRecordId },
        fetchPolicy: "network-only" as const,
        context: { refreshAuth: true },
      }
    : skipToken;
  const applicationQuery = useQuery<
    ApplicationQuery,
    ApplicationQueryVariables
  >(ApplicationDocument, options);
  const reviewersQuery = useQuery<
    ReviewedApplicantRecordsByApplicantRecordIdQuery,
    ReviewedApplicantRecordsByApplicantRecordIdQueryVariables
  >(ReviewedApplicantRecordsByApplicantRecordIdDocument, options);

  const isLoading =
    !!applicantRecordId && (applicationQuery.loading || reviewersQuery.loading);
  const application = applicationQuery.data?.application;
  const record =
    reviewersQuery.data?.reviewedApplicantRecordsByApplicantRecordId;
  const hasError =
    !!applicantRecordId &&
    (!!applicationQuery.error ||
      !!reviewersQuery.error ||
      (!isLoading && (!application || !record)));
  // skipToken retains previous data; only expose a complete current profile.
  const ready = !!applicantRecordId && !isLoading && !hasError;

  return {
    application: ready ? application : undefined,
    reviewers: ready ? record?.reviewedApplicantRecords ?? [] : [],
    combinedReviewScore: ready
      ? record?.applicantRecord.combinedReviewScore ?? undefined
      : undefined,
    position: ready ? record?.applicantRecord.position ?? "" : "",
    candidateName:
      ready && application
        ? `${application.firstName} ${application.lastName}`
        : undefined,
    isLoading,
    hasError,
  };
}
